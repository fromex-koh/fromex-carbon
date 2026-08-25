import React from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import LightNaverBlogImage from "@/public/sns-naver-blog.svg"
import DarkNaverBlogImage from "@/public/sns-naver-blog-dark.svg"
interface LogoNaverBlogProps {
  className?: string
  isDark?: boolean
}

const LogoNaverBlog = ({ className, isDark }: LogoNaverBlogProps) => {
  return (
    <>
      <Image
        priority
        src={LightNaverBlogImage}
        alt={"Light naver-blog Logo"}
        className={cn(isDark ? "hidden" : "block dark:hidden", className)}
      />
      <Image
        priority
        src={DarkNaverBlogImage}
        alt={"Dark naver-blog Logo"}
        className={cn(!isDark && "hidden dark:block", className)}
      />
    </>
  )
}

export default LogoNaverBlog
