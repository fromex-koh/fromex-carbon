// [퍼블리싱 노출용] 자가진단 STEP 2 "인벤토리 설정" 팝업의 분류 트리.
// 참고 화면(carbon-self-check-step2-inventory-v3)의 코드 체계를 그대로 옮겼다.
// 개발 연계 시 이 상수 대신 API 응답을 넣으면 된다.
//
// 대분류 9개 아래로 최대 4단계까지 내려가고, 잎(선택 대상)은 432개다.
// 코드는 상위 코드 + 두 자리 일련번호다. 예) E02 › E0201 › E020101

/** 분류 트리 한 마디. 잎이면 children 이 없다 */
export interface InventoryNode {
  code: string
  name: string
  /** 시안에서 붉은 [필수] 배지가 붙는 분류 */
  required?: boolean
  children?: InventoryNode[]
}

/** 대분류마다 붙는 Scope 배지. 시안은 등급마다 면색이 다르다 */
export const INVENTORY_SCOPE: Record<string, "S1-2" | "S3"> = {
  E01: "S1-2",
  E02: "S1-2",
  E03: "S1-2",
  E04: "S3",
  E05: "S3",
  E06: "S3",
  E07: "S3",
  E08: "S3",
  E09: "S3",
}

export const INVENTORY_TREE: InventoryNode[] = [
  {
    code: "E01",
    name: "에너지 사용",
    children: [
      {
        code: "E0101",
        name: "고정",
        children: [
          {
            code: "E010101",
            name: "원유",
            children: [
              {
                code: "E01010101",
                name: "원유",
              },
            ],
          },
          {
            code: "E010102",
            name: "휘발유",
            children: [
              {
                code: "E01010201",
                name: "휘발유",
              },
            ],
          },
          {
            code: "E010103",
            name: "보일러 등유",
            children: [
              {
                code: "E01010301",
                name: "보일러 등유",
              },
            ],
          },
          {
            code: "E010104",
            name: "실내 등유",
            children: [
              {
                code: "E01010401",
                name: "실내 등유",
              },
            ],
          },
          {
            code: "E010105",
            name: "경유",
            children: [
              {
                code: "E01010501",
                name: "경유",
              },
            ],
          },
          {
            code: "E010106",
            name: "B-A유",
            children: [
              {
                code: "E01010601",
                name: "B-A유",
              },
            ],
          },
          {
            code: "E010107",
            name: "B-B유",
            children: [
              {
                code: "E01010701",
                name: "B-B유",
              },
            ],
          },
          {
            code: "E010108",
            name: "B-C유",
            children: [
              {
                code: "E01010801",
                name: "B-C유",
              },
            ],
          },
          {
            code: "E010109",
            name: "프로판(LPG)",
            children: [
              {
                code: "E01010901",
                name: "프로판(LPG)",
              },
            ],
          },
          {
            code: "E010110",
            name: "부탄",
            children: [
              {
                code: "E01011001",
                name: "부탄",
              },
            ],
          },
          {
            code: "E010111",
            name: "나프타",
            children: [
              {
                code: "E01011101",
                name: "나프타",
              },
            ],
          },
          {
            code: "E010112",
            name: "천연가스(LNG)",
            children: [
              {
                code: "E01011201",
                name: "천연가스(LNG)",
              },
            ],
          },
          {
            code: "E010113",
            name: "도시가스(LNG)",
            children: [
              {
                code: "E01011301",
                name: "도시가스(LNG)",
              },
            ],
          },
          {
            code: "E010114",
            name: "도시가스(LPG)",
            children: [
              {
                code: "E01011401",
                name: "도시가스(LPG)",
              },
            ],
          },
          {
            code: "E010115",
            name: "국내무연탄",
            children: [
              {
                code: "E01011501",
                name: "국내무연탄",
              },
            ],
          },
          {
            code: "E010116",
            name: "연료용 수입무연탄",
            children: [
              {
                code: "E01011601",
                name: "연료용 수입무연탄",
              },
            ],
          },
          {
            code: "E010117",
            name: "유연탄(연료용)",
            children: [
              {
                code: "E01011701",
                name: "유연탄(연료용)",
              },
            ],
          },
          {
            code: "E010118",
            name: "아역청탄",
            children: [
              {
                code: "E01011801",
                name: "아역청탄",
              },
            ],
          },
          {
            code: "E010119",
            name: "코크스(석탄)",
            children: [
              {
                code: "E01011901",
                name: "코크스(석탄)",
              },
            ],
          },
        ],
      },
      {
        code: "E0102",
        name: "이동",
        children: [
          {
            code: "E010201",
            name: "휘발유(차량용)",
            children: [
              {
                code: "E01020101",
                name: "휘발유(차량용)",
              },
            ],
          },
          {
            code: "E010202",
            name: "경유(차량용)",
            children: [
              {
                code: "E01020201",
                name: "경유(차량용)",
              },
            ],
          },
          {
            code: "E010203",
            name: "부탄",
            children: [
              {
                code: "E01020301",
                name: "부탄",
              },
            ],
          },
          {
            code: "E010204",
            name: "실내 등유",
            children: [
              {
                code: "E01020401",
                name: "실내 등유",
              },
            ],
          },
          {
            code: "E010205",
            name: "CNG(차량)",
            children: [
              {
                code: "E01020501",
                name: "CNG(차량)",
              },
            ],
          },
          {
            code: "E010206",
            name: "LNG(차량)",
            children: [
              {
                code: "E01020601",
                name: "LNG(차량)",
              },
            ],
          },
        ],
      },
      {
        code: "E0103",
        name: "간접(전력·열)",
        children: [
          {
            code: "E010301",
            name: "전력(발전기준)",
            children: [
              {
                code: "E01030101",
                name: "전력(발전기준)",
              },
            ],
          },
          {
            code: "E010302",
            name: "전력(소비기준)",
            children: [
              {
                code: "E01030201",
                name: "전력(소비기준)",
              },
            ],
          },
          {
            code: "E010303",
            name: "스팀(열)",
            children: [
              {
                code: "E01030301",
                name: "스팀(열)",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    code: "E02",
    name: "폐기물처리",
    required: true,
    children: [
      {
        code: "E0201",
        name: "폐기물직접처리(하폐수)",
        children: [
          {
            code: "E020101",
            name: "하수",
            children: [
              {
                code: "E02010101",
                name: "혐기성",
                children: [
                  {
                    code: "E0201010101",
                    name: "유입수 유량",
                  },
                  {
                    code: "E0201010102",
                    name: "유입수 BOD 농도",
                  },
                  {
                    code: "E0201010103",
                    name: "유입수 총 질소 농도",
                  },
                  {
                    code: "E0201010104",
                    name: "방류수 유량",
                  },
                  {
                    code: "E0201010105",
                    name: "방류수 BOD 농도",
                  },
                  {
                    code: "E0201010106",
                    name: "방류수 총 질소 농도",
                  },
                  {
                    code: "E0201010107",
                    name: "슬러지 반출량",
                  },
                  {
                    code: "E0201010108",
                    name: "슬러지 BOD 농도",
                  },
                  {
                    code: "E0201010109",
                    name: "슬러지 총 질소 농도",
                  },
                ],
              },
              {
                code: "E02010102",
                name: "비혐기성",
                children: [
                  {
                    code: "E0201010201",
                    name: "유입수 유량",
                  },
                  {
                    code: "E0201010202",
                    name: "유입수 BOD 농도",
                  },
                  {
                    code: "E0201010203",
                    name: "유입수 총 질소 농도",
                  },
                  {
                    code: "E0201010204",
                    name: "방류수 유량",
                  },
                  {
                    code: "E0201010205",
                    name: "방류수 BOD 농도",
                  },
                  {
                    code: "E0201010206",
                    name: "방류수 총 질소 농도",
                  },
                  {
                    code: "E0201010207",
                    name: "슬러지 반출량",
                  },
                  {
                    code: "E0201010208",
                    name: "슬러지 BOD 농도",
                  },
                  {
                    code: "E0201010209",
                    name: "슬러지 총 질소 농도",
                  },
                ],
              },
            ],
          },
          {
            code: "E020102",
            name: "폐수",
            children: [
              {
                code: "E02010201",
                name: "슬러지의 혐기성 소화조",
                children: [
                  {
                    code: "E0201020101",
                    name: "유입수 유량",
                  },
                  {
                    code: "E0201020102",
                    name: "유입수 COD 농도",
                  },
                  {
                    code: "E0201020103",
                    name: "방류수 유량",
                  },
                  {
                    code: "E0201020104",
                    name: "방류수 COD 농도",
                  },
                  {
                    code: "E0201020105",
                    name: "슬러지 반출량",
                  },
                  {
                    code: "E0201020106",
                    name: "슬러지 COD 농도",
                  },
                ],
              },
              {
                code: "E02010202",
                name: "혐기성 반응조",
                children: [
                  {
                    code: "E0201020201",
                    name: "유입수 유량",
                  },
                  {
                    code: "E0201020202",
                    name: "유입수 COD 농도",
                  },
                  {
                    code: "E0201020203",
                    name: "방류수 유량",
                  },
                  {
                    code: "E0201020204",
                    name: "방류수 COD 농도",
                  },
                  {
                    code: "E0201020205",
                    name: "슬러지 반출량",
                  },
                  {
                    code: "E0201020206",
                    name: "슬러지 COD 농도",
                  },
                ],
              },
              {
                code: "E02010203",
                name: "혐기성 라군(2m 이하)",
                children: [
                  {
                    code: "E0201020301",
                    name: "유입수 유량",
                  },
                  {
                    code: "E0201020302",
                    name: "유입수 COD 농도",
                  },
                  {
                    code: "E0201020303",
                    name: "방류수 유량",
                  },
                  {
                    code: "E0201020304",
                    name: "방류수 COD 농도",
                  },
                  {
                    code: "E0201020305",
                    name: "슬러지 반출량",
                  },
                  {
                    code: "E0201020306",
                    name: "슬러지 COD 농도",
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        code: "E0202",
        name: "폐기물직접처리(고형폐기물)",
        children: [
          {
            code: "E020201",
            name: "매립",
            children: [
              {
                code: "E02020101",
                name: "바이오가스 회수량",
              },
              {
                code: "E02020102",
                name: "바이오가스 연평균 메탄농도",
              },
              {
                code: "E02020103",
                name: "매립지표면 산화율",
              },
            ],
          },
          {
            code: "E020202",
            name: "생물학적 처리",
            children: [
              {
                code: "E02020201",
                name: "퇴비화",
                children: [
                  {
                    code: "E0202020101",
                    name: "유기폐기물량",
                  },
                ],
              },
              {
                code: "E02020202",
                name: "혐기성 소화",
                children: [
                  {
                    code: "E0202020201",
                    name: "유기폐기물량",
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        code: "E0203",
        name: "폐기물직접처리(소각)",
        children: [
          {
            code: "E020301",
            name: "소각 고상(생활폐기물)",
            children: [
              {
                code: "E02030101",
                name: "종이류",
              },
              {
                code: "E02030102",
                name: "섬유류",
              },
              {
                code: "E02030103",
                name: "음식물류",
              },
              {
                code: "E02030104",
                name: "나무류",
              },
              {
                code: "E02030105",
                name: "정원 및 공원 폐기물류",
              },
              {
                code: "E02030106",
                name: "기저귀",
              },
              {
                code: "E02030107",
                name: "고무 피혁류",
              },
              {
                code: "E02030108",
                name: "플라스틱류",
              },
              {
                code: "E02030109",
                name: "금속류",
              },
              {
                code: "E02030110",
                name: "유리류",
              },
              {
                code: "E02030111",
                name: "기타 생활폐기물",
              },
            ],
          },
          {
            code: "E020302",
            name: "소각 고상(사업장폐기물)",
            children: [
              {
                code: "E02030201",
                name: "음식물류(음식, 음료 및 담배)",
              },
              {
                code: "E02030202",
                name: "폐섬유류",
              },
              {
                code: "E02030203",
                name: "폐목재류",
              },
              {
                code: "E02030204",
                name: "폐지류",
              },
              {
                code: "E02030205",
                name: "석유제품, 용매, 플라스틱류",
              },
              {
                code: "E02030206",
                name: "폐합성고무",
              },
              {
                code: "E02030207",
                name: "건설 및 파쇄 잔재물",
              },
              {
                code: "E02030208",
                name: "기타 사업장 폐기물",
              },
              {
                code: "E02030209",
                name: "하수 슬러지(오니)",
              },
              {
                code: "E02030210",
                name: "폐수 슬러지(오니)",
              },
              {
                code: "E02030211",
                name: "의료폐기물",
              },
            ],
          },
          {
            code: "E020303",
            name: "소각 액상",
            children: [
              {
                code: "E02030301",
                name: "생활폐기물",
                children: [
                  {
                    code: "E0203030101",
                    name: "액상폐기물",
                  },
                ],
              },
              {
                code: "E02030302",
                name: "사업장폐기물",
                children: [
                  {
                    code: "E0203030201",
                    name: "액상폐기물",
                  },
                ],
              },
              {
                code: "E02030303",
                name: "하수슬러지",
                children: [
                  {
                    code: "E0203030301",
                    name: "액상폐기물",
                  },
                ],
              },
            ],
          },
          {
            code: "E020304",
            name: "소각 기상",
            children: [
              {
                code: "E02030401",
                name: "폐가스(정유·석유화학)",
              },
              {
                code: "E02030402",
                name: "바이오가스(메탄)",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    code: "E03",
    name: "공정배출",
    required: true,
    children: [
      {
        code: "E0301",
        name: "시멘트 생산",
        children: [
          {
            code: "E030101",
            name: "클링커 생산량",
          },
          {
            code: "E030102",
            name: "킬른먼지(CKD) 반출량",
          },
        ],
      },
      {
        code: "E0302",
        name: "석회 생산",
        children: [
          {
            code: "E030201",
            name: "생석회",
          },
          {
            code: "E030202",
            name: "경소백운석(고토석회)",
          },
        ],
      },
      {
        code: "E0303",
        name: "탄산염 기타 공정사용",
        children: [
          {
            code: "E030301",
            name: "석회석",
          },
          {
            code: "E030302",
            name: "마그네사이트",
          },
          {
            code: "E030303",
            name: "백운석",
          },
          {
            code: "E030304",
            name: "능철광",
          },
          {
            code: "E030305",
            name: "철백운석",
          },
          {
            code: "E030306",
            name: "망간광",
          },
          {
            code: "E030307",
            name: "소다회",
          },
        ],
      },
      {
        code: "E0304",
        name: "유리 생산",
        children: [
          {
            code: "E030401",
            name: "판유리",
          },
          {
            code: "E030402",
            name: "유리용기(납유리)",
          },
          {
            code: "E030403",
            name: "유리용기(착색유리)",
          },
          {
            code: "E030404",
            name: "유리장섬유",
          },
          {
            code: "E030405",
            name: "유리단섬유",
          },
          {
            code: "E030406",
            name: "브라운관용유리(Panel)",
          },
          {
            code: "E030407",
            name: "브라운관용유리(Funnel)",
          },
          {
            code: "E030408",
            name: "가정용 유리제품",
          },
          {
            code: "E030409",
            name: "실험용기, 약병",
          },
          {
            code: "E030410",
            name: "전등용유리",
          },
        ],
      },
      {
        code: "E0305",
        name: "암모니아 생산",
        children: [
          {
            code: "E030501",
            name: "전통적 개질공정(천연가스)",
          },
          {
            code: "E030502",
            name: "과잉 개질공정(천연가스)",
          },
          {
            code: "E030503",
            name: "자열 개질공정(천연가스)",
          },
          {
            code: "E030504",
            name: "부분산화",
          },
        ],
      },
      {
        code: "E0306",
        name: "카바이드 생산_탄화칼슘",
        children: [
          {
            code: "E030601",
            name: "카바이드 생산량",
          },
        ],
      },
      {
        code: "E0307",
        name: "카바이드 생산_탄화규소",
        children: [
          {
            code: "E030701",
            name: "원료(산화규소) 소비량",
          },
        ],
      },
      {
        code: "E0308",
        name: "소다회 생산",
        children: [
          {
            code: "E030801",
            name: "트로나 광석 사용량",
          },
          {
            code: "E030802",
            name: "소다회 생산량",
          },
        ],
      },
      {
        code: "E0309",
        name: "석유화학 생산 (제품)",
        children: [
          {
            code: "E030901",
            name: "메탄올(CH3OH)",
          },
          {
            code: "E030902",
            name: "에틸렌디클로라이드(EDC)",
          },
          {
            code: "E030903",
            name: "염화비닐 모노머(VCM)",
          },
          {
            code: "E030904",
            name: "EDC/VCM 통합공정",
          },
          {
            code: "E030905",
            name: "에틸렌옥사이드(EO)",
          },
          {
            code: "E030906",
            name: "아크릴로니트릴(AN)",
          },
          {
            code: "E030907",
            name: "카본블랙(CB)",
          },
        ],
      },
      {
        code: "E0310",
        name: "석유화학 생산 (원료·생산물)",
        children: [
          {
            code: "E031001",
            name: "아세토니트릴(CH3CN)",
          },
          {
            code: "E031002",
            name: "아크릴로니트릴(AN)",
          },
          {
            code: "E031003",
            name: "부타디엔(C4H6)",
          },
          {
            code: "E031004",
            name: "카본블랙(CB)",
          },
          {
            code: "E031005",
            name: "카본블랙(CB)원료",
          },
          {
            code: "E031006",
            name: "에탄(C2H6)",
          },
          {
            code: "E031007",
            name: "에틸렌디클로라이드(EDC)",
          },
          {
            code: "E031008",
            name: "에틸렌글리콜(EG)",
          },
          {
            code: "E031009",
            name: "에틸렌옥사이드(EO)",
          },
          {
            code: "E031010",
            name: "시안화수소(HCN)",
          },
          {
            code: "E031011",
            name: "메탄올(CH3OH)",
          },
          {
            code: "E031012",
            name: "CH4(메탄)",
          },
          {
            code: "E031013",
            name: "프로판",
          },
          {
            code: "E031014",
            name: "프로필렌(C3H6)",
          },
          {
            code: "E031015",
            name: "염화비닐 모노머(VCM)",
          },
          {
            code: "E031016",
            name: "에틸렌",
          },
        ],
      },
      {
        code: "E0311",
        name: "철강 생산 (철)",
        children: [
          {
            code: "E031101",
            name: "소결물 생산",
          },
          {
            code: "E031102",
            name: "코크스 오븐",
          },
          {
            code: "E031103",
            name: "선철(pig iron) 생산 (고로)",
          },
          {
            code: "E031104",
            name: "직접 환원철(DRI) 생산",
          },
          {
            code: "E031105",
            name: "펠렛 생산",
          },
        ],
      },
      {
        code: "E0312",
        name: "철강 생산 (강)",
        children: [
          {
            code: "E031201",
            name: "전로(BOF)",
          },
          {
            code: "E031202",
            name: "전기로(EAF)",
          },
          {
            code: "E031203",
            name: "평로(OHF)",
          },
          {
            code: "E031204",
            name: "국제 기준 값(65% BOF, 30% EAF, 5% OHF 기준)",
          },
        ],
      },
      {
        code: "E0313",
        name: "전기로 작동방식",
        children: [
          {
            code: "E031301",
            name: "작동방식 선택",
          },
        ],
      },
      {
        code: "E0314",
        name: "합금철 생산",
        children: [
          {
            code: "E031401",
            name: "합금철(ferrosilicon) 45% Si",
          },
          {
            code: "E031402",
            name: "합금철(ferrosilicon) 65% Si",
          },
          {
            code: "E031403",
            name: "합금철(ferrosilicon) 75% Si",
          },
          {
            code: "E031404",
            name: "합금철(ferrosilicon) 90% Si",
          },
          {
            code: "E031405",
            name: "망간철(ferromanganese) (7% C)",
          },
          {
            code: "E031406",
            name: "망간철(ferromanganese) (1% C)",
          },
          {
            code: "E031407",
            name: "Silicomanganese",
          },
          {
            code: "E031408",
            name: "실리콘메탈",
          },
        ],
      },
      {
        code: "E0315",
        name: "합금철 생산 (환원제)",
        children: [
          {
            code: "E031501",
            name: "석탄",
          },
          {
            code: "E031502",
            name: "코크스",
          },
          {
            code: "E031503",
            name: "가소성 전극봉(Prebaked electrode)",
          },
          {
            code: "E031504",
            name: "전극봉 페이스트(Electrode paste)",
          },
          {
            code: "E031505",
            name: "석유코크스",
          },
        ],
      },
    ],
  },
  {
    code: "E04",
    name: "구매한 재화, 용역",
    children: [
      {
        code: "E0401",
        name: "용수",
        children: [
          {
            code: "E040101",
            name: "공업용수",
          },
          {
            code: "E040102",
            name: "상수",
          },
        ],
      },
      {
        code: "E0402",
        name: "건축자재",
        children: [
          {
            code: "E040201",
            name: "1종 포틀랜드 시멘트",
          },
          {
            code: "E040202",
            name: "2종 포틀랜드 시멘트",
          },
          {
            code: "E040203",
            name: "3종 포틀랜드 시멘트",
          },
          {
            code: "E040204",
            name: "4종 포틀랜드 시멘트",
          },
          {
            code: "E040205",
            name: "강화유리",
          },
          {
            code: "E040206",
            name: "고로 슬래그 시멘트",
          },
          {
            code: "E040207",
            name: "고로슬래그 미분말",
          },
          {
            code: "E040208",
            name: "모래",
          },
          {
            code: "E040209",
            name: "바다모래",
          },
          {
            code: "E040210",
            name: "산림모래",
          },
          {
            code: "E040211",
            name: "석고보드",
          },
          {
            code: "E040212",
            name: "석회석",
          },
          {
            code: "E040213",
            name: "순환 굵은 골재",
          },
          {
            code: "E040214",
            name: "순환 잔골재",
          },
          {
            code: "E040215",
            name: "암면",
          },
          {
            code: "E040216",
            name: "우레탄방수재",
          },
          {
            code: "E040217",
            name: "유리면",
          },
          {
            code: "E040218",
            name: "육상모래",
          },
          {
            code: "E040219",
            name: "자갈",
          },
          {
            code: "E040220",
            name: "타일",
          },
          {
            code: "E040221",
            name: "파티클보드(재활용원료)",
          },
          {
            code: "E040222",
            name: "판유리",
          },
          {
            code: "E040223",
            name: "하천모래",
          },
          {
            code: "E040224",
            name: "합판",
          },
        ],
      },
      {
        code: "E0403",
        name: "고무",
        children: [
          {
            code: "E040301",
            name: "스티렌 부타디엔 고무",
          },
          {
            code: "E040302",
            name: "에틸렌 프로필렌 디엔 고무",
          },
          {
            code: "E040303",
            name: "천연고무",
          },
          {
            code: "E040304",
            name: "폴리부타디엔 고무",
          },
        ],
      },
      {
        code: "E0404",
        name: "금속",
        children: [
          {
            code: "E040401",
            name: "구리",
          },
          {
            code: "E040402",
            name: "납",
          },
          {
            code: "E040403",
            name: "니켈",
          },
          {
            code: "E040404",
            name: "스테인레스강",
          },
          {
            code: "E040405",
            name: "아연",
          },
          {
            code: "E040406",
            name: "알루미늄 박",
          },
          {
            code: "E040407",
            name: "알루미늄 판",
          },
          {
            code: "E040408",
            name: "알루미늄 빌렛(A6061, A6063)",
          },
          {
            code: "E040409",
            name: "알루미늄주괴(재활용원료)",
          },
          {
            code: "E040410",
            name: "알루미늄칩(재활용원료)",
          },
          {
            code: "E040411",
            name: "알루미늄화성박",
          },
          {
            code: "E040412",
            name: "탄소강",
          },
          {
            code: "E040413",
            name: "페라이트 마그네트",
          },
          {
            code: "E040414",
            name: "황동봉",
          },
          {
            code: "E040415",
            name: "황동조",
          },
        ],
      },
      {
        code: "E0405",
        name: "기초화학물질",
        children: [
          {
            code: "E040501",
            name: "1,3-부타디엔",
          },
          {
            code: "E040502",
            name: "1,4-부탄디올",
          },
          {
            code: "E040503",
            name: "DINP",
          },
          {
            code: "E040504",
            name: "DOP",
          },
          {
            code: "E040505",
            name: "가성소다(50%)",
          },
          {
            code: "E040506",
            name: "가성칼륨",
          },
          {
            code: "E040507",
            name: "경질탄산칼슘",
          },
          {
            code: "E040508",
            name: "규사",
          },
          {
            code: "E040509",
            name: "규산나트륨",
          },
          {
            code: "E040510",
            name: "글리세린(재활용원료)",
          },
          {
            code: "E040511",
            name: "나프타",
          },
          {
            code: "E040512",
            name: "노말-부탄올",
          },
          {
            code: "E040513",
            name: "니트로벤젠",
          },
          {
            code: "E040514",
            name: "디메틸테레프탈레이트",
          },
          {
            code: "E040515",
            name: "메탄올",
          },
          {
            code: "E040516",
            name: "무수불화수소",
          },
          {
            code: "E040517",
            name: "발연황산_98%",
          },
          {
            code: "E040518",
            name: "벤젠",
          },
          {
            code: "E040519",
            name: "부탄",
          },
          {
            code: "E040520",
            name: "불포화폴리에스테르계 도료",
          },
          {
            code: "E040521",
            name: "불화수소",
          },
          {
            code: "E040522",
            name: "비스페놀-A",
          },
          {
            code: "E040523",
            name: "산소",
          },
          {
            code: "E040524",
            name: "산화아연",
          },
          {
            code: "E040525",
            name: "산화철",
          },
          {
            code: "E040526",
            name: "산화칼슘",
          },
          {
            code: "E040527",
            name: "소다회",
          },
          {
            code: "E040528",
            name: "수산화칼슘",
          },
          {
            code: "E040529",
            name: "수소",
          },
          {
            code: "E040530",
            name: "스티렌",
          },
          {
            code: "E040531",
            name: "스티렌 아크릴로니트릴",
          },
          {
            code: "E040532",
            name: "식용 에탄올",
          },
          {
            code: "E040533",
            name: "신나류",
          },
          {
            code: "E040534",
            name: "아닐린",
          },
          {
            code: "E040535",
            name: "아르곤",
          },
          {
            code: "E040536",
            name: "아세톤",
          },
          {
            code: "E040537",
            name: "아크릴로니트릴",
          },
          {
            code: "E040538",
            name: "알킬벤젠술폰산염",
          },
          {
            code: "E040539",
            name: "암모니아",
          },
          {
            code: "E040540",
            name: "액체 이산화탄소",
          },
          {
            code: "E040541",
            name: "에틸렌",
          },
          {
            code: "E040542",
            name: "에틸렌 디클로라이드",
          },
          {
            code: "E040543",
            name: "에틸렌글리콜",
          },
          {
            code: "E040544",
            name: "에틸렌옥사이드",
          },
          {
            code: "E040545",
            name: "에폭시수지",
          },
          {
            code: "E040546",
            name: "에피클로로히드린",
          },
          {
            code: "E040547",
            name: "염산(35%)",
          },
          {
            code: "E040548",
            name: "염소",
          },
          {
            code: "E040549",
            name: "염화나트륨",
          },
          {
            code: "E040550",
            name: "염화비닐",
          },
          {
            code: "E040551",
            name: "염화암모늄",
          },
          {
            code: "E040552",
            name: "염화칼륨",
          },
          {
            code: "E040553",
            name: "옥탄올",
          },
          {
            code: "E040554",
            name: "이소-부탄올",
          },
          {
            code: "E040555",
            name: "자일렌",
          },
          {
            code: "E040556",
            name: "제올라이트",
          },
          {
            code: "E040557",
            name: "중질탄산칼슘",
          },
          {
            code: "E040558",
            name: "지방산(재활용원료)",
          },
          {
            code: "E040559",
            name: "질산",
          },
          {
            code: "E040560",
            name: "질산나트륨",
          },
          {
            code: "E040561",
            name: "질소",
          },
          {
            code: "E040562",
            name: "차아염소산나트륨(12%)",
          },
          {
            code: "E040563",
            name: "청화소다",
          },
          {
            code: "E040564",
            name: "카본블랙",
          },
          {
            code: "E040565",
            name: "카프로락탐",
          },
          {
            code: "E040566",
            name: "탄산칼륨",
          },
          {
            code: "E040567",
            name: "톨루엔",
          },
          {
            code: "E040568",
            name: "트리에틸렌글리콜(TEG)",
          },
          {
            code: "E040569",
            name: "페놀",
          },
          {
            code: "E040570",
            name: "포름알데히드(37%)",
          },
          {
            code: "E040571",
            name: "폴리아마이드6",
          },
          {
            code: "E040572",
            name: "폴리아마이드66",
          },
          {
            code: "E040573",
            name: "폴리우레탄",
          },
          {
            code: "E040574",
            name: "프로필렌",
          },
          {
            code: "E040575",
            name: "프로필렌글리콜",
          },
          {
            code: "E040576",
            name: "프로필렌옥사이드",
          },
          {
            code: "E040577",
            name: "황산_98%",
          },
          {
            code: "E040578",
            name: "황산나트륨",
          },
        ],
      },
      {
        code: "E0406",
        name: "펄프 및 종이",
        children: [
          {
            code: "E040601",
            name: "골판지",
          },
          {
            code: "E040602",
            name: "신문용지",
          },
          {
            code: "E040603",
            name: "인쇄용지(신재)",
          },
          {
            code: "E040604",
            name: "인쇄용지(폐지포함)",
          },
          {
            code: "E040605",
            name: "크라프트지",
          },
          {
            code: "E040606",
            name: "황산염표백펄프",
          },
        ],
      },
      {
        code: "E0407",
        name: "플라스틱",
        children: [
          {
            code: "E040701",
            name: "고밀도 폴리에틸렌",
          },
          {
            code: "E040702",
            name: "고밀도 폴리에틸렌 필름 원지",
          },
          {
            code: "E040703",
            name: "내충격성 폴리스티렌",
          },
          {
            code: "E040704",
            name: "발포 폴리스티렌",
          },
          {
            code: "E040705",
            name: "발포 폴리프로필렌",
          },
          {
            code: "E040706",
            name: "아크로니트릴 부타디엔 스틸렌",
          },
          {
            code: "E040707",
            name: "에틸비닐아세테이트(EVA)",
          },
          {
            code: "E040708",
            name: "저밀도 폴리에틸렌",
          },
          {
            code: "E040709",
            name: "저밀도 폴리에틸렌 필름 원지",
          },
          {
            code: "E040710",
            name: "폴리메틸 메타크릴레이트",
          },
          {
            code: "E040711",
            name: "폴리부타디엔",
          },
          {
            code: "E040712",
            name: "폴리부틸렌 테레프탈레이트",
          },
          {
            code: "E040713",
            name: "폴리비닐클로라이드",
          },
          {
            code: "E040714",
            name: "폴리스티렌",
          },
          {
            code: "E040715",
            name: "폴리에틸렌 나프탈레이트(PEN)",
          },
          {
            code: "E040716",
            name: "폴리에틸렌 테레프탈레이트",
          },
          {
            code: "E040717",
            name: "폴리옥시메틸렌",
          },
          {
            code: "E040718",
            name: "폴리프로필렌",
          },
        ],
      },
      {
        code: "E0408",
        name: "전기부품",
        children: [
          {
            code: "E040801",
            name: "가용성 금속박막 리드저항",
          },
          {
            code: "E040802",
            name: "경성 인쇄회로기판",
          },
          {
            code: "E040803",
            name: "금속박막 리드저항 1/8W",
          },
          {
            code: "E040804",
            name: "기기선 UL 1007/1569",
          },
          {
            code: "E040805",
            name: "나동선",
          },
          {
            code: "E040806",
            name: "다이오드",
          },
          {
            code: "E040807",
            name: "리드선 SDA 0.5mm",
          },
          {
            code: "E040808",
            name: "리드선 SDA 0.6mm",
          },
          {
            code: "E040809",
            name: "리드선 TDA 0.6mm",
          },
          {
            code: "E040810",
            name: "망간전지_AA",
          },
          {
            code: "E040811",
            name: "망간전지_AAA",
          },
          {
            code: "E040812",
            name: "무연솔더",
          },
          {
            code: "E040813",
            name: "산화금속박막 리드저항",
          },
          {
            code: "E040814",
            name: "알카라인_AA",
          },
          {
            code: "E040815",
            name: "알카라인_AAA",
          },
          {
            code: "E040816",
            name: "연성 인쇄회로기판",
          },
          {
            code: "E040817",
            name: "와이어하니스",
          },
          {
            code: "E040818",
            name: "전해콘덴서",
          },
          {
            code: "E040819",
            name: "탄소박막 리드저항 1/8W",
          },
          {
            code: "E040820",
            name: "트랜지스터",
          },
          {
            code: "E040821",
            name: "PVC 전선",
          },
        ],
      },
      {
        code: "E0409",
        name: "기타",
        children: [
          {
            code: "E040901",
            name: "폐수 처리",
          },
          {
            code: "E040902",
            name: "하수 처리",
          },
          {
            code: "E040903",
            name: "OPP테이프",
          },
          {
            code: "E040904",
            name: "갈색 유리병",
          },
          {
            code: "E040905",
            name: "건식 단미사료(재활용 원료)",
          },
          {
            code: "E040906",
            name: "금속잉크",
          },
          {
            code: "E040907",
            name: "녹색 유리병",
          },
          {
            code: "E040908",
            name: "방청유",
          },
          {
            code: "E040909",
            name: "백설탕",
          },
          {
            code: "E040910",
            name: "습식 단미사료(재활용 원료)",
          },
          {
            code: "E040911",
            name: "에어캡",
          },
          {
            code: "E040912",
            name: "옵셋잉크",
          },
          {
            code: "E040913",
            name: "우드칩",
          },
          {
            code: "E040914",
            name: "재생 활성탄",
          },
          {
            code: "E040915",
            name: "투명 유리병",
          },
          {
            code: "E040916",
            name: "호기성 퇴비(재활용 원료)",
          },
          {
            code: "E040917",
            name: "활성탄(석탄질원료)",
          },
          {
            code: "E040918",
            name: "활성탄(식물질원료)",
          },
          {
            code: "E040919",
            name: "황설탕",
          },
          {
            code: "E040920",
            name: "흑설탕",
          },
        ],
      },
    ],
  },
  {
    code: "E05",
    name: "연료, 에너지 활동",
    children: [
      {
        code: "E0501",
        name: "에너지 생산단계",
        children: [
          {
            code: "E050101",
            name: "경유",
          },
          {
            code: "E050102",
            name: "등유",
          },
          {
            code: "E050103",
            name: "무연탄",
          },
          {
            code: "E050104",
            name: "벙커C유",
          },
          {
            code: "E050105",
            name: "석탄",
          },
          {
            code: "E050106",
            name: "스팀(열병합발전)",
          },
          {
            code: "E050107",
            name: "액화석유가스(LPG)",
          },
          {
            code: "E050108",
            name: "전기",
          },
          {
            code: "E050109",
            name: "중유",
          },
          {
            code: "E050110",
            name: "천연가스",
          },
          {
            code: "E050111",
            name: "휘발유",
          },
        ],
      },
    ],
  },
  {
    code: "E06",
    name: "운송, 유통",
    children: [
      {
        code: "E0601",
        name: "육상",
        children: [
          {
            code: "E060101",
            name: "BCT",
          },
          {
            code: "E060102",
            name: "기차",
          },
          {
            code: "E060103",
            name: "컨테이너",
          },
          {
            code: "E060104",
            name: "탱크로리",
          },
          {
            code: "E060105",
            name: "트럭",
          },
        ],
      },
      {
        code: "E0602",
        name: "해상",
        children: [
          {
            code: "E060201",
            name: "내항선 벌크",
          },
          {
            code: "E060202",
            name: "외항선 벌크",
          },
          {
            code: "E060203",
            name: "외항선 컨테이너",
          },
          {
            code: "E060204",
            name: "외항선 탱커",
          },
        ],
      },
      {
        code: "E0603",
        name: "항공",
        children: [
          {
            code: "E060301",
            name: "항공",
          },
        ],
      },
    ],
  },
  {
    code: "E07",
    name: "폐기물 배출",
    children: [
      {
        code: "E0701",
        name: "매립",
        children: [
          {
            code: "E070101",
            name: "비활성물질 위생매립",
          },
          {
            code: "E070102",
            name: "생활폐기물 위생매립",
          },
          {
            code: "E070103",
            name: "유기성 폐기물 매립",
          },
          {
            code: "E070104",
            name: "유해폐기물 매립",
          },
          {
            code: "E070105",
            name: "일반폐기물 매립",
          },
          {
            code: "E070106",
            name: "폐고무·피혁 매립",
          },
          {
            code: "E070107",
            name: "폐금속 매립",
          },
          {
            code: "E070108",
            name: "폐목 매립",
          },
          {
            code: "E070109",
            name: "폐유리 매립",
          },
          {
            code: "E070110",
            name: "폐지 매립",
          },
          {
            code: "E070111",
            name: "폐콘크리트 매립",
          },
          {
            code: "E070112",
            name: "혼합폐플라스틱 매립",
          },
        ],
      },
      {
        code: "E0702",
        name: "소각",
        children: [
          {
            code: "E070201",
            name: "생활폐기물 소각",
          },
          {
            code: "E070202",
            name: "유기성폐기물 소각",
          },
          {
            code: "E070203",
            name: "지정폐기물 소각",
          },
          {
            code: "E070204",
            name: "폐고무 소각",
          },
          {
            code: "E070205",
            name: "폐금속 소각",
          },
          {
            code: "E070206",
            name: "폐목 소각",
          },
          {
            code: "E070207",
            name: "폐유리 소각",
          },
          {
            code: "E070208",
            name: "폐지 소각",
          },
          {
            code: "E070209",
            name: "혼합폐플라스틱 소각",
          },
        ],
      },
      {
        code: "E0703",
        name: "재활용",
        children: [
          {
            code: "E070301",
            name: "음식물류폐기물 재활용",
          },
          {
            code: "E070302",
            name: "폐골판지 재활용",
          },
          {
            code: "E070303",
            name: "폐목 재활용",
          },
          {
            code: "E070304",
            name: "폐비철금속 재활용",
          },
          {
            code: "E070305",
            name: "폐유리 재활용",
          },
          {
            code: "E070306",
            name: "폐지 재활용",
          },
          {
            code: "E070307",
            name: "폐철금속 재활용",
          },
          {
            code: "E070308",
            name: "폐콘크리트 재활용",
          },
          {
            code: "E070309",
            name: "혼합폐플라스틱 재활용",
          },
        ],
      },
      {
        code: "E0704",
        name: "기타",
        children: [
          {
            code: "E070401",
            name: "폐수 처리",
          },
          {
            code: "E070402",
            name: "하수 처리",
          },
          {
            code: "E070403",
            name: "OPP테이프",
          },
          {
            code: "E070404",
            name: "갈색 유리병",
          },
          {
            code: "E070405",
            name: "건식 단미사료(재활용 원료)",
          },
          {
            code: "E070406",
            name: "금속잉크",
          },
          {
            code: "E070407",
            name: "녹색 유리병",
          },
          {
            code: "E070408",
            name: "방청유",
          },
          {
            code: "E070409",
            name: "백설탕",
          },
          {
            code: "E070410",
            name: "습식 단미사료(재활용 원료)",
          },
          {
            code: "E070411",
            name: "에어캡",
          },
          {
            code: "E070412",
            name: "옵셋잉크",
          },
          {
            code: "E070413",
            name: "우드칩",
          },
          {
            code: "E070414",
            name: "재생 활성탄",
          },
          {
            code: "E070415",
            name: "투명 유리병",
          },
          {
            code: "E070416",
            name: "호기성 퇴비(재활용 원료)",
          },
          {
            code: "E070417",
            name: "활성탄(석탄질원료)",
          },
          {
            code: "E070418",
            name: "활성탄(식물질원료)",
          },
          {
            code: "E070419",
            name: "황설탕",
          },
          {
            code: "E070420",
            name: "흑설탕",
          },
        ],
      },
    ],
  },
  {
    code: "E08",
    name: "출장",
    children: [
      {
        code: "E0801",
        name: "해외출장",
        children: [
          {
            code: "E080101",
            name: "항공기 이용",
          },
        ],
      },
    ],
  },
  {
    code: "E09",
    name: "직원 출퇴근",
    children: [
      {
        code: "E0901",
        name: "통근",
        children: [
          {
            code: "E090101",
            name: "통근버스",
          },
        ],
      },
    ],
  },
]

/**
 * 항목별 입력 단위. 배출량 산출 입력 표에서 입력 칸 뒤에 붙는다.
 * [퍼블리싱 노출용] 참고 화면(carbon-self-check-step2-inventory-v3)의 값을 그대로 옮겼다.
 */
export const INVENTORY_UNIT: Record<string, string> = {
  E01010101: "L",
  E01010201: "L",
  E01010301: "L",
  E01010401: "L",
  E01010501: "L",
  E01010601: "L",
  E01010701: "L",
  E01010801: "L",
  E01010901: "kg",
  E01011001: "kg",
  E01011101: "L",
  E01011201: "Nm³",
  E01011301: "Nm³",
  E01011401: "Nm³",
  E01011501: "ton",
  E01011601: "ton",
  E01011701: "ton",
  E01011801: "ton",
  E01011901: "ton",
  E01020101: "L",
  E01020201: "L",
  E01020301: "kg",
  E01020401: "L",
  E01020501: "Nm³",
  E01020601: "Nm³",
  E01030101: "kWh",
  E01030201: "kWh",
  E01030301: "MJ",
  E0201010101: "㎥",
  E0201010102: "mg-BOD/L",
  E0201010103: "mg-T-N/L",
  E0201010104: "㎥",
  E0201010105: "mg-BOD/L",
  E0201010106: "mg-T-N/L",
  E0201010107: "㎥",
  E0201010108: "mg-BOD/L",
  E0201010109: "mg-T-N/L",
  E0201010201: "㎥",
  E0201010202: "mg-BOD/L",
  E0201010203: "mg-T-N/L",
  E0201010204: "㎥",
  E0201010205: "mg-BOD/L",
  E0201010206: "mg-T-N/L",
  E0201010207: "㎥",
  E0201010208: "mg-BOD/L",
  E0201010209: "mg-T-N/L",
  E0201020101: "㎥",
  E0201020102: "mg-COD/L",
  E0201020103: "㎥",
  E0201020104: "mg-COD/L",
  E0201020105: "㎥",
  E0201020106: "mg-COD/L",
  E0201020201: "㎥",
  E0201020202: "mg-COD/L",
  E0201020203: "㎥",
  E0201020204: "mg-COD/L",
  E0201020205: "㎥",
  E0201020206: "mg-COD/L",
  E0201020301: "㎥",
  E0201020302: "mg-COD/L",
  E0201020303: "㎥",
  E0201020304: "mg-COD/L",
  E0201020305: "㎥",
  E0201020306: "mg-COD/L",
  E02020101: "㎥",
  E02020102: "%",
  E02020103: "%",
  E0202020101: "ton",
  E0202020201: "ton",
  E02030101: "ton",
  E02030102: "ton",
  E02030103: "ton",
  E02030104: "ton",
  E02030105: "ton",
  E02030106: "ton",
  E02030107: "ton",
  E02030108: "ton",
  E02030109: "ton",
  E02030110: "ton",
  E02030111: "ton",
  E02030201: "ton",
  E02030202: "ton",
  E02030203: "ton",
  E02030204: "ton",
  E02030205: "ton",
  E02030206: "ton",
  E02030207: "ton",
  E02030208: "ton",
  E02030209: "ton",
  E02030210: "ton",
  E02030211: "ton",
  E0203030101: "ton",
  E0203030201: "ton",
  E0203030301: "ton",
  E02030401: "ton",
  E02030402: "ton",
  E030101: "ton",
  E030102: "ton",
  E030201: "ton",
  E030202: "ton",
  E030301: "ton",
  E030302: "ton",
  E030303: "ton",
  E030304: "ton",
  E030305: "ton",
  E030306: "ton",
  E030307: "ton",
  E030401: "ton",
  E030402: "ton",
  E030403: "ton",
  E030404: "ton",
  E030405: "ton",
  E030406: "ton",
  E030407: "ton",
  E030408: "ton",
  E030409: "ton",
  E030410: "ton",
  E030501: "ton",
  E030502: "ton",
  E030503: "ton",
  E030504: "ton",
  E030601: "ton",
  E030701: "ton",
  E030801: "ton",
  E030802: "ton",
  E030901: "ton",
  E030902: "ton",
  E030903: "ton",
  E030904: "ton",
  E030905: "ton",
  E030906: "ton",
  E030907: "ton",
  E031001: "ton",
  E031002: "ton",
  E031003: "ton",
  E031004: "ton",
  E031005: "ton",
  E031006: "ton",
  E031007: "ton",
  E031008: "ton",
  E031009: "ton",
  E031010: "ton",
  E031011: "ton",
  E031012: "ton",
  E031013: "ton",
  E031014: "ton",
  E031015: "ton",
  E031016: "ton",
  E031101: "ton",
  E031102: "ton",
  E031103: "ton",
  E031104: "ton",
  E031105: "ton",
  E031201: "ton",
  E031202: "ton",
  E031203: "ton",
  E031204: "ton",
  E031301: "",
  E031401: "ton",
  E031402: "ton",
  E031403: "ton",
  E031404: "ton",
  E031405: "ton",
  E031406: "ton",
  E031407: "ton",
  E031408: "ton",
  E031501: "ton",
  E031502: "ton",
  E031503: "ton",
  E031504: "ton",
  E031505: "ton",
  E040101: "kg",
  E040102: "kg",
  E040201: "kg",
  E040202: "kg",
  E040203: "kg",
  E040204: "kg",
  E040205: "kg",
  E040206: "kg",
  E040207: "kg",
  E040208: "kg",
  E040209: "kg",
  E040210: "kg",
  E040211: "kg",
  E040212: "kg",
  E040213: "kg",
  E040214: "kg",
  E040215: "kg",
  E040216: "kg",
  E040217: "kg",
  E040218: "kg",
  E040219: "kg",
  E040220: "kg",
  E040221: "kg",
  E040222: "kg",
  E040223: "kg",
  E040224: "kg",
  E040301: "kg",
  E040302: "kg",
  E040303: "kg",
  E040304: "kg",
  E040401: "kg",
  E040402: "kg",
  E040403: "kg",
  E040404: "kg",
  E040405: "kg",
  E040406: "kg",
  E040407: "kg",
  E040408: "kg",
  E040409: "kg",
  E040410: "kg",
  E040411: "kg",
  E040412: "kg",
  E040413: "kg",
  E040414: "kg",
  E040415: "kg",
  E040501: "kg",
  E040502: "kg",
  E040503: "kg",
  E040504: "kg",
  E040505: "kg",
  E040506: "kg",
  E040507: "kg",
  E040508: "kg",
  E040509: "kg",
  E040510: "kg",
  E040511: "kg",
  E040512: "kg",
  E040513: "kg",
  E040514: "kg",
  E040515: "kg",
  E040516: "kg",
  E040517: "kg",
  E040518: "kg",
  E040519: "kg",
  E040520: "kg",
  E040521: "kg",
  E040522: "kg",
  E040523: "kg",
  E040524: "kg",
  E040525: "kg",
  E040526: "kg",
  E040527: "kg",
  E040528: "kg",
  E040529: "kg",
  E040530: "kg",
  E040531: "kg",
  E040532: "kg",
  E040533: "kg",
  E040534: "kg",
  E040535: "kg",
  E040536: "kg",
  E040537: "kg",
  E040538: "kg",
  E040539: "kg",
  E040540: "kg",
  E040541: "kg",
  E040542: "kg",
  E040543: "kg",
  E040544: "kg",
  E040545: "kg",
  E040546: "kg",
  E040547: "kg",
  E040548: "kg",
  E040549: "kg",
  E040550: "kg",
  E040551: "kg",
  E040552: "kg",
  E040553: "kg",
  E040554: "kg",
  E040555: "kg",
  E040556: "kg",
  E040557: "kg",
  E040558: "kg",
  E040559: "kg",
  E040560: "kg",
  E040561: "kg",
  E040562: "kg",
  E040563: "kg",
  E040564: "kg",
  E040565: "kg",
  E040566: "kg",
  E040567: "kg",
  E040568: "kg",
  E040569: "kg",
  E040570: "kg",
  E040571: "kg",
  E040572: "kg",
  E040573: "kg",
  E040574: "kg",
  E040575: "kg",
  E040576: "kg",
  E040577: "kg",
  E040578: "kg",
  E040601: "kg",
  E040602: "kg",
  E040603: "kg",
  E040604: "kg",
  E040605: "kg",
  E040606: "kg",
  E040701: "kg",
  E040702: "kg",
  E040703: "kg",
  E040704: "kg",
  E040705: "kg",
  E040706: "kg",
  E040707: "kg",
  E040708: "kg",
  E040709: "kg",
  E040710: "kg",
  E040711: "kg",
  E040712: "kg",
  E040713: "kg",
  E040714: "kg",
  E040715: "kg",
  E040716: "kg",
  E040717: "kg",
  E040718: "kg",
  E040801: "kg",
  E040802: "kg",
  E040803: "kg",
  E040804: "kg",
  E040805: "kg",
  E040806: "kg",
  E040807: "kg",
  E040808: "kg",
  E040809: "kg",
  E040810: "kg",
  E040811: "kg",
  E040812: "kg",
  E040813: "kg",
  E040814: "kg",
  E040815: "kg",
  E040816: "kg",
  E040817: "kg",
  E040818: "kg",
  E040819: "kg",
  E040820: "kg",
  E040821: "kg",
  E040901: "kg",
  E040902: "kg",
  E040903: "kg",
  E040904: "kg",
  E040905: "kg",
  E040906: "kg",
  E040907: "kg",
  E040908: "kg",
  E040909: "kg",
  E040910: "kg",
  E040911: "kg",
  E040912: "kg",
  E040913: "kg",
  E040914: "kg",
  E040915: "kg",
  E040916: "kg",
  E040917: "kg",
  E040918: "kg",
  E040919: "kg",
  E040920: "kg",
  E050101: "kg",
  E050102: "kg",
  E050103: "kg",
  E050104: "kg",
  E050105: "kg",
  E050106: "kg",
  E050107: "kg",
  E050108: "kg",
  E050109: "kg",
  E050110: "kg",
  E050111: "kg",
  E060101: "ton.km",
  E060102: "ton.km",
  E060103: "ton.km",
  E060104: "ton.km",
  E060105: "ton.km",
  E060201: "ton.km",
  E060202: "ton.km",
  E060203: "ton.km",
  E060204: "ton.km",
  E060301: "ton.km",
  E070101: "kg",
  E070102: "kg",
  E070103: "kg",
  E070104: "kg",
  E070105: "kg",
  E070106: "kg",
  E070107: "kg",
  E070108: "kg",
  E070109: "kg",
  E070110: "kg",
  E070111: "kg",
  E070112: "kg",
  E070201: "kg",
  E070202: "kg",
  E070203: "kg",
  E070204: "kg",
  E070205: "kg",
  E070206: "kg",
  E070207: "kg",
  E070208: "kg",
  E070209: "kg",
  E070301: "kg",
  E070302: "kg",
  E070303: "kg",
  E070304: "kg",
  E070305: "kg",
  E070306: "kg",
  E070307: "kg",
  E070308: "kg",
  E070309: "kg",
  E070401: "kg",
  E070402: "kg",
  E070403: "kg",
  E070404: "kg",
  E070405: "kg",
  E070406: "kg",
  E070407: "kg",
  E070408: "kg",
  E070409: "kg",
  E070410: "kg",
  E070411: "kg",
  E070412: "kg",
  E070413: "kg",
  E070414: "kg",
  E070415: "kg",
  E070416: "kg",
  E070417: "kg",
  E070418: "kg",
  E070419: "kg",
  E070420: "kg",
  E080101: "인km",
  E090101: "km",
}

/**
 * 값을 직접 넣지 않고 [상세입력] 팝업에서 하위 항목을 받는 마디.
 * [퍼블리싱 노출용] 참고 화면(carbon-self-check-step2-inventory-v3)의 SM 항목을 옮겼다.
 */
export const INVENTORY_DETAIL: string[] = [
  "E020101",
  "E020102",
  "E020201",
  "E020202",
  "E020301",
  "E020302",
  "E020303",
  "E020304",
]

/**
 * 숫자 대신 목록에서 고르는 항목. 코드마다 고를 수 있는 값이다.
 * [퍼블리싱 노출용] 참고 화면(carbon-self-check-step2-inventory-v3)의 값을 그대로 옮겼다.
 */
export const INVENTORY_OPTIONS: Record<string, string[]> = {
  // 공정배출 › 전기로 작동방식 › 작동방식 선택
  E031301: ["회차 충진 방식", "흩뿌림 충진 방식", "흩뿌림 충진, 750℃ 이상"],
}
