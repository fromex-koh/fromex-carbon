// 자가진단 STEP 3 감축잠재량 산정의 방법론별 화면 정의.
// 기획 사이트의 20개 방법론 시트를 담는다. 값은 계산하지 않는다 —
// 시안(case1~4)에 수치가 적힌 네 가지는 그 수치를, 나머지는 산출 전 상태(—)를 보여준다.
//
// 연료 드롭다운을 고르면 배출계수·순발열량·총발열량 리드온리 칸이 연료표 값을 따라가고,
// 라벨·단위의 {fuel} · {fuelUnit} 토큰은 개선전에서 고른 연료 이름·단위로 바뀐다.

/** 연료 드롭다운 종류. A 는 일반 연료 10종, B 는 전기차 방법론 전용 차량 연료다 */
export type FuelSet = "A" | "B"

/** 연료표에서 리드온리 칸에 넣을 값. 배출계수 · 순발열량 · 총발열량 */
export type FuelLookup = "ef" | "ncv" | "gcv"

export interface FuelSpec {
  unit: string
  /** 총발열량 MJ/단위 */
  gcv: number
  /** 순발열량 MJ/단위 */
  ncv: number
  /** 배출계수 tCO₂e/TJ */
  ef: number
}

/** 입력표·근거표·결과표의 한 줄 */
export interface SchemaRow {
  key?: string
  label?: string
  unit?: string
  /** 입력 상태를 담는 키. 시안의 셀 참조를 그대로 쓴다 */
  cellRef?: string
  cellRefBefore?: string
  cellRefAfter?: string
  rowType?: string
  isLifetime?: boolean
  fixedValue?: number
  /** 데이터 근거 출처 입력의 안내 문구(시안) */
  placeholder?: string
  /** 개선전·개선후 칸의 안내 문구(시안) */
  placeholderBefore?: string
  placeholderAfter?: string
  /** 시안에서 개선전 칸이 비어 있는 행 */
  afterOnly?: boolean
  /** 시안 ③ 에 그려지지 않은 행 */
  hidden?: boolean
  /** 연료 드롭다운의 고정 표기 */
  beforeValue?: string
  afterValue?: string
  /** 시안에 적힌 값. 읽기 전용 칸과 ④ 표에 그대로 보여준다 */
  sampleBefore?: string
  sampleAfter?: string
  sample?: string
  /** 연료 드롭다운의 선택지 묶음. 비우면 A 형 */
  fuelSet?: FuelSet
  /** 기획 사이트에서 개선후 칸이 비어 있는 행(회색 빈 셀) */
  beforeOnly?: boolean
  /** 같은 쪽 연료 드롭다운의 연료표 값을 보여주는 리드온리 칸 */
  lookupBefore?: FuelLookup
  lookupAfter?: FuelLookup
  /** 고정값 리드온리 칸(목제펠릿 순발열량 15.6 등) */
  fixedValueBefore?: string
  fixedValueAfter?: string
  /** 개선후 칸이 개선전 입력값을 그대로 따라가는 리드온리(연료 단가 =D24) */
  mirrorAfter?: boolean
  /** 입력값이 다른 칸(데이터 근거의 스팀 배출계수)과 이어진 리드온리 칸 */
  readOnlyBefore?: boolean
  readOnlyAfter?: boolean
  /** 기획 사이트의 초기값. 비어 있으면 이 값을 채워 둔 것으로 본다 */
  defaultBefore?: string
  defaultAfter?: string
}

/** 감축방법론 한 건 */
export interface MethodologySchema {
  /** 표 제목에 쓰는 엑셀 시트 이름 */
  sheetName: string
  methodologyName: string
  /** 연료 선택 드롭다운 */
  dropdowns: SchemaRow[]
  /** 개선전·개선후 입력칸 */
  inputRows: SchemaRow[]
  /** 데이터 근거 표 */
  basisRows: SchemaRow[]
  /** ④ 왼쪽 개선전·개선후 표 */
  computeRows: SchemaRow[]
  /** ④ 오른쪽 연차별 표 · 경제성 지표 */
  resultItems: SchemaRow[]
  /** 개선전 한 칸만 입력받는 방법론(폐열회수 · 전기차) */
  singleColumn?: boolean
  /** 한 칸 표의 값 열 이름. 비우면 '값 입력'. 전기차는 '차량전환' */
  singleColumnLabel?: string
}

// ── 새 방법론 정의를 짧게 적기 위한 생성기. 기존 네 건은 시안 수치가 있어 그대로 둔다 ──

/** 개선전·개선후 직접입력 한 줄. after 를 비우면 한 칸 표(폐열B · 전기차)의 줄이다 */
const cell = (
  label: string,
  unit: string,
  before: string,
  after?: string,
  placeholderBefore?: string,
  placeholderAfter?: string,
): SchemaRow => ({
  key: label.replace(/\s+/g, "_"),
  label,
  unit,
  cellRefBefore: before,
  cellRefAfter: after,
  placeholderBefore,
  placeholderAfter,
})

/** 연료표 값을 보여주는 리드온리 줄 */
const lookup = (
  label: string,
  unit: string,
  before: string,
  after: string | undefined,
  what: FuelLookup,
): SchemaRow => ({
  key: label.replace(/\s+/g, "_"),
  label,
  unit,
  cellRefBefore: before,
  cellRefAfter: after,
  lookupBefore: what,
  lookupAfter: after ? what : undefined,
})

