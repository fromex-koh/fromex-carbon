import React from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import LightYoutubeImage from "@/public/sns-youtube.svg"
import DarkYoutubeImage from "@/public/sns-youtube-dark.svg"
interface LogoYoutubeProps {
  className?: string
  isDark?: boolean
}

const LogoYoutube = ({ className, isDark }: LogoYoutubeProps) => {
  return (
    <>
      <Image
        priority
        src={LightYoutubeImage}
        alt={"Light youtube Logo"}
        className={cn(isDark ? "hidden" : "block dark:hidden", className)}
      />
      <Image
        priority
        src={DarkYoutubeImage}
        alt={"Dark youtube Logo"}
        className={cn(!isDark && "hidden dark:block", className)}
      />
    </>
  )
}

export default LogoYoutube
