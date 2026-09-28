"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import AgencySignupGuideDialog from "@/app/(site)/login/components/agency-signup-guide-dialog"
import FindAccountDialog from "@/app/(site)/login/components/find-account-dialog"
import { cn } from "@/lib/utils"

/** 기업회원 = 기보 ONE 플랫폼 통합 로그인, 기관회원 = 아이디·비밀번호 로그인 */
type MemberType = "company" | "agency"

const TABS = [
  {
    key: "company" as const,
    title: "기업회원",
    caption: "기보 ONE 플랫폼 통합 로그인",
  },
  {
    key: "agency" as const,
    title: "기관회원",
    caption: "아이디 · 비밀번호 로그인",
  },
]

// 시안은 두 줄로 끊어 놓았다. 한 줄씩 <p> 로 떨어뜨려 줄바꿈 자리를 고정한다.
const NOTES = [
  "기보 ONE 플랫폼(https://www.kibo.or.kr/portal) 로그인 후,",
  "탄소중립 플랫폼으로 이동하셔야 로그인이 완료됩니다.",
]

const FOOTERS = {
  company: { text: "계정이 없으신가요?", link: "기보 ONE 플랫폼 회원가입" },
  agency: { text: "아직 회원이 아니신가요?", link: "회원가입" },
} as const

type FieldErrors = { id?: string; password?: string }

// 아이디·비밀번호는 둘 다 필수다. 제출을 눌러 처음 검사한 뒤에는 입력할 때마다 다시 본다.
const validate = (id: string, password: string): FieldErrors => ({
  id: id.trim() ? undefined : "아이디를 입력해 주세요.",
  password: password.trim() ? undefined : "비밀번호를 입력해 주세요.",
})

