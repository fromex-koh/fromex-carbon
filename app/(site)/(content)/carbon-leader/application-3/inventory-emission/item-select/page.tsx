import InventoryItemDialog from "@/app/(site)/(content)/carbon-leader/self-check/components/inventory-item-dialog"

// IA 48번 "인벤토리 항목 선택 팝업" (선도기업 신청 3차 STEP 2).
// 자가진단의 같은 팝업과 공통화면이라 컴포넌트를 그대로 쓴다.
// Step 2 인벤토리 배출량 산정 화면 위에 뜨는 모달이라,
// 본문은 비워 두고 모달만 열린 상태로 둔다.
const InventoryItemSelectPage = () => {
  return (
    <>
      <div className="flex w-full max-w-316 flex-col gap-8 px-5 py-10 md:px-7 lg:px-8" />
      <InventoryItemDialog defaultOpen />
    </>
  )
}

export default InventoryItemSelectPage
