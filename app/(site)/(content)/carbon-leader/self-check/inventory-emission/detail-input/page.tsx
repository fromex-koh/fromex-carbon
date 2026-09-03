import { DetailInputDialog } from "@/app/(site)/(content)/carbon-leader/self-check/components/inventory-emission"

// IA 13번 "인벤토리 상세 입력 팝업".
// Step 2 인벤토리 배출량 산정 화면에서 [상세입력] 을 눌렀을 때 뜨는 모달이라,
// 본문은 비워 두고 모달만 열린 상태로 둔다.
// 시안과 같은 마디(폐기물처리 > 폐수처리 > 하수)를 세워 하위 항목을 보여 준다.
const InventoryDetailInputPage = () => {
  return (
    <>
      <div className="flex w-full max-w-316 flex-col gap-8 px-5 py-10 md:px-7 lg:px-8" />
      <DetailInputDialog code="E020101" defaultOpen />
    </>
  )
}

export default InventoryDetailInputPage
