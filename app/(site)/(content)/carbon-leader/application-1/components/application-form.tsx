"use client"

import {
  createContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react"
import { format } from "date-fns"
import { ko } from "date-fns/locale"
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  CirclePlus,
  Download,
  LoaderCircle,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar as CalendarPanel } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Stepper } from "@/components/ui/stepper"
import AddressSearchDialog from "@/components/address-search-dialog"
import BaseInfo from "@/app/(site)/(content)/carbon-leader/self-check/components/base-info"
import StepMobileNav from "@/app/(site)/(content)/carbon-leader/self-check/components/step-mobile-nav"
import {
  ADOPTION_COLUMNS,
  ADOPTION_ROW_COUNT,
  APPLICATION_STEPS,
  BASE_YEAR_COLUMNS,
  BASE_YEAR_ROWS,
  INVESTMENT_COLUMNS,
  INVESTMENT_ROWS,
  REDUCTION_PLAN_COLUMNS,
  REDUCTION_PLAN_ROWS,
  type PlanRow,
} from "@/constants/carbon-leader-application-form"
import { navBarHeight } from "@/lib/const"
import { cn } from "@/lib/utils"
import { CALENDAR_PROPS } from "@/constants/calendar-dropdown"

// 선도기업 신청 1차 STEP 1(신청서 작성).
// 카드 6장이 같은 껍데기를 쓰고, 안쪽만 입력 그리드 또는 표로 갈린다.
// 표시 값은 전부 고정 문구다. constants/carbon-leader-application-form 참고.

// 2차는 「중간 및 최종점검 신청서」 양식이라 기준연도 현황·감축계획 카드가 빠지고,
// 1차에서 받은 투자계획을 읽기 전용으로 되짚은 뒤 감축기술 도입현황을 새로 받는다.
// 3차는 카드 구성이 2차와 같지만 스테퍼가 6단계라 화면을 따로 뒀다.
// application-3/components/application-form 참고.
const NOTICES_BY_ROUND: Record<number, string[]> = {
  1: ["기업 기본정보, 기준연도 현황, 감축계획을 입력해 주세요."],
  2: [
    "기업 기본정보를 확인하고, 탄소중립 투자계획 및 감축기술 도입현황을 입력해 주세요.",
  ],
}

const INDUSTRIES = ["제조업", "건설업", "운수업", "도매 및 소매업"]

/**
 * [다음으로] 를 눌렀을 때 검사할 항목. 키는 입력 name, 값은 문구에 쓸 이름이다.
 * 시안이 오류 문구 자리를 잡아 둔 (1) 기업정보 · (2) 기업현황 · (3) 담당자정보 칸이다.
 */
const REQUIRED_FIELDS: Record<string, string> = {
  "company-name": "업체명",
  "ceo-name": "대표자",
  "business-number": "사업자등록번호",
  "corporation-number": "법인등록번호",
  "zip-code": "기업소재지",
  "ceo-phone": "대표자 연락처",
  "company-email": "전자우편",
  "founded-at": "설립일자",
  industry: "업종",
  "industry-code": "업종코드",
  "main-product": "주생산품",
  "yearly-output": "연간생산량",
  "manager-name": "담당자명",
  "manager-department": "부서 / 직책",
  "manager-tel": "전화번호",
  "manager-email": "전자우편",
  "manager-phone": "연락처",
}

/** 기업소재지는 칸이 셋이지만 오류 문구는 한 줄이라 함께 본다 */
const ADDRESS_FIELDS = ["zip-code", "address", "address-detail"]

/** (4)(5) 표. 한 줄의 연도 칸이 하나라도 비면 그 줄에 문구 한 줄을 띄운다 */
const TABLE_GROUPS = [
  { id: "base-year", columns: BASE_YEAR_COLUMNS, rows: BASE_YEAR_ROWS },
  {
    id: "reduction-plan",
    columns: REDUCTION_PLAN_COLUMNS,
    rows: REDUCTION_PLAN_ROWS,
  },
]

/** (4) 표 아래 넓은 칸 두 줄 */
const WIDE_FIELDS: Record<string, string> = {
  "base-year-standard": "탄소중립 기준연도",
  "base-year-average": "기준연도 온실가스 평균배출량",
}

/** 받침이 있으면 "을", 없으면 "를" */
const objectParticle = (word: string) => {
  const last = word.trim().at(-1) ?? ""
  const code = last.charCodeAt(0)
  if (code < 0xac00 || code > 0xd7a3) return "을"
  return (code - 0xac00) % 28 === 0 ? "를" : "을"
}

const requiredMessage = (label: string) =>
  `${label}${objectParticle(label)} 입력해 주세요.`

/** 칸마다 오류 문구를 내려 준다. Field 가 htmlFor 로 찾아 쓴다. */
const FieldErrorContext = createContext<Record<string, string>>({})

/**
 * 날짜 표기. 감축잠재량 산정 화면과 같은 yyyy-MM-dd 를 쓴다.
 * 공용 DatePicker 는 형식이 고정돼 있어 Popover + Calendar 를 직접 조합한다.
 */
const DATE_FORMAT = "yyyy-MM-dd"

/**
 * 입력 칸 한 벌. 시안은 높이 52 · 라운드 6 · 테두리 line-field 다.
 * hover 는 감축잠재량 산정·기업 정보 입력 화면의 입력 칸과 같은 규칙을 쓴다.
 */
const FIELD =
  "border-line-field bg-surface-field text-ink-strong placeholder:text-ink-placeholder hover:ring-ash-600 focus-visible:ring-ash-600 h-12 w-full min-w-0 rounded-md border px-4 text-sm font-medium outline-hidden hover:ring-2 focus-visible:ring-2"

/** 칸 오른쪽에 단위가 붙는 입력. 단위 자리를 비워 두려고 테두리를 밖으로 뺐다. */
const FIELD_BOX =
  "border-line-field bg-surface-field hover:ring-ash-600 has-[:focus-visible]:ring-ash-600 focus-visible:ring-ash-600 flex h-12 items-center rounded-md border px-4 outline-hidden hover:ring-2 has-[:focus-visible]:ring-2 focus-visible:ring-2"

const BARE =
  "text-ink-strong placeholder:text-ink-bullet min-w-0 flex-1 bg-transparent text-sm font-medium outline-hidden"

