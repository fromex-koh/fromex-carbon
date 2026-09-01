import type { Metadata } from "next"

import SubVisual from "@/app/(site)/(content)/carbon-leader/components/sub-visual"
import SubAccount from "@/app/(site)/(content)/my-page/components/sub-account"

export const metadata: Metadata = {
  title: "하위계정 관리",
}

// IA 58번 하위 "하위계정 관리". 로그인(기관회원) 상태의 GNB 마이페이지에서 들어온다.
const SubAccountPage = () => {
  return (
    <>
      <SubVisual trail={["마이페이지", "하위계정 관리"]} />
      <SubAccount />
    </>
  )
}

export default SubAccountPage
