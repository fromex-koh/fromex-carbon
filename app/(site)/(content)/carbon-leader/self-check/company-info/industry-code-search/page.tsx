import type { Metadata } from "next"

import CarbonBanner from "@/app/(site)/(content)/carbon-leader/self-check/components/carbon-banner"
import CompanyInfo from "@/app/(site)/(content)/carbon-leader/self-check/components/company-info"

export const metadata: Metadata = {
  title: "자가진단 · 업종코드 조회",
}

// IA 9번 "업종코드 조회 팝업".
// Step 1 화면 위에 뜨는 모달이라, 같은 화면을 모달이 열린 상태로 렌더한다.
const IndustryCodeSearchPage = () => {
  return (
    <>
      <CarbonBanner />
      <CompanyInfo openIndustryCode />
    </>
  )
}

export default IndustryCodeSearchPage
