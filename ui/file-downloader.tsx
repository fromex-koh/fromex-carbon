"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

type FileDownloaderProps = {
  fileName: string
  fileType: string
  fileSize: number
  fileDownload: () => void
  isValid?: boolean
}

const FileDownloader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & FileDownloaderProps
>(
  (
    {
      fileName,
      fileType,
      fileSize,
      fileDownload,
      className,
      children,
      isValid = true,
      ...props
    },
    ref,
  ) => {
    const getFileSize = (size: number) => {
      if (size < 1024 * 1024) {
        return (size / 1024).toFixed(0) + " KB"
      }
      if (size < 1024 * 1024 * 1024) {
        return (size / (1024 * 1024)).toFixed(1) + " MB"
      }
      return (size / (1024 * 1024 * 1024)).toFixed(2) + " GB"
    }

    return (
      <Card ref={ref} className={className} isValid={isValid} {...props}>
        <CardContent
          className={cn(
            "flex h-full w-full flex-row items-center justify-center gap-0.5 p-2 max-sm:grid max-sm:grid-cols-2",
          )}
        >
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="truncate pt-0.5 pl-2 max-sm:col-span-2 max-sm:pt-1.5 max-sm:pr-1">
                  {fileName}
                </div>
              </TooltipTrigger>
              <TooltipContent variant={"shadow"}>
                {fileName}.{fileType}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <div></div>
          <div className="max-sm:flex max-sm:items-center max-sm:justify-end sm:contents">
            <div className="pt-0.5 pr-1 whitespace-nowrap sm:grow">
              [{fileType}, {getFileSize(fileSize)}]
            </div>
            <Button
              className={"gap-0 pr-3 pl-0 text-base max-sm:ml-0"}
              variant={"ghost"}
              onClick={fileDownload}
            >
              <Download className="m-2.5" />
              <span className="pt-0.5">다운로드</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  },
)
FileDownloader.displayName = "FileDownloader"

export { FileDownloader }
