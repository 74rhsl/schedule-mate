'use client'

import { useState } from 'react'
import { ScheduleEvent, SUBJECT_EMOJI, getDaysUntil } from '@/lib/schedule-store'
import { Trash2 } from 'lucide-react'

type FilterKey = 'all' | '수행평가' | '숙제' | '세특' | '동아리' | '행사' | 'done'

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: '전체' },
  { key: '수행평가', label: '수행평가' },
  { key: '숙제', label: '숙제' },
  { key: '세특', label: '세특' },
  { key: '동아리', label: '동아리' },
  { key: '행사', label: '행사' },
  { key: 'done', label: '완료됨' },
]

const PRIORITY_DOT: Record<string, string> = {
  high: '#EF4444',
  med: '#F59E0B',
  low: '#10B981',
}

interface EventListTabProps {
  events: ScheduleEvent[]
  onToggleDone: (id: number) => void
  onDelete: (id: number) => void
  onAdd: () => void
}

export default function EventListTab({ events, onToggleDone, onDelete, onAdd }: EventListTabProps) {
  const [filter, setFilter] = useState<FilterKey>('all')

  const filtered = (() => {
    if (filter === 'done') return events.filter(e => e.done)
    if (filter === 'all') return events
    return events.filter(e => e.type === filter && !e.done)
  })()

  const sorted = [...filtered].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  return (
    <div>
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-base font-bold" style={{ color: 'var(--text)' }}>
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2m-6 9 2 2 4-4" />
          </svg>
          전체 일정
        </h2>
        <button
          onClick={onAdd}
          className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium text-white transition-all hover:opacity-90"
          style={{ background: 'var(--primary)' }}
        >
          <span aria-hidden="true">+</span> 일정 추가
        </button>
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap gap-2">
        {FILTERS.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className="rounded-full border px-3 py-1 text-xs font-medium transition-all"
            style={
              filter === f.key
                ? { background: 'var(--primary)', color: '#fff', borderColor: 'var(--primary)' }
                : { background: 'var(--surface)', color: 'var(--text-2)', borderColor: 'var(--border)' }
            }
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* List */}
      {sorted.length === 0 ? (
        <EmptyState message="일정이 없어요. 오른쪽 아래 + 버튼으로 추가해보세요!" />
      ) : (
        <div className="flex flex-col gap-2">
          {sorted.map(ev => {
            const days = getDaysUntil(ev.date)
            const daysText = days < 0 ? `${Math.abs(days)}일 지남` : days === 0 ? '오늘 마감' : `D-${days}`
            const daysUrgent = days <= 3 && !ev.done

            return (
              <div
                key={ev.id}
                className="flex items-start gap-3 rounded-xl border p-3.5 transition-shadow hover:shadow-[0_2px_12px_rgba(139,92,246,0.1)]"
                style={{
                  background: 'var(--surface)',
                  borderColor: 'var(--border)',
                  opacity: ev.done ? 0.55 : 1,
                }}
              >
                {/* Priority dot */}
                <span
                  className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{ background: PRIORITY_DOT[ev.priority] }}
                  aria-label={`우선순위: ${ev.priority}`}
                />

                {/* Check */}
                <button
                  onClick={() => onToggleDone(ev.id)}
                  className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all"
                  style={
                    ev.done
                      ? { background: 'var(--primary)', borderColor: 'var(--primary)' }
                      : { borderColor: 'var(--border)' }
                  }
                  aria-label={ev.done ? '완료 취소' : '완료 표시'}
                >
                  {ev.done && (
                    <svg className="h-3 w-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </button>

                {/* Body */}
                <div className="min-w-0 flex-1">
                  <div
                    className="mb-1 text-sm font-semibold leading-snug"
                    style={{
                      color: 'var(--text)',
                      textDecoration: ev.done ? 'line-through' : 'none',
                    }}
                  >
                    {ev.title}
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`subj-${ev.subj} rounded-full px-2 py-0.5 text-[11px] font-medium`}>
                      {SUBJECT_EMOJI[ev.subj] || ''} {ev.subj}
                    </span>
                    <span
                      className="rounded-full px-2 py-0.5 text-[11px] font-medium"
                      style={{ background: '#F1F5F9', color: '#475569' }}
                    >
                      {ev.type}
                    </span>
                    <span
                      className="text-[11px]"
                      style={{ color: daysUrgent ? '#EF4444' : 'var(--text-3)', fontWeight: daysUrgent ? 700 : 400 }}
                    >
                      {ev.date} · {daysText}
                    </span>
                  </div>
                  {ev.memo && (
                    <p className="mt-1 text-xs leading-relaxed" style={{ color: 'var(--text-2)' }}>
                      {ev.memo}
                    </p>
                  )}
                </div>

                {/* Delete */}
                <button
                  onClick={() => onDelete(ev.id)}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition-all hover:border-red-300 hover:bg-red-50 hover:text-red-500"
                  style={{ borderColor: 'var(--border)', color: 'var(--text-3)' }}
                  aria-label="일정 삭제"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="py-16 text-center" style={{ color: 'var(--text-3)' }}>
      <svg className="mx-auto mb-3 h-10 w-10 opacity-40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
      <p className="text-sm">{message}</p>
    </div>
  )
}
