import type { Metadata } from "next"

import SubVisual from "@/app/(site)/(content)/carbon-leader/components/sub-visual"
import Status from "@/app/(site)/(content)/my-page/components/status"

export const metadata: Metadata = {
  title: "현황조회",
}

// IA "현황조회" — 로그인 회원만 들어오는 화면.
const StatusPage = () => {
  return (
    <>
      <SubVisual trail={["마이페이지", "현황조회"]} />
      <Status />
    </>
  )
}

export default StatusPage
