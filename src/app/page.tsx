import Link from 'next/link'

const FEATURES = [
  {
    title: 'バイラル紹介システム',
    description: '登録者全員にユニークな紹介URLを自動発行。紹介数に応じて順位が上がり、登録者が自発的に拡散してくれます。',
    stat: '3.2倍',
    statLabel: '登録数向上',
  },
  {
    title: 'マイルストーン報酬',
    description: '「3人紹介→アーリーアクセス」「10人→創業メンバー」など、到達目標を設定して登録者を動かします。',
    stat: '67%',
    statLabel: '紹介意欲向上',
  },
  {
    title: 'ランディングページ内蔵',
    description: '3種類のテンプレート（ミニマル/グラデーション/ダーク）を即座に公開。外部サービス不要で完結します。',
    stat: '3分',
    statLabel: '公開まで',
  },
  {
    title: 'ゼロ制限 — 完全無料',
    description: 'GetWaitlistの無料プランは100人まで。このOSSは登録者数・ウェイトリスト数に制限なし。ホスティング代だけ。',
    stat: '∞',
    statLabel: '登録者数',
  },
  {
    title: 'Supabase RLS — 完全安全',
    description: 'Row Level Securityで全テーブルを保護。自分のデータだけ見えます。SQLインジェクションは構造的に不可能。',
    stat: '100%',
    statLabel: 'RLSカバレッジ',
  },
  {
    title: '埋め込みウィジェット',
    description: '既存サイトにiFrame 1行で埋め込み可能。APIも完備でZapier・n8n・Webhookとの連携も対応。',
    stat: '1行',
    statLabel: '埋め込みコード',
  },
]

const TECH_STACK = [
  { name: 'Next.js 15', desc: 'App Router, Server Actions, TypeScript strict' },
  { name: 'Supabase', desc: 'PostgreSQL + Auth + RLS + Edge Functions' },
  { name: 'Tailwind CSS v4', desc: 'shadcn/ui コンポーネント' },
  { name: 'Vercel', desc: 'ワンクリックデプロイ' },
]

