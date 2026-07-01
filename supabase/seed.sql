-- ============================================================
-- Seed Data — Realistic sample data for waitlist-referral
-- ============================================================
-- NOTE: Run AFTER deploying migrations.
-- Uses test user IDs — replace with real auth.users IDs from your project.
-- ============================================================

-- Insert test users into auth.users (only works in local dev / seeding)
-- In production, users register via the app. These are example waitlists.

-- -------------------------------------------------------
-- Sample Waitlist 1: Developer tool launch
-- -------------------------------------------------------
-- Assumes a user with id '00000000-0000-0000-0000-000000000001' exists

INSERT INTO public.waitlists (id, user_id, name, slug, description, template, settings)
VALUES
  (
    'wl-00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'DevPulse',
    'devpulse',
    'The AI-powered code review tool that catches bugs before they reach production.',
    'dark',
    '{"welcomeEmail": true, "referralEnabled": true, "customMessage": "You are on the list! Share your link to move up."}'::jsonb
  ),
  (
    'wl-00000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000001',
    'Flowmatic',
    'flowmatic',
    'No-code workflow automation for operations teams. Zapier, but actually affordable.',
    'gradient',
    '{"welcomeEmail": true, "referralEnabled": true}'::jsonb
  );

-- -------------------------------------------------------
-- Subscribers for DevPulse
-- -------------------------------------------------------
INSERT INTO public.subscribers (id, waitlist_id, email, name, referral_code, referred_by, referral_count, position)
VALUES
  ('sub-001', 'wl-00000000-0000-0000-0000-000000000001', 'sarah.chen@gmail.com',     'Sarah Chen',     'SARAH2XK', NULL,      5, 1),
  ('sub-002', 'wl-00000000-0000-0000-0000-000000000001', 'marcus.okafor@outlook.com', 'Marcus Okafor',  'MARC88YQ', NULL,      3, 2),
  ('sub-003', 'wl-00000000-0000-0000-0000-000000000001', 'priya.nair@icloud.com',     'Priya Nair',     'PRIY44TZ', 'sub-001', 0, 3),
  ('sub-004', 'wl-00000000-0000-0000-0000-000000000001', 'james.whitfield@proton.me', 'James Whitfield', 'JAME91PL', 'sub-001', 0, 4),
  ('sub-005', 'wl-00000000-0000-0000-0000-000000000001', 'lena.mueller@fastmail.com', 'Lena Müller',    'LENA37BV', 'sub-002', 1, 5),
  ('sub-006', 'wl-00000000-0000-0000-0000-000000000001', 'taro.yamamoto@gmail.com',   'Taro Yamamoto',  'TARO55KN', 'sub-001', 0, 6),
  ('sub-007', 'wl-00000000-0000-0000-0000-000000000001', 'olu.adeyemi@yahoo.com',     'Olu Adeyemi',    'OLUA22XQ', 'sub-002', 0, 7),
  ('sub-008', 'wl-00000000-0000-0000-0000-000000000001', 'camille.dupont@free.fr',    'Camille Dupont', 'CAMI67WM', 'sub-001', 0, 8),
  ('sub-009', 'wl-00000000-0000-0000-0000-000000000001', 'arjun.sharma@hotmail.com',  'Arjun Sharma',   'ARJN14FD', 'sub-002', 0, 9),
  ('sub-010', 'wl-00000000-0000-0000-0000-000000000001', 'nina.kozlov@gmail.com',     'Nina Kozlov',    'NINA99JT', 'sub-005', 0, 10);

-- -------------------------------------------------------
-- Milestones for DevPulse
-- -------------------------------------------------------
INSERT INTO public.milestones (waitlist_id, referral_count, reward_title, reward_description, sort_order)
VALUES
  ('wl-00000000-0000-0000-0000-000000000001', 3, 'Early Adopter Badge',    '3ヶ月分のProプランが無料。将来の価格に永続的に固定。', 1),
  ('wl-00000000-0000-0000-0000-000000000001', 10, 'Founding Member Status', '創業メンバーとして製品開発に参加。月1回のロードマップ共有ミーティング。', 2),
  ('wl-00000000-0000-0000-0000-000000000001', 25, 'Enterprise Preview',     '限定先行アクセス。エンタープライズ機能を無料で1年間使用。', 3);

-- -------------------------------------------------------
-- Events for DevPulse
-- -------------------------------------------------------
INSERT INTO public.waitlist_events (waitlist_id, event_type, subscriber_id, created_at)
VALUES
  ('wl-00000000-0000-0000-0000-000000000001', 'signup', 'sub-001', now() - INTERVAL '7 days'),
  ('wl-00000000-0000-0000-0000-000000000001', 'signup', 'sub-002', now() - INTERVAL '6 days'),
  ('wl-00000000-0000-0000-0000-000000000001', 'signup', 'sub-003', now() - INTERVAL '6 days'),
  ('wl-00000000-0000-0000-0000-000000000001', 'referral', 'sub-003', now() - INTERVAL '6 days'),
  ('wl-00000000-0000-0000-0000-000000000001', 'signup', 'sub-004', now() - INTERVAL '5 days'),
  ('wl-00000000-0000-0000-0000-000000000001', 'referral', 'sub-004', now() - INTERVAL '5 days'),
  ('wl-00000000-0000-0000-0000-000000000001', 'signup', 'sub-005', now() - INTERVAL '4 days'),
  ('wl-00000000-0000-0000-0000-000000000001', 'referral', 'sub-005', now() - INTERVAL '4 days'),
  ('wl-00000000-0000-0000-0000-000000000001', 'signup', 'sub-006', now() - INTERVAL '4 days'),
  ('wl-00000000-0000-0000-0000-000000000001', 'referral', 'sub-006', now() - INTERVAL '4 days'),
  ('wl-00000000-0000-0000-0000-000000000001', 'signup', 'sub-007', now() - INTERVAL '3 days'),
  ('wl-00000000-0000-0000-0000-000000000001', 'referral', 'sub-007', now() - INTERVAL '3 days'),
  ('wl-00000000-0000-0000-0000-000000000001', 'signup', 'sub-008', now() - INTERVAL '2 days'),
  ('wl-00000000-0000-0000-0000-000000000001', 'referral', 'sub-008', now() - INTERVAL '2 days'),
  ('wl-00000000-0000-0000-0000-000000000001', 'signup', 'sub-009', now() - INTERVAL '1 day'),
  ('wl-00000000-0000-0000-0000-000000000001', 'referral', 'sub-009', now() - INTERVAL '1 day'),
  ('wl-00000000-0000-0000-0000-000000000001', 'signup', 'sub-010', now() - INTERVAL '6 hours'),
  ('wl-00000000-0000-0000-0000-000000000001', 'milestone_reached', NULL, now() - INTERVAL '5 days');
