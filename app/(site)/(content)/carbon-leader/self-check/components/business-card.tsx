"use client"

import { useEffect, useState } from "react"

import { format } from "date-fns"
import { ko } from "date-fns/locale"
import {
  Calendar as CalendarIcon,
  Check,
  ChevronDown,
  ChevronUp,
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import BusinessDetail, {
  formatResult,
} from "@/app/(site)/(content)/carbon-leader/self-check/components/business-detail"
import ConfirmDialog from "@/app/(site)/(content)/carbon-leader/self-check/components/confirm-dialog"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  INDUSTRY_OPTIONS,
  REDUCTION_METHODOLOGIES,
} from "@/constants/carbon-leader-reduction-methodologies"
import {
  fuelOptionsOf,
  reductionKeyOf,
  schemaOf,
  type ResultValues,
} from "@/constants/carbon-leader-reduction-schema"
import { cn } from "@/lib/utils"
import { computeResults, resultHintOf } from "@/lib/reduction-calc"
import { CALENDAR_PROPS } from "@/constants/calendar-dropdown"

// 감축잠재량 산정(STEP 3)에서 [사업 추가] 로 붙는 사업 카드.
// 시안 기준 ① 기업 정보 입력 · ② 감축방법론 선택 두 구간으로 나뉘고,
// 방법론을 고르기 전까지는 상세정보 대신 안내 박스만 보여준다.

const FieldLabel = ({
  htmlFor,
  children,
}: {
  htmlFor: string
  children: React.ReactNode
}) => (
  <Label htmlFor={htmlFor} className="text-ink-strong text-base font-bold">
    {children}
  </Label>
)

// 라벨에 (선택) 이 붙은 운전개시일 말고는 모두 필수다.
const REQUIRED: {
  key: keyof Business
  message: string
}[] = [
  { key: "name", message: "사업명을 입력해 주세요." },
  { key: "code", message: "사업번호를 입력해 주세요." },
  { key: "industry", message: "업종을 선택해 주세요." },
  { key: "investment", message: "투자비를 입력해 주세요." },
  { key: "category", message: "에너지 항목을 선택해 주세요." },
  { key: "methodology", message: "감축방법론을 선택해 주세요." },
]

// 입력값이 하나라도 있으면 삭제 전에 확인을 받는다.
export const hasAnyInput = (business: Business) =>
  REQUIRED.some(({ key }) => String(business[key] ?? "").trim()) ||
  !!business.startedOn

/** 상세 입력에서 아직 채우지 않은 칸(연료 선택 · 개선전/개선후 입력) */
export const missingDetailCells = (business: Business): string[] => {
  const schema = schemaOf(business.methodology)
  if (!schema) return []
  const keys: string[] = []
  const single = !!schema.singleColumn
  for (const row of schema.dropdowns.filter((item) => !item.hidden)) {
    const fuels = fuelOptionsOf(row.fuelSet)
    for (const [ref, fallback] of [
      [row.cellRefBefore, row.beforeValue],
      [single ? undefined : row.cellRefAfter, row.afterValue],
    ] as const) {
      if (!ref) continue
      // 스팀처럼 연료표에 없는 고정 표기는 입력 대상이 아니고,
      // 연료표에 있는 초기 선택은 고르기 전에도 채워진 것으로 본다.
      if ((fallback || "").trim()) continue
      keys.push(`dd:${ref}`)
    }
  }
  for (const row of schema.inputRows.filter((item) => !item.hidden)) {
    for (const side of ["Before", "After"] as const) {
      const ref = side === "Before" ? row.cellRefBefore : row.cellRefAfter
      if (!ref) continue
      if (row.afterOnly && side === "Before") continue
      if (row.beforeOnly && side === "After") continue
      // 읽기 전용 칸(시안 값 · 고정값 · 연료표 · 개선전 반영 · 연동)은 검사하지 않는다.
      const readOnly =
        side === "Before"
          ? row.sampleBefore ||
            row.fixedValueBefore ||
            row.lookupBefore ||
            row.readOnlyBefore
          : row.sampleAfter ||
            row.fixedValueAfter ||
            row.lookupAfter ||
            row.readOnlyAfter ||
            row.mirrorAfter
      if (readOnly) continue
      // 초기값이 있는 칸은 비워도 그 값이 들어간 것으로 본다.
      if (side === "Before" ? row.defaultBefore : row.defaultAfter) continue
      keys.push(ref)
    }
  }
  // 데이터 근거: 출처 입력 · 스팀 배출계수 · 제품수명(초기값이 있으면 채워진 것으로 본다)
  for (const row of schema.basisRows.filter((item) => !item.hidden)) {
    if (row.rowType === "lifetime") {
      if (row.fixedValue === undefined) keys.push("life")
      continue
    }
    if (
      row.rowType === "steam-ef" &&
      row.cellRef &&
      row.fixedValue === undefined
    )
      keys.push(row.cellRef)
    keys.push(`src:${row.key ?? ""}`)
  }
  return keys.filter((key) => !String(business.cells[key] ?? "").trim())
}

