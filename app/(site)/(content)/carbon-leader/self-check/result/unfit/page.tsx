import SelfCheckResult from "@/app/(site)/(content)/carbon-leader/self-check/components/result"

// IA 25번 "결과 확인" — 이행계획 부적정. 선도기업 신청으로 넘어갈 수 없다.
const ResultUnfitPage = () => {
  return <SelfCheckResult verdict="unfit" />
}

export default ResultUnfitPage
