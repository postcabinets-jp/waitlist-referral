'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { Waitlist } from '@/types/database'

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 50)
}

export async function createWaitlist(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const name = formData.get('name') as string
  const description = formData.get('description') as string | null
  const template = (formData.get('template') ?? 'minimal') as Waitlist['template']

  const baseSlug = generateSlug(name)
  let slug = baseSlug
  let attempt = 0

  // Ensure unique slug
  while (true) {
    const { data } = await supabase
      .from('waitlists')
      .select('id')
      .eq('slug', slug)
      .maybeSingle()

    if (!data) break
    attempt++
    slug = `${baseSlug}-${attempt}`
  }

  const { data, error } = await supabase
    .from('waitlists')
    .insert({
      user_id: user.id,
      name,
      slug,
      description: description || null,
      template,
    })
    .select()
    .single()

  if (error) throw new Error(error.message)

  revalidatePath('/dashboard')
  redirect(`/dashboard/${data.id}`)
}

export async function updateWaitlist(waitlistId: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const updates: Partial<Waitlist> = {}
  const name = formData.get('name') as string | null
  const description = formData.get('description') as string | null
  const template = formData.get('template') as Waitlist['template'] | null
  const settingsRaw = formData.get('settings') as string | null

  if (name) updates.name = name
  if (description !== null) updates.description = description || null
  if (template) updates.template = template
  if (settingsRaw) updates.settings = JSON.parse(settingsRaw)

  const { error } = await supabase
    .from('waitlists')
    .update(updates)
    .eq('id', waitlistId)
    .eq('user_id', user.id)

  if (error) throw new Error(error.message)

  revalidatePath(`/dashboard/${waitlistId}`)
  revalidatePath(`/dashboard/${waitlistId}/settings`)
}

export async function deleteWaitlist(waitlistId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { error } = await supabase
    .from('waitlists')
    .delete()
    .eq('id', waitlistId)
    .eq('user_id', user.id)

  if (error) throw new Error(error.message)

  revalidatePath('/dashboard')
  redirect('/dashboard')
}

export async function getWaitlists() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('waitlists')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) return []
  return data
}

export async function getWaitlist(waitlistId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data, error } = await supabase
    .from('waitlists')
    .select('*')
    .eq('id', waitlistId)
    .eq('user_id', user.id)
    .single()

  if (error) return null
  return data
}
