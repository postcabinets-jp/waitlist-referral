import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/server'
import { WaitlistPageMinimal } from '@/components/waitlist/waitlist-page-minimal'
import { WaitlistPageGradient } from '@/components/waitlist/waitlist-page-gradient'
import { WaitlistPageDark } from '@/components/waitlist/waitlist-page-dark'
import type { WaitlistSettings } from '@/types/database'

interface Props {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ ref?: string }>
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const supabase = await createAdminClient()
  const { data } = await supabase.from('waitlists').select('name, description').eq('slug', slug).single()
  if (!data) return {}
  return { title: data.name, description: data.description }
}

export default async function WaitlistPublicPage({ params, searchParams }: Props) {
  const { slug } = await params
  const { ref } = await searchParams

  const supabase = await createAdminClient()
  const { data: waitlist } = await supabase
    .from('waitlists')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!waitlist) notFound()

  const { count: subscriberCount } = await supabase
    .from('subscribers')
    .select('*', { count: 'exact', head: true })
    .eq('waitlist_id', waitlist.id)

  const { data: milestones } = await supabase
    .from('milestones')
    .select('*')
    .eq('waitlist_id', waitlist.id)
    .order('referral_count', { ascending: true })

  const settings = waitlist.settings as unknown as WaitlistSettings
  const props = {
    waitlist,
    subscriberCount: subscriberCount ?? 0,
    milestones: milestones ?? [],
    referralCode: ref ?? null,
    settings,
  }

  if (waitlist.template === 'gradient') return <WaitlistPageGradient {...props} />
  if (waitlist.template === 'dark') return <WaitlistPageDark {...props} />
  return <WaitlistPageMinimal {...props} />
}
