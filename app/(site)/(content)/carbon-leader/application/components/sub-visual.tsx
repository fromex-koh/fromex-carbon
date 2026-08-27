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

const SubVisual = () => {
  return (
    <section className="relative flex h-[180px] w-full items-center px-4 md:h-[260px]">
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
      <div className="relative container mx-auto flex h-full max-w-[1267px] flex-col justify-center gap-1 md:gap-5">
        <h1 className="text-2xl font-bold break-keep md:text-4xl lg:text-5xl">
          탄소중립 선도기업
        </h1>
        <Breadcrumb className="max-md:hidden">
          <BreadcrumbList className="text-foreground text-base">
            <BreadcrumbItem className="font-medium">홈</BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {/* BreadcrumbPage 원본의 font-bold·font-normal 충돌을 덮어쓴다. */}
              <BreadcrumbPage className="font-bold">
                탄소중립 선도기업
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </section>
  )
}

export default SubVisual
