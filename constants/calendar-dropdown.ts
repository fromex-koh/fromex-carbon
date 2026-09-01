// 달력(components/ui/calendar.tsx) 머리를 월·연도 네이티브 select 로 바꾸는 설정.
//
// 원본 Calendar 는 classNames 와 나머지 props 를 DayPicker 에 마지막으로 펼쳐 주므로,
// 부르는 쪽에서 이 값을 넘기면 원본을 고치지 않고도 머리 모양을 바꿀 수 있다.
// 날짜 칸이 있는 화면(설립일자 · 사업 시작일 · 투자기간)이 모두 이 한 벌을 쓴다.

/** 연도 목록 범위. 설립일자처럼 오래된 날짜까지 고를 수 있게 넉넉히 연다 */
const YEAR_FROM = 1950
const YEAR_TO = new Date().getFullYear() + 10

const CALENDAR_DROPDOWN = {
  // 화살표는 원본 규칙(caption 안 absolute left-1 / right-1)을 그대로 두고,
  // select 두 개만 가운데로 모은다. 좌우 px-8 은 화살표와 겹치지 않게 비워 두는 자리다.
  caption_dropdowns: "flex items-center justify-center gap-1 px-8",
  // 라벨은 select 와 같은 값을 한 번 더 그리므로 select 만 남긴다
  caption_label: "hidden",
  vhidden: "hidden",
  // 평소에는 테두리·면색 없이 글자만 두고 hover 에서만 배경이 뜬다.
  // dark:scheme-dark 는 OS 가 그리는 목록까지 어두운 배색으로 뜨게 한다
  dropdown:
    "text-ink-strong hover:bg-accent focus-visible:ring-ash-600 dark:scheme-dark h-8 cursor-pointer rounded-md border-0 bg-transparent px-2 text-sm font-medium outline-hidden transition-colors focus-visible:ring-2",
  // 원본 DayPicker 는 월 → 연도 순으로 그린다. flex order 로 자리만 바꿔 연도를 앞에 둔다
  dropdown_month: "flex order-2",
  dropdown_year: "flex order-1",
}

/** Calendar 에 그대로 펼쳐 넣는다. `<Calendar {...CALENDAR_PROPS} />` */
export const CALENDAR_PROPS = {
  captionLayout: "dropdown-buttons",
  fromYear: YEAR_FROM,
  toYear: YEAR_TO,
  classNames: CALENDAR_DROPDOWN,
} as const
