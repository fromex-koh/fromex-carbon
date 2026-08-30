import ConfirmDialog from "@/app/(site)/(content)/carbon-leader/self-check/components/confirm-dialog"

// IA 16번 "변경 확인 팝업" — 입력을 마친 뒤 감축 방법론을 바꿀 때 뜬다.
// 감축잠재량 산정 화면 위에 뜨는 모달이라, 본문은 비워 두고 모달만 열린 상태로 둔다.
const ChangeConfirmPage = () => {
  return (
    <>
      <div className="flex w-full max-w-[1344px] flex-col gap-8 px-5 py-10 md:px-7 lg:px-8" />
      <ConfirmDialog
        defaultOpen
        compactTitleOnMobile
        title="감축 방법론을 변경하시겠습니까?"
        description={
          <>
            감축방법론 변경 시,
            {/* 시안은 PC 만 한 줄, 태블릿 이하는 쉼표 뒤에서 끊는다 */}
            <br className="lg:hidden" /> 상세 입력 정보가 모두 삭제 처리 됩니다.
          </>
        }
        confirmLabel="삭제하기"
      />
    </>
  )
}

export default ChangeConfirmPage
