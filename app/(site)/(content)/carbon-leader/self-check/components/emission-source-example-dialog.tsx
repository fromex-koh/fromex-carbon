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
import {
  EMISSION_SOURCE_GROUPS,
  EMISSION_SOURCE_HEADS,
} from "@/constants/carbon-leader-evaluation-index"
import { cn } from "@/lib/utils"
import { useDialogAutoOpen } from "@/util/use-dialog-auto-open"

// 자가진단 STEP 5 평가지표 작성의 설명 팝업.
// 2.1.1 탄소배출량 산정의 "(예시) 중소기업 온실가스 배출원" 물음표에서 연다.
// 표가 길어 화면보다 커질 수 있어 표만 세로로 스크롤한다.

/** 칸 하나. 좁은 화면은 4등분이라 칸이 좁아 단어 안에서도 줄바꿈한다. PC 는 단어를 지킨다. */
const cellClass =
  "text-ink-body px-2.5 py-3 text-center align-middle text-xs leading-4 lg:px-3 lg:py-4 lg:text-base lg:leading-6.5 lg:break-keep"

const EmissionSourceExampleDialog = ({
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
      <DialogContent className="bg-surface-field max-h-5/6 lg:max-h-11/12 w-full max-w-80 flex flex-col gap-0 rounded-xl px-5 py-6 sm:max-w-169 sm:p-8 lg:max-w-300 lg:px-18 lg:py-15">
        {/* 좁은 화면은 닫기 버튼이 카드 밖 위쪽에, PC 는 카드 안 우상단에 붙는다 */}
        <DialogCloseButton className="bg-surface-inverse text-ink-on-inverse absolute -top-10 right-0 lg:top-5 lg:right-5" />

        <DialogHeader className="text-left sm:text-left">
          <DialogTitle className="text-ink-strong text-xl font-bold break-keep lg:text-2xl">
            (예시) 중소기업 온실가스 배출원 (Scope 1, 2, 3)
          </DialogTitle>
        </DialogHeader>

        {/* 카드 자체에 스크롤을 걸면 카드 밖에 놓인 닫기 버튼이 잘린다 */}
        <div className="border-line-field border-t-ink-strong mt-4 min-h-0 overflow-y-auto border-t border-b sm:mt-6 lg:mt-10">
          <table className="w-full table-fixed border-collapse">
            <thead>
              <tr className="bg-surface-disabled">
                {EMISSION_SOURCE_HEADS.map((head, index) => (
                  <th
                    key={head}
                    scope="col"
                    className={cn(
                      cellClass,
                      "text-ink-body border-line-field w-1/4 border-b font-bold",
                      index === 0 ? "lg:w-1/7" : "lg:w-2/7",
                      index < 3 && "border-r",
                    )}
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {EMISSION_SOURCE_GROUPS.map((group) =>
                group.rows.map((row, rowIndex) => (
                  <tr
                    key={`${group.type.join("-")}-${row.tech}`}
                    className="bg-surface-field"
                  >
                    {rowIndex === 0 ? (
                      <th
                        scope="rowgroup"
                        rowSpan={group.rows.length}
                        className={cn(
                          cellClass,
                          "bg-surface-disabled border-line-field border-r border-b font-bold",
                        )}
                      >
                        {group.type[0]}
                        <br />
                        {group.type[1]}
                      </th>
                    ) : null}
                    <td
                      className={cn(
                        cellClass,
                        "border-line-field border-r border-b lg:font-medium",
                      )}
                    >
                      {row.tech}
                    </td>
                    <td
                      className={cn(
                        cellClass,
                        "border-line-field border-r border-b whitespace-pre-line lg:font-medium",
                      )}
                    >
                      {row.activity}
                    </td>
                    <td
                      className={cn(
                        cellClass,
                        "border-line-field border-b lg:font-medium",
                      )}
                    >
                      {row.source}
                    </td>
                  </tr>
                )),
              )}
            </tbody>
          </table>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default EmissionSourceExampleDialog
