import React from "react"
import Image from "next/image"
import LightKiboImage from "@/public/logo-kibo-short.svg"
import DarkKiboImage from "@/public/logo-kibo-white-short.svg"
import LightKeitiImage from "@/public/logo-keiti.png"
import DarkKeitiImage from "@/public/logo-keiti-white.png"
import { cn } from "@/lib/utils"

interface LogoKiboProps {
  className?: string
  isDark?: boolean
}

const LogoTaxonomy = ({ className, isDark }: LogoKiboProps) => {
  return (
    <>
      <div
        className={cn(
          "w-screen max-w-[240px] items-center justify-between",
          isDark ? "hidden" : "flex dark:hidden",
        )}
      >
        <Image
          priority
          src={LightKiboImage}
          alt="Light Kibo Logo"
          className={cn(isDark ? "hidden" : "block dark:hidden", className)}
        />
        <div
          className={cn(
            "relative mt-[-8px] h-[30px] w-[100px] overflow-hidden",
            isDark ? "hidden" : "block dark:hidden",
          )}
        >
          <Image
            width={270}
            height={30}
            src={LightKeitiImage}
            alt="Light Keiti Logo"
            className={cn(
              "absolute top-1/2 left-0 max-w-none -translate-y-1/2",
              className,
            )}
          />
        </div>
      </div>
      <div
        className={cn(
          "w-screen max-w-[240px] items-center justify-between",
          !isDark && "hidden dark:flex",
        )}
      >
        <Image
          priority
          src={DarkKiboImage}
          alt="Dark Kibo Logo"
          className={cn(!isDark && "hidden dark:block", className)}
        />
        <div
          className={cn(
            "relative mt-[-8px] h-[30px] w-[100px] overflow-hidden",
            !isDark && "hidden dark:block",
          )}
        >
          <Image
            width={270}
            height={30}
            src={DarkKeitiImage}
            alt="Dark Keiti Logo"
            className={cn(
              "absolute top-1/2 left-0 max-w-none -translate-y-1/2",
              className,
            )}
          />
        </div>
      </div>
    </>
  )
}

export default LogoTaxonomy
