# Waitlist Referral

Open-source alternative to [GetWaitlist](https://getwaitlist.com) / [LaunchList](https://getlaunchlist.com).

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fpostcabinets-jp%2Fwaitlist-referral&env=NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY,SUPABASE_SERVICE_ROLE_KEY,NEXT_PUBLIC_APP_URL&envDescription=Supabase%E6%8E%A5%E7%B6%9A%E6%83%85%E5%A0%B1&project-name=waitlist-referral&repository-name=waitlist-referral)

GetWaitlist の無料プランが廃止。LaunchList は $19 の買い切り。どちらも登録者数に上限がある。
このOSSは**無制限・無料**でセルフホスト可能なウェイトリスト + バイラル紹介システムです。

## Features

- **バイラル紹介システム** — 登録者全員にユニーク紹介URLを自動発行。紹介数で順位が上昇
- **マイルストーン報酬** — 「3人紹介でアーリーアクセス」「10人でβテスター」等の設定
- **LP内蔵（3テンプレート）** — ミニマル / グラデーション / ダーク を即公開
- **埋め込みウィジェット** — 既存サイトに iframe 1行で追加
- **管理ダッシュボード** — 登録推移・リファラル率・日別グラフ
- **CSV/JSONエクスポート** — 登録者データをワンクリック出力
- **完全無料・登録者数無制限** — ホスティング代だけ

## Quick Start

### 1. Supabase プロジェクト作成

[Supabase](https://supabase.com) で新規プロジェクトを作成し、`Project URL` と `anon key`、`service_role key` を控えておく。

### 2. Vercel にデプロイ

上の「Deploy with Vercel」ボタンをクリックして環境変数を入力するだけ。

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJh...
SUPABASE_SERVICE_ROLE_KEY=eyJh...
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

### 3. データベースのセットアップ

Supabase の SQL Editor で以下を順番に実行：

```bash
# ローカル開発の場合
supabase db push
```

または `supabase/migrations/` 内の SQL ファイルを Supabase Dashboard > SQL Editor から順番に実行。

### 4. ローカル開発

```bash
git clone https://github.com/postcabinets-jp/waitlist-referral
cd waitlist-referral
npm install
cp .env.example .env.local
# .env.local に Supabase の接続情報を入力
npm run dev
```

## Directory Structure

```
src/
├── app/
│   ├── actions/          # Server Actions (CRUD)
│   ├── auth/callback/    # OAuth callback
│   ├── dashboard/        # 管理ダッシュボード
│   │   └── [waitlistId]/ # ウェイトリスト詳細
│   │       ├── analytics/
│   │       ├── embed/
│   │       ├── milestones/
│   │       └── settings/
│   ├── w/[slug]/         # 公開ウェイトリストLP
│   │   └── status/[referralCode]/
│   └── page.tsx          # マーケティングLP
├── components/
│   ├── dashboard/        # 管理画面コンポーネント
│   ├── waitlist/         # 公開LP コンポーネント
│   └── ui/               # shadcn/ui
└── lib/supabase/         # Supabase クライアント
```

## Tech Stack

- **Next.js 15** — App Router, Server Actions, TypeScript strict
- **Supabase** — PostgreSQL + Auth + Row Level Security
- **Tailwind CSS v4** + **shadcn/ui**
- **Vercel** — ワンクリックデプロイ

## Security

- 全テーブルに RLS (Row Level Security) 適用。他ユーザーのデータは構造的にアクセス不可
- セキュリティヘッダー: X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy
- API レート制限: 60 req/min/IP
- CORS: same-origin only

## License

MIT

---

Built by [POST CABINETS](https://postcabinets.co.jp)
