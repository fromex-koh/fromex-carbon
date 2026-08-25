"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Ellipsis } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type CarbonPaginationProps = {
  mode?: "normal" | "modal"
  currentPage: number
  setCurrentPage: (page: number) => void
  totalPage: number
}

const CarbonPagination = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & CarbonPaginationProps
>(
  (
    { className, currentPage, setCurrentPage, totalPage, mode = "normal" },
    ref,
  ) => {
    const [displaySize, setDisplaySize] = React.useState<"2xs" | "xs" | "sm">(
      "2xs",
    )

    React.useEffect(() => {
      const getSize = () => {
        if (window?.innerWidth < 360) {
          return "2xs"
        }
        if (window?.innerWidth < 520) {
          return "xs"
        }
        return "sm"
      }

      const updateSize = () => {
        setDisplaySize(getSize())
      }
      updateSize()
      window.addEventListener("resize", updateSize)
      return () => window.removeEventListener("resize", updateSize)
    }, [])

    const getDisplayCount = () => {
      if (displaySize === "2xs") {
        return 3
      }
      if (displaySize === "xs") {
        return 5
      }
      return 7
    }

    const isDisablePrevButton = () => currentPage <= getDisplayCount()

    const isDisableNextButton = () =>
      totalPage - currentPage < getDisplayCount()

    const getStartNumber = () => currentPage - Math.floor(getDisplayCount() / 2)

    const isNeedFirstNumber = () =>
      currentPage > Math.ceil(getDisplayCount() / 2)

    const isNeedLastNumber = () =>
      totalPage - currentPage >= Math.ceil(getDisplayCount() / 2)

    const isValidNumber = (index: number) =>
      getStartNumber() + index > 0 && getStartNumber() + index <= totalPage

    const isActive = (index: number) => getStartNumber() + index === currentPage

    const goPrev = () => {
      setCurrentPage(
        currentPage <= getDisplayCount() ? 1 : currentPage - getDisplayCount(),
      )
    }

    const goNext = () => {
      setCurrentPage(
        totalPage - currentPage <= getDisplayCount()
          ? totalPage
          : currentPage + getDisplayCount(),
      )
    }

    return (
      <div
        ref={ref}
        className={cn(
          "grid grid-cols-2 gap-1 sm:flex",
          mode === "modal" &&
            "rounded-3xl bg-ash-800/50 px-5 py-3 text-background sm:rounded-full",
          className,
        )}
      >
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={"ghost"}
                size={"icon"}
                disabled={isDisablePrevButton()}
                onClick={goPrev}
                className={"justify-self-end"}
              >
                <ChevronLeft />
                <span className="sr-only">이전</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>이전</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={"ghost"}
                size={"icon"}
                disabled={isDisableNextButton()}
                onClick={goNext}
                className={cn("justify-self-start sm:order-last")}
              >
                <ChevronRight />
                <span className="sr-only">다음</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>다음</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <div
          className={"col-span-2 flex items-center gap-1 justify-self-center"}
        >
          {isNeedFirstNumber() && (
            <>
              <Button
                variant={"ghost"}
                size={"icon"}
                onClick={() => {
                  setCurrentPage(1)
                }}
              >
                <div className="border-b-2 border-transparent pt-1">1</div>
              </Button>
              <Ellipsis size={18} />
            </>
          )}
          {Array.from({ length: getDisplayCount() }).map(
            (_, index) =>
              isValidNumber(index) && (
                <Button
                  key={"pagination" + getStartNumber() + index}
                  variant={"ghost"}
                  size={"icon"}
                  className={"group"}
                  onClick={() => {
                    setCurrentPage(getStartNumber() + index)
                  }}
                >
                  {isActive(index) && (
                    <span className="sr-only">현재 페이지</span>
                  )}
                  <div
                    className={cn(
                      "border-b-2 pt-1",
                      isActive(index) &&
                        mode === "modal" &&
                        "border-background group-hover:border-accent-foreground",
                      isActive(index) && mode !== "modal" && "border-reverse",
                      !isActive(index) && "border-transparent",
                    )}
                  >
                    {getStartNumber() + index}
                  </div>
                </Button>
              ),
          )}
          {isNeedLastNumber() && (
            <>
              <Ellipsis size={18} />
              <Button
                variant={"ghost"}
                size={"icon"}
                onClick={() => {
                  setCurrentPage(totalPage)
                }}
              >
                <div className="border-b-2 border-transparent pt-1">
                  {totalPage}
                </div>
              </Button>
            </>
          )}
        </div>
      </div>
    )
  },
)
CarbonPagination.displayName = "CustomPagination"

export { CarbonPagination }
