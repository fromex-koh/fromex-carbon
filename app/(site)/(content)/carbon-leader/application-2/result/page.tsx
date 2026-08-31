import SubmitDone from "@/app/(site)/(content)/carbon-leader/application-1/components/submit-done"

// IA 41번 "신청결과 확인" (선도기업 신청 2차 STEP 4 · 제출 완료).
// 화면 내용은 1차와 같아 컴포넌트를 그대로 쓴다.
// 상단 서브 비주얼의 메뉴명은 application-2/layout.tsx 가 갈아 끼운다.
const ResultPage = () => {
  return <SubmitDone round={2} />
}

export default ResultPage
