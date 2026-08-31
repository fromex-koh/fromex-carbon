// 선도기업 신청 1차 STEP 1(신청서 작성) 화면의 표시 값.
// [퍼블리싱 노출용] 회원정보·자가진단에서 넘어올 자리를 고정 값으로 채워 두었다.
// 실제 데이터를 연결할 때 이 상수를 걷어낸다.

/** 신청 1차 상단 Stepper 4단계. 모바일 StepMobileNav 도 같은 개수를 쓴다. */
export const APPLICATION_STEPS = ["1차신청", "서류제출", "최종확인", "제출완료"]

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

/** 처음에는 한 줄만 보여 준다. 행 추가하기로 늘어날 자리다. */
export const INVESTMENT_ROW_COUNT = 1
