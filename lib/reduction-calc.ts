// 자가진단 STEP 3 감축잠재량 산정 — ④ 값을 만드는 곳.
// 화면(business-detail.tsx)은 여기서 돌려주는 ResultValues 만 그린다.
// 방법론별 수식은 computeResults 본문에만 넣으면 되고, 화면은 손대지 않는다.
//
// 수식 옮기기
//   cells 키      기획 사이트 엑셀의 셀 참조 그대로 (D20 · G20 · L21 …)
//   결과 키       rowKey · computeKey (carbon-leader-reduction-schema)
//   U3 · V3 · AA3  1차년도 산정 개월수 → firstYearMonths(basics.startedOn)
//   L4            투자비 → basics.investment · L2x 제품수명 → basics.lifetime
//   전력배출계수     POWER_EMISSION_FACTOR · 연료표 값  fuelSpecOf
//
// 배출계수 다섯 칸만 키가 엑셀과 다르다. ③ 배출계수와 데이터 근거의 스팀 배출계수는
// 값이 서로 이어지는 한 칸이라 키를 L21 · L22 로 합쳤다(= cells.D21 은 없다).
//   고효율설비(5) · 폐열(A) · 연료전환(3)   D21 → L21 · G21 → L22
//   연료전환(2)  G21 → L21        기타(3)  G22 → L21
// 그 밖의 칸은 엑셀 셀 참조를 그대로 쓴다.

import {
  computeKey,
  POWER_EMISSION_FACTOR,
  rowKey,
  type MethodologySchema,
  type ResultValues,
} from "@/constants/carbon-leader-reduction-schema"

/** 카드 ① 기본정보 · 데이터 근거에서 넘어오는 값 */
export interface ReductionBasics {
  /** 투자비(백만원). 수식의 L4 */
  investment: string
  /** 운전개시일. 비어 있으면 1차년도를 12개월로 본다 */
  startedOn?: Date
  /** 제품수명(년). 수식의 L2x */
  lifetime?: number
}

/** 1차년도 산정 개월수. 운전개시월부터 그 해 12월까지다(6월 개시 → 7개월) */
export const firstYearMonths = (startedOn?: Date) =>
  startedOn ? 12 - startedOn.getMonth() : 12

/**
 * ④ 아래 안내 문구. 기획 사이트의 공통 형식을 따른다 —
 * "1차년도 N개월 (M월 운전개시) · 2/3차년도 12개월 · 전력배출계수 0.45941 tCO₂e/MWh · 투자비 N백만원 · 제품수명 N년".
 * 운전개시일이 비어 있으면 12개월로 두고 그렇게 적는다. 제품수명이 없는 방법론(기타)은 그 마디를 뺀다.
 */
export const resultHintOf = (basics: ReductionBasics) => {
  const months = firstYearMonths(basics.startedOn)
  const start = basics.startedOn
    ? `${basics.startedOn.getMonth() + 1}월 운전개시`
    : "운전개시일 미입력"
  const parts = [
    `1차년도 ${months}개월 (${start})`,
    "2/3차년도 12개월",
    `전력배출계수 ${POWER_EMISSION_FACTOR} tCO₂e/MWh`,
    `투자비 ${basics.investment.trim() || "-"}백만원`,
  ]
  if (basics.lifetime !== undefined) parts.push(`제품수명 ${basics.lifetime}년`)
  return parts.join(" · ")
}

/** 시안에 적힌 "3,000" · "-192" 같은 표기를 숫자로. 값이 아니면 undefined */
const parseSample = (text?: string) => {
  const trimmed = (text ?? "").replace(/,/g, "").trim()
  if (!trimmed || trimmed === "-" || trimmed === "—") return undefined
  const value = Number(trimmed)
  return Number.isFinite(value) ? value : undefined
}

/**
 * ④ 의 값을 만든다.
 *
 * [퍼블리싱 노출용] 아직 수식이 없다. ③ 이 다 찼을 때(complete)만 스키마의 시안 수치를
 * 돌려주고, 시안 수치가 없는 방법론은 산출 전(—)으로 남긴다. 화면이 두 상태를 모두
 * 그릴 수 있는지 보려고 둔 자리이므로, 개발 시 이 본문을 수식으로 통째로 바꾼다.
 */
export const computeResults = (
  schema: MethodologySchema,
  cells: Record<string, string>,
  basics: ReductionBasics,
  options: { complete?: boolean } = {},
): ResultValues => {
  void cells
  void basics
  if (!options.complete) return {}

  const results: ResultValues = {}
  for (const row of schema.computeRows) {
    results[computeKey(row, "before")] = parseSample(row.sampleBefore)
    results[computeKey(row, "after")] = parseSample(row.sampleAfter)
  }
  for (const item of schema.resultItems) {
    results[rowKey(item)] = parseSample(item.sample)
  }
  return results
}
