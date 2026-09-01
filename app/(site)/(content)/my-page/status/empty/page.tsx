import type { Metadata } from "next"

import SubVisual from "@/app/(site)/(content)/carbon-leader/components/sub-visual"
import Status from "@/app/(site)/(content)/my-page/components/status"
import { STATUS_GROUPS_EMPTY } from "@/constants/my-page-status"

export const metadata: Metadata = {
  title: "현황조회 (내역 없음)",
}

// IA "내역 없음" — 현황조회에서 세 묶음이 모두 비었을 때를 따로 보는 화면.
// 화면 코드는 /my-page/status 와 같고 목록만 빈 값을 넘긴다.
const StatusEmptyPage = () => {
  return (
    <>
      <SubVisual trail={["마이페이지", "현황조회"]} />
      <Status groups={STATUS_GROUPS_EMPTY} />
    </>
  )
}

export default StatusEmptyPage
