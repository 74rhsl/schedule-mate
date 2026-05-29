'use client'

import { useState } from 'react'
import { ScheduleEvent, SUBJECT_EMOJI, CORE_SUBJECTS } from '@/lib/schedule-store'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const MONTH_NAMES = ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월']
const DAY_LABELS = ['일','월','화','수','목','금','토']

interface CalendarTabProps {
  events: ScheduleEvent[]
  onAddForDate: (date: string) => void
}

export default function CalendarTab({ events, onAddForDate }: CalendarTabProps) {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1) }
    else setMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1) }
    else setMonth(m => m + 1)
  }

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrev = new Date(year, month, 0).getDate()

  type Cell = { day: number; cur: boolean }
  const cells: Cell[] = []
  for (let i = firstDay - 1; i >= 0; i--) cells.push({ day: daysInPrev - i, cur: false })
  for (let i = 1; i <= daysInMonth; i++) cells.push({ day: i, cur: true })
  const rem = 42 - cells.length
  for (let i = 1; i <= rem; i++) cells.push({ day: i, cur: false })

  const usedSubjects = [...new Set(events.map(e => e.subj))]
  const legendSubjects = [...new Set([...CORE_SUBJECTS, ...usedSubjects])]

  return (
    <div>
      {/* Tip banner */}
      <div
        className="mb-5 flex items-center gap-2.5 rounded-xl border px-4 py-3 text-sm font-medium"
        style={{ background: 'linear-gradient(135deg, var(--primary-light), #FCE7F3)', borderColor: '#DDD6FE', color: 'var(--primary-dark)' }}
      >
        <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
        날짜 셀을 클릭하면 해당 날짜에 일정을 빠르게 추가할 수 있어요!
      </div>

      {/* Calendar header */}
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-bold" style={{ color: 'var(--text)' }}>
          {year}년 {MONTH_NAMES[month]}
        </h2>
        <div className="flex items-center gap-1.5">
          <button
            onClick={prevMonth}
            className="flex h-9 w-9 items-center justify-center rounded-lg border transition-all hover:border-purple-400 hover:bg-purple-50 hover:text-purple-600"
            style={{ borderColor: 'var(--border)', color: 'var(--text-2)' }}
            aria-label="이전 달"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="min-w-[80px] text-center text-sm font-semibold" style={{ color: 'var(--text)' }}>
            {year}.{String(month + 1).padStart(2, '0')}
          </span>
          <button
            onClick={nextMonth}
            className="flex h-9 w-9 items-center justify-center rounded-lg border transition-all hover:border-purple-400 hover:bg-purple-50 hover:text-purple-600"
            style={{ borderColor: 'var(--border)', color: 'var(--text-2)' }}
            aria-label="다음 달"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Day labels */}
      <div className="mb-1 grid grid-cols-7">
        {DAY_LABELS.map((d, i) => (
          <div
            key={d}
            className="py-1.5 text-center text-[11px] font-semibold tracking-wide"
            style={{ color: i === 0 ? '#EF4444' : i === 6 ? '#3B82F6' : 'var(--text-3)' }}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div
        className="grid grid-cols-7 overflow-hidden rounded-xl border"
        style={{ background: 'var(--border)', borderColor: 'var(--border)', gap: '1px' }}
      >
        {cells.map((cell, idx) => {
          const dow = idx % 7
          const dateStr = cell.cur
            ? `${year}-${String(month + 1).padStart(2, '0')}-${String(cell.day).padStart(2, '0')}`
            : null
          const dayEvents = dateStr ? events.filter(e => e.date === dateStr) : []
          const isToday =
            cell.cur &&
            cell.day === today.getDate() &&
            year === today.getFullYear() &&
            month === today.getMonth()

          return (
            <div
              key={idx}
              className="min-h-[88px] cursor-pointer p-1.5 transition-colors"
              style={{
                background: isToday
                  ? '#F5F0FF'
                  : cell.cur
                  ? 'var(--surface)'
                  : '#FAFAF8',
              }}
              onClick={() => dateStr && onAddForDate(dateStr)}
              role={dateStr ? 'button' : undefined}
              aria-label={dateStr ? `${dateStr} 일정 추가` : undefined}
            >
              {/* Date number */}
              <div
                className="mb-1 flex h-6 w-6 items-center justify-center text-xs font-medium"
                style={
                  isToday
                    ? { background: 'var(--primary)', color: '#fff', borderRadius: '50%', fontWeight: 700 }
                    : { color: dow === 0 ? '#EF4444' : dow === 6 ? '#3B82F6' : cell.cur ? 'var(--text)' : 'var(--text-3)' }
                }
              >
                {cell.day}
              </div>

              {/* Events */}
              {dateStr && (
                <div className="flex flex-col gap-0.5">
                  {dayEvents.slice(0, 3).map(ev => (
                    <div
                      key={ev.id}
                      className={`subj-${ev.subj} truncate rounded px-1 py-0.5 text-[10px] font-medium leading-tight`}
                      style={{ opacity: ev.done ? 0.4 : 1 }}
                      title={ev.title}
                    >
                      {ev.title}
                    </div>
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="px-1 text-[10px]" style={{ color: 'var(--text-3)' }}>
                      +{dayEvents.length - 3}개 더
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Legend */}
      {legendSubjects.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {legendSubjects.map(subj => (
            <span
              key={subj}
              className={`subj-${subj} rounded-full px-2.5 py-1 text-[11px] font-medium`}
            >
              {SUBJECT_EMOJI[subj] || ''} {subj}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
