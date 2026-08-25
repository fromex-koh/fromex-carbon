"use client"

import React, {
  createContext,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react"
import { cn } from "@/lib/utils"
import { Button, ButtonProps, buttonVariants } from "@/components/ui/button"
import { jsPDF as JsPDF } from "jspdf"
import Spinner from "@/components/ui/spinner"
import toast from "@/components/ui/use-toast"
import { useMediaQuery } from "usehooks-ts"
import { toJpeg } from "html-to-image"

const paperSizeObj = {
  a0: 3370,
  a1: 2384,
  a2: 1684,
  a3: 1191,
  a4: 842,
  a5: 595,
  a6: 420,
  a7: 298,
  b0: 4008,
  b1: 2835,
  b2: 2004,
  b3: 1417,
  b4: 1001,
  b5: 709,
  b6: 499,
  b7: 354,
}

const paperRatio = 0.707

type ExportPdfProps = {
  margin?: number
  fileName: string
  paperSize?:
    | "a0"
    | "a1"
    | "a2"
    | "a3"
    | "a4"
    | "a5"
    | "a6"
    | "a7"
    | "b0"
    | "b1"
    | "b2"
    | "b3"
    | "b4"
    | "b5"
    | "b6"
    | "b7"
  setProgressSave?: (loading: boolean) => void
}

type ExportPdfContextProps = {
  headerRef: React.MutableRefObject<HTMLElement | null>
  footerRef: React.MutableRefObject<HTMLElement | null>
  pageNumberRef: React.MutableRefObject<HTMLElement | null>
  contentRefs: React.MutableRefObject<Array<HTMLElement | null>>
  paperSize:
    | "a0"
    | "a1"
    | "a2"
    | "a3"
    | "a4"
    | "a5"
    | "a6"
    | "a7"
    | "b0"
    | "b1"
    | "b2"
    | "b3"
    | "b4"
    | "b5"
    | "b6"
    | "b7"
  isSave: boolean
  setIsSave: React.Dispatch<React.SetStateAction<boolean>>
  currentPageNumber: number
  setCurrentPageNumber: React.Dispatch<React.SetStateAction<number>>
} & ExportPdfProps

const ExportPdfContext = createContext<ExportPdfContextProps | null>(null)

const useExportPdf = () => {
  const context = useContext(ExportPdfContext)

  if (!context) {
    throw new Error("useExportPdf must be used within a <ExportPdf />")
  }

  return context
}

const ExportPdf = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement> & ExportPdfProps
>(
  (
    { margin = 40, fileName, paperSize = "a4", setProgressSave, children },
    ref,
  ) => {
    const headerRef = useRef<HTMLElement>(null)
    const footerRef = useRef<HTMLElement>(null)
    const pageNumberRef = useRef<HTMLElement>(null)
    const contentRefs = useRef<Array<HTMLElement | null>>([])
    const [isSave, setIsSave] = useState(false)
    const [currentPageNumber, setCurrentPageNumber] = useState(1)

    useEffect(() => {
      setProgressSave?.(isSave)
    }, [isSave])

    return (
      <ExportPdfContext.Provider
        key={String(ref)}
        value={{
          margin,
          fileName,
          paperSize,
          headerRef,
          footerRef,
          pageNumberRef,
          contentRefs,
          isSave,
          setIsSave,
          currentPageNumber,
          setCurrentPageNumber,
        }}
      >
        {children}
      </ExportPdfContext.Provider>
    )
  },
)
ExportPdf.displayName = "ExportPdf"

const ExportPdfHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const { headerRef, isSave } = useExportPdf()
  return (
    <div
      ref={ref}
      className={cn(
        "light absolute top-[-9999px] left-[-9999px] w-[1024px] opacity-0",
        !isSave && "hidden",
        className,
      )}
      {...props}
    >
      <div
        ref={(el) => {
          headerRef.current = el
        }}
      >
        {children}
      </div>
    </div>
  )
})
ExportPdfHeader.displayName = "ExportPdfHeader"

const ExportPdfFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const { footerRef, isSave } = useExportPdf()
  return (
    <div
      ref={ref}
      className={cn(
        "light absolute top-[-9999px] left-[-9999px] w-[1024px] opacity-0",
        !isSave && "hidden",
        className,
      )}
      {...props}
    >
      <div
        ref={(el) => {
          footerRef.current = el
        }}
      >
        {children}
      </div>
    </div>
  )
})
ExportPdfFooter.displayName = "ExportPdfFooter"

