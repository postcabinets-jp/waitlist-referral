import Link from 'next/link'
import { LoginForm } from './login-form'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50">
      <div className="w-full max-w-sm px-6">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">ログイン</h1>
          <p className="text-sm text-zinc-500 mt-1">
            アカウントをお持ちでない方は{' '}
            <Link href="/register" className="text-zinc-900 underline underline-offset-2 hover:text-zinc-700">
              登録
            </Link>
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
