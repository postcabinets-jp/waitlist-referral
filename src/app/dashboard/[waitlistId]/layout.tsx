import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getWaitlist } from '@/app/actions/waitlists'
import { WaitlistSubNav } from '@/components/dashboard/waitlist-sub-nav'

interface Props {
  children: React.ReactNode
  params: Promise<{ waitlistId: string }>
}

export default async function WaitlistLayout({ children, params }: Props) {
  const { waitlistId } = await params
  const waitlist = await getWaitlist(waitlistId)
  if (!waitlist) notFound()

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-xs text-zinc-400 mb-1">
          <Link href="/dashboard" className="hover:text-zinc-600">ウェイトリスト</Link>
          <span>/</span>
          <span className="text-zinc-600 font-medium">{waitlist.name}</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-zinc-900">{waitlist.name}</h1>
            {waitlist.description && (
              <p className="text-sm text-zinc-500 mt-0.5">{waitlist.description}</p>
            )}
          </div>
          <a
            href={`/w/${waitlist.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-zinc-500 hover:text-zinc-800 border border-zinc-200 rounded px-2.5 py-1.5 hover:border-zinc-300 transition-colors"
          >
            LP を開く
          </a>
        </div>
      </div>

      <WaitlistSubNav waitlistId={waitlistId} />

      {children}
    </div>
  )
}