/** 스팀 배출계수 입력 줄. 데이터 근거의 같은 칸(L21 · L22)과 값을 공유한다 */
const steamCell = (
  label: string,
  before: string,
  after: string,
  defaultBefore: string,
  defaultAfter: string,
): SchemaRow => ({
  key: label.replace(/\s+/g, "_"),
  label,
  unit: "tCO2e",
  cellRefBefore: before,
  cellRefAfter: after,
  defaultBefore,
  defaultAfter,
})

/** 연료 드롭다운 줄. 연료표에 없는 이름(스팀 · 태양열 …)은 고정 표기가 된다 */
const fuel = (
  label: string,
  before: string,
  after: string,
  beforeValue: string,
  afterValue: string,
): SchemaRow => ({
  key: label.replace(/\s+/g, "_"),
  label,
  cellRefBefore: before,
  cellRefAfter: after,
  beforeValue,
  afterValue,
})

const source = (label: string): SchemaRow => ({
  key: label.replace(/\s+/g, "_"),
  label,
  rowType: "source",
})

const lifetime = (years: number, cellRef: string): SchemaRow => ({
  key: "제품수명",
  label: "제품수명",
  rowType: "lifetime",
  isLifetime: true,
  fixedValue: years,
  unit: "년",
  cellRef,
})

const steamEf = (label: string, cellRef: string, value: number): SchemaRow => ({
  key: label.replace(/\s+/g, "_"),
  label,
  rowType: "steam-ef",
  fixedValue: value,
  unit: "tCO2e/GJ",
  cellRef,
  placeholder: "배출계수 근거 (자체계산, 환경부고시 등)",
})

/** ④ 왼쪽 표 한 줄. 값이 없어 산출 전(—)으로 그려진다 */
const compute = (label: string, unit: string): SchemaRow => ({ label, unit })

/** ④ 왼쪽 표의 1~3차년도 줄 */
const yearlyEmission = (name: string, unit: string): SchemaRow[] =>
  [1, 2, 3].map((year) => compute(`${year}차년도 ${name}`, unit))

/** ④ 오른쪽 연차별 표 한 항목(1~3차년도). 라벨은 '{n}차년도 이름' 꼴이어야 표로 묶인다 */
const yearly = (name: string, unit: string): SchemaRow[] =>
  [1, 2, 3].map((year) => ({
    key: `${year}차년도_${name.replace(/\s+/g, "_")}`,
    label: `${year}차년도 ${name}`,
    unit,
  }))

/** 경제성 지표(한계비용) 한 건 */
const marginal = (): SchemaRow => ({
  key: "1차년도_한계비용",
  label: "1차년도 한계비용",
  unit: "백만원/tCO2e",
})

