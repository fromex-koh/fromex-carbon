import React from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import LightInstagramImage from "@/public/sns-instagram.svg"
import DarkInstagramImage from "@/public/sns-instagram-dark.svg"
interface LogoInstagramProps {
  className?: string
  isDark?: boolean
}

const LogoInstagram = ({ className, isDark }: LogoInstagramProps) => {
  return (
    <>
      <Image
        priority
        src={LightInstagramImage}
        alt={"Light instagram Logo"}
        className={cn(isDark ? "hidden" : "block dark:hidden", className)}
      />
      <Image
        priority
        src={DarkInstagramImage}
        alt={"Dark instagram Logo"}
        className={cn(!isDark && "hidden dark:block", className)}
      />
    </>
  )
}

export default LogoInstagram
