// 선도기업 신청 1차 STEP 1(신청서 작성) 화면의 표시 값.
// [퍼블리싱 노출용] 회원정보·자가진단에서 넘어올 자리를 고정 값으로 채워 두었다.
// 실제 데이터를 연결할 때 이 상수를 걷어낸다.

/** 신청 1차 상단 Stepper 4단계. 모바일 StepMobileNav 도 같은 개수를 쓴다. */
export const APPLICATION_STEPS = ["1차신청", "서류제출", "최종확인", "제출완료"]

/**
 * 신청 3차 상단 Stepper 6단계. 1·2차와 달리 인벤토리 배출량·목표달성 평가가 앞에 붙는다.
 * 3차 화면들(인벤토리 배출량 산정 · 목표달성 평가)이 이 배열 하나를 같이 본다.
 */
export const APPLICATION_THIRD_STEPS = [
  "3차신청",
  "인벤토리 배출량",
  "목표달성평가",
  "서류제출",
  "최종확인",
  "제출완료",
]

/** 표 한 칸에 들어가는 입력. unit 은 칸 오른쪽에 붙는 단위다. */
export interface YearField {
  /** 열 이름. 표 헤더이자 좁은 화면에서는 칸 위 이름표가 된다 */
  column: string
}

/** (4) 탄소중립 기준연도 현황 · (5) 탄소감축계획 표의 한 줄 */
export interface PlanRow {
  label: string
  /** 이름표 옆 괄호 단위. 좁은 화면에서는 줄 오른쪽에 붙는다 */
  unit: string
  /** 칸 오른쪽에 붙는 단위 */
  suffix: string
}

/** (4) 기준연도 현황 — 3개년 열 */
export const BASE_YEAR_COLUMNS = ["1년차도", "2년차도", "3년차도"]

export const BASE_YEAR_ROWS: PlanRow[] = [
  { label: "총매출액", unit: "(천원)", suffix: "원" },
  { label: "온실가스배출량", unit: "(tCO₂eq)", suffix: "tCO₂eq" },
]

/** (5) 탄소감축계획 — 3개년 열 */
export const REDUCTION_PLAN_COLUMNS = ["2026년", "2027년", "2028년"]

export const REDUCTION_PLAN_ROWS: PlanRow[] = [
  { label: "탄소감축투자 계획금액", unit: "(천원)", suffix: "원" },
  // 시안은 이 줄만 칸 오른쪽 단위가 없다. 단위는 이름표 괄호에만 적힌다.
  { label: "탄소중립 목표", unit: "(기준연도 대비감축, %)", suffix: "" },
]

/** (6) 향후 3년간 탄소중립 투자계획 표의 칸 정의 */
export interface InvestmentColumn {
  key: string
  label: string
  placeholder: string
  /** 칸 오른쪽에 붙는 단위 */
  suffix?: string
}

export const INVESTMENT_COLUMNS: InvestmentColumn[] = [
  { key: "tech", label: "감축기술", placeholder: "감축기술명" },
  { key: "facility", label: "감축설비명", placeholder: "설비명 입력" },
  { key: "amount", label: "투자금 (천원)", placeholder: "0", suffix: "원" },
  {
    key: "reduction",
    // 칸 오른쪽 단위와 같이 tCO₂eq 다. PC 시안의 (천원) 은 위 줄에서 복사된 오기다
    label: "온실가스감축량 (tCO₂eq)",
    placeholder: "0",
    suffix: "tCO₂eq",
  },
]

/**
 * (6) 표의 한 줄.
 * 감축기술·설비명·투자금·감축량은 감축잠재량 산정에서 넘어오는 값이라 읽기 전용이고,
 * 사업기간(시작일·종료일)만 사용자가 이 화면에서 채운다.
 */
export interface InvestmentRow {
  /**
   * 서버가 주는 투자계획 식별자. 칸 이름과 React key 에 함께 쓴다.
   * 칸 이름이 investment-<code>-start 꼴이라 코드에는 하이픈을 넣지 않는다.
   */
  code: string
  tech: string
  facility: string
  /** 천원 단위 */
  amount: string
  /** tCO₂eq 단위 */
  reduction: string
  /**
   * 1차에서 받아 둔 사업기간.
   * 2차 신청서는 이 카드를 통째로 읽기 전용으로 보여 주므로 그때만 쓴다.
   */
  period: string
}

/**
 * [퍼블리싱 노출용] 서버에서 내려올 자리를 대신하는 목업이다.
 * 연계할 때 이 배열을 서버 응답으로 갈아 끼우면 표가 그대로 그려진다.
 */
export const INVESTMENT_ROWS: InvestmentRow[] = [
  {
    code: "IP001",
    period: "2026-03-01 ~ 2026-09-30",
    tech: "고효율 전동기 교체",
    facility: "송풍기 전동기 3호기",
    amount: "120,000",
    reduction: "48.20",
  },
  {
    code: "IP002",
    period: "2026-06-01 ~ 2027-03-31",
    tech: "폐열 회수 설비 도입",
    facility: "건조로 폐열회수기",
    amount: "350,000",
    reduction: "132.75",
  },
  {
    code: "IP003",
    period: "2027-01-01 ~ 2027-12-31",
    tech: "태양광 발전 설비 도입",
    facility: "공장동 옥상 태양광",
    amount: "480,000",
    reduction: "172.00",
  },
]

/** 2차 신청서 (7) 감축기술 도입현황 표의 칸 정의 */
export const ADOPTION_COLUMNS: InvestmentColumn[] = [
  { key: "tech", label: "감축기술", placeholder: "예) 고효율 설비교체" },
  { key: "facility", label: "감축설비명", placeholder: "예) 고효율 LED 조명" },
  { key: "amount", label: "투자금 (천원)", placeholder: "0", suffix: "원" },
]

/** 처음에는 한 줄만 보여 준다. 행 추가하기로 늘어날 자리다. */
export const ADOPTION_ROW_COUNT = 1
