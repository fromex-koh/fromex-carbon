// @ts-nocheck -- 원본에서 넘어오지 않은 모듈(@/hooks/remote-store 등) 때문에
// 발생하는 타입 에러를 억제한다. 퍼블리싱 단계 임시 조치이며,
// 빠진 모듈이 들어오면 이 주석 3줄만 지우면 된다.
"use client"

import React, {
  useEffect,
  useRef,
  useState,
  forwardRef,
  createContext,
  useContext,
} from "react"
import { AnimatePresence, motion } from "framer-motion"
import { cn, deepFlattenChildren, isIOS } from "@/lib/utils"
import { navBarHeight } from "@/lib/const"

type WallpaperContextProps = {
  direction: "up" | "down"
  setDirection: (data: "up" | "down") => void
  sectionIndex: number
  setSectionIndex: (data: number) => void
  sectionCount: number
  isEnableWheel: boolean
  setIsEnableWheel: (data: boolean) => void
}

const WallpaperContext = createContext<WallpaperContextProps | null>(null)

const useWallpaper = () => {
  const context = useContext(WallpaperContext)

  if (!context) {
    throw new Error("useWallpaper must be used within a <Wallpaper />")
  }

  return context
}

const Wallpaper = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const [sectionIndex, setSectionIndex] = useState(0)
  const [direction, setDirection] = useState<"up" | "down">("down")
  const [innerHeight, setInnerHeight] = useState(0)
  const [isEnableWheel, setIsEnableWheel] = useState(false)
  const childRefs = useRef<Array<HTMLDivElement | null>>([])

  const sectionCount = deepFlattenChildren(children).length
  const offset = direction === "down" ? innerHeight : -innerHeight
  const animationDuration = 400
  const navBarThemeToggleDurationDown = animationDuration * 0.8
  const navBarThemeToggleDurationUp = animationDuration * 0.1
  const animationDurationSecond = animationDuration / 1000

  const checkDarkSection = () => {
    setTimeout(
      () => {
        const current = childRefs.current[sectionIndex]
        const isDarkSection =
          current &&
          Array.from(current.querySelectorAll(".dark-section")).length > 0

        window.dispatchEvent(
          new CustomEvent("sectionColorChange", {
            detail: { isDark: isDarkSection },
          }),
        )
      },
      direction === "down"
        ? navBarThemeToggleDurationDown
        : navBarThemeToggleDurationUp,
    )
  }

  useEffect(() => {
    checkDarkSection()
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [sectionIndex])

  useEffect(() => {
    if (isIOS()) {
      document.documentElement.classList.add("overflow-hidden")
    }
    Array.from(document.getElementsByTagName("main")).forEach((el) => {
      el.style.overflow = "hidden"
      el.style.height = "100dvh"
    })
    document.body.style.minHeight = "100vh"

    const observer = new ResizeObserver(() => {
      setIsEnableWheel(true)
      setInnerHeight(window.innerHeight)
    })
    observer.observe(document.body)

    return () => {
      document.documentElement.classList.remove("overflow-hidden")
      Array.from(document.getElementsByTagName("main")).forEach((el) =>
        el.removeAttribute("style"),
      )

      document.body.style.minHeight = ""

      observer.disconnect()
    }
  }, [])

  return (
    <WallpaperContext.Provider
      value={{
        direction,
        setDirection,
        sectionIndex,
        setSectionIndex,
        sectionCount,
        isEnableWheel,
        setIsEnableWheel,
      }}
    >
      <div
        ref={ref}
        className={cn("relative h-lvh w-full overflow-hidden", className)}
        style={{ marginTop: `-${navBarHeight}px` }}
        {...props}
      >
        {deepFlattenChildren(children).map((child, i) =>
          React.isValidElement(child) ? (
            <AnimatePresence key={"wallpaper" + i}>
              {sectionIndex === i && (
                <motion.div
                  className="absolute flex h-full w-full items-center justify-center"
                  initial={{
                    opacity: 0,
                    y: sectionIndex === 0 && direction === "down" ? 0 : offset,
                  }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -offset }}
                  transition={{ duration: animationDurationSecond }}
                  ref={(el) => {
                    childRefs.current[i] = el
                  }}
                >
                  {child}
                </motion.div>
              )}
            </AnimatePresence>
          ) : null,
        )}
      </div>
    </WallpaperContext.Provider>
  )
})
Wallpaper.displayName = "Wallpaper"

type WallpaperSectionContextProps = {
  setMaxCardIndex: (data: number) => void
  cardIndex: number
}

const WallpaperSectionContext =
  createContext<WallpaperSectionContextProps | null>(null)

const useWallpaperSection = () => {
  const context = useContext(WallpaperSectionContext)

  if (!context) {
    throw new Error(
      "useWallpaperSection must be used within a <WallpaperSection />",
    )
  }

  return context
}

