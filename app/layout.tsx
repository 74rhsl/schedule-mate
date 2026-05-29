import type { Metadata } from 'next'
import { Playfair_Display, Noto_Sans_KR } from 'next/font/google'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['700'],
})

const notoSansKR = Noto_Sans_KR({
  subsets: ['latin'],
  variable: '--font-noto',
  weight: ['300', '400', '500', '700', '900'],
})

export const metadata: Metadata = {
  title: '숙명여고 스케줄 메이트',
  description: '숙명여자고등학교 재학생을 위한 학습 일정·활동 기록 통합 관리 서비스',
  generator: 'v0.app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" className={`${playfair.variable} ${notoSansKR.variable} bg-background`}>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
