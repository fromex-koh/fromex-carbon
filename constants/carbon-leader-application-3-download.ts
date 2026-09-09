import {
  APPLICATION_SECOND_DOWNLOAD_SAMPLE,
  type ApplicationSecondDownloadData,
} from "@/constants/carbon-leader-application-2-download";

/**
 * [API 매핑 핵심] 백엔드 평가기준 코드를 아래 criterion 네 값 중 하나로 변환한다.
 * criterion이 정해지면 해당 분기에 필요한 수치만 넣고, 달성 여부는 achieved로 넣는다.
 * PDF 템플릿은 이 객체를 읽어 카드의 항목 수·레이블·달성/미달성 색을 자동 결정한다.
 */
export type ApplicationThirdEvaluation =
  | {
      criterion: "absolute";
      baselineAverage: string;
      finalEmission: string;
      reductionRate: string;
      targetRate: string;
      achieved: boolean;
    }
  | {
      criterion: "intensity";
      baselineIntensity: string;
      finalIntensity: string;
      reductionRate: string;
      targetRate: string;
      achieved: boolean;
    }
  | {
      criterion: "reduction";
      baselineAverage: string;
      averageReduction: string;
      evaluationRate: string;
      targetRate: string;
      achieved: boolean;
    }
  | {
      criterion: "target-management";
      allowance: string;
      actualEmission: string;
      achieved: boolean;
    };

// 탄소중립 선도기업 3차 신청서 PDF의 API 연계 타입.
// 배열 필드는 페이지가 자동 증감하고 evaluation은 criterion으로 안전하게 분기한다.
export interface ApplicationThirdDownloadData extends ApplicationSecondDownloadData {
  inventory: {
    years: string[];
    emissions: Array<number | string>;
  };
  evaluation: ApplicationThirdEvaluation;
}

const THIRD_BASE: Omit<ApplicationThirdDownloadData, "evaluation"> = {
  ...APPLICATION_SECOND_DOWNLOAD_SAMPLE,
  adoptions: [
    {
      tech: "고효율 설비교체",
      facility: "고효율 인버터 컴프레서",
      introducedOn: "2025-08-15",
      amount: 120000,
    },
    {
      tech: "재생에너지 도입",
      facility: "태양광 자가발전 설비(50kW)",
      introducedOn: "2026-01-20",
      amount: 280000,
    },
    {
      tech: "공정 최적화",
      facility: "폐열 회수 시스템",
      introducedOn: "2026-07-10",
      amount: 190000,
    },
  ],
  inventory: {
    years: ["1차년도 (2021)", "2차년도 (2022)", "3차년도 (2023)"],
    emissions: [430, 400, 370],
  },
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
      title: "인벤토리 증빙서류",
      files: [
        { name: "도시가스요금고지서_1-3차년도.pdf", size: "1.2 MB" },
        { name: "법인차량_유류구매내역_1-3차년도.pdf", size: "1.2 MB" },
      ],
    },
    {
      title: "감축계획 실행서류",
      files: [{ name: "도입설비_견적서_계약서_그린에너지텍.pdf", size: "1.2 MB" }],
    },
  ],
};

/** 퍼블리싱 확인 화면과 프론트 연계 예시에 쓰는 평가 케이스 모음 */
export const APPLICATION_THIRD_EVALUATION_CASES = {
  absoluteAchieved: {
    criterion: "absolute",
    baselineAverage: "480 tCO₂eq",
    finalEmission: "370 tCO₂eq",
    reductionRate: "22.9%",
    targetRate: "10%",
    achieved: true,
  },
  absoluteUnmet: {
    criterion: "absolute",
    baselineAverage: "480 tCO₂eq",
    finalEmission: "465 tCO₂eq",
    reductionRate: "3.1%",
    targetRate: "10%",
    achieved: false,
  },
  intensityAchieved: {
    criterion: "intensity",
    baselineIntensity: "0.042 tCO₂eq/TON",
    finalIntensity: "0.027 tCO₂eq/TON",
    reductionRate: "34.3%",
    targetRate: "10%",
    achieved: true,
  },
  reductionAchieved: {
    criterion: "reduction",
    baselineAverage: "480 tCO₂eq",
    averageReduction: "80 tCO₂eq",
    evaluationRate: "16.7%",
    targetRate: "10%",
    achieved: true,
  },
  targetManagementAchieved: {
    criterion: "target-management",
    allowance: "380 tCO₂eq",
    actualEmission: "370 tCO₂eq",
    achieved: true,
  },
} satisfies Record<string, ApplicationThirdEvaluation>;

/** [퍼블리싱 기본값] 절대배출량 기준 달성 케이스 */
export const APPLICATION_THIRD_DOWNLOAD_SAMPLE: ApplicationThirdDownloadData = {
  ...THIRD_BASE,
  evaluation: APPLICATION_THIRD_EVALUATION_CASES.absoluteAchieved,
};

export const buildThirdApplicationCase = (
  evaluation: ApplicationThirdEvaluation,
): ApplicationThirdDownloadData => ({ ...THIRD_BASE, evaluation });
