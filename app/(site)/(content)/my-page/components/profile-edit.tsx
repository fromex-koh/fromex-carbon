"use client"

import { createContext, useRef, useState } from "react"

import { format } from "date-fns"
import { ko } from "date-fns/locale"
import { Calendar } from "lucide-react"

import ConfirmDialog from "@/app/(site)/(content)/carbon-leader/self-check/components/confirm-dialog"
import AddressSearchDialog from "@/components/address-search-dialog"
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
import { cn } from "@/lib/utils"
import { CALENDAR_PROPS } from "@/constants/calendar-dropdown"

// IA 61·62번 "회원정보 수정".
// 시안이 기관회원 · 기업회원 두 벌인데 다른 곳은 한 글자도 다르지 않고
// 기관회원에만 [비밀번호 변경] 카드가 하나 더 붙는다. 그래서 memberType 하나로 가른다.
// [퍼블리싱 노출용] 칸에 채워 둔 값은 전부 시안에 그려진 값이다. 실데이터를 붙일 때 걷어낸다.

/**
 * 입력 칸 한 벌. 시안은 높이 52 · 라운드 6 · 테두리 line-field 다.
 * 신청서 작성 화면(application-form.tsx 의 FIELD)과 같은 규칙을 쓴다.
 */
const FIELD =
  "border-line-field bg-surface-field text-ink-strong placeholder:text-ink-placeholder hover:ring-ash-600 focus-visible:ring-ash-600 h-12 w-full min-w-0 rounded-md border px-4 text-sm font-medium outline-hidden hover:ring-2 focus-visible:ring-2"

/** 칸 오른쪽에 단위·아이콘이 붙는 입력. 테두리를 밖으로 빼서 자리를 만든다 */
const FIELD_BOX =
  "border-line-field bg-surface-field hover:ring-ash-600 has-[:focus-visible]:ring-ash-600 flex h-12 items-center gap-2 rounded-md border px-4 hover:ring-2 has-[:focus-visible]:ring-2"

const BARE =
  "text-ink-strong placeholder:text-ink-placeholder min-w-0 flex-1 bg-transparent text-sm font-medium outline-hidden"

/** 주소검색처럼 칸 옆에 붙는 회색 버튼 */
const SIDE_BUTTON =
  "bg-line-card text-ink-body hover:bg-line-field focus-visible:ring-ash-600 flex h-12 w-21 shrink-0 cursor-pointer items-center justify-center rounded-md text-sm font-bold whitespace-nowrap transition-colors outline-hidden focus-visible:ring-2"

/**
 * 주소검색으로 채우는 칸.
 * 이 화면 시안은 연한 파란 면(#ecf0f8)이지만, 신청서 작성 화면(application-form.tsx)의
 * 기업소재지와 같은 회색 면으로 맞춘다. 두 화면이 같은 입력 묶음을 쓰기 때문이다.
 */
const FIELD_READONLY = "bg-surface-disabled"

/** 업종 선택 항목. 값은 전달받은 마크업(bizType)의 value 를 그대로 쓴다 */
const INDUSTRIES: { value: string; label: string }[] = [
  { value: "energy", label: "에너지산업" },
  { value: "mfg", label: "제조업" },
  { value: "const", label: "건설업" },
  { value: "other", label: "기타" },
]

/** 시안은 2011.04.11 처럼 점으로 끊지만, 신청서 작성 화면과 같은 대시 표기로 통일한다 */
const DATE_FORMAT = "yyyy-MM-dd"

/** [퍼블리싱 노출용] 시안에 그려진 설립일자 */
const FOUNDED_AT = new Date(2011, 3, 11)

/** 상단 회색 안내 박스 문구 */
const NOTICE = "기업 정보와 비밀번호를 확인하고 수정할 수 있습니다."

/** 받침이 있으면 "을", 없으면 "를". 신청서 작성 화면과 같은 규칙이다 */
const objectParticle = (word: string) => {
  const last = word.trim().at(-1) ?? ""
  const code = last.charCodeAt(0)
  if (code < 0xac00 || code > 0xd7a3) return "을"
  return (code - 0xac00) % 28 === 0 ? "를" : "을"
}

