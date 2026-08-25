import LogoKibo from "@/components/ui/logo-kibo"
import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import React from "react"
import { cn } from "@/lib/utils"
import LogoFacebook from "@/components/ui/logo-facebook"
import LogoTwitter from "@/components/ui/logo-twitter"
import LogoInstagram from "@/components/ui/logo-instagram"
import LogoYoutube from "@/components/ui/logo-youtube"
import LogoNaverBlog from "@/components/ui/logo-naver-blog"

const FooterBar = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "flex h-full min-h-[397px] w-full flex-col items-center bg-footer px-4",
        className,
      )}
    >
      <div className={"container max-w-[1276px]"}>
        <div className={"mt-[50px] mb-[40px] w-full"}>
          <LogoKibo className={"mr-auto"} />
        </div>
        <div
          className={
            "flex w-full max-w-[1276px] justify-between max-md:flex-col"
          }
        >
          <div className={"flex flex-col gap-1"}>
            <div>부산광역시 남구 문현금융로 33</div>
            <div className={"flex"}>
              <div className={"font-bold"}>대표전화 1544-1120</div>
              <div>(평일 09시~18시)</div>
            </div>
            <div>
              <Button
                variant={"underLine"}
                className={
                  "flex items-start px-0 py-0 text-base font-bold [&_svg]:size-5"
                }
              >
                <a
                  href="https://www.kibo.or.kr/map/search"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={"decoration-2 hover:underline"}
                >
                  찾아오시는길
                </a>
                <ChevronRight className={"items-start pt-1"} />
              </Button>
            </div>
          </div>
          <div className={"mr-2 mb-5 flex flex-col gap-3 md:gap-2"}>
            <div className={"flex items-center max-md:mt-4 lg:gap-3"}>
              <a
                href="https://www.facebook.com/KIBObb"
                rel="noopener noreferrer"
                target="_blank"
              >
                <Button variant={"sns"} size={"icon"}>
                  <LogoFacebook></LogoFacebook>
                </Button>
              </a>
              <a
                href="https://twitter.com/TechKibo"
                rel="noopener noreferrer"
                target="_blank"
              >
                <Button variant={"sns"} size={"icon"}>
                  <LogoTwitter></LogoTwitter>
                </Button>
              </a>
              <a
                href="https://www.instagram.com/techkibo/?hl=ko"
                rel="noopener noreferrer"
                target="_blank"
              >
                <Button variant={"sns"} size={"icon"}>
                  <LogoInstagram></LogoInstagram>
                </Button>
              </a>
              <a
                href="https://www.youtube.com/channel/UCMF6s380uQOSNRcs231MJ5g"
                rel="noopener noreferrer"
                target="_blank"
              >
                <Button variant={"sns"} size={"icon"}>
                  <LogoYoutube></LogoYoutube>
                </Button>
              </a>
              <a
                href="https://blog.naver.com/techkibo"
                rel="noopener noreferrer"
                target="_blank"
              >
                <Button variant={"sns"} size={"icon"}>
                  <LogoNaverBlog></LogoNaverBlog>
                </Button>
              </a>
            </div>
          </div>
        </div>
        <div
          className={
            "mt:5 mb-7 flex w-full justify-between gap-1 max-md:flex-col md:mt-25 md:mr-4"
          }
        >
          <div
            className={
              "flex items-center pb-0 text-xs max-md:gap-0 max-md:p-0 md:text-sm"
            }
          >
            ⓒ The Government of the Republic of Korea. All rights reserved.
          </div>
          <div className={"flex gap-0 max-md:flex-col max-md:p-0"}>
            <div className={"max-md:p-0"}>
              <Button variant="underLine" className="px-3 text-sm">
                <a
                  href={`${process.env.NEXT_PUBLIC_URL}/main/center/center0801-01.do`}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  이용안내
                </a>
              </Button>
            </div>
            <div>
              <Button
                variant="underLine"
                className="px-3 text-sm font-bold text-accent-foreground"
              >
                <a
                  href={`${process.env.NEXT_PUBLIC_URL}/cms/menu/redirectToPrimaryMenuPage.do?menuCd=48927`}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  개인정보처리방침
                </a>
              </Button>
            </div>
            <div>
              <Button variant="underLine" className="px-3 text-sm">
                <a
                  href={`${process.env.NEXT_PUBLIC_URL}/main/center/center0806.do`}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  저작권정책
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FooterBar
