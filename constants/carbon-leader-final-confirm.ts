// 선도기업 신청 1차 STEP 3(신청서 최종 확인) 화면의 표시 값.
// [퍼블리싱 노출용] 앞 단계에서 넘어올 값을 시안 그대로 고정해 두었다.

export const FINAL_CONFIRM_NOTICES = [
  "입력하신 내용을 최종 확인한 후 제출해주세요. 제출 후에는 수정이 불가합니다.",
  "아래 내용이 모두 정확한지 확인해주세요. 제출 후에는 담당자 검토가 진행되며, 신청번호가 발급됩니다. 수정이 필요한 경우 [수정하기] 버튼을 이용하세요.",
]

/** 이름표 + 값 한 칸 */
export interface SummaryField {
  label: string
  value: string
  /** 시안에서 두 칸을 쓰는 항목(기업소재지 등) */
  wide?: boolean
  /** 이 항목 다음에 구분선이 들어간다 */
  groupEnd?: boolean
}

export const COMPANY_FIELDS: SummaryField[] = [
  { label: "업체명", value: "주식회사 그린에너지텍" },
  { label: "대표자", value: "김탄소" },
  { label: "사업자등록번호", value: "123-45-67890" },
  { label: "법인등록번호", value: "110111-1234567" },
  {
    label: "기업소재지",
    value: "06234 서울특별시 강남구 테헤란로 123 탄소빌딩 5층",
    wide: true,
    groupEnd: true,
  },
  { label: "대표자 연락처", value: "02-1234-5678" },
  { label: "전자우편", value: "ceo@green-energytech.co.kr" },
]

export const STATUS_FIELDS: SummaryField[] = [
  { label: "설립일자", value: "2015-03-15" },
  { label: "업종", value: "제조업" },
  { label: "업종코드", value: "212110" },
  { label: "주생산품", value: "친환경 단열재, 탄소저감 건자재" },
  { label: "연간생산량", value: "5,000 ton" },
]

/** 기업현황 카드 아래에 붙는 제출 완료 파일 */
export const STATUS_FILES = [
  { name: "중소기업확인서_그린에너지텍_2025.pdf", size: "1.2 MB" },
  { name: "중소기업확인서_그린에너지텍_2025.pdf", size: "1.2 MB" },
]

export const MANAGER_FIELDS: SummaryField[] = [
  { label: "담당자명", value: "이환경" },
  { label: "부서 / 직책", value: "환경안전팀 / 과장" },
  { label: "전화번호 (사무실)", value: "02-1234-5679" },
  { label: "팩스번호", value: "02-1234-5680" },
  { label: "전자우편", value: "manager@green-energytech.co.kr" },
  { label: "연락처 (HP)", value: "010-9876-5432" },
]

/** 연도별 표의 한 줄. values 가 하나면 값 자리 가운데에 한 번만 찍는다. */
export interface SummaryRow {
  label: string
  /** 이름 아래(360 은 오른쪽 끝)에 붙는 작은 회색 단위 */
  unit?: string
  values: string[]
}

export const BASE_YEAR_COLUMNS = ["2023년", "2024년", "2025년"]

export const BASE_YEAR_ROWS: SummaryRow[] = [
  {
    label: "총매출액",
    unit: "(천원)",
    values: ["15,000,000", "15,000,000", "15,000,000"],
  },
  {
    label: "온실가스배출량",
    unit: "(tCO₂eq)",
    values: ["450.50", "450.50", "450.50"],
  },
  { label: "탄소중립 기준연도", values: ["2023년"] },
  {
    label: "기준연도 온실가스 평균배출량",
    unit: "(tCO₂eq)",
    values: ["432.17"],
  },
]

export const REDUCTION_PLAN_ROWS: SummaryRow[] = [
  {
    label: "탄소감축투자 계획금액",
    unit: "(천원)",
    values: ["500,000", "800,000", "1,200,000"],
  },
  {
    label: "탄소중립 목표",
    unit: "(기준연도 대비감축, %)",
    values: ["3.0%", "6.5%", "10.0%"],
  },
]

/** 투자계획 표의 한 줄 */
export interface InvestmentRow {
  tech: string
  facility: string
  period: string
  amount: string
  reduction: string
}

/** 투자계획 표의 열. unit 은 이름 아래 줄에 작은 회색으로 붙는다 */
export const INVESTMENT_COLUMNS: { label: string; unit?: string }[] = [
  { label: "감축기술" },
  { label: "감축설비명" },
  { label: "사업기간" },
  { label: "투자금", unit: "(천원)" },
  { label: "온실가스감축량", unit: "(tCO₂eq)" },
]

export const INVESTMENT_ROWS: InvestmentRow[] = [
  {
    tech: "고효율 설비교체",
    facility: "고효율 LED 조명 교체",
    period: "2026.03~2026.09",
    amount: "150,000",
    reduction: "12.50",
  },
  {
    tech: "재생에너지 도입",
    facility: "태양광 발전 설비",
    period: "2026.06~2027.03",
    amount: "300,000",
    reduction: "45.20",
  },
  {
    tech: "공정 최적화",
    facility: "에너지 효율화 시스템",
    period: "2027.01~2027.12",
    amount: "250,000",
    reduction: "28.30",
  },
  {
    tech: "차량 전환",
    facility: "전기차 도입 (업무용)",
    period: "2027.06~2028.06",
    amount: "200,000",
    reduction: "8.40",
  },
]

/** 최종 확인 화면에 보여 줄 첨부 서류. 비우면 빈 상태 안내가 나온다 */
export interface SubmittedDocument {
  title: string
  files: { name: string; size: string }[]
}

export const SUBMITTED_DOCUMENTS: SubmittedDocument[] = [
  {
    title: "사업자등록증",
    files: [{ name: "사업자등록증_그린에너지텍_2024.pdf", size: "1.2 MB" }],
  },
  {
    title: "중소기업 확인서",
    files: [
      { name: "중소기업확인서_그린에너지텍_2026.pdf", size: "1.2 MB" },
      { name: "중소기업확인서_그린에너지텍_2026.pdf", size: "1.2 MB" },
    ],
  },
]
