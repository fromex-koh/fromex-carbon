import EmissionSourceExampleDialog from "@/app/(site)/(content)/carbon-leader/self-check/components/emission-source-example-dialog"

// IA 21번 "(예시) 중소기업 온실가스 배출원 (Scope 1, 2, 3)".
// Step 5 화면 위에 뜨는 모달이라, 본문은 비워 두고 모달만 열린 상태로 둔다.
const EmissionSourceExamplePage = () => {
  return (
    <>
      <div className="flex w-full max-w-[1344px] flex-col gap-8 px-5 py-10 md:px-7 lg:px-8" />
      <EmissionSourceExampleDialog defaultOpen />
    </>
  )
}

export default EmissionSourceExamplePage
