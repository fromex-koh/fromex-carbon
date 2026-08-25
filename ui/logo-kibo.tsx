import React from "react"
import Image from "next/image"
import LightImage from "@/public/logo-kibo.svg"
import DarkImage from "@/public/logo-kibo-white.svg"
import { cn } from "@/lib/utils"

interface LogoKiboProps {
  className?: string
  isDark?: boolean
}

const LogoKibo = ({ className, isDark }: LogoKiboProps) => {
  return (
    <>
      <Image
        priority
        src={LightImage}
        alt="Light Kibo Logo"
        className={cn(isDark ? "hidden" : "block dark:hidden", className)}
      />
      <Image
        priority
        src={DarkImage}
        alt="Dark Kibo Logo"
        className={cn(!isDark && "hidden dark:block", className)}
      />
    </>
  )
}

export default LogoKibo
