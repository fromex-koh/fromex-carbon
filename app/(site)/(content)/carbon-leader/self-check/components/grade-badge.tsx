import type { Grade } from "@/constants/carbon-leader-evaluation-index-items"
import { cn } from "@/lib/utils"

/**
 * 등급 배지. 자가진단 STEP 5 평가지표 작성에서 쓰는 세 모양을 한곳에 모았다.
 *
 *   <GradeBadge grade={grade} />                    지표 헤더의 예상등급 — 테두리 알약
 *   <GradeBadge grade={null} />                     아직 고르지 않음 — "미선택" 회색 알약
 *   <GradeBadge grade="A" variant="fill" />         요약 카드의 최종등급 — 등급색 알약 + 흰 글자
 *   <GradeBadge grade="A" variant="circle" />       요약 표의 산정등급 — 알파벳만 담은 동그라미
 *
 * 색은 라이트·다크가 같다. A 청록 · B 파랑 · C 보라 · D 분홍 · E 남색.
 */
export type GradeBadgeVariant = "outline" | "fill" | "circle"

/** 글자·테두리에 쓰는 등급 색 */
const TEXT: Record<Grade, string> = {
  A: "text-brand-done-teal",
  B: "text-brand-info",
  C: "text-brand-done-violet",
  D: "text-candy-pink",
  E: "text-ocean-blue",
}

const RING: Record<Grade, string> = {
  A: "ring-brand-done-teal",
  B: "ring-brand-info",
  C: "ring-brand-done-violet",
  D: "ring-candy-pink",
  E: "ring-ocean-blue",
}

/** 면색으로 쓰는 등급 색 (fill 전용) */
const BG: Record<Grade, string> = {
  A: "bg-brand-done-teal",
  B: "bg-brand-info",
  C: "bg-brand-done-violet",
  D: "bg-candy-pink",
  E: "bg-ocean-blue",
}

/** 알약 공통. 높이 32(768)·34(PC), 좌우 여백 20, 글자 14 Bold */
const PILL =
  "inline-flex h-7.5 shrink-0 items-center justify-center rounded-full px-5 text-sm font-bold whitespace-nowrap lg:h-8"

const GradeBadge = ({
  grade,
  variant = "outline",
  className,
}: {
  /** null 이면 "미선택" 로 그린다 */
  grade: Grade | null
  variant?: GradeBadgeVariant
  className?: string
}) => {
  if (!grade)
    return (
      <span className={cn(PILL, "text-ink-hint ring-ink-hint ring", className)}>
        미선택
      </span>
    )

  if (variant === "circle")
    return (
      <>
        <span
          aria-hidden="true"
          className={cn(
            "inline-flex size-6.5 items-center justify-center rounded-full bg-white text-sm font-bold ring",
            TEXT[grade],
            RING[grade],
            className,
          )}
        >
          {grade}
        </span>
        <span className="sr-only">{grade}등급</span>
      </>
    )

  return (
    <span
      className={cn(
        PILL,
        variant === "fill"
          ? cn("text-white", BG[grade])
          : cn("ring", TEXT[grade], RING[grade]),
        className,
      )}
    >
      {grade}등급
    </span>
  )
}

export default GradeBadge
