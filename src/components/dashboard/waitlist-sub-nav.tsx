'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { label: '登録者', href: '' },
  { label: '分析', href: '/analytics' },
  { label: 'マイルストーン', href: '/milestones' },
  { label: '埋め込み', href: '/embed' },
  { label: '設定', href: '/settings' },
]

export function WaitlistSubNav({ waitlistId }: { waitlistId: string }) {
  const pathname = usePathname()
  const base = `/dashboard/${waitlistId}`

  return (
    <nav className="flex gap-1 border-b border-zinc-200 -mb-px">
      {NAV_ITEMS.map(({ label, href }) => {
        const fullHref = `${base}${href}`
        const isActive = href === ''
          ? pathname === base
          : pathname.startsWith(fullHref)

        return (
          <Link
            key={href}
            href={fullHref}
            className={cn(
              'text-sm px-3 py-2 border-b-2 transition-colors',
              isActive
                ? 'border-zinc-900 text-zinc-900 font-medium'
                : 'border-transparent text-zinc-500 hover:text-zinc-700 hover:border-zinc-300'
            )}
          >
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
