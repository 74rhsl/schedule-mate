'use client'

import Link from 'next/link'
import { useState, useEffect, useCallback, useRef } from 'react'
import {
  ScheduleEvent, ActivityRecord, ClubRecord,
  loadEvents, saveEvents, loadActivities, saveActivities,
  loadClubs, saveClubs, getUpcomingDeadlines,
} from '@/lib/schedule-store'
import HeroSection from './HeroSection'
import CalendarTab from './CalendarTab'
import EventListTab from './EventListTab'
import ActivityTab from './ActivityTab'
import ClubTab from './ClubTab'
import AlertTab from './AlertTab'
import { AddEventModal, AddActivityModal, AddClubModal } from './Modals'
import { Plus } from 'lucide-react'

type TabKey = 'calendar' | 'list' | 'setech' | 'club' | 'alert'

const TABS: { key: TabKey; label: string }[] = [
  { key: 'calendar', label: '월간 달력' },
  { key: 'list', label: '일정 목록' },
  { key: 'setech', label: '세특·활동 기록' },
  { key: 'club', label: '동아리·프로그램' },
  { key: 'alert', label: '마감 알림' },
]

type ModalState =
  | { type: 'none' }
  | { type: 'event'; date?: string }
  | { type: 'activity' }
  | { type: 'club' }

