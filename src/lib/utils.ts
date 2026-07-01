import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDistanceToNow(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
  if (seconds < 60) return `${seconds}秒`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}分`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}時間`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}日`
  const months = Math.floor(days / 30)
  if (months < 12) return `${months}ヶ月`
  return `${Math.floor(months / 12)}年`
}

export function formatNumber(n: number): string {
  return n.toLocaleString('ja-JP')
}
