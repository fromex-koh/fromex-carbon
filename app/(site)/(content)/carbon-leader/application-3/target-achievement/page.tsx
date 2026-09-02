import TargetAchievement from "@/app/(site)/(content)/carbon-leader/application-3/components/target-achievement"

// IA 50번 "목표달성 평가 · 일반기업 · 달성" (선도기업 신청 3차 STEP 3).
// 절대배출량 기준만 노출된다. 감축률이 목표를 넘어 다음 기준이 열리지 않는다.
// 상단 서브 비주얼의 메뉴명은 application-3/layout.tsx 가 갈아 끼운다.
// [퍼블리싱 노출용] 케이스 확인용 화면. 실제 서비스는 한 화면에서 입력값에 따라 카드가 열린다.
const TargetAchievementPage = () => {
  return <TargetAchievement name="general-met" />
}

export default TargetAchievementPage
