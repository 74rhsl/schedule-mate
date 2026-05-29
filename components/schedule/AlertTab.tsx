'use client'

import { ScheduleEvent, getDaysUntil } from '@/lib/schedule-store'

interface AlertTabProps {
  events: ScheduleEvent[]
}

export default function AlertTab({ events }: AlertTabProps) {
  const today = new Date(); today.setHours(0, 0, 0, 0)
  const soon = new Date(today); soon.setDate(soon.getDate() + 7)

  const upcoming = events
    .filter(e => {
      if (e.done) return false
      const d = new Date(e.date)
      return d >= today && d <= soon
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  return (
    <div>
      <h2 className="mb-4 flex items-center gap-2 text-base font-bold" style={{ color: 'var(--text)' }}>
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        마감 임박 알림
      </h2>

      {upcoming.length === 0 ? (
        <div className="py-16 text-center" style={{ color: 'var(--text-3)' }}>
          <svg className="mx-auto mb-3 h-10 w-10 opacity-40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            <line x1="1" y1="1" x2="23" y2="23" />
          </svg>
          <p className="text-sm">마감 임박 일정이 없어요! 여유롭게 즐겨요.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {upcoming.map(ev => {
            const days = getDaysUntil(ev.date)
            const isUrgent = days <= 2
            const daysLabel = days === 0 ? '오늘!' : `D-${days}`

            return (
              <div
                key={ev.id}
                className="flex items-center gap-3 rounded-xl border p-4"
                style={
                  isUrgent
                    ? {
                        background: 'linear-gradient(135deg, #FFF1F2, #FEE2E2)',
                        borderColor: '#FECDD3',
                      }
                    : {
                        background: 'linear-gradient(135deg, #FFFBEB, #FEF3C7)',
                        borderColor: '#FCD34D',
                      }
                }
              >
                {/* Icon */}
                <span className="shrink-0 text-lg" aria-hidden="true">
                  {isUrgent ? '🔴' : '🟡'}
                </span>

                {/* Text */}
                <div className="flex-1">
                  <div className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{ev.title}</div>
                  <div className="mt-0.5 text-[11px]" style={{ color: 'var(--text-2)' }}>
                    {ev.subj} · {ev.type} · {ev.date} {ev.time}
                  </div>
                </div>

                {/* D-day badge */}
                <span
                  className="shrink-0 rounded-full px-3 py-1 text-[11px] font-bold"
                  style={
                    isUrgent
                      ? { background: '#FEE2E2', color: '#991B1B' }
                      : { background: '#FEF3C7', color: '#92400E' }
                  }
                >
                  {daysLabel}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
