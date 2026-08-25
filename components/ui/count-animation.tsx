"use client"

import { useEffect, useRef, useState } from "react"

export default function CountAnimation({
  number,
  duration,
  className,
}: {
  number: number
  duration?: number
  className?: string
}) {
  const [count, setCount] = useState(0)
  const [isInView, setIsInView] = useState(false)
  const countRef = useRef<HTMLDivElement | null>(null)

  // Intersection Observer 설정
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.5 },
    )

    if (countRef.current) {
      observer.observe(countRef.current)
    }

    return () => observer.disconnect()
  }, [])

  // 숫자 증가 애니메이션
  useEffect(() => {
    if (isInView) {
      let start = 0
      const end = number
      const totalDuration = duration ?? 1500
      const startTime = performance.now()

      const step = (timestamp: number) => {
        if (!start) start = timestamp
        const elapsedTime = timestamp - startTime
        const progress = Math.min(elapsedTime / totalDuration, 1)
        const currentValue = Math.floor(end * progress)
        setCount(currentValue)

        if (progress < 1) {
          requestAnimationFrame(step)
        }
      }

      requestAnimationFrame(step)
    }
  }, [isInView, number, duration])

  return (
    <div ref={countRef} className={className}>
      {count.toLocaleString()}
    </div>
  )
}
