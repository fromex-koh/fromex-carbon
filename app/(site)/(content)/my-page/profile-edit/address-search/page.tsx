import type { Metadata } from "next"

import AddressSearchDialog from "@/components/address-search-dialog"

export const metadata: Metadata = {
  title: "회원정보 수정",
}

// IA 58번 "주소 검색 팝업" — 선도기업 신청 화면과 같은 모달을 쓴다.
// 회원정보 수정 화면 위에 뜨는 모달이라, 본문은 비워 두고 모달만 열린 상태로 둔다.
// 마이페이지 섹션은 아직 화면이 없어 서브 비주얼 없이 본문 자리만 잡아 둔다.
const AddressSearchPage = () => {
  return (
    <>
      <div className="flex w-full max-w-316 flex-col gap-8 px-5 py-10 md:px-7 lg:px-8" />
      <AddressSearchDialog defaultOpen />
    </>
  )
}

export default AddressSearchPage
