"use client"

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { navBarHeight } from "@/lib/const"

type NavigationAreaProps = {
  offsetMargin?: number
}

type NavigationAreaContextProps = {
  pageTitle?: string
  titles: React.MutableRefObject<string[]>
  activeIndex?: number
  setActiveIndex: (index: number) => void
  refs: React.MutableRefObject<Array<HTMLDivElement | null>>
  scrollToRef: (index: number) => void
  offsetMargin: number
} & NavigationAreaProps

const NavigateContext = createContext<NavigationAreaContextProps | null>(null)

const useNavigateArea = () => {
  const context = useContext(NavigateContext)

  if (!context) {
    throw new Error("useNavigateArea must be used within a <NavigationArea />")
  }

  return context
}

/**
 * @description : NavigationAreaContent 하위컴포넌트에 data-title 있는 경우에만 사이드바에 표현됨
 */
const NavigationArea = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & NavigationAreaProps
>(({ offsetMargin = navBarHeight, className, children, ...props }, ref) => {
  const areaRef = useRef<HTMLDivElement | null>(null)
  const childRefs = useRef<Array<HTMLDivElement | null>>([])
  const [pageTitle, setPageTitle] = useState<string>()
  const [activeIndex, setActiveIndex] = useState<number>()
  const titles = useRef<string[]>([])

  const handleScroll = () => {
    childRefs.current.forEach((ref, index) => {
      if (!ref) {
        return
      }
      const { top } = ref.getBoundingClientRect()
      if (top <= offsetMargin && titles.current[index]) {
        setActiveIndex(index)
      }
    })
  }

  const scrollToRef = (index: number) => {
    const ref = childRefs.current[index]
    if (!ref) {
      return
    }
    const { top } = ref.getBoundingClientRect()
    const scrollY = window.scrollY + top - offsetMargin + 1
    window.scrollTo({ top: scrollY, behavior: "smooth" })
  }

  useEffect(() => {
    window.addEventListener("scroll", handleScroll)
    window.addEventListener("resize", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", handleScroll)
    }
  }, [])

  useEffect(() => {
    const headContent =
      Array.from(areaRef.current?.querySelectorAll("h1") || [])
        .map((h1) => h1.textContent || "")
        .find((textContent) => !!textContent) || ""

    setPageTitle(headContent)
  }, [children])

  return (
    <NavigateContext.Provider
      value={{
        pageTitle,
        refs: childRefs,
        titles,
        activeIndex,
        setActiveIndex,
        scrollToRef,
        offsetMargin: offsetMargin,
      }}
    >
      <div ref={areaRef} className="flex w-full justify-center">
        <div
          ref={ref}
          className={cn(
            "relative flex w-full max-w-[1024px] gap-6 max-md:flex-col",
            className,
          )}
          {...props}
        >
          {children}
        </div>
      </div>
    </NavigateContext.Provider>
  )
})
NavigationArea.displayName = "NavigationArea"

const NavigationAreaContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const { refs, titles, setActiveIndex, offsetMargin } = useNavigateArea()

  useEffect(() => {
    if (titles.current.length <= 0) {
      refs.current
        .flatMap((section) => Array.from(section?.querySelectorAll("h2") || []))
        .map((h2) => h2.textContent || "")
        .forEach((headContent) => {
          titles.current.push(headContent)
        })
    }

    const initialIndex = Math.max(
      0,
      Math.floor((window.scrollY + offsetMargin) / window.innerHeight),
    )
    if (titles.current[initialIndex]) {
      setActiveIndex(initialIndex)
    }
  }, [children])

  return (
    <div
      ref={ref}
      className={cn("mr-auto w-full max-w-[824px]", className)}
      {...props}
    >
      {React.Children.map(children, (child, index) =>
        React.isValidElement(child) ? (
          <div
            ref={(el) => {
              refs.current[index] = el
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
NavigationAreaContent.displayName = "NavigationAreaContent"

const NavigationAreaBar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const { pageTitle, titles, activeIndex, scrollToRef } = useNavigateArea()

  return (
    <>
      <div
        ref={ref}
        className={cn("min-w-[200px] max-md:hidden", className)}
        {...props}
      >
        <Card className="fixed mt-6 min-w-[200px]">
          <CardHeader className="border-b p-3">
            <CardDescription className="text-secondary-foreground">
              이 페이지의 구성
            </CardDescription>
            <CardTitle>{pageTitle}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col p-1">
            {titles.current.map(
              (title, index) =>
                title && (
                  <Button
                    key={index}
                    variant={"ghost"}
                    className={cn(
                      activeIndex === index
                        ? "font-bold"
                        : "text-muted-foreground",
                      "justify-start px-2",
                    )}
                    onClick={() => scrollToRef(index)}
                  >
                    {title}
                  </Button>
                ),
            )}
          </CardContent>
          {children && <CardFooter className="p-2 pt-0">{children}</CardFooter>}
        </Card>
      </div>
      <div
        ref={ref}
        className={cn(
          "sticky bottom-4 flex flex-col justify-center md:hidden",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </>
  )
})
NavigationAreaBar.displayName = "NavigationAreaBar"

export { NavigationArea, NavigationAreaContent, NavigationAreaBar }
