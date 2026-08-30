import type { Metadata } from "next"
import type { ReactNode } from "react"

import SubVisual from "@/app/(site)/(content)/carbon-leader/components/sub-visual"

// 섹션 안 화면들이 같은 타이틀을 쓴다. 화면이 늘어도 여기만 본다.
export const metadata: Metadata = {
  title: "자가진단",
}

// 자가진단 화면들은 서브 비주얼이 모두 같다. 여기서 한 번만 그린다.
const SelfCheckLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <SubVisual
        trail={["탄소중립 선도기업", "자가진단"]}
        title="탄소중립 선도기업 자가진단"
      />
      {children}
    </>
  )
}

export default SelfCheckLayout
