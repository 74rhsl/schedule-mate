import type { Metadata } from 'next'
import UsageGuide from '@/components/guide/UsageGuide'

export const metadata: Metadata = {
  title: '사용 가이드 | 숙명여고 스케줄 메이트',
  description: 'Schedule Mate 사용 방법 안내 — 달력, 일정, 세특·활동 기록, 동아리, 마감 알림',
}

export default function GuidePage() {
  return <UsageGuide />
}
