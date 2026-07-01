-- RPC: increment_referral_count
-- Called server-side (admin client) when a new referral is made
CREATE OR REPLACE FUNCTION public.increment_referral_count(subscriber_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.subscribers
  SET referral_count = referral_count + 1
  WHERE id = subscriber_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
