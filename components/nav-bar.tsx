// @ts-nocheck -- 원본에서 넘어오지 않은 모듈(@/hooks/remote-store 등) 때문에
// 발생하는 타입 에러를 억제한다. 퍼블리싱 단계 임시 조치이며,
// 빠진 모듈이 들어오면 이 주석 3줄만 지우면 된다.
"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import LogoKibo from "@/components/ui/logo-kibo"
import { cn } from "@/lib/utils"
import { LogIn, LogOut, Menu, X } from "lucide-react"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/ui/mode-toggle"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { menuList, myPageMenu, navBarHeight } from "@/lib/const"
// import { logout } from "@/actions/logout"
import { Skeleton } from "@/components/ui/skeleton"
import { useSession } from "@/components/auth-provider"
import LogoTaxonomy from "@/components/ui/logo-taxonomy"

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [innerHeight, setInnerHeight] = useState(0)
  const [activeMenuIndex, setActiveMenuIndex] = useState<number>(-1)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  const session = useSession()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const mode = searchParams.get("mode") ?? ""

  // [퍼블리싱 노출용] ?login=true 는 원래 소스에 없던 분기다.
  // 로그인 로직을 타지 않고 로그인 상태 헤더를 보여주려고 넣었다.
  // 실제 세션이 붙으면 searchParams 조건만 지우면 원본 동작으로 돌아간다.
  const isLoggedIn =
    searchParams.get("login") === "true" || !!session?.user?.accessToken

  // 모바일·태블릿 패널은 hover 가 없어 마이페이지도 다른 메뉴처럼 탭 목록에 넣는다.
  // 목록 끝에 붙이므로 activeMenuIndex 가 가리키는 기존 인덱스는 그대로다.
  const sideMenuList = isLoggedIn ? [...menuList, myPageMenu] : menuList

  const activeCurrentMenu = () => {
    setActiveMenuIndex(
      menuList?.findIndex((menu) => menu.link && pathname.includes(menu.link)),
    )
  }

  const signup = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_URL}/dbranch/mbrSctChoose.do`
  }

  const login = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_URL}/member/newLoginView.do?auty=LOGIN&referer=/carbon${isTaxonomy() ? "/k-taxonomy/guide" : "/home"}`
  }

  const isTaxonomy = () => {
    return pathname.includes("k-taxonomy") || mode.includes("k-taxonomy")
  }

  useEffect(() => {
    setIsDark(
      Array.from(document.querySelectorAll(".dark-section")).some(
        (el) => el.getBoundingClientRect().top < navBarHeight,
      ),
    )
  }, [pathname])

  /**
   * 검은 배경 컴포넌트가 감지될 때마다 navBar의 색상을 변경하기 위한 로직
   * */
  useEffect(() => {
    const marginBottom = navBarHeight / 2 - innerHeight
    const observer = new IntersectionObserver(
      (entries) => {
        const darkVisible = Array.from(entries).some(
          (entry) => entry.isIntersecting,
        )
        setIsDark(darkVisible)
        setIsMounted(true)
      },
      {
        root: null,
        threshold: 0,
        rootMargin: `-${navBarHeight / 2}px 0px ${marginBottom}px 0px`,
      },
    )

    const targets = document.querySelectorAll(".dark-section")

    if (targets?.length > 0) {
      targets.forEach((target) => {
        observer.observe(target)
      })
    } else {
      setIsMounted(true)
    }

    return () => observer.disconnect()
  }, [innerHeight])

  useEffect(() => {
    const handler = (e: Event) => {
      const { isDark } = (e as CustomEvent).detail
      setIsDark(isDark)
    }
    window.addEventListener("sectionColorChange", handler)
    return () => window.removeEventListener("sectionColorChange", handler)
  }, [])

  useEffect(() => {
    const observer = new ResizeObserver(() => {
      setInnerHeight(window.innerHeight)
    })

    observer.observe(document.body)

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    activeCurrentMenu()
    document.body.style.overflow = isOpen ? "hidden" : ""
  }, [isOpen])

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight

      if (currentScrollY < 100) {
        setIsVisible(true)
      } else if (currentScrollY >= maxScroll - 5) {
        setIsVisible(true)
      } else if (currentScrollY > lastScrollY) {
        setIsVisible(false)
      } else {
        setIsVisible(true)
      }
      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  return !isMounted ? (
    <header
      className={`sticky top-0 left-0 z-1 flex w-full items-center justify-center px-4 pb-px`}
      style={{ height: `${navBarHeight}px` }}
    />
  ) : (
    <>
      <header
        className={cn(
          `sticky top-0 left-0 z-1 flex w-full items-center justify-center bg-background px-4 transition-all duration-300 ease-in-out`,
          isVisible
            ? "translate-y-0 opacity-100"
            : "invisible -translate-y-8 opacity-0",
          isDark && "bg-black",
        )}
        style={{ height: `${navBarHeight}px` }}
      >
        <div
          className={"flex w-full max-w-[1276px] items-center justify-between"}
        >
          <div className={"flex items-center justify-between gap-5 xl:gap-10"}>
            <Link
              href={isTaxonomy() ? "/k-taxonomy/guide" : "/home"}
              className="shrink-0"
            >
              {isTaxonomy() ? (
                <LogoTaxonomy isDark={isDark} />
              ) : (
                <LogoKibo isDark={isDark} />
              )}
            </Link>
            <div
              className={cn(
                "flex max-[1080px]:hidden",
                isDark && "text-white!",
              )}
            >
              <NavigationMenu>
                <NavigationMenuList className={"gap-0 xl:gap-4"}>
                  {menuList.map((menu) => (
                    <NavigationMenuItem key={menu.title + "onTop"}>
                      <NavigationMenuTrigger
                        className={cn("cursor-pointer px-2 text-base")}
                      >
                        {menu.title}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent
                        className={"right-auto left-1/2 -translate-x-1/2"}
                      >
                        <div
                          className={cn(
                            "flex flex-col gap-1 p-2 whitespace-nowrap",
                            isDark && "text-black dark:text-white",
                          )}
                        >
                          {menu.contents.map((content) => (
                            <Link
                              key={content.subTitle + "onTop"}
                              href={menu.link + content.link}
                              onClick={() => setIsOpen(false)}
                              target={
                                (menu.link + content.link).startsWith("/")
                                  ? undefined
                                  : "_blank"
                              }
                            >
                              <Button
                                variant="underLine"
                                className={cn(
                                  pathname.includes(menu.link + content.link) &&
                                    "underline underline-offset-4",
                                  "w-full items-center justify-start",
                                )}
                              >
                                {content.subTitle}
                              </Button>
                            </Link>
                          ))}
                        </div>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>
          <div className={"flex items-center gap-2"}>
            <ModeToggle
              variant={"roundedGhost"}
              className={cn("max-[1080px]:hidden", isDark && "text-white")}
            />
            {status === "loading" && (
              <Skeleton className="h-10 w-[100px] bg-muted/20 max-[1080px]:hidden" />
            )}
            <div className={"h-3 w-[1px] border max-[1080px]:hidden"}></div>
            {isLoggedIn && (
              <div className={"flex items-center gap-2"}>
                {/* 비로그인 상태의 '회원가입' 과 같은 자리다.
                    원래 소스에서 '현황조회' 가 있던 위치이기도 하다.
                    GNB 메뉴와 같은 마크업이라 hover 시 같은 드롭다운이 열린다. */}
                <NavigationMenu
                  className={cn("max-[1080px]:hidden", isDark && "text-white!")}
                >
                  <NavigationMenuList>
                    <NavigationMenuItem>
                      <NavigationMenuTrigger
                        className={cn(
                          // 글자 크기는 같은 자리의 회원가입 버튼과 맞춘다(text-sm)
                          "cursor-pointer bg-transparent px-2 text-sm font-bold",
                          isDark && "text-white",
                        )}
                      >
                        마이페이지
                      </NavigationMenuTrigger>
                      {/* 다른 GNB 메뉴와 같은 규칙으로 트리거 가운데에 맞춘다 */}
                      <NavigationMenuContent
                        className={"right-auto left-1/2 -translate-x-1/2"}
                      >
                        <div
                          className={cn(
                            "flex flex-col gap-1 p-2 whitespace-nowrap",
                            isDark && "text-black dark:text-white",
                          )}
                        >
                          {myPageMenu.contents.map((content) => (
                            <Link
                              key={content.subTitle + "myPage"}
                              href={myPageMenu.link + content.link}
                              onClick={() => setIsOpen(false)}
                            >
                              <Button
                                variant="underLine"
                                className={cn(
                                  pathname.includes(
                                    myPageMenu.link + content.link,
                                  ) && "underline underline-offset-4",
                                  "w-full items-center justify-start",
                                )}
                              >
                                {content.subTitle}
                              </Button>
                            </Link>
                          ))}
                        </div>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  </NavigationMenuList>
                </NavigationMenu>
                <div className={"h-3 w-[1] border max-[1080px]:hidden"}></div>
                <Button
                  className={cn(
                    "ml-3 max-w-[119px] border-none px-10 max-[1080px]:hidden dark:bg-white dark:text-black dark:hover:bg-white/90",
                    isDark && "bg-white text-black",
                  )}
                  variant={"login"}
                  onClick={() => {
                    /* logout(isTaxonomy()) */
                  }}
                >
                  로그아웃
                </Button>
              </div>
            )}
            {!isLoggedIn && status !== "loading" && (
              <div className={"flex items-center gap-2"}>
                <Button
                  className={cn(
                    "max-[1080px]:hidden",
                    isDark && "text-white",
                    "font-bold",
                  )}
                  variant={"underLine"}
                  onClick={signup}
                >
                  회원가입
                </Button>
                <div className={"h-3 w-[1] border max-[1080px]:hidden"}></div>
                <Button
                  className={cn(
                    "ml-3 max-w-[119px] border-none px-10 max-[1080px]:hidden dark:bg-white dark:text-black dark:hover:bg-white/90",
                    isDark && "bg-white text-black",
                  )}
                  variant={"login"}
                  onClick={login}
                >
                  로그인
                </Button>
              </div>
            )}
            {!isOpen && (
              <Button
                aria-label={"메뉴 펼치기"}
                className={cn(
                  "hidden max-[1080px]:inline-flex [&_svg]:size-6",
                  isDark && "text-white",
                )}
                variant={"ghost"}
                size={"icon"}
                onClick={() => setIsOpen(!isOpen)}
              >
                <Menu />
              </Button>
            )}
          </div>
        </div>
      </header>

      <div
        className={cn(
          "fixed top-0 right-0 z-2 hidden h-lvh w-full transform bg-background shadow-md transition-transform max-[1080px]:block",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex items-center justify-end gap-2 border-b p-4">
          <ModeToggle variant={"ghost"} />
          {!isLoggedIn && (
            <div className="flex gap-x-2">
              <Button variant={"ghost"} onClick={signup}>
                회원가입
              </Button>
              <Button variant={"ghost"} onClick={login}>
                <LogIn />
                로그인
              </Button>
            </div>
          )}
          {isLoggedIn && (
            <div className="flex gap-x-2">
              <Button
                variant={"ghost"}
                onClick={() => {
                  /* logout(isTaxonomy()) */
                }}
              >
                <LogOut />
                로그아웃
              </Button>
            </div>
          )}
          <Button
            aria-label={"메뉴 닫기"}
            variant={"ghost"}
            size={"icon"}
            className={"[&_svg]:size-6"}
            onClick={() => setIsOpen(false)}
          >
            <X />
          </Button>
        </div>

        <div className="flex">
          <div className={"flex h-lvh flex-col gap-2 bg-active p-4"}>
            {sideMenuList.map((menu, index) => (
              <Button
                className={cn(
                  "py-6 text-lg font-bold",
                  index === activeMenuIndex && "bg-accent",
                )}
                key={menu.title + "onSide"}
                variant={"ghost"}
                onClick={() => {
                  setActiveMenuIndex(index)
                }}
              >
                {menu.title}
              </Button>
            ))}
          </div>
          <div className={"flex h-lvh w-full flex-col gap-1 p-4"}>
            {activeMenuIndex !== -1 &&
              sideMenuList[activeMenuIndex].contents.map((content) => (
                <div key={content.subTitle + "onSide"}>
                  <Link
                    href={sideMenuList[activeMenuIndex].link + content.link}
                    onClick={() => setIsOpen(false)}
                    target={
                      (
                        sideMenuList[activeMenuIndex].link + content.link
                      ).startsWith("/")
                        ? undefined
                        : "_blank"
                    }
                  >
                    <Button
                      variant={"ghost"}
                      className={cn(
                        "w-full justify-start py-6 text-base font-medium",
                        pathname.includes(
                          sideMenuList[activeMenuIndex].link + content.link,
                        ) && "text-primary hover:text-primary",
                      )}
                    >
                      {content.subTitle}
                    </Button>
                  </Link>
                </div>
              ))}
          </div>
        </div>
      </div>

      {isOpen && (
        <div
          className="bg-opacity-50 fixed inset-0 z-1 hidden bg-black max-[1080px]:block"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}

export default NavBar
