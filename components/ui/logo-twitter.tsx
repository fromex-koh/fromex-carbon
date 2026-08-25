import React from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import LightTwitterImage from "@/public/sns-x.svg"
import DarkTwitterImage from "@/public/sns-x-dark.svg"
interface LogoTwitterProps {
  className?: string
  isDark?: boolean
}

const LogoTwitter = ({ className, isDark }: LogoTwitterProps) => {
  return (
    <>
      <Image
        priority
        src={LightTwitterImage}
        alt={"Light twitter Logo"}
        className={cn(isDark ? "hidden" : "block dark:hidden", className)}
      />
      <Image
        priority
        src={DarkTwitterImage}
        alt={"Dark twitter Logo"}
        className={cn(!isDark && "hidden dark:block", className)}
      />
    </>
  )
}

export default LogoTwitter
