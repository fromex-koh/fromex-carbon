"use client"

import type { ReactNode } from "react"

import {
  Dialog,
  DialogCloseButton,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useDialogAutoOpen } from "@/util/use-dialog-auto-open"

// 업종코드 조회 팝업은 기존 컴포넌트(components/ui/lobzcd-dialog.tsx)를 그대로 붙인다.
// 이 화면에서는 팝업이 뜨는 자리만 표시해 둔다.
const IndustryCodeDialog = ({
  children,
  defaultOpen,
}: {
  children?: ReactNode
  defaultOpen?: boolean
}) => {
  const [open, setOpen] = useDialogAutoOpen(defaultOpen)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children ? <DialogTrigger asChild>{children}</DialogTrigger> : null}
      <DialogContent className="w-[calc(100%-1.25rem)] max-w-[560px] gap-0 rounded-xl p-0">
        <DialogHeader className="border-input gap-0 border-b px-6 py-5 text-left">
          <DialogTitle className="text-lg font-bold break-all">
            업종을 검색해보세요
          </DialogTitle>
          <DialogDescription className="sr-only">
            업종코드 조회 팝업이 들어갈 자리입니다.
          </DialogDescription>
          <DialogCloseButton className="absolute top-5 right-5" />
        </DialogHeader>

        <div className="px-6 py-10">
          <p className="border-input text-muted-foreground rounded-md border border-dashed px-6 py-12 text-center text-sm break-all">
            업종코드 조회 팝업 기존 사용
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default IndustryCodeDialog
