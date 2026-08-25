/* eslint-disable @typescript-eslint/no-unused-expressions,react-hooks/exhaustive-deps */
"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Button, ButtonProps, buttonVariants } from "@/components/ui/button"
import { ChevronsUp, CircleX, HardDriveUpload } from "lucide-react"
import { useDropzone } from "react-dropzone"
import { Input } from "@/components/ui/input"
import toast from "@/components/ui/use-toast"
import { Slot } from "@radix-ui/react-slot"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type FileUploaderProps = {
  maxFiles?: number
  maxSize?: number
  totalMaxSize?: number
  setFiles?: (files: File[]) => void
  acceptedTypes?: string[]
  isValid?: boolean
}

type FileUploaderContextProps = {
  uploadFiles: File[]
  setUploadFiles: (files: File[]) => void
  isValid?: boolean
} & FileUploaderProps

const FileUploaderContext =
  React.createContext<FileUploaderContextProps | null>(null)

function useFileUploader() {
  const context = React.useContext(FileUploaderContext)

  if (!context) {
    throw new Error("useFileUploader must be used within a <FileUploader />")
  }

  return context
}

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

const FileUploader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & FileUploaderProps
>(
  (
    {
      maxFiles = 1,
      maxSize = 20 * 1024 * 1024,
      totalMaxSize = 100 * 1024 * 1024,
      acceptedTypes,
      setFiles,
      className,
      children,
      isValid = true,
      ...props
    },
    ref,
  ) => {
    const [uploadFiles, setUploadFiles] = React.useState<File[]>([])

    React.useEffect(() => {
      setFiles && setFiles(uploadFiles)
    }, [uploadFiles])

    return (
      <FileUploaderContext.Provider
        value={{
          maxFiles,
          maxSize,
          totalMaxSize,
          acceptedTypes,
          uploadFiles,
          setUploadFiles,
          isValid,
        }}
      >
        <div
          ref={ref}
          className={className}
          role="region"
          aria-roledescription="fileUploader"
          {...props}
        >
          {children}
        </div>
      </FileUploaderContext.Provider>
    )
  },
)
FileUploader.displayName = "FileUploader"

const FileUploaderCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const {
    maxFiles,
    maxSize,
    totalMaxSize,
    acceptedTypes,
    setUploadFiles,
    uploadFiles,
    isValid,
  } = useFileUploader()
  const fileInputRef = React.useRef<HTMLInputElement | null>(null)

  const onDrop = React.useCallback(
    (acceptedFiles: File[]) => {
      fileUpload(acceptedFiles)
    },
    [uploadFiles],
  )

  const validateFilesCount = () => {
    if (!maxFiles) {
      return true
    }
    return uploadFiles.length < maxFiles
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

  const validateTotalMaxSize = (file: File) => {
    if (!totalMaxSize) {
      return true
    }
    return (
      [...uploadFiles, file].reduce(
        (sum, currentFile) => sum + currentFile.size,
        0,
      ) <= totalMaxSize
    )
  }

  const validate = (file: File) => {
    if (!validateFilesCount()) {
      const isError = true
      const errorMsg = (
        <>
          <div className="font-semibold">{file.name}</div>
          <div>
            최대 첨부 가능 파일 개수를 초과했습니다.
            <br />
            첨부 가능 개수 : {maxFiles}
          </div>
        </>
      )
      return { isError, errorMsg }
    }
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
    if (!validateTotalMaxSize(file)) {
      const isError = true
      const errorMsg = (
        <>
          <div className="font-semibold">{file.name}</div>
          <div>
            첨부 가능한 총 용량 제한을 초과 했습니다.
            <br />
            해당 파일 용량 : {getFileSize(file.size)}
            <br />
            현재 첨부 용량 :{" "}
            {getFileSize(
              uploadFiles.reduce(
                (sum, currentFile) => sum + currentFile.size,
                0,
              ),
            )}
            <br />
            전체 용량 제한 : {getFileSize(totalMaxSize || Infinity)}
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
      validate(file).isError &&
        toast.error("파일 업로드 실패", {
          description: validate(file).errorMsg,
        })
    })

    const successFiles = files.filter((file) => !validate(file).isError)
    setUploadFiles([...uploadFiles, ...successFiles])
  }

  const checkNotLimitFileCount = () => {
    if (!validateFilesCount()) {
      const errorMsg = (
        <div>
          최대 첨부 가능 파일 개수를 초과했습니다.
          <br />
          첨부 가능 개수 : {maxFiles}
        </div>
      )
      toast.error("파일 업로드 불가", { description: errorMsg })
      return false
    }
    return true
  }

  const { getRootProps, getInputProps, open, isDragActive } = useDropzone({
    onDrop,
    maxFiles: maxFiles,
    noClick: true,
    noKeyboard: true,
  })

  return (
    <Card
      ref={ref}
      className={cn(isDragActive ? "bg-accent" : "bg-active", className)}
      isValid={isValid}
      {...props}
    >
      <CardContent
        {...getRootProps({ className: "dropzone" })}
        className="flex h-full w-full flex-col items-center justify-center gap-2 p-0"
      >
        <Input
          type="file"
          ref={(node) => {
            fileInputRef.current = node
          }}
          multiple
          {...getInputProps()}
          onChange={(e) => {
            e.target.files && fileUpload(Array.from(e.target.files))
          }}
        />
        {isDragActive ? (
          <>
            <div className="h-[30px]" />
            <div>여기에 파일을 놓으세요</div>
            <ChevronsUp size={30} className="animate-bounce" />
          </>
        ) : (
          <>
            <div>
              <div>첨부할 파일을 여기에 끌어다 놓거나,</div>
              <div>파일 선택 버튼을 직접 선택해주세요.</div>
            </div>
            <Button
              onClick={() => {
                checkNotLimitFileCount() && open()
              }}
              variant={"outline"}
            >
              <HardDriveUpload />
              파일선택
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
})
FileUploaderCard.displayName = "FileUploaderCard"

const FileUploaderList = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { setUploadFiles, uploadFiles } = useFileUploader()

  const deleteFile = (index: number) => {
    setUploadFiles(uploadFiles.filter((_, i) => i !== index))
  }

  return (
    <div
      className={cn("flex w-full flex-col gap-2", className)}
      ref={ref}
      {...props}
    >
      {uploadFiles.map((file, index) => (
        <Card key={index}>
          <CardContent className="flex w-full flex-row items-center gap-2 p-2 pl-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="truncate pt-0.5">{file.name}</div>
                </TooltipTrigger>
                <TooltipContent variant={"shadow"}>{file.name}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <div className="grow pt-0.5 whitespace-nowrap">
              [{getFileSize(file.size)}]
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size={"icon"}
                    variant={"ghost"}
                    onClick={() => {
                      deleteFile(index)
                    }}
                  >
                    <CircleX className="m-2.5 text-destructive" />
                    <span className="sr-only">파일삭제</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-destructive">삭제</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardContent>
        </Card>
      ))}
    </div>
  )
})
FileUploaderList.displayName = "FileUploaderList"

const FileUploaderDelete = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, onClick, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    const { setUploadFiles } = useFileUploader()

    return (
      <Comp
        onClick={(e) => {
          setUploadFiles([])
          onClick?.(e)
        }}
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  },
)
FileUploaderDelete.displayName = "FileUploaderDelete"

const FileUploaderCounter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { uploadFiles, maxFiles } = useFileUploader()
  return (
    <div className={className} ref={ref} {...props}>
      <span className="text-sm font-semibold text-primary">
        {uploadFiles.length}
      </span>
      <span className="text-sm text-muted-foreground">
        {maxFiles && ` / ${maxFiles}`} 개
      </span>
    </div>
  )
})
FileUploaderCounter.displayName = "FileUploaderCounter"

export {
  FileUploader,
  FileUploaderCard,
  FileUploaderList,
  FileUploaderDelete,
  FileUploaderCounter,
}
