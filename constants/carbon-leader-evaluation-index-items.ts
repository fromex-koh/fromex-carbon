// 자가진단 STEP 5(평가지표 작성) 지표 목록.
// [퍼블리싱 노출용] 점수·등급은 계산하지 않는다. 화면에 보일 값만 담아 두었고,
// 실제 산정 로직을 붙일 때 이 상수를 걷어낸다.

export type IndicatorType = "정성" | "체크" | "계량"
export type IndicatorTarget = "경영주" | "기업"
export type Grade = "A" | "B" | "C" | "D" | "E"

/** 정성 지표의 A~E 선택지 */
export interface GradeChoice {
  grade: Grade
  label: string
}

/** 체크 지표의 항목. note 는 항목 아래 작은 각주, score 는 오른쪽 배점 꼬리표 */
/** 물음표 버튼이 여는 설명 팝업 */
export type HelpTopic =
  "mandatory-training" | "emission-source-example" | "certification-type"

export interface CheckItem {
  label: string
  note?: string
  score?: string
  /** 붙이면 물음표 버튼이 생긴다. 주석(note)이 있으면 그 뒤, 없으면 항목명 뒤 */
  help?: HelpTopic
}

/** 등급 기준표. values 는 A~E 순서 */
export interface GradeScale {
  caption: string
  values: [string, string, string, string, string]
}

/** 계산형 지표의 입력 칸 */
export interface CalcField {
  label: string
  value: string
  unit: string
}

export interface Indicator {
  no: string
  name: string
  type: IndicatorType
  target: IndicatorTarget
  /** 예상등급 배지 */
  grade: Grade
  /** 설명 박스 첫 문단 */
  summary: string[]
  /** "검토방법" 아래 불릿 */
  reviewMethods?: string[]
  choices?: GradeChoice[]
  checks?: CheckItem[]
  /** "선택 n/m" 꼬리표를 붙일지. 숫자는 화면에서 실제 체크 수로 센다. */
  selected?: boolean
  scale?: GradeScale
  /** 계산식 안내 문구 */
  formula?: string
  fields?: CalcField[]
  /** 계산 결과 문구 */
  result?: string
}

export interface IndicatorGroup {
  no: string
  name: string
  indicators: Indicator[]
}

export interface IndicatorSection {
  no: string
  name: string
  groups: IndicatorGroup[]
}

const COUNT_SCALE: GradeScale = {
  caption: "기준 (개수)",
  values: [
    "4개 항목 충족",
    "3개 항목 충족",
    "2개 항목 충족",
    "1개 항목 충족",
    "미충족",
  ],
}

