import TargetAchievement from "@/app/(site)/(content)/carbon-leader/application-3/components/target-achievement"

// IA 54번 "목표관리업체 · 전 기준 미달" (선도기업 신청 3차 STEP 3).
// 목표관리업체 → 절대배출량 모두 미달이라 원단위 · 감축량 기준까지 열린다.
// [퍼블리싱 노출용] 케이스 확인용 화면. 실제 서비스는 한 화면에서 입력값에 따라 카드가 열린다.
const TargetAchievementTargetManagementAllUnmetPage = () => {
  return <TargetAchievement name="target-unmet" />
}

export default TargetAchievementTargetManagementAllUnmetPage