export const REDUCTION_SCHEMA: MethodologySchema[] = [
  {
    sheetName: "태양광발전",
    methodologyName: "태양광 발전",
    dropdowns: [],
    inputRows: [
      {
        key: "태양광발전량",
        label: "태양광발전량",
        unit: "KWh",
        cellRefBefore: "D20",
        cellRefAfter: "G20",
        placeholderAfter: "3,000",
      },
      {
        key: "전기_단가",
        label: "전기 단가",
        unit: "원",
        cellRefBefore: "D21",
        cellRefAfter: "G21",
        placeholderBefore: "120",
        placeholderAfter: "120",
      },
    ],
    basisRows: [
      {
        key: "발전량",
        label: "발전량",
        rowType: "source",
      },
      {
        key: "제품수명",
        label: "제품수명",
        rowType: "lifetime",
        isLifetime: true,
        fixedValue: 8,
        unit: "년",
        cellRef: "L21",
      },
    ],
    computeRows: [
      {
        label: "발전량",
        unit: "KWh",
        sampleBefore: "-",
        sampleAfter: "3,000",
      },
      {
        label: "배출계수",
        unit: "tCO2e/MWh",
        sampleBefore: "-",
        sampleAfter: "-",
      },
      {
        label: "1차년도 온실가스 배출량",
        unit: "tCO2e/년",
        sampleBefore: "17",
        sampleAfter: "-",
      },
      {
        label: "2차년도 온실가스 배출량",
        unit: "tCO2e/년",
        sampleBefore: "17",
        sampleAfter: "-",
      },
      {
        label: "3차년도 온실가스 배출량",
        unit: "tCO2e/년",
        sampleBefore: "17",
        sampleAfter: "-",
      },
    ],
    resultItems: [
      {
        key: "1차년도_전력_절감량",
        label: "1차년도 전력 절감량",
        unit: "KWh",
        sample: "36,000",
      },
      {
        key: "1차년도_절감금액",
        label: "1차년도 절감금액",
        unit: "백만원",
        sample: "4.320",
      },
      {
        key: "2차년도_전력_절감량",
        label: "2차년도 전력 절감량",
        unit: "KWh",
        sample: "36,000",
      },
      {
        key: "2차년도_절감금액",
        label: "2차년도 절감금액",
        unit: "백만원",
        sample: "4.320",
      },
      {
        key: "3차년도_전력_절감량",
        label: "3차년도 전력 절감량",
        unit: "KWh",
        sample: "36,000",
      },
      {
        key: "3차년도_절감금액",
        label: "3차년도 절감금액",
        unit: "백만원",
        sample: "4.320",
      },
      {
        key: "1차년도_온실가스_감축량",
        label: "1차년도 온실가스 감축량",
        unit: "tCO2e/년",
        sample: "17",
      },
      {
        key: "1차년도_한계비용",
        label: "1차년도 한계비용",
        unit: "백만원/tCO2e",
        sample: "0.265",
      },
      {
        key: "2차년도_온실가스_감축량",
        label: "2차년도 온실가스 감축량",
        unit: "tCO2e/년",
        sample: "17",
      },
      {
        key: "3차년도_온실가스_감축량",
        label: "3차년도 온실가스 감축량",
        unit: "tCO2e/년",
        sample: "17",
      },
    ],
  },
  {
    sheetName: "기타(3)",
    methodologyName: "스팀사용시설 기타 공정개선",
    dropdowns: [
      {
        key: "연료유형",
        label: "연료유형",
        cellRefBefore: "D20",
        cellRefAfter: "G20",
        beforeValue: "스팀",
        afterValue: "스팀",
      },
    ],
    inputRows: [
      {
        key: "스팀사용량",
        label: "스팀사용량",
        unit: "GJ/",
        cellRefBefore: "D21",
        cellRefAfter: "G21",
        placeholderBefore: "50",
        placeholderAfter: "40",
      },
      {
        key: "배출계수",
        label: "배출계수",
        unit: "tCO2e",
        cellRefBefore: "D22",
        // 개선후는 데이터 근거의 스팀 배출계수(L21)와 값을 주고받는다
        cellRefAfter: "L21",
        afterOnly: true,
        defaultAfter: "0.0413",
      },
      {
        key: "가동시간",
        label: "가동시간",
        unit: "hr/",
        cellRefBefore: "D23",
        cellRefAfter: "G23",
        afterOnly: true,
        placeholderAfter: "150",
      },
      {
        key: "연료_단가",
        label: "연료 단가",
        unit: "원/",
        cellRefBefore: "D24",
        cellRefAfter: "G24",
        afterOnly: true,
        placeholderAfter: "750",
      },
    ],
    basisRows: [
      {
        key: "스팀사용량",
        label: "스팀사용량",
        rowType: "source",
      },
      steamEf("스팀 배출계수", "L21", 0.0413),
      {
        key: "가동시간",
        label: "가동시간",
        rowType: "source",
      },
    ],
    computeRows: [
      {
        label: "스팀 사용량(월)",
        unit: "GJ",
        sampleBefore: "7,000",
        sampleAfter: "6,000",
      },
      {
        label: "1차년도 온실가스 배출량",
        unit: "tCO2e",
        sampleBefore: "2,168",
        sampleAfter: "1,735",
      },
      {
        label: "2차년도 온실가스 배출량",
        unit: "tCO2e",
        sampleBefore: "3,717",
        sampleAfter: "2,974",
      },
      {
        label: "3차년도 온실가스 배출량",
        unit: "tCO2e",
        sampleBefore: "3,717",
        sampleAfter: "2,974",
      },
    ],
    resultItems: [
      {
        key: "1차년도_스팀_절감량",
        label: "1차년도 스팀 절감량",
        unit: "GJ",
        sample: "10,500",
      },
      {
        key: "1차년도_스팀_절감금액",
        label: "1차년도 스팀 절감금액",
        unit: "백만원",
        sample: "7.875",
      },
      {
        key: "2차년도_스팀_절감량",
        label: "2차년도 스팀 절감량",
        unit: "GJ",
        sample: "18,000",
      },
      {
        key: "2차년도_스팀_절감금액",
        label: "2차년도 스팀 절감금액",
        unit: "백만원",
        sample: "13.500",
      },
      {
        key: "3차년도_스팀_절감량",
        label: "3차년도 스팀 절감량",
        unit: "GJ",
        sample: "18,000",
      },
      {
        key: "3차년도_스팀_절감금액",
        label: "3차년도 스팀 절감금액",
        unit: "백만원",
        sample: "13.500",
      },
      {
        key: "1차년도_온실가스_감축량",
        label: "1차년도 온실가스 감축량",
        unit: "tCO2e/년",
        sample: "434",
      },
      {
        key: "1차년도_한계비용",
        label: "1차년도 한계비용",
        unit: "백만원/tCO2e",
        sample: "0.094",
      },
      {
        key: "2차년도_온실가스_감축량",
        label: "2차년도 온실가스 감축량",
        unit: "tCO2e/년",
        sample: "743",
      },
      {
        key: "3차년도_온실가스_감축량",
        label: "3차년도 온실가스 감축량",
        unit: "tCO2e/년",
        sample: "743",
      },
    ],
  },
  {
    sheetName: "연료전환(1)",
    methodologyName: "고탄소 화석연료에서 저탄소 화석연료로의 전환",
    dropdowns: [fuel("사용 연료", "D20", "G20", "B-C", "LNG")],
    inputRows: [
      {
        ...cell("연료 사용량", "Nm3", "D21", "G21", undefined, "1,200"),
        afterOnly: true,
      },
      lookup("순발열량", "MJ/", "D22", "G22", "ncv"),
      lookup("총발열량", "MJ/", "D23", "G23", "gcv"),
      lookup("배출계수", "tCO2e", "D24", "G24", "ef"),
      cell("연료 단가", "원/", "D25", "G25", "800", "500"),
    ],
    basisRows: [
      source("사용 연료"),
      source("연료 사용량"),
      lifetime(10, "L23"),
    ],
    computeRows: [
      {
        label: "1차년도 온실가스 배출량",
        unit: "tCO2e/년",
        sampleBefore: "351",
        sampleAfter: "544",
      },
      {
        label: "2차년도 온실가스 배출량",
        unit: "tCO2e/년",
        sampleBefore: "602",
        sampleAfter: "932",
      },
      {
        label: "3차년도 온실가스 배출량",
        unit: "tCO2e/년",
        sampleBefore: "602",
        sampleAfter: "932",
      },
    ],
    resultItems: [
      {
        key: "1차년도_온실가스_감축량",
        label: "1차년도 온실가스 감축량",
        unit: "tCO2e/년",
        sample: "-192",
      },
      {
        key: "1차년도_한계비용",
        label: "1차년도 한계비용",
        unit: "백만원/tCO2e",
        sample: "-0.036",
      },
      {
        key: "2차년도_온실가스_감축량",
        label: "2차년도 온실가스 감축량",
        unit: "tCO2e/년",
        sample: "-330",
      },
      {
        key: "3차년도_온실가스_감축량",
        label: "3차년도 온실가스 감축량",
        unit: "tCO2e/년",
        sample: "-330",
      },
    ],
  },
  {
    sheetName: "폐열(B)",
    methodologyName: "자체 생산한 스팀의 폐열회수",
    dropdowns: [
      {
        key: "스팀생산용_연료",
        label: "스팀생산용 연료",
        cellRefBefore: "D20",
        beforeValue: "LNG",
      },
    ],
    inputRows: [
      lookup("배출계수", "tCO2e/GJ", "D21", undefined, "ef"),
      lookup("총발열량", "MJ/{fuelUnit}", "D22", undefined, "gcv"),
      cell("폐열회수량", "MJ/hr", "D23", undefined, "5.3"),
      cell("가동시간/월", "hr/월", "D24", undefined, "100"),
      cell("연료 단가", "원/{fuelUnit}", "D25", undefined, "500"),
    ],
    basisRows: [source("스팀사용량"), source("가동시간"), lifetime(10, "L22")],
    // 개선후 칸은 기획 사이트에서도 산출 전(—) 그대로다
    computeRows: [
      {
        label: "폐열회수량(월)",
        unit: "GJ",
        sampleBefore: "4",
      },
      {
        label: "1차년도 온실가스 감축량",
        unit: "tCO2e",
        sampleBefore: "208",
      },
      {
        label: "2차년도 온실가스 감축량",
        unit: "tCO2e",
        sampleBefore: "357",
      },
      {
        label: "3차년도 온실가스 감축량",
        unit: "tCO2e",
        sampleBefore: "357",
      },
    ],
    resultItems: [
      {
        key: "1차년도_{fuel}_절감량",
        label: "1차년도 {fuel} 절감량",
        unit: "{fuelUnit}",
        sample: "603",
      },
      {
        key: "2차년도_{fuel}_절감량",
        label: "2차년도 {fuel} 절감량",
        unit: "{fuelUnit}",
        sample: "1,033",
      },
      {
        key: "3차년도_{fuel}_절감량",
        label: "3차년도 {fuel} 절감량",
        unit: "{fuelUnit}",
        sample: "1,033",
      },
      {
        key: "1차년도_{fuel}_절감금액",
        label: "1차년도 {fuel} 절감금액",
        unit: "백만원",
        sample: "0.301",
      },
      {
        key: "2차년도_{fuel}_절감금액",
        label: "2차년도 {fuel} 절감금액",
        unit: "백만원",
        sample: "0.516",
      },
      {
        key: "3차년도_{fuel}_절감금액",
        label: "3차년도 {fuel} 절감금액",
        unit: "백만원",
        sample: "0.516",
      },
      {
        key: "1차년도_온실가스_감축량",
        label: "1차년도 온실가스 감축량",
        unit: "tCO2e/년",
        sample: "-192",
      },
      {
        key: "2차년도_온실가스_감축량",
        label: "2차년도 온실가스 감축량",
        unit: "tCO2e/년",
        sample: "-330",
      },
      {
        key: "3차년도_온실가스_감축량",
        label: "3차년도 온실가스 감축량",
        unit: "tCO2e/년",
        sample: "-330",
      },
      {
        key: "1차년도_한계비용",
        label: "1차년도 한계비용",
        unit: "백만원/tCO2e",
        sample: "0.014",
      },
    ],
    singleColumn: true,
  },

  // ── 아래는 기획 사이트 20개 시트 중 시안(case1~4)에 없던 16건. 값은 산출 전(—)이다 ──
  {
    sheetName: "고효율설비(1)",
    methodologyName: "전기분야 고효율 설비 교체 (설계값 기준)",
    dropdowns: [],
    inputRows: [
      cell("설비용량", "KW", "D20", "G20", "20", "9"),
      cell("설비대수", "대", "D21", "G21", "2", "2"),
      cell("가동시간", "hr", "D22", "G22", "180", "150"),
      cell("생산량", "개", "D23", "G23", "100", "120"),
      {
        ...cell("연료 단가", "원 / KWh", "D24", "G24", "120"),
        mirrorAfter: true,
      },
    ],
    basisRows: [
      source("설비용량"),
      source("설비대수"),
      source("가동시간"),
      source("생산량"),
      lifetime(10, "L24"),
    ],
    computeRows: [
      compute("전력 사용량(월)", "KWh/월"),
      compute("배출계수", "tCO2e/MWh"),
      ...yearlyEmission("온실가스 배출량", "tCO2e/년"),
    ],
    resultItems: [
      ...yearly("전력 절감량", "KWh"),
      ...yearly("절감금액", "백만원"),
      ...yearly("온실가스 감축량", "tCO2e/년"),
      marginal(),
    ],
  },
  {
    sheetName: "고효율설비(2)",
    methodologyName: "전기분야 고효율 설비 교체 (측정값 기준)",
    dropdowns: [],
    inputRows: [
      cell("전력소비량", "KW/hr", "D20", "G20", "40", "25"),
      cell("가동시간/월", "hr", "D21", "G21", "200", "180"),
      cell("생산량", "개", "D22", "G22", "100", "120"),
      {
        ...cell("연료 단가", "원 / KWh", "D23", "G23", "120"),
        mirrorAfter: true,
      },
    ],
    basisRows: [
      source("전력소비량"),
      source("가동시간"),
      source("생산량"),
      lifetime(8, "L23"),
    ],
    computeRows: [
      compute("전력 사용량(월)", "KWh/월"),
      compute("배출계수", "tCO2e/MWh"),
      ...yearlyEmission("온실가스 배출량", "tCO2e/년"),
    ],
    resultItems: [
      ...yearly("전력 절감량", "KWh"),
      ...yearly("절감금액", "백만원"),
      ...yearly("온실가스 감축량", "tCO2e/년"),
      marginal(),
    ],
  },
  {
    sheetName: "고효율설비(3)",
    methodologyName: "화석연료 사용시설 고효율 설비 교체",
    dropdowns: [fuel("연료유형", "D20", "G20", "경유", "LNG")],
    inputRows: [
      lookup("배출계수", "tCO2e", "D21", "G21", "ef"),
      lookup("순발열량", "MJ/", "D22", "G22", "ncv"),
      cell("연료사용량", "liter", "D23", "G23", "50", "40"),
      cell("가동시간/월", "hr/", "D24", "G24", "150", "120"),
      cell("생산량", "개", "D25", "G25", "200", "220"),
      cell("연료 단가", "원/", "D26", "G26", "800", "560"),
    ],
    basisRows: [
      source("설비용량"),
      source("설비대수"),
      source("가동시간"),
      source("생산량"),
      lifetime(9, "L24"),
    ],
    computeRows: [
      compute("연료 사용량(월)", "liter"),
      ...yearlyEmission("온실가스 배출량", "tCO2e"),
    ],
    resultItems: [
      ...yearly("{fuel} 절감량", "{fuelUnit}"),
      ...yearly("{fuel} 절감금액", "백만원"),
      ...yearly("온실가스 감축량", "tCO2e/년"),
      marginal(),
    ],
  },
  {
    sheetName: "고효율설비(4)",
    methodologyName: "화석연료 및 전기 사용시설 고효율 설비 교체",
    dropdowns: [fuel("연료유형", "D20", "G20", "등유", "LNG")],
    inputRows: [
      lookup("배출계수", "tCO2e", "D21", "G21", "ef"),
      lookup("순발열량", "MJ/", "D22", "G22", "ncv"),
      cell("연료사용량", "liter", "D23", "G23", "50", "40"),
      cell("전기사용량", "KWh", "D24", "G24", "25", "12"),
      cell("가동시간/월", "hr/", "D25", "G25", "150", "120"),
      cell("생산량", "개", "D26", "G26", "200", "220"),
      cell("연료 단가", "원/", "D27", "G27", "800", "560"),
      cell("전기단가", "원/", "D28", "G28", "120", "125"),
    ],
    basisRows: [
      source("설비용량"),
      source("설비대수"),
      source("가동시간"),
      source("생산량"),
      lifetime(9, "L24"),
    ],
    computeRows: [
      compute("연료 사용량(월)", "liter"),
      compute("전기 사용량(월)", "KWh"),
      ...yearlyEmission("온실가스 배출량", "tCO2e"),
    ],
    resultItems: [
      ...yearly("{fuel} 절감량", "{fuelUnit}"),
      ...yearly("{fuel} 절감금액", "백만원"),
      ...yearly("전기 절감량", "KWh"),
      ...yearly("전기 절감금액", "백만원"),
      ...yearly("온실가스 감축량", "tCO2e/년"),
      marginal(),
    ],
  },
  {
    sheetName: "고효율설비(5)",
    methodologyName: "스팀사용시설 고효율 설비 교체",
    dropdowns: [fuel("연료유형", "D20", "G20", "스팀", "스팀")],
    inputRows: [
      // 배출계수는 데이터 근거의 스팀 배출계수와 같은 칸(L21 · L22)을 쓴다
      steamCell("배출계수", "L21", "L22", "0.0213", "0.0225"),
      cell("스팀사용량", "GJ/", "D22", "G22", "50", "40"),
      cell("가동시간", "hr/", "D23", "G23", "150", "120"),
      cell("생산량", "개/", "D24", "G24", "100", "120"),
      cell("연료 단가", "원/", "D25", "G25", "700", "750"),
    ],
    basisRows: [
      source("스팀사용량"),
      steamEf("스팀 배출계수 (개선전)", "L21", 0.0213),
      steamEf("스팀 배출계수 (개선후)", "L22", 0.0225),
      source("가동시간"),
      source("생산량"),
      lifetime(9, "L25"),
    ],
    computeRows: [
      compute("스팀 사용량(월)", "GJ"),
      ...yearlyEmission("온실가스 배출량", "tCO2e"),
    ],
    resultItems: [
      ...yearly("스팀 절감량", "GJ"),
      ...yearly("스팀 절감금액", "백만원"),
      ...yearly("온실가스 감축량", "tCO2e/년"),
      marginal(),
    ],
  },
  {
    sheetName: "폐열(A)",
    methodologyName: "외부에서 구매한 스팀의 폐열 회수",
    dropdowns: [fuel("연료유형", "D20", "G20", "스팀", "스팀")],
    inputRows: [
      steamCell("배출계수", "L21", "L22", "0.0315", "0.0326"),
      cell("폐열회수량", "GJ/", "D22", "G22", "2", "20"),
      cell("가동시간/월", "hr/", "D23", "G23", "100", "100"),
      cell("연료 단가", "원/", "D24", "G24", "200", "200"),
    ],
    basisRows: [
      source("스팀사용량"),
      steamEf("스팀 배출계수 (개선전)", "L21", 0.0315),
      steamEf("스팀 배출계수 (개선후)", "L22", 0.0326),
      source("가동시간"),
      lifetime(10, "L24"),
    ],
    computeRows: [
      compute("폐열회수량(월)", "GJ"),
      ...yearlyEmission("온실가스 감축량", "tCO2e"),
    ],
    resultItems: [
      ...yearly("스팀 절감량", "GJ"),
      ...yearly("스팀 절감금액", "백만원"),
      ...yearly("온실가스 감축량", "tCO2e/년"),
      marginal(),
    ],
  },
  {
    sheetName: "연료전환(2)",
    methodologyName: "화석연료에서 스팀으로의 전환",
    dropdowns: [fuel("연료유형", "D20", "G20", "B-C", "스팀")],
    inputRows: [
      {
        key: "배출계수",
        label: "배출계수",
        unit: "tCO2e",
        cellRefBefore: "D21",
        lookupBefore: "ef",
        // 개선후는 데이터 근거의 스팀 배출계수(L21)를 그대로 보여준다
        cellRefAfter: "L21",
        readOnlyAfter: true,
        defaultAfter: "0.0215",
      },
      {
        ...lookup("순발열량", "MJ/", "D22", undefined, "ncv"),
        beforeOnly: true,
      },
      {
        ...lookup("총발열량", "MJ/", "D23", undefined, "gcv"),
        beforeOnly: true,
      },
      cell("연료(스팀)사용량", "liter", "D24", "G24", "70", "8"),
      cell("가동시간/월", "hr/", "D25", "G25", "150", "150"),
      cell("생산량", "개/", "D26", "G26", "100", "120"),
    ],
    basisRows: [
      source("연료유형"),
      steamEf("스팀 배출계수 (개선후)", "L21", 0.0215),
      source("가동시간"),
      source("생산량"),
      lifetime(9, "L24"),
    ],
    computeRows: [
      compute("연료 사용량(월)", "liter"),
      ...yearlyEmission("온실가스 배출량", "tCO2e"),
    ],
    resultItems: [...yearly("온실가스 감축량", "tCO2e/년"), marginal()],
  },
  {
    sheetName: "연료전환(3)",
    methodologyName: "배출계수가 높은 스팀에서 낮은 스팀으로의 전환",
    dropdowns: [fuel("연료유형", "D20", "G20", "스팀", "스팀")],
    inputRows: [
      steamCell("배출계수", "L21", "L22", "0.0413", "0.0125"),
      cell("스팀사용량", "GJ/", "D22", "G22", "50", "40"),
      cell("가동시간/월", "hr/", "D23", "G23", "150", "120"),
      cell("생산량", "개/", "D24", "G24", "100", "120"),
      cell("연료 단가", "원/", "D25", "G25", "700", "750"),
    ],
    basisRows: [
      source("스팀사용량"),
      steamEf("스팀 배출계수 (개선전)", "L21", 0.0413),
      steamEf("스팀 배출계수 (개선후)", "L22", 0.0125),
      source("가동시간"),
      source("생산량"),
      lifetime(1, "L25"),
    ],
    computeRows: [
      compute("스팀 사용량(월)", "GJ"),
      ...yearlyEmission("온실가스 배출량", "tCO2e"),
    ],
    resultItems: [...yearly("온실가스 감축량", "tCO2e/년"), marginal()],
  },
  {
    sheetName: "연료전환(4)",
    methodologyName: "화석연료에서 목질계 바이오매스로의 전환",
    // 개선후는 고를 수 없는 고정 연료다 — 기획 사이트도 '목제펠릿 (고정)' 표기
    dropdowns: [
      {
        ...fuel("사용 연료", "D20", "G20", "B-C", "목제펠릿"),
        readOnlyAfter: true,
      },
    ],
    inputRows: [
      {
        ...cell("연료 사용량", "kg", "D21", "G21", undefined, "2,400"),
        afterOnly: true,
      },
      {
        ...lookup("순발열량", "MJ/", "D22", "G22", "ncv"),
        fixedValueAfter: "15.6",
      },
      {
        ...lookup("총발열량", "MJ/", "D23", "G23", "gcv"),
        fixedValueAfter: "16.082",
      },
      {
        ...lookup("배출계수", "tCO2e", "D24", "G24", "ef"),
        fixedValueAfter: "1.900",
      },
      cell("연료 단가", "원/", "D25", "G25", "800", "500"),
    ],
    basisRows: [
      source("사용 연료"),
      source("목재펠릿 사용량"),
      lifetime(10, "L23"),
    ],
    computeRows: yearlyEmission("온실가스 배출량", "tCO2e/년"),
    resultItems: [...yearly("온실가스 감축량", "tCO2e/년"), marginal()],
  },
  {
    sheetName: "연료전환(5)",
    methodologyName: "화석연료에서 바이오가스로의 전환",
    // 개선후는 고를 수 없는 고정 연료다 — 기획 사이트도 '바이오가스 (고정)' 표기
    dropdowns: [
      {
        ...fuel("사용 연료", "D20", "G20", "LNG", "바이오가스"),
        readOnlyAfter: true,
      },
    ],
    inputRows: [
      {
        ...cell("연료 사용량", "kg", "D21", "G21", undefined, "2,500"),
        afterOnly: true,
      },
      {
        ...lookup("순발열량", "MJ/", "D22", "G22", "ncv"),
        fixedValueAfter: "50.4",
      },
      {
        ...lookup("총발열량", "MJ/", "D23", "G23", "gcv"),
        fixedValueAfter: "51.959",
      },
      {
        ...lookup("배출계수", "tCO2e", "D24", "G24", "ef"),
        fixedValueAfter: "0.052",
      },
      cell("연료 단가", "원/", "D25", "G25", "800", "500"),
    ],
    basisRows: [
      source("사용 연료"),
      source("연료 사용량"),
      lifetime(10, "L23"),
    ],
    computeRows: yearlyEmission("온실가스 배출량", "tCO2e/년"),
    resultItems: [...yearly("온실가스 감축량", "tCO2e/년"), marginal()],
  },
  {
    sheetName: "고효율조명",
    methodologyName: "조명등 효율 개선",
    dropdowns: [],
    inputRows: [
      cell("조명기 개수", "대", "D20", "G20", "2,000", "1,000"),
      cell("조명기 용량", "W", "D21", "G21", "32", "15"),
      cell("점등 시간", "hr", "D22", "G22", "120", "120"),
      cell("전기 단가", "원", "D23", "G23", "120", "120"),
    ],
    basisRows: [
      source("설비용량"),
      source("설비대수"),
      source("가동시간"),
      lifetime(8, "L23"),
    ],
    computeRows: [
      compute("전력 사용량", "KWh"),
      compute("배출계수", "tCO2e/MWh"),
      ...yearlyEmission("온실가스 배출량", "tCO2e/년"),
    ],
    resultItems: [
      ...yearly("전력 절감량", "KWh"),
      ...yearly("절감금액", "백만원"),
      ...yearly("온실가스 감축량", "tCO2e/년"),
      marginal(),
    ],
  },
  {
    sheetName: "태양열이용",
    methodologyName: "태양열 에너지 이용",
    dropdowns: [fuel("사용 연료", "D20", "G20", "LNG", "태양열")],
    inputRows: [
      cell("에너지 사용량", "GJ", "D21", "G21", "0", "100"),
      {
        ...lookup("배출계수", "tCO2e", "D22", undefined, "ef"),
        beforeOnly: true,
      },
      cell("연료 단가", "원/", "D23", "G23", "600", "0"),
    ],
    basisRows: [
      source("사용 연료"),
      source("연료 사용량"),
      lifetime(10, "L23"),
    ],
    computeRows: yearlyEmission("온실가스 배출량", "tCO2e/년"),
    resultItems: [
      ...yearly("{fuel} 절감량", "{fuelUnit}"),
      ...yearly("{fuel} 절감금액", "백만원"),
      ...yearly("온실가스 감축량", "tCO2e/년"),
      marginal(),
    ],
  },
  {
    sheetName: "변압기교체",
    methodologyName: "고효율 변압기 교체",
    dropdowns: [],
    inputRows: [
      cell("무부하손실", "MW", "D20", "G20", "20", "9"),
      cell("부하손실", "MW", "D21", "G21", "15", "8"),
      {
        ...cell("부하율", "%", "D22", "G22", undefined, "50"),
        afterOnly: true,
      },
      {
        ...cell("가동시간", "hr", "D23", "G23", undefined, "150"),
        afterOnly: true,
      },
      cell("연간가동시간", "hr", "D24", "G24", "1,000", "1,200"),
      {
        ...cell("연료 단가", "원 / KWh", "D25", "G25", "120"),
        mirrorAfter: true,
      },
    ],
    basisRows: [
      source("무부하손실"),
      source("부하손실"),
      source("부하율"),
      source("가동시간"),
      source("생산량"),
      lifetime(10, "L25"),
    ],
    computeRows: [
      compute("전력 손실량(월)", "KWh/월"),
      compute("배출계수", "tCO2e/MWh"),
      ...yearlyEmission("손실 온실가스 배출량", "tCO2e/년"),
    ],
    resultItems: [
      ...yearly("전력 절감량", "KWh"),
      ...yearly("절감금액", "백만원"),
      ...yearly("온실가스 감축량", "tCO2e/년"),
      marginal(),
    ],
  },
  {
    sheetName: "전기차",
    methodologyName: "전기차 도입에 따른 화석연료 절감",
    // 기획 사이트는 '구분 / 차량전환 / 단위' 3열 표 하나다.
    // 화면은 좁은 폭에서 값이 잘려 다른 방법론과 같이 단위를 구분 칸의 이름 옆에 붙인다.
    dropdowns: [
      {
        key: "기존차량_연료유형",
        label: "기존차량 연료유형",
        cellRefBefore: "D20",
        beforeValue: "휘발유",
        fuelSet: "B",
      },
    ],
    inputRows: [
      lookup("배출계수", "tCO₂e/TJ", "D21", undefined, "ef"),
      lookup("순발열량", "MJ/{fuelUnit}", "D22", undefined, "ncv"),
      cell("연비", "{fuelUnit}/KM", "D23", undefined, "10"),
      cell("사업후 전기차 주행거리", "KM/월", "D24", undefined, "600"),
      cell("사업후 전기차 충전량", "KWh/월", "D25", undefined, "10"),
    ],
    basisRows: [
      source("기존차량연료"),
      source("기존차량연비"),
      source("전기차 주행거리"),
      source("전기차 충전량"),
      lifetime(10, "L24"),
    ],
    computeRows: yearlyEmission("온실가스 배출량", "tCO2e"),
    resultItems: [...yearly("온실가스 감축량", "tCO2e/년"), marginal()],
    singleColumn: true,
    singleColumnLabel: "차량전환",
  },
  {
    sheetName: "기타(1)",
    methodologyName: "전기사용시설 기타 공정개선",
    dropdowns: [],
    inputRows: [
      cell("전력소비량", "KW/hr", "D20", "G20", "40", "25"),
      {
        ...cell("가동시간", "hr/월", "D21", "G21", undefined, "200"),
        afterOnly: true,
      },
      {
        ...cell("전기단가", "원/KWh", "D22", "G22", undefined, "120"),
        afterOnly: true,
      },
    ],
    basisRows: [source("전력소비량"), source("가동시간")],
    computeRows: [
      compute("전력 사용량(월)", "KWh/월"),
      compute("배출계수", "tCO2e/MWh"),
      ...yearlyEmission("온실가스 배출량", "tCO2e/년"),
    ],
    resultItems: [
      ...yearly("전력 절감량", "KWh"),
      ...yearly("절감금액", "백만원"),
      ...yearly("온실가스 감축량", "tCO2e/년"),
      marginal(),
    ],
  },
  {
    sheetName: "기타(2)",
    methodologyName: "화석연료사용시설 기타 공정개선",
    dropdowns: [fuel("사용 연료", "D20", "G20", "LNG", "LNG")],
    inputRows: [
      cell("연료 사용량", "Nm3", "D21", "G21", "25", "15"),
      cell("가동시간", "hr", "D22", "G22", "-", "200"),
      {
        ...cell("연료단가", "원", "D23", "G23"),
        afterOnly: true,
        defaultAfter: "600",
      },
    ],
    basisRows: [source("연료 사용량"), source("가동시간")],
    computeRows: yearlyEmission("온실가스 배출량", "tCO2e/년"),
    resultItems: [
      ...yearly("에너지 절감량", "{fuelUnit}"),
      ...yearly("절감금액", "백만원"),
      ...yearly("온실가스 감축량", "tCO2e/년"),
      marginal(),
    ],
  },
]

