import { SignupForm } from './signup-form'
import type { Waitlist, Milestone, WaitlistSettings } from '@/types/database'

interface Props {
  waitlist: Waitlist
  subscriberCount: number
  milestones: Milestone[]
  referralCode: string | null
  settings: WaitlistSettings
}

export function WaitlistPageDark({ waitlist, subscriberCount, milestones, referralCode, settings }: Props) {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          {waitlist.logo_url && (
            <img src={waitlist.logo_url} alt={waitlist.name} className="h-10 mb-8" />
          )}

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white tracking-tight">{waitlist.name}</h1>
            {waitlist.description && (
              <p className="text-zinc-400 mt-3 text-base leading-relaxed">{waitlist.description}</p>
            )}
          </div>

          {subscriberCount > 0 && (
            <p className="text-xs text-zinc-500 font-mono mb-5">
              {subscriberCount.toLocaleString()} on the list
            </p>
          )}

          <SignupForm
            slug={waitlist.slug}
            referralCode={referralCode}
            buttonText="Join the list"
            darkMode
          />

          {milestones.length > 0 && (
            <div className="mt-10 space-y-1">
              <p className="text-xs font-medium text-zinc-600 uppercase tracking-widest mb-3">Rewards</p>
              {milestones.map((m) => (
                <div key={m.id} className="flex items-start gap-3 py-2.5 border-t border-zinc-800">
                  <span className="text-xs font-mono text-zinc-500 shrink-0 pt-0.5">{m.referral_count} refs</span>
                  <div>
                    <p className="text-sm text-white font-medium">{m.reward_title}</p>
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

      <footer className="text-center py-4 text-xs text-zinc-800">
        <a href="https://github.com/postcabinets-jp/waitlist-referral" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-600">
          waitlist-referral
        </a>
      </footer>
    </div>
  )
}
