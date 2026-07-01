import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getSubscriberStatus } from '@/app/actions/subscribers'
import { CopyReferralButton } from '@/components/waitlist/copy-referral-button'

interface Props {
  params: Promise<{ slug: string; referralCode: string }>
}

export default async function SubscriberStatusPage({ params }: Props) {
  const { slug, referralCode } = await params
  const status = await getSubscriberStatus(slug, referralCode)
  if (!status) notFound()

  const { subscriber, waitlist, totalSubscribers, milestones } = status
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://your-app.vercel.app'
  const referralUrl = `${appUrl}/w/${slug}?ref=${referralCode}`

  const nextMilestone = milestones.find((m) => m.referral_count > subscriber.referral_count)
  const toNextMilestone = nextMilestone
    ? nextMilestone.referral_count - subscriber.referral_count
    : null

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <p className="text-xs text-zinc-400 uppercase tracking-widest mb-1">{waitlist.name}</p>
          <h1 className="text-2xl font-bold text-zinc-900">登録完了！</h1>
          <p className="text-zinc-500 mt-2 text-sm">
            {subscriber.name ? `${subscriber.name}さん、` : ''}ウェイトリストに登録されました。
          </p>
        </div>

        <div className="bg-white border border-zinc-200 rounded-xl p-5 text-center">
          <p className="text-xs text-zinc-400 mb-1">現在の順位</p>
          <p className="text-5xl font-bold text-zinc-900 font-mono">#{subscriber.position}</p>
          <p className="text-xs text-zinc-400 mt-1">全{totalSubscribers.toLocaleString()}人中</p>
        </div>

        <div className="bg-white border border-zinc-200 rounded-xl p-5 space-y-3">
          <div>
            <p className="text-xs font-medium text-zinc-700 mb-1">あなたの紹介リンク</p>
            <p className="text-xs text-zinc-400">友達が登録すると順位が上がります</p>
          </div>
          <div className="bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 flex items-center justify-between gap-2">
            <span className="text-xs text-zinc-600 font-mono truncate">{referralUrl}</span>
            <CopyReferralButton url={referralUrl} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`${waitlist.name} のウェイトリストに登録しました。あなたも参加しませんか？`)}&url=${encodeURIComponent(referralUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-center text-xs bg-zinc-900 text-white rounded-lg px-3 py-2 hover:bg-zinc-700 transition-colors"
            >
              X でシェア
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-center text-xs bg-blue-600 text-white rounded-lg px-3 py-2 hover:bg-blue-700 transition-colors"
            >
              Facebook でシェア
            </a>
          </div>
        </div>

        <div className="bg-white border border-zinc-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-medium text-zinc-700">紹介実績</p>
            <span className="text-lg font-bold font-mono text-zinc-900">{subscriber.referral_count}人</span>
          </div>

          {milestones.length > 0 && (
            <div className="space-y-2">
              {milestones.map((m) => {
                const achieved = subscriber.referral_count >= m.referral_count
                return (
                  <div
                    key={m.id}
                    className={`flex items-center gap-3 p-2 rounded-lg ${
                      achieved ? 'bg-zinc-50' : 'opacity-40'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                      achieved ? 'bg-zinc-900 text-white' : 'border border-zinc-300'
                    }`}>
                      {achieved && <span className="text-xs">✓</span>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-zinc-800 truncate">{m.reward_title}</p>
                      <p className="text-xs text-zinc-400">{m.referral_count}人紹介で解放</p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {toNextMilestone !== null && (
            <p className="text-xs text-zinc-400 mt-3 text-center">
              次の報酬まであと <strong className="text-zinc-700">{toNextMilestone}人</strong>
            </p>
          )}
        </div>

        <div className="text-center">
          <Link href={`/w/${slug}`} className="text-xs text-zinc-400 hover:text-zinc-600">
            ランディングページに戻る
          </Link>
        </div>
      </div>
    </div>
  )
}
