import type { Metadata } from "next"
import type { ReactNode } from "react"

import SubVisual from "@/app/(site)/(content)/carbon-leader/components/sub-visual"

// 섹션 안 화면들이 같은 타이틀을 쓴다. 화면이 늘어도 여기만 본다.
export const metadata: Metadata = {
  title: "선도기업 신청",
}

// 신청 플로우 6단계가 서브 비주얼을 공유한다.
const ApplicationLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <SubVisual trail={["홈", "탄소중립 선도기업"]} />
      {children}
    </>
  )
}

export default ApplicationLayout
