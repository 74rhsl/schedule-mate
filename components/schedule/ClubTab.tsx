'use client'

import { ClubRecord } from '@/lib/schedule-store'
import { Trash2 } from 'lucide-react'

interface ClubTabProps {
  clubs: ClubRecord[]
  onDelete: (name: string) => void
  onAdd: () => void
}

interface GroupedClub {
  name: string
  type: string
  emoji: string
  sessions: ClubRecord[]
}

export default function ClubTab({ clubs, onDelete, onAdd }: ClubTabProps) {
  const grouped: Record<string, GroupedClub> = {}
  clubs.forEach(c => {
    if (!grouped[c.name]) {
      grouped[c.name] = { name: c.name, type: c.type, emoji: c.emoji, sessions: [] }
    }
    grouped[c.name].sessions.push(c)
  })

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-base font-bold" style={{ color: 'var(--text)' }}>
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          동아리·특색 프로그램
        </h2>
        <button
          onClick={onAdd}
          className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium text-white transition-all hover:opacity-90"
          style={{ background: 'var(--primary)' }}
        >
          <span aria-hidden="true">+</span> 활동 추가
        </button>
      </div>

      {Object.keys(grouped).length === 0 ? (
        <div className="py-16 text-center" style={{ color: 'var(--text-3)' }}>
          <svg className="mx-auto mb-3 h-10 w-10 opacity-40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          <p className="text-sm">동아리·프로그램 활동을 추가해보세요!</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {Object.values(grouped).map(g => (
            <div
              key={g.name}
              className="rounded-2xl border p-5"
              style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
            >
              <div className="mb-4 flex items-center gap-3">
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl"
                  style={{ background: 'var(--primary-light)' }}
                  aria-hidden="true"
                >
                  {g.emoji || '🌟'}
                </div>
                <div className="flex-1">
                  <div className="text-base font-bold" style={{ color: 'var(--text)' }}>{g.name}</div>
                  <div className="text-[11px]" style={{ color: 'var(--text-3)' }}>
                    {g.type} · {g.sessions.length}회 기록
                  </div>
                </div>
                <button
                  onClick={() => onDelete(g.name)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border transition-all hover:border-red-300 hover:bg-red-50 hover:text-red-500"
                  style={{ borderColor: 'var(--border)', color: 'var(--text-3)' }}
                  aria-label={`${g.name} 삭제`}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="flex flex-col gap-1.5">
                {g.sessions.map((s, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2"
                    style={{ background: 'var(--background)' }}
                  >
                    <span
                      className="h-2 w-2 shrink-0 rounded-full"
                      style={{ background: 'var(--primary)' }}
                      aria-hidden="true"
                    />
                    <div className="flex-1">
                      <div className="text-xs font-semibold" style={{ color: 'var(--text)' }}>{s.content}</div>
                      <div className="text-[11px]" style={{ color: 'var(--text-3)' }}>{s.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
