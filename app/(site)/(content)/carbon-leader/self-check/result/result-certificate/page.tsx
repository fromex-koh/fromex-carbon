import SelfCheckResultCertificate from "@/app/(site)/(content)/carbon-leader/self-check/components/result-certificate"
import { SELF_CHECK_REPORT_SAMPLE } from "@/constants/carbon-leader-self-check-report"

// IA 28번 "결과보고서(template)". 실제 연계 시 SAMPLE 대신 서버 데이터를 주입한다.
const SelfCheckResultCertificatePage = () => {
  return <SelfCheckResultCertificate data={SELF_CHECK_REPORT_SAMPLE} />
}

export default SelfCheckResultCertificatePage
