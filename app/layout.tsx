import type { Metadata } from "next"
import localFont from "next/font/local"
import { Suspense } from "react"
import "./globals.css"
import RybbitProvider from "@/components/rybbit-provider"
import { ThemeProvider } from "@/components/theme-provider"
import QueryProvider from "@/components/query-provider"
import { Toaster } from "@/components/toaster"
import NavBar from "@/components/nav-bar"
import FooterBar from "@/components/footer-bar"

// AuthProvider 는 인증 API 라우트(/carbon/api/auth)가 없어 세션 조회가 404 로 실패하고
// 60초마다 콘솔에 ClientFetchError 를 남긴다. 퍼블리싱 단계에서는 붙이지 않는다.
// import AuthProvider from "@/components/auth-provider"

export const metadata: Metadata = {
  title: {
    template: "%s | 탄소가치플랫폼",
    default: "탄소가치플랫폼",
  },
  description: "기술보증기금 탄소 가치 플랫폼",
}

const pretendard = localFont({
  src: "./(font)/PretendardGOVVariable.woff2",
  display: "swap",
  weight: "45 930",
  style: "normal",
  variable: "--font-pretendard",
})

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={pretendard.className}>
        <main>
          {/* <AuthProvider> */}
          <RybbitProvider />
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <QueryProvider>
              <Suspense fallback={null}>
                <NavBar />
              </Suspense>
              {children}
              <Toaster />
              <FooterBar />
            </QueryProvider>
          </ThemeProvider>
          {/* </AuthProvider> */}
        </main>
      </body>
    </html>
  )
}

export default RootLayout
