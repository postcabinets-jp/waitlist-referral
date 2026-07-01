'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function getMilestones(waitlistId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

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

  const referral_count = parseInt(formData.get('referral_count') as string, 10)
  const reward_title = formData.get('reward_title') as string
  const reward_description = formData.get('reward_description') as string | null

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
      reward_description: reward_description || null,
      sort_order: (count ?? 0) + 1,
    })

  if (error) throw new Error(error.message)
  revalidatePath(`/dashboard/${waitlistId}/milestones`)
}

export async function updateMilestone(milestoneId: string, waitlistId: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const referral_count = parseInt(formData.get('referral_count') as string, 10)
  const reward_title = formData.get('reward_title') as string
  const reward_description = formData.get('reward_description') as string | null

  const { error } = await supabase
    .from('milestones')
    .update({ referral_count, reward_title, reward_description: reward_description || null })
    .eq('id', milestoneId)

  if (error) throw new Error(error.message)
  revalidatePath(`/dashboard/${waitlistId}/milestones`)
}

export async function deleteMilestone(milestoneId: string, waitlistId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { error } = await supabase
    .from('milestones')
    .delete()
    .eq('id', milestoneId)

  if (error) throw new Error(error.message)
  revalidatePath(`/dashboard/${waitlistId}/milestones`)
}
