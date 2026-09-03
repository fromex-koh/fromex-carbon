import ApplicationScreen from "@/app/(site)/(content)/carbon-leader/application/components/application-screen"
import EligibilityBlockDialog from "@/app/(site)/(content)/carbon-leader/application/components/eligibility-block-dialog"
import {
  INITIAL,
  INITIAL_BLOCK_CONDITIONS,
} from "@/constants/carbon-leader-application-step-cards"

// IA 2번 "자가진단 등급 미달 · 작성중 회원 진입 모달".
// 최초 진입 화면 위에 뜨는 모달이라 그 화면을 그대로 그리고 모달만 열어 둔다.
const ApplicationInitialNotEligiblePage = () => {
  return (
    <>
      <ApplicationScreen cards={INITIAL} />
      <EligibilityBlockDialog
        conditions={INITIAL_BLOCK_CONDITIONS}
        defaultOpen
      />
    </>
  )
}

export default ApplicationInitialNotEligiblePage
