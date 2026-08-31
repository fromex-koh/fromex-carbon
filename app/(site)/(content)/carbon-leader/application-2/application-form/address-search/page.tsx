import AddressSearchDialog from "@/components/address-search-dialog"

// IA 34번 "주소 검색 팝업" — 카카오 주소 검색 API 를 붙일 자리다.
// 선도기업 신청 2차 신청서 작성 화면 위에 뜨는 모달이라, 본문은 비워 두고 모달만 열린 상태로 둔다.
const AddressSearchPage = () => {
  return (
    <>
      <div className="flex w-full max-w-316 flex-col gap-8 px-5 py-10 md:px-7 lg:px-8" />
      <AddressSearchDialog defaultOpen />
    </>
  )
}

export default AddressSearchPage
