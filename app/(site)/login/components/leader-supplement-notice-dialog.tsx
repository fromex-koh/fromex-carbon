"use client"

import type { ReactNode } from "react"

import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogCloseButton,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useDialogAutoOpen } from "@/util/use-dialog-auto-open"

// 선도기업 신청 건의 보완요청을 알리는 안내 팝업.
// [현황조회 이동하기] 로 마이페이지 신청현황으로 보낸다.

const LeaderSupplementNoticeDialog = ({
  children,
  defaultOpen,
}: {
  /** 넘기면 이 요소가 팝업을 여는 버튼이 된다 */
  children?: ReactNode
  /** 모달 전용 라우트(/login/leader-supplement-notice)로 바로 들어왔을 때 열어 둔다 */
  defaultOpen?: boolean
}) => {
  const [open, setOpen] = useDialogAutoOpen(defaultOpen)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children ? <DialogTrigger asChild>{children}</DialogTrigger> : null}
      <DialogContent className="bg-surface-field flex w-19/20 max-w-82 flex-col gap-6 rounded-xl px-5 py-6 sm:max-w-119.5 sm:gap-7.5 sm:p-7.5">
        <DialogCloseButton className="bg-surface-inverse text-ink-on-inverse absolute top-4.5 right-5 sm:right-7.5" />

        <DialogHeader className="gap-1.5 text-center sm:text-center">
          <DialogTitle className="text-ink-strong text-xl leading-normal font-bold break-keep sm:text-2xl">
            선도기업 신청 보완요청
          </DialogTitle>
          <p className="text-ink-muted text-base leading-relaxed break-keep">
            신청하신 선도기업 신청 건에 보완요청이 있습니다.
            <br />
            보완요청 사항을 확인해 주세요.
          </p>
        </DialogHeader>

        {/* 마이페이지 신청현황으로 보낸다. 다른 화면의 현황조회 이동과 같은 경로다 */}
        <Button
          asChild
          size="lg"
          className="bg-brand-primary hover:bg-brand-primary-hover text-ink-on-brand h-11.5 w-full rounded-lg px-4 text-sm font-bold sm:h-13"
        >
          <Link href="/my-page/status">현황조회 이동하기</Link>
        </Button>
      </DialogContent>
    </Dialog>
  )
}

export default LeaderSupplementNoticeDialog
