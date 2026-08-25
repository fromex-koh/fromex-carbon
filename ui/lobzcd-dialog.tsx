"use client"

import React, { useEffect, useRef, useState } from "react"
import { Button, ButtonProps, buttonVariants } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogCloseButton,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { CarbonPagination } from "@/components/ui/carbon-pagination"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { useDebounceCallback } from "usehooks-ts"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Info } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

type lobzcdMiddleType = {
  lobzcd: string
  lobznm: string
  lobzLclscd?: string | null
  limtWhretLobzYn?: string | null
  lonImcpLobzYn?: string | null
  rcmtPsblLobzYn?: string | null
}

type lobzcdType = {
  lobzcd: string
  lobznm: string
  middleLobznm: string
}

type lobzcdResponse = {
  data: lobzcdType[]
  total: number
  page: number
  size: number
}

interface LobzcdDialogProps {
  setLobzcd: (value: string) => void
}

const LobzcdDialogDescription = () => {
  return (
    <>
      실제 영위중인 업종이 법인등기부등본, 사업자등록증상의 업종과 상이할 경우
      실제 영위중인 업종선택
      <br />
      2개 이상 업종 겸영하는 경우에는 매출액이 큰 업종 선택, 업종을 전환하는
      기업은 현재 실제로 영위중인 업종 선택
    </>
  )
}

const LobzcdDialog = React.forwardRef<
  HTMLButtonElement,
  ButtonProps & LobzcdDialogProps
