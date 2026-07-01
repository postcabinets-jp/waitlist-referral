'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { joinWaitlist } from '@/app/actions/subscribers'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface Props {
  slug: string
  referralCode: string | null
  buttonText?: string
  placeholder?: string
  darkMode?: boolean
}

export function SignupForm({ slug, referralCode, buttonText = '登録する', placeholder = 'your@email.com', darkMode = false }: Props) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const fd = new FormData(e.currentTarget)
    fd.set('slug', slug)
    if (referralCode) fd.set('ref', referralCode)

    const result = await joinWaitlist(fd)
    setLoading(false)

    if (result.error) {
      setError(result.error)
    } else if (result.success && result.referralCode) {
      router.push(`/w/${slug}/status/${result.referralCode}`)
    }
  }

  const inputClass = darkMode
    ? 'bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-white/60'
    : ''

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-2">
        <Input
          name="email"
          type="email"
          required
          placeholder={placeholder}
          className={`flex-1 ${inputClass}`}
          autoComplete="email"
        />
        <Button type="submit" disabled={loading} className="shrink-0">
          {loading ? '処理中...' : buttonText}
        </Button>
      </div>
      {error && (
        <p className={`text-xs ${darkMode ? 'text-red-300' : 'text-red-600'}`}>{error}</p>
      )}
    </form>
  )
}
