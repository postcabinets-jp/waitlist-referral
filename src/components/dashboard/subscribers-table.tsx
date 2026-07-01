'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { deleteSubscriber } from '@/app/actions/subscribers'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatDistanceToNow } from '@/lib/utils'
import type { Subscriber } from '@/types/database'

interface Props {
  subscribers: Subscriber[]
  waitlistId: string
  totalCount: number
  currentPage: number
  slug: string
}

const PAGE_SIZE = 50

export function SubscribersTable({ subscribers, waitlistId, totalCount, currentPage, slug }: Props) {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const totalPages = Math.ceil(totalCount / PAGE_SIZE)

  async function handleDelete(subscriberId: string) {
    if (!confirm('この登録者を削除しますか？')) return
    setDeletingId(subscriberId)
    await deleteSubscriber(waitlistId, subscriberId)
    setDeletingId(null)
    router.refresh()
  }

  if (subscribers.length === 0) {
    return (
      <div className="text-center py-12 border border-zinc-200 rounded-lg bg-white">
        <p className="text-sm text-zinc-400">まだ登録者がいません</p>
        <p className="text-xs text-zinc-400 mt-1">
          <a
            href={`/w/${slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-zinc-600"
          >
            ランディングページ
          </a>
          をシェアして最初の登録者を集めましょう
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="bg-white border border-zinc-200 rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-zinc-50 hover:bg-zinc-50">
              <TableHead className="text-xs font-medium text-zinc-500 w-12">#</TableHead>
              <TableHead className="text-xs font-medium text-zinc-500">登録者</TableHead>
              <TableHead className="text-xs font-medium text-zinc-500">紹介コード</TableHead>
              <TableHead className="text-xs font-medium text-zinc-500 text-right">紹介数</TableHead>
              <TableHead className="text-xs font-medium text-zinc-500">登録日</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {subscribers.map((sub) => (
              <TableRow key={sub.id} className="hover:bg-zinc-50">
                <TableCell className="text-xs text-zinc-400 font-mono">{sub.position}</TableCell>
                <TableCell>
                  <div>
                    {sub.name && (
                      <p className="text-sm font-medium text-zinc-900">{sub.name}</p>
                    )}
                    <p className={sub.name ? 'text-xs text-zinc-400' : 'text-sm text-zinc-700'}>
                      {sub.email}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <code className="text-xs bg-zinc-100 px-1.5 py-0.5 rounded font-mono">
                      {sub.referral_code}
                    </code>
                    {sub.referred_by && (
                      <Badge variant="secondary" className="text-xs">紹介</Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <span className={`text-sm font-mono font-medium ${sub.referral_count > 0 ? 'text-zinc-900' : 'text-zinc-300'}`}>
                    {sub.referral_count}
                  </span>
                </TableCell>
                <TableCell className="text-xs text-zinc-400">
                  {formatDistanceToNow(new Date(sub.subscribed_at))}前
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 text-zinc-300 hover:text-red-500"
                    onClick={() => handleDelete(sub.id)}
                    disabled={deletingId === sub.id}
                  >
                    ✕
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-xs text-zinc-500">
          <span>{totalCount.toLocaleString()} 件中 {((currentPage - 1) * PAGE_SIZE + 1)}〜{Math.min(currentPage * PAGE_SIZE, totalCount)} 件</span>
          <div className="flex gap-1">
            {currentPage > 1 && (
              <Link
                href={`?page=${currentPage - 1}`}
                className="px-2 py-1 border border-zinc-200 rounded hover:bg-zinc-50"
              >
                前へ
              </Link>
            )}
            {currentPage < totalPages && (
              <Link
                href={`?page=${currentPage + 1}`}
                className="px-2 py-1 border border-zinc-200 rounded hover:bg-zinc-50"
              >
                次へ
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
