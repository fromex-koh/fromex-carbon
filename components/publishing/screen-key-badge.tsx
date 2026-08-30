"use client"

// ⚠️ 퍼블리싱 인덱스 전용 — 서비스 화면 소스가 아니다.
// 전달본에도 들어가지만 실제 화면에서는 쓰지 않으므로 참고만 한다.
//
// 실제 화면의 마지막 뎁스 배지를 눌러 그 화면의 고유 키를 복사한다.
// 상위 메뉴 뎁스는 여러 화면을 대표하므로 복사 버튼으로 만들지 않는다.

import { toast } from "sonner"
import { badgeVariants } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface ScreenKeyBadgeProps {
  depth: number
  screenKey: string
}

const ScreenKeyBadge = ({ depth, screenKey }: ScreenKeyBadgeProps) => {
  const label = `${screenKey} 키값 복사`

  const copyKey = async () => {
    try {
      await navigator.clipboard.writeText(screenKey)
      toast(`${screenKey} 키값이 복사되었습니다.`, { position: "top-center" })
    } catch {
      // 클립보드 권한이 없으면 아무것도 바꾸지 않는다.
    }
  }

  return (
    <button
      type="button"
      onClick={copyKey}
      title={label}
      aria-label={label}
      className={cn(
        badgeVariants({ variant: "outline" }),
        "hover:ring-primary/40 focus-visible:ring-primary w-fit cursor-pointer transition-shadow hover:ring-2 focus-visible:ring-2 focus-visible:outline-none",
      )}
    >
      {depth}
    </button>
  )
}

export default ScreenKeyBadge
