'use client'

import { useState, useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import {
  ScheduleEvent, ActivityRecord, ClubRecord,
  SUBJECTS, ACTIVITY_SUBJECTS, Priority, SubjectKey, EventType,
} from '@/lib/schedule-store'

/* ─── Shared overlay ─────────────────────────────────── */
function ModalOverlay({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  const overlayRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.45)' }}
      onClick={e => { if (e.target === overlayRef.current) onClose() }}
      role="dialog"
      aria-modal="true"
    >
      {children}
    </div>
  )
}

function ModalShell({ title, icon, onClose, children }: {
  title: string; icon: React.ReactNode; onClose: () => void; children: React.ReactNode
}) {
  return (
    <div
      className="w-full max-w-md overflow-y-auto rounded-2xl p-7"
      style={{ background: 'var(--surface)', maxHeight: '90vh' }}
    >
      <div className="mb-5 flex items-center gap-2">
        <span style={{ color: 'var(--primary)' }}>{icon}</span>
        <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>{title}</h2>
        <button
          onClick={onClose}
          className="ml-auto flex h-8 w-8 items-center justify-center rounded-lg border transition hover:bg-gray-100"
          style={{ borderColor: 'var(--border)', color: 'var(--text-3)' }}
          aria-label="닫기"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      {children}
    </div>
  )
}

function FormGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-3.5">
      <label className="mb-1.5 block text-[11px] font-semibold tracking-wide" style={{ color: 'var(--text-2)' }}>
        {label}
      </label>
      {children}
    </div>
  )
}

const inputCls = [
  'w-full rounded-lg border px-3 py-2 text-sm font-sans transition focus:outline-none',
].join(' ')
const inputStyle = { borderColor: 'var(--border)', color: 'var(--text)', background: 'var(--surface)', fontFamily: 'inherit' }
const inputFocusStyle = { borderColor: 'var(--primary)' }

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const [focused, setFocused] = useState(false)
  return (
    <input
      {...props}
      className={inputCls + ' ' + (props.className || '')}
      style={{ ...inputStyle, ...(focused ? inputFocusStyle : {}), ...props.style }}
      onFocus={e => { setFocused(true); props.onFocus?.(e) }}
      onBlur={e => { setFocused(false); props.onBlur?.(e) }}
    />
  )
}

function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  const [focused, setFocused] = useState(false)
  return (
    <select
      {...props}
      className={inputCls + ' appearance-none ' + (props.className || '')}
      style={{ ...inputStyle, ...(focused ? inputFocusStyle : {}), ...props.style }}
      onFocus={e => { setFocused(true); props.onFocus?.(e) }}
      onBlur={e => { setFocused(false); props.onBlur?.(e) }}
    />
  )
}

function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const [focused, setFocused] = useState(false)
  return (
    <textarea
      {...props}
      className={inputCls + ' resize-y ' + (props.className || '')}
      style={{ ...inputStyle, ...(focused ? inputFocusStyle : {}), minHeight: 80, ...props.style }}
      onFocus={e => { setFocused(true); props.onFocus?.(e) }}
      onBlur={e => { setFocused(false); props.onBlur?.(e) }}
    />
  )
}

function ModalActions({ onSave, onClose }: { onSave: () => void; onClose: () => void }) {
  return (
    <div className="mt-5 flex gap-2">
      <button
        onClick={onSave}
        className="flex-1 rounded-lg py-2.5 text-sm font-medium text-white transition hover:opacity-90"
        style={{ background: 'var(--primary)' }}
      >
        저장
      </button>
      <button
        onClick={onClose}
        className="flex-1 rounded-lg border py-2.5 text-sm font-medium transition hover:bg-gray-50"
        style={{ borderColor: 'var(--border)', color: 'var(--text-2)' }}
      >
        취소
      </button>
    </div>
  )
}

/* ─── Add Event Modal ───────────────────────────────── */
interface AddEventModalProps {
  initialDate?: string
  onSave: (ev: Omit<ScheduleEvent, 'id' | 'done'>) => void
  onClose: () => void
}