/** 카드 전체(기본정보 + 상세 입력)에 빈 칸이 있는지 */
export const hasMissingOf = (business: Business) =>
  missingFieldsOf(business).length > 0 ||
  missingDetailCells(business).length > 0

export const missingFieldsOf = (business: Business) =>
  REQUIRED.filter(({ key }) => !String(business[key] ?? "").trim()).map(
    ({ key }) => key,
  )

const FieldError = ({ show, message }: { show: boolean; message: string }) =>
  show ? (
    <p role="alert" className="text-ink-error text-sm">
      {message}
    </p>
  ) : null

/**
 * 목록 맨 위에 항상 두는 안내 항목의 값. 기획 사이트의 placeholder 옵션처럼
 * 값을 고른 뒤에도 목록에 남지만, 고를 수는 없다(disabled).
 */
const PLACEHOLDER_OPTION = "__placeholder__"

const methodologiesOf = (category: string): readonly string[] =>
  REDUCTION_METHODOLOGIES.find((group) => group.value === category)
    ?.methodologies ?? []

const fieldClass =
  "border-line-field bg-surface-field text-ink-strong placeholder:text-ink-placeholder h-13 rounded-md text-sm hover:ring-2 hover:ring-ash-600 focus-visible:ring-2 focus-visible:ring-ash-600"

// 셀렉트 트리거는 원본이 data-[size=default]:h-12 를 갖고 있어 h-13 이 밀린다.
// 값이 길면 트리거를 넘치지 않게 말줄임한다.
const selectClass = cn(
  fieldClass,
  "w-full min-w-0 data-[size=default]:h-13 [&>span[data-slot=select-value]]:block [&>span[data-slot=select-value]]:min-w-0 [&>span[data-slot=select-value]]:truncate",
  // 초점 표시는 다른 화면 select(인벤토리 배출량 산정 등)와 같은 규격이다.
  // 공통 트리거가 ring/50 에 테두리 색까지 바꾸므로 둘 다 덮어쓴다.
  "focus-visible:border-line-field focus-visible:ring-ash-600 focus-visible:ring-2",
)

// 비활성 상태는 시안의 읽기 전용 칸과 같은 색을 쓴다(원본의 opacity-50 은 덮는다).
const disabledSelectClass = cn(
  selectClass,
  "disabled:bg-ash-200 disabled:text-ash-500 disabled:opacity-100 disabled:data-[placeholder]:text-ash-500",
)

// 날짜 표기 형식. 공용 DatePicker 는 yyyy.MM.dd 로 고정돼 있어
// 원본을 건드리지 않고 Popover + Calendar 를 직접 조합해 쓴다.
const DATE_FORMAT = "yyyy-MM-dd"

// 에러 표시는 각 컴포넌트가 isValid 로 제공하는 기본 스타일을 그대로 쓴다.
export interface Business {
  id: number
  name: string
  code: string
  industry: string
  startedOn: Date | undefined
  investment: string
  category: string
  methodology: string
  /** 상세 입력. 엑셀 셀 참조를 키로 쓴다 */
  cells: Record<string, string>
  isOpen: boolean
}

