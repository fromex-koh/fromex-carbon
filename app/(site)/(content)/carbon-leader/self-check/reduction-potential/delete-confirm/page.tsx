import ConfirmDialog from "@/app/(site)/(content)/carbon-leader/self-check/components/confirm-dialog"

// IA 14번 "삭제 확인 팝업" — 사업 카드의 [삭제] 를 눌렀을 때 뜬다.
// 감축잠재량 산정 화면 위에 뜨는 모달이라, 본문은 비워 두고 모달만 열린 상태로 둔다.
const DeleteConfirmPage = () => {
  return (
    <>
      <div className="flex w-full max-w-[1344px] flex-col gap-8 px-5 py-10 md:px-7 lg:px-8" />
      <ConfirmDialog
        defaultOpen
        title="선택하신 사업 정보를 삭제하시겠습니까?"
        description="입력한 정보가 모두 사라집니다."
        confirmLabel="삭제하기"
      />
    </>
  )
}

export default DeleteConfirmPage
