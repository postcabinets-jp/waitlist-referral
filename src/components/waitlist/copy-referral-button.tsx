'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

export function CopyReferralButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false)

  function copy() {
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Button
      size="sm"
      variant="ghost"
      className="h-6 px-2 text-xs text-zinc-500 hover:text-zinc-800 shrink-0"
      onClick={copy}
    >
      {copied ? '✓ コピー' : 'コピー'}
    </Button>
  )
}
