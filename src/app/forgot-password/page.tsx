'use client'

import { useState } from 'react'
import Link from 'next/link'
import { resetPassword } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function ForgotPasswordPage() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const result = await resetPassword(new FormData(e.currentTarget))
    if (result?.error) {
      setError(result.error)
    } else {
      setSuccess(true)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50">
      <div className="w-full max-w-sm px-6">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">パスワードのリセット</h1>
          <p className="text-sm text-zinc-500 mt-1">
            登録済みのメールアドレスを入力してください
          </p>
        </div>

        {success ? (
          <div className="text-center space-y-4 p-6 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 font-medium">リセットメールを送信しました</p>
            <p className="text-sm text-green-700">
              メールに記載されたリンクからパスワードを再設定してください。
            </p>
            <Link href="/login" className="text-sm text-zinc-600 underline">
              ログインに戻る
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">メールアドレス</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="you@example.com"
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
                {error}
              </p>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? '送信中...' : 'リセットリンクを送信'}
            </Button>

            <div className="text-center">
              <Link href="/login" className="text-sm text-zinc-500 hover:text-zinc-700">
                ログインに戻る
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
