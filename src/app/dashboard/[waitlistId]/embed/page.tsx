import { notFound } from 'next/navigation'
import { getWaitlist } from '@/app/actions/waitlists'
import { EmbedCodePanel } from '@/components/dashboard/embed-code-panel'

interface Props {
  params: Promise<{ waitlistId: string }>
}

export default async function EmbedPage({ params }: Props) {
  const { waitlistId } = await params
  const waitlist = await getWaitlist(waitlistId)
  if (!waitlist) notFound()

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://your-app.vercel.app'

  return (
    <div className="space-y-4 max-w-2xl">
      <div>
        <h2 className="text-sm font-medium text-zinc-700">埋め込みウィジェット</h2>
        <p className="text-xs text-zinc-400 mt-0.5">
          外部サイトにウェイトリストフォームを埋め込むためのコードです
        </p>
      </div>
      <EmbedCodePanel slug={waitlist.slug} appUrl={appUrl} />
    </div>
  )
}
