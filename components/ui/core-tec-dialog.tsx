// @ts-nocheck -- 원본에서 넘어오지 않은 모듈(@/hooks/remote-store 등) 때문에
// 발생하는 타입 에러를 억제한다. 퍼블리싱 단계 임시 조치이며,
// 빠진 모듈이 들어오면 이 주석 3줄만 지우면 된다.
import React, { useEffect, useRef, useState } from "react"
import { Button, ButtonProps, buttonVariants } from "@/components/ui/button"
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
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  CoreTechnology,
  useGetCoreTechnologyModalOnload,
} from "@/hooks/remote-store"
import { Input } from "@/components/ui/input"
import { useDebounceValue } from "usehooks-ts"

interface CoreTecDialogProps {
  setCoreTec: (value: CoreTechnology) => void
}

const CoreTecDialog = React.forwardRef<
  HTMLButtonElement,
  ButtonProps & CoreTecDialogProps
>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      setCoreTec,
      onClick,
      children,
      ...props
    },
    ref,
  ) => {
    const [offset, setOffset] = useState(0)
    const [keyword, setKeyword] = useState("")
    const [debouncedKeyword] = useDebounceValue(keyword, 500)
    const dialogRef = useRef<HTMLDivElement>(null)

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

    const {
      data: coreTec,
      isFetching,
      isPending,
      error,
    } = useGetCoreTechnologyModalOnload()

    const data = coreTec?.data?.data?.coreTechnologies

    const isLoading = isFetching || isPending
    const isError = !!error

    const isNotDataState = () => isLoading || isError || !data?.length

    const filteredData = data?.filter(
      (result) =>
        !debouncedKeyword || result.coreTenm?.includes(debouncedKeyword),
    )

    const getNotDataMessage = () => {
      if (isLoading) {
        return "데이터 로딩 중 입니다"
      }
      if (isError) {
        return "데이터 로딩 중 오류가 발생했습니다. 재시도 바랍니다."
      }
    }

    return (
      <Dialog onOpenChange={() => setKeyword("")}>
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
              핵심기술을 선택해 주세요.
              <DialogCloseButton className="top-[-60px] right-[-16px] ml-auto max-sm:absolute" />
            </div>
          </DialogTitle>
          <DialogFooter>
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
                <Input
                  placeholder={"검색어를 입력해주세요."}
                  onChange={(e) => setKeyword(e.target.value)}
                />
                {isNotDataState() ? (
                  <div className="w-full p-2 text-center text-lg break-keep max-md:text-sm">
                    {getNotDataMessage()}
                  </div>
                ) : (
                  <ScrollArea className="flex h-full w-full flex-1 flex-col justify-between gap-2.5 [@media(min-height:655px)]:max-h-[390px] [@media(min-height:666px)]:[@media(max-width:767px)]:max-h-[337px]">
                    <div className="flex h-full w-full flex-col gap-2.5 p-[1px] pr-[2px]">
                      {!filteredData ||
                        (!filteredData.length && (
                          <div className="flex w-full items-center justify-center p-2 text-lg max-md:text-sm">
                            검색 결과가 없습니다
                          </div>
                        ))}
                      {filteredData?.map((result) => (
                        <DialogClose
                          key={result.id}
                          onClick={() => {
                            setCoreTec(result)
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
                                {result.coreTenm}
                              </div>
                            </div>
                          </div>
                        </DialogClose>
                      ))}
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
CoreTecDialog.displayName = "CoreTecDialog"
export { CoreTecDialog }