const LoginCard = () => {
  const [tab, setTab] = useState<MemberType>("company")
  const [id, setId] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState<FieldErrors>({})
  const [submitted, setSubmitted] = useState(false)
  const footer = FOOTERS[tab]

  const footerLink = (
    <Button
      type="button"
      variant="underLine"
      className="text-ink-body h-auto p-0 text-sm font-bold underline underline-offset-4"
    >
      {footer.link}
    </Button>
  )

  const revalidate = (next: { id?: string; password?: string }) => {
    if (!submitted) return
    setErrors(validate(next.id ?? id, next.password ?? password))
  }

  return (
    <div className="border-line-card-strong bg-surface-field flex flex-col overflow-hidden rounded-xl border md:rounded-2xl">
      <div role="tablist" aria-label="회원 유형" className="grid grid-cols-2">
        {TABS.map((item, index) => {
          const active = item.key === tab

          return (
            <button
              key={item.key}
              type="button"
              role="tab"
              aria-selected={active}
              aria-controls={`login-panel-${item.key}`}
              id={`login-tab-${item.key}`}
              onClick={() => setTab(item.key)}
              className={cn(
                "flex cursor-pointer flex-col items-center gap-1 px-2 py-4 text-center md:px-4 md:py-8",
                active
                  ? "bg-brand-primary"
                  : cn(
                      "bg-surface-disabled border-line-card-strong",
                      index === 0 ? "border-r" : "border-l",
                    ),
              )}
            >
              <span
                className={cn(
                  "text-xl font-bold break-keep md:text-2xl",
                  active ? "text-ink-on-brand" : "text-ink-bullet",
                )}
              >
                {item.title}
              </span>
              <span
                className={cn(
                  "text-xs font-normal whitespace-nowrap md:text-sm md:font-medium",
                  active ? "text-ink-on-brand-muted" : "text-ink-faint",
                )}
              >
                {item.caption}
              </span>
            </button>
          )
        })}
      </div>

      <div
        role="tabpanel"
        id={`login-panel-${tab}`}
        aria-labelledby={`login-tab-${tab}`}
        className="border-line-card-strong flex flex-col gap-4 border-t p-5 md:gap-6 md:p-8"
      >
        {tab === "company" ? (
          <>
            <div className="border-line-panel bg-surface-panel flex flex-col gap-4 rounded-lg border p-5 md:rounded-2xl md:p-8">
              <div className="flex flex-col">
                <p className="text-ink-strong text-base font-bold break-keep">
                  기보 ONE 플랫폼 통합 로그인
                </p>
                <p className="text-ink-faint text-xs break-keep">
                  중소벤처기업부 통합 인증 서비스
                </p>
              </div>

              <div className="text-ink-muted flex flex-col gap-1 text-xs break-keep md:text-sm">
                <p>
                  기업회원은 기보 ONE 플랫폼 통합 계정으로 탄소중립 플랫폼을
                  로그인합니다.
                </p>
                <p>
                  아래 버튼을 클릭하면 기보 ONE 플랫폼 로그인 페이지로
                  이동합니다.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-4 md:gap-6">
              <Button
                type="button"
                size="lg"
                className="bg-brand-primary hover:bg-brand-primary-hover text-ink-on-brand h-11 w-full px-4 text-sm font-bold md:h-13"
              >
                기보 ONE 로그인
              </Button>

              <div className="text-ink-faint flex flex-col items-center gap-1 text-xs break-keep">
                {NOTES.map((note) => (
                  <p key={note}>{note}</p>
                ))}
              </div>
            </div>
          </>
        ) : (
          <form
            onSubmit={(event) => {
              event.preventDefault()
              const next = validate(id, password)
              setSubmitted(true)
              setErrors(next)
              if (next.id || next.password) return
              // TODO: 로그인 API 연동
            }}
            noValidate
            className="flex flex-col gap-4 md:gap-6"
          >
            <div className="flex flex-col gap-2 md:gap-6">
              <div className="flex flex-col gap-2.5">
                <Label
                  htmlFor="login-id"
                  className="text-ink-strong text-base font-bold"
                >
                  아이디
                </Label>
                <Input
                  id="login-id"
                  name="login-id"
                  autoComplete="username"
                  placeholder="아이디를 입력하세요"
                  value={id}
                  isValid={!errors.id}
                  aria-describedby="login-id-message"
                  onChange={(event) => {
                    setId(event.target.value)
                    revalidate({ id: event.target.value })
                  }}
                  className={cn(
                    "border-line-field bg-surface-field text-ink-strong placeholder:text-ink-placeholder h-12 rounded-md text-sm font-medium placeholder:font-medium",
                    errors.id &&
                      "hover:ring-destructive focus-visible:ring-destructive",
                  )}
                />
                {errors.id && (
                  <p
                    id="login-id-message"
                    role="alert"
                    className="text-ink-error text-xs font-medium"
                  >
                    {errors.id}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2.5">
                <Label
                  htmlFor="login-password"
                  className="text-ink-strong text-base font-bold"
                >
                  비밀번호
                </Label>
                <Input
                  id="login-password"
                  name="login-password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="비밀번호를 입력하세요"
                  value={password}
                  isValid={!errors.password}
                  aria-describedby="login-password-message"
                  onChange={(event) => {
                    setPassword(event.target.value)
                    revalidate({ password: event.target.value })
                  }}
                  className={cn(
                    "border-line-field bg-surface-field text-ink-strong placeholder:text-ink-placeholder h-12 rounded-md text-sm font-medium placeholder:font-medium",
                    errors.password &&
                      "hover:ring-destructive focus-visible:ring-destructive",
                  )}
                />
                {errors.password && (
                  <p
                    id="login-password-message"
                    role="alert"
                    className="text-ink-error text-xs font-medium"
                  >
                    {errors.password}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember-id"
                  name="remember-id"
                  className="border-line-muted bg-surface-check size-5"
                />
                <Label
                  htmlFor="remember-id"
                  className="text-ink-bullet text-sm font-medium"
                >
                  아이디 저장
                </Label>
              </div>

              {/* 찾기 절차가 따로 없어 담당자 연락처 안내 팝업만 연다 */}
              <FindAccountDialog>
                <Button
                  type="button"
                  variant="underLine"
                  className="text-ink-bullet h-auto p-0 text-sm font-medium"
                >
                  아이디 · 비밀번호 찾기
                </Button>
              </FindAccountDialog>
            </div>

            <Button
              type="submit"
              size="lg"
              className="bg-brand-primary hover:bg-brand-primary-hover text-ink-on-brand h-11 w-full px-4 text-sm font-bold md:h-13"
            >
              로그인
            </Button>
          </form>
        )}
      </div>

      <div className="border-line-card-strong bg-surface-panel flex flex-col items-center justify-center gap-1 border-t px-5 py-6 sm:flex-row sm:gap-4">
        <span className="text-ink-bullet text-sm font-medium break-keep">
          {footer.text}
        </span>
        <span
          aria-hidden="true"
          className="bg-line-field hidden h-4 w-px sm:block"
        />
        {/* 기관회원은 스스로 가입할 수 없어 [회원가입] 이 안내 팝업을 연다.
            기업회원 쪽은 기보 ONE 플랫폼으로 나가는 링크라 팝업이 없다. */}
        {tab === "agency" ? (
          <AgencySignupGuideDialog>{footerLink}</AgencySignupGuideDialog>
        ) : (
          footerLink
        )}
      </div>
    </div>
  )
}

export default LoginCard
