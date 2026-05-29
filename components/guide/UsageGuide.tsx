import Link from 'next/link'
import {
  ArrowLeft,
  Bell,
  BookOpen,
  Calendar,
  CheckCircle2,
  ClipboardList,
  Lightbulb,
  Plus,
  Sparkles,
  Users,
} from 'lucide-react'

const SECTIONS = [
  {
    id: 'intro',
    icon: BookOpen,
    title: 'Schedule Mate란?',
    content: (
      <>
        <p>
          <strong>숙명여고 스케줄 메이트(Schedule Mate)</strong>는 수행평가, 숙제, 세특 활동, 동아리·특색 프로그램 등
          고등학교 생활의 일정과 기록을 한곳에서 관리하는 웹 서비스입니다.
        </p>
        <p className="mt-3">
          별도 회원가입 없이 브라우저에서 바로 사용할 수 있으며, 입력한 내용은 이 기기의 브라우저에 저장됩니다.
        </p>
      </>
    ),
  },
  {
    id: 'start',
    icon: Sparkles,
    title: '시작하기',
    content: (
      <ol className="list-decimal space-y-2 pl-5">
        <li>메인 화면에서 <strong>「지금 시작하기」</strong>를 누르면 탭 메뉴로 이동합니다.</li>
        <li>상단 탭에서 원하는 기능(달력, 일정 목록 등)을 선택합니다.</li>
        <li>오른쪽 아래 <strong>보라색 + 버튼(FAB)</strong>으로 일정·기록을 추가합니다.</li>
        <li>처음 접속 시 예시 일정·활동 데이터가 표시될 수 있습니다. 필요 없으면 각 항목에서 삭제하세요.</li>
      </ol>
    ),
  },
  {
    id: 'calendar',
    icon: Calendar,
    title: '월간 달력',
    content: (
      <ul className="list-disc space-y-2 pl-5">
        <li>한 달 단위로 일정을 색상·과목 이모지와 함께 확인할 수 있습니다.</li>
        <li>◀ ▶ 버튼으로 이전·다음 달로 이동합니다.</li>
        <li>
          <strong>날짜 셀을 클릭</strong>하면 해당 날짜가 미리 선택된 상태로 「일정 추가」 창이 열립니다.
        </li>
        <li>달력 하단 범례에서 현재 등록된 과목을 확인할 수 있습니다.</li>
      </ul>
    ),
  },
  {
    id: 'list',
    icon: ClipboardList,
    title: '일정 목록',
    content: (
      <ul className="list-disc space-y-2 pl-5">
        <li>등록한 모든 일정을 날짜순으로 볼 수 있습니다.</li>
        <li>상단 필터로 <strong>전체 · 수행평가 · 숙제 · 세특 · 동아리 · 행사 · 완료됨</strong>만 골라 볼 수 있습니다.</li>
        <li>체크박스를 누르면 완료 처리되며, 휴지통 아이콘으로 삭제할 수 있습니다.</li>
        <li>우선순위(높음·보통·낮음)는 색 점으로 표시됩니다.</li>
        <li>D-day 배지로 마감까지 남은 일수를 확인하세요.</li>
      </ul>
    ),
  },
  {
    id: 'activity',
    icon: CheckCircle2,
    title: '세특·활동 기록',
    content: (
      <ul className="list-disc space-y-2 pl-5">
        <li>탐구, 발표, 토론 등 <strong>세특·창체 활동</strong>을 글로 남깁니다.</li>
        <li>제목, 과목, 날짜, 활동 내용, 태그를 입력해 나중에 생기부·세특 정리에 활용하세요.</li>
        <li>이 탭에서 + 버튼을 누르면 「활동 기록 추가」 창이 열립니다.</li>
      </ul>
    ),
  },
  {
    id: 'club',
    icon: Users,
    title: '동아리·프로그램',
    content: (
      <ul className="list-disc space-y-2 pl-5">
        <li>동아리 활동, 특색 프로그램, 진로 활동 등을 기록합니다.</li>
        <li>이름, 유형(동아리·특색프로그램 등), 이모지, 날짜, 활동 내용을 입력합니다.</li>
        <li>같은 이름의 기록을 삭제할 때는 해당 카드의 삭제 버튼을 사용하세요.</li>
      </ul>
    ),
  },
  {
    id: 'alert',
    icon: Bell,
    title: '마감 알림',
    content: (
      <ul className="list-disc space-y-2 pl-5">
        <li>오늘부터 <strong>7일 이내</strong> 마감이며 아직 완료하지 않은 일정만 모아 보여 줍니다.</li>
        <li>임박한 일정이 있으면 「마감 알림」 탭 옆에 빨간 숫자 배지가 표시됩니다.</li>
        <li>메인 히어로 영역의 「마감 임박」 통계와도 연동됩니다.</li>
      </ul>
    ),
  },
  {
    id: 'add',
    icon: Plus,
    title: '일정·기록 추가하기',
    content: (
      <>
        <p className="mb-3">화면 오른쪽 아래 <strong>보라색 + 버튼</strong>은 현재 탭에 맞는 항목을 추가합니다.</p>
        <div className="overflow-hidden rounded-xl border" style={{ borderColor: 'var(--border)' }}>
          <table className="w-full text-left text-sm">
            <thead>
              <tr style={{ background: 'var(--primary-light)' }}>
                <th className="px-4 py-2.5 font-semibold" style={{ color: 'var(--primary-dark)' }}>현재 탭</th>
                <th className="px-4 py-2.5 font-semibold" style={{ color: 'var(--primary-dark)' }}>+ 버튼 동작</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['월간 달력 / 일정 목록 / 마감 알림', '일정 추가 (제목, 과목, 유형, 날짜·시간, 우선순위, 메모)'],
                ['세특·활동 기록', '활동 기록 추가'],
                ['동아리·프로그램', '동아리·프로그램 추가'],
              ].map(([tab, action]) => (
                <tr key={tab} className="border-t" style={{ borderColor: 'var(--border)' }}>
                  <td className="px-4 py-2.5" style={{ color: 'var(--text)' }}>{tab}</td>
                  <td className="px-4 py-2.5" style={{ color: 'var(--text-2)' }}>{action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm" style={{ color: 'var(--text-2)' }}>
          모달 바깥 영역을 클릭하거나 Esc 키를 누르면 창을 닫을 수 있습니다.
        </p>
      </>
    ),
  },
  {
    id: 'tips',
    icon: Lightbulb,
    title: '알아두면 좋은 점',
    content: (
      <ul className="list-disc space-y-2 pl-5">
        <li>데이터는 이 브라우저의 <strong>localStorage</strong>에 저장됩니다. 다른 기기·브라우저와는 공유되지 않습니다.</li>
        <li>브라우저 데이터를 삭제하면 저장된 일정·기록도 함께 사라질 수 있습니다.</li>
        <li>중요한 내용은 별도로 백업해 두는 것을 권장합니다.</li>
        <li>인터넷 없이도 이미 열린 페이지에서는 대부분 기능을 사용할 수 있습니다.</li>
      </ul>
    ),
  },
] as const

export default function UsageGuide() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--background)' }}>
      <header
        className="relative overflow-hidden px-4 pb-12 pt-8 text-center"
        style={{
          background: 'linear-gradient(135deg, #1A0B2E 0%, #2D1B69 40%, #8B5CF6 100%)',
        }}
      >
        <div className="mx-auto max-w-3xl">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-medium text-white/90 transition hover:bg-white/20"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
            메인으로 돌아가기
          </Link>
          <h1
            className="mb-2 text-3xl font-bold text-white sm:text-4xl"
            style={{ fontFamily: 'var(--font-playfair), "Playfair Display", serif' }}
          >
            사용 가이드
          </h1>
          <p className="text-sm text-white/65">Schedule Mate를 처음 쓰는 분을 위한 안내</p>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-8">
        <nav
          className="mb-8 rounded-xl border p-4"
          style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
          aria-label="목차"
        >
          <p className="mb-3 text-xs font-semibold tracking-wide" style={{ color: 'var(--text-2)' }}>
            목차
          </p>
          <ul className="flex flex-wrap gap-2">
            {SECTIONS.map(s => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="inline-block rounded-full px-3 py-1.5 text-xs font-medium transition hover:opacity-90"
                  style={{ background: 'var(--primary-light)', color: 'var(--primary-dark)' }}
                >
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-6">
          {SECTIONS.map(section => {
            const Icon = section.icon
            return (
              <section
                key={section.id}
                id={section.id}
                className="scroll-mt-6 rounded-xl border p-6"
                style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
              >
                <h2 className="mb-4 flex items-center gap-2 text-lg font-bold" style={{ color: 'var(--text)' }}>
                  <span
                    className="flex h-9 w-9 items-center justify-center rounded-lg"
                    style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}
                  >
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  {section.title}
                </h2>
                <div className="text-sm leading-relaxed" style={{ color: 'var(--text-2)' }}>
                  {section.content}
                </div>
              </section>
            )
          })}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full px-8 py-3 text-sm font-medium text-white transition hover:opacity-95"
            style={{ background: 'var(--primary)' }}
          >
            Schedule Mate 시작하기
          </Link>
        </div>
      </div>
    </div>
  )
}
