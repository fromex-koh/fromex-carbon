import type { Metadata } from "next"

import SubVisual from "@/app/(site)/(content)/carbon-leader/components/sub-visual"
import ProfileEdit from "@/app/(site)/(content)/my-page/components/profile-edit"

export const metadata: Metadata = {
  title: "회원정보 수정",
}

// IA 62번 "회원정보 수정 — 기업회원".
// 기관회원 화면에서 [비밀번호 변경] 카드만 빠진다.
const ProfileEditCompanyPage = () => {
  return (
    <>
      <SubVisual trail={["마이페이지", "회원정보 수정"]} />
      <ProfileEdit memberType="company" />
    </>
  )
}

export default ProfileEditCompanyPage
