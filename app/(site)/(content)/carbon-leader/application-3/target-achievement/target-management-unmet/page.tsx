import TargetAchievement from "@/app/(site)/(content)/carbon-leader/application-3/components/target-achievement"

// IA 53번 "목표관리업체 · 절대배출량 달성" (선도기업 신청 3차 STEP 3).
// 목표관리업체 기준이 미달이라 절대배출량 기준이 이어서 열리고, 그쪽은 달성이다.
// [퍼블리싱 노출용] 케이스 확인용 화면. 실제 서비스는 한 화면에서 입력값에 따라 카드가 열린다.
const TargetAchievementTargetManagementUnmetPage = () => {
  return <TargetAchievement name="target-abs-met" />
}

export default TargetAchievementTargetManagementUnmetPage
