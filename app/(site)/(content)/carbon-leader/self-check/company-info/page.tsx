import type { Metadata } from "next"

import CarbonBanner from "@/app/(site)/(content)/carbon-leader/self-check/components/carbon-banner"
import CompanyInfo from "@/app/(site)/(content)/carbon-leader/self-check/components/company-info"

export const metadata: Metadata = {
  title: "자가진단 · 기업 정보 입력",
}

const CompanyInfoPage = () => {
  return (
    <>
      <CarbonBanner />
      <CompanyInfo />
    </>
  )
}

export default CompanyInfoPage
