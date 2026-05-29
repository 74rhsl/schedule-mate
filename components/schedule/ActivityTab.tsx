'use client'

import { ActivityRecord, SUBJECT_EMOJI } from '@/lib/schedule-store'
import { Trash2 } from 'lucide-react'

interface ActivityTabProps {
  activities: ActivityRecord[]
  onDelete: (id: number) => void
  onAdd: () => void
}

export default function ActivityTab({ activities, onDelete, onAdd }: ActivityTabProps) {
  const sorted = [...activities].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-base font-bold" style={{ color: 'var(--text)' }}>
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
          </svg>
          세특·활동 기록
        </h2>
        <button
          onClick={onAdd}
          className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium text-white transition-all hover:opacity-90"
          style={{ background: 'var(--primary)' }}
        >
          <span aria-hidden="true">+</span> 기록 추가
        </button>
      </div>

      {sorted.length === 0 ? (
        <div className="py-16 text-center" style={{ color: 'var(--text-3)' }}>
          <svg className="mx-auto mb-3 h-10 w-10 opacity-40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
          </svg>
          <p className="text-sm">세특·활동 기록을 추가해보세요!</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {sorted.map(a => (
            <div
              key={a.id}
              className="rounded-2xl border p-5"
              style={{
                background: 'var(--surface)',
                borderColor: 'var(--border)',
                borderLeft: '4px solid var(--primary)',
              }}
            >
              <div className="mb-2.5 flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`subj-${a.subj} rounded-full px-2 py-0.5 text-[11px] font-medium`}>
                      {SUBJECT_EMOJI[a.subj] || ''} {a.subj}
                    </span>
                  </div>
                  <h3 className="mt-1.5 text-[15px] font-bold leading-snug" style={{ color: 'var(--text)' }}>
                    {a.title}
                  </h3>
                  <p className="mt-0.5 text-[11px]" style={{ color: 'var(--text-3)' }}>{a.date}</p>
                </div>
                <button
                  onClick={() => onDelete(a.id)}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition-all hover:border-red-300 hover:bg-red-50 hover:text-red-500"
                  style={{ borderColor: 'var(--border)', color: 'var(--text-3)' }}
                  aria-label="기록 삭제"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>

              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-2)' }}>
                {a.content}
              </p>

              {a.tags && a.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {a.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="rounded-full px-2.5 py-0.5 text-[11px] font-medium"
                      style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
