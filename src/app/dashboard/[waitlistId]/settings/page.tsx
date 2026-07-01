import { notFound } from 'next/navigation'
import { getWaitlist } from '@/app/actions/waitlists'
import { SettingsForm } from '@/components/dashboard/settings-form'

interface Props {
  params: Promise<{ waitlistId: string }>
}

export default async function SettingsPage({ params }: Props) {
  const { waitlistId } = await params
  const waitlist = await getWaitlist(waitlistId)
  if (!waitlist) notFound()

  return (
    <div className="space-y-4 max-w-lg">
      <h2 className="text-sm font-medium text-zinc-700">プロジェクト設定</h2>
      <SettingsForm waitlist={waitlist} />
    </div>
  )
}
