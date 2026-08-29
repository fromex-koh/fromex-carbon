import ScopeGuideDialog from "@/app/(site)/(content)/carbon-leader/components/scope-guide-dialog"

// IA 33번 "Scope 설명 팝업".
// IA 문서상 3차 신청 Step 2 는 자가진단의 인벤토리 배출량 산정과 공통화면이라
// 자가진단 쪽 배너·다이얼로그를 그대로 쓰되, 제목과 위치만 이 화면에 맞춘다.
// 그 본화면을 걷어내서 본문은 비워 두고 다이얼로그만 열린 상태로 둔다.
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
