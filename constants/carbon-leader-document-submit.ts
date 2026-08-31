// 선도기업 신청 1차 STEP 2(서류 제출) 화면의 표시 값.
// [퍼블리싱 노출용] 첨부된 파일은 시안에 그려진 예시다. 실제 데이터를 연결할 때 걷어낸다.

/** 안내 박스 두 번째 줄에 나란히 놓이는 조건들 */
export const SUBMIT_NOTICE_SPECS = [
  { label: "파일 형식", value: "PDF, JPG, PNG" },
  { label: "파일 당 최대 용량", value: "10MB" },
  { label: "항목별 여러 파일 첨부 가능", value: "" },
]

/** 첨부된 파일 한 줄 */
export interface SubmittedFile {
  name: string
  /** 시안 표기 그대로. 실제로는 서버가 준 크기를 포맷해 넣는다 */
  size: string
}

/** 서류 한 건 */
export interface SubmitDocument {
  title: string
  /** 제목 아래 회색 설명. 없는 항목도 있다 */
  description?: string
  /** 비어 있으면 아직 첨부 전(회색 카드)이다 */
  files?: SubmittedFile[]
}

/** 번호가 붙는 서류 묶음 */
export interface SubmitGroup {
  title: string
  documents: SubmitDocument[]
}

export const DOCUMENT_GROUPS: SubmitGroup[] = [
  {
    title: "기업정보",
    documents: [
      {
        title: "법인등기부등본 및 사업자등록증",
        files: [
          {
            name: "사업자등록증_그린에너지텍_2024.pdf",
            size: "1.2 MB",
          },
        ],
      },
      {
        title: "중소기업 확인서",
        files: [
          {
            name: "중소기업확인서_그린에너지텍_2026.pdf",
            size: "1.2 MB",
          },
          {
            name: "중소기업확인서_그린에너지텍_2026.pdf",
            size: "1.2 MB",
          },
        ],
      },
      { title: "3개년 재무제표" },
      { title: "탄소중립 전문인력 이력서" },
      {
        title: "탄소중립 기업활동 자료",
        description: "탄소중립 방침·계획·공시자료, 교육활동, 기술개발 등",
      },
      {
        title: "특허 및 인증서",
        description: "ISO14068, 녹색기술인증, 저탄소인증제품 등",
      },
      {
        title: "기타 회사 소개자료",
        description: "목표 감축률, 감축사업 계획 및 투자비용 포함",
      },
    ],
  },
  {
    title: "인벤토리 증빙서류",
    documents: [
      {
        title: "3개년 고정연소 증빙서류",
        description: "사업장 등유/경유/LPG 등 사용량",
      },
      {
        title: "3개년 이동연소 증빙서류",
        description: "법인차량 휘발유/경유/LPG 등 사용량",
      },
      { title: "3개년 간접배출 증빙서류", description: "전력/스팀 사용량" },
      { title: "기타 에너지 사용량 증빙서류" },
    ],
  },
  {
    title: "감축계획 증빙서류",
    documents: [
      { title: "도입(예정) 설비 견적서 및 계약서" },
      { title: "도입(예정) 설비 사양서", description: "설비명판, 카탈로그 등" },
      { title: "기타 감축량 산정 증빙서류" },
    ],
  },
]
