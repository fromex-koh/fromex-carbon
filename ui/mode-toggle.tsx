"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button, ButtonProps } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useMediaQuery } from "usehooks-ts"

const ModeToggle = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "outline", size, ...props }, ref) => {
    const { theme, setTheme, systemTheme } = useTheme()
    const [mounted, setMounted] = useState(false)
    const isMobile = useMediaQuery("(max-width: 767px)")

    useEffect(() => {
      setMounted(true)
    }, [])

    const currentTheme = theme === "system" ? systemTheme : theme

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              aria-label={"테마 변경 버튼"}
              onClick={() =>
                setTheme(currentTheme === "dark" ? "light" : "dark")
              }
              size={size || (isMobile ? "default" : "icon")}
              ref={ref}
              variant={variant}
              className={className}
              {...props}
            >
              {mounted &&
                (isMobile ? (
                  "테마변경"
                ) : currentTheme === "dark" ? (
                  <Sun className="h-6 w-6" />
                ) : (
                  <Moon className="h-6 w-6" />
                ))}
            </Button>
          </TooltipTrigger>
          <TooltipContent variant={"shadow"}>
            <p>{currentTheme === "dark" ? "라이트" : "다크"}모드로 테마 변경</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  },
)
ModeToggle.displayName = "ModeToggle"

export { ModeToggle }
