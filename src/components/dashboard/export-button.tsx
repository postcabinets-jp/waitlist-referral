'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { createClient } from '@/lib/supabase/client'

interface Props {
  waitlistId: string
  waitlistName: string
}

export function ExportButton({ waitlistId, waitlistName }: Props) {
  const [loading, setLoading] = useState(false)

  async function fetchAllSubscribers() {
    const supabase = createClient()
    const { data } = await supabase
      .from('subscribers')
      .select('position, email, name, referral_code, referral_count, subscribed_at')
      .eq('waitlist_id', waitlistId)
      .order('position', { ascending: true })
    return data ?? []
  }

  async function exportCSV() {
    setLoading(true)
    const subscribers = await fetchAllSubscribers()
    const headers = ['順位', 'メール', '名前', '紹介コード', '紹介数', '登録日']
    const rows = subscribers.map((s) => [
      s.position,
      s.email,
      s.name ?? '',
      s.referral_code,
      s.referral_count,
      new Date(s.subscribed_at).toLocaleDateString('ja-JP'),
    ])
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n')
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${waitlistName}-subscribers.csv`
    a.click()
    URL.revokeObjectURL(url)
    setLoading(false)
  }

  async function exportJSON() {
    setLoading(true)
    const subscribers = await fetchAllSubscribers()
    const json = JSON.stringify(subscribers, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${waitlistName}-subscribers.json`
    a.click()
    URL.revokeObjectURL(url)
    setLoading(false)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant="outline" size="sm" disabled={loading} />}
      >
        {loading ? 'エクスポート中...' : 'エクスポート'}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={exportCSV}>CSV でダウンロード</DropdownMenuItem>
        <DropdownMenuItem onClick={exportJSON}>JSON でダウンロード</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