>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      setLobzcd,
      onClick,
      children,
      ...props
    },
    ref,
  ) => {
    const [searchValue, setSearchValue] = useState("")
    const [middleType, setMiddleType] = useState("all")
    const [page, setPage] = useState(1)
    const [innerWidth, setInnerWidth] = useState(0)
    const [offset, setOffset] = useState(0)
    const dialogRef = useRef<HTMLDivElement>(null)
    const [isTooltipOpen, setIsTooltipOpen] = useState(false)

    useEffect(() => {
      const handleViewportChange = () => {
        const dialogHeight =
          dialogRef?.current?.getBoundingClientRect().height ?? 0
        const vh = window.visualViewport?.height ?? window.innerHeight
        const fullHeight = window.innerHeight
        if (dialogHeight < vh && vh < fullHeight) {
          const keyboardHeight = fullHeight - vh
          const needUpOffset =
            keyboardHeight -
            (fullHeight - Math.min(fullHeight, dialogHeight)) / 2
          setOffset(Math.max(needUpOffset, 0))
          return
        }
        setOffset(0)
      }
      window.visualViewport?.addEventListener("resize", handleViewportChange)
      return () => {
        window.visualViewport?.removeEventListener(
          "resize",
          handleViewportChange,
        )
      }
    }, [])

    useEffect(() => {
      const observer = new ResizeObserver(() => {
        setInnerWidth(window.innerWidth)
      })
      observer.observe(document.body)
      return () => observer.disconnect()
    }, [])

    const debouncedSearch = useDebounceCallback((value: string) => {
      setSearchValue(value)
    }, 500)

    const {
      data: lobzcdMiddles,
      isFetching: isMiddleFetching,
      isPending: isMiddlePending,
      error: middleError,
    } = useQuery<lobzcdMiddleType[]>({
      queryKey: ["lobzcd"],
      queryFn: () =>
        fetch(`${process.env.NEXT_PUBLIC_BASE_PATH}/api/lobzcd/middle`).then(
          (res) => res.json() as Promise<lobzcdMiddleType[]>,
        ),
      staleTime: 5000,
      placeholderData: keepPreviousData,
    })

    const {
      data: apiResponse,
      isFetching: isResultFetching,
      isPending: isResultPending,
      error: resultError,
    } = useQuery<lobzcdResponse>({
      queryKey: ["lobzcd", searchValue, middleType, page],
      queryFn: () =>
        fetch(
          `${process.env.NEXT_PUBLIC_BASE_PATH}/api/lobzcd/result?search-value=${searchValue}&middle-type=${middleType}&page=${page}`,
        ).then((res) => res.json() as Promise<lobzcdResponse>),
      staleTime: 5000,
      placeholderData: keepPreviousData,
    })

    const isLoading =
      isMiddleFetching || isMiddlePending || isResultFetching || isResultPending
    const isError = !!middleError || !!resultError

    const data = apiResponse?.data

    const getPlaceHolder = () => {
      if (isMiddleFetching || isMiddlePending) {
        return "로딩 중"
      }
      if (middleError) {
        return "오류 발생"
      }
      return "선택"
    }

    const isNotDataState = () =>
      isLoading ||
      isError ||
      (!searchValue && middleType === "all") ||
      !data?.length

    const getNotDataMessage = () => {
      if (isLoading) {
        return "데이터 로딩 중 입니다"
      }
      if (isError) {
        return "데이터 로딩 중 오류가 발생했습니다. 재시도 바랍니다."
      }
      if (!searchValue && middleType === "all") {
        return "업종 코드를 검색하거나, 중분류를 먼저 선택해주세요"
      }
      return "검색된 업종이 없습니다"
    }

    return (
      <Dialog
        onOpenChange={() => {
          setPage(1)
          setSearchValue("")
          setMiddleType("all")
        }}
      >
        <DialogTrigger asChild>
          {asChild ? (
            children
          ) : (
            <Button
              className={cn(buttonVariants({ variant, size, className }))}
              ref={ref}
              {...props}
            >
              {children}
            </Button>
          )}
        </DialogTrigger>
        <DialogContent
          ref={dialogRef}
          onOpenAutoFocus={(e) => e.preventDefault()}
          className="flex max-h-svh w-full flex-col gap-2.5 rounded-xl shadow-none max-lg:min-w-full md:px-13 md:py-10 lg:max-w-[1276px]"
          style={{
            transition: "transform 0.2s ease-out",
            transform: `translateY(-${offset}px)`,
          }}
        >
          <DialogDescription className={"sr-only"} />
          <DialogTitle className="relative flex flex-col gap-4 font-normal">
            <div className="flex flex-row items-center gap-1 text-3xl font-bold [@media(max-height:752px)]:pb-2">
              업종을 검색해보세요
              <TooltipProvider>
                <Tooltip open={isTooltipOpen} onOpenChange={setIsTooltipOpen}>
                  <TooltipTrigger asChild>
                    <Info
                      onClick={() => {
                        setIsTooltipOpen(true)
                      }}
                      className={
                        "cursor-help text-ash-500 [@media(min-height:753px)]:[@media(min-width:768px)]:hidden"
                      }
                    />
                  </TooltipTrigger>
                  <TooltipContent
                    className={"max-[500px]:w-[345px]"}
                    variant={"shadow"}
                  >
                    <LobzcdDialogDescription />
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <DialogCloseButton className="top-[-60px] right-[-16px] ml-auto max-md:absolute" />
            </div>
            <div className="text-sm whitespace-nowrap lg:text-base [@media(max-height:752px),(max-width:767px)]:hidden">
              <LobzcdDialogDescription />
            </div>
            <div
              className={
                "flex gap-2.5 max-md:flex-col max-md:pt-0 lg:mb-6 [@media(max-height:752px)]:pt-2"
              }
            >
              <Input
                className="h-[52px] w-full rounded-md px-4 shadow-none placeholder:text-ash-600"
                placeholder="업종 코드, 업종명을 검색해보세요"
                onChange={(e) => {
                  debouncedSearch(e.target.value)
                  setPage(1)
                }}
                onKeyUp={(e) => {
                  if (e.key === "Enter") {
                    ;(e.target as HTMLInputElement).blur()
                  }
                }}
              />
              <Select
                defaultValue={"all"}
                onValueChange={(value) => {
                  setMiddleType(value)
                  setPage(1)
                }}
              >
                <SelectTrigger className="!h-[52px] w-full rounded-md px-4 shadow-none">
                  <SelectValue
                    className="text-ash-600"
                    placeholder={getPlaceHolder()}
                  />
                </SelectTrigger>
                <SelectContent className="bg-background">
                  <SelectItem
                    className={
                      "bg-background hover:bg-accent hover:text-accent-foreground"
                    }
                    value={"all"}
                  >
                    모든 중분류
                  </SelectItem>
                  {lobzcdMiddles?.map((lobzcdMiddle, index) => (
                    <SelectItem
                      className={
                        "bg-background hover:bg-accent hover:text-accent-foreground"
                      }
                      key={lobzcdMiddle.lobzcd + index}
                      value={lobzcdMiddle.lobzcd}
                    >
                      <div
                        className={"truncate"}
                        style={{ maxWidth: `${innerWidth - 96}px` }}
                      >
                        {lobzcdMiddle.lobznm}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </DialogTitle>
          <DialogFooter className="relative">
            <Card
              className={cn(
                "w-full border-none shadow-none",
                isNotDataState() && "bg-ash-200",
              )}
            >
              <CardContent
                className={cn(
                  "flex w-full flex-col items-center justify-start gap-2.5 p-0",
                  "[@media(min-height:666px)]:[@media(max-width:767px)]:min-h-[400px]",
                  "rounded-xl bg-background [@media(min-height:655px)]:min-h-[453px]",
                  isNotDataState() && "justify-center bg-ash-100",
                )}
              >
                {isNotDataState() ? (
                  <div className="w-fu p-2 text-center text-lg break-keep max-md:text-sm">
                    {getNotDataMessage()}
                  </div>
                ) : (
                  <ScrollArea className="flex h-full w-full flex-1 flex-col justify-between gap-2.5 [@media(min-height:655px)]:max-h-[453px] [@media(min-height:666px)]:[@media(max-width:767px)]:max-h-[400px]">
                    <div className="flex h-full w-full flex-col gap-2.5 p-[1px] pr-[2px]">
                      {data?.map((result) => (
                        <DialogClose
                          key={result.lobzcd}
                          onClick={() => {
                            setLobzcd(result.lobzcd)
                            setPage(1)
                            setSearchValue("")
                            setMiddleType("all")
                          }}
                          asChild
                        >
                          <div
                            className={cn(
                              "flex w-full gap-2 rounded-md bg-ash-100 px-4 py-4 md:px-6",
                              "cursor-pointer hover:ring max-md:flex-col md:items-center md:justify-between",
                            )}
                          >
                            <div className={"flex items-center gap-6"}>
                              <div className={"font-bold"}>{result.lobzcd}</div>
                              <div className={"max-md:hidden"}>
                                {result.lobznm}
                              </div>
                              <Badge
                                className={"md:hidden"}
                                variant={"tertiary"}
                              >
                                <div
                                  className={"truncate"}
                                  style={{ maxWidth: `${innerWidth - 160}px` }}
                                >
                                  {result.middleLobznm}
                                </div>
                              </Badge>
                            </div>
                            <div>
                              <Badge
                                className={
                                  "px-3.5 py-1.5 font-bold max-md:hidden"
                                }
                                variant={"tertiary"}
                              >
                                {result.middleLobznm}
                              </Badge>
                              <div
                                className={"truncate text-sm md:hidden"}
                                style={{ maxWidth: `${innerWidth - 80}px` }}
                              >
                                {result.lobznm}
                              </div>
                            </div>
                          </div>
                        </DialogClose>
                      ))}
                    </div>
                    <div
                      className={
                        "sticky bottom-0 mt-2 flex items-center justify-center self-center"
                      }
                    >
                      <CarbonPagination
                        mode={"modal"}
                        className={""}
                        currentPage={page}
                        setCurrentPage={setPage}
                        totalPage={Math.ceil((apiResponse?.total ?? 1) / 10)}
                      />
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  },
)
LobzcdDialog.displayName = "LobzcdDialog"
export { LobzcdDialog }
