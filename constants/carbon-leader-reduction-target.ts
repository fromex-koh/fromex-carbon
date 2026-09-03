// 자가진단 STEP 4(감축목표 설정) 표시 값.
// [퍼블리싱 노출용] 화면에서 계산하지 않는다. 감축잠재량 산정에서 넘어올 자리를
// 고정 값으로 채워 두었고, 실제 데이터를 연결할 때 이 상수를 걷어낸다.

/**
 * (1) 감축사업 기대효과 표의 한 줄.
 * 연도별 값은 사용자가 화면에서 채우므로 여기서는 사업 목록만 들고 있는다.
 */
export interface ExpectedEffectRow {
  no: number
  name: string
}

export const EXPECTED_EFFECT_ROWS: ExpectedEffectRow[] = [
  { no: 1, name: "태양광 발전 설비 도입을 통한 온실가스 감축 사업" },
  { no: 2, name: "태양광 발전 설비 도입을 통한 온실가스 감축 사업" },
  { no: 3, name: "태양광 발전 설비 도입을 통한 온실가스 감축 사업" },
]

/** 감축율 선택지. 기준연도 대비 온실가스 감축 목표율 */
export const REDUCTION_RATES = ["4%", "6%", "8%", "10%"]

/** 3개년 Scope 1+2 총배출량 평균 (자동 산정) */
export const BASE_YEAR_EMISSION = "6,400.9"

/** 감축사업 3차 이행년도 실적 합계 (자동 산정) */
export const EXPECTED_REDUCTION = "172.0"

/**
 * 계획 적정성 판정. 화면 키를 셋으로 갈라 두었다.
 * - none  감축율을 아직 고르지 않아 판정 전
 * - fit   예상 감축량 ≥ 목표 감축량
 * - unfit 예상 감축량 < 목표 감축량
 *
 * [퍼블리싱 노출용] 감축율을 고른다고 아래 값이 따라 바뀌지는 않는다.
 * 화면마다 고정 값을 보여 줄 뿐이고, 연동은 개발에서 붙인다.
 */
export type PlanVerdict = "none" | "fit" | "unfit"

export const PLAN_VERDICT: Record<
  PlanVerdict,
  { label: string; rate: string; targetReduction: string }
> = {
  none: { label: "감축율 선택 필요", rate: "", targetReduction: "-" },
  fit: { label: "적정", rate: "4%", targetReduction: "160.0" },
  unfit: { label: "부적정", rate: "10%", targetReduction: "1,920.3" },
}
