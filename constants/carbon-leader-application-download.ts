// 탄소중립 선도기업 1차 신청서 PDF의 데이터 모양.
// 프론트 연계 시 API 응답을 ApplicationDownloadData에 맞춰 data prop 하나로 넘긴다.

export type ApplicationReportValue = number | string;

export interface ApplicationInvestment {
  tech: string;
  facility: string;
  period: string;
  amount: ApplicationReportValue;
  reduction: ApplicationReportValue;
}

export interface ApplicationAttachmentFile {
  name: string;
  size: string;
}

export interface ApplicationAttachmentGroup {
  title: string;
  files: ApplicationAttachmentFile[];
}

export interface ApplicationDownloadData {
  generatedOn: string;
  company: {
    /** 문서 상단 우측에 쓰는 축약 업체명. 생략하면 name을 사용한다. */
    headerName?: string;
    name: string;
    ceo: string;
    businessNumber: string;
    corporationNumber: string;
    address: string;
    ceoPhone: string;
    email: string;
    foundedOn: string;
    industry: string;
    industryCode: string;
    mainProduct: string;
    annualProduction: string;
  };
  manager: {
    name: string;
    department: string;
    officePhone: string;
    fax: string;
    email: string;
    mobile: string;
  };
  baseline: {
    years: string[];
    sales: ApplicationReportValue[];
    emissions: ApplicationReportValue[];
    standardYear: string;
    averageEmissions: ApplicationReportValue;
  };
  reductionPlan: {
    years: string[];
    investments: ApplicationReportValue[];
    targets: ApplicationReportValue[];
  };
  /** 배열 길이에 따라 15행씩 다음 A4 페이지로 자동 분리된다. */
  investments: ApplicationInvestment[];
  /** 그룹과 파일 수에 따라 마지막 투자계획 장 또는 다음 장으로 자동 분리된다. */
  attachments: ApplicationAttachmentGroup[];
}

/** [퍼블리싱 노출용] 신청서 작성·최종확인 화면과 같은 예시 값 */
export const APPLICATION_DOWNLOAD_SAMPLE: ApplicationDownloadData = {
  generatedOn: "2026.07.28",
  company: {
    headerName: "(주)그린에너지텍",
    name: "주식회사 그린에너지텍",
    ceo: "김탄소",
    businessNumber: "123-45-67890",
    corporationNumber: "110111-1234567",
    address: "06234 서울특별시 강남구 테헤란로 123 탄소빌딩 5층",
    ceoPhone: "02-1234-5678",
    email: "ceo@green-energytech.co.kr",
    foundedOn: "2015-03-15",
    industry: "제조업",
    industryCode: "212110",
    mainProduct: "친환경 단열재, 탄소저감 건자재",
    annualProduction: "5,000 ton",
  },
  manager: {
    name: "이환경",
    department: "환경안전팀 / 과장",
    officePhone: "02-1234-5679",
    fax: "02-1234-5680",
    email: "manager@green-energytech.co.kr",
    mobile: "010-9876-5432",
  },
  baseline: {
    years: ["2023", "2024", "2025"],
    sales: [15000000, 15000000, 15000000],
    emissions: [450.5, 450.5, 450.5],
    standardYear: "2023년",
    averageEmissions: 432.17,
  },
  reductionPlan: {
    years: ["2023", "2024", "2025"],
    investments: [500000, 800000, 1200000],
    targets: ["3.0%", "6.5%", "10.0%"],
  },
  investments: [
    {
      tech: "고효율 설비교체",
      facility: "고효율 LED 조명 교체",
      period: "2026.03~2026.09",
      amount: 150000,
      reduction: 12.5,
    },
    {
      tech: "재생에너지 도입",
      facility: "태양광 발전 설비",
      period: "2026.06~2027.03",
      amount: 300000,
      reduction: 45.2,
    },
    {
      tech: "공정 최적화",
      facility: "에너지 효율화 시스템",
      period: "2027.01~2027.12",
      amount: 250000,
      reduction: 28.3,
    },
    {
      tech: "차량 전환",
      facility: "전기차 도입 (업무용)",
      period: "2027.06~2028.06",
      amount: 200000,
      reduction: 8.4,
    },
  ],
  attachments: [
    {
      title: "기업정보",
      files: [
        { name: "법인등기부등본_사업자등록증_그린에너지텍.pdf", size: "1.2 MB" },
        { name: "법인등기부등본_사업자등록증_그린에너지텍.pdf", size: "1.2 MB" },
        { name: "법인등기부등본_사업자등록증_그린에너지텍.pdf", size: "1.2 MB" },
        { name: "법인등기부등본_사업자등록증_그린에너지텍.pdf", size: "1.2 MB" },
      ],
    },
    {
      title: "인벤토리 증빙서류",
      files: [
        { name: "도시가스요금고지서_2023-2025.pdf", size: "1.2 MB" },
        { name: "도시가스요금고지서_2023-2025.pdf", size: "1.2 MB" },
      ],
    },
  ],
};
