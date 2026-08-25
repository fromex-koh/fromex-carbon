"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { menuList } from "@/lib/const"
import Image from "next/image"
import backgroundLight from "@/public/main-go-self-check.svg"
import cloudLight from "@/public/main-go-self-check-cloud.svg"
import backgroundDark from "@/public/main-go-self-check-dark.svg"
import cloudDark from "@/public/main-go-self-check-cloud-dark.svg"

const GoSelfCheck = () => {
  return (
    <div className="flex min-h-lvh w-full flex-col justify-center">
      <div className="flex w-full flex-col items-center justify-center px-4">
        <div className="relative flex w-full max-w-[1276px] flex-col items-center justify-center gap-8 overflow-hidden rounded-3xl px-2 py-40 max-sm:pt-30 max-sm:pb-50 md:min-h-[628px]">
          <Image
            src={backgroundLight}
            alt="Background"
            fill
            className="object-cover object-[90%_0%] lg:object-right dark:hidden"
            priority
          />
          <Image
            src={cloudLight}
            alt="cloud"
            fill
            className="object-cover object-left dark:hidden"
            priority
          />
          <Image
            src={backgroundDark}
            alt="Background"
            fill
            className="hidden object-cover object-[90%_0%] lg:object-right dark:block"
            priority
          />
          <Image
            src={cloudDark}
            alt="cloud"
            fill
            className="hidden object-cover object-left dark:block"
            priority
          />
          <div className="relative text-center text-2xl leading-relaxed font-bold break-keep min-[360px]:whitespace-pre-line sm:text-4xl">
            {"탄소중립을 위한 모든 여정,\n하나의 플랫폼에서."}
          </div>
          <div className="relative flex gap-3 max-md:flex-col">
            <Link href={menuList[0].link + menuList[0].contents[1].link}>
              <Button
                size={"xl"}
                variant={"forest"}
                className="transition-colors duration-1000"
              >
                탄소감축 자가진단하기
              </Button>
            </Link>
            <Link href={menuList[1].link + menuList[1].contents[1].link}>
              <Button size={"xl"} className="transition-colors duration-1000">
                택소노미 자가진단하기
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
export default GoSelfCheck
