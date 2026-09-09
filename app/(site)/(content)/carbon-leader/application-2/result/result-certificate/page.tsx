import ResultCertificate from "@/app/(site)/(content)/carbon-leader/application-1/components/result-certificate"
import { CERTIFICATE_SECOND_SAMPLE } from "@/constants/carbon-leader-certificate"

// IA 44번 "결과 확인서 (다운로드)" (선도기업 신청 2차 STEP 4).
// 확인서 레이아웃과 다운로드 동작은 1차 공통 템플릿을 사용하고 2차 데이터만 주입한다.
const ResultCertificatePage = () => {
  return <ResultCertificate data={CERTIFICATE_SECOND_SAMPLE} />
}

export default ResultCertificatePage
