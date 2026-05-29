'use client'

export type SubjectKey =
  | '국어' | '수학' | '영어' | '과학' | '사회' | '역사'
  | '음악' | '체육' | '미술' | '동아리' | '세특' | '행사' | '기타'

export type EventType = '수행평가' | '숙제' | '세특' | '동아리' | '행사' | '기타'
export type Priority = 'high' | 'med' | 'low'

export interface ScheduleEvent {
  id: number
  title: string
  subj: SubjectKey
  type: EventType
  date: string // YYYY-MM-DD
  time: string // HH:MM
  priority: Priority
  memo: string
  done: boolean
}

export interface ActivityRecord {
  id: number
  title: string
  subj: string
  date: string
  content: string
  tags: string[]
}

export interface ClubRecord {
  id: number
  name: string
  type: string
  emoji: string
  date: string
  content: string
}

export const SUBJECTS: SubjectKey[] = [
  '국어', '수학', '영어', '과학', '사회', '역사',
  '음악', '체육', '미술', '동아리', '세특', '행사', '기타',
]

/** 달력 범례·예시 일정에 표시하는 주요 교과 */
export const CORE_SUBJECTS: SubjectKey[] = ['국어', '수학', '영어', '과학', '사회']

export const ACTIVITY_SUBJECTS = [
  '국어', '수학', '영어', '과학', '사회', '역사',
  '동아리', '자율', '진로', '봉사',
]

export const SUBJECT_EMOJI: Record<string, string> = {
  국어: '📖', 수학: '📐', 영어: '🌏', 과학: '🔬', 사회: '🌍',
  역사: '📜', 음악: '🎵', 체육: '⚽', 미술: '🎨', 동아리: '🌟',
  세특: '✨', 행사: '🎉', 기타: '📌', 자율: '🏫', 진로: '🧭', 봉사: '🤝',
}

function getSeedEvents(): ScheduleEvent[] {
  const today = new Date()
  const y = today.getFullYear()
  const m = String(today.getMonth() + 1).padStart(2, '0')
  const pad = (n: number) => String(Math.min(n, 28)).padStart(2, '0')
  return [
    { id: 1, title: '문학 수행평가 제출', subj: '국어', type: '수행평가', date: `${y}-${m}-${pad(today.getDate() + 3)}`, time: '23:59', priority: 'high', memo: '시 분석 3편 작성', done: false },
    { id: 2, title: '미적분 단원 숙제', subj: '수학', type: '숙제', date: `${y}-${m}-${pad(today.getDate() + 3)}`, time: '23:59', priority: 'med', memo: 'p.142 ~ 150', done: false },
    { id: 3, title: '영어 에세이 초안', subj: '영어', type: '수행평가', date: `${y}-${m}-${pad(today.getDate() + 7)}`, time: '18:00', priority: 'high', memo: '환경 주제 500단어', done: false },
    { id: 4, title: '화학 실험 보고서', subj: '과학', type: '세특', date: `${y}-${m}-${pad(today.getDate() + 14)}`, time: '23:59', priority: 'med', memo: '산화환원 반응 실험', done: false },
    { id: 5, title: '경제·지리 탐구 보고서', subj: '사회', type: '수행평가', date: `${y}-${m}-${pad(today.getDate() + 10)}`, time: '23:59', priority: 'med', memo: '지역 사회 문제 분석 및 해결 방안 제시', done: false },
  ]
}

function getSeedActivities(): ActivityRecord[] {
  const today = new Date()
  const y = today.getFullYear()
  const m = String(today.getMonth() + 1).padStart(2, '0')
  return [
    { id: 1, title: '탄소중립 탐구 발표', subj: '과학', date: `${y}-${m}-15`, content: '기후변화와 탄소중립의 관계를 조사하고 우리 학교에서 실천할 수 있는 방안을 탐구하여 발표함. 태양광 패널 설치 효과를 수치로 분석하는 역량을 기름.', tags: ['탐구', '발표', '환경', '과학적사고'] },
    { id: 2, title: '영어 토론 대회 참가', subj: '영어', date: `${y}-${m}-10`, content: 'AI 기술의 윤리적 문제를 주제로 영어 토론 대회에 참가. 찬성 측 주장을 체계적으로 구성하고 반론을 효과적으로 제시하는 경험을 쌓음.', tags: ['토론', '영어', 'AI윤리'] },
    { id: 3, title: '지역 사회 문제 토론', subj: '사회', date: `${y}-${m}-12`, content: '저출산·고령화가 지역 경제에 미치는 영향을 조사하고, 지역 공동체 활성화 방안을 토론함. 사회 현상을 다각도로 분석하는 역량을 기름.', tags: ['토론', '사회', '지역사회'] },
  ]
}

function getSeedClubs(): ClubRecord[] {
  const today = new Date()
  const y = today.getFullYear()
  const m = String(today.getMonth() + 1).padStart(2, '0')
  return [
    { id: 1, name: '환경 탐구반', type: '동아리', emoji: '🌿', date: `${y}-${m}-20`, content: '교내 에너지 사용량 분석 프로젝트 진행' },
    { id: 2, name: '진로 탐색 프로그램', type: '특색프로그램', emoji: '🚀', date: `${y}-${m}-25`, content: '직업 인터뷰 및 진로 포트폴리오 작성' },
  ]
}

function appendMissingCoreSubjectEvent(events: ScheduleEvent[]): ScheduleEvent[] {
  const hasSocial = events.some(e => e.subj === '사회')
  if (hasSocial) return events
  const socialSeed = getSeedEvents().find(e => e.subj === '사회')
  if (!socialSeed) return events
  const next = [...events, { ...socialSeed, id: Date.now() }]
  saveEvents(next)
  return next
}

export function loadEvents(): ScheduleEvent[] {
  try {
    const raw = localStorage.getItem('sm_events')
    if (raw) return appendMissingCoreSubjectEvent(JSON.parse(raw))
  } catch {}
  const seed = getSeedEvents()
  saveEvents(seed)
  return seed
}

export function saveEvents(data: ScheduleEvent[]) {
  try { localStorage.setItem('sm_events', JSON.stringify(data)) } catch {}
}

export function loadActivities(): ActivityRecord[] {
  try {
    const raw = localStorage.getItem('sm_activities')
    if (raw) return JSON.parse(raw)
  } catch {}
  const seed = getSeedActivities()
  saveActivities(seed)
  return seed
}

export function saveActivities(data: ActivityRecord[]) {
  try { localStorage.setItem('sm_activities', JSON.stringify(data)) } catch {}
}

export function loadClubs(): ClubRecord[] {
  try {
    const raw = localStorage.getItem('sm_clubs')
    if (raw) return JSON.parse(raw)
  } catch {}
  const seed = getSeedClubs()
  saveClubs(seed)
  return seed
}

export function saveClubs(data: ClubRecord[]) {
  try { localStorage.setItem('sm_clubs', JSON.stringify(data)) } catch {}
}

export function getDaysUntil(dateStr: string): number {
  const today = new Date(); today.setHours(0, 0, 0, 0)
  const d = new Date(dateStr); d.setHours(0, 0, 0, 0)
  return Math.round((d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}

export function getUpcomingDeadlines(events: ScheduleEvent[]): ScheduleEvent[] {
  const today = new Date(); today.setHours(0, 0, 0, 0)
  const soon = new Date(today); soon.setDate(soon.getDate() + 7)
  return events.filter(e => {
    if (e.done) return false
    const d = new Date(e.date)
    return d >= today && d <= soon
  })
}
