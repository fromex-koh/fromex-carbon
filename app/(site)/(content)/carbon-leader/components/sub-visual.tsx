import { Fragment } from "react"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import illustLight from "@/public/carbon-leader-illust.svg"
import illustDark from "@/public/carbon-leader-illust-dark.svg"
import illustSmallLight from "@/public/carbon-leader-illust-small.svg"
import illustSmallDark from "@/public/carbon-leader-illust-small-dark.svg"

// 탄소중립 선도기업(carbon-leader) 도메인 전체가 쓰는 서브 비주얼.
// 화면마다 문구만 다르므로 브레드크럼 경로를 배열로 받는다.
// 각 섹션의 layout.tsx 에서 한 번 렌더하고, page.tsx 는 본문만 그린다.

interface SubVisualProps {
  /** 브레드크럼 경로. 마지막 항목이 현재 위치이며 굵게 나온다 */
  trail: string[]
  /** 배너 제목. 생략하면 trail 의 마지막 항목을 쓴다 */
  title?: string
}

const SubVisual = ({ trail, title }: SubVisualProps) => {
  const current = trail[trail.length - 1]

  // 높이는 시안 3종 기준 — 모바일 180 · 태블릿 260 · PC 240
  return (
    <section className="relative flex h-[180px] w-full items-center px-4 md:h-[260px] lg:h-[240px]">
      {/* 일러스트는 배경 장식이라 next/image 대신 CSS 배경으로 깐다.
          네 장 중 조건에 맞는 한 장만 실제로 내려받고, preload·LCP 경고도 생기지 않는다. */}
      <div
        aria-hidden="true"
        style={{ backgroundImage: `url(${illustLight.src})` }}
        className="absolute inset-0 bg-cover bg-[100%_100%] max-md:hidden md:bg-[70%_0%] dark:hidden"
      />
      <div
        aria-hidden="true"
        style={{ backgroundImage: `url(${illustDark.src})` }}
        className="absolute inset-0 hidden bg-cover bg-[100%_100%] md:bg-[70%_0%] dark:md:block"
      />
      <div
        aria-hidden="true"
        style={{ backgroundImage: `url(${illustSmallLight.src})` }}
        className="absolute inset-0 bg-cover bg-[100%_100%] md:hidden dark:hidden"
      />
      <div
        aria-hidden="true"
        style={{ backgroundImage: `url(${illustSmallDark.src})` }}
        className="absolute inset-0 hidden bg-cover bg-[100%_100%] dark:max-md:block"
      />
      <div className="relative container mx-auto flex h-full max-w-[1276px] flex-col items-start justify-center gap-1 md:gap-5">
        <h1 className="text-2xl font-bold break-keep md:text-4xl lg:text-5xl">
          {title ?? current}
        </h1>
        <Breadcrumb>
          <BreadcrumbList className="text-ink-strong gap-2 text-base sm:gap-2">
            {trail.map((name, index) =>
              index === trail.length - 1 ? (
                <BreadcrumbItem key={name}>
                  {/* BreadcrumbPage 원본의 font-bold·font-normal 충돌을 덮어쓴다. */}
                  <BreadcrumbPage className="text-ink-strong font-bold">
                    {name}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              ) : (
                <Fragment key={name}>
                  <BreadcrumbItem className="font-normal">
                    {name}
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="[&>svg]:h-3 [&>svg]:w-3" />
                </Fragment>
              ),
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </section>
  )
}

export default SubVisual