/**
 * 주소검색 · 삭제처럼 칸 옆에 붙는 회색 버튼.
 * 입력 칸과 달리 링이 아니라 면색만 한 단계 진해진다(라이트 #eeeeee→#d2d2d2 · 다크 #222222→#666666).
 */
/**
 * 표 껍데기. 감축잠재량 산정 화면(business-detail.tsx 의 boxClass)과 같은 규칙이다.
 * 헤더와 본문을 한 박스로 감싸고 overflow-hidden 으로 모서리를 깎는다. 360 은 박스가 없다.
 */
const TABLE_BOX =
  "md:border-line-card md:bg-surface-field md:overflow-hidden md:rounded-md md:border"

const SIDE_BUTTON =
  "bg-line-card text-ink-body hover:bg-line-field focus-visible:ring-ash-600 flex h-12 w-21 shrink-0 cursor-pointer items-center justify-center rounded-md text-sm font-bold whitespace-nowrap transition-colors outline-hidden focus-visible:ring-2"

interface CardProps {
  /**
   * 최종 확인 화면의 [수정] 링크가 가리키는 앵커.
   * 이 id 를 바꾸거나 지우면 그쪽 링크(`...#company-info` 등)가 헛돈다.
   */
  id?: string
  title: string
  description: string
  /** 제목 줄 오른쪽에 붙는 작은 버튼(내 정보 불러오기) */
  action?: React.ReactNode
  /** 360 은 설명 아래 전체 폭, 768 부터 헤더 오른쪽에 서는 CTA */
  cta?: React.ReactNode
  children: React.ReactNode
}

/** 카드 한 장. 제목·설명·오른쪽 버튼까지가 헤더다. */
const Card = ({ id, title, description, action, cta, children }: CardProps) => (
  <section
    id={id}
    // 앵커로 들어오면 이 카드가 화면 위쪽에 걸린다. 고정 헤더(90) 만큼 띄운다
    className="border-line-card flex scroll-mt-28 flex-col gap-6 rounded-xl border px-5 py-6 md:rounded-2xl md:p-8 lg:gap-14 lg:p-10"
  >
    {/* 시안 360 은 CTA 가 설명 아래 전체 폭, 768 부터는 헤더 오른쪽에 붙는다 */}
    <header className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between md:gap-5">
      <div className="flex flex-col gap-3 md:min-w-0 md:flex-1">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-ink-strong text-lg font-bold break-keep md:text-2xl">
            {title}
          </h3>
          {action}
        </div>
        <p className="text-ink-body text-sm leading-tight break-keep md:text-base md:leading-normal">
          {description}
        </p>
      </div>
      {cta}
    </header>
    {children}
  </section>
)

/** 카드 헤더의 테두리 버튼 두 종류 */
const HeaderButton = ({
  children,
  brand,
  icon,
  loading = false,
  loadingLabel = "불러오는 중...",
  className,
  onClick,
}: {
  children: React.ReactNode
  /** 자가진단 데이터 불러오기처럼 파란 테두리를 쓸지 */
  brand?: boolean
  icon?: React.ReactNode
  /**
   * 불러오는 중이면 아이콘 자리를 스피너로 바꾸고 버튼을 잠근다.
   * 응답을 기다리는 동안 같은 요청이 여러 번 나가는 것을 막는 쪽이 맞다.
   */
  loading?: boolean
  loadingLabel?: string
  className?: string
  onClick?: () => void
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={loading}
    // 잠긴 사이에도 화면 낭독기가 진행 중임을 읽도록 상태를 남긴다
    aria-busy={loading}
    className={cn(
      // hover 는 선도기업 신청 카드의 테두리 버튼과 같은 규칙(surface-outline-hover)을 쓴다
      "bg-surface-field hover:bg-surface-outline-hover focus-visible:ring-ash-600 flex shrink-0 cursor-pointer items-center whitespace-nowrap transition-colors outline-hidden focus-visible:ring-2 disabled:cursor-default disabled:opacity-50",
      brand
        ? // 시안: 360 전체 폭 · 768 부터 오른쪽 고정. 높이 48, 아이콘 24
          "border-brand-primary text-brand-primary h-11 w-full justify-center gap-1 rounded-lg border px-4 text-sm font-bold md:w-auto [&_svg]:size-6"
        : // 768·360 시안은 30/28 이고, PC 는 지금까지 쓰던 34 를 그대로 둔다
          "border-line-field text-ink-strong h-7 gap-1.5 rounded-md border px-3 text-xs font-bold lg:h-8 [&_svg]:size-4",
      className,
    )}
  >
    {loading ? loadingLabel : children}
    {loading ? (
      <LoaderCircle aria-hidden="true" className="animate-spin" />
    ) : (
      icon
    )}
  </button>
)

/**
 * 서버에서 값을 받아오는 버튼의 진행 상태.
 * [퍼블리싱 노출용] 실제 요청 대신 응답을 기다리는 시간만 흉내 낸다.
 * 기다리는 동안 버튼을 잠가 같은 요청이 겹쳐 나가지 않게 한다.
 */
const useLoadingButton = () => {
  const [loading, setLoading] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current)
    },
    [],
  )

  const start = () => {
    if (timer.current) return
    setLoading(true)
    timer.current = setTimeout(() => {
      timer.current = null
      setLoading(false)
    }, 1500)
  }

  return [loading, start] as const
}

/** 표 줄 아래에 붙는 오류 문구 한 줄 */
const RowError = ({
  name,
  className,
}: {
  name: string
  className?: string
}) => (
  <FieldErrorContext.Consumer>
    {(errors) =>
      errors[name] ? (
        <p
          className={cn(
            "text-ink-error text-xs font-medium lg:text-sm",
            className,
          )}
        >
          {errors[name]}
        </p>
      ) : null
    }
  </FieldErrorContext.Consumer>
)

