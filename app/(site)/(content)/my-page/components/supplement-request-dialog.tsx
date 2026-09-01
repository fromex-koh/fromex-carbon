"use client"

import type { ReactNode } from "react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useDialogAutoOpen } from "@/util/use-dialog-auto-open"

// IA "보완요청" 모달 팝업. 현황조회의 [보완요청 보기] 에서 연다.
//
// 시안 수치(px) — 팝업 520x334 r12 / 안쪽 여백 40 / 제목 26·700 가운데
// 제목→상자 16 / 상자 r12 면 #f3f3f3 선 #d2d2d2 안쪽 20 / 문구 17·500 #666
// 상자→버튼 28 / 닫기 버튼 높이 54 r8 흰 면 선 #d2d2d2 글자 15·700 #333
//
// [퍼블리싱 노출용] 문구는 시안 값이다. 실제로는 BO 관리자가 입력한 내용이 내려온다.
const MESSAGE =
  "제출하신 배출량 산정 근거자료 중 일부 항목의 증빙 서류가 누락되어 확인이 필요합니다. 관련 자료를 다시 첨부하여 제출해 주시기 바랍니다."

const SupplementRequestDialog = ({
  children,
  defaultOpen,
}: {
  /** 넘기면 이 요소가 팝업을 여는 버튼이 된다 */
  children?: ReactNode
  /** 모달 전용 라우트로 바로 들어왔을 때 열어 준다 */
  defaultOpen?: boolean
}) => {
  const [open, setOpen] = useDialogAutoOpen(defaultOpen)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children ? <DialogTrigger asChild>{children}</DialogTrigger> : null}
      <DialogContent className="bg-surface-field flex w-11/12 max-w-80 flex-col gap-0 rounded-xl p-5 sm:max-w-122 sm:p-10">
        <DialogHeader className="text-center sm:text-center">
          <DialogTitle className="text-ink-strong text-xl font-bold break-keep sm:text-2xl">
            보완요청사항
          </DialogTitle>
        </DialogHeader>

        <div className="border-line-field bg-surface-disabled mt-4 rounded-xl border p-5">
          <DialogDescription className="text-ink-muted text-sm font-medium break-keep sm:text-base">
            {MESSAGE}
          </DialogDescription>
        </div>

        <button
          type="button"
          onClick={() => setOpen(false)}
          className="border-line-field bg-surface-field text-ink-body hover:bg-surface-disabled mt-7 h-12 w-full cursor-pointer rounded-lg border text-sm font-bold transition-colors sm:h-13"
        >
          닫기
        </button>
      </DialogContent>
    </Dialog>
  )
}

export default SupplementRequestDialog
