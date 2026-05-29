'use client'

import Link from 'next/link'
import { Shield } from 'lucide-react'
import { ShaderAnimation } from '@/components/ui/shader-animation'
import SookmyungMark from './SookmyungMark'

interface HeroSectionProps {
  totalCount: number
  doneCount: number
  deadlineCount: number
  activityCount: number
  onStart: () => void
}

export default function HeroSection({
  totalCount,
  doneCount,
  deadlineCount,
  activityCount,
  onStart,
}: HeroSectionProps) {
  return (
    <section className="relative w-full">
      <div className="px-4 pt-6 md:px-6 md:pt-8">
        <div className="relative flex h-[650px] w-full flex-col items-center justify-center overflow-hidden rounded-xl border border-purple-900/40 bg-[#1A0B2E] shadow-xl">
          <ShaderAnimation className="absolute inset-0" />

          <div className="pointer-events-none relative z-10 flex max-w-3xl flex-col items-center px-4 text-center">
            <a
              href="https://sm.sen.hs.kr/"
              target="_blank"
              rel="noopener noreferrer"
              className="pointer-events-auto mb-5 inline-block transition-transform hover:scale-105"
              aria-label="숙명여자고등학교 홈페이지로 이동"
            >
              <SookmyungMark
                size={72}
                className="shadow-[0_4px_24px_rgba(0,0,0,0.35)] ring-2 ring-white/30"
              />
            </a>

            <div className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/30 px-4 py-1.5 text-xs tracking-wide text-white/90 backdrop-blur-sm">
              <Shield className="h-3 w-3" aria-hidden="true" />
              숙명여자고등학교 공식 일정 관리
            </div>

            <h1
              className="text-5xl font-semibold leading-none tracking-tighter text-white md:text-7xl"
              style={{
                fontFamily: 'var(--font-playfair), "Playfair Display", serif',
              }}
            >
              Schedule{' '}
              <span className="text-pink-300">Mate</span>
            </h1>
            <p className="mt-4 max-w-lg text-sm text-white/75 md:text-base">
              숙명여고 스케줄 메이트 — 수행평가 · 세특 활동 · 동아리 · 숙제를
              한곳에서 관리하세요.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-8 md:gap-10">
              <StatItem num={totalCount} label="전체 일정" />
              <StatItem num={doneCount} label="완료" />
              <StatItem num={deadlineCount} label="마감 임박" />
              <StatItem num={activityCount} label="세특 기록" />
            </div>

            <div className="pointer-events-auto mt-8 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={onStart}
                className="rounded-full bg-white px-7 py-3 text-sm font-medium text-purple-700 transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.3)]"
              >
                지금 시작하기
              </button>
              <Link
                href="/guide"
                className="rounded-full border border-white/20 bg-white/10 px-7 py-3 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white/20"
              >
                사용 가이드
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="pointer-events-none relative -mt-px" aria-hidden="true">
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" height="60" className="block w-full">
          <path d="M0,40 C360,80 1080,0 1440,40 L1440,60 L0,60 Z" fill="#FAFAF8" />
        </svg>
      </div>
    </section>
  )
}

function StatItem({ num, label }: { num: number; label: string }) {
  return (
    <div className="drop-shadow-md">
      <div className="text-2xl font-bold text-white md:text-3xl">{num}</div>
      <div className="mt-0.5 text-[11px] tracking-wide text-white/60">{label}</div>
    </div>
  )
}
