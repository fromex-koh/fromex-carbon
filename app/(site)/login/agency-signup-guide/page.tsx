import type { Metadata } from "next"

import AgencySignupGuideDialog from "@/app/(site)/login/components/agency-signup-guide-dialog"

export const metadata: Metadata = {
  title: "기관회원 가입 안내",
}

// 로그인 화면 기관회원 탭의 [회원가입] 으로 여는 모달이라,
// 다른 모달 전용 라우트와 같이 본문은 비워 두고 모달만 열린 상태로 둔다.
// 서브비주얼이 없는 화면이라 로그인 화면과 같은 배경·여백을 그대로 쓴다.
const AgencySignupGuidePage = () => {
  return (
    <>
      <div className="bg-surface-page flex w-full justify-center px-5 pt-12 pb-24 md:px-7 md:pt-15 md:pb-42" />
      <AgencySignupGuideDialog defaultOpen />
    </>
  )
}

export default AgencySignupGuidePage
