import type { Metadata } from "next"
import type { ReactNode } from "react"

import SubVisual from "@/app/(site)/(content)/carbon-leader/components/sub-visual"

// 섹션 안 화면들이 같은 타이틀을 쓴다. 화면이 늘어도 여기만 본다.
export const metadata: Metadata = {
  title: "선도기업 신청 1차",
}

// 선도기업 신청 1차 화면들의 공통 서브 비주얼.
const ApplicationFirstLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <SubVisual
        trail={["탄소중립 선도기업", "선도기업 신청 1차"]}
        title="탄소중립 선도기업 신청 1차"
      />
      {children}
    </>
  )
}

export default ApplicationFirstLayout
