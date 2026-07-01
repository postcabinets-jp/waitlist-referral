'use client'

interface DayData {
  date: string
  signups: number
  referrals: number
}

interface Props {
  data: DayData[]
}

export function AnalyticsChart({ data }: Props) {
  const maxValue = Math.max(...data.map((d) => d.signups), 1)

  return (
    <div className="space-y-2">
      <div className="flex gap-4 text-xs text-zinc-500">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-2.5 h-2.5 rounded-sm bg-zinc-900" />
          登録
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-2.5 h-2.5 rounded-sm bg-zinc-300" />
          紹介
        </span>
      </div>
      <div className="flex items-end gap-1 h-32">
        {data.map((day) => {
          const signupHeight = Math.round((day.signups / maxValue) * 100)
          const referralHeight = Math.round((day.referrals / maxValue) * 100)
          const label = day.date.slice(5) // MM-DD

          return (
            <div key={day.date} className="flex-1 flex flex-col items-center gap-0.5 group relative">
              <div className="w-full flex flex-col justify-end gap-px" style={{ height: 112 }}>
                <div
                  className="w-full bg-zinc-900 rounded-t-sm transition-all"
                  style={{ height: `${signupHeight}%`, minHeight: day.signups > 0 ? 2 : 0 }}
                  title={`${label}: ${day.signups}件登録`}
                />
              </div>
              <span className="text-[9px] text-zinc-300 rotate-45 origin-left translate-x-2">
                {label}
              </span>
              {(day.signups > 0 || day.referrals > 0) && (
                <div className="absolute bottom-full mb-1 hidden group-hover:block bg-zinc-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10 left-1/2 -translate-x-1/2">
                  <p>{day.date}</p>
                  <p>登録 {day.signups}件</p>
                  <p>紹介 {day.referrals}件</p>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
