import Link from "next/link"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface StepNavProps {
  prevHref: string
  /** 다음 단계가 폼 제출이면 생략하고 type=submit 버튼을 직접 둔다. */
  nextHref?: string
  prevLabel?: string
  nextLabel?: string
  /** 동의 체크 등 선행 조건이 안 채워졌을 때 [다음으로] 를 잠근다. nextHref 없이 쓸 때만 동작한다. */
  nextDisabled?: boolean
}

// 자가진단 6단계 공통 하단 네비게이션.
// 모바일은 두 버튼을 반씩 나눠 한 줄로, 태블릿부터는 좌우 끝으로 벌린다.
const StepNav = ({
  prevHref,
  nextHref,
  prevLabel = "이전으로",
  nextLabel = "다음으로",
  nextDisabled = false,
}: StepNavProps) => {
  return (
    <div className="flex gap-2 md:justify-between">
      <Button
        asChild
        variant="outline"
        size="lg"
        className="h-11 flex-1 px-4 font-bold [&_svg]:size-5 md:h-13 md:min-w-45 md:flex-none md:px-12"
      >
        <Link href={prevHref}>
          <ArrowLeft aria-hidden="true" />
          {prevLabel}
        </Link>
      </Button>

      <Button
        asChild={Boolean(nextHref)}
        size="lg"
        disabled={!nextHref && nextDisabled}
        className="disabled:bg-ash-400 disabled:text-ash-200 h-11 flex-1 px-4 font-bold disabled:opacity-100 [&_svg]:size-5 md:h-13 md:min-w-50 md:flex-none md:px-12"
      >
        {nextHref ? (
          <Link href={nextHref}>
            {nextLabel}
            <ArrowRight aria-hidden="true" />
          </Link>
        ) : (
          <>
            {nextLabel}
            <ArrowRight aria-hidden="true" />
          </>
        )}
      </Button>
    </div>
  )
}

export default StepNav
