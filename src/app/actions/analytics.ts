'use server'

import { createClient } from '@/lib/supabase/server'

export async function getAnalytics(waitlistId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  // Total subscribers
  const { count: totalSubscribers } = await supabase
    .from('subscribers')
    .select('*', { count: 'exact', head: true })
    .eq('waitlist_id', waitlistId)

  // Total referrals (subscribers who were referred)
  const { count: totalReferrals } = await supabase
    .from('subscribers')
    .select('*', { count: 'exact', head: true })
    .eq('waitlist_id', waitlistId)
    .not('referred_by', 'is', null)

  // Daily signups for last 14 days
  const { data: events } = await supabase
    .from('waitlist_events')
    .select('event_type, created_at')
    .eq('waitlist_id', waitlistId)
    .in('event_type', ['signup', 'referral'])
    .gte('created_at', new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString())
    .order('created_at', { ascending: true })

  // Top referrers
  const { data: topReferrers } = await supabase
    .from('subscribers')
    .select('id, name, email, referral_count, position')
    .eq('waitlist_id', waitlistId)
    .gt('referral_count', 0)
    .order('referral_count', { ascending: false })
    .limit(10)

  // Group events by day
  const dailyMap = new Map<string, { signups: number; referrals: number }>()
  for (let i = 13; i >= 0; i--) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
    const key = d.toISOString().split('T')[0]
    dailyMap.set(key, { signups: 0, referrals: 0 })
  }

  for (const event of events ?? []) {
    const key = event.created_at.split('T')[0]
    const existing = dailyMap.get(key) ?? { signups: 0, referrals: 0 }
    if (event.event_type === 'signup') existing.signups++
    if (event.event_type === 'referral') existing.referrals++
    dailyMap.set(key, existing)
  }

  const dailyData = Array.from(dailyMap.entries()).map(([date, counts]) => ({
    date,
    ...counts,
  }))

  const referralRate = totalSubscribers
    ? Math.round(((totalReferrals ?? 0) / totalSubscribers) * 100)
    : 0

  return {
    totalSubscribers: totalSubscribers ?? 0,
    totalReferrals: totalReferrals ?? 0,
    referralRate,
    dailyData,
    topReferrers: topReferrers ?? [],
  }
}
