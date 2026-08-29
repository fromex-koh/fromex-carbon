// 자가진단 STEP 3 감축잠재량 산정의 감축방법론 목록.
// 시안(case1~4)에 그려진 네 가지에, 방법론 변경을 확인할 수 있게 항목마다 하나씩 더 뒀다.
// 태양광 발전 항목은 기획 사이트 원본에도 방법론이 하나뿐이다.
export const REDUCTION_METHODOLOGIES = [
  {
    value: "폐열(AB)",
    label: "폐열회수",
    methodologies: ["자체 생산한 스팀의 폐열회수"],
  },
  {
    value: "연료전환",
    label: "연료전환",
    methodologies: ["고탄소 화석연료에서 저탄소 화석연료로의 전환"],
  },
  {
    value: "태양광발전",
    label: "태양광 발전",
    methodologies: ["태양광 발전"],
  },
  {
    value: "기타",
    label: "기타 단순 공정개선",
    methodologies: ["스팀사용시설 기타 공정개선"],
  },
] as const

// 업종선택 드롭다운. 시안에 나오는 값만 둔다.
export const INDUSTRY_OPTIONS = ["제조업(일반)"]
