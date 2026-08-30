"use client"

import type { ReactNode } from "react"

import {
  Dialog,
  DialogCloseButton,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ENVIRONMENT_CERTIFICATIONS } from "@/constants/carbon-leader-evaluation-index"
import { useDialogAutoOpen } from "@/util/use-dialog-auto-open"

// 자가진단 STEP 5 평가지표 작성의 설명 팝업.
// 2.2.5 탄소감축 자발적 행동의 "환경분야 국가인증 취득" 물음표에서 연다.
// 카드·여백·닫기 위치는 같은 단계의 다른 설명 팝업과 동일한 규격이다.
const CertificationTypeDialog = ({
  children,
  defaultOpen,
}: {
  /** 넘기면 이 요소가 팝업을 여는 버튼이 된다 */
  children?: ReactNode
  defaultOpen?: boolean
}) => {
  const [open, setOpen] = useDialogAutoOpen(defaultOpen)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children ? <DialogTrigger asChild>{children}</DialogTrigger> : null}
      <DialogContent className="bg-surface-field max-h-5/6 w-full max-w-80 flex flex-col gap-0 rounded-xl px-5 py-6 sm:max-w-113 sm:p-8 lg:max-h-11/12 lg:max-w-151 lg:p-15">
        {/* 좁은 화면은 닫기 버튼이 카드 밖 위쪽에, PC 는 카드 안 우상단에 붙는다 */}
        <DialogCloseButton className="bg-surface-inverse text-ink-on-inverse absolute -top-10 right-0 lg:top-5 lg:right-5" />

        <DialogHeader className="text-left sm:text-left">
          <DialogTitle className="text-ink-strong text-xl font-bold break-keep lg:text-2xl">
            국가에서 관리하는 환경분야 인증 종류
          </DialogTitle>
        </DialogHeader>

        {/* 불릿은 같은 단계의 의무 교육 팝업과 같은 규격이다 */}
        <ul className="flex min-h-0 flex-col gap-1 overflow-y-auto pt-4 sm:pt-6 lg:gap-2 lg:pt-10">
          {ENVIRONMENT_CERTIFICATIONS.map((certification) => (
            <li
              key={certification}
              className="text-ink-muted lg:text-ink-body flex gap-1 text-base leading-6 break-keep lg:leading-6.5"
            >
              <span
                aria-hidden="true"
                className="flex h-6 w-2.5 shrink-0 items-center justify-center lg:h-6.5"
              >
                <span className="bg-ink-bullet size-1 rounded-full" />
              </span>
              <span>{certification}</span>
            </li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  )
}

export default CertificationTypeDialog