export const createBusiness = (id: number): Business => ({
  id,
  name: "",
  code: "",
  industry: "",
  startedOn: undefined,
  investment: "",
  category: "",
  methodology: "",
  cells: {},
  isOpen: true,
})

// 접었을 때는 빈 머리만 남는 게 아니라 입력값 요약과 연차별 감축량을 보여준다.
// 시안의 읽기 전용 칸: 라이트 #f3f3f3/#d2d2d2, 다크 #222222/#666666, 글자 #999999
const ReadOnlyBox = ({ value }: { value: string }) => (
  <p className="border-line-field bg-ash-200 text-ash-500 flex h-13 items-center rounded-md border px-4 text-sm">
    {value || "-"}
  </p>
)

/** 접힘 요약에 세우는 연차. 값은 ④ 와 같은 results 에서 읽는다 */
const YEARS = [1, 2, 3] as const

const CollapsedSummary = ({
  business,
  showErrors,
  results,
}: {
  business: Business
  showErrors: boolean
  /** ④ 와 같은 값 묶음(lib/reduction-calc.ts). 없으면 산출 전(—) */
  results: ResultValues
}) => {
  // 접힌 상태에서도 미입력 항목은 시안처럼 문구를 남긴다.
  const errorOf = (key: keyof Business) =>
    showErrors && !String(business[key] ?? "").trim()
      ? (REQUIRED.find((item) => item.key === key)?.message ?? "")
      : ""

  return (
    <div className="flex flex-col gap-3 px-5 py-4 md:gap-4 md:px-13 md:py-6 lg:gap-6 lg:px-15 lg:py-10">
      <div className="flex min-w-0 flex-col gap-2 md:gap-2.5">
        <p className="text-ink-strong text-base font-bold">사업명</p>
        <ReadOnlyBox value={business.name} />
        <FieldError show={!!errorOf("name")} message={errorOf("name")} />
      </div>

      <div className="grid min-w-0 gap-3 md:grid-cols-2 md:gap-4 lg:gap-x-4 lg:gap-y-6">
        <div className="flex min-w-0 flex-col gap-2 md:gap-2.5">
          <p className="text-ink-strong text-base font-bold">
            운전개시일(선택)
          </p>
          <ReadOnlyBox
            value={
              business.startedOn ? format(business.startedOn, DATE_FORMAT) : ""
            }
          />
        </div>
        <div className="flex min-w-0 flex-col gap-2 md:gap-2.5">
          <p className="text-ink-strong text-base font-bold">투자비(백만원)</p>
          <div className="relative">
            <ReadOnlyBox value={business.investment} />
            <span className="text-ash-500 pointer-events-none absolute inset-y-0 right-4 flex items-center text-sm">
              백만원
            </span>
          </div>
          <FieldError
            show={!!errorOf("investment")}
            message={errorOf("investment")}
          />
        </div>
      </div>

      {/* 연차별 감축량. 시안은 좌측 정렬이고 산정식이 확정되기 전이라 값은 비워 둔다. */}
      <div className="flex min-w-0 flex-col gap-2 md:gap-2.5">
        <p className="text-ink-strong text-base font-bold">감축량</p>
        {/* 시안은 연차 사이에 얇은 세로 구분선을 둔다. */}
        {/* 모바일은 가로 구분선으로 나뉜 세로 목록, PC·태블릿은 세로 구분선의 가로 목록 */}
        <dl className="bg-surface-flow divide-line-field border-ash-200 flex flex-col divide-y rounded-2xl border p-6 md:flex-row md:flex-wrap md:divide-x md:divide-y-0">
          {YEARS.map((year) => (
            <div
              key={year}
              className="flex items-center justify-between gap-2.5 py-4 max-md:first:pt-0 max-md:last:pb-0 md:justify-start md:px-3 md:py-1 md:first:pl-0 md:last:pr-0 lg:px-4"
            >
              <dt className="text-ink-strong text-base">{year}차년도</dt>
              <dd className="flex items-baseline gap-1">
                <span className="text-brand-primary text-lg font-bold lg:text-xl">
                  {formatResult(results[reductionKeyOf(year)])}
                </span>
                <span className="text-brand-step text-base">tCO₂eq</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  )
}

interface BusinessCardProps {
  business: Business
  index: number
  /** 다음으로를 한 번 누른 뒤부터 미입력 항목을 표시한다 */
  showErrors?: boolean
  /** 다음으로를 누른 횟수. 값이 바뀌면 상세 입력 오류를 다시 켠다 */
  errorTick?: number
  onChange: (next: Business) => void
  onRemove: () => void
}

const BusinessCard = ({
  business,
  index,
  showErrors = false,
  errorTick = 0,
  onChange,
  onRemove,
}: BusinessCardProps) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  // 날짜를 고르면 달력을 닫는다. Radix 는 안쪽 클릭으로 닫히지 않는다
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  // 방법론을 바꿔 상세 입력이 새로 그려지면 오류 표시를 잠시 끈다.
  const [detailErrorsOff, setDetailErrorsOff] = useState(false)
  useEffect(() => {
    setDetailErrorsOff(false)
  }, [errorTick])
  // 이미 고른 방법론을 바꾸면 상세 입력이 지워지므로 확인을 받는다.
  const [pendingChange, setPendingChange] = useState<Business | null>(null)

  const changeMethodology = (next: Business, previous: string) => {
    setDetailErrorsOff(true)
    if (previous.trim()) setPendingChange(next)
    else onChange(next)
  }
  const field = (id: string) => `business-${business.id}-${id}`

  // ④ 의 값. 계산은 lib/reduction-calc.ts 가 하고 카드는 재료(③ 입력 · 기본정보)만 넘긴다.
  // 제품수명은 데이터 근거 칸 값이 없으면 스키마의 초기값을 쓴다.
  const schema = schemaOf(business.methodology)
  const lifetimeRow = schema?.basisRows.find(
    (row) => row.rowType === "lifetime",
  )
  const basics = {
    investment: business.investment,
    startedOn: business.startedOn,
    lifetime:
      Number(business.cells.life ?? lifetimeRow?.fixedValue) || undefined,
  }
  const results = schema
    ? computeResults(schema, business.cells, basics, {
        complete: missingDetailCells(business).length === 0,
      })
    : {}
  // ④ 아래 안내 문구도 같은 재료로 만든다(기획 사이트 공통 형식)
  const hint = resultHintOf(basics)
  const errorOf = (key: keyof Business) =>
    showErrors && !String(business[key] ?? "").trim()
      ? (REQUIRED.find((item) => item.key === key)?.message ?? "")
      : ""
  const set = <K extends keyof Business>(key: K, value: Business[K]) =>
    onChange({ ...business, [key]: value })

  // 시안의 카드는 채움 없이 테두리만 있고 페이지 배경이 그대로 비친다.
  return (
    <section className="border-line-card flex flex-col rounded-xl border md:rounded-2xl">
      {/* 카드 머리: 사업 번호 배지 · 접기 · 삭제 */}
      <div className="border-line-card flex items-center justify-between gap-3 border-b px-5 pt-6 pb-4 md:px-8 md:pt-8 md:pb-6 lg:px-10 lg:pt-10 lg:pb-8">
        <span className="bg-surface-flow text-brand-primary rounded-full px-5 py-2 text-base font-bold">
          사업{index + 1}
        </span>
        <div className="flex items-start gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={() => set("isOpen", !business.isOpen)}
            className="text-brand-primary h-8 px-2 text-base font-bold [&_svg]:size-5"
          >
            {business.isOpen ? "접기" : "펼치기"}
            {business.isOpen ? (
              <ChevronUp aria-hidden="true" />
            ) : (
              <ChevronDown aria-hidden="true" />
            )}
          </Button>
          <Button
            type="button"
            variant="ghost"
            aria-label={`사업${index + 1} 삭제`}
            onClick={() =>
              hasAnyInput(business) ? setIsConfirmOpen(true) : onRemove()
            }
            className="bg-ash-500 hover:bg-surface-inverse hover:text-ink-on-inverse size-8 rounded-full p-0 text-white [&_svg]:size-4"
          >
            <X aria-hidden="true" />
          </Button>
        </div>
      </div>

      {!business.isOpen && (
        <CollapsedSummary
          business={business}
          showErrors={showErrors}
          results={results}
        />
      )}

      {business.isOpen && (
        <div className="flex flex-col gap-6 px-5 py-4 md:px-8 md:py-6 lg:gap-10 lg:px-10 lg:py-10">
          {/* ① 기업 정보 입력 */}
          <div className="flex flex-col gap-3 md:gap-4 md:px-5 lg:gap-6">
            <div className="flex min-w-0 flex-col gap-2 md:gap-2.5">
              <div className="flex items-start gap-3">
                <span className="bg-ash-200 text-ink-strong dark:bg-surface-inverse dark:text-ink-on-inverse flex size-8 shrink-0 items-center justify-center rounded-full text-base font-bold">
                  1
                </span>
                <h3 className="text-ink-strong text-xl font-bold md:text-2xl">
                  기업 정보 입력
                </h3>
              </div>
              {/* 서브 텍스트는 시안 기준 PC 에만 나온다. */}
              <p className="text-ink-body hidden text-base lg:block">
                기업의 기본 정보를 입력해주세요
              </p>
            </div>

            <div className="flex flex-col gap-3 md:gap-4 lg:gap-6">
              <div className="flex min-w-0 flex-col gap-2 md:gap-2.5">
                <FieldLabel htmlFor={field("name")}>사업명</FieldLabel>
                <Input
                  id={field("name")}
                  value={business.name}
                  onChange={(event) => set("name", event.target.value)}
                  placeholder="사업명을 입력해주세요"
                  isValid={!errorOf("name")}
                  data-invalid={!!errorOf("name") || undefined}
                  className={cn(fieldClass, "w-full")}
                />
                <FieldError
                  show={!!errorOf("name")}
                  message={errorOf("name")}
                />
              </div>

              <div className="grid min-w-0 gap-3 md:grid-cols-2 md:gap-4 lg:gap-x-4 lg:gap-y-6">
                <div className="flex min-w-0 flex-col gap-2 md:gap-2.5">
                  <FieldLabel htmlFor={field("code")}>사업번호</FieldLabel>
                  <Input
                    id={field("code")}
                    value={business.code}
                    onChange={(event) => set("code", event.target.value)}
                    inputMode="numeric"
                    placeholder="0"
                    isValid={!errorOf("code")}
                    data-invalid={!!errorOf("code") || undefined}
                    className={cn(fieldClass, "w-full")}
                  />
                  <FieldError
                    show={!!errorOf("code")}
                    message={errorOf("code")}
                  />
                </div>
                <div className="flex min-w-0 flex-col gap-2 md:gap-2.5">
                  <FieldLabel htmlFor={field("industry")}>업종선택</FieldLabel>
                  <Select
                    name={field("industry")}
                    data-invalid={!!errorOf("industry") || undefined}
                    value={business.industry}
                    onValueChange={(value) => set("industry", value)}
                  >
                    <SelectTrigger
                      id={field("industry")}
                      data-invalid={!!errorOf("industry") || undefined}
                      className={cn(
                        selectClass,
                        errorOf("industry") && "border-ink-error border-2",
                      )}
                    >
                      <SelectValue placeholder="업종 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {INDUSTRY_OPTIONS.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldError
                    show={!!errorOf("industry")}
                    message={errorOf("industry")}
                  />
                </div>
                <div className="flex min-w-0 flex-col gap-2 md:gap-2.5">
                  <p className="text-ink-strong text-base font-bold">
                    운전개시일(선택)
                  </p>
                  <Popover
                    open={isCalendarOpen}
                    onOpenChange={setIsCalendarOpen}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        className={cn(
                          fieldClass,
                          // Button 은 평상시에도 ring 을 두른다. 입력·셀렉트에는 없는
                          // 표시라 꺼 두고, 호버·포커스 링은 fieldClass 것을 그대로 쓴다.
                          // Button 원본이 svg 를 size-4 로 잡아 두어, 다른 날짜 칸과 같은 20 으로 키운다
                          "w-full justify-between border px-3 ring-0 [&_svg]:size-5",
                          // 값이 있으면 입력·셀렉트와 같은 굵기·색, 없으면 자리표시 색
                          business.startedOn
                            ? "text-ink-strong font-semibold"
                            : "text-ink-placeholder font-normal",
                        )}
                      >
                        {business.startedOn
                          ? format(business.startedOn, DATE_FORMAT)
                          : "2024-06-01"}
                        {/* 신청서 작성·내정보 수정의 날짜 칸과 같은 아이콘·크기·색 */}
                        <CalendarIcon
                          aria-hidden="true"
                          className="text-ink-bullet size-5 shrink-0"
                        />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        locale={ko}
                        mode="single"
                        selected={business.startedOn}
                        onSelect={(date) => {
                          set("startedOn", date)
                          setIsCalendarOpen(false)
                        }}
                        defaultMonth={business.startedOn}
                        {...CALENDAR_PROPS}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="flex min-w-0 flex-col gap-2 md:gap-2.5">
                  <FieldLabel htmlFor={field("investment")}>
                    투자비(백만원)
                  </FieldLabel>
                  <div className="relative">
                    <Input
                      id={field("investment")}
                      value={business.investment}
                      onChange={(event) =>
                        set("investment", event.target.value)
                      }
                      inputMode="numeric"
                      placeholder="55"
                      isValid={!errorOf("investment")}
                      data-invalid={!!errorOf("investment") || undefined}
                      className={cn(fieldClass, "w-full pr-20")}
                    />
                    <span className="text-ink-body pointer-events-none absolute inset-y-0 right-4 flex items-center text-sm">
                      백만원
                    </span>
                  </div>
                  <FieldError
                    show={!!errorOf("investment")}
                    message={errorOf("investment")}
                  />
                </div>
              </div>
            </div>
          </div>

          <hr className="border-line-card border-t" />

          {/* ② 감축방법론 선택 */}
          <div className="flex flex-col gap-3 md:gap-4 md:px-5 lg:gap-6">
            <div className="flex min-w-0 flex-col gap-2 md:gap-2.5">
              <div className="flex items-start gap-3">
                <span className="bg-ash-200 text-ink-strong dark:bg-surface-inverse dark:text-ink-on-inverse flex size-8 shrink-0 items-center justify-center rounded-full text-base font-bold">
                  2
                </span>
                <h3 className="text-ink-strong text-xl font-bold md:text-2xl">
                  감축방법론 선택
                </h3>
              </div>
              <p className="text-ink-body hidden text-base lg:block">
                기업의 기본 정보를 입력해주세요
              </p>
            </div>

            <div className="grid min-w-0 gap-3 md:gap-4 lg:grid-cols-2">
              <div className="flex min-w-0 flex-col gap-2 md:gap-2.5">
                <FieldLabel htmlFor={field("category")}>
                  에너지 항목 선택
                </FieldLabel>
                <Select
                  name={field("category")}
                  data-invalid={!!errorOf("category") || undefined}
                  value={business.category}
                  onValueChange={(value) =>
                    // 항목을 고르면 방법론은 비워 두고, 방법론을 고를 때까지
                    // 상세정보 자리에는 안내(빈 상태)만 보여준다.
                    changeMethodology(
                      {
                        ...business,
                        category: value,
                        methodology: "",
                        cells: {},
                      },
                      business.category,
                    )
                  }
                >
                  <SelectTrigger
                    id={field("category")}
                    data-invalid={!!errorOf("category") || undefined}
                    className={cn(
                      selectClass,
                      errorOf("category") && "border-ink-error border-2",
                    )}
                  >
                    <SelectValue placeholder="항목 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={PLACEHOLDER_OPTION} disabled>
                      항목 선택
                    </SelectItem>
                    {REDUCTION_METHODOLOGIES.map((group) => (
                      <SelectItem key={group.value} value={group.value}>
                        {group.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError
                  show={!!errorOf("category")}
                  message={errorOf("category")}
                />
              </div>
              <div className="flex min-w-0 flex-col gap-2 md:gap-2.5">
                <FieldLabel htmlFor={field("methodology")}>
                  감축방법론 선택
                </FieldLabel>
                <Select
                  name={field("methodology")}
                  data-invalid={!!errorOf("methodology") || undefined}
                  value={business.methodology}
                  disabled={!business.category}
                  onValueChange={(value) =>
                    // 방법론을 바꾸면 상세 입력을 비운다(기획 사이트와 동일).
                    changeMethodology(
                      { ...business, methodology: value, cells: {} },
                      business.methodology,
                    )
                  }
                >
                  <SelectTrigger
                    id={field("methodology")}
                    data-invalid={!!errorOf("methodology") || undefined}
                    className={cn(
                      disabledSelectClass,
                      errorOf("methodology") && "border-ink-error border-2",
                    )}
                  >
                    <SelectValue placeholder="방법론 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={PLACEHOLDER_OPTION} disabled>
                      방법론 선택
                    </SelectItem>
                    {methodologiesOf(business.category).map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError
                  show={!!errorOf("methodology")}
                  message={errorOf("methodology")}
                />
              </div>
            </div>
          </div>

          {/* 방법론을 고르기 전에는 상세정보 대신 안내만 보여준다.
              이 안내 위에는 시안대로 구분선을 두지 않는다. */}
          {schema ? (
            <>
              <hr className="border-line-card border-t" />
              <BusinessDetail
                schema={schema}
                cells={business.cells}
                fieldPrefix={field("detail")}
                showErrors={showErrors && !detailErrorsOff}
                results={results}
                hint={hint}
                onCellChange={(cellRef, value) =>
                  onChange({
                    ...business,
                    cells: { ...business.cells, [cellRef]: value },
                  })
                }
              />
            </>
          ) : (
            /* 시안: 높이 40/74/74 · radius 8/8/16 · 글자 12/16/17 */
            <div className="bg-surface-notice flex items-center justify-center gap-1 rounded-md px-4 py-2.5 md:gap-3 md:px-6 md:py-6 lg:rounded-2xl">
              <Check
                aria-hidden="true"
                className="text-ink-body size-4 md:size-5"
              />
              <p className="text-ink-strong text-xs font-bold whitespace-nowrap md:text-base md:whitespace-normal md:break-keep">
                감축방법론 선택 후, 상세정보를 입력해주세요
              </p>
            </div>
          )}
        </div>
      )}
      <ConfirmDialog
        open={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        title="선택하신 사업 정보를 삭제하시겠습니까?"
        description="입력한 정보가 모두 사라집니다."
        confirmLabel="삭제하기"
        onConfirm={onRemove}
      />
      <ConfirmDialog
        open={!!pendingChange}
        onOpenChange={(next) => {
          if (!next) setPendingChange(null)
        }}
        compactTitleOnMobile
        title="감축 방법론을 변경하시겠습니까?"
        description={
          <>
            감축방법론 변경 시,
            {/* 시안은 PC 만 한 줄, 태블릿 이하는 쉼표 뒤에서 끊는다 */}
            <br className="lg:hidden" /> 상세 입력 정보가 모두 삭제 처리 됩니다.
          </>
        }
        confirmLabel="삭제하기"
        onConfirm={() => {
          if (pendingChange) onChange(pendingChange)
          setPendingChange(null)
        }}
      />
    </section>
  )
}

export default BusinessCard
