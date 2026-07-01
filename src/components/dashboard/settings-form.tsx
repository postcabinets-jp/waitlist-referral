'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateWaitlist, deleteWaitlist } from '@/app/actions/waitlists'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import type { Waitlist, WaitlistSettings } from '@/types/database'

interface Props {
  waitlist: Waitlist
}

export function SettingsForm({ waitlist }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [template, setTemplate] = useState(waitlist.template)
  const settings = waitlist.settings as unknown as WaitlistSettings

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setSuccess(false)
    const fd = new FormData(e.currentTarget)
    fd.set('template', template)
    await updateWaitlist(waitlist.id, fd)
    setLoading(false)
    setSuccess(true)
    setTimeout(() => setSuccess(false), 3000)
    router.refresh()
  }

  async function handleDelete() {
    const confirmed = confirm(
      `「${waitlist.name}」を削除しますか？\n登録者データもすべて削除されます。この操作は取り消せません。`
    )
    if (!confirmed) return
    setDeleting(true)
    await deleteWaitlist(waitlist.id)
    // Will redirect
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4 bg-white border border-zinc-200 rounded-lg p-5">
        <div className="space-y-1.5">
          <Label htmlFor="name">プロジェクト名</Label>
          <Input id="name" name="name" required defaultValue={waitlist.name} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="description">説明</Label>
          <Textarea
            id="description"
            name="description"
            rows={3}
            defaultValue={waitlist.description ?? ''}
          />
        </div>

        <div className="space-y-1.5">
          <Label>ランディングページテンプレート</Label>
          <Select value={template} onValueChange={(v) => { if (v) setTemplate(v as Waitlist['template']) }}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="minimal">ミニマル</SelectItem>
              <SelectItem value="gradient">グラデーション</SelectItem>
              <SelectItem value="dark">ダーク</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label>スラッグ</Label>
          <div className="flex items-center gap-2">
            <span className="text-sm text-zinc-400 shrink-0">/w/</span>
            <Input value={waitlist.slug} disabled className="bg-zinc-50 text-zinc-500" />
          </div>
          <p className="text-xs text-zinc-400">スラッグは変更できません</p>
        </div>

        {success && (
          <p className="text-sm text-green-600 bg-green-50 border border-green-200 rounded px-3 py-2">
            設定を保存しました
          </p>
        )}

        <Button type="submit" disabled={loading}>
          {loading ? '保存中...' : '変更を保存'}
        </Button>
      </form>

      <div className="bg-white border border-red-200 rounded-lg p-5 space-y-3">
        <h3 className="text-sm font-medium text-red-700">危険ゾーン</h3>
        <p className="text-xs text-zinc-500">
          ウェイトリストを削除すると、すべての登録者データとイベントログも削除されます。この操作は取り消せません。
        </p>
        <Button
          variant="destructive"
          size="sm"
          onClick={handleDelete}
          disabled={deleting}
        >
          {deleting ? '削除中...' : 'ウェイトリストを削除'}
        </Button>
      </div>
    </div>
  )
}
