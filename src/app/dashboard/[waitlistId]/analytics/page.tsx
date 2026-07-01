import { notFound } from 'next/navigation'
import { getWaitlist } from '@/app/actions/waitlists'
import { getAnalytics } from '@/app/actions/analytics'
import { AnalyticsChart } from '@/components/dashboard/analytics-chart'

interface Props {
  params: Promise<{ waitlistId: string }>
}

export default async function AnalyticsPage({ params }: Props) {
  const { waitlistId } = await params
  const waitlist = await getWaitlist(waitlistId)
  if (!waitlist) notFound()

  const analytics = await getAnalytics(waitlistId)
  if (!analytics) notFound()

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-3">
        <StatCard label="総登録者数" value={analytics.totalSubscribers.toLocaleString()} />
        <StatCard label="紹介経由" value={analytics.totalReferrals.toLocaleString()} />
        <StatCard label="紹介率" value={`${analytics.referralRate}%`} />
      </div>

      <div className="bg-white border border-zinc-200 rounded-lg p-5">
        <h3 className="text-sm font-medium text-zinc-700 mb-4">過去14日間の登録推移</h3>
        <AnalyticsChart data={analytics.dailyData} />
      </div>

      {analytics.topReferrers.length > 0 && (
        <div className="bg-white border border-zinc-200 rounded-lg p-5">
          <h3 className="text-sm font-medium text-zinc-700 mb-4">トップ紹介者</h3>
          <div className="space-y-2">
            {analytics.topReferrers.map((ref, i) => (
              <div key={ref.id} className="flex items-center justify-between py-2 border-b border-zinc-100 last:border-0">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-zinc-400 font-mono w-4">{i + 1}</span>
                  <div>
                    {ref.name && <p className="text-sm font-medium text-zinc-800">{ref.name}</p>}
                    <p className={ref.name ? 'text-xs text-zinc-400' : 'text-sm text-zinc-700'}>{ref.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold font-mono text-zinc-900">{ref.referral_count}</p>
                  <p className="text-xs text-zinc-400">紹介</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
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
