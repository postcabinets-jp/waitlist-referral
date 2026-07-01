import Link from 'next/link'
import { getWaitlists } from '@/app/actions/waitlists'
import { CreateWaitlistDialog } from '@/components/dashboard/create-waitlist-dialog'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDistanceToNow } from '@/lib/utils'
import { createClient } from '@/lib/supabase/server'

async function getWaitlistsWithCounts() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data: waitlists } = await supabase
    .from('waitlists')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (!waitlists) return []

  const withCounts = await Promise.all(
    waitlists.map(async (wl) => {
      const { count } = await supabase
        .from('subscribers')
        .select('*', { count: 'exact', head: true })
        .eq('waitlist_id', wl.id)
      return { ...wl, subscriberCount: count ?? 0 }
    })
  )

  return withCounts
}

const TEMPLATE_LABELS = {
  minimal: 'ミニマル',
  gradient: 'グラデーション',
  dark: 'ダーク',
}

export default async function DashboardPage() {
  const waitlists = await getWaitlistsWithCounts()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-zinc-900">ウェイトリスト</h1>
          <p className="text-sm text-zinc-500 mt-0.5">
            {waitlists.length === 0
              ? '最初のウェイトリストを作成しましょう'
              : `${waitlists.length}件のウェイトリスト`}
          </p>
        </div>
        <CreateWaitlistDialog />
      </div>

      {waitlists.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-zinc-200 rounded-lg">
          <h3 className="text-sm font-medium text-zinc-700 mb-1">ウェイトリストがありません</h3>
          <p className="text-xs text-zinc-400 mb-4">
            プロジェクトを作成してウェイトリストを管理しましょう
          </p>
          <CreateWaitlistDialog variant="inline" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {waitlists.map((wl) => (
            <Link key={wl.id} href={`/dashboard/${wl.id}`} className="group">
              <Card className="h-full border-zinc-200 hover:border-zinc-300 hover:shadow-sm transition-all">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-base font-semibold text-zinc-900 group-hover:text-zinc-700">
                      {wl.name}
                    </CardTitle>
                    <Badge variant="secondary" className="text-xs ml-2 shrink-0">
                      {TEMPLATE_LABELS[wl.template]}
                    </Badge>
                  </div>
                  {wl.description && (
                    <CardDescription className="text-xs line-clamp-2">
                      {wl.description}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span className="font-mono text-zinc-600 font-medium">
                      {wl.subscriberCount.toLocaleString()} 登録
                    </span>
                    <span>
                      {formatDistanceToNow(new Date(wl.created_at))}前に作成
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
