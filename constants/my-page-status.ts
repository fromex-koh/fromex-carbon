// 현황조회(/my-page/status) 목업 데이터.
//
// [퍼블리싱 노출용] 아래 STATUS_GROUPS 값은 전부 시안에 그려진 것이다.
// 실제 API 를 붙일 때는 이 파일만 갈아 끼우면 된다 — 응답을 StatusGroup[] 모양으로
// 맞춰 STATUS_GROUPS 자리에 넣으면 화면 코드는 그대로 돌아간다.
//
// 화면에서 쓰는 규칙
// - group.title 은 결과 줄 필터 이름과 그대로 맞물린다(STATUS_FILTERS)
// - rows[0].date 가 정렬(최신순 · 오래된순) 기준이다
// - supplement 가 true 면 보완요청 버튼이, validity.expired 가 true 면 붉은 "만료" 가 붙는다

/**
 * [퍼블리싱 노출용] K-택소노미 카드 등록일.
 * 정렬이 눈에 보이도록 서로 다르게 두었다.
 * 건수가 STATUS_PAGE_SIZE(4) 를 넘어 [더보기] 가 붙는다.
 */
const TAXONOMY_DATES = [
  "2025-10-24 13:02:55",
  "2025-10-17 08:41:09",
  "2025-10-10 10:47:21",
  "2025-10-03 17:22:44",
  "2025-09-26 16:11:38",
  "2025-09-19 12:35:50",
  "2025-09-12 09:29:04",
  "2025-08-29 15:56:12",
]

export interface StatusRow {
  /** 줄 앞 알약 */
  status: string
  /** 알약 오른쪽 설명 */
  text: string
  /** 줄 오른쪽 날짜 */
  date: string
}

export interface StatusItem {
  /** 카드 제목. 두 조각이면 가운데 점으로 잇는다 */
  title: string[]
  rows: StatusRow[]
  /** 오른쪽 위 다운로드 링크 이름 */
  download?: string
  /** 탄소감축 카드에만 있는 유효기간 줄. expired 면 오른쪽에 붉은 "만료" 가 붙는다 */
  validity?: { label: string; value: string; expired?: boolean }
  /** 보완요청이 있는 카드 */
  supplement?: boolean
}

/** 묶음 색 구분. 화면(status.tsx)의 GROUP_TONE 키와 같다 */
export type StatusTone = "info" | "violet" | "teal"

export interface StatusGroup {
  title: string
  tone: StatusTone
  items: StatusItem[]
}

