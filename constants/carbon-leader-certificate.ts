// 선도기업 결과 확인서(PDF 로 내려받는 종이 한 장)의 값.
//
// 화면은 이 모양 하나만 받아 그린다. 연계할 때 서버 응답을 CertificateData 로 맞춰 넘기면
// 화면 코드는 손대지 않아도 된다.

/** 확인서에 찍히는 값 한 벌 */
export interface CertificateData {
  /** 오른쪽 위 문서번호. 예) 제 26-01호 */
  documentNo: string
  /** 가운데 제목. 회차에 따라 1차 / 2차 / 3차 확인서로 바뀐다 */
  title: string
  /** 업체명 */
  company: string
  /** 대표자 */
  ceo: string
  /** 우편번호를 앞에 붙인 한 줄 주소. 길면 두 줄로 접힌다 */
  address: string
  /** 인증단계. 예) 최초신청 · 중간점검 · 최종점검 */
  stage: string
  /** 유효기간 시작일. 표기 형식(2026.09.03)까지 담아 보낸다 */
  validFrom: string
  /** 유효기간 종료일 */
  validTo: string
  /** 본문. 줄바꿈은 종이 폭에 맡긴다 */
  body: string
  /** 발급일. 아래 오른쪽에 '2026년 9월 3일' 로 찍힌다 */
  issuedOn: { year: number; month: number; day: number }
  /** 맨 아래 발급 기관 */
  issuer: string
}

/** 값 왼쪽에 놓이는 이름표. 순서가 곧 표시 순서다 */
export const CERTIFICATE_FIELDS = [
  { key: "company", label: "업체명" },
  { key: "ceo", label: "대표자" },
  { key: "address", label: "주소" },
  { key: "stage", label: "인증단계" },
  { key: "period", label: "유효기간" },
] as const

/**
 * [퍼블리싱 노출용] 시안에 적힌 예시 값이다.
 * 연계할 때 이 상수 대신 서버에서 받은 값을 CertificateSheet 에 넘긴다.
 */
export const CERTIFICATE_SAMPLE: CertificateData = {
  documentNo: "제 26-01호",
  title: "탄소중립 선도기업 1차 확인서",
  company: "주식회사 그린에너지텍",
  ceo: "김탄소",
  address: "06234 서울특별시 강남구 테헤란로 123 탄소빌딩 5층",
  stage: "최초신청",
  validFrom: "2026.09.03",
  validTo: "2027.09.03",
  body: "위 업체는 (가칭)탄소중립 선도중소기업 육성사업에 의해 선정된 탄소중립 선도중소기업임을 확인합니다.",
  issuedOn: { year: 2026, month: 9, day: 3 },
  issuer: "기술보증기금",
}

/** [퍼블리싱 노출용] Figma의 선도기업 2차 확인서 예시 값 */
export const CERTIFICATE_SECOND_SAMPLE: CertificateData = {
  documentNo: "제 26-02호",
  title: "탄소중립 선도기업 2차 확인서",
  company: "주식회사 그린에너지텍",
  ceo: "김탄소",
  address: "06234 서울특별시 강남구 테헤란로 123 탄소빌딩 5층",
  stage: "중간점검",
  validFrom: "2027.10.03",
  validTo: "2029.10.03",
  body: "위 업체는 (가칭)탄소중립 선도중소기업 육성사업에 의해 선정된 탄소중립 선도중소기업임을 확인합니다.",
  issuedOn: { year: 2027, month: 10, day: 3 },
  issuer: "기술보증기금",
}

/** [퍼블리싱 노출용] Figma의 선도기업 3차 확인서 예시 값 */
export const CERTIFICATE_THIRD_SAMPLE: CertificateData = {
  documentNo: "제 26-03호",
  title: "탄소중립 선도기업 3차 확인서",
  company: "주식회사 그린에너지텍",
  ceo: "김탄소",
  address: "06234 서울특별시 강남구 테헤란로 123 탄소빌딩 5층",
  stage: "최종점검",
  validFrom: "2029.11.03",
  validTo: "2032.11.03",
  body: "위 업체는 (가칭)탄소중립 선도중소기업 육성사업에 의해 선정된 탄소중립 선도중소기업임을 확인합니다.",
  issuedOn: { year: 2029, month: 11, day: 3 },
  issuer: "기술보증기금",
}