const ExportPdfPageNumber = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { pageNumberClassName?: string }
>(({ className, children, pageNumberClassName, ...props }, ref) => {
  const { pageNumberRef, isSave, currentPageNumber } = useExportPdf()
  return (
    <div
      ref={ref}
      className={cn(
        "light absolute top-[-9999px] left-[-9999px] w-[1024px] opacity-0",
        !isSave && "hidden",
        className,
      )}
      {...props}
    >
      <div
        ref={(el) => {
          pageNumberRef.current = el
        }}
      >
        <div className={"flex w-full items-center justify-center"}>
          <div className={pageNumberClassName}>
            {`- ${currentPageNumber} -`}
          </div>
        </div>
      </div>
    </div>
  )
})
ExportPdfPageNumber.displayName = "ExportPdfPageNumber"

const ExportPdfContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const { contentRefs, isSave } = useExportPdf()

  return (
    <div
      ref={ref}
      className={cn(
        "light absolute top-[-9999px] left-[-9999px] w-[1024px] opacity-0",
        !isSave && "hidden",
        className,
      )}
      {...props}
    >
      {React.Children.map(children, (child, index) =>
        React.isValidElement(child) ? (
          <div
            ref={(el) => {
              contentRefs.current[index] = el
            }}
            key={index}
          >
            {child}
          </div>
        ) : null,
      )}
    </div>
  )
})
ExportPdfContent.displayName = "ExportPdfContent"

export interface ExportPdfGeneratorRef {
  element: HTMLButtonElement | null
  run: () => void
}

