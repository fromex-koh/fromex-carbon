import type { Metadata } from "next"

import SubVisual from "@/app/(site)/(content)/carbon-leader/components/sub-visual"
import SupplementRequestDialog from "@/app/(site)/(content)/my-page/components/supplement-request-dialog"

export const metadata: Metadata = {
  title: "보완요청",
}

// IA "보완요청" 모달 팝업 — 현황조회의 [보완요청 보기] 에서 뜬다.
// 다른 모달 전용 라우트와 같이 본문은 비워 두고 모달만 열린 상태로 둔다.
const SupplementRequestPage = () => {
  return (
    <>
      <SubVisual trail={["마이페이지", "현황조회"]} />
      <div className="flex w-full max-w-316 flex-col gap-8 px-5 py-10 md:px-7 lg:px-8" />
      <SupplementRequestDialog defaultOpen />
    </>
  )
}

export default SupplementRequestPage