/** 이름표 + 입력 한 칸. 시안은 이름표와 칸 사이가 10 이다. */
const Field = ({
  label,
  hint,
  htmlFor,
  className,
  children,
}: {
  label: string
  /** 이름표 뒤에 붙는 흐린 보조 문구. 시안은 입력 형식을 여기 적는다 */
  hint?: string
  htmlFor: string
  className?: string
  children: React.ReactNode
}) => (
  <FieldErrorContext.Consumer>
    {(errors) => {
      const error = errors[htmlFor]
      return (
        <div
          className={cn(
            "flex flex-col gap-2.5",
            // 오류 표시는 기업 정보 입력 화면과 같은 규칙이다(테두리는 두고 2px 링을 두른다).
            // data-field-row 가 붙은 줄은 옆에 버튼이 있어 줄 전체가 아니라 입력에만 건다.
            error &&
              "[&>button]:ring-destructive [&>div:not([data-field-row])]:ring-destructive [&>input]:ring-destructive [&>[data-field-row]>input]:ring-destructive [&>button]:ring-2 [&>div:not([data-field-row])]:ring-2 [&>input]:ring-2 [&>[data-field-row]>input]:ring-2",
            className,
          )}
        >
          <label
            htmlFor={htmlFor}
            className="text-ink-strong text-base font-bold break-keep"
          >
            {label}
            {hint ? (
              // 시안은 이름표 안 괄호를 회색 #666666 으로 쓴다
              <span className="text-ink-muted text-xs font-normal">
                {" "}
                {hint}
              </span>
            ) : null}
          </label>
          {children}
          {error ? (
            <p className="text-ink-error text-xs font-medium lg:text-sm">
              {error}
            </p>
          ) : null}
        </div>
      )
    }}
  </FieldErrorContext.Consumer>
)

/** 달력에서 고르는 날짜 칸. 겉모습은 일반 입력 칸과 같다. */
const DateField = ({
  id,
  placeholder,
  invalid,
}: {
  id: string
  placeholder: string
  invalid?: boolean
}) => {
  const [date, setDate] = useState<Date>()
  // 날짜를 고르면 달력을 닫는다. Radix 는 안쪽 클릭으로 닫히지 않는다
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      {/* 달력에서 고른 값을 폼으로 넘긴다 */}
      <input
        type="hidden"
        name={id}
        value={date ? format(date, DATE_FORMAT) : ""}
      />
      <PopoverTrigger asChild>
        <button
          type="button"
          id={id}
          className={cn(
            FIELD_BOX,
            // 표 한 줄 배치가 시작되는 1280~1535 구간은 칸이 좁아
            // 좌우 여백을 한 단계 줄여야 날짜(yyyy-MM-dd)가 잘리지 않는다
            "w-full min-w-0 cursor-pointer text-left xl:px-3 2xl:px-4",
            invalid && "ring-destructive ring-2",
          )}
        >
          <span
            className={cn(
              "min-w-0 flex-1 truncate text-sm font-medium",
              date ? "text-ink-strong" : "text-ink-bullet",
            )}
          >
            {date ? format(date, DATE_FORMAT) : placeholder}
          </span>
          <Calendar
            aria-hidden="true"
            className="text-ink-bullet size-5 shrink-0"
          />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <CalendarPanel
          locale={ko}
          mode="single"
          selected={date}
          onSelect={(next) => {
            setDate(next)
            setOpen(false)
          }}
          defaultMonth={date}
          {...CALENDAR_PROPS}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}

/** 값과 단위가 한 칸에 들어가는 입력 */
const UnitField = ({
  id,
  placeholder,
  suffix,
  value,
  readOnly,
  invalid,
}: {
  id: string
  placeholder: string
  suffix: string
  /** 서버에서 내려온 값. 없으면 자리표시만 보인다 */
  value?: string
  readOnly?: boolean
  invalid?: boolean
}) => (
  <div
    className={cn(
      FIELD_BOX,
      readOnly && "bg-surface-disabled",
      invalid && "ring-destructive ring-2",
    )}
  >
    <input
      id={id}
      name={id}
      readOnly={readOnly}
      // 숫자 칸이라 브라우저가 채울 값이 없다
      autoComplete="off"
      placeholder={placeholder}
      {...(value === undefined ? {} : { value })}
      // 읽기 전용 칸은 시안이 값과 단위를 같은 회색으로 흐려 둔다
      className={cn(BARE, readOnly && "text-ash-500")}
    />
    {suffix ? (
      // 읽기 전용 칸은 시안이 값과 단위를 같은 회색으로 흐려 둔다
      <span
        className={cn(
          "shrink-0 pl-2 text-sm font-medium",
          readOnly ? "text-ash-500" : "text-ink-body",
        )}
      >
        {suffix}
      </span>
    ) : null}
  </div>
)

/** (4)(5) 연도별 표. 768 부터는 이름표 열이 붙은 표, 360 은 칸마다 이름표가 붙는 세로 목록이다. */
const PlanTable = ({
  id,
  columns,
  rows,
  extra,
}: {
  id: string
  columns: string[]
  rows: PlanRow[]
  /** 표 아래 전체 폭을 쓰는 줄 */
  extra?: React.ReactNode
}) => (
  <div className={cn("flex flex-col", TABLE_BOX)}>
    {/* 표 헤더는 768 부터 나온다. 칸 골격을 본문과 똑같이 잡아 세로줄을 맞춘다 */}
    <div className="bg-surface-disabled text-ink-muted hidden text-xs font-bold md:flex md:px-6 lg:px-8">
      <span className="w-28 shrink-0 py-2.5 text-center lg:w-32">구분</span>
      <div className="ml-8 flex flex-1 gap-0 lg:gap-2.5">
        {columns.map((column) => (
          <span key={column} className="flex-1 py-2.5 text-center">
            {column}
          </span>
        ))}
      </div>
    </div>

    <div className="flex flex-col gap-3 md:gap-4 md:px-6 md:py-4 lg:gap-2.5 lg:p-8">
      {rows.map((row) => (
        <div
          key={row.label}
          // 오류 문구가 붙어도 칸 윗선이 흔들리지 않도록 위 기준으로 세운다
          className="flex flex-col gap-2.5 md:flex-row md:items-start md:gap-8"
        >
          {/* 이름표는 입력 한 칸 높이(48) 안에서 가운데를 잡는다 */}
          <div className="flex items-baseline justify-between gap-2 md:min-h-12 md:w-30 md:shrink-0 md:flex-col md:items-start md:justify-center md:gap-0 md:self-stretch md:break-keep lg:w-32">
            <span className="text-ink-strong text-base font-bold break-keep">
              {row.label}
            </span>
            <span className="text-ink-hint text-xs font-normal whitespace-nowrap">
              {row.unit}
            </span>
          </div>

          {/* 시안은 이름표가 여러 줄이어도 칸이 줄 가운데에 선다.
              오류 문구가 붙으면 이 묶음이 가장 커져 자리를 그대로 지킨다 */}
          <div className="flex min-w-0 flex-col gap-2 md:flex-1 md:flex-row md:items-start md:gap-2.5 md:self-center">
            {columns.map((column) => {
              const fieldId = `${id}-${row.label}-${column}`
              return (
                <FieldErrorContext.Consumer key={column}>
                  {(errors) => (
                    <div className="flex min-w-0 flex-col gap-1 md:flex-1">
                      {/* 360 은 표 헤더가 없어 칸마다 연도를 붙인다 */}
                      <label
                        htmlFor={fieldId}
                        className="text-ink-body text-xs font-bold md:hidden"
                      >
                        {column}
                      </label>
                      <UnitField
                        id={fieldId}
                        placeholder="0"
                        suffix={row.suffix}
                        invalid={!!errors[fieldId]}
                      />
                      {/* 오류 문구는 칸마다 그 아래에 붙는다 */}
                      <RowError name={fieldId} className="mt-1.5" />
                    </div>
                  )}
                </FieldErrorContext.Consumer>
              )
            })}
          </div>
        </div>
      ))}
      {extra}
    </div>
  </div>
)

