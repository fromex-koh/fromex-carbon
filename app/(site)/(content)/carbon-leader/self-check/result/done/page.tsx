import SelfCheckResult from "@/app/(site)/(content)/carbon-leader/self-check/components/result"

// IA 24번 "결과 확인" — [작성완료] 를 누른 뒤 [선도기업 신청하기] 가 열린 상태.
const ResultDonePage = () => {
  return <SelfCheckResult verdict="fit" completed />
}

export default ResultDonePage
