-- ============================================================
-- Waitlist Referral — Initial Schema
-- ============================================================

-- -------------------------------------------------------
-- Profiles (extends auth.users)
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_own" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles_insert_own" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- -------------------------------------------------------
-- Waitlists
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.waitlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  logo_url TEXT,
  template TEXT DEFAULT 'minimal' CHECK (template IN ('minimal', 'gradient', 'dark')),
  settings JSONB DEFAULT '{"welcomeEmail": true, "referralEnabled": true}'::jsonb NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE public.waitlists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "waitlists_owner_all" ON public.waitlists
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER waitlists_updated_at
  BEFORE UPDATE ON public.waitlists
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at();

-- -------------------------------------------------------
-- Subscribers
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  waitlist_id UUID REFERENCES public.waitlists(id) ON DELETE CASCADE NOT NULL,
  email TEXT NOT NULL,
  name TEXT,
  referral_code TEXT UNIQUE NOT NULL,
  referred_by UUID REFERENCES public.subscribers(id) ON DELETE SET NULL,
  referral_count INTEGER DEFAULT 0 NOT NULL,
  position INTEGER NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb NOT NULL,
  subscribed_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  CONSTRAINT subscribers_unique_email_per_waitlist UNIQUE (waitlist_id, email)
);

ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- Owners can read/write all subscribers for their waitlists
CREATE POLICY "subscribers_owner_all" ON public.subscribers
  FOR ALL USING (
    waitlist_id IN (SELECT id FROM public.waitlists WHERE user_id = auth.uid())
  )
  WITH CHECK (
    waitlist_id IN (SELECT id FROM public.waitlists WHERE user_id = auth.uid())
  );

-- Public read for status page (by referral code or email lookup via API)
-- Handled server-side with service role; no anon SELECT policy needed here

-- -------------------------------------------------------
-- Milestones
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  waitlist_id UUID REFERENCES public.waitlists(id) ON DELETE CASCADE NOT NULL,
  referral_count INTEGER NOT NULL,
  reward_title TEXT NOT NULL,
  reward_description TEXT,
  sort_order INTEGER DEFAULT 0 NOT NULL
);

ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "milestones_owner_all" ON public.milestones
  FOR ALL USING (
    waitlist_id IN (SELECT id FROM public.waitlists WHERE user_id = auth.uid())
  )
  WITH CHECK (
    waitlist_id IN (SELECT id FROM public.waitlists WHERE user_id = auth.uid())
  );

-- -------------------------------------------------------
-- Waitlist Events (analytics)
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.waitlist_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  waitlist_id UUID REFERENCES public.waitlists(id) ON DELETE CASCADE NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('signup', 'referral', 'milestone_reached')),
  subscriber_id UUID REFERENCES public.subscribers(id) ON DELETE SET NULL,
  metadata JSONB DEFAULT '{}'::jsonb NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE public.waitlist_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "events_owner_select" ON public.waitlist_events
  FOR SELECT USING (
    waitlist_id IN (SELECT id FROM public.waitlists WHERE user_id = auth.uid())
  );

CREATE POLICY "events_insert_service" ON public.waitlist_events
  FOR INSERT WITH CHECK (true); -- insert via service role only

-- -------------------------------------------------------
-- Indexes
-- -------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_waitlists_user_id ON public.waitlists(user_id);
CREATE INDEX IF NOT EXISTS idx_waitlists_slug ON public.waitlists(slug);
CREATE INDEX IF NOT EXISTS idx_subscribers_waitlist_id ON public.subscribers(waitlist_id);
CREATE INDEX IF NOT EXISTS idx_subscribers_referral_code ON public.subscribers(referral_code);
CREATE INDEX IF NOT EXISTS idx_subscribers_referred_by ON public.subscribers(referred_by);
CREATE INDEX IF NOT EXISTS idx_waitlist_events_waitlist_id ON public.waitlist_events(waitlist_id);
CREATE INDEX IF NOT EXISTS idx_waitlist_events_created_at ON public.waitlist_events(created_at);