/** (4) 표 아래 두 줄. 이름표 한 칸에 넓은 입력 하나가 붙는다. */
const WideRow = ({
  id,
  label,
  unit,
  suffix,
}: {
  id: string
  label: string
  unit?: string
  suffix: string
}) => (
  <div className="flex flex-col gap-2.5 md:flex-row md:items-start md:gap-8">
    <div className="flex items-baseline justify-between gap-2 md:min-h-12 md:w-30 md:shrink-0 md:flex-col md:items-start md:justify-center md:gap-0 md:self-stretch md:break-keep lg:w-32">
      <label
        htmlFor={id}
        className="text-ink-strong text-base font-bold break-keep"
      >
        {label}
      </label>
      {unit ? (
        <span className="text-ink-hint text-xs font-normal whitespace-nowrap">
          {unit}
        </span>
      ) : null}
    </div>
    <FieldErrorContext.Consumer>
      {(errors) => (
        <div className="flex min-w-0 flex-col md:flex-1">
          <UnitField
            id={id}
            placeholder="0"
            suffix={suffix}
            invalid={!!errors[id]}
          />
          <RowError name={id} className="mt-2.5" />
        </div>
      )}
    </FieldErrorContext.Consumer>
  </div>
)

const ApplicationForm = ({
  round = 1,
}: {
  /** 신청 회차. 2차는 카드 구성이 달라진다 */
  round?: number
}) => {
  const isSecond = round === 2

  // (6) 표에 세울 줄. 감축잠재량 산정에서 넘어오는 목록이라 화면에서 늘리거나 줄이지 않는다.
  const rows = INVESTMENT_ROWS

  // (7) 감축기술 도입현황. 2차에서만 쓰고 사용자가 줄을 늘린다.
  const [techRows, setTechRows] = useState<number[]>(() =>
    Array.from({ length: ADOPTION_ROW_COUNT }, (_, index) => index + 1),
  )
  const nextTechKey = useRef(ADOPTION_ROW_COUNT + 1)

  /*
   * 줄이 늘거나 줄면 표 높이가 바뀐다.
   * [행 추가하기] 버튼을 기준점으로 삼아 바뀐 높이만큼 창을 따라 움직여,
   * 사용자가 보던 자리(버튼과 그 위의 줄)가 그대로 화면에 남게 한다.
   * 새 줄이 헤더 뒤로 들어갈 만큼 크면 그만큼 덜 내려가 윗선까지 보이게 한다.
   * 표 상자에 overflow-hidden 이 걸려 있어 scrollIntoView 는 그 상자 안을 움직이므로 쓰지 않는다.
   * 그리기 전에 옮겨야 화면이 두 번 튀지 않아 useLayoutEffect 를 쓴다.
   */
  const addRowButtonRef = useRef<HTMLButtonElement>(null)
  const buttonTopBefore = useRef<number | null>(null)
  /** 방금 늘린 줄. 헤더에 가리지 않게 윗선을 확인할 때 쓴다 */
  const followRowKey = useRef<number | null>(null)
  const [rowsTick, setRowsTick] = useState(0)

  const markRowsChange = () => {
    buttonTopBefore.current =
      addRowButtonRef.current?.getBoundingClientRect().top ?? null
    setRowsTick((tick) => tick + 1)
  }

  const addTechRow = () => {
    const key = nextTechKey.current++
    followRowKey.current = key
    markRowsChange()
    setTechRows((prev) => [...prev, key])
  }

  /** 줄은 항상 하나는 남는다. 마지막 한 줄이면 새 키로 갈아 끼워 값만 비운다 */
  const removeTechRow = (key: number) => {
    const fresh = nextTechKey.current++
    markRowsChange()
    setTechRows((prev) =>
      prev.length > 1 ? prev.filter((row) => row !== key) : [fresh],
    )
  }

  useLayoutEffect(() => {
    if (!rowsTick) return
    const button = addRowButtonRef.current
    const before = buttonTopBefore.current
    const rowKey = followRowKey.current
    buttonTopBefore.current = null
    followRowKey.current = null
    if (!button || before === null) return
    // 기준점이 화면 밖이면 사용자가 표를 보고 있지 않다는 뜻이라 건드리지 않는다.
    if (before < 0 || before > window.innerHeight) return

    let delta = button.getBoundingClientRect().top - before

    const row =
      rowKey === null
        ? null
        : formRef.current?.querySelector<HTMLElement>(
            `[data-row-key="${rowKey}"]`,
          )
    if (row) {
      // 옮긴 뒤 새 줄 윗선이 고정 헤더 아래로 들어가면 그만큼 덜 내려간다
      const topGap = navBarHeight + 16
      const rowTop = row.getBoundingClientRect().top - delta
      if (rowTop < topGap) delta -= topGap - rowTop
    }

    if (delta !== 0) window.scrollBy({ top: delta })
  }, [rowsTick])

  // [다음으로] 를 누른 뒤부터 오류 문구를 보여 준다. 다른 자가진단 화면과 같은 방식이다.
  // 회원정보를 받아 (1) 기업정보 칸을 채우는 자리
  const [isLoadingProfile, loadProfile] = useLoadingButton()
  // 자가진단 결과를 받아 (4) 표를 채우는 자리
  const [isLoadingSelfCheck, loadSelfCheckData] = useLoadingButton()

  const formRef = useRef<HTMLFormElement>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [hasTried, setHasTried] = useState(false)

  const collectErrors = () => {
    const form = formRef.current
    if (!form) return {}
    const data = new FormData(form)
    const valueOf = (name: string) => String(data.get(name) ?? "").trim()

    const next: Record<string, string> = {}
    Object.entries(REQUIRED_FIELDS).forEach(([name, label]) => {
      const filled =
        name === "zip-code"
          ? ADDRESS_FIELDS.every((field) => valueOf(field))
          : valueOf(name)
      if (!filled) next[name] = requiredMessage(label)
    })

    // (4)(5) 표: 문구가 칸마다 붙어서 검사도 칸 단위로 한다. 2차에는 이 카드가 없다
    if (!isSecond) {
      TABLE_GROUPS.forEach((group) => {
        group.rows.forEach((row) => {
          group.columns.forEach((column) => {
            const name = `${group.id}-${row.label}-${column}`
            if (!valueOf(name)) next[name] = requiredMessage(row.label)
          })
        })
      })

      Object.entries(WIDE_FIELDS).forEach(([name, label]) => {
        if (!valueOf(name)) next[name] = requiredMessage(label)
      })

      // (6) 표: 입력 가능한 시작일·종료일만 본다. 2차는 통째로 읽기 전용이라 뺀다
      rows.forEach((row) => {
        const filled = ["start", "end"].every((edge) =>
          valueOf(`investment-${row.code}-${edge}`),
        )
        if (!filled) {
          next[`investment-${row.code}-period`] = requiredMessage("사업기간")
        }
      })
    }

    // (7) 감축기술 도입현황: 2차에만 있고 도입시기까지 한 줄로 묶어 본다
    if (isSecond) {
      techRows.forEach((rowKey) => {
        ADOPTION_COLUMNS.forEach((column) => {
          const name = `adoption-${rowKey}-${column.key}`
          // 이름표는 "투자금 (천원)" 꼴이라 문구에서는 괄호 단위를 뗀다
          if (!valueOf(name)) {
            next[name] = requiredMessage(column.label.replace(/\s*\(.*$/, ""))
          }
        })
        if (!valueOf(`adoption-${rowKey}-adopted-at`)) {
          next[`adoption-${rowKey}-adopted-at`] = requiredMessage("도입시기")
        }
      })
    }

    return next
  }

  const handleNext = () => {
    setHasTried(true)
    const next = collectErrors()
    setErrors(next)

    // 첫 오류 칸으로 옮겨 준다. 날짜·업종은 숨은 입력이라 보이는 컨트롤을 찾는다.
    const first = Object.keys(next)[0]
    if (!first) return
    const form = formRef.current
    const control =
      form?.querySelector<HTMLElement>(`#${CSS.escape(first)}`) ??
      form?.querySelector<HTMLElement>(`[name="${first}"]`)
    control?.focus()
    control?.scrollIntoView({ block: "center" })
  }

  // 한 번 검사한 뒤에는 입력할 때마다 다시 본다.
  const revalidate = () => {
    if (hasTried) setErrors(collectErrors())
  }

  return (
    <div className="flex w-full max-w-316 flex-col md:gap-8 md:px-7 md:pt-12 md:pb-28 lg:gap-10 lg:px-8 lg:pt-14 lg:pb-42">
      {/* 360 시안의 상단 이름은 카드 이름이 아니라 단계 이름이다 */}
      <StepMobileNav
        title={`${round}차 신청`}
        step={1}
        total={APPLICATION_STEPS.length}
      />

      <div className="flex flex-col gap-8 max-md:hidden lg:flex-row lg:items-start lg:justify-between lg:gap-8">
        <h2 className="text-ink-strong text-lg font-bold whitespace-nowrap md:text-3xl lg:text-4xl">
          탄소중립 선도기업 신청 {round}차
        </h2>
        {/* Stepper 내부 ol 의 줄바꿈·폭을 밖에서 제어한다. 지우면 스테퍼가 접힌다. */}
        <div className="[&_ol]:flex-nowrap sm:w-full sm:[&_ol]:w-full sm:[&_ol>li]:flex-1 sm:[&_ol>li>div:nth-child(1)]:flex-1 sm:[&_ol>li>div:nth-child(3)]:flex-1 lg:w-104">
          <Stepper items={APPLICATION_STEPS} activeIndex={0} size={13} />
        </div>
      </div>

      <BaseInfo items={NOTICES_BY_ROUND[round] ?? NOTICES_BY_ROUND[1]} />

      <FieldErrorContext.Provider value={errors}>
        <form
          ref={formRef}
          noValidate
          onSubmit={(event) => event.preventDefault()}
          onChange={revalidate}
          className="flex flex-col gap-6 max-md:px-5 max-md:pt-12 max-md:pb-24 lg:gap-10"
        >
          {/* (1) 기업정보 */}
          <Card
            id="company-info"
            title="기업정보"
            description="법인명, 사업자번호, 대표자, 소재지 등 기업 기본 정보를 입력합니다."
            action={
              <HeaderButton loading={isLoadingProfile} onClick={loadProfile}>
                내 정보 불러오기
              </HeaderButton>
            }
          >
            <div className="grid gap-3 md:grid-cols-2 md:gap-4 lg:gap-11">
              <Field label="업체명" htmlFor="company-name">
                <input
                  id="company-name"
                  name="company-name"
                  autoComplete="organization"
                  placeholder="법인 또는 상호명 입력"
                  className={FIELD}
                />
              </Field>
              <Field label="대표자" htmlFor="ceo-name">
                <input
                  id="ceo-name"
                  name="ceo-name"
                  autoComplete="name"
                  placeholder="대표자 성명"
                  className={FIELD}
                />
              </Field>
              <Field label="사업자등록번호" htmlFor="business-number">
                <input
                  id="business-number"
                  name="business-number"
                  autoComplete="off"
                  placeholder="000-00-00000"
                  className={FIELD}
                />
              </Field>
              <Field
                label="법인등록번호"
                hint="(000000-0000000)"
                htmlFor="corporation-number"
              >
                <input
                  id="corporation-number"
                  name="corporation-number"
                  autoComplete="off"
                  placeholder="000000-0000000"
                  className={FIELD}
                />
              </Field>

              <Field
                label="기업소재지"
                htmlFor="zip-code"
                className="md:col-span-2"
              >
                {/* 우편번호 줄만 한 칸 폭이고, 주소 두 줄은 카드 폭을 다 쓴다 */}
                <>
                  <div
                    data-field-row
                    className="flex gap-2.5 md:w-1/2 md:pr-2 lg:pr-6"
                  >
                    {/* 우편번호·기본주소는 주소검색 팝업으로 채운다 */}
                    <input
                      id="zip-code"
                      name="zip-code"
                      autoComplete="postal-code"
                      readOnly
                      placeholder="우편번호"
                      className={cn(FIELD, "bg-surface-disabled")}
                    />
                    <AddressSearchDialog>
                      <button type="button" className={SIDE_BUTTON}>
                        주소검색
                      </button>
                    </AddressSearchDialog>
                  </div>
                  <input
                    id="address"
                    name="address"
                    autoComplete="address-line1"
                    readOnly
                    placeholder="기본주소"
                    className={cn(FIELD, "bg-surface-disabled")}
                  />
                  <input
                    id="address-detail"
                    name="address-detail"
                    autoComplete="address-line2"
                    placeholder="상세주소 입력"
                    className={FIELD}
                  />
                </>
              </Field>

              <Field label="대표자 연락처" htmlFor="ceo-phone">
                <input
                  id="ceo-phone"
                  name="ceo-phone"
                  autoComplete="tel"
                  placeholder="010-0000-0000"
                  className={FIELD}
                />
              </Field>
              <Field label="전자우편" htmlFor="company-email">
                <input
                  id="company-email"
                  name="company-email"
                  autoComplete="email"
                  placeholder="example@company.com"
                  className={FIELD}
                />
              </Field>
            </div>
          </Card>

          {/* (2) 기업현황 */}
          <Card
            id="company-status"
            title="기업현황"
            description="업종, 설립일자, 주생산품 등 사업 현황 정보를 입력합니다."
          >
            <div className="grid gap-3 md:grid-cols-2 md:gap-4 lg:gap-11">
              <Field label="설립일자" htmlFor="founded-at">
                <DateField id="founded-at" placeholder="2024-06-01" />
              </Field>

              <Field label="업종" htmlFor="industry">
                {/* 셀렉트 원본이 box-shadow 를 직접 잡고 있어 오류 링이 트리거에 걸리지
                    않는다. 한 겹 감싸서 Field 의 오류 링 규칙을 그대로 받는다. */}
                <div className="rounded-md">
                  {/* Radix 가 폼 전송용으로 숨겨 두는 select 에도 값이 붙는다 */}
                  <Select name="industry" autoComplete="off">
                    <SelectTrigger
                      id="industry"
                      className="border-line-field bg-surface-field text-ink-strong data-[placeholder]:text-ink-strong focus-visible:ring-ash-600 w-full rounded-md px-4 text-sm font-medium focus-visible:ring-2"
                    >
                      <SelectValue placeholder="업종 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {INDUSTRIES.map((industry) => (
                        <SelectItem key={industry} value={industry}>
                          {industry}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </Field>

              <Field label="업종코드" htmlFor="industry-code">
                <input
                  id="industry-code"
                  name="industry-code"
                  autoComplete="off"
                  placeholder="예)  212110"
                  className={FIELD}
                />
              </Field>
              <Field label="주생산품" htmlFor="main-product">
                <input
                  id="main-product"
                  name="main-product"
                  autoComplete="off"
                  placeholder="예) 자동차 부품, 반도체"
                  className={FIELD}
                />
              </Field>
              <Field label="연간생산량" htmlFor="yearly-output">
                <UnitField
                  id="yearly-output"
                  placeholder="숫자 입력"
                  suffix="ton"
                />
              </Field>
            </div>
          </Card>

          {/* (3) 담당자정보 */}
          <Card
            id="manager-info"
            title="담당자정보"
            description="신청 관련 담당자의 연락처 및 소속 정보를 입력합니다."
          >
            <div className="grid gap-3 md:grid-cols-2 md:gap-4 lg:gap-11">
              <Field label="담당자명" htmlFor="manager-name">
                <input
                  id="manager-name"
                  name="manager-name"
                  autoComplete="name"
                  placeholder="담당자 성명"
                  className={FIELD}
                />
              </Field>
              <Field label="부서 / 직책" htmlFor="manager-department">
                <input
                  id="manager-department"
                  name="manager-department"
                  autoComplete="organization-title"
                  placeholder="예) 환경안전팀 / 과장"
                  className={FIELD}
                />
              </Field>
              <Field label="전화번호" htmlFor="manager-tel">
                <input
                  id="manager-tel"
                  name="manager-tel"
                  autoComplete="off"
                  placeholder="02-0000-0000"
                  className={FIELD}
                />
              </Field>
              <Field label="팩스번호" hint="(선택)" htmlFor="manager-fax">
                <input
                  id="manager-fax"
                  name="manager-fax"
                  autoComplete="off"
                  placeholder="02-0000-0000"
                  className={FIELD}
                />
              </Field>
              <Field label="전자우편" htmlFor="manager-email">
                <input
                  id="manager-email"
                  name="manager-email"
                  autoComplete="email"
                  placeholder="example@company.com"
                  className={FIELD}
                />
              </Field>
              <Field label="연락처" htmlFor="manager-phone">
                <input
                  id="manager-phone"
                  name="manager-phone"
                  autoComplete="tel"
                  placeholder="010-0000-0000"
                  className={FIELD}
                />
              </Field>
            </div>
          </Card>

          {/* (4)(5) 는 1차 양식에만 있다. 2차는 점검 신청서 양식이라 빠진다 */}
          {!isSecond ? (
            <>
              {/* (4) 탄소중립 기준연도 현황 */}
              <Card
                id="base-year-status"
                title="탄소중립 기준연도 현황"
                description="2023~2025년 매출액 및 온실가스 배출량 현황을 입력합니다."
                cta={
                  <HeaderButton
                    brand
                    icon={<Download aria-hidden="true" />}
                    loading={isLoadingSelfCheck}
                    onClick={loadSelfCheckData}
                    // 문구가 짧아져도 768 이상에서 버튼이 줄어들지 않게 바닥을 깐다
                    className="md:min-w-50"
                  >
                    자가진단 데이터 불러오기
                  </HeaderButton>
                }
              >
                <PlanTable
                  id="base-year"
                  columns={BASE_YEAR_COLUMNS}
                  rows={BASE_YEAR_ROWS}
                  extra={
                    <>
                      <WideRow
                        id="base-year-standard"
                        label="탄소중립 기준연도"
                        suffix="년"
                      />
                      <WideRow
                        id="base-year-average"
                        label="기준연도 온실가스 평균배출량"
                        unit="(tCO₂eq)"
                        suffix="3개년 평균"
                      />
                    </>
                  }
                />
              </Card>

              {/* (5) 탄소감축계획 */}
              <Card
                id="reduction-plan"
                title="탄소감축계획"
                description="2026~2028년 연도별 탄소감축 투자계획 및 목표를 입력합니다."
              >
                <PlanTable
                  id="reduction-plan"
                  columns={REDUCTION_PLAN_COLUMNS}
                  rows={REDUCTION_PLAN_ROWS}
                />
              </Card>
            </>
          ) : null}

          {/* (6) 향후 3년간 탄소중립 투자계획 */}
          <Card
            id="investment-plan"
            title={
              isSecond ? "탄소중립 투자계획" : "향후 3년간 탄소중립 투자계획"
            }
            description={
              isSecond
                ? "1차 신청 시 작성한 탄소중립 투자계획과 동일한 정보가 노출됩니다. 이 항목은 수정할 수 없습니다."
                : "감축잠재량 산정에서 넘어온 감축기술별 투자계획입니다. 사업기간만 입력합니다."
            }
          >
            <div className={cn("flex flex-col", TABLE_BOX)}>
              {/* 표 헤더는 PC 시안에만 있다 */}
              <div className="bg-surface-disabled text-ink-muted hidden gap-8 px-8 text-xs font-bold xl:flex">
                <span className="w-10 shrink-0 py-2.5 text-center">No.</span>
                <div className="flex flex-1 gap-2.5">
                  <span className="flex-1 py-2.5 text-center">감축기술</span>
                  <span className="flex-1 py-2.5 text-center">감축설비명</span>
                  <span className="flex-2 py-2.5 text-center">사업기간</span>
                  {/* 시안은 이름이 500, 괄호 안 단위가 400 이다 */}
                  <span className="flex-1 py-2.5 text-center font-medium">
                    투자금 <span className="font-normal">(천원)</span>
                  </span>
                  <span className="flex-1 py-2.5 text-center font-medium">
                    온실가스감축량 <span className="font-normal">(tCO₂eq)</span>
                  </span>
                </div>
              </div>

              <div className="divide-line-card flex flex-col divide-y md:p-6 lg:p-8 xl:gap-2.5 xl:divide-y-0">
                {rows.map((row, index) => (
                  <div
                    key={row.code}
                    // 오류 문구가 붙어도 칸 윗선이 흔들리지 않도록 위 기준으로 세운다
                    className="flex flex-col gap-4 py-6 first:pt-0 last:pb-0 xl:flex-row xl:items-start xl:gap-8 xl:py-0"
                  >
                    {/* 번호는 입력 한 칸 높이(48) 안에서 가운데를 잡는다 */}
                    <span className="bg-surface-disabled text-ink-strong flex size-8 shrink-0 items-center justify-center rounded-full text-base font-bold xl:h-12 xl:w-10 xl:rounded-none xl:bg-transparent xl:font-normal">
                      {index + 1}
                    </span>

                    <div className="grid gap-4 md:grid-cols-2 md:gap-x-2.5 xl:flex xl:flex-1 xl:items-start xl:gap-2.5">
                      {INVESTMENT_COLUMNS.slice(0, 2).map((column) => (
                        <Field
                          key={column.key}
                          label={column.label}
                          htmlFor={`investment-${row.code}-${column.key}`}
                          className="xl:min-w-0 xl:flex-1 xl:[&>label]:sr-only"
                        >
                          {/* 감축잠재량 산정에서 넘어오는 값이라 읽기 전용이다 */}
                          <input
                            id={`investment-${row.code}-${column.key}`}
                            name={`investment-${row.code}-${column.key}`}
                            readOnly
                            autoComplete="off"
                            placeholder={column.placeholder}
                            value={
                              column.key === "tech" ? row.tech : row.facility
                            }
                            // 읽기 전용 칸은 시안이 값을 회색으로 흐려 둔다
                            className={cn(
                              FIELD,
                              "bg-surface-disabled text-ash-500",
                            )}
                          />
                        </Field>
                      ))}

                      {/* 오류 문구가 두 칸 아래에 놓이도록 세로로 묶는다 */}
                      <div className="flex flex-col gap-2.5 md:col-span-2 xl:min-w-0 xl:flex-2">
                        <label
                          htmlFor={`investment-${row.code}-start`}
                          className="text-ink-strong text-base font-bold break-keep xl:sr-only"
                        >
                          사업기간
                        </label>
                        {isSecond ? (
                          // 2차는 1차에 적어 둔 기간을 그대로 되짚기만 한다
                          <input
                            id={`investment-${row.code}-start`}
                            name={`investment-${row.code}-period`}
                            readOnly
                            autoComplete="off"
                            value={row.period}
                            className={cn(
                              FIELD,
                              "bg-surface-disabled text-ash-500",
                            )}
                          />
                        ) : (
                          <>
                            {/* 768 시안은 시작일·종료일이 한 줄에 반씩, 360 만 위아래로 쌓인다 */}
                            <div className="flex flex-col gap-2.5 md:flex-row">
                              <FieldErrorContext.Consumer>
                                {(errors) =>
                                  ["start", "end"].map((edge) => (
                                    <div key={edge} className="min-w-0 flex-1">
                                      <DateField
                                        id={`investment-${row.code}-${edge}`}
                                        placeholder={
                                          edge === "start" ? "시작일" : "종료일"
                                        }
                                        invalid={
                                          !!errors[
                                            `investment-${row.code}-period`
                                          ]
                                        }
                                      />
                                    </div>
                                  ))
                                }
                              </FieldErrorContext.Consumer>
                            </div>
                            <RowError name={`investment-${row.code}-period`} />
                          </>
                        )}
                      </div>

                      {INVESTMENT_COLUMNS.slice(2).map((column) => (
                        <Field
                          key={column.key}
                          label={column.label}
                          htmlFor={`investment-${row.code}-${column.key}`}
                          className="xl:min-w-0 xl:flex-1 xl:[&>label]:sr-only"
                        >
                          <UnitField
                            id={`investment-${row.code}-${column.key}`}
                            placeholder={column.placeholder}
                            suffix={column.suffix ?? ""}
                            value={
                              column.key === "amount"
                                ? row.amount
                                : row.reduction
                            }
                            readOnly
                          />
                        </Field>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* (7) 감축기술 도입현황 — 2차 점검 신청서에만 있는 카드 */}
          {isSecond ? (
            <Card
              id="adoption-status"
              title="감축기술 도입현황"
              description="투자계획에 따라 실제로 도입한 감축기술을 입력합니다. 행 추가 버튼으로 항목을 자유롭게 추가할 수 있습니다."
            >
              <div className={cn("flex flex-col", TABLE_BOX)}>
                {/* 표 헤더는 PC 시안에만 있다 */}
                <div className="bg-surface-disabled text-ink-muted hidden gap-8 px-8 text-xs font-bold xl:flex">
                  <span className="w-10 shrink-0 py-2.5 text-center">No.</span>
                  <div className="flex flex-1 gap-2.5">
                    <span className="flex-1 py-2.5 text-center">감축기술</span>
                    <span className="flex-1 py-2.5 text-center">
                      감축설비명
                    </span>
                    <span className="flex-1 py-2.5 text-center">도입시기</span>
                    {/* 시안은 이름이 500, 괄호 안 단위가 400 이다 */}
                    <span className="flex-1 py-2.5 text-center font-medium">
                      투자금 <span className="font-normal">(천원)</span>
                    </span>
                    {/* 삭제 버튼 자리 */}
                    <span className="w-21 shrink-0" />
                  </div>
                </div>

                <div className="divide-line-card flex flex-col divide-y md:p-6 lg:p-8 xl:gap-2.5 xl:divide-y-0">
                  {techRows.map((rowKey, index) => (
                    <div
                      key={rowKey}
                      // 줄을 늘린 뒤 창을 따라 옮길 때 이 줄을 찾는다
                      data-row-key={rowKey}
                      // 오류 문구가 붙어도 칸 윗선이 흔들리지 않도록 위 기준으로 세운다
                      className="flex flex-col gap-4 py-6 first:pt-0 last:pb-0 xl:flex-row xl:items-start xl:gap-8 xl:py-0"
                    >
                      {/* 번호는 입력 한 칸 높이(48) 안에서 가운데를 잡는다 */}
                      <span className="bg-surface-disabled text-ink-strong flex size-8 shrink-0 items-center justify-center rounded-full text-base font-bold xl:h-12 xl:w-10 xl:rounded-none xl:bg-transparent xl:font-normal">
                        {index + 1}
                      </span>

                      <div className="grid gap-4 md:grid-cols-2 md:gap-x-2.5 xl:flex xl:flex-1 xl:items-start xl:gap-2.5">
                        {ADOPTION_COLUMNS.slice(0, 2).map((column) => (
                          <Field
                            key={column.key}
                            label={column.label}
                            htmlFor={`adoption-${rowKey}-${column.key}`}
                            className="xl:min-w-0 xl:flex-1 xl:[&>label]:sr-only"
                          >
                            <input
                              id={`adoption-${rowKey}-${column.key}`}
                              name={`adoption-${rowKey}-${column.key}`}
                              autoComplete="off"
                              placeholder={column.placeholder}
                              className={cn(
                                FIELD,
                                errors[`adoption-${rowKey}-${column.key}`] &&
                                  "ring-destructive ring-2",
                              )}
                            />
                          </Field>
                        ))}

                        <Field
                          label="도입시기"
                          htmlFor={`adoption-${rowKey}-adopted-at`}
                          className="xl:min-w-0 xl:flex-1 xl:[&>label]:sr-only"
                        >
                          <DateField
                            id={`adoption-${rowKey}-adopted-at`}
                            placeholder="도입일"
                            invalid={!!errors[`adoption-${rowKey}-adopted-at`]}
                          />
                        </Field>

                        {ADOPTION_COLUMNS.slice(2).map((column) => (
                          <Field
                            key={column.key}
                            label={column.label}
                            htmlFor={`adoption-${rowKey}-${column.key}`}
                            className="xl:min-w-0 xl:flex-1 xl:[&>label]:sr-only"
                          >
                            <UnitField
                              id={`adoption-${rowKey}-${column.key}`}
                              placeholder={column.placeholder}
                              suffix={column.suffix ?? ""}
                              invalid={
                                !!errors[`adoption-${rowKey}-${column.key}`]
                              }
                            />
                          </Field>
                        ))}

                        <button
                          type="button"
                          aria-label={`${index + 1}번 행 삭제`}
                          onClick={() => removeTechRow(rowKey)}
                          className={cn(
                            SIDE_BUTTON,
                            "w-full md:col-span-2 xl:w-21",
                          )}
                        >
                          삭제
                        </button>
                      </div>
                    </div>
                  ))}

                  <button
                    ref={addRowButtonRef}
                    type="button"
                    onClick={addTechRow}
                    // 시안 PC_add_BTN: default 는 #d7e0f3 면 · 테두리 없음,
                    // hover 는 #ecf0f8 면 + 브랜드색 1px 테두리다. 글자색은 그대로 둔다.
                    className="bg-surface-action text-brand-primary hover:bg-surface-flow hover:border-brand-primary focus-visible:ring-ash-600 mt-6 flex h-14 cursor-pointer items-center justify-center gap-1.5 rounded-md border border-transparent text-base font-bold transition-colors outline-hidden focus-visible:ring-2 md:h-16 [&_svg]:size-5"
                  >
                    <CirclePlus aria-hidden="true" />행 추가하기
                  </button>
                </div>
              </div>
            </Card>
          ) : null}

          <div className="flex items-center justify-between gap-2 md:gap-3">
            <Button
              type="button"
              variant="outline"
              className="h-11 flex-1 gap-1 rounded-lg text-sm font-bold md:h-13 md:w-42 md:flex-none [&_svg]:size-5"
            >
              <ArrowLeft aria-hidden="true" />
              이전으로
            </Button>
            <Button
              type="button"
              onClick={handleNext}
              className="h-11 flex-1 gap-1 rounded-lg text-sm font-bold md:h-13 md:w-42 md:flex-none [&_svg]:size-5"
            >
              다음으로
              <ArrowRight aria-hidden="true" />
            </Button>
          </div>
        </form>
      </FieldErrorContext.Provider>
    </div>
  )
}

export default ApplicationForm
