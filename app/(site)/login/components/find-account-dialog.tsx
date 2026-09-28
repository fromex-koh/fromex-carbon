"use client"

import type { ReactNode } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useDialogAutoOpen } from "@/util/use-dialog-auto-open"

// 로그인 화면 기관회원 탭의 [아이디 · 비밀번호 찾기] 로 여는 안내 팝업.
// 찾기 절차가 따로 없고 담당자 연락처만 알려 주는 화면이라 닫기 버튼 하나뿐이다.
// 시안에 우상단 X 가 없어 닫기 버튼만 둔다.

const FindAccountDialog = ({
  children,
  defaultOpen,
}: {
  /** 넘기면 이 요소가 팝업을 여는 버튼이 된다 */
  children?: ReactNode
  /** 모달 전용 라우트(/login/find-account)로 바로 들어왔을 때 열어 둔다 */
  defaultOpen?: boolean
}) => {
  const [open, setOpen] = useDialogAutoOpen(defaultOpen)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children ? <DialogTrigger asChild>{children}</DialogTrigger> : null}
      {/* 폭은 시안의 349 / 508 / 560 이다. 640~767 구간은 시안이 없어
          다른 팝업과 같이 태블릿 폭을 앞당겨 쓴다 */}
      <DialogContent className="bg-surface-field flex w-19/20 max-w-82 flex-col gap-6 rounded-xl px-5 py-6 sm:max-w-119.5 md:gap-8 md:p-8 lg:max-w-132 lg:gap-10 lg:p-10">
        <DialogHeader className="gap-1.5 text-center sm:text-center">
          <DialogTitle className="text-ink-strong text-lg leading-normal font-bold break-keep md:text-2xl">
            아이디 · 비밀번호 찾기
          </DialogTitle>
          <p className="text-ink-muted text-base leading-relaxed break-keep lg:text-lg">
            아이디 · 비밀번호는 담당자(051-606-7471)에게 문의하여주세요.
          </p>
        </DialogHeader>

        <DialogClose asChild>
          <Button
            type="button"
            size="lg"
            className="bg-brand-primary hover:bg-brand-primary-hover text-ink-on-brand h-11.5 w-full rounded-lg px-4 text-sm font-bold md:h-13"
          >
            닫기
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  )
}

export default FindAccountDialog
