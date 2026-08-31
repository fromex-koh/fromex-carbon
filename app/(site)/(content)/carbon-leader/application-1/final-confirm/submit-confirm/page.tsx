import ConfirmDialog from "@/app/(site)/(content)/carbon-leader/self-check/components/confirm-dialog"

// IA 29번 "제출 확인 팝업" — 최종확인 화면에서 [제출하기] 를 눌렀을 때 뜬다.
// 최종확인 화면 위에 뜨는 모달이라, 본문은 비워 두고 모달만 열린 상태로 둔다.
const SubmitConfirmPage = () => {
  return (
    <>
      <div className="flex w-full max-w-316 flex-col gap-8 px-5 py-10 md:px-7 lg:px-8" />
      <ConfirmDialog
        defaultOpen
        title="신청서를 제출하시겠습니까?"
        description={
          <>
            제출 후에는 내용 수정이 불가합니다.
            {/* 좁은 화면은 문구가 길어 쉼표 없이 두 줄로 끊는다 */}
            <br />
            모든 정보가 정확히 입력되었는지 확인해주세요.
          </>
        }
        cancelLabel="취소"
        confirmLabel="제출하기"
        confirmTone="default"
      />
    </>
  )
}

export default SubmitConfirmPage
