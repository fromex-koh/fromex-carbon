// 자가진단 STEP 5(평가지표 작성)의 설명 팝업 내용.
// [퍼블리싱 노출용] 문구는 고정이다. 실제 데이터를 연결할 때 이 상수를 걷어낸다.

/** 의무 교육 팝업. 교육기관 하나와 그 기관이 운영하는 교육 목록 */
export interface TrainingOrganization {
  name: string
  courses: string[]
}

export const MANDATORY_TRAINING_ORGANIZATIONS: TrainingOrganization[] = [
  {
    name: "환경보전협회",
    courses: [
      "환경기술인(대기, 수질, 폐기물 등), 통합환경관리 교육 등",
      "대기환경기술인, 수질환경기술인 교육",
      "폐기물처리담당자, 폐기물배출자 교육, 폐기물처리시설기술관리인",
    ],
  },
  {
    name: "한국에너지공단",
    courses: [
      "검사대상기기관리자 교육(중대형보일러, 소형보일러, 압력용기 등)",
      "에너지관리자, 에너지관리기사(검사대상기기 조종자, 보일러관리자) 교육",
    ],
  },
  { name: "한국가스안전공사", courses: ["가스안전관리자"] },
  { name: "한국전기기술인협회", courses: ["전기안전관리자"] },
]

/** 배출원 예시 표의 한 줄 */
export interface EmissionSourceRow {
  tech: string
  activity: string
  source: string
}

/** 배출유형 하나와 그에 속한 줄들. 배출유형 칸은 rows 만큼 세로로 합쳐진다. */
export interface EmissionSourceGroup {
  /** 줄바꿈 위치가 시안과 같도록 두 조각으로 나눠 둔다 */
  type: [string, string]
  rows: EmissionSourceRow[]
}

export const EMISSION_SOURCE_GROUPS: EmissionSourceGroup[] = [
  {
    type: ["Scope 1", "연료사용"],
    rows: [
      {
        tech: "고정연소",
        activity: "화석연료 사용\n(경유, 등유, B-C, LPG, LNG 등)",
        source: "발전시설, 일반보일러, 공정연소시설, 대기오염물질 방지시설 등",
      },
      {
        tech: "이동연소",
        activity: "-",
        source: "승용·화물·승합자동차, 지게차 등",
      },
    ],
  },
  {
    type: ["Scope 1", "폐기물 처리"],
    rows: [
      {
        tech: "하·폐수처리, 소각",
        activity: "처리량",
        source: "하폐수 배출시설, 소각시설",
      },
    ],
  },
  {
    type: ["Scope 1", "공정배출"],
    rows: [
      {
        tech: "석회석 및 백운석 사용",
        activity: "탄산염 사용량",
        source: "소성시설, 약품회수시설, 배연탈황시설",
      },
      { tech: "유리 생산", activity: "유리 생산량", source: "용융·용해로" },
      {
        tech: "합금철 생산",
        activity: "합금철 생산량",
        source: "전로, 전기아크로",
      },
      { tech: "납 생산", activity: "납 생산량", source: "소결로, 용융·용해로" },
      {
        tech: "요업, 비철금속 기타 제품 생산",
        activity: "제품 생산량",
        source: "소성로, 보일러, 대기오염물질 방지시설 등",
      },
    ],
  },
  {
    type: ["Scope 2", "외부 전력/열"],
    rows: [
      {
        tech: "전력 사용",
        activity: "전력 사용량",
        source: "전력 사용시설(사업장 전체)",
      },
      {
        tech: "열(스팀) 사용",
        activity: "열(스팀) 사용량",
        source: "열(스팀) 사용시설(사업장 전체)",
      },
    ],
  },
  {
    type: ["Scope 3", "예시"],
    rows: [
      {
        tech: "자본재 투자 및 구매",
        activity: "사무기기 구매내역",
        source: "개인용 PC, 책상, 의자 등",
      },
      {
        tech: "사업장 발생 폐기물",
        activity: "폐기물 배출내역",
        source: "사업장 발생 폐기물",
      },
    ],
  },
]

export const EMISSION_SOURCE_HEADS = [
  "배출유형",
  "감축기술",
  "활동자료",
  "탄소배출원",
]

/** 인증 종류 팝업. 기관 구분 없이 한 줄씩 늘어놓는다. */
export const ENVIRONMENT_CERTIFICATIONS = [
  "환경성적표지",
  "환경표지제품",
  "저탄소인증제품",
  "우수재활용제품",
  "고효율에너지기자재",
  "효율관리기자재",
]
