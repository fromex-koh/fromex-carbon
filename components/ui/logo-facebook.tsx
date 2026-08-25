import React from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import LightFacebookImage from "@/public/sns-facebook.svg"
import DarkFacebookImage from "@/public/sns-facebook-dark.svg"
interface LogoFacebookProps {
  className?: string
  isDark?: boolean
}

const LogoFacebook = ({ className, isDark }: LogoFacebookProps) => {
  return (
    <>
      <Image
        priority
        src={LightFacebookImage}
        alt={"Light Facebook Logo"}
        className={cn(isDark ? "hidden" : "block dark:hidden", className)}
      />
      <Image
        priority
        src={DarkFacebookImage}
        alt={"Dark Facebook Logo"}
        className={cn(!isDark && "hidden dark:block", className)}
      />
    </>
  )
}

export default LogoFacebook
