/* eslint-disable @typescript-eslint/no-unused-vars,@typescript-eslint/no-unused-expressions,react-hooks/exhaustive-deps */
"use client"

import * as React from "react"
import toast from "@/components/ui/use-toast"
import { useDropzone } from "react-dropzone"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { CircleX, HardDriveUpload } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type SingleFileUploaderProps = {
  maxSize?: number
  setFile?: (file: File) => void
  acceptedTypes?: string[]
  isValid?: boolean
}

const SingleFileUploader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & SingleFileUploaderProps
>(
  (
    {
      maxSize = 20 * 1024 * 1024,
      acceptedTypes,
      setFile,
      className,
      children,
      isValid = true,
      ...props
    },
    ref,
  ) => {
    const [uploadFile, setUploadFile] = React.useState<File>()
    const fileInputRef = React.useRef<HTMLInputElement | null>(null)

    React.useEffect(() => {
      uploadFile && setFile && setFile(uploadFile)
    }, [uploadFile])

    const onDrop = React.useCallback(
      (acceptedFiles: File[]) => {
        fileUpload(acceptedFiles)
      },
      [uploadFile],
    )

    const getFileSize = (size: number) => {
      if (size === Infinity) {
        return "제한 없음"
      }
      if (size < 1024 * 1024) {
        return (size / 1024).toFixed(0) + " KB"
      }
      if (size < 1024 * 1024 * 1024) {
        return (size / (1024 * 1024)).toFixed(1) + " MB"
      }
      return (size / (1024 * 1024 * 1024)).toFixed(2) + " GB"
    }

    const validateType = (file: File) => {
      if (!acceptedTypes) {
        return true
      }
      return acceptedTypes.includes(
        file.name.slice(file.name.lastIndexOf(".")).toLowerCase(),
      )
    }

    const validateSize = (file: File) => {
      if (file.size < 1024) {
        return false
      }
      if (!maxSize) {
        return true
      }
      return file.size <= maxSize
    }

    const validate = (file: File) => {
      if (!validateType(file)) {
        const isError = true
        const errorMsg = (
          <>
            <div className="font-semibold">{file.name}</div>
            <div>
              첨부 가능한 확장자가 아닙니다.
              <br />
              첨부 가능 확장자 : [{acceptedTypes}]
            </div>
          </>
        )
        return { isError, errorMsg }
      }
      if (!validateSize(file)) {
        const isError = true
        const errorMsg = (
          <>
            <div className="font-semibold">{file.name}</div>
            <div>
              파일 당 첨부 가능한 용량 제한을 초과 했습니다.
              <br />
              해당 파일 용량 : {getFileSize(file.size)}
              <br />
              파일 당 용량 제한 : 최소 1 KB, 최대{" "}
              {getFileSize(maxSize || Infinity)}
            </div>
          </>
        )
        return { isError, errorMsg }
      }
      const isError = false
      const errorMsg = <></>
      return { isError, errorMsg }
    }

    const fileUpload = (files: File[]) => {
      files.forEach((file) => {
        validate(file).isError
          ? toast.error("파일 업로드 실패", {
              description: validate(file).errorMsg,
            })
          : setUploadFile(file)
      })
    }

    const deleteFile = () => {
      setUploadFile(undefined)
    }

    const { getRootProps, getInputProps, open, isDragActive, fileRejections } =
      useDropzone({
        onDrop,
        maxFiles: 1,
        noClick: true,
        noKeyboard: true,
        multiple: false,
      })

    React.useEffect(() => {
      const tooManyFiles = fileRejections.some((fileRejection) =>
        fileRejection.errors.some((error) => error.code === "too-many-files"),
      )

      const errorMsg = (
        <div>
          하나의 파일만 첨부하실 수 있습니다.
          <br />
          첨부를 시도하신 파일 개수 : {fileRejections.length}
          <br />
        </div>
      )

      tooManyFiles && toast.error("파일 업로드 실패", { description: errorMsg })
    }, [fileRejections])

    return (
      <Card
        ref={ref}
        className={cn(isDragActive ? "bg-accent" : "", className)}
        isValid={isValid}
        {...props}
      >
        <CardContent
          {...getRootProps({ className: "dropzone" })}
          className={cn(
            uploadFile ? "p-2" : "p-0",
            "flex h-full w-full flex-row items-center justify-center gap-2",
          )}
        >
          <Input
            type="file"
            ref={(node) => {
              fileInputRef.current = node
            }}
            multiple={false}
            {...getInputProps()}
            onChange={(e) => {
              e.target.files && fileUpload(Array.from(e.target.files))
            }}
          />
          {uploadFile ? (
            <>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button onClick={open} size={"icon"} variant={"ghost"}>
                      <HardDriveUpload className="mx-2.5" />
                      <span className="sr-only">파일선택</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>파일선택</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="truncate pt-0.5">{uploadFile.name}</div>
                  </TooltipTrigger>
                  <TooltipContent variant={"shadow"}>
                    {uploadFile.name}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <div className="grow pt-0.5 whitespace-nowrap">
                [{getFileSize(uploadFile.size)}]
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size={"icon"}
                      variant={"ghost"}
                      onClick={deleteFile}
                    >
                      <CircleX className="m-2.5 text-destructive" />
                      <span className="sr-only">파일삭제</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-destructive">
                    삭제
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </>
          ) : (
            <Button
              onClick={open}
              size={"icon"}
              variant={"ghost"}
              className="h-[52px] w-full rounded-xl"
            >
              <HardDriveUpload />
              파일선택
            </Button>
          )}
        </CardContent>
      </Card>
    )
  },
)
SingleFileUploader.displayName = "SingleFileUploader"

export { SingleFileUploader }