export default function LandingPage() {
  const repoUrl = 'https://github.com/postcabinets-jp/waitlist-referral'
  const vercelDeployUrl = `https://vercel.com/new/clone?repository-url=${encodeURIComponent(repoUrl)}&env=NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY,SUPABASE_SERVICE_ROLE_KEY,NEXT_PUBLIC_APP_URL&envDescription=Supabase接続情報&project-name=waitlist-referral&repository-name=waitlist-referral`

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <header className="border-b border-zinc-100 sticky top-0 bg-white/95 backdrop-blur z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <span className="font-semibold text-zinc-900 text-sm tracking-tight">Waitlist Referral</span>
          <div className="flex items-center gap-3">
            <a
              href={repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-zinc-500 hover:text-zinc-800 flex items-center gap-1.5"
            >
              <GithubIcon />
              GitHub
            </a>
            <Link
              href="/login"
              className="text-xs bg-zinc-900 text-white px-3 py-1.5 rounded-md hover:bg-zinc-700 transition-colors"
            >
              ログイン
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-zinc-100 text-zinc-600 text-xs px-3 py-1 rounded-full mb-6">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
          GetWaitlist の完全無料OSSが登場
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold text-zinc-900 tracking-tight leading-tight mb-5">
          ウェイトリスト × バイラル紹介を
          <br />
          <span className="text-zinc-400">3分で立ち上げる</span>
        </h1>

        <p className="text-lg text-zinc-500 max-w-xl mx-auto leading-relaxed mb-8">
          LaunchList（$19）/ GetWaitlist（月$15〜）の完全無料代替。
          登録者が友人を紹介するたびに順位が上がる仕組みを、
          自分のSupabaseに5分でデプロイ。
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href={vercelDeployUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-zinc-900 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-zinc-700 transition-colors"
          >
            <VercelIcon />
            Vercel にデプロイ
          </a>
          <a
            href={repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-zinc-200 text-zinc-700 px-5 py-2.5 rounded-lg text-sm font-medium hover:border-zinc-300 hover:bg-zinc-50 transition-colors"
          >
            <GithubIcon />
            GitHub で見る
          </a>
          <Link
            href="/register"
            className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-800 px-2"
          >
            デモを試す →
          </Link>
        </div>

        <div className="flex items-center justify-center gap-8 mt-12 text-center">
          {[
            { val: '∞', label: '登録者数上限' },
            { val: '3種', label: 'LPテンプレート' },
            { val: 'MIT', label: 'ライセンス' },
          ].map(({ val, label }) => (
            <div key={label}>
              <p className="text-2xl font-bold font-mono text-zinc-900">{val}</p>
              <p className="text-xs text-zinc-400 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-zinc-100 bg-zinc-50 py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-xl font-bold text-zinc-900 mb-8 text-center">主な機能</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f) => (
              <div key={f.title} className="bg-white border border-zinc-200 rounded-xl p-5">
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-2xl font-bold font-mono text-zinc-900">{f.stat}</span>
                  <span className="text-xs text-zinc-400">{f.statLabel}</span>
                </div>
                <h3 className="text-sm font-semibold text-zinc-900 mb-1">{f.title}</h3>
                <p className="text-xs text-zinc-500 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Referral Flow */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-xl font-bold text-zinc-900 mb-2">バイラルの仕組み</h2>
          <p className="text-sm text-zinc-500 mb-10">登録者が勝手に広めてくれるフライホイールを作る</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { step: '1', title: '登録', desc: 'メールを入力して登録' },
              { step: '2', title: 'URL発行', desc: 'ユニーク紹介URLを自動生成' },
              { step: '3', title: 'シェア', desc: 'SNS・メールで友人に共有' },
              { step: '4', title: '順位UP', desc: '紹介ごとに順位が上昇、報酬解放' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="text-center">
                <div className="w-8 h-8 rounded-full bg-zinc-900 text-white text-xs font-bold flex items-center justify-center mx-auto mb-3">
                  {step}
                </div>
                <p className="text-sm font-semibold text-zinc-900">{title}</p>
                <p className="text-xs text-zinc-400 mt-1">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Deploy */}
      <section className="border-t border-zinc-100 bg-zinc-50 py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-xl font-bold text-zinc-900 mb-2">5分でデプロイ</h2>
          <p className="text-sm text-zinc-500 mb-8">Supabaseプロジェクトを用意してVercelボタンをクリックするだけ</p>

          <div className="bg-white border border-zinc-200 rounded-xl p-6 text-left space-y-3 mb-6">
            {[
              '1. Supabase でプロジェクトを作成（無料プランで OK）',
              '2. 下の「Vercel にデプロイ」ボタンをクリック',
              '3. Supabase の URL・ANON KEY・SERVICE ROLE KEY を入力',
              '4. デプロイ完了 → SQLマイグレーションを実行',
              '5. ウェイトリスト作成してシェア！',
            ].map((step) => (
              <div key={step} className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-zinc-100 text-zinc-500 text-xs flex items-center justify-center shrink-0 font-mono">
                  {step[0]}
                </span>
                <span className="text-sm text-zinc-600">{step.slice(3)}</span>
              </div>
            ))}
          </div>

          <a
            href={vercelDeployUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-zinc-900 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-zinc-700 transition-colors"
          >
            <VercelIcon />
            Vercel にデプロイ
          </a>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-xl font-bold text-zinc-900 mb-8">テックスタック</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {TECH_STACK.map((t) => (
              <div key={t.name} className="border border-zinc-100 rounded-lg p-4 text-left">
                <p className="text-sm font-semibold text-zinc-900">{t.name}</p>
                <p className="text-xs text-zinc-400 mt-1">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-100 py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
          <p>© 2026 POST CABINETS Inc. MIT License.</p>
          <div className="flex items-center gap-4">
            <a href={repoUrl} target="_blank" rel="noopener noreferrer" className="hover:text-zinc-700 flex items-center gap-1">
              <GithubIcon />
              GitHub
            </a>
            <Link href="/login" className="hover:text-zinc-700">ダッシュボード</Link>
            <Link href="/register" className="hover:text-zinc-700">無料で始める</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

function GithubIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  )
}

function VercelIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 22.525H0l12-21.05 12 21.05z" />
    </svg>
  )
}
