import type { Metadata } from "next"

import SubVisual from "@/app/(site)/(content)/carbon-leader/components/sub-visual"
import ProfileEdit from "@/app/(site)/(content)/my-page/components/profile-edit"

export const metadata: Metadata = {
  title: "회원정보 수정",
}

// IA 61번 "회원정보 수정 — 기관회원".
// 기업회원 화면(/my-page/profile-edit/company)과 같고 [비밀번호 변경] 카드만 더 있다.
const ProfileEditPage = () => {
  return (
    <>
      <SubVisual trail={["마이페이지", "회원정보 수정"]} />
      <ProfileEdit memberType="institution" />
    </>
  )
}

export default ProfileEditPage
