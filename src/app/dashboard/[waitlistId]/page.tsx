import { notFound } from 'next/navigation'
import { getWaitlist } from '@/app/actions/waitlists'
import { getSubscribers } from '@/app/actions/subscribers'
import { SubscribersTable } from '@/components/dashboard/subscribers-table'
import { ExportButton } from '@/components/dashboard/export-button'
import { createClient } from '@/lib/supabase/server'

interface Props {
  params: Promise<{ waitlistId: string }>
  searchParams: Promise<{ page?: string }>
}

export default async function SubscribersPage({ params, searchParams }: Props) {
  const { waitlistId } = await params
  const { page: pageStr } = await searchParams
  const page = parseInt(pageStr ?? '1', 10)

  const waitlist = await getWaitlist(waitlistId)
  if (!waitlist) notFound()

  const { data: subscribers, count } = await getSubscribers(waitlistId, page)

  const supabase = await createClient()
  const { count: referredCount } = await supabase
    .from('subscribers')
    .select('*', { count: 'exact', head: true })
    .eq('waitlist_id', waitlistId)
    .not('referred_by', 'is', null)

  const referralRate = count ? Math.round(((referredCount ?? 0) / count) * 100) : 0

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <StatCard label="総登録者数" value={count?.toLocaleString() ?? '0'} />
        <StatCard label="紹介経由" value={(referredCount ?? 0).toLocaleString()} />
        <StatCard label="紹介率" value={`${referralRate}%`} />
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-zinc-700">登録者一覧</h2>
        <ExportButton waitlistId={waitlistId} waitlistName={waitlist.name} />
      </div>

      <SubscribersTable
        subscribers={subscribers}
        waitlistId={waitlistId}
        totalCount={count ?? 0}
        currentPage={page}
        slug={waitlist.slug}
      />
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white border border-zinc-200 rounded-lg p-4">
      <p className="text-xs text-zinc-500">{label}</p>
      <p className="text-2xl font-bold text-zinc-900 mt-1 font-mono">{value}</p>
    </div>
  )
}
