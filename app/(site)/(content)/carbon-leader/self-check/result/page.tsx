import SelfCheckResult from "@/app/(site)/(content)/carbon-leader/self-check/components/result"

// IA 23번 "결과 확인" (자가진단 STEP 6) — 이행계획 적정 · [작성완료] 활성.
// API 연계 시: <SelfCheckResult verdict="fit" reportData={apiReportData} />
const ResultPage = () => {
  return <SelfCheckResult verdict="fit" />
}

export default ResultPage
