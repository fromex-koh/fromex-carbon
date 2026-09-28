import type { Metadata } from "next"

import FindAccountDialog from "@/app/(site)/login/components/find-account-dialog"

export const metadata: Metadata = {
  title: "아이디 · 비밀번호 찾기",
}

// 로그인 화면 기관회원 탭의 [아이디 · 비밀번호 찾기] 로 여는 모달이라,
// 다른 모달 전용 라우트와 같이 본문은 비워 두고 모달만 열린 상태로 둔다.
const FindAccountPage = () => {
  return (
    <>
      <div className="bg-surface-page flex w-full justify-center px-5 pt-12 pb-24 md:px-7 md:pt-15 md:pb-42" />
      <FindAccountDialog defaultOpen />
    </>
  )
}

export default FindAccountPage
