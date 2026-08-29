import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface FlowStep {
  label: string
  // 기간 안내는 단계가 아니라 흐름 사이의 조건이라 굵기를 다르게 둔다.
  isPeriod?: boolean
  isCurrent?: boolean
}

const STEPS: FlowStep[] = [
  { label: "자가진단", isCurrent: true },
  { label: "1차 신청서 작성" },
  { label: "1년 경과 시", isPeriod: true },
  { label: "2차 신청서 작성" },
  { label: "중간점검" },
  { label: "2년 경과 시", isPeriod: true },
  { label: "3차 신청서 작성" },
  { label: "최종점검" },
  { label: "선도기업 인증서 발급" },
]

const ProcessFlow = () => {
  return (
    // 프로세스 바는 태블릿부터 노출한다.
    <ol className="bg-surface-flow hidden flex-wrap items-center justify-center gap-x-0 gap-y-1 rounded-2xl px-3 py-3 md:flex lg:gap-x-2 lg:px-4">
      {STEPS.map((step, index) => (
        <li key={step.label} className="flex items-center gap-0 lg:gap-2">
          {index > 0 && (
            <ChevronRight
              aria-hidden="true"
              className="text-line-disabled size-2 shrink-0 lg:size-3"
            />
          )}
          <span
            className={cn(
              "text-xs whitespace-nowrap",
              step.isPeriod ? "font-normal" : "font-bold",
              step.isCurrent ? "text-brand-step" : "text-ink-strong",
            )}
          >
            {step.label}
          </span>
        </li>
      ))}
    </ol>
  )
}

export default ProcessFlow