const ExportPdfGenerator = React.forwardRef<ExportPdfGeneratorRef, ButtonProps>(
  (
    { className, variant, size, asChild = false, onClick, children, ...props },
    ref,
  ) => {
    const {
      margin = 40,
      fileName,
      paperSize,
      headerRef,
      footerRef,
      pageNumberRef,
      contentRefs,
      isSave,
      setIsSave,
      setCurrentPageNumber,
    } = useExportPdf()
    const isNarrowScreen = useMediaQuery("(max-width: 1023px)")

    const buttonRef = useRef<HTMLButtonElement>(null)

    const handleClick = () => {
      setIsSave(true)
    }

    useImperativeHandle(ref, () => ({
      element: buttonRef.current,
      run: handleClick,
    }))

    const loadImage = (element: HTMLElement): Promise<HTMLImageElement> =>
      new Promise(async (resolve, reject) => {
        const img = new Image()
        img.crossOrigin = "anonymous"
        img.onload = () => resolve(img)
        img.onerror = (e) => reject(e)
        img.src = await toJpeg(element, {
          backgroundColor: "white",
          cacheBust: true,
          pixelRatio: 2,
        })
      })

    const exportPDF = async () => {
      await new Promise((resolve) => setTimeout(resolve, 200))

      if (contentRefs.current.some((ref) => !ref)) {
        toast.error("인쇄할 데이터를 찾을 수 없습니다.")
        return
      }

      const pageWidth = paperSizeObj[paperSize] * paperRatio
      const pageHeight = paperSizeObj[paperSize]
      const pdf = new JsPDF("p", "pt", paperSize)

      const pixelRate = 1.91
      const marginRate = 1.31
      const usableWidth = pageWidth - margin * 2
      const usableHeight = pageHeight * pixelRate - margin * marginRate * 2

      const headerHeight = headerRef.current?.offsetHeight ?? 0
      const footerHeight = footerRef.current?.offsetHeight ?? 0
      const pageNumberHeight = pageNumberRef.current?.offsetHeight ?? 0
      const nonContentHeight = headerHeight + footerHeight + pageNumberHeight

      const elements = contentRefs.current
        .flatMap((el) => Array.from(el?.children ?? []))
        .filter((el): el is HTMLElement => !!el)

      if (
        elements.some(
          (el) => el.offsetHeight + nonContentHeight >= usableHeight,
        )
      ) {
        if (isNarrowScreen) {
          toast.warning(
            "모바일 환경 및 좁은 인터넷 화면에서는 정상적으로 출력되지 않을 수도 있습니다. " +
              "출력물에 이상이 있을 경우 PC 환경을 이용하고 인터넷 창의 크기를 최대로 변경 후 출력 시도 부탁드립니다. " +
              "문제가 반복되면 고객센터에 문의 바랍니다.",
          )
        } else {
          throw new Error("tooLongComp")
        }
      }

      const headerImg = headerRef.current
        ? await loadImage(headerRef.current)
        : null

      const footerImg = footerRef.current
        ? await loadImage(footerRef.current)
        : null

      const pageNumberImg = pageNumberRef.current
        ? await loadImage(pageNumberRef.current)
        : null

      const contentImgs = await Promise.all(
        elements.map(async (element) => {
          const image = await loadImage(element)
          return {
            image: image,
            isNextPage: element?.dataset?.nextPage === "true",
          }
        }),
      )

      let currentY = margin

      const headerScaledHeight =
        headerImg?.height && headerImg?.width
          ? (headerImg.height * usableWidth) / headerImg.width
          : 0

      const footerScaledHeight =
        footerImg?.height && footerImg?.width
          ? (footerImg.height * usableWidth) / footerImg.width
          : 0

      const pageNumberScaledHeight =
        pageNumberImg?.height && pageNumberImg?.width
          ? (pageNumberImg.height * usableWidth) / pageNumberImg.width
          : 0

      const isPageBottom = (scaledHeight: number) =>
        currentY + footerScaledHeight + pageNumberScaledHeight + scaledHeight >
        pageHeight - margin

      const validateHeight = (scaledHeight: number) => {
        if (
          headerScaledHeight +
            footerScaledHeight +
            pageNumberScaledHeight +
            scaledHeight >
          pageHeight - margin * 2
        ) {
          throw new Error("tooLongComp")
        }
      }

      const isLastComp = (index: number) => index + 1 === contentImgs.length

      for (const [index, contentImgObj] of contentImgs.entries()) {
        const contentImg = contentImgObj.image
        const isNextPage = contentImgObj.isNextPage

        if (!index && headerImg && headerScaledHeight) {
          pdf.addImage(
            headerImg,
            "PNG",
            margin,
            currentY,
            usableWidth,
            headerScaledHeight,
          )
          currentY += headerScaledHeight
        }

        const scaledHeight =
          contentImg?.height && contentImg?.width
            ? (contentImg.height * usableWidth) / contentImg.width
            : 0

        validateHeight(scaledHeight)

        if (isPageBottom(scaledHeight) || isNextPage) {
          if (footerImg && footerScaledHeight) {
            currentY =
              pageHeight - margin - footerScaledHeight - pageNumberScaledHeight
            pdf.addImage(
              footerImg,
              "PNG",
              margin,
              currentY,
              usableWidth,
              footerScaledHeight,
            )
          }

          if (pageNumberRef.current && pageNumberScaledHeight) {
            currentY = pageHeight - margin - pageNumberScaledHeight
            pdf.addImage(
              await loadImage(pageNumberRef.current),
              "PNG",
              margin,
              currentY,
              usableWidth,
              pageNumberScaledHeight,
            )
            setCurrentPageNumber((value) => value + 1)
            await new Promise((resolve) => setTimeout(resolve, 1))
          }

          pdf.addPage()
          currentY = margin

          if (headerImg && headerScaledHeight) {
            pdf.addImage(
              headerImg,
              "PNG",
              margin,
              currentY,
              usableWidth,
              headerScaledHeight,
            )
            currentY += headerScaledHeight
          }
        }

        pdf.addImage(
          contentImg,
          "PNG",
          margin,
          currentY,
          usableWidth,
          scaledHeight,
        )
        currentY += scaledHeight

        if (isLastComp(index)) {
          if (footerImg && footerScaledHeight) {
            currentY =
              pageHeight - margin - footerScaledHeight - pageNumberScaledHeight
            pdf.addImage(
              footerImg,
              "PNG",
              margin,
              currentY,
              usableWidth,
              footerScaledHeight,
            )
          }

          if (pageNumberRef.current && pageNumberScaledHeight) {
            currentY = pageHeight - margin - pageNumberScaledHeight
            pdf.addImage(
              await loadImage(pageNumberRef.current),
              "PNG",
              margin,
              currentY,
              usableWidth,
              pageNumberScaledHeight,
            )
          }
          setCurrentPageNumber(1)
        }
      }
      pdf.save(`${fileName}.pdf`)
    }

    useEffect(() => {
      if (!isSave) {
        return
      }
      exportPDF()
        .catch((reason) => {
          console.error(reason)
          const errorMsg =
            String(reason) === "Error: tooLongComp"
              ? "출력하려는 문서의 특정 페이지가 너무 길어서 출력할 수 없습니다. 고객센터로 문의 바랍니다."
              : "pdf 변환 중 오류가 발생했습니다."
          toast.error(errorMsg)
        })
        .finally(() => {
          setIsSave(false)
        })
    }, [isSave])

    if (asChild && React.isValidElement(children)) {
      return (
        <Button
          className={className}
          onClick={(e) => {
            setIsSave(true)
            onClick?.(e)
          }}
          asChild
          disabled={isSave}
          ref={buttonRef}
          {...props}
        >
          {children}
        </Button>
      )
    }

    return (
      <Button
        onClick={(e) => {
          setIsSave(true)
          onClick?.(e)
        }}
        className={cn(buttonVariants({ variant, size, className }))}
        ref={buttonRef}
        {...props}
        disabled={isSave}
      >
        {isSave ? <Spinner size={20} /> : children}
      </Button>
    )
  },
)
ExportPdfGenerator.displayName = "ExportPdfGenerator"

export {
  ExportPdf,
  ExportPdfHeader,
  ExportPdfFooter,
  ExportPdfPageNumber,
  ExportPdfContent,
  ExportPdfGenerator,
}
