'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { createMilestoneSchema, idSchema } from '@/lib/validations'

export async function getMilestones(waitlistId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const idResult = idSchema.safeParse(waitlistId)
  if (!idResult.success) return []

  const { data, error } = await supabase
    .from('milestones')
    .select('*')
    .eq('waitlist_id', waitlistId)
    .order('referral_count', { ascending: true })

  if (error) return []
  return data
}

export async function createMilestone(waitlistId: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const idResult = idSchema.safeParse(waitlistId)
  if (!idResult.success) throw new Error('無効なIDです')

  const parsed = createMilestoneSchema.safeParse({
    referral_count: formData.get('referral_count'),
    reward_title: formData.get('reward_title'),
    reward_description: formData.get('reward_description'),
  })

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? 'バリデーションエラー')
  }

  const { referral_count, reward_title, reward_description } = parsed.data

  const { count } = await supabase
    .from('milestones')
    .select('*', { count: 'exact', head: true })
    .eq('waitlist_id', waitlistId)

  const { error } = await supabase
    .from('milestones')
    .insert({
      waitlist_id: waitlistId,
      referral_count,
      reward_title,
      reward_description: reward_description ?? null,
      sort_order: (count ?? 0) + 1,
    })

  if (error) throw new Error(error.message)
  revalidatePath(`/dashboard/${waitlistId}/milestones`)
}

export async function updateMilestone(milestoneId: string, waitlistId: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const mResult = idSchema.safeParse(milestoneId)
  const wResult = idSchema.safeParse(waitlistId)
  if (!mResult.success || !wResult.success) throw new Error('無効なIDです')

  const parsed = createMilestoneSchema.safeParse({
    referral_count: formData.get('referral_count'),
    reward_title: formData.get('reward_title'),
    reward_description: formData.get('reward_description'),
  })

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? 'バリデーションエラー')
  }

  const { referral_count, reward_title, reward_description } = parsed.data

  const { error } = await supabase
    .from('milestones')
    .update({ referral_count, reward_title, reward_description: reward_description ?? null })
    .eq('id', milestoneId)

  if (error) throw new Error(error.message)
  revalidatePath(`/dashboard/${waitlistId}/milestones`)
}

export async function deleteMilestone(milestoneId: string, waitlistId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const mResult = idSchema.safeParse(milestoneId)
  const wResult = idSchema.safeParse(waitlistId)
  if (!mResult.success || !wResult.success) throw new Error('無効なIDです')

  const { error } = await supabase
    .from('milestones')
    .delete()
    .eq('id', milestoneId)

  if (error) throw new Error(error.message)
  revalidatePath(`/dashboard/${waitlistId}/milestones`)
}
