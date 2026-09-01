import type { Metadata } from "next"

import SubVisual from "@/app/(site)/(content)/carbon-leader/components/sub-visual"
import SubAccountRegisterDialog from "@/app/(site)/(content)/my-page/components/sub-account-register-dialog"

export const metadata: Metadata = {
  title: "하위계정 등록",
}

// IA 60번 "하위계정 등록" 모달 팝업.
// 하위계정 관리 화면 위에 뜨는 모달이라, 다른 모달 전용 라우트와 같이
// 본문은 비워 두고 모달만 열린 상태로 둔다. 실제 등록 흐름은 /my-page/sub-account 에 있다.
const SubAccountRegisterPage = () => {
  return (
    <>
      <SubVisual trail={["마이페이지", "하위계정 관리"]} />
      <div className="flex w-full max-w-316 flex-col gap-8 px-5 py-10 md:px-7 lg:px-8" />
      <SubAccountRegisterDialog defaultOpen />
    </>
  )
}

export default SubAccountRegisterPage