/** 연료 A 형. 순서는 기획 사이트 드롭다운 순서다 */
export const FUEL_TABLE_A: Record<string, FuelSpec> = {
  "B-C": { unit: "liter", gcv: 41.7, ncv: 39.2, ef: 77.649 },
  LNG: { unit: "Nm³", gcv: 43.1, ncv: 38.9, ef: 56.152 },
  경유: { unit: "liter", gcv: 37.8, ncv: 35.2, ef: 74.349 },
  등유: { unit: "liter", gcv: 36.7, ncv: 34.2, ef: 72.149 },
  휘발유: { unit: "liter", gcv: 32.7, ncv: 30.4, ef: 69.549 },
  LPG: { unit: "kg", gcv: 50.4, ncv: 46.3, ef: 63.152 },
  부생연료1호: { unit: "liter", gcv: 37.1, ncv: 34.6, ef: 72.149 },
  부생연료2호: { unit: "liter", gcv: 39.9, ncv: 37.7, ef: 77.649 },
  목제펠릿: { unit: "kg", gcv: 16.082, ncv: 15.6, ef: 1.9 },
  바이오가스: { unit: "kg", gcv: 51.959, ncv: 50.4, ef: 0.052 },
}

/** 연료 B 형(전기차 전용). 배출계수만 다르고 발열량·단위는 A 형과 같다 */
export const FUEL_TABLE_B: Record<string, FuelSpec> = {
  경유: { ...FUEL_TABLE_A["경유"], ef: 75.3909 },
  휘발유: { ...FUEL_TABLE_A["휘발유"], ef: 72.305 },
  LPG: { ...FUEL_TABLE_A["LPG"], ef: 64.464 },
}