const WallpaperSection = forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(({ children }, ref) => {
  const {
    direction,
    setDirection,
    sectionIndex,
    setSectionIndex,
    sectionCount,
    isEnableWheel,
    setIsEnableWheel,
  } = useWallpaper()
  const [currentSectionIndex, setCurrentSectionIndex] = useState(sectionIndex)
  const [maxCardIndex, setMaxCardIndex] = useState<number>(Infinity)
  const [cardIndex, setCardIndex] = useState(direction === "up" ? Infinity : 0)
  const [cardToggleChange, setCardToggleChange] = useState<boolean>()
  const [sectionToggleChange, setSectionToggleChange] = useState<boolean>()
  const scrollDelay = 300

  const nextCard = () => {
    if (cardIndex < maxCardIndex) {
      setDirection("down")
      setCardToggleChange((value) => !value)
    }
  }

  const prevCard = () => {
    if (cardIndex > 0) {
      setDirection("up")
      setCardToggleChange((value) => !value)
    }
  }

  const nextSection = () => {
    if (sectionIndex < sectionCount - 1) {
      setDirection("down")
      setSectionToggleChange((value) => !value)
    }
  }

  const prevSection = () => {
    if (sectionIndex > 0) {
      setDirection("up")
      setSectionToggleChange((value) => !value)
    }
  }

  const scrollAction = (isNext: boolean, isPrev: boolean) => {
    if (isNext && cardIndex < maxCardIndex) {
      nextCard()
    }
    if (isNext && cardIndex >= maxCardIndex) {
      nextSection()
    }
    if (isPrev && cardIndex <= 0) {
      prevSection()
    }
    if (isPrev && cardIndex > 0) {
      prevCard()
    }
  }

  const onWheel = (e: WheelEvent) => {
    setIsEnableWheel(false)

    const isNext = e.deltaY > 0 || e.deltaX > 0
    const isPrev = e.deltaY < 0 || e.deltaX < 0
    scrollAction(isNext, isPrev)

    setTimeout(() => {
      setIsEnableWheel(true)
    }, scrollDelay)
  }

  const onTouch = (() => {
    let startY = 0
    let startX = 0
    const touchActionMargin = 30
    return {
      start: (e: TouchEvent) => {
        startY = e.touches[0].clientY
        startX = e.touches[0].clientX
      },
      move: (e: TouchEvent) => {
        const touchY = e.touches[0].clientY
        const isNext = startY - touchY > 0
        const isPrev = startY - touchY < 0

        if (
          sectionIndex !== 0 &&
          ((isNext && cardIndex < maxCardIndex) || isPrev)
        ) {
          e.preventDefault()
        }
      },
      end: (e: TouchEvent) => {
        const deltaY = startY - e.changedTouches[0].clientY
        const deltaX = startX - e.changedTouches[0].clientX
        const isNext =
          (deltaY > touchActionMargin && deltaY > Math.abs(deltaX)) ||
          (deltaX > touchActionMargin && deltaX > Math.abs(deltaY))
        const isPrev =
          (deltaY < -touchActionMargin && deltaY < -Math.abs(deltaX)) ||
          (deltaX < -touchActionMargin && deltaX < -Math.abs(deltaY))
        if (isNext && isPrev) {
          const direction =
            Math.abs(deltaY) >= Math.abs(deltaX) ? deltaY > 0 : deltaX > 0
          scrollAction(direction, !direction)
          return
        }
        scrollAction(isNext, isPrev)
      },
    }
  })()

  useEffect(() => {
    setCurrentSectionIndex(sectionIndex)
  }, [])

  useEffect(() => {
    if (cardToggleChange === undefined) {
      return
    }
    if (direction === "down") {
      setCardIndex((index) => Math.min(index + 1, maxCardIndex))
      return
    }
    setCardIndex((index) => Math.max(index - 1, 0))
  }, [cardToggleChange])

  useEffect(() => {
    if (sectionToggleChange === undefined) {
      return
    }
    if (direction === "down") {
      setSectionIndex(
        Math.min(currentSectionIndex + 1, Math.max(sectionCount - 1, 0)),
      )
      return
    }
    setSectionIndex(Math.max(currentSectionIndex - 1, 0))
  }, [sectionToggleChange])

  useEffect(() => {
    window.addEventListener("touchstart", onTouch.start)
    window.addEventListener("touchend", onTouch.end)
    window.addEventListener("touchmove", onTouch.move, { passive: false })

    return () => {
      window.removeEventListener("touchstart", onTouch.start)
      window.removeEventListener("touchend", onTouch.end)
      window.removeEventListener("touchmove", onTouch.move)
    }
  }, [cardIndex, maxCardIndex])

  useEffect(() => {
    if (isEnableWheel) {
      window.addEventListener("wheel", onWheel)
    }

    return () => {
      window.removeEventListener("wheel", onWheel)
    }
  }, [isEnableWheel])

  useEffect(() => {
    if (cardIndex > maxCardIndex) {
      setCardIndex(maxCardIndex)
    }
  }, [maxCardIndex])

  return (
    <WallpaperSectionContext.Provider
      key={String(ref)}
      value={{ setMaxCardIndex, cardIndex }}
    >
      {children}
    </WallpaperSectionContext.Provider>
  )
})
WallpaperSection.displayName = "WallpaperSection"

export { useWallpaper, Wallpaper, useWallpaperSection, WallpaperSection }
