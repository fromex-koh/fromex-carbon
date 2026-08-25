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
import { menuList, navBarHeight } from "@/lib/const"
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
  const isLoggedIn = !!session?.user?.accessToken
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const mode = searchParams.get("mode") ?? ""

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
          <div className={"flex items-center justify-between gap-5 lg:gap-20"}>
            <Link href={isTaxonomy() ? "/k-taxonomy/guide" : "/home"}>
              {isTaxonomy() ? (
                <LogoTaxonomy isDark={isDark} />
              ) : (
                <LogoKibo isDark={isDark} />
              )}
            </Link>
            <div
              className={cn("flex max-[910px]:hidden", isDark && "text-white!")}
            >
              <NavigationMenu>
                <NavigationMenuList className={"gap-0 lg:gap-5"}>
                  {menuList.map((menu, index) => (
                    <NavigationMenuItem key={menu.title + "onTop"}>
                      <NavigationMenuTrigger
                        className={cn("cursor-pointer px-2 text-base")}
                      >
                        {menu.title}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <div
                          className={cn(
                            "flex flex-col gap-1 p-2 whitespace-nowrap",
                            isDark && "text-black dark:text-white",
                          )}
                        >
                          {menu.contents
                            .filter(
                              (_, i) =>
                                index !== 1 ||
                                (i !== 2 && (i !== 3 || isLoggedIn)),
                            )
                            .map((content) => (
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
                                    pathname.includes(
                                      menu.link + content.link,
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
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>
          <div className={"flex items-center gap-2"}>
            <ModeToggle
              variant={"roundedGhost"}
              className={cn("max-[910px]:hidden", isDark && "text-white")}
            />
            {status === "loading" && (
              <Skeleton className="h-10 w-[100px] bg-muted/20 max-[910px]:hidden" />
            )}
            <div className={"h-3 w-[1px] border max-[910px]:hidden"}></div>
            {isLoggedIn && (
              <div className={"flex items-center gap-2"}>
                <Link
                  href={`/status-inquiry${isTaxonomy() ? "?mode=k-taxonomy" : ""}`}
                >
                  <Button
                    className={cn(
                      "max-[910px]:hidden",
                      isDark && "text-white",
                      "font-bold",
                    )}
                    variant={"underLine"}
                  >
                    현황조회
                  </Button>
                </Link>
                <div className={"h-3 w-[1] border max-[910px]:hidden"}></div>
                <Button
                  className={cn(
                    "ml-3 max-w-[119px] border-none px-10 max-[910px]:hidden dark:bg-white dark:text-black dark:hover:bg-white/90",
                    isDark && "bg-white text-black",
                  )}
                  variant={"login"}
                  onClick={() => {/* logout(isTaxonomy()) */}}
                >
                  로그아웃
                </Button>
              </div>
            )}
            {!isLoggedIn && status !== "loading" && (
              <div className={"flex items-center gap-2"}>
                <Button
                  className={cn(
                    "max-[910px]:hidden",
                    isDark && "text-white",
                    "font-bold",
                  )}
                  variant={"underLine"}
                  onClick={signup}
                >
                  회원가입
                </Button>
                <div className={"h-3 w-[1] border max-[910px]:hidden"}></div>
                <Button
                  className={cn(
                    "ml-3 max-w-[119px] border-none px-10 max-[910px]:hidden dark:bg-white dark:text-black dark:hover:bg-white/90",
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
                  "hidden max-[910px]:inline-flex [&_svg]:size-6",
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
          "fixed top-0 right-0 z-2 hidden h-lvh w-full transform bg-background shadow-md transition-transform max-[910px]:block",
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
              <Link
                href={`/status-inquiry${isTaxonomy() ? "?mode=k-taxonomy" : ""}`}
              >
                <Button variant={"ghost"} onClick={() => setIsOpen(false)}>
                  현황조회
                </Button>
              </Link>
              <Button variant={"ghost"} onClick={() => {/* logout(isTaxonomy()) */}}>
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
            {menuList.map((menu, index) => (
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
              menuList[activeMenuIndex].contents
                .filter(
                  (_, i) =>
                    activeMenuIndex !== 1 ||
                    (i !== 2 && (i !== 3 || isLoggedIn)),
                )
                .map((content) => (
                  <div key={content.subTitle + "onSide"}>
                    <Link
                      href={menuList[activeMenuIndex].link + content.link}
                      onClick={() => setIsOpen(false)}
                      target={
                        (
                          menuList[activeMenuIndex].link + content.link
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
                            menuList[activeMenuIndex].link + content.link,
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
          className="bg-opacity-50 fixed inset-0 z-1 hidden bg-black max-[910px]:block"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}

export default NavBar
