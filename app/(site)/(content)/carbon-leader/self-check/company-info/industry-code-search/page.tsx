import IndustryCodeDialog from "@/app/(site)/(content)/carbon-leader/self-check/components/industry-code-dialog"

// IA 10번 "업종코드 조회 팝업".
// Step 1 화면 위에 뜨는 모달이라, 본문은 비워 두고 모달만 열린 상태로 둔다.
const IndustryCodeSearchPage = () => {
  return (
    <>
      <div className="flex w-full max-w-[1344px] flex-col gap-8 px-5 py-10 md:px-7 lg:px-8" />
      <IndustryCodeDialog defaultOpen />
    </>
  )
}

export default IndustryCodeSearchPage
