import { SignupForm } from './signup-form'
import type { Waitlist, Milestone, WaitlistSettings } from '@/types/database'

interface Props {
  waitlist: Waitlist
  subscriberCount: number
  milestones: Milestone[]
  referralCode: string | null
  settings: WaitlistSettings
}

export function WaitlistPageGradient({ waitlist, subscriberCount, milestones, referralCode, settings }: Props) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex flex-col">
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          {waitlist.logo_url && (
            <img src={waitlist.logo_url} alt={waitlist.name} className="h-10 mb-8" />
          )}

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{waitlist.name}</h1>
            {waitlist.description && (
              <p className="text-slate-600 mt-3 text-base leading-relaxed">{waitlist.description}</p>
            )}
          </div>

          {subscriberCount > 0 && (
            <div className="flex items-center gap-2 mb-5">
              <div className="flex -space-x-1">
                {[...Array(Math.min(3, subscriberCount))].map((_, i) => (
                  <div key={i} className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-400 to-cyan-400 border-2 border-white" />
                ))}
              </div>
              <span className="text-sm text-slate-500">
                {subscriberCount.toLocaleString()}人が待機中
              </span>
            </div>
          )}

          <div className="bg-white/60 backdrop-blur border border-white rounded-xl p-5 shadow-sm">
            <SignupForm
              slug={waitlist.slug}
              referralCode={referralCode}
              buttonText="リストに参加"
              placeholder="メールアドレスを入力"
            />
          </div>

          {milestones.length > 0 && (
            <div className="mt-8 space-y-2">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">紹介報酬</p>
              {milestones.map((m) => (
                <div key={m.id} className="flex items-start gap-3 bg-white/40 rounded-lg px-3 py-2.5">
                  <span className="text-sm font-bold text-indigo-600 shrink-0">{m.referral_count}人</span>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{m.reward_title}</p>
                    {m.reward_description && (
                      <p className="text-xs text-slate-500">{m.reward_description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <footer className="text-center py-4 text-xs text-slate-300">
        Powered by{' '}
        <a href="https://github.com/postcabinets-jp/waitlist-referral" target="_blank" rel="noopener noreferrer" className="hover:text-slate-500">
          waitlist-referral
        </a>
      </footer>
    </div>
  )
}
