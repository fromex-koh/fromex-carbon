"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// [인벤토리 설정] 모달 전용 페이지네이션.
// 공통 CarbonPagination 은 화살표가 페이지 "묶음"(최대 7칸) 단위로 움직이고
// 비활성 판정도 묶음 기준이라, 이 모달이 필요한 "한 칸 이동 + 양 끝에서만 비활성"과 맞지 않는다.
// 원본을 건드리지 않으려고 같은 모양으로 따로 만든다.

/** 한 번에 보여 줄 페이지 번호 수. 넘치면 ··· 뒤에 마지막 페이지를 붙인다. */
const WINDOW = 4

const pageNumbers = (currentPage: number, totalPage: number) => {
  if (totalPage <= WINDOW + 1) {
    return Array.from({ length: totalPage }, (_, index) => index + 1)
  }

  const start = Math.min(Math.max(1, currentPage - 1), totalPage - WINDOW)
  const pages: (number | "gap")[] = Array.from(
    { length: WINDOW },
    (_, index) => start + index,
  )
  const last = pages[pages.length - 1] as number

  if (last < totalPage) {
    if (last < totalPage - 1) pages.push("gap")
    pages.push(totalPage)
  }

  return pages
}

interface ItemSelectPaginationProps {
  currentPage: number
  setCurrentPage: (page: number) => void
  totalPage: number
}

const ItemSelectPagination = ({
  currentPage,
  setCurrentPage,
  totalPage,
}: ItemSelectPaginationProps) => (
  <div className="bg-ash-700 text-background flex items-center gap-1 rounded-3xl px-5 py-2 sm:rounded-full">
    <Button
      type="button"
      variant="ghost"
      size="icon"
      disabled={currentPage <= 1}
      onClick={() => setCurrentPage(currentPage - 1)}
      className="size-8 disabled:opacity-40"
    >
      <ChevronLeft />
      <span className="sr-only">이전 페이지</span>
    </Button>

    {pageNumbers(currentPage, totalPage).map((page, index) =>
      page === "gap" ? (
        <span key={`gap${index}`} aria-hidden="true" className="px-1 text-sm">
          ···
        </span>
      ) : (
        <Button
          key={page}
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => setCurrentPage(page)}
          className="group size-8"
        >
          {page === currentPage && <span className="sr-only">현재 페이지</span>}
          <span
            className={cn(
              "border-b-2 pt-1",
              page === currentPage
                ? "border-background group-hover:border-accent-foreground"
                : "border-transparent",
            )}
          >
            {page}
          </span>
        </Button>
      ),
    )}

    <Button
      type="button"
      variant="ghost"
      size="icon"
      disabled={currentPage >= totalPage}
      onClick={() => setCurrentPage(currentPage + 1)}
      className="size-8 disabled:opacity-40"
    >
      <ChevronRight />
      <span className="sr-only">다음 페이지</span>
    </Button>
  </div>
)

export default ItemSelectPagination
