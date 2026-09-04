// 자가진단 STEP 3 감축잠재량 산정의 감축방법론 목록.
// 기획 사이트의 20개 방법론 시트를 카테고리 → 방법론 두 단계로 담는다.
// 카테고리를 고르면 방법론은 비워 두고 사용자가 직접 고른다(business-card.tsx).
export const REDUCTION_METHODOLOGIES = [
  {
    value: "고효율설비",
    label: "고효율 설비교체",
    methodologies: [
      "전기분야 고효율 설비 교체 (설계값 기준)",
      "전기분야 고효율 설비 교체 (측정값 기준)",
      "화석연료 사용시설 고효율 설비 교체",
      "화석연료 및 전기 사용시설 고효율 설비 교체",
      "스팀사용시설 고효율 설비 교체",
    ],
  },
  {
    value: "폐열(AB)",
    label: "폐열회수",
    methodologies: [
      "외부에서 구매한 스팀의 폐열 회수",
      "자체 생산한 스팀의 폐열회수",
    ],
  },
  {
    value: "연료전환",
    label: "연료전환",
    methodologies: [
      "고탄소 화석연료에서 저탄소 화석연료로의 전환",
      "화석연료에서 스팀으로의 전환",
      "배출계수가 높은 스팀에서 낮은 스팀으로의 전환",
      "화석연료에서 목질계 바이오매스로의 전환",
      "화석연료에서 바이오가스로의 전환",
    ],
  },
  {
    value: "고효율조명",
    label: "고효율 조명",
    methodologies: ["조명등 효율 개선"],
  },
  {
    value: "태양광발전",
    label: "태양광 발전",
    methodologies: ["태양광 발전"],
  },
  {
    value: "태양열",
    label: "태양열에너지",
    methodologies: ["태양열 에너지 이용"],
  },
  {
    value: "변압기",
    label: "변압기 교체",
    methodologies: ["고효율 변압기 교체"],
  },
  {
    value: "전기차",
    label: "전기자동차",
    methodologies: ["전기차 도입에 따른 화석연료 절감"],
  },
  {
    value: "기타",
    label: "기타 단순 공정개선",
    methodologies: [
      "전기사용시설 기타 공정개선",
      "화석연료사용시설 기타 공정개선",
      "스팀사용시설 기타 공정개선",
    ],
  },
] as const

// 업종선택 드롭다운. 시안에 나오는 값만 둔다.
export const INDUSTRY_OPTIONS = ["제조업(일반)"]