export const EVALUATION_SECTIONS: IndicatorSection[] = [
  {
    no: "1",
    name: "탄소감축 역량평가",
    groups: [
      {
        no: "1.1",
        name: "리더쉽 및 목표",
        indicators: [
          {
            no: "1.1.1",
            name: "탄소중립 방침 수립",
            type: "정성",
            target: "경영주",
            grade: "A",
            summary: [
              "경영주와 면담을 통하여 탄소중립 방침 수립 단계 및 선언 여부를 평가한다.",
            ],
            reviewMethods: [
              "기업 내부 결재서류, 게시판, 회의록 및 홈페이지 등을 통하여 확인한다.",
            ],
            choices: [
              { grade: "A", label: "탄소중립 방침을 수립하고 선언한 경우" },
              { grade: "B", label: "탄소중립 방침을 수립하고 선언한 경우" },
              { grade: "C", label: "탄소중립 방침을 수립하고 선언한 경우" },
              {
                grade: "D",
                label:
                  "탄소중립 방침을 수립하지 않았으나, 수립 계획이 있는 경우",
              },
              { grade: "E", label: "탄소중립 방침을 수립하고 선언한 경우" },
            ],
          },
          {
            no: "1.1.2",
            name: "경영주의 탄소중립 이해도 및 적극성",
            type: "체크",
            target: "기업",
            grade: "B",
            summary: [
              "경영주와 면담을 통하여 탄소중립 필요성과 사업화 의지 및 사업 추진 방향 등에 대해 정확히 이해하고 이를 추진하고자 하는 의지가 있는지 평가한다.",
            ],
            checks: [
              {
                label:
                  "(필요성) 탄소중립 정책 및 관련 동향, 규제(예시: 탄소중립기본법, ESG, 탄소감축 필요성 등) 등에 대하여 이해하고 있다.",
              },
              {
                label:
                  "(사업화) 기업의 경영활동 또는 사업계획이 탄소중립(탄소감축)과 연관성이 있다.",
              },
              {
                label:
                  "(투자 등) 최근 3년 이내 탄소중립 관련 투자 또는 융자(탄소가치평가보증, 녹색채권, 녹색 관련 정부(지자체 등) 지원사업) 등 외부자금을 조달받은 실적 또는 계획이 있다.",
              },
              {
                label:
                  "(이니셔티브) 탄소중립 및 기후변화 대응과 관련하여 국내외 이니셔티브에 대하여 인지하고 있으며 참여 또는 참여계획이 있다.",
                note: "* PCAF, SBTi, RE100, CDP(탄소정보공개 프로젝트), SME Climate Hub 등",
              },
            ],
            scale: COUNT_SCALE,
          },
          {
            no: "1.1.3",
            name: "탄소중립 목표 수립",
            type: "체크",
            target: "기업",
            grade: "C",
            summary: [
              "기업의 탄소감축 목표를 단기, 중기, 장기로 구체적으로 수립하고 있는지를 평가한다.",
            ],
            reviewMethods: [
              "단기목표(1년 이내): 일정(월 또는 분기) 및 소요예산에 대한 구체적 계획을 수립하고 관련 내용을 확인한다.",
              "중기목표(1년 초과 3년 이내): 일정(월 또는 분기) 및 소요예산에 대한 구체적 계획을 수립하고 관련 내용을 확인한다.",
              "장기목표(3년 초과): 일정(월 또는 분기) 및 추정예산에 대한 구체적 계획을 수립하고 관련 내용을 확인한다.",
            ],
            choices: [
              {
                grade: "A",
                label: "단기, 중기, 장기 목표를 모두 수립하고 있는 경우",
              },
              { grade: "B", label: "단기, 중기 목표를 수립하고 있는 경우" },
              { grade: "C", label: "단기 목표를 수립하고 있는 경우" },
              { grade: "D", label: "목표 수립 계획이 있는 경우" },
              { grade: "E", label: "목표 수립 의사가 없는 경우" },
            ],
          },
        ],
      },
      {
        no: "1.2",
        name: "추진역량 및 투자계획",
        indicators: [
          {
            no: "1.2.1",
            name: "탄소중립 인적자원 전문성",
            type: "정성",
            target: "경영주",
            grade: "D",
            summary: [
              "평가기준일 현재 탄소중립 추진 전문인력(별표 2 탄소중립 전문성 수준 판단표를 준용)을 파악하여 평가한다.",
            ],
            reviewMethods: [
              "경영주를 제외한 사내 상주인력으로 수행팀의 부서장, 탄소감축 프로젝트 PM(Project Manager) 또는 전담담당자를 대상으로 한다.",
              "평가대상이 다수인 경우 최상위 기준의 인력으로 해당여부를 평가한다.",
            ],
            choices: [
              { grade: "A", label: "특급기술자" },
              { grade: "B", label: "고급기술자" },
              { grade: "C", label: "중급기술자" },
              { grade: "D", label: "초급기술자" },
              { grade: "E", label: "기타" },
            ],
          },
          {
            no: "1.2.2",
            name: "탄소중립 전문역량 향상 노력",
            type: "체크",
            target: "기업",
            grade: "E",
            summary: [
              "최근 3년 이내 탄소 중립 사내 교육, 워크숍, 외부 교육훈련의 경우 내부자료 및 결재문서, 이수증 등으로 평가한다.",
            ],
            checks: [
              {
                label:
                  "탄소중립 관련 사내 교육 또는 워크숍 등을 통한 역량강화한 사례가 있다.",
              },
              {
                label:
                  "외부기관에서 시행하는 탄소중립 관련 교육훈련에 참가하여 이수하였다.",
              },
              {
                label:
                  "탄소중립 관련 정보취득을 위한 소식지를 이메일, 우편 등으로 월 1회 이상 받는 경우",
              },
              {
                label: "탄소중립 관련 의무 교육을 수료하고 있는 경우",
                help: "mandatory-training",
              },
            ],
            scale: COUNT_SCALE,
          },
          {
            no: "1.2.3",
            name: "탄소감축 투자계획 수립",
            type: "체크",
            target: "기업",
            grade: "E",
            summary: [
              "탄소중립 이행을 위해 수립한 투자계획(자원 및 조달)을 평가한다.",
            ],
            reviewMethods: [
              "계획서의 탄소감축사업 세부내역의 예상 투자비를 확인하고 필요 재원을 확보할 수 있는지와 조달 비율을 확인한다.",
            ],
            choices: [
              { grade: "A", label: "전액 자기자본으로 투자계획을 수립한 경우" },
              {
                grade: "B",
                label: "70% 이상 자기자본으로 투자계획을 수립한 경우",
              },
              {
                grade: "C",
                label: "30% 이상 70% 미만 자기자본으로 투자계획을 수립한 경우",
              },
              {
                grade: "D",
                label: "30% 미만 자기자본으로 투자계획을 수립한 경우",
              },
              { grade: "E", label: "투자계획이 수립되어 있지 않은 경우" },
            ],
          },
        ],
      },
    ],
  },
  {
    no: "2",
    name: "탄소감축 수준평가",
    groups: [
      {
        no: "2.1",
        name: "탄소감축 수준",
        indicators: [
          {
            no: "2.1.1",
            name: "탄소배출량 산정",
            type: "정성",
            target: "경영주",
            grade: "E",
            summary: [
              "기업의 탄소 배출원이 구분 가능하고 배출량이 산정되어 있는지 평가한다.",
            ],
            checks: [
              {
                label:
                  "(Scope 1) 기업이 직접 소유하고 통제하는 배출원에서 발생하는 직접적인 온실가스 배출(1점)",
                score: "+1점",
              },
              {
                label:
                  "(Scope 2) 기업이 구입 및 사용한 전력, 열(온수, 스팀 등)의 생산 과정에서 발생하는 간접 온실가스 배출(1점)",
                score: "+1점",
              },
              {
                label:
                  "(Scope 3) 기업이 소유하고 관리하는 사업장(경계) 외 가치사슬에서 발생하는 간접적인 온실가스 배출(2점)",
                note: "* (예시) 중소기업 온실가스 배출원(Scope 1, 2, 3)",
                score: "+2점",
                help: "emission-source-example",
              },
            ],
            selected: true,
            scale: COUNT_SCALE,
          },
          {
            no: "2.1.2",
            name: "인벤토리 구축",
            type: "체크",
            target: "기업",
            grade: "E",
            summary: [
              "온실가스 인벤토리의 일관성, 완전성, 정확성, 투명성을 평가한다.",
            ],
            checks: [
              {
                label:
                  "(일관성) 연도별 활동자료 및 산정방법, 배출계수 적용의 일관성이 있다.",
                note: "* 기준년도 3년간 동일한 기준과 근거자료와 산정방법 등의 적용 여부 확인",
              },
              {
                label:
                  "(완전성) 기업 사업장 범위 내 탄소배출원의 누락 없이 모두 포함하여 산정하였다.",
                note: "* Scope 1의 경우 고정연소(LNG). 이동연소(휘발유, 경유), Scope 2의 경우 간접 배출(전기)는 대다수 중소기업의 일반적인 탄소배출원으로 인벤토리 포함 여부 확인",
              },
              {
                label:
                  "(정확성) 배출량 산정 오류를 최소화 및 산정방법의 정확성을 확보하였다.",
              },
              {
                label:
                  "(투명성) 인벤토리에 적용된 활동데이터의 증빙이 확인가능하며 일치한다.",
                note: "* 에너지 사용량 고지서, 거래내역서 등의 수치와 일치 여부 확인",
              },
            ],
            selected: true,
            scale: COUNT_SCALE,
          },
          {
            no: "2.1.3",
            name: "탄소감축 목표",
            type: "계량",
            target: "기업",
            grade: "E",
            summary: [
              "인벤토리 구축을 통해 산정된 기준연도 배출량 대비 3년간의 총 탄소감축 계획량 수준을 평가한다.",
            ],
            formula:
              "감축목표(%) = 3차년도 탄소감축량 ÷ 기준년도 평균 탄소배출량 × 100",
            fields: [
              { label: "3차년도 탄소감축량", value: "1000", unit: "tCO₂eq" },
              {
                label: "기준년도 평균 탄소배출량",
                value: "1000",
                unit: "tCO₂eq",
              },
            ],
            result: "계산 결과: 10.00% → A등급 해당",
            scale: {
              caption: "기준",
              values: [
                "감축목표 ≥ 10%",
                "8% ≤ 감축목표 < 10%",
                "6% ≤ 감축목표 < 8%",
                "4% ≤ 감축목표 < 6%",
                "감축목표 < 4%",
              ],
            },
          },
          {
            no: "2.1.4",
            name: "탄소감축 투자비율",
            type: "계량",
            target: "기업",
            grade: "E",
            summary: [
              "향후 3년간 탄소감축을 위해 에너지 사용분야, 제품 생산 공정 분야 등에서 탄소감축을 위해 계획된 투자비용을 매출액 대비 비율을 산정하여 평가한다.",
            ],
            formula:
              "투자비율(%) = 향후 3년간 온실가스 감축 투자계획금액 ÷ 기준년도 매출액 × 100",
            fields: [
              {
                label: "향후 3년간 온실가스 감축 투자계획금액",
                value: "300",
                unit: "백만원",
              },
              { label: "기준년도 매출액", value: "300", unit: "백만원" },
            ],
            result: "계산 결과: 10.00% → A등급 해당",
            scale: {
              caption: "기준",
              values: [
                "투자비율 ≥ 1.0%",
                "0.8% ≤ 투자비율 < 1.0%",
                "0.6% ≤ 투자비율 < 0.8%",
                "0.4% ≤ 투자비율 < 0.6%",
                "투자비율 < 0.4%",
              ],
            },
          },
        ],
      },
      {
        no: "2.2",
        name: "탄소감축 계획 및 사후관리",
        indicators: [
          {
            no: "2.2.1",
            name: "탄소감축 계획 적절성",
            type: "정성",
            target: "경영주",
            grade: "E",
            summary: [
              "탄소감축 계획의 구체적인 기술적 특성이 식별되고, 사업 전/후 변경을 제시하고 있는지 여부를 평가하며, 감축계획의 이행에 따른 감축시점이 파악되는지 평가한다.",
            ],
            checks: [
              {
                label:
                  "(감축목적) 탄소감축 사업 추진목적이 기술되고 확인 가능하다.",
                note: "* 탄소감축 계획이 도입되는 공정 및 시설 등의 문제점을 제시하고, 개선 주안점을 제시하는 등 사업의 목적을 명확하게 제시하고 있는지 평가",
              },
              {
                label: "(감축기술) 탄소감축 사업의 기술이 확인 가능하다.",
                note: "* 폐열회수, 고효율설비 도입, 인버터, 연료전환, 신재생에너지 도입, 수송수단의 전환, 바이오매스 도입 등 감축기술 분야가 명확히 식별되는지 평가(생산량 감소, 운영시간 감소 등 단순 운영조건 개선인 경우 미인정)",
              },
              {
                label: "(비교가능성) 탄소감축 사업 전후 비교가 가능하다.",
                note: "* 탄소감축 사업 이행전후 기술적 특성의 변경사항이 증빙자료로 평가",
              },
              {
                label: "(감축시점) 예상 감축시점이 구체적으로 명시되어 있다.",
                note: "* 탄소감축 계획 사업의 이행에 따른 완공시점이 예정 공정표 등 공정 개선 프로세스에 따라 명확하게 제시",
              },
            ],
            selected: true,
            scale: COUNT_SCALE,
          },
          {
            no: "2.2.2",
            name: "탄소감축 실행 가능성",
            type: "체크",
            target: "기업",
            grade: "E",
            summary: [
              "탄소감축계획 사업이 실제로 계획된 기간에 실행될 수 있는지 평가한다.",
            ],
            reviewMethods: [
              "사업시작일, 투자금을 증빙할 수 있는 계약서 확인",
              "사업시작일을 증빙할 수 있는 입금 사본증 확인",
              "사업시작일, 투자금을 증빙할 수 있는 승인된 기안서 확인",
              "사업완료시점을 증빙할 수 있는 개선공정 예정표 확인",
              "탄소감축 사업에 대한 구체적인 기술 공정도 확인",
            ],
            choices: [
              {
                grade: "A",
                label:
                  "탄소감축계획 사업에 대한 시작일에 대한 명확한 증빙자료를 제시한 경우",
              },
              {
                grade: "B",
                label:
                  "탄소감축계획 사업에 대한 시작일에 대한 비교적 명확한 증빙자료를 제시한 경우",
              },
              {
                grade: "C",
                label:
                  "투자금액, 프로젝트 추진일정, 공정 개선안 등이 담당자 선에서 계획이 있는 경우",
              },
              {
                grade: "D",
                label:
                  "투자금액, 프로젝트 추진일정, 공정 개선안 등이 불투명한 경우",
              },
              {
                grade: "E",
                label: "탄소감축계획 사업 추진 가능성이 없는 경우",
              },
            ],
          },
          {
            no: "2.2.3",
            name: "탄소감축 계획 정확성",
            type: "체크",
            target: "기업",
            grade: "E",
            summary: [
              "탄소감축계획에 적용된 활동자료 및 매개변수의 신뢰성 및 감축량 산정의 적정성을 평가한다.",
            ],
            reviewMethods: [
              "탄소감축량 산정에 적용된 개선 전 에너지 사용량, 생산량, 개선 후 에너지 사용량, 생산량 등에 측정기반의 실측값, 설비의 설계값(Spec sheet의 사양), 추정값 등을 확인한다.",
            ],
            choices: [
              {
                grade: "A",
                label:
                  "측정값 등 객관성을 확보한 데이터를 기준으로 탄소감축량을 산정한 경우",
              },
              {
                grade: "B",
                label:
                  "해당기기의 설계값, spec 등 활동자료를 사용하여 탄소감축량을 산정한 경우",
              },
              {
                grade: "C",
                label: "추정값 활동자료를 사용하여 탄소감축량을 산정한 경우",
              },
              {
                grade: "D",
                label: "수립된 탄소감축 계획의 정확성이 떨어지는 경우",
              },
              {
                grade: "E",
                label: "활동자료 및 매개변수의 근거를 확인할 수 없는 경우",
              },
            ],
          },
          {
            no: "2.2.4",
            name: "탄소감축 사후관리",
            type: "체크",
            target: "기업",
            grade: "E",
            summary: [
              "탄소감축계획의 관리를 위한 활동자료, 매개변수, 탄소감축량, 문제점 확인 및 개선방안 도입 등 사후관리 계획을 적절히 수립하였는지 평가한다.",
            ],
            reviewMethods: [
              "데이터 수집 방법(고지서 월별 데이터 수집, spec 자료 비교 등), 측정기기 관리 등에 대한 주기적인 관리 체계와 관련 데이터를 기록·보관하는 시스템을 관리하고 있는지 확인한다.",
            ],
            choices: [
              {
                grade: "A",
                label: "계획 탄소감축량과의 비교를 통한 사후관리 계획 수립",
              },
              { grade: "B", label: "탄소감축량 산정 관련 사후관리 계획 수립" },
              {
                grade: "C",
                label: "데이터 기록 및 보관에 관한 사후관리 계획 수립",
              },
              {
                grade: "D",
                label: "사후관리 계획을 수립하지 않으나 수립의사가 있는 경우",
              },
              {
                grade: "E",
                label: "사후관리 계획 미수립 및 수립의사가 없는 경우",
              },
            ],
          },
          {
            no: "2.2.5",
            name: "탄소감축 자발적 행동",
            type: "체크",
            target: "기업",
            grade: "E",
            summary: [
              "조직경계 내 탄소감축계획 이외 탄소중립과 관련된 추가 노력을 위한 계획이 수립되었거나 실행되고 있는지 평가한다.",
            ],
            checks: [
              {
                label:
                  "(기업의 탄소중립·환경 관련 정보 공개) 회사 홈페이지 및 정보 공개 제도에 참여하여 사업장의 환경 및 탄소 관련 정보를 제공 중이다.",
                note: "* 지속가능경영보고서, CDP(탄소정보공개 프로젝트), ESG(Environment Social Governane), 환경정보공개 등",
              },
              {
                label:
                  "(탄소중립 대응을 위한 유관기관과 자발적 협약 체결) 국내외 유관기관(정부부처, 지자체, 공공기관, 민간기관 등)과 탄소중립 대응을 위한 자발적 협약에 참여하고 협약 이행 활동을 추진 중이다.",
              },
              {
                label:
                  "(국내외 자발적 탄소감축 제도 참여) 국내외 자발적 탄소감축 제도에 감축사업을 등록하여 온실가스 감축을 수행하거나, 감축실적을 구매하여 탄소중립 이행에 활용 중이다.",
              },
              {
                label:
                  "(제품·기술에 대한 환경분야 국가인증 취득) 국가에서 관리하고 있는 환경분야 인증을 취득하였다(유효기간 이내).",
                help: "certification-type",
              },
              {
                label:
                  "(기업의 탄소배출 정보 신뢰성 확보) 기업이 구축한 온실가스 인벤토리에 대하여 제3자 전문 검증기관의 검증을 거쳐 신뢰성을 확보하였다.",
              },
            ],
            selected: true,
            scale: {
              caption: "기준 (개수)",
              values: [
                "5개 항목 충족",
                "4개 항목 충족",
                "3개 항목 충족",
                "2개 항목 충족",
                "1개 항목 충족",
              ],
            },
          },
        ],
      },
    ],
  },
]

