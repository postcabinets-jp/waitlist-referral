import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/server'
import { SignupForm } from '@/components/waitlist/signup-form'
import type { WaitlistSettings } from '@/types/database'

interface Props {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ ref?: string }>
}

export default async function EmbedFormPage({ params, searchParams }: Props) {
  const { slug } = await params
  const { ref } = await searchParams

  const supabase = await createAdminClient()
  const { data: waitlist } = await supabase
    .from('waitlists')
    .select('id, name, slug, settings')
    .eq('slug', slug)
    .single()

  if (!waitlist) notFound()

  return (
    <div className="p-4 font-sans">
      <SignupForm
        slug={waitlist.slug}
        referralCode={ref ?? null}
        buttonText="登録"
        placeholder="your@email.com"
      />
    </div>
  )
}
