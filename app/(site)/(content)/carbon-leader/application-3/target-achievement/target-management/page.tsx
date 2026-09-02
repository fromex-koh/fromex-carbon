import TargetAchievement from "@/app/(site)/(content)/carbon-leader/application-3/components/target-achievement"

// IA 52번 "목표관리업체 · 달성" (선도기업 신청 3차 STEP 3).
// 목표관리업체 기준만 노출된다. 3차년도 실적이 배출허용량 이내다.
// [퍼블리싱 노출용] 케이스 확인용 화면. 실제 서비스는 한 화면에서 입력값에 따라 카드가 열린다.
const TargetAchievementTargetManagementPage = () => {
  return <TargetAchievement name="target-met" />
}

export default TargetAchievementTargetManagementPage
