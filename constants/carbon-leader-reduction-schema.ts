// 자가진단 STEP 3 감축잠재량 산정의 방법론별 화면 정의.
// 시안(case1~4)에 그려진 네 가지만 담고, 값은 계산하지 않고 시안 수치를 그대로 보여준다.

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
  /** 개선전 한 칸만 입력받는 방법론(폐열회수) */
  singleColumn?: boolean
  /** ④ 아래 안내 문구(시안) */
  sampleHint: string
}

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
      },
      {
        key: "전기_단가",
        label: "전기 단가",
        unit: "원",
        cellRefBefore: "D21",
        cellRefAfter: "G21",
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
    sampleHint:
      "1차년도 4개월 (9월 운전개시) · 2/3차년도 12개월 · 전력배출계수 0.45941 tCO₂e/MWh · 투자비 55백만원 · 제품수명 8년",
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
        cellRefAfter: "G22",
        afterOnly: true,
        placeholderAfter: "0.0413",
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
      {
        key: "스팀_배출계수",
        label: "스팀 배출계수",
        rowType: "steam-ef",
        fixedValue: 0.0413,
        unit: "tCO2e/GJ",
        cellRef: "L21",
        placeholder: "환경부 고시배출계수",
      },
      {
        key: "가동시간",
        label: "가동시간",
        rowType: "source",
        placeholder: "측정기기 (현장실측)",
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
    sampleHint:
      "1차년도 7개월 (6월 운전개시) · 2/3차년도 12개월 · 전력배출계수 0.45941 tCO₂e/MWh · 투자비 70백만원 · 제품수명 10년",
  },
  {
    sheetName: "연료전환(1)",
    methodologyName: "고탄소 화석연료에서 저탄소 화석연료로의 전환",
    dropdowns: [
      {
        key: "사용_연료",
        label: "사용 연료",
        cellRefBefore: "D20",
        cellRefAfter: "G20",
        beforeValue: " B-C ",
        afterValue: " LNG ",
      },
    ],
    inputRows: [
      {
        key: "연료_사용량",
        label: "연료 사용량",
        unit: "Nm3",
        cellRefBefore: "D21",
        cellRefAfter: "G21",
        afterOnly: true,
        placeholderAfter: "12000",
      },
      {
        key: "순발열량",
        label: "순발열량",
        unit: "MJ/",
        cellRefBefore: "D22",
        cellRefAfter: "G22",
        sampleBefore: "235",
        sampleAfter: "249",
      },
      {
        key: "총발열량",
        label: "총발열량",
        unit: "MJ/",
        cellRefBefore: "D23",
        cellRefAfter: "G23",
        sampleBefore: "208",
        sampleAfter: "52",
      },
      {
        key: "배출계수",
        label: "배출계수",
        unit: "tCO2e",
        cellRefBefore: "D24",
        cellRefAfter: "G24",
        sampleBefore: "168",
        sampleAfter: "260",
      },
      {
        key: "연료_단가",
        label: "연료 단가",
        unit: "원/",
        cellRefBefore: "D25",
        cellRefAfter: "G25",
        placeholderBefore: "800",
        placeholderAfter: "500",
      },
    ],
    basisRows: [
      {
        key: "사용_연료",
        label: "사용 연료",
        rowType: "source",
        placeholder: "측정기기 (현장실측)",
      },
      {
        key: "연료_사용량",
        label: "연료 사용량",
        rowType: "source",
        placeholder: "측정기기 (현장실측)",
      },
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
    sampleHint:
      "1차년도 7개월 (6월 운전개시) · 2/3차년도 12개월 · 전력배출계수 0.45941 tCO₂e/MWh · 투자비 120백만원 · 제품수명 10년",
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
        hidden: true,
      },
    ],
    inputRows: [
      {
        key: "배출계수",
        label: "배출계수",
        unit: "tCO2e/GJ",
        cellRefBefore: "D21",
        hidden: true,
      },
      {
        key: "총발열량",
        label: "총발열량",
        unit: "MJ/",
        cellRefBefore: "D22",
        hidden: true,
      },
      {
        key: "폐열회수량",
        label: "폐열회수량",
        unit: "MJ/hr",
        cellRefBefore: "D23",
        hidden: true,
      },
      {
        key: "가동시간_월",
        label: "가동시간/월",
        unit: "hr/월",
        cellRefBefore: "D24",
        placeholderBefore: "500",
      },
      {
        key: "연료_단가",
        label: "연료 단가",
        unit: "원/Nm³",
        cellRefBefore: "D25",
        placeholderBefore: "100",
      },
    ],
    basisRows: [
      {
        key: "스팀사용량",
        label: "스팀사용량",
        rowType: "source",
        hidden: true,
      },
      {
        key: "가동시간",
        label: "가동시간",
        rowType: "source",
        hidden: true,
      },
      {
        key: "제품수명",
        label: "제품수명",
        rowType: "lifetime",
        isLifetime: true,
        fixedValue: 10,
        unit: "년",
        cellRef: "L22",
        hidden: true,
      },
    ],
    computeRows: [
      {
        label: "폐열회수량(월)",
        unit: "GJ",
        sampleBefore: "4",
        sampleAfter: "-",
      },
      {
        label: "1차년도 온실가스 감축량",
        unit: "tCO2e",
        sampleBefore: "208",
        sampleAfter: "-",
      },
      {
        label: "2차년도 온실가스 감축량",
        unit: "tCO2e",
        sampleBefore: "357",
        sampleAfter: "-",
      },
      {
        label: "3차년도 온실가스 감축량",
        unit: "tCO2e",
        sampleBefore: "357",
        sampleAfter: "-",
      },
    ],
    resultItems: [
      {
        key: "1차년도_LNG_절감량",
        label: "1차년도 LNG 절감량",
        unit: "Nm3",
        sample: "603",
      },
      {
        key: "1차년도_LNG_절감금액",
        label: "1차년도 LNG 절감금액",
        unit: "백만원",
        sample: "0.301",
      },
      {
        key: "2차년도_LNG_절감량",
        label: "2차년도 LNG 절감량",
        unit: "Nm3",
        sample: "1,033",
      },
      {
        key: "2차년도_LNG_절감금액",
        label: "2차년도 LNG 절감금액",
        unit: "백만원",
        sample: "0.516",
      },
      {
        key: "3차년도_LNG_절감량",
        label: "3차년도 LNG 절감량",
        unit: "Nm3",
        sample: "1,033",
      },
      {
        key: "3차년도_LNG_절감금액",
        label: "3차년도 LNG 절감금액",
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
        key: "1차년도_한계비용",
        label: "1차년도 한계비용",
        unit: "백만원/tCO2e",
        sample: "0.014",
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
    singleColumn: true,
    sampleHint:
      "1차년도 7개월 (6월 운전개시) · 2/3차년도 12개월 · 전력배출계수 0.45941 tCO₂e/MWh · 투자비 50백만원 · 제품수명 10년",
  },
]

/** 시안에 나오는 연료. 개선전 B-C → 개선후 LNG */
export const FUEL_OPTIONS = ["B-C", "LNG"]

/** 방법론 이름으로 화면 정의를 찾는다 */
export const schemaOf = (methodologyName: string) =>
  REDUCTION_SCHEMA.find(
    (schema) => schema.methodologyName.trim() === methodologyName.trim(),
  )