export const STATUS_GROUPS: StatusGroup[] = [
  {
    title: "전문평가",
    tone: "info",
    items: [
      {
        title: ["홍길동기업", "여신심사용"],
        rows: [
          {
            status: "진행중",
            text: "녹색-공통-가-2, 혁신품목 소재·부품·장비 제조: 전기·수소차 충전 인프라",
            date: "2025-08-05 11:26:33",
          },
        ],
      },
      {
        title: ["(주)기보특수산업기계", "여신심사용"],
        rows: [
          {
            status: "진행중",
            text: "녹색-공통-가-2, 혁신품목 소재·부품·장비 제조: 전기·수소차 충전 인프라",
            date: "2025-10-21 09:12:04",
          },
        ],
      },
      {
        title: ["홍길동기업", "여신심사용"],
        download: "보고서 다운로드",
        rows: [
          {
            status: "완료",
            text: "녹색-1-나-2, 재생에너지 생산: 바이오매스",
            date: "2025-10-14 11:38:52",
          },
          {
            status: "완료",
            text: "녹색-공통-가-1, 혁신품목 제조",
            date: "2025-10-07 15:05:30",
          },
        ],
      },
      {
        title: ["(주)태화정밀", "기관제출용"],
        download: "보고서 다운로드",
        rows: [
          {
            status: "완료",
            text: "녹색-1-나-2, 재생에너지 생산: 바이오매스",
            date: "2025-09-30 10:24:17",
          },
        ],
      },
      {
        title: ["(주)비바정밀", "여신심사용"],
        download: "보고서 다운로드",
        rows: [
          {
            status: "완료",
            text: "녹색-1-나-3, 재생에너지 생산: 바이오가스",
            date: "2025-09-23 17:51:08",
          },
          {
            status: "완료",
            text: "녹색-4-라-2, 폐기물 재생이용",
            date: "2025-09-16 08:33:45",
          },
        ],
      },
      {
        title: ["(주)금진자원", "여신심사용"],
        download: "보고서 다운로드",
        rows: [
          {
            status: "완료",
            text: "녹색-4-라-2, 폐기물 재생이용",
            date: "2025-09-09 13:19:26",
          },
        ],
      },
      {
        title: ["안한주컴퍼니", "여신심사용"],
        download: "보고서 다운로드",
        rows: [
          {
            status: "완료",
            text: "녹색-4-라-2, 폐기물 재생이용",
            date: "2025-09-02 14:07:11",
          },
        ],
      },
      {
        title: ["(주)한빛에너지", "여신심사용"],
        download: "보고서 다운로드",
        rows: [
          {
            status: "완료",
            text: "녹색-1-나-2, 재생에너지 생산: 바이오매스",
            date: "2025-07-22 10:15:44",
          },
        ],
      },
      {
        title: ["대성정밀공업", "기관제출용"],
        download: "보고서 다운로드",
        rows: [
          {
            status: "완료",
            text: "녹색-공통-가-1, 혁신품목 제조",
            date: "2025-07-15 14:38:02",
          },
        ],
      },
      {
        title: ["(주)세명테크", "여신심사용"],
        download: "보고서 다운로드",
        rows: [
          {
            status: "완료",
            text: "녹색-4-라-2, 폐기물 재생이용",
            date: "2025-07-08 09:51:27",
          },
        ],
      },
    ],
  },
  {
    title: "K-택소노미",
    tone: "violet",
    items: Array.from({ length: TAXONOMY_DATES.length }, (_, index) => ({
      title: ["택소노미 분류 결과 1건"],
      download: "보고서 다운로드",
      rows: [
        {
          status: "완료",
          text: "녹색-1-가-1, 재생에너지가 생산·설비의 설치·운영에 필요한 설비 제조",
          date: TAXONOMY_DATES[index],
        },
      ],
    })),
  },
  {
    title: "탄소감축",
    tone: "teal",
    // 개발자 전달용 — 아래 6장이 이 묶음에서 화면이 달라지는 경우의 전부다.
    // 절차(자가진단 → 1차 → 2차 중간점검 → 3차 최종점검)에 한 케이스씩 얹었고,
    // 보완요청·만료는 절차와 무관한 특이 케이스라 날짜를 최신으로 두어 맨 위에 모았다.
    items: [
      // 1. 보완요청 — 다운로드 대신 보완요청 보기 버튼이 나온다
      {
        title: ["선도기업 신청 2차"],
        supplement: true,
        validity: { label: "유효기간", value: "제출 후 부여" },
        rows: [
          {
            status: "보완요청",
            text: "보완요청 사항이 있습니다.",
            date: "2026-08-28 11:05:47",
          },
        ],
      },
      // 2. 만료 — 유효기간 옆에 붉은 "만료" 가 붙고 다운로드가 잠긴다
      {
        title: ["선도기업 신청 1차"],
        download: "확인서 다운로드",
        validity: {
          label: "유효기간",
          value: "2025-08-26 ~ 2026-08-26",
          expired: true,
        },
        rows: [
          {
            status: "검토완료",
            text: "선도기업 1차 신청 검토 서류가 완료되었습니다.",
            date: "2026-08-26 15:03:09",
          },
        ],
      },
      // 3. 완료 — 최종점검 신청서를 냈고 검토를 기다리는 상태
      {
        title: ["선도기업 신청 3차"],
        download: "확인서 다운로드",
        validity: { label: "유효기간", value: "2026-07-30 ~ 2027-07-30" },
        rows: [
          {
            status: "완료",
            text: "신청이 완료되었습니다. 검토 후에 승인이 완료될 예정입니다.",
            date: "2026-07-30 13:35:52",
          },
        ],
      },
      // 4. 검토완료 — 중간점검 검토까지 끝났고 유효기간이 살아 있다.
      //    2번 카드와 짝을 이뤄 만료 전후로 다운로드가 갈리는 것을 보여 준다
      {
        title: ["선도기업 신청 2차"],
        download: "확인서 다운로드",
        validity: { label: "유효기간", value: "2026-05-21 ~ 2027-05-21" },
        rows: [
          {
            status: "검토완료",
            text: "선도기업 2차 신청 검토 서류가 완료되었습니다.",
            date: "2026-05-21 11:53:47",
          },
        ],
      },
      // 5. 진행중 — 작성 중이라 유효기간이 아직 "제출 후 부여" 다
      {
        title: ["선도기업 신청 1차"],
        download: "확인서 다운로드",
        validity: { label: "유효기간", value: "제출 후 부여" },
        rows: [
          {
            status: "진행중",
            text: "신청 작성이 미완료되었습니다. 이어서 진행할 수 있습니다.",
            date: "2025-05-02 14:26:11",
          },
        ],
      },
      // 6. 자가진단 — 유효기간 줄이 없고 다운로드 이름이 "보고서" 인 유일한 카드
      {
        title: ["탄소감축 자가진단"],
        download: "보고서 다운로드",
        rows: [
          {
            status: "완료",
            text: "합계 예상 감축량 2 · 달성률 4,457%",
            date: "2025-04-08 10:12:33",
          },
        ],
      },
    ],
  },
]

/**
 * 세 묶음이 모두 비었을 때를 보여 주는 목록.
 * 빈 화면 전용 라우트(/my-page/status/empty)가 쓴다. 묶음 이름·색은 그대로 두고 목록만 비운다.
 */
export const STATUS_GROUPS_EMPTY: StatusGroup[] = STATUS_GROUPS.map(
  (group) => ({ ...group, items: [] }),
)

/** 결과 줄 필터. "전체" 를 뺀 나머지는 STATUS_GROUPS 의 title 과 같아야 한다 */
export const STATUS_FILTER_ALL = "전체"
export const STATUS_FILTERS = [
  STATUS_FILTER_ALL,
  "전문평가",
  "K-택소노미",
  "탄소감축",
]

/**
 * 묶음마다 한 번에 보여 주는 건수. 이보다 많으면 아래 [더보기] 가 붙고,
 * 적으면 버튼이 아예 나오지 않는다.
 */
export const STATUS_PAGE_SIZE = 4

/** 정렬 셀렉트 값 */
export const STATUS_SORTS = ["최신순", "오래된순"]
