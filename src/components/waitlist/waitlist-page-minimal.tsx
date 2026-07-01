import { SignupForm } from './signup-form'
import type { Waitlist, Milestone, WaitlistSettings } from '@/types/database'

interface Props {
  waitlist: Waitlist
  subscriberCount: number
  milestones: Milestone[]
  referralCode: string | null
  settings: WaitlistSettings
}

export function WaitlistPageMinimal({ waitlist, subscriberCount, milestones, referralCode, settings }: Props) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          {waitlist.logo_url && (
            <img src={waitlist.logo_url} alt={waitlist.name} className="h-10 mb-8" />
          )}

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">{waitlist.name}</h1>
            {waitlist.description && (
              <p className="text-zinc-500 mt-3 text-base leading-relaxed">{waitlist.description}</p>
            )}
          </div>

          {subscriberCount > 0 && (
            <p className="text-xs text-zinc-400 mb-4 font-mono">
              {subscriberCount.toLocaleString()}人が登録済み
            </p>
          )}

          {settings.referralEnabled !== false ? (
            <SignupForm slug={waitlist.slug} referralCode={referralCode} />
          ) : (
            <SignupForm slug={waitlist.slug} referralCode={null} />
          )}

          {milestones.length > 0 && (
            <div className="mt-10 space-y-2">
              <p className="text-xs font-medium text-zinc-400 uppercase tracking-wide">報酬</p>
              {milestones.map((m) => (
                <div key={m.id} className="flex items-start gap-3 py-2 border-t border-zinc-100">
                  <span className="text-xs font-mono bg-zinc-100 text-zinc-600 px-1.5 py-0.5 rounded shrink-0">
                    {m.referral_count}人
                  </span>
                  <div>
                    <p className="text-sm font-medium text-zinc-800">{m.reward_title}</p>
                    {m.reward_description && (
                      <p className="text-xs text-zinc-500 mt-0.5">{m.reward_description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <footer className="text-center py-4 text-xs text-zinc-300">
        Powered by{' '}
        <a href="https://github.com/postcabinets-jp/waitlist-referral" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-500">
          waitlist-referral
        </a>
      </footer>
    </div>
  )
}
