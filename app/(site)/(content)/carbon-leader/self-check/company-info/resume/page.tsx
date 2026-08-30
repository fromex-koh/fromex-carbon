import CompanyInfo from "@/app/(site)/(content)/carbon-leader/self-check/components/company-info"

// IA 8번 "이어서 작성하기 팝업".
// 시안이 기업 정보 입력 화면 위에 팝업이 뜬 상태라, 화면을 그대로 그리고 모달만 열어 둔다.
const ResumePage = () => {
  return <CompanyInfo openResumeNotice />
}

export default ResumePage
