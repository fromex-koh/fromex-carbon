import MandatoryTrainingDialog from "@/app/(site)/(content)/carbon-leader/self-check/components/mandatory-training-dialog"

// IA 20번 "탄소중립·환경·에너지 분야 관련 의무 교육".
// Step 5 화면 위에 뜨는 모달이라, 본문은 비워 두고 모달만 열린 상태로 둔다.
const MandatoryTrainingPage = () => {
  return (
    <>
      <div className="flex w-full max-w-[1344px] flex-col gap-8 px-5 py-10 md:px-7 lg:px-8" />
      <MandatoryTrainingDialog defaultOpen />
    </>
  )
}

export default MandatoryTrainingPage
