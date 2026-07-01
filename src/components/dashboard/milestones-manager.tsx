'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createMilestone, deleteMilestone, updateMilestone } from '@/app/actions/milestones'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import type { Milestone } from '@/types/database'

interface Props {
  waitlistId: string
  initialMilestones: Milestone[]
}

export function MilestonesManager({ waitlistId, initialMilestones }: Props) {
  const router = useRouter()
  const [adding, setAdding] = useState(false)
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    await createMilestone(waitlistId, new FormData(e.currentTarget))
    setLoading(false)
    setAdding(false)
    router.refresh()
  }

  async function handleUpdate(milestoneId: string, e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    await updateMilestone(milestoneId, waitlistId, new FormData(e.currentTarget))
    setLoading(false)
    setEditingId(null)
    router.refresh()
  }

  async function handleDelete(milestoneId: string) {
    if (!confirm('このマイルストーンを削除しますか？')) return
    setLoading(true)
    await deleteMilestone(milestoneId, waitlistId)
    setLoading(false)
    router.refresh()
  }

  return (
    <div className="space-y-3">
      {initialMilestones.length === 0 && !adding && (
        <div className="text-center py-10 border-2 border-dashed border-zinc-200 rounded-lg">
          <p className="text-sm text-zinc-400">マイルストーンがありません</p>
          <p className="text-xs text-zinc-400 mt-1">紹介数に応じた報酬を設定して、バイラルを加速させましょう</p>
        </div>
      )}

      {initialMilestones.map((milestone) => (
        <div key={milestone.id} className="bg-white border border-zinc-200 rounded-lg p-4">
          {editingId === milestone.id ? (
            <form onSubmit={(e) => handleUpdate(milestone.id, e)} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor={`count-${milestone.id}`} className="text-xs">紹介数</Label>
                  <Input
                    id={`count-${milestone.id}`}
                    name="referral_count"
                    type="number"
                    min="1"
                    required
                    defaultValue={milestone.referral_count}
                    className="h-8 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor={`title-${milestone.id}`} className="text-xs">報酬タイトル</Label>
                  <Input
                    id={`title-${milestone.id}`}
                    name="reward_title"
                    required
                    defaultValue={milestone.reward_title}
                    className="h-8 text-sm"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">詳細（任意）</Label>
                <Textarea
                  name="reward_description"
                  rows={2}
                  defaultValue={milestone.reward_description ?? ''}
                  className="text-sm"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingId(null)}
                >
                  キャンセル
                </Button>
                <Button type="submit" size="sm" disabled={loading}>保存</Button>
              </div>
            </form>
          ) : (
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <Badge className="mt-0.5 shrink-0 font-mono text-xs">
                  {milestone.referral_count}人紹介
                </Badge>
                <div>
                  <p className="text-sm font-medium text-zinc-900">{milestone.reward_title}</p>
                  {milestone.reward_description && (
                    <p className="text-xs text-zinc-500 mt-0.5">{milestone.reward_description}</p>
                  )}
                </div>
              </div>
              <div className="flex gap-1 shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs text-zinc-400 hover:text-zinc-700"
                  onClick={() => setEditingId(milestone.id)}
                >
                  編集
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs text-zinc-300 hover:text-red-500"
                  onClick={() => handleDelete(milestone.id)}
                  disabled={loading}
                >
                  削除
                </Button>
              </div>
            </div>
          )}
        </div>
      ))}

      {adding ? (
        <form onSubmit={handleCreate} className="bg-white border border-zinc-200 rounded-lg p-4 space-y-3">
          <h3 className="text-sm font-medium text-zinc-700">新しいマイルストーン</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="referral_count" className="text-xs">紹介数 *</Label>
              <Input
                id="referral_count"
                name="referral_count"
                type="number"
                min="1"
                required
                placeholder="3"
                className="h-8 text-sm"
                autoFocus
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="reward_title" className="text-xs">報酬タイトル *</Label>
              <Input
                id="reward_title"
                name="reward_title"
                required
                placeholder="Early Adopter Badge"
                className="h-8 text-sm"
              />
            </div>
          </div>
          <div className="space-y-1">
            <Label htmlFor="reward_description" className="text-xs">詳細（任意）</Label>
            <Textarea
              id="reward_description"
              name="reward_description"
              rows={2}
              placeholder="3ヶ月分のProプランが無料。将来の価格に永続固定。"
              className="text-sm"
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setAdding(false)}
            >
              キャンセル
            </Button>
            <Button type="submit" size="sm" disabled={loading}>
              {loading ? '保存中...' : '追加'}
            </Button>
          </div>
        </form>
      ) : (
        <Button
          variant="outline"
          size="sm"
          className="w-full border-dashed"
          onClick={() => setAdding(true)}
        >
          + マイルストーンを追加
        </Button>
      )}
    </div>
  )
}
