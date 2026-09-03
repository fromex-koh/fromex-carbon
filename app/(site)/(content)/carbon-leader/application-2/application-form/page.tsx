import ApplicationForm from "@/app/(site)/(content)/carbon-leader/application-1/components/application-form"

// IA 37번 "신청서 작성" (선도기업 신청 2차 STEP 1).
// 껍데기는 1차와 같고, 카드 구성만 회차로 갈린다.
// 2차는 기준연도 현황·감축계획 카드가 빠지고, 1차 투자계획을 읽기 전용으로 되짚은 뒤
// 감축기술 도입현황을 새로 받는다. application-1/components/application-form 참고.
// 상단 서브 비주얼의 메뉴명은 application-2/layout.tsx 가 갈아 끼운다.
const ApplicationFormPage = () => {
  return <ApplicationForm round={2} />
}

export default ApplicationFormPage
