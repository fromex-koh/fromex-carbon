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
import { MANDATORY_TRAINING_ORGANIZATIONS } from "@/constants/carbon-leader-evaluation-index"
import { useDialogAutoOpen } from "@/util/use-dialog-auto-open"

// 자가진단 STEP 5 평가지표 작성의 설명 팝업.
// 1.2.2 탄소중립 전문역량 향상 노력의 "의무 교육을 수료하고 있는 경우" 물음표에서 연다.
const MandatoryTrainingDialog = ({
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
      <DialogContent className="bg-surface-field max-h-5/6 lg:max-h-11/12 w-full max-w-80 flex flex-col gap-0 rounded-xl px-5 py-6 sm:max-w-113 sm:p-8 lg:max-w-151 lg:p-15">
        {/* 좁은 화면은 닫기 버튼이 카드 밖 위쪽에, PC 는 카드 안 우상단에 붙는다 */}
        <DialogCloseButton className="bg-surface-inverse text-ink-on-inverse absolute -top-10 right-0 lg:top-5 lg:right-5" />

        <DialogHeader className="text-left sm:text-left">
          <DialogTitle className="text-ink-strong text-xl font-bold break-keep lg:text-2xl">
            탄소중립·환경·에너지 분야 관련 의무 교육
          </DialogTitle>
        </DialogHeader>

        {/* 카드 자체에 스크롤을 걸면 카드 밖에 놓인 닫기 버튼이 잘린다 */}
        <dl className="flex min-h-0 flex-col gap-2.5 overflow-y-auto pt-4 sm:gap-6 sm:pt-6 lg:gap-8 lg:pt-10">
          {MANDATORY_TRAINING_ORGANIZATIONS.map((organization) => (
            <div
              key={organization.name}
              className="flex flex-col gap-2 lg:gap-3"
            >
              <dt className="text-ink-strong text-xl font-bold">
                {organization.name}
              </dt>
              <dd>
                <ul className="flex flex-col gap-1 lg:gap-2">
                  {organization.courses.map((course) => (
                    <li
                      key={course}
                      className="text-ink-muted flex gap-1 text-base leading-6 break-keep lg:leading-6.5 lg:text-ink-body"
                    >
                      <span
                        aria-hidden="true"
                        className="flex h-6 w-2.5 shrink-0 items-center justify-center lg:h-6.5"
                      >
                        <span className="bg-ink-bullet size-1 rounded-full" />
                      </span>
                      <span>{course}</span>
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          ))}
        </dl>
      </DialogContent>
    </Dialog>
  )
}

export default MandatoryTrainingDialog