/** 평가지표 작성 요약 표의 한 줄 */
export interface SummaryRow {
  no: string
  name: string
  grade: Grade
  score: string
}

export const EVALUATION_SUMMARY_ROWS: SummaryRow[] = [
  { no: "1.1.1", name: "탄소중립 방침 수립", grade: "A", score: "0.43" },
  {
    no: "1.1.2",
    name: "경영주의 탄소중립 이해도 및 적극성",
    grade: "B",
    score: "1.52",
  },
  { no: "1.1.3", name: "탄소중립 목표 수립", grade: "C", score: "1.59" },
  { no: "12.1", name: "탄소중립 인적자원 전문성", grade: "D", score: "5.8" },
  {
    no: "1.2.2",
    name: "탄소중립 전문역량 향상 노력",
    grade: "E",
    score: "2.79",
  },
  { no: "1.2.3", name: "탄소감축 투자계획 수립", grade: "E", score: "13.43" },
  { no: "2.1.1", name: "탄소배출량 산정", grade: "E", score: "7.41" },
  { no: "2.1.2", name: "인벤토리 구축", grade: "E", score: "4.16" },
  { no: "2.1.3", name: "탄소감축 목표", grade: "E", score: "3.59" },
  { no: "2.1.4", name: "탄소감축 투자비율", grade: "E", score: "5" },
  { no: "2.2.1", name: "탄소감축 계획 적절성", grade: "E", score: "2.5" },
  { no: "2.2.2", name: "탄소감축 실행 가능성", grade: "E", score: "5.25" },
  { no: "2.2.3", name: "탄소감축 계획 정확성", grade: "E", score: "2.63" },
  { no: "2.2.4", name: "탄소감축 사후관리", grade: "E", score: "8.07" },
  { no: "2.2.5", name: "탄소감축 자발적 행동", grade: "E", score: "3.54" },
]

export const EVALUATION_TOTAL_SCORE = "67.71"
export const EVALUATION_FINAL_GRADE: Grade = "A"
