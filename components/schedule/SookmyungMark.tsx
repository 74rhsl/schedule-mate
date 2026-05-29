import Image from 'next/image'

interface SookmyungMarkProps {
  size?: number
  className?: string
}

export default function SookmyungMark({ size = 72, className = '' }: SookmyungMarkProps) {
  return (
    <Image
      src="/sookmyung-mark.png"
      alt="숙명여자고등학교 마크"
      width={size}
      height={size}
      className={`rounded-full object-cover ${className}`}
      priority
    />
  )
}
