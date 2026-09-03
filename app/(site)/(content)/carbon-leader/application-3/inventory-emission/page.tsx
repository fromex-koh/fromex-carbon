import InventoryEmission from "@/app/(site)/(content)/carbon-leader/self-check/components/inventory-emission"
import { APPLICATION_THIRD_STEPS } from "@/constants/carbon-leader-application-form"

// IA 47번 "인벤토리 배출량 산정" (선도기업 신청 3차 STEP 2).
// IA 문서상 자가진단의 같은 화면과 공통화면이라 컴포넌트를 그대로 쓰고,
// 스테퍼 단계 이름과 [이전으로]·[다음으로] 가 갈 곳만 3차 흐름으로 갈아 끼운다.
// 상단 서브 비주얼의 메뉴명은 application-3/layout.tsx 가 갈아 끼운다.
const InventoryEmissionPage = () => {
  return (
    <InventoryEmission
      steps={APPLICATION_THIRD_STEPS}
      prevHref="/carbon-leader/application-3/application-form"
      nextHref="/carbon-leader/application-3/target-achievement"
    />
  )
}

export default InventoryEmissionPage
