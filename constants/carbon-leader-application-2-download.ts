import {
  APPLICATION_DOWNLOAD_SAMPLE,
  type ApplicationAttachmentGroup,
  type ApplicationDownloadData,
  type ApplicationInvestment,
  type ApplicationReportValue,
} from "@/constants/carbon-leader-application-download";

// 탄소중립 선도기업 2차 신청서 PDF의 데이터 모양.
// API 응답을 이 타입으로 변환해 SecondApplicationDownloadButton의 data prop으로 넘긴다.
export interface ApplicationAdoption {
  tech: string;
  facility: string;
  introducedOn: string;
  amount: ApplicationReportValue;
}

export interface ApplicationSecondDownloadData extends Omit<
  ApplicationDownloadData,
  "investments" | "attachments"
> {
  /** 입력 행 수에 따라 표와 A4 페이지가 자동으로 늘어난다. */
  investments: ApplicationInvestment[];
  /** 입력 행 수에 따라 투자계획 뒤에 이어지고 부족하면 다음 A4 페이지로 넘어간다. */
  adoptions: ApplicationAdoption[];
  /** 그룹과 파일 수에 따라 별도 A4 페이지가 자동으로 늘어난다. */
  attachments: ApplicationAttachmentGroup[];
}

/** [퍼블리싱 노출용] Figma 2차 신청서 예시 데이터 */
export const APPLICATION_SECOND_DOWNLOAD_SAMPLE: ApplicationSecondDownloadData = {
  ...APPLICATION_DOWNLOAD_SAMPLE,
  investments: [
    {
      tech: "고효율 설비교체",
      facility: "고효율 LED 조명 교체",
      period: "2026-03-01 ~ 2026-09-30",
      amount: 150000,
      reduction: 12.5,
    },
    {
      tech: "재생에너지 도입",
      facility: "태양광 발전 설비",
      period: "2026-06-01 ~ 2027-03-31",
      amount: 300000,
      reduction: 45.2,
    },
    {
      tech: "공정 최적화",
      facility: "에너지 효율화 시스템",
      period: "2027-01-01 ~ 2027-12-31",
      amount: 250000,
      reduction: 28.3,
    },
    {
      tech: "차량 전환",
      facility: "전기차 도입 (업무용)",
      period: "2027-06-01 ~ 2028-06-30",
      amount: 200000,
      reduction: 8.4,
    },
  ],
  adoptions: [
    {
      tech: "고효율 설비교체",
      facility: "고효율 인버터 컴프레서",
      introducedOn: "2025-08-15",
      amount: 150000,
    },
    {
      tech: "재생에너지 도입",
      facility: "태양광 자가발전 설비(50kW)",
      introducedOn: "2026-01-20",
      amount: 300000,
    },
  ],
  attachments: [
    {
      title: "기업정보",
      files: [
        {
          name: "법인등기부등본_사업자등록증_그린에너지텍.pdf",
          size: "1.2 MB",
        },
      ],
    },
    {
      title: "감축계획 실행서류",
      files: [
        { name: "도입설비_견적서_계약서_그린에너지텍.pdf", size: "1.2 MB" },
        { name: "중소기업확인서_그린에너지텍_2026.pdf", size: "1.2 MB" },
      ],
    },
  ],
};
