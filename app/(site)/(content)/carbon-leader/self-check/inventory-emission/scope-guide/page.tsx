import type { Metadata } from "next"

import CarbonBanner from "@/app/(site)/(content)/carbon-leader/self-check/components/carbon-banner"
import InventoryEmission from "@/app/(site)/(content)/carbon-leader/self-check/components/inventory-emission"

export const metadata: Metadata = {
  title: "자가진단 · Scope 설명",
}

// IA 12번 "Scope 설명 팝업".
// Step 2 화면 위에 뜨는 다이얼로그라, 같은 화면을 열린 상태로 렌더한다.
const ScopeGuidePage = () => {
  return (
    <>
      <CarbonBanner />
      <InventoryEmission openScopeGuide />
    </>
  )
}

export default ScopeGuidePage
