import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import RichText from "@/app/(site)/(content)/carbon-leader/application/components/rich-text"

/**
 * 카드 상태 4종
 * - default  : 신청가능. 유일하게 CTA 가 활성이다.
 * - progress : 담당자 점검 진행중. 테두리·라벨만 강조되고 CTA 는 비활성.
 * - complete : 신청/점검 완료. CTA 비활성 + 현황조회 보조 버튼이 추가된다.
 * - disabled : 선행 단계 미완료로 신청 불가.
 */
export type StepCardVariant = "default" | "progress" | "complete" | "disabled"

/** complete 단계별 강조색. 자가진단·1차신청 = teal, 중간·최종점검 = violet */
export type StepCardTone = "teal" | "violet"

export interface StepCardData {
  /** 카드 상단 좌측 라벨. "사전 단계" | "STEP 1" | "중간점검" 등 */
  step: string
  title: string
  description: string
  /** 문자열이면 한 줄, 배열이면 [신청일, 완료일] 을 좌우 정렬한다 */
  meta: string | [string, string]
  actionLabel: string
  /** default 일 때만 사용. 없으면 CTA 가 비활성으로 렌더된다 */
  href?: string
  variant: StepCardVariant
  /** complete 전용. 미지정 시 teal */
  tone?: StepCardTone
  /** 배지 문구. 미지정 시 variant 기본값 사용 */
  statusLabel?: string
  /** complete 전용. 현황조회 버튼 링크 */
  reviewHref?: string
  /** 다음 단계가 없어 CTA 자체를 그리지 않는다. 마지막 단계 완료 카드용 */
  hideAction?: boolean
}

const CARD = {
  default: "border-brand-primary bg-surface-card",
  progress: "border-brand-progress bg-surface-card",
  complete: "border-line-disabled bg-surface-disabled",
  disabled: "border-line-disabled bg-surface-disabled",
} as const

const STEP_LABEL = {
  default: "text-brand-info",
  progress: "text-brand-progress",
  complete: "text-ink-disabled",
  disabled: "text-ink-disabled",
} as const

const DIVIDER = {
  default: "border-line-divider",
  progress: "border-line-divider",
  complete: "border-line-disabled",
  disabled: "border-line-disabled",
} as const

const TITLE = {
  default: "text-ink-strong",
  progress: "text-ink-strong",
  complete: "text-ink-disabled",
  disabled: "text-ink-disabled",
} as const

const DESCRIPTION = {
  default: "text-ink-body",
  progress: "text-ink-body",
  complete: "text-ink-disabled",
  disabled: "text-ink-disabled",
} as const

const META = {
  // 라벨은 #666666, ** 로 감싼 날짜만 제목과 같은 강조색이다(다크에서 #FFFFFF).
  default: "text-ink-muted [&_strong]:text-ink-strong",
  progress: "text-ink-body",
  complete: "text-ink-disabled",
  disabled: "text-ink-disabled",
} as const

const TONE_BADGE = {
  teal: "bg-brand-done-teal hover:bg-brand-done-teal dark:bg-brand-done-teal",
  violet:
    "bg-brand-done-violet hover:bg-brand-done-violet dark:bg-brand-done-violet",
} as const

// 현황조회 버튼: 배경은 카드 면색, 테두리·글자는 단계 강조색
const TONE_REVIEW = {
  teal: "bg-surface-card text-brand-done-teal ring-brand-done-teal hover:bg-surface-outline-hover",
  violet:
    "bg-surface-card text-brand-done-violet ring-brand-done-violet hover:bg-surface-outline-hover",
} as const

const DEFAULT_STATUS_LABEL = {
  default: "신청가능",
  progress: "진행중",
  complete: "완료",
  disabled: "신청불가",
} as const

const badgeStyle = (variant: StepCardVariant, tone: StepCardTone) => {
  if (variant === "complete") return TONE_BADGE[tone]
  if (variant === "progress")
    return "bg-brand-progress hover:bg-brand-progress dark:bg-brand-progress"
  if (variant === "disabled")
    return "bg-fill-disabled hover:bg-fill-disabled dark:bg-fill-disabled text-ink-on-muted"
  return "bg-brand-primary hover:bg-brand-primary dark:bg-brand-primary"
}

const StepCard = ({ data }: { data: StepCardData }) => {
  const {
    step,
    title,
    description,
    meta,
    actionLabel,
    href,
    variant,
    tone = "teal",
    statusLabel,
    reviewHref,
    hideAction = false,
  } = data

  // default 는 라우트가 아직 없어도 활성 CTA 로 보여야 한다. href 가 있을 때만 Link 로 감싼다.
  const isActionable = variant === "default"
  const metaLines = Array.isArray(meta) ? meta : [meta]

  return (
    <li
      className={cn(
        "flex flex-col gap-2 rounded-xl border p-5 md:p-6 lg:gap-4 lg:p-8",
        CARD[variant],
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className={cn("text-base font-bold", STEP_LABEL[variant])}>
          {step}
        </span>
        <Badge
          className={cn(
            "text-ink-on-brand shrink-0 border-transparent px-4 py-1 text-sm font-bold md:py-1.5",
            badgeStyle(variant, tone),
          )}
        >
          {statusLabel ?? DEFAULT_STATUS_LABEL[variant]}
        </Badge>
      </div>

      {/* 카드 높이가 남으면 divider·신청기간이 아니라 버튼 위쪽에 여백이 생겨야 한다. */}
      <div className="flex flex-1 flex-col gap-3 lg:gap-6">
        <div
          className={cn(
            "flex flex-col gap-1 border-b pb-3 md:gap-2.5 lg:gap-3 lg:pb-6",
            DIVIDER[variant],
          )}
        >
          <h3
            className={cn(
              "text-lg font-bold break-all md:text-2xl lg:text-xl",
              TITLE[variant],
            )}
          >
            {title}
          </h3>
          <p className={cn("text-base break-all", DESCRIPTION[variant])}>
            <RichText text={description} />
          </p>
        </div>

        <div
          className={cn(
            "flex flex-col gap-1 text-sm md:gap-1.5 lg:flex-row lg:justify-between lg:gap-2 lg:text-xs",
            META[variant],
          )}
        >
          {metaLines.map((line) => (
            <span key={line}>
              <RichText text={line} />
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2 pt-6 md:gap-2.5 lg:gap-2">
        {hideAction ? null : isActionable ? (
          <Button
            asChild={Boolean(href)}
            size="lg"
            className="bg-brand-primary hover:bg-brand-primary-hover active:bg-brand-primary-hover text-ink-on-brand h-13 w-full text-base font-bold lg:text-sm"
          >
            {href ? <Link href={href}>{actionLabel}</Link> : <>{actionLabel}</>}
          </Button>
        ) : (
          <Button
            size="lg"
            disabled
            className="bg-fill-disabled text-ink-on-disabled h-13 w-full text-base font-bold disabled:opacity-100 lg:text-sm"
          >
            {actionLabel}
          </Button>
        )}

        {variant === "complete" && reviewHref ? (
          <Button
            asChild
            size="lg"
            variant="outline"
            className={cn(
              "h-13 w-full text-base font-bold lg:text-sm",
              TONE_REVIEW[tone],
            )}
          >
            <Link href={reviewHref}>현황조회</Link>
          </Button>
        ) : null}
      </div>
    </li>
  )
}

export default StepCard
