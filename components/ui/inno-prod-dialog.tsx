// @ts-nocheck -- 원본에서 넘어오지 않은 모듈(@/hooks/remote-store 등) 때문에
// 발생하는 타입 에러를 억제한다. 퍼블리싱 단계 임시 조치이며,
// 빠진 모듈이 들어오면 이 주석 3줄만 지우면 된다.
import { Button, ButtonProps, buttonVariants } from "@/components/ui/button"
import React, { useEffect, useRef, useState } from "react"
import {
  Dialog,
  DialogClose,
  DialogCloseButton,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { useDebounceCallback } from "usehooks-ts"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  InnovationProductResponse,
  useGetInnovationProductsSearchModalOnload,
} from "@/hooks/remote-store"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { CarbonPagination } from "@/components/ui/carbon-pagination"

interface InnoProdDialogProps {
  setInnoProd: (value: InnovationProductResponse) => void
}

const InnoProdDialog = React.forwardRef<
  HTMLButtonElement,
  ButtonProps & InnoProdDialogProps
>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      setInnoProd,
      onClick,
      children,
      ...props
    },
    ref,
  ) => {
    const [searchValue, setSearchValue] = useState("")
    const dialogRef = useRef<HTMLDivElement>(null)
    const [page, setPage] = useState(1)
    const [offset, setOffset] = useState(0)
    const [innerWidth, setInnerWidth] = useState(0)
    const [filteredData, setFilteredData] =
      useState<InnovationProductResponse[]>()
    const [pagedData, setPagedData] = useState<InnovationProductResponse[]>()
    const [innoItmEnvGolSctcd, setInnoItmEnvGolSctcd] = useState("all")

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
      data: innoProd,
      isFetching,
      isPending,
      error,
    } = useGetInnovationProductsSearchModalOnload()

    const data = innoProd?.data?.data?.innovationProductResponses
    const innoItmEnvGolSctcds = [
      ...new Set(data?.map((data) => data?.environmentInfo?.label ?? "")),
    ]

    const isLoading = isFetching || isPending
    const isError = !!error

    const getPlaceHolder = () => {
      if (isLoading) {
        return "로딩 중"
      }
      if (error) {
        return "오류 발생"
      }
      return "선택"
    }

    /**
     * TODO
     * onclick 이벤트 수정
     */

    const getNotDataMessage = () => {
      if (isLoading) {
        return "데이터 로딩 중 입니다"
      }
      if (isError) {
        return "데이터 로딩 중 오류가 발생했습니다. 재시도 바랍니다."
      }
      return "검색된 품목이 없습니다"
    }

    const isNotDataState = () => isLoading || isError || !data?.length

    useEffect(() => {
      setFilteredData(data)
    }, [data])

    useEffect(() => {
      if (!searchValue) {
        setFilteredData(data)
      }

      const filteredProducts = data?.filter((product) => {
        const matchInput =
          !searchValue ||
          product?.innoPrdnm?.includes(searchValue) ||
          product?.txmyInnoItscd?.includes(searchValue)

        const matchSelect =
          innoItmEnvGolSctcd === "all" ||
          product?.environmentInfo?.label === innoItmEnvGolSctcd

        return matchInput && matchSelect
      })

      setFilteredData(filteredProducts)
    }, [searchValue, innoItmEnvGolSctcd])

    useEffect(() => {
      const pageSize = 10
      const start = (page - 1) * pageSize
      const end = start + pageSize

      setPagedData(filteredData?.slice(start, end))
    }, [page, filteredData])

    return (
      <Dialog
        onOpenChange={() => {
          setPage(1)
          setSearchValue("")
          setInnoItmEnvGolSctcd("all")
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
          <DialogTitle>
            <div className="relative flex flex-row items-center gap-1 text-3xl font-bold [@media(max-height:752px)]:pb-2">
              혁신품목을 선택해 주세요.
              <DialogCloseButton className="top-[-60px] right-[-16px] ml-auto max-sm:absolute" />
            </div>
            <div
              className={
                "mt-5 flex gap-2.5 max-md:flex-col max-md:pt-0 lg:mb-6 [@media(max-height:752px)]:pt-2"
              }
            >
              <Input
                className="h-[52px] w-full rounded-md px-4 shadow-none placeholder:text-ash-600"
                placeholder="품목코드 또는 품목명을 검색해 보세요"
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
                  setInnoItmEnvGolSctcd(value)
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
                    전체
                  </SelectItem>
                  {innoItmEnvGolSctcds?.map((value, index) => (
                    <SelectItem
                      className={
                        "bg-background hover:bg-accent hover:text-accent-foreground"
                      }
                      key={value + index}
                      value={value}
                    >
                      <div
                        className={"truncate"}
                        style={{ maxWidth: `${innerWidth - 96}px` }}
                      >
                        {value}
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
                      {pagedData?.map((result) => (
                        <DialogClose
                          key={result.id}
                          onClick={() => {
                            setInnoProd(result)
                            setPage(1)
                            setSearchValue("")
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
                              <div className={"font-bold"}>
                                {result.txmyInnoItscd}
                              </div>
                              <div className={"max-md:hidden"}>
                                {result.innoPrdnm}
                              </div>
                              <Badge
                                className={"md:hidden"}
                                variant={"tertiary"}
                              >
                                <div
                                  className={"truncate"}
                                  style={{ maxWidth: `${innerWidth - 160}px` }}
                                >
                                  {result.innoPrdnm}
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
                                {result?.environmentInfo?.label}
                              </Badge>
                              <div
                                className={"truncate text-sm md:hidden"}
                                style={{ maxWidth: `${innerWidth - 80}px` }}
                              >
                                {result.innoPrdnm}
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
                        totalPage={Math.ceil((filteredData?.length ?? 1) / 10)}
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
InnoProdDialog.displayName = "InnoItemDialog"
export { InnoProdDialog }