const requiredMessage = (label: string) =>
  `${label}${objectParticle(label)} 입력해 주세요.`

/** 기업소재지는 세 칸이 다 차야 한 건으로 본다 */
const ADDRESS_FIELDS = ["zip-code", "address", "address-detail"]

/** [다음으로] 를 눌렀을 때 검사할 칸. 키는 입력 name, 값은 문구에 쓸 이름이다 */
const REQUIRED_FIELDS: Record<string, string> = {
  "company-name": "업체명",
  "ceo-name": "대표자",
  "business-number": "사업자등록번호",
  "corporate-number": "법인등록번호",
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
  "manager-fax": "팩스번호",
  "manager-email": "전자우편",
  "manager-phone": "연락처",
}

/** 새 비밀번호 최소 길이. 시안 안내 문구(8자 이상)를 따른다 */
const PASSWORD_MIN = 8

/**
 * [퍼블리싱 노출용] 현재 비밀번호 대조값.
 * 실제로는 서버가 확인해 줄 자리다. 지금은 이 값과 다르면 불일치 문구가 뜨도록 해 두었다.
 */
const CURRENT_PASSWORD = "kibo1234!"

/** 칸마다 오류 문구를 내려 준다. Field 가 htmlFor 로 찾아 쓴다 */
const FieldErrorContext = createContext<Record<string, string>>({})

/**
 * 달력에서 고르는 날짜 칸. 겉모습은 일반 입력 칸과 같다.
 * 공용 DatePicker 는 형식이 고정돼 있어, 신청서 작성 화면(application-form.tsx)과 같이
 * Popover + Calendar 를 직접 조합한다.
 */
const DateField = ({
  id,
  placeholder,
  defaultDate,
}: {
  id: string
  placeholder: string
  defaultDate?: Date
}) => {
  const [date, setDate] = useState<Date | undefined>(defaultDate)
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
          className={cn(FIELD_BOX, "w-full min-w-0 cursor-pointer text-left")}
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

/** 이름표 + 입력 한 묶음. 시안은 이름표와 칸 사이가 10 이다 */
const Field = ({
  label,
  htmlFor,
  className,
  children,
}: {
  label: string
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
            // 오류 표시는 신청서 작성 화면과 같은 규칙이다(테두리는 두고 2px 링을 두른다).
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
          </label>
          {children}
          {error ? (
            <p className="text-ink-error text-xs font-medium break-keep lg:text-sm">
              {error}
            </p>
          ) : null}
        </div>
      )
    }}
  </FieldErrorContext.Consumer>
)

/** 카드 한 장. 신청서 작성 화면(application-form.tsx 의 Card)과 같은 규격이다 */
const Card = ({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: React.ReactNode
}) => (
  <section className="border-line-card flex flex-col gap-6 rounded-xl border px-5 py-6 md:rounded-2xl md:p-8 lg:gap-14 lg:p-10">
    <header className="flex flex-col gap-3">
      <h3 className="text-ink-strong text-lg font-bold break-keep md:text-2xl">
        {title}
      </h3>
      <p className="text-ink-body text-sm leading-tight break-keep md:text-base md:leading-normal">
        {description}
      </p>
    </header>
    {children}
  </section>
)

/** 카드 안 두 칸 배치. 360 은 한 칸, 768 부터 두 칸이다 */
const Grid = ({ children }: { children: React.ReactNode }) => (
  <div className="grid gap-3 md:grid-cols-2 md:gap-4 lg:gap-11">{children}</div>
)