export function AddEventModal({ initialDate, onSave, onClose }: AddEventModalProps) {
  const today = new Date().toISOString().split('T')[0]
  const [title, setTitle] = useState('')
  const [subj, setSubj] = useState<SubjectKey>('국어')
  const [type, setType] = useState<EventType>('수행평가')
  const [date, setDate] = useState(initialDate || today)
  const [time, setTime] = useState('23:59')
  const [priority, setPriority] = useState<Priority>('med')
  const [memo, setMemo] = useState('')

  useEffect(() => { if (initialDate) setDate(initialDate) }, [initialDate])

  const priorityConfig = [
    { key: 'high' as Priority, label: '높음', bg: '#FEE2E2', color: '#991B1B', selBorder: '#FCA5A5' },
    { key: 'med' as Priority, label: '중간', bg: '#FEF3C7', color: '#92400E', selBorder: '#FCD34D' },
    { key: 'low' as Priority, label: '낮음', bg: '#D1FAE5', color: '#065F46', selBorder: '#6EE7B7' },
  ]

  const handleSave = () => {
    if (!title.trim() || !date) { alert('제목과 날짜를 입력해주세요!'); return }
    onSave({ title: title.trim(), subj, type, date, time, priority, memo: memo.trim() })
  }

  return (
    <ModalOverlay onClose={onClose}>
      <ModalShell
        title="일정 추가"
        onClose={onClose}
        icon={
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" /><line x1="12" y1="14" x2="12" y2="18" />
            <line x1="10" y1="16" x2="14" y2="16" />
          </svg>
        }
      >
        <FormGroup label="일정 제목 *">
          <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="예: 문학 수행평가 제출" />
        </FormGroup>

        <div className="grid grid-cols-2 gap-2.5">
          <FormGroup label="과목">
            <Select value={subj} onChange={e => setSubj(e.target.value as SubjectKey)}>
              {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
            </Select>
          </FormGroup>
          <FormGroup label="유형">
            <Select value={type} onChange={e => setType(e.target.value as EventType)}>
              <option value="수행평가">수행평가</option>
              <option value="숙제">숙제</option>
              <option value="세특">세특 활동</option>
              <option value="동아리">동아리</option>
              <option value="행사">행사/특색</option>
              <option value="기타">기타</option>
            </Select>
          </FormGroup>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <FormGroup label="날짜 *">
            <Input type="date" value={date} onChange={e => setDate(e.target.value)} />
          </FormGroup>
          <FormGroup label="마감 시간">
            <Input type="time" value={time} onChange={e => setTime(e.target.value)} />
          </FormGroup>
        </div>

        <FormGroup label="우선순위">
          <div className="flex gap-2">
            {priorityConfig.map(p => (
              <button
                key={p.key}
                onClick={() => setPriority(p.key)}
                className="flex-1 rounded-lg border py-1.5 text-xs font-medium transition"
                style={
                  priority === p.key
                    ? { background: p.bg, color: p.color, borderColor: p.selBorder }
                    : { borderColor: 'var(--border)', color: 'var(--text-2)' }
                }
              >
                {p.label}
              </button>
            ))}
          </div>
        </FormGroup>

        <FormGroup label="메모">
          <Textarea value={memo} onChange={e => setMemo(e.target.value)} placeholder="세부 내용, 준비물 등을 적어주세요" rows={3} />
        </FormGroup>

        <ModalActions onSave={handleSave} onClose={onClose} />
      </ModalShell>
    </ModalOverlay>
  )
}

/* ─── Activity Modal ───────────────────────────────── */
interface AddActivityModalProps {
  onSave: (a: Omit<ActivityRecord, 'id'>) => void
  onClose: () => void
}

export function AddActivityModal({ onSave, onClose }: AddActivityModalProps) {
  const today = new Date().toISOString().split('T')[0]
  const [title, setTitle] = useState('')
  const [subj, setSubj] = useState('과학')
  const [date, setDate] = useState(today)
  const [content, setContent] = useState('')
  const [tagsRaw, setTagsRaw] = useState('')

  const handleSave = () => {
    if (!title.trim() || !date) { alert('제목과 날짜를 입력해주세요!'); return }
    const tags = tagsRaw ? tagsRaw.split(',').map(t => t.trim()).filter(Boolean) : []
    onSave({ title: title.trim(), subj, date, content: content.trim(), tags })
  }

  return (
    <ModalOverlay onClose={onClose}>
      <ModalShell
        title="세특·활동 기록"
        onClose={onClose}
        icon={
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
          </svg>
        }
      >
        <FormGroup label="활동 제목 *">
          <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="예: 환경 문제 탐구 발표" />
        </FormGroup>

        <div className="grid grid-cols-2 gap-2.5">
          <FormGroup label="과목/분야">
            <Select value={subj} onChange={e => setSubj(e.target.value)}>
              {ACTIVITY_SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
            </Select>
          </FormGroup>
          <FormGroup label="날짜 *">
            <Input type="date" value={date} onChange={e => setDate(e.target.value)} />
          </FormGroup>
        </div>

        <FormGroup label="활동 내용 *">
          <Textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="활동 내용, 배운 점, 느낀 점을 자세히 적어주세요. 세특 작성 시 참고 자료가 됩니다."
            rows={4}
            style={{ minHeight: 100 }}
          />
        </FormGroup>

        <FormGroup label="태그 (쉼표로 구분)">
          <Input value={tagsRaw} onChange={e => setTagsRaw(e.target.value)} placeholder="예: 탐구, 발표, 환경, 협업" />
        </FormGroup>

        <ModalActions onSave={handleSave} onClose={onClose} />
      </ModalShell>
    </ModalOverlay>
  )
}

/* ─── Club Modal ───────────────────────────────────── */
interface AddClubModalProps {
  onSave: (c: Omit<ClubRecord, 'id'>) => void
  onClose: () => void
}

export function AddClubModal({ onSave, onClose }: AddClubModalProps) {
  const today = new Date().toISOString().split('T')[0]
  const [name, setName] = useState('')
  const [type, setType] = useState('동아리')
  const [date, setDate] = useState(today)
  const [emoji, setEmoji] = useState('')
  const [content, setContent] = useState('')

  const handleSave = () => {
    if (!name.trim() || !date) { alert('이름과 날짜를 입력해주세요!'); return }
    onSave({ name: name.trim(), type, emoji: emoji || '🌟', date, content: content.trim() })
  }

  return (
    <ModalOverlay onClose={onClose}>
      <ModalShell
        title="동아리·프로그램 활동"
        onClose={onClose}
        icon={
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        }
      >
        <div className="grid grid-cols-2 gap-2.5">
          <FormGroup label="동아리/프로그램명 *">
            <Input value={name} onChange={e => setName(e.target.value)} placeholder="예: 환경 탐구반" />
          </FormGroup>
          <FormGroup label="유형">
            <Select value={type} onChange={e => setType(e.target.value)}>
              <option value="동아리">교내 동아리</option>
              <option value="자율동아리">자율 동아리</option>
              <option value="특색프로그램">특색 프로그램</option>
              <option value="진로프로그램">진로 프로그램</option>
            </Select>
          </FormGroup>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <FormGroup label="날짜 *">
            <Input type="date" value={date} onChange={e => setDate(e.target.value)} />
          </FormGroup>
          <FormGroup label="이모지 (선택)">
            <Input value={emoji} onChange={e => setEmoji(e.target.value)} placeholder="🔬" />
          </FormGroup>
        </div>

        <FormGroup label="활동 내용">
          <Textarea value={content} onChange={e => setContent(e.target.value)} placeholder="활동 내용을 적어주세요" rows={3} />
        </FormGroup>

        <ModalActions onSave={handleSave} onClose={onClose} />
      </ModalShell>
    </ModalOverlay>
  )
}