export const FUEL_OPTIONS_A = Object.keys(FUEL_TABLE_A)
export const FUEL_OPTIONS_B = Object.keys(FUEL_TABLE_B)

/** 드롭다운 종류에 맞는 선택지 */
export const fuelOptionsOf = (set?: FuelSet) =>
  set === "B" ? FUEL_OPTIONS_B : FUEL_OPTIONS_A

/** 연료 이름으로 연료표 한 줄을 찾는다. 스팀처럼 표에 없으면 undefined */
export const fuelSpecOf = (name: string, set?: FuelSet) =>
  (set === "B" ? FUEL_TABLE_B : FUEL_TABLE_A)[name.trim()]

/**
 * ④ 온실가스 감축량 및 에너지 절감량 표의 값 묶음. 키는 아래 rowKey · computeKey 로 만든다.
 * undefined 는 산출 전(—)이다. 값을 만드는 곳은 lib/reduction-calc.ts 한 곳뿐이다.
 */
export type ResultValues = Record<string, number | undefined>

/** 표 한 줄의 키. 키가 없는 줄은 라벨의 띄어쓰기를 _ 로 바꿔 쓴다 */
export const rowKey = (row: SchemaRow) =>
  row.key ?? (row.label ?? "").replace(/\s+/g, "_")

/** N차년도 온실가스 감축량의 키. 카드 접힘 요약이 ④ 와 같은 값을 읽을 때 쓴다 */
export const reductionKeyOf = (year: 1 | 2 | 3) =>
  `${year}차년도_온실가스_감축량`

/** ④ 개선전·개선후 표의 칸 키. 예: "전력_사용량(월):before" */
export const computeKey = (row: SchemaRow, side: "before" | "after") =>
  `${rowKey(row)}:${side}`

/** 결과 계산 공통 상수. ④ 안내 문구(lib/reduction-calc.ts 의 resultHintOf)에 쓴다 */
export const POWER_EMISSION_FACTOR = "0.45941"

/** 방법론 이름으로 화면 정의를 찾는다 */
export const schemaOf = (methodologyName: string) =>
  REDUCTION_SCHEMA.find(
    (schema) => schema.methodologyName.trim() === methodologyName.trim(),
  )