const ProfileEdit = ({
  /** 기관회원만 [비밀번호 변경] 카드를 갖는다 */
  memberType = "institution",
}: {
  memberType?: "institution" | "company"
}) => {
  const formRef = useRef<HTMLFormElement>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [hasTried, setHasTried] = useState(false)
  /** [취소] 를 누르면 뜨는 확인 모달 */
  const [cancelOpen, setCancelOpen] = useState(false)
  /** 검사를 통과한 [저장하기] 에서 뜨는 확인 모달 */
  const [saveOpen, setSaveOpen] = useState(false)

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

    // 비밀번호는 선택이다. 셋 중 하나라도 건드렸을 때만 한 벌로 검사한다
    if (memberType === "institution") {
      const current = valueOf("current-password")
      const password = valueOf("new-password")
      const confirm = valueOf("new-password-confirm")

      if (current || password || confirm) {
        if (!current)
          next["current-password"] = requiredMessage("현재 비밀번호")
        else if (current !== CURRENT_PASSWORD)
          next["current-password"] = "현재 비밀번호가 일치하지 않습니다."
        if (!password) next["new-password"] = requiredMessage("새 비밀번호")
        else if (password.length < PASSWORD_MIN)
          next["new-password"] =
            `새 비밀번호를 ${PASSWORD_MIN}자 이상 입력해 주세요.`
        if (!confirm)
          next["new-password-confirm"] = requiredMessage("새 비밀번호 확인")
        else if (password && password !== confirm)
          next["new-password-confirm"] = "새 비밀번호가 일치하지 않습니다."
      }
    }

    return next
  }

  const handleSave = () => {
    setHasTried(true)
    const next = collectErrors()
    setErrors(next)

    // 첫 오류 칸으로 옮겨 준다. 날짜·업종은 숨은 입력이라 보이는 컨트롤을 찾는다
    const first = Object.keys(next)[0]
    // 걸린 칸이 없으면 바로 저장하지 않고 확인 모달을 띄운다
    if (!first) {
      setSaveOpen(true)
      return
    }
    const form = formRef.current
    const control =
      form?.querySelector<HTMLElement>(`#${CSS.escape(first)}`) ??
      form?.querySelector<HTMLElement>(`[name="${first}"]`)
    control?.scrollIntoView({ block: "center" })
    control?.focus({ preventScroll: true })
  }

  // 한 번 검사한 뒤에는 입력할 때마다 다시 본다
  const revalidate = () => {
    if (hasTried) setErrors(collectErrors())
  }

  return (
    <div className="flex w-full max-w-316 flex-col md:gap-8 md:px-7 md:pt-12 md:pb-28 lg:gap-10 lg:px-8 lg:pt-14 lg:pb-42">
      {/* 시안 상단 안내 박스. 자가진단의 BaseInfo 와 달리 제목 없이 한 줄만 있다.
          360 은 라운드 없이 화면 폭을 꽉 채우고 서브 비주얼에 붙는다.
          면색은 시안이 라이트 #f8f8f8 · 다크 #555555 30% 라 surface-panel 을 쓴다.
          surface-notice 는 다크가 #222222 여서 맞지 않는다 */}
      <section className="bg-surface-panel flex px-6 pt-6 pb-8 max-md:rounded-none md:rounded-2xl md:pb-6 lg:px-10">
        <span
          aria-hidden="true"
          className="flex h-6.5 w-2.5 shrink-0 items-center justify-center"
        >
          <span className="bg-ink-bullet size-1 rounded-full" />
        </span>
        <p className="text-ink-body text-base break-keep">{NOTICE}</p>
      </section>

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
            title="기업정보"
            description="법인명, 사업자번호, 대표자, 소재지 등 기업 기본 정보를 입력합니다."
          >
            <Grid>
              <Field label="업체명" htmlFor="company-name">
                <input
                  id="company-name"
                  name="company-name"
                  placeholder="법인 또는 상호명 입력"
                  autoComplete="organization"
                  defaultValue="(주)원정푸드"
                  className={FIELD}
                />
              </Field>
              <Field label="대표자" htmlFor="ceo-name">
                <input
                  id="ceo-name"
                  name="ceo-name"
                  placeholder="대표자 성명"
                  autoComplete="name"
                  defaultValue="박선호"
                  className={FIELD}
                />
              </Field>
              <Field label="사업자등록번호" htmlFor="business-number">
                <input
                  id="business-number"
                  name="business-number"
                  placeholder="000-00-00000"
                  autoComplete="off"
                  defaultValue="123-45-67890"
                  className={FIELD}
                />
              </Field>
              <Field
                label="법인등록번호 (000000-0000000)"
                htmlFor="corporate-number"
              >
                <input
                  id="corporate-number"
                  name="corporate-number"
                  placeholder="000000-0000000"
                  autoComplete="off"
                  defaultValue="110111-1234567"
                  className={FIELD}
                />
              </Field>

              <Field
                label="기업소재지"
                htmlFor="zip-code"
                className="md:col-span-2"
              >
                {/* 우편번호 줄만 한 칸 폭이고, 주소 두 줄은 카드 폭을 다 쓴다 */}
                <div
                  data-field-row
                  className="flex gap-2.5 md:w-1/2 md:pr-2 lg:pr-6"
                >
                  <input
                    id="zip-code"
                    name="zip-code"
                    autoComplete="postal-code"
                    readOnly
                    placeholder="우편번호"
                    defaultValue="04524"
                    className={cn(FIELD, FIELD_READONLY)}
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
                  defaultValue="서울특별시 중구 세종대로 110"
                  className={cn(FIELD, FIELD_READONLY)}
                />
                <input
                  id="address-detail"
                  name="address-detail"
                  autoComplete="address-line2"
                  placeholder="상세주소 입력"
                  defaultValue="원정빌딩 8층"
                  className={FIELD}
                />
              </Field>

              <Field label="대표자 연락처" htmlFor="ceo-phone">
                <input
                  id="ceo-phone"
                  name="ceo-phone"
                  placeholder="010-0000-0000"
                  autoComplete="tel"
                  defaultValue="02-2345-6789"
                  className={FIELD}
                />
              </Field>
              <Field label="전자우편" htmlFor="company-email">
                <input
                  id="company-email"
                  name="company-email"
                  placeholder="example@company.com"
                  autoComplete="email"
                  defaultValue="ceo@wonjeongfood.co.kr"
                  className={FIELD}
                />
              </Field>
            </Grid>
          </Card>

          {/* (2) 기업현황 */}
          <Card
            title="기업현황"
            description="업종, 설립일자, 주생산품 등 사업 현황 정보를 입력합니다."
          >
            <Grid>
              <Field label="설립일자" htmlFor="founded-at">
                <DateField
                  id="founded-at"
                  placeholder="2024-06-01"
                  defaultDate={FOUNDED_AT}
                />
              </Field>
              <Field label="업종" htmlFor="industry">
                {/* 셀렉트 원본이 box-shadow 를 직접 잡고 있어 한 겹 감싼다 */}
                <div className="rounded-md">
                  <Select name="industry" defaultValue="mfg">
                    <SelectTrigger
                      id="industry"
                      className="border-line-field bg-surface-field text-ink-strong focus-visible:ring-ash-600 h-12 w-full rounded-md px-4 text-sm font-medium focus-visible:ring-2"
                    >
                      <SelectValue placeholder="업종 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {INDUSTRIES.map((industry) => (
                        <SelectItem key={industry.value} value={industry.value}>
                          {industry.label}
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
                  placeholder="예)  212110"
                  autoComplete="off"
                  defaultValue="107110"
                  className={FIELD}
                />
              </Field>
              <Field label="주생산품" htmlFor="main-product">
                <input
                  id="main-product"
                  name="main-product"
                  placeholder="예) 자동차 부품, 반도체"
                  autoComplete="off"
                  defaultValue="즉석조리식품, 냉동만두"
                  className={FIELD}
                />
              </Field>
              <Field label="연간생산량" htmlFor="yearly-output">
                <div className={FIELD_BOX}>
                  <input
                    id="yearly-output"
                    name="yearly-output"
                    placeholder="숫자 입력"
                    autoComplete="off"
                    inputMode="numeric"
                    defaultValue="12,000"
                    className={BARE}
                  />
                  <span className="text-ink-body shrink-0 text-sm font-medium">
                    ton
                  </span>
                </div>
              </Field>
            </Grid>
          </Card>

          {/* (3) 담당자정보 */}
          <Card
            title="담당자정보"
            description="신청 관련 담당자의 연락처 및 소속 정보를 입력합니다."
          >
            <Grid>
              <Field label="담당자명" htmlFor="manager-name">
                <input
                  id="manager-name"
                  name="manager-name"
                  placeholder="담당자 성명"
                  autoComplete="name"
                  defaultValue="김민준"
                  className={FIELD}
                />
              </Field>
              <Field label="부서 / 직책" htmlFor="manager-department">
                <input
                  id="manager-department"
                  name="manager-department"
                  placeholder="예) 환경안전팀 / 과장"
                  autoComplete="organization-title"
                  defaultValue="환경안전팀 / 대리"
                  className={FIELD}
                />
              </Field>
              <Field label="전화번호" htmlFor="manager-tel">
                <input
                  id="manager-tel"
                  name="manager-tel"
                  placeholder="02-0000-0000"
                  autoComplete="tel"
                  defaultValue="02-1234-5678"
                  className={FIELD}
                />
              </Field>
              <Field label="팩스번호" htmlFor="manager-fax">
                <input
                  id="manager-fax"
                  name="manager-fax"
                  placeholder="02-0000-0000"
                  autoComplete="off"
                  defaultValue="02-1234-5679"
                  className={FIELD}
                />
              </Field>
              <Field label="전자우편" htmlFor="manager-email">
                <input
                  id="manager-email"
                  name="manager-email"
                  placeholder="example@company.com"
                  autoComplete="email"
                  defaultValue="minjun.kim@wonjeongfood.co.kr"
                  className={FIELD}
                />
              </Field>
              <Field label="연락처" htmlFor="manager-phone">
                <input
                  id="manager-phone"
                  name="manager-phone"
                  placeholder="010-0000-0000"
                  autoComplete="tel"
                  defaultValue="010-1234-5678"
                  className={FIELD}
                />
              </Field>
            </Grid>
          </Card>

          {/* (4) 비밀번호 변경 — 기관회원 시안에만 있다 */}
          {memberType === "institution" ? (
            <Card
              title="비밀번호 변경"
              description="비밀번호를 변경하지 않으려면 아래 항목을 비워두세요."
            >
              <div className="flex flex-col gap-3 md:gap-4 lg:gap-11">
                <Field label="현재 비밀번호" htmlFor="current-password">
                  <input
                    id="current-password"
                    name="current-password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="현재 비밀번호를 입력하세요"
                    className={FIELD}
                  />
                </Field>
                <Grid>
                  <Field label="새 비밀번호" htmlFor="new-password">
                    <input
                      id="new-password"
                      name="new-password"
                      type="password"
                      autoComplete="new-password"
                      placeholder="영문·숫자·특수문자 조합 8자 이상"
                      className={FIELD}
                    />
                  </Field>
                  <Field
                    label="새 비밀번호 확인"
                    htmlFor="new-password-confirm"
                  >
                    <input
                      id="new-password-confirm"
                      name="new-password-confirm"
                      type="password"
                      autoComplete="new-password"
                      placeholder="새 비밀번호를 한번 더 입력하세요"
                      className={FIELD}
                    />
                  </Field>
                </Grid>
              </div>
            </Card>
          ) : null}

          {/* 360 은 두 버튼이 폭을 반씩 나눠 갖고, 768 부터 가운데로 모인다 */}
          <div className="flex gap-2 max-md:mt-4 md:justify-center md:gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setCancelOpen(true)}
              className="h-11 min-w-0 flex-1 rounded-lg text-sm font-bold md:h-13 md:w-42 md:flex-none"
            >
              취소
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              className="h-11 min-w-0 flex-1 rounded-lg text-sm font-bold md:h-13 md:w-42 md:flex-none"
            >
              저장하기
            </Button>
          </div>
        </form>
      </FieldErrorContext.Provider>

      {/* 자가진단 확인 모달과 같은 껍데기를 쓴다 */}
      <ConfirmDialog
        open={cancelOpen}
        onOpenChange={setCancelOpen}
        title="수정을 취소하시겠습니까?"
        description="변경한 내용은 저장되지 않습니다."
        cancelLabel="취소"
        confirmLabel="확인"
        confirmTone="default"
      />

      {/* 시안에 설명 줄이 없어 빈 문자열을 넘긴다. 자리는 그대로 비워 둔다 */}
      <ConfirmDialog
        open={saveOpen}
        onOpenChange={setSaveOpen}
        title="저장하시겠습니까?"
        description=""
        cancelLabel="취소"
        confirmLabel="저장"
        confirmTone="default"
      />
    </div>
  )
}

export default ProfileEdit
