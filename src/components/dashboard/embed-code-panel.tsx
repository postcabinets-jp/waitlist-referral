'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface Props {
  slug: string
  appUrl: string
}

export function EmbedCodePanel({ slug, appUrl }: Props) {
  const iframeCode = `<iframe
  src="${appUrl}/w/${slug}/embed"
  width="100%"
  height="240"
  frameborder="0"
  scrolling="no"
  style="border:none; overflow:hidden;"
  title="ウェイトリスト登録フォーム"
></iframe>`

  const scriptCode = `<div id="waitlist-${slug}"></div>
<script>
  (function() {
    var div = document.getElementById('waitlist-${slug}');
    var iframe = document.createElement('iframe');
    iframe.src = '${appUrl}/w/${slug}/embed';
    iframe.style.cssText = 'width:100%;height:240px;border:none;overflow:hidden;';
    iframe.scrolling = 'no';
    iframe.title = 'ウェイトリスト登録フォーム';
    div.appendChild(iframe);
  })();
</script>`

  const directLink = `${appUrl}/w/${slug}`

  return (
    <div className="space-y-4">
      <Tabs defaultValue="iframe">
        <TabsList className="bg-zinc-100 h-8">
          <TabsTrigger value="iframe" className="text-xs h-6">iFrame</TabsTrigger>
          <TabsTrigger value="script" className="text-xs h-6">Script</TabsTrigger>
          <TabsTrigger value="link" className="text-xs h-6">直リンク</TabsTrigger>
        </TabsList>

        <TabsContent value="iframe" className="space-y-3 mt-3">
          <p className="text-xs text-zinc-500">
            HTMLに直接貼り付けてください。フォームが埋め込まれます。
          </p>
          <CodeBlock code={iframeCode} label="iframe コード" />
        </TabsContent>

        <TabsContent value="script" className="space-y-3 mt-3">
          <p className="text-xs text-zinc-500">
            JavaScriptで動的に埋め込む場合はこちらを使用してください。
          </p>
          <CodeBlock code={scriptCode} label="script コード" />
        </TabsContent>

        <TabsContent value="link" className="space-y-3 mt-3">
          <p className="text-xs text-zinc-500">
            ランディングページへの直リンクです。メール・SNSでの共有に使えます。
          </p>
          <CodeBlock code={directLink} label="ページURL" />
        </TabsContent>
      </Tabs>

      <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-4">
        <h3 className="text-xs font-medium text-zinc-700 mb-2">プレビュー</h3>
        <div className="border border-zinc-200 rounded bg-white overflow-hidden">
          <iframe
            src={`/w/${slug}/embed`}
            width="100%"
            height={200}
            style={{ border: 'none', display: 'block' }}
            title="プレビュー"
          />
        </div>
      </div>
    </div>
  )
}

function CodeBlock({ code, label }: { code: string; label: string }) {
  const [copied, setCopied] = useState(false)

  function copy() {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative">
      <div className="flex items-center justify-between bg-zinc-800 text-zinc-300 text-xs px-3 py-1.5 rounded-t-md">
        <span>{label}</span>
        <Button
          size="sm"
          variant="ghost"
          className="h-6 text-xs text-zinc-400 hover:text-white px-2"
          onClick={copy}
        >
          {copied ? 'コピー済み' : 'コピー'}
        </Button>
      </div>
      <pre className="bg-zinc-900 text-zinc-200 text-xs p-3 rounded-b-md overflow-x-auto whitespace-pre-wrap font-mono leading-relaxed">
        {code}
      </pre>
    </div>
  )
}
