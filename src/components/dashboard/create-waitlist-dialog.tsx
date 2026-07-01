'use client'

import { useState } from 'react'
import { createWaitlist } from '@/app/actions/waitlists'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface Props {
  variant?: 'default' | 'inline'
}

export function CreateWaitlistDialog({ variant = 'default' }: Props) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [template, setTemplate] = useState('minimal')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const fd = new FormData(e.currentTarget)
    fd.set('template', template)
    await createWaitlist(fd)
    setLoading(false)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="sm" />}>
        {variant === 'inline' ? '作成する' : '新規作成'}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>ウェイトリスト作成</DialogTitle>
          <DialogDescription>
            プロジェクト名とテンプレートを選択してください
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label htmlFor="name">プロジェクト名 *</Label>
            <Input
              id="name"
              name="name"
              required
              placeholder="例: DevPulse, Flowmatic..."
              autoFocus
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="description">説明（任意）</Label>
            <Textarea
              id="description"
              name="description"
              rows={2}
              placeholder="どんなプロダクトか一言で"
            />
          </div>
          <div className="space-y-1.5">
            <Label>ランディングページテンプレート</Label>
            <Select value={template} onValueChange={(v) => { if (v) setTemplate(v) }}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="minimal">ミニマル — シンプルな白背景</SelectItem>
                <SelectItem value="gradient">グラデーション — カラフルな背景</SelectItem>
                <SelectItem value="dark">ダーク — ダークモード</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              キャンセル
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? '作成中...' : '作成'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
