import CertificationTypeDialog from "@/app/(site)/(content)/carbon-leader/self-check/components/certification-type-dialog"

// IA 22번 "국가에서 관리하는 환경분야 인증 종류".
// Step 5 화면 위에 뜨는 모달이라, 본문은 비워 두고 모달만 열린 상태로 둔다.
const CertificationTypePage = () => {
  return (
    <>
      <div className="flex w-full max-w-[1344px] flex-col gap-8 px-5 py-10 md:px-7 lg:px-8" />
      <CertificationTypeDialog defaultOpen />
    </>
  )
}

export default CertificationTypePage
