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

// 선도기업 신청 1·2·3차 신청서 작성과 회원정보 수정이 함께 쓰는 주소 검색 팝업.
// 카카오 우편번호 서비스를 iframe 으로 붙일 자리만 잡아 둔다.
// 카드·여백·닫기 위치는 자가진단 STEP 5 설명 팝업과 같은 규격이다.
const AddressSearchDialog = ({
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
      {/* 좁은 화면에서는 max-w 를 덮지 않는다. 원본의 max-w-[calc(100%-2rem)] 이
            살아 있어야 360 아래에서도 좌우 여백이 남는다. */}
      <DialogContent className="bg-surface-field flex max-h-5/6 w-full flex-col gap-0 rounded-xl px-5 py-6 sm:max-w-113 sm:p-8 lg:max-h-11/12 lg:max-w-137 lg:p-10">
        {/* 좁은 화면은 닫기 버튼이 카드 밖 위쪽에, PC 는 카드 안 우상단에 붙는다 */}
        <DialogCloseButton className="bg-surface-inverse text-ink-on-inverse absolute -top-10 right-0 lg:top-5 lg:right-5" />

        <DialogHeader className="text-left sm:text-left">
          <DialogTitle className="text-ink-strong text-xl font-bold break-keep lg:text-2xl">
            주소 검색
          </DialogTitle>
          <DialogDescription className="text-ink-body pt-1.5 text-sm break-keep sm:pt-2 lg:text-base">
            주소를 고르면 우편번호와 기본주소가 자동으로 채워집니다.
          </DialogDescription>
        </DialogHeader>

        {/*
          카카오 우편번호 서비스가 들어갈 자리.
          개발에서 daum.Postcode 의 embed(대상 엘리먼트) 로 이 상자를 넘기면 된다.
          권장 크기는 폭 500 · 높이 470 이고, 아래 상자가 그 규격이다.
        */}
        <div className="border-line-field text-ink-hint mt-5 flex h-95 min-h-0 items-center justify-center rounded-md border border-dashed px-6 text-center text-sm break-keep sm:mt-6 sm:h-105 lg:mt-8 lg:h-110">
          카카오 우편번호 서비스 iframe 자리
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default AddressSearchDialog
