"use client"

import { useEffect, useState } from "react"

/**
 * 모달 전용 라우트로 바로 들어왔을 때 다이얼로그를 열어 준다.
 *
 * 쓰는 곳
 * - /carbon-leader/self-check/company-info/industry-code-search (업종코드 조회)
 * - /carbon-leader/self-check/inventory-emission/scope-guide (Scope 설명)
 *
 * 서버에서 연 채로 그리면 마크업이 어긋나고, 마운트 직후에 열면
 * 루트 레이아웃의 NavBar(Suspense) 가 아직 하이드레이션 중이라
 * Radix 가 배경에 붙이는 aria-hidden 이 하이드레이션 경고를 만든다.
 * 브라우저가 한가해진 뒤(=React 작업이 끝난 뒤) 열어서 두 문제를 모두 피한다.
 */
export const useDialogAutoOpen = (enabled?: boolean) => {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!enabled) return

    const openLater = () => setOpen(true)

    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(openLater, { timeout: 500 })
      return () => window.cancelIdleCallback(id)
    }

    const id = window.setTimeout(openLater, 200)
    return () => window.clearTimeout(id)
  }, [enabled])

  return [open, setOpen] as const
}
