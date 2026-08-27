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
}

const CARD = {
  default: "border-primary bg-background",
  progress: "border-primary-light bg-background",
  complete: "border-input bg-ash-200",
  disabled: "border-input bg-ash-200",
} as const

const STEP_LABEL = {
  default: "text-aqua-blue",
  progress: "text-primary-light",
  complete: "text-muted-foreground",
  disabled: "text-muted-foreground",
} as const

const DIVIDER = {
  default: "border-border",
  progress: "border-border",
  complete: "border-input",
  disabled: "border-input",
} as const

const TITLE = {
  default: "text-foreground",
  progress: "text-foreground",
  complete: "text-muted-foreground",
  disabled: "text-muted-foreground",
} as const

const DESCRIPTION = {
  default: "text-ash-800",
  progress: "text-ash-800",
  complete: "text-muted-foreground",
  disabled: "text-muted-foreground",
} as const

const META = {
  default: "text-ash-700",
  progress: "text-ash-800",
  complete: "text-muted-foreground",
  disabled: "text-muted-foreground",
} as const

const TONE_BADGE = {
  teal: "bg-lagoon-blue hover:bg-lagoon-blue dark:bg-lagoon-blue",
  violet: "bg-neon-violet hover:bg-neon-violet dark:bg-neon-violet",
} as const

const TONE_REVIEW = {
  teal: "text-lagoon-blue ring-lagoon-blue hover:bg-lagoon-blue/10",
  violet: "text-neon-violet ring-neon-violet hover:bg-neon-violet/10",
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
    return "bg-primary-light hover:bg-primary-light dark:bg-primary-light"
  if (variant === "disabled")
    return "bg-ash-400 hover:bg-ash-400 dark:bg-ash-400"
  return "bg-primary hover:bg-primary dark:bg-primary"
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
            "text-primary-foreground shrink-0 border-transparent px-4 py-1 text-sm font-bold md:py-1.5",
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
        {isActionable ? (
          <Button
            asChild={Boolean(href)}
            size="lg"
            className="h-13 w-full text-base font-bold lg:text-sm"
          >
            {href ? <Link href={href}>{actionLabel}</Link> : <>{actionLabel}</>}
          </Button>
        ) : (
          <Button
            size="lg"
            disabled
            className="bg-ash-400 text-ash-200 h-13 w-full text-base font-bold disabled:opacity-100 lg:text-sm"
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
