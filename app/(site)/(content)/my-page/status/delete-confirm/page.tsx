import type { Metadata } from "next"

import SubVisual from "@/app/(site)/(content)/carbon-leader/components/sub-visual"
import ConfirmDialog from "@/app/(site)/(content)/carbon-leader/self-check/components/confirm-dialog"

export const metadata: Metadata = {
  title: "삭제 확인",
}

// IA "삭제 확인" 모달 팝업 — 현황조회 카드의 [⋯] 패널에서 [삭제하기] 를 눌렀을 때 뜬다.
// 다른 모달 전용 라우트와 같이 본문은 비워 두고 모달만 열린 상태로 둔다.
const StatusDeleteConfirmPage = () => {
  return (
    <>
      <SubVisual trail={["마이페이지", "현황조회"]} />
      <div className="flex w-full max-w-316 flex-col gap-8 px-5 py-10 md:px-7 lg:px-8" />
      <ConfirmDialog
        defaultOpen
        title="삭제하시겠습니까?"
        description="삭제된 데이터는 복구할 수 없습니다."
        cancelLabel="취소"
        confirmLabel="삭제하기"
        confirmTone="destructive"
      />
    </>
  )
}

export default StatusDeleteConfirmPage
