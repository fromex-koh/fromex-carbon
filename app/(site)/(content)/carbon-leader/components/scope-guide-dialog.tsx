"use client"

import { useDialogAutoOpen } from "@/util/use-dialog-auto-open"
import {
  Dialog,
  DialogCloseButton,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const SCOPES = [
  {
    label: "Scope 1",
    description: "기업이 직접 사용하는 연료에서 발생하는 배출",
  },
  {
    label: "Scope 2",
    description: "구매한 전기·스팀·열 사용으로 발생하는 간접 배출",
  },
  {
    label: "Scope 3",
    description:
      "원자재, 물류, 출장, 출퇴근, 제품 폐기 등 외부 활동에서 발생하는 기타 간접 배출",
  },
]

const ScopeGuideDialog = ({ defaultOpen }: { defaultOpen?: boolean }) => {
  const [open, setOpen] = useDialogAutoOpen(defaultOpen)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-[calc(100%-1.25rem)] max-w-[340px] gap-0 rounded-xl px-5 pt-6 pb-10 sm:w-[calc(100%-4rem)] sm:max-w-[640px] sm:p-8 sm:pb-12 lg:p-15">
        <DialogCloseButton className="absolute -top-10 right-0 lg:top-5 lg:right-5" />

        <DialogHeader className="border-border gap-2 border-b pb-4 text-left sm:gap-1.5 sm:pb-6 lg:pb-8">
          <DialogTitle className="text-ink-strong text-xl font-bold break-all sm:text-2xl">
            Scope 1, 2, 3이란?
          </DialogTitle>
          <DialogDescription className="text-ink-body text-base font-medium break-all">
            기업의 온실가스 배출이 발생하는 위치와 원인에 따라 구분한
            기준입니다.
          </DialogDescription>
        </DialogHeader>

        <dl className="flex flex-col gap-4 pt-4 sm:gap-6 sm:pt-6 lg:pt-10">
          {SCOPES.map((scope) => (
            <div key={scope.label} className="flex flex-col gap-3">
              <dt>
                <span className="bg-ash-800 text-background inline-flex rounded-full px-5 py-0.5 text-xs font-bold sm:py-1">
                  {scope.label}
                </span>
              </dt>
              <dd className="text-ink-strong text-base break-all">
                {scope.description}
              </dd>
            </div>
          ))}
        </dl>
      </DialogContent>
    </Dialog>
  )
}

export default ScopeGuideDialog
