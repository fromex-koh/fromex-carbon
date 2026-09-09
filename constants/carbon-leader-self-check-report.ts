// 탄소중립 선도기업 자가진단 결과보고서(PDF 2페이지)의 데이터 모양.
// 프론트 연계 시 서버 응답을 SelfCheckReportData에 맞춰 넘기면 템플릿 코드는 수정하지 않아도 된다.

export type ReportValue = number | string

export interface ReportYearValue {
  year: string
  value: ReportValue
}

export interface ReductionProject {
  /** 감축사업명. 길면 첫 번째 열 안에서 줄바꿈된다. */
  name: string
  /** reductionEffects.years와 같은 순서의 연도별 감축량 */
  values: ReportValue[]
}

export interface SelfCheckReportData {
  generatedOn: string
  company: {
    /** 보고서 상단 우측에 쓰는 축약 업체명. 생략하면 name을 사용한다. */
    headerName?: string
    name: string
    ceo: string
    businessNumber: string
    corporationNumber: string
    foundedOn: string
    industry: string
    address: string
    sales: ReportYearValue[]
  }
  emissions: {
    years: string[]
    values: ReportValue[]
    average: ReportValue
  }
  reductionEffects: {
    years: string[]
    /** 배열 항목 수만큼 표의 사업 행이 자동으로 늘거나 줄어든다. */
    projects: ReductionProject[]
    /** 생략하면 projects의 각 연도 값을 합산한다. */
    totals?: ReportValue[]
  }
  plan: {
    baselineEmission: ReportValue
    reductionRate: ReportValue
    targetReduction: ReportValue
    expectedReduction: ReportValue
    adequacy: string
  }
  grade: string
}

/** [퍼블리싱 노출용] Figma 결과보고서에 적힌 예시 값 */
export const SELF_CHECK_REPORT_SAMPLE: SelfCheckReportData = {
  generatedOn: "2026.07.28",
  company: {
    headerName: "(주)그린에너지텍",
    name: "주식회사 그린에너지텍",
    ceo: "김탄소",
    businessNumber: "123-45-67890",
    corporationNumber: "110111-1234567",
    foundedOn: "2015-03-15",
    industry: "제조업 (212110)",
    address: "06234 서울특별시 강남구 테헤란로 123 탄소빌딩 5층",
    sales: [
      { year: "2023", value: 12500 },
      { year: "2024", value: 13800 },
      { year: "2025", value: 15200 },
    ],
  },
  emissions: {
    years: ["2023", "2024", "2025"],
    values: [1250, 1180, 1090],
    average: 1173,
  },
  reductionEffects: {
    years: ["2026", "2027", "2028"],
    projects: [
      { name: "고효율 설비 교체 (공조 설비)", values: [45, 45, 45] },
      { name: "고효율 설비 교체 (공조 설비)", values: [30, 32, 32] },
      { name: "법인차량 전기차 전환", values: [8, 10, 12] },
    ],
    totals: [83, 87, 89],
  },
  plan: {
    baselineEmission: 1173,
    reductionRate: 7,
    targetReduction: 82,
    expectedReduction: 89,
    adequacy: "적정",
  },
  grade: "A등급",
}
