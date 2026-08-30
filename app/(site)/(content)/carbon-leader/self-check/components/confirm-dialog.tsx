"use client"

import type { ReactNode } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogCloseButton,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useDialogAutoOpen } from "@/util/use-dialog-auto-open"
import { cn } from "@/lib/utils"

// 자가진단 STEP 3(감축잠재량 산정)의 확인 모달.
// 사업 삭제 확인과 감축방법론 변경 확인이 시안에서 같은 모양이라 껍데기를 공유한다.
//
// 시안 수치(px). html font-size 가 17px 이라 rem 유틸리티는 1.0625 배로 계산되므로,
// 아래 값은 가장 가까운 Tailwind 스케일로 넣었다.
//
//                  360        768        1920
//   너비           100%-20    508        640
//   안쪽 여백      24 / 20    32         80 / 60
//   제목           24 / 36    24 / 36    26 / 38
//   제목→설명      6          6          6
//   설명           17 / 26    17 / 26    17 / 26
//   설명→버튼      40         40         40
//   버튼 높이      48         54         54
//   버튼 사이      8          10         10
//   닫기 버튼      위 바깥    위 바깥    안쪽 우상단 20 / 20
//
// 색은 전부 시맨틱 토큰이라 라이트·다크가 같은 마크업으로 갈린다.
// 시안 값과 토큰을 하나씩 맞춰 둔 결과다(라이트 / 다크).
//
//   모달 면색    #ffffff / #111111  surface-field
//   제목         #111111 / #ffffff  ink-strong
//   설명         #666666 / #d2d2d2  ink-muted
//   취소 선      #d2d2d2 / #999999  line-field + dark:ash-500
//   취소 글자    #333333 / #eeeeee  ink-body
//   삭제 버튼    #ef4444 / #ef4444  destructive (두 모드 동일)
//   닫기 원      #333333 / #eeeeee  surface-inverse
//
// 취소 선만 한 토큰으로 두 모드가 맞지 않아 다크를 따로 짚었다.
// 모달 면색은 surface-card(다크 #222222) 가 아니라 surface-field 여야 시안과 같다.
//
// 오버레이는 손대지 않기로 했다. 시안 표기는 #333333 80% 지만 기존 배경과
// 결과가 같아, DialogOverlay 원본의 bg-black/50 을 그대로 쓴다.

interface ConfirmDialogProps {
  title: string
  /** 시안에서 해상도별로 줄을 끊는 경우가 있어 노드를 받는다 */
  description: ReactNode
  confirmLabel: string
  cancelLabel?: string
  /** 모달 전용 라우트처럼 확인 동작이 없는 화면에서는 생략한다 */
  onConfirm?: () => void
  /** 화면 안에서 쓸 때 상태를 밖에서 쥔다 */
  open?: boolean
  onOpenChange?: (open: boolean) => void
  /** 모달 전용 라우트로 바로 들어왔을 때 열어 준다 */
  defaultOpen?: boolean
  /**
   * 모바일 제목을 한 단계 작게(20/30) 쓴다.
   *
   * 시안에서 변경 확인 모달만 360 제목이 20 이다. 문구가 한 줄에 들어가도록
   * 줄인 값으로 보인다. 삭제 확인은 360 에서도 24 라 기본값을 쓴다.
   */
  compactTitleOnMobile?: boolean
}

const ConfirmDialog = ({
  title,
  description,
  confirmLabel,
  cancelLabel = "취소하기",
  onConfirm,
  open,
  onOpenChange,
  defaultOpen,
  compactTitleOnMobile = false,
}: ConfirmDialogProps) => {
  const [autoOpen, setAutoOpen] = useDialogAutoOpen(defaultOpen)
  const isOpen = open ?? autoOpen
  const setOpen = onOpenChange ?? setAutoOpen

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent className="bg-surface-field w-[calc(100%-1.25rem)] gap-0 rounded-xl px-5 py-6 sm:w-[calc(100%-4rem)] sm:max-w-[508px] sm:p-8 lg:max-w-[640px] lg:px-14 lg:py-19">
        {/* 모바일·태블릿은 모달 위 바깥, PC 는 모달 안쪽 우상단 */}
        <DialogCloseButton className="bg-surface-inverse text-ink-on-inverse absolute -top-8 right-0 sm:-top-10 lg:top-5 lg:right-5" />
        {/* DialogHeader 원본이 sm 부터 왼쪽 정렬이라 되돌린다 */}
        <DialogHeader className="gap-1.5 text-center sm:text-center">
          <DialogTitle
            className={cn(
              "text-ink-strong font-bold break-keep",
              compactTitleOnMobile
                ? "text-xl leading-7 sm:text-2xl sm:leading-9"
                : "text-2xl leading-9",
            )}
          >
            {title}
          </DialogTitle>
          <DialogDescription className="text-ink-muted text-base font-medium break-keep">
            {description}
          </DialogDescription>
        </DialogHeader>

        {/* PC 시안만 버튼 줄이 본문 폭(520)보다 좁은 370 이고 가운데 정렬이다 */}
        <div className="grid grid-cols-2 gap-2 pt-9 sm:gap-2.5 lg:mx-auto lg:w-full lg:max-w-[370px]">
          {/* outline 원본은 파란 ring 이라 시안의 회색 선으로 덮는다 */}
          <Button
            type="button"
            variant="outline"
            className="ring-line-field dark:ring-ash-500 text-ink-body h-11 rounded-lg bg-transparent text-sm font-bold sm:h-13"
            onClick={() => setOpen(false)}
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            variant="destructive"
            className="h-11 rounded-lg text-sm font-bold sm:h-13"
            onClick={() => {
              setOpen(false)
              onConfirm?.()
            }}
          >
            {confirmLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ConfirmDialog
