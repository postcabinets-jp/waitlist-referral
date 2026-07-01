import { notFound } from 'next/navigation'
import { getWaitlist } from '@/app/actions/waitlists'
import { getMilestones } from '@/app/actions/milestones'
import { MilestonesManager } from '@/components/dashboard/milestones-manager'

interface Props {
  params: Promise<{ waitlistId: string }>
}

export default async function MilestonesPage({ params }: Props) {
  const { waitlistId } = await params
  const waitlist = await getWaitlist(waitlistId)
  if (!waitlist) notFound()

  const milestones = await getMilestones(waitlistId)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-medium text-zinc-700">マイルストーン報酬</h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            指定数の紹介を達成した登録者に報酬を設定できます
          </p>
        </div>
      </div>
      <MilestonesManager waitlistId={waitlistId} initialMilestones={milestones} />
    </div>
  )
}
