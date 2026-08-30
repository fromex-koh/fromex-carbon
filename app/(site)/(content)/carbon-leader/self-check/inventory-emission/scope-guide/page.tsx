import ScopeGuideDialog from "@/app/(site)/(content)/carbon-leader/components/scope-guide-dialog"

// IA 13번 "Scope 설명 팝업".
// 원래는 Step 2 인벤토리 배출량 산정 화면 위에 뜨는 다이얼로그인데,
// 그 화면을 걷어내서 본문은 비워 두고 다이얼로그만 열린 상태로 둔다.
const ScopeGuidePage = () => {
  return (
    <>
      <div className="flex w-full max-w-[1344px] flex-col gap-8 px-5 py-10 md:px-7 lg:px-8">
        <ScopeGuideDialog defaultOpen />
      </div>
    </>
  )
}

export default ScopeGuidePage
