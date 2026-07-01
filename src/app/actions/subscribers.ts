'use server'

import { revalidatePath } from 'next/cache'
import { createClient, createAdminClient } from '@/lib/supabase/server'

function generateReferralCode(email: string): string {
  const base = email.split('@')[0].replace(/[^a-z0-9]/gi, '').toUpperCase().slice(0, 4)
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `${base}${rand}`
}

export async function joinWaitlist(formData: FormData) {
  const slug = formData.get('slug') as string
  const email = formData.get('email') as string
  const name = formData.get('name') as string | null
  const referralCode = formData.get('ref') as string | null

  if (!email || !slug) {
    return { error: 'メールアドレスは必須です' }
  }

  // Use admin client for public signups (no auth required)
  const supabase = await createAdminClient()

  // Find waitlist by slug
  const { data: waitlist, error: wlError } = await supabase
    .from('waitlists')
    .select('id, settings')
    .eq('slug', slug)
    .single()

  if (wlError || !waitlist) {
    return { error: 'ウェイトリストが見つかりません' }
  }

  // Check for duplicate
  const { data: existing } = await supabase
    .from('subscribers')
    .select('id, referral_code, position')
    .eq('waitlist_id', waitlist.id)
    .eq('email', email)
    .maybeSingle()

  if (existing) {
    return { success: true, referralCode: existing.referral_code, position: existing.position, alreadyRegistered: true }
  }

  // Find referrer
  let referrerId: string | null = null
  if (referralCode) {
    const { data: referrer } = await supabase
      .from('subscribers')
      .select('id')
      .eq('referral_code', referralCode)
      .eq('waitlist_id', waitlist.id)
      .maybeSingle()
    if (referrer) referrerId = referrer.id
  }

  // Get current max position
  const { data: positionData } = await supabase
    .from('subscribers')
    .select('position')
    .eq('waitlist_id', waitlist.id)
    .order('position', { ascending: false })
    .limit(1)
    .maybeSingle()

  const position = (positionData?.position ?? 0) + 1

  // Generate unique referral code
  let newReferralCode = generateReferralCode(email)
  let codeAttempt = 0
  while (true) {
    const { data: codeCheck } = await supabase
      .from('subscribers')
      .select('id')
      .eq('referral_code', newReferralCode)
      .maybeSingle()
    if (!codeCheck) break
    codeAttempt++
    newReferralCode = generateReferralCode(email) + codeAttempt
  }

  // Insert subscriber
  const { data: subscriber, error: subError } = await supabase
    .from('subscribers')
    .insert({
      waitlist_id: waitlist.id,
      email,
      name: name || null,
      referral_code: newReferralCode,
      referred_by: referrerId,
      position,
    })
    .select()
    .single()

  if (subError) return { error: '登録に失敗しました。もう一度お試しください。' }

  // Log signup event
  await supabase.from('waitlist_events').insert({
    waitlist_id: waitlist.id,
    event_type: 'signup',
    subscriber_id: subscriber.id,
  })

  // If referred, increment referrer's count and log referral event
  if (referrerId) {
    await supabase.rpc('increment_referral_count', { subscriber_id: referrerId })
    await supabase.from('waitlist_events').insert({
      waitlist_id: waitlist.id,
      event_type: 'referral',
      subscriber_id: referrerId,
      metadata: { new_subscriber_id: subscriber.id },
    })
  }

  return { success: true, referralCode: newReferralCode, position, alreadyRegistered: false }
}

export async function getSubscribers(waitlistId: string, page = 1, pageSize = 50) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: [], count: 0 }

  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  const { data, error, count } = await supabase
    .from('subscribers')
    .select('*', { count: 'exact' })
    .eq('waitlist_id', waitlistId)
    .order('position', { ascending: true })
    .range(from, to)

  if (error) return { data: [], count: 0 }
  return { data: data ?? [], count: count ?? 0 }
}

export async function deleteSubscriber(waitlistId: string, subscriberId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: '認証が必要です' }

  const { error } = await supabase
    .from('subscribers')
    .delete()
    .eq('id', subscriberId)
    .eq('waitlist_id', waitlistId)

  if (error) return { error: error.message }

  revalidatePath(`/dashboard/${waitlistId}`)
  return { success: true }
}

export async function getSubscriberStatus(slug: string, referralCode: string) {
  const supabase = await createAdminClient()

  const { data: waitlist } = await supabase
    .from('waitlists')
    .select('id, name, settings')
    .eq('slug', slug)
    .single()

  if (!waitlist) return null

  const { data: subscriber } = await supabase
    .from('subscribers')
    .select('*')
    .eq('referral_code', referralCode)
    .eq('waitlist_id', waitlist.id)
    .single()

  if (!subscriber) return null

  const { count: totalCount } = await supabase
    .from('subscribers')
    .select('*', { count: 'exact', head: true })
    .eq('waitlist_id', waitlist.id)

  const { data: milestones } = await supabase
    .from('milestones')
    .select('*')
    .eq('waitlist_id', waitlist.id)
    .order('referral_count', { ascending: true })

  return {
    subscriber,
    waitlist,
    totalSubscribers: totalCount ?? 0,
    milestones: milestones ?? [],
  }
}
