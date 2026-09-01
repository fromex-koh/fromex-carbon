import type { Metadata } from "next"

import SubVisual from "@/app/(site)/(content)/carbon-leader/components/sub-visual"
import ConfirmDialog from "@/app/(site)/(content)/carbon-leader/self-check/components/confirm-dialog"

export const metadata: Metadata = {
  title: "저장 확인",
}

// IA "저장 확인" 모달 팝업 — 회원정보 수정 화면에서 [저장하기] 를 눌러 검사를 통과했을 때 뜬다.
// 다른 모달 전용 라우트와 같이 본문은 비워 두고 모달만 열린 상태로 둔다.
const ProfileEditSaveConfirmPage = () => {
  return (
    <>
      <SubVisual trail={["마이페이지", "회원정보 수정"]} />
      <div className="flex w-full max-w-316 flex-col gap-8 px-5 py-10 md:px-7 lg:px-8" />
      <ConfirmDialog
        defaultOpen
        title="저장하시겠습니까?"
        description=""
        cancelLabel="취소"
        confirmLabel="저장"
        confirmTone="default"
      />
    </>
  )
}

export default ProfileEditSaveConfirmPage