export default function ScheduleMate() {
  const [events, setEvents] = useState<ScheduleEvent[]>([])
  const [activities, setActivities] = useState<ActivityRecord[]>([])
  const [clubs, setClubs] = useState<ClubRecord[]>([])
  const [activeTab, setActiveTab] = useState<TabKey>('calendar')
  const [modal, setModal] = useState<ModalState>({ type: 'none' })
  const [hydrated, setHydrated] = useState(false)
  const navRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setEvents(loadEvents())
    setActivities(loadActivities())
    setClubs(loadClubs())
    setHydrated(true)
  }, [])

  const deadlineCount = getUpcomingDeadlines(events).length

  /* ── Event handlers ── */
  const handleToggleDone = useCallback((id: number) => {
    setEvents(prev => {
      const next = prev.map(e => e.id === id ? { ...e, done: !e.done } : e)
      saveEvents(next)
      return next
    })
  }, [])

  const handleDeleteEvent = useCallback((id: number) => {
    setEvents(prev => {
      const next = prev.filter(e => e.id !== id)
      saveEvents(next)
      return next
    })
  }, [])

  const handleSaveEvent = useCallback((data: Omit<ScheduleEvent, 'id' | 'done'>) => {
    const ev: ScheduleEvent = { ...data, id: Date.now(), done: false }
    setEvents(prev => {
      const next = [...prev, ev]
      saveEvents(next)
      return next
    })
    setModal({ type: 'none' })
  }, [])

  const handleDeleteActivity = useCallback((id: number) => {
    setActivities(prev => {
      const next = prev.filter(a => a.id !== id)
      saveActivities(next)
      return next
    })
  }, [])

  const handleSaveActivity = useCallback((data: Omit<ActivityRecord, 'id'>) => {
    const a: ActivityRecord = { ...data, id: Date.now() }
    setActivities(prev => {
      const next = [...prev, a]
      saveActivities(next)
      return next
    })
    setModal({ type: 'none' })
  }, [])

  const handleDeleteClub = useCallback((name: string) => {
    setClubs(prev => {
      const next = prev.filter(c => c.name !== name)
      saveClubs(next)
      return next
    })
  }, [])

  const handleSaveClub = useCallback((data: Omit<ClubRecord, 'id'>) => {
    const c: ClubRecord = { ...data, id: Date.now() }
    setClubs(prev => {
      const next = [...prev, c]
      saveClubs(next)
      return next
    })
    setModal({ type: 'none' })
  }, [])

  const scrollToNav = () => {
    navRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const openFab = () => {
    if (activeTab === 'setech') setModal({ type: 'activity' })
    else if (activeTab === 'club') setModal({ type: 'club' })
    else setModal({ type: 'event' })
  }

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: 'var(--background)' }}>
        <div className="text-sm" style={{ color: 'var(--text-3)' }}>로딩 중...</div>
      </div>
    )
  }

  return (
    <>
      {/* Hero */}
      <HeroSection
        totalCount={events.length}
        doneCount={events.filter(e => e.done).length}
        deadlineCount={deadlineCount}
        activityCount={activities.length}
        onStart={scrollToNav}
      />

      {/* Sticky Nav */}
      <nav
        ref={navRef}
        className="sticky top-0 z-40 border-b"
        style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
        aria-label="메인 탭 메뉴"
      >
        <div className="mx-auto flex max-w-3xl overflow-x-auto px-4">
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              aria-current={activeTab === tab.key ? 'page' : undefined}
              className={[
                'relative flex shrink-0 items-center gap-1.5 whitespace-nowrap border-b-2 px-4 py-4',
                'text-[13px] font-medium transition-all duration-200 ease-out',
                'hover:-translate-y-0.5 hover:font-semibold',
                activeTab === tab.key
                  ? 'text-[var(--primary)] border-[var(--primary)]'
                  : 'text-[var(--text-2)] border-transparent hover:border-transparent hover:text-[var(--pink)]',
              ].join(' ')}
            >
              {tab.label}
              {tab.key === 'alert' && deadlineCount > 0 && (
                <span
                  className="flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold text-white"
                  style={{ background: '#F43F5E' }}
                  aria-label={`${deadlineCount}개 마감 임박`}
                >
                  {deadlineCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </nav>

      {/* Main content */}
      <main className="mx-auto max-w-3xl px-4 py-7">
        {activeTab === 'calendar' && (
          <CalendarTab
            events={events}
            onAddForDate={date => setModal({ type: 'event', date })}
          />
        )}
        {activeTab === 'list' && (
          <EventListTab
            events={events}
            onToggleDone={handleToggleDone}
            onDelete={handleDeleteEvent}
            onAdd={() => setModal({ type: 'event' })}
          />
        )}
        {activeTab === 'setech' && (
          <ActivityTab
            activities={activities}
            onDelete={handleDeleteActivity}
            onAdd={() => setModal({ type: 'activity' })}
          />
        )}
        {activeTab === 'club' && (
          <ClubTab
            clubs={clubs}
            onDelete={handleDeleteClub}
            onAdd={() => setModal({ type: 'club' })}
          />
        )}
        {activeTab === 'alert' && <AlertTab events={events} />}
      </main>

      {/* FAB */}
      <button
        onClick={openFab}
        className="fixed bottom-8 right-8 z-40 flex h-14 w-14 items-center justify-center rounded-full text-white shadow-[0_4px_20px_rgba(139,92,246,0.5)] transition-all hover:scale-110 active:scale-95"
        style={{ background: 'var(--primary)' }}
        aria-label="일정 추가"
      >
        <Plus className="h-6 w-6" />
      </button>

      {/* Footer */}
      <footer
        className="mt-16 px-8 pb-10 pt-10 text-center"
        style={{ background: '#1A0B2E' }}
      >
        <div
          className="mb-2 text-xl font-bold text-white"
          style={{ fontFamily: 'var(--font-playfair), "Playfair Display", serif' }}
        >
          숙명여고 스케줄 메이트
        </div>
        <div className="mb-5 text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
          Sookmyung Girls&apos; High School · Schedule Mate
        </div>
        <div className="mb-5 flex flex-wrap justify-center gap-6">
          <Link
            href="/guide"
            className="inline-block text-xs font-medium text-white/40 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:font-semibold hover:text-[var(--pink)]"
          >
            이용 안내
          </Link>
          <a
            href="https://sookmyung.riroschool.kr/user.php?action=signin"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-xs font-medium text-white/40 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:font-semibold hover:text-[var(--pink)]"
          >
            리로스쿨 입장
          </a>
        </div>
        <div
          className="border-t pt-5 text-[11px]"
          style={{ borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)' }}
        >
          © 2026 숙명여자고등학교. 11410 박소윤 자체 제작 프로젝트. All rights reserved.
        </div>
      </footer>

      {/* Modals */}
      {modal.type === 'event' && (
        <AddEventModal
          initialDate={modal.type === 'event' ? modal.date : undefined}
          onSave={handleSaveEvent}
          onClose={() => setModal({ type: 'none' })}
        />
      )}
      {modal.type === 'activity' && (
        <AddActivityModal
          onSave={handleSaveActivity}
          onClose={() => setModal({ type: 'none' })}
        />
      )}
      {modal.type === 'club' && (
        <AddClubModal
          onSave={handleSaveClub}
          onClose={() => setModal({ type: 'none' })}
        />
      )}
    </>
  )
}
