import type { Metadata } from "next"

import CarbonBanner from "@/app/(site)/(content)/carbon-leader/self-check/components/carbon-banner"
import InventoryEmission from "@/app/(site)/(content)/carbon-leader/self-check/components/inventory-emission"

export const metadata: Metadata = {
  title: "자가진단 · 인벤토리 항목 선택",
}

// IA 11번 "인벤토리 항목 선택 팝업".
// Step 2 화면 위에 뜨는 모달이라, 같은 화면을 모달이 열린 상태로 렌더한다.
// ?empty=1 로 접근하면 목록이 비었을 때(검색 결과 없음) 화면을 확인할 수 있다.
const ItemSelectPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ empty?: string }>
}) => {
  const { empty } = await searchParams

  return (
    <>
      <CarbonBanner />
      <InventoryEmission openItemSelect emptyItems={empty === "1"} />
    </>
  )
}

export default ItemSelectPage
