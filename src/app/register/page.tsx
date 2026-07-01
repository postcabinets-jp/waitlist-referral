import Link from 'next/link'
import { RegisterForm } from './register-form'

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50">
      <div className="w-full max-w-sm px-6">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">アカウント作成</h1>
          <p className="text-sm text-zinc-500 mt-1">
            すでにアカウントをお持ちの方は{' '}
            <Link href="/login" className="text-zinc-900 underline underline-offset-2 hover:text-zinc-700">
              ログイン
            </Link>
          </p>
        </div>
        <RegisterForm />
      </div>
    </div>
  )
}
