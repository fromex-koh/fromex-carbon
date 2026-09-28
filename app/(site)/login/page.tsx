import type { Metadata } from "next"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import LoginCard from "@/app/(site)/login/components/login-card"

export const metadata: Metadata = {
  title: "로그인",
}

// 서브비주얼 배너가 없는 화면이라 (content) 그룹이 아닌 (site) 바로 아래에 둔다.
const LoginPage = () => {
  return (
    <div className="bg-surface-page flex w-full justify-center px-5 pt-12 pb-24 md:px-7 md:pt-15 md:pb-42">
      <div className="flex w-full flex-col gap-6 md:gap-10 lg:max-w-150.5">
        <div className="flex flex-col gap-6 md:gap-10">
          <Breadcrumb>
            <BreadcrumbList className="text-ink-muted gap-2 text-base sm:gap-2">
              <BreadcrumbItem className="font-normal">홈</BreadcrumbItem>
              <BreadcrumbSeparator className="[&>svg]:h-3 [&>svg]:w-3" />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-ink-strong font-bold">
                  로그인
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex flex-col gap-1 md:gap-2">
            <h2 className="text-ink-strong text-2xl font-bold break-keep md:text-3xl">
              로그인
            </h2>
            <p className="text-ink-body text-base break-keep">
              회원 유형을 선택하고 로그인해 주세요.
            </p>
          </div>
        </div>

        <LoginCard />
      </div>
    </div>
  )
}

export default LoginPage
