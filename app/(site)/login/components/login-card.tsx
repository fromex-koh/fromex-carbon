"use client"

import { useState } from "react"
import { ArrowUpRight, Eye, EyeOff } from "lucide-react"

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
  { key: "company" as const, title: "기업회원" },
  { key: "agency" as const, title: "기관회원" },
]

/** 좁은 화면에서 주소 중간(/ · .)이 끊기면 읽기 어려워 한 덩어리로 묶는다 */
const PORTAL = "(https://www.kibo.or.kr/portal)"

/** 한 줄이 <p> 하나다. 줄바꿈 자리를 고정하려고 배열로 나눠 둔다 */
const NOTES = [
  `기보 ONE 플랫폼${PORTAL} 로그인 후,`,
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
  const [showPassword, setShowPassword] = useState(false)
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

  // 다크는 페이지 배경과 카드가 같은 색이라, 카드만 한 단계 밝은 면으로 띄운다
  return (
    <div className="border-line-card bg-surface-field dark:bg-surface-card flex flex-col gap-6 rounded-2xl border p-5 md:gap-7.5 md:p-7.5">
      {/* 회원 유형 세그먼트. 면색은 버튼이 아니라 아래 표시자 한 장이 맡는다 */}
      <div
        role="tablist"
        aria-label="회원 유형"
        className="bg-surface-disabled dark:bg-surface-field grid grid-cols-2 rounded-full p-1"
      >
        {/* 칸 하나 크기로 1번 칸에 겹쳐 두고, 2번이 선택되면 제 너비만큼 옮긴다.
            칸 너비가 같아 translate-x-full 이 정확히 옆 칸에 맞는다. */}
        <span
          aria-hidden="true"
          className={cn(
            "bg-brand-primary pointer-events-none col-start-1 row-start-1 rounded-full transition-transform duration-300 ease-out motion-reduce:transition-none",
            tab === "agency" && "translate-x-full",
          )}
        />
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
                "relative row-start-1 cursor-pointer rounded-full px-2 py-3.5 text-center text-sm transition-colors",
                index === 0 ? "col-start-1" : "col-start-2",
                active
                  ? "text-ink-on-brand font-bold"
                  : "text-ink-muted font-semibold",
              )}
            >
              {item.title}
            </button>
          )
        })}
      </div>

      <div
        role="tabpanel"
        id={`login-panel-${tab}`}
        aria-labelledby={`login-tab-${tab}`}
        className="flex flex-col gap-6"
      >
        {tab === "company" ? (
          <div className="flex flex-col gap-4">
            <div className="bg-surface-panel flex flex-col gap-4 rounded-2xl p-5">
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
              </div>
            </div>

            {/* 외부 사이트로 나가는 동선이라 대각선 화살표를 붙인다 */}
            <Button
              type="button"
              size="lg"
              className="bg-brand-primary hover:bg-brand-primary-hover text-ink-on-brand h-13 w-full gap-1.5 rounded-lg px-4 text-sm font-bold"
            >
              기보 ONE 로그인
              <ArrowUpRight aria-hidden="true" className="size-5" />
            </Button>

            <div className="text-ink-faint flex flex-col items-center gap-1 text-center text-xs break-keep">
              {NOTES.map((note) => {
                const [head, tail] = note.split(PORTAL)

                return (
                  <p key={note}>
                    {head}
                    {tail === undefined ? null : (
                      <span className="whitespace-nowrap">{PORTAL}</span>
                    )}
                    {tail}
                  </p>
                )
              })}
            </div>
          </div>
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
                    "border-line-field bg-surface-field text-ink-strong placeholder:text-ink-placeholder h-12.25 rounded-md text-base font-medium placeholder:font-medium",
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
                {/* 눈 버튼이 글자 위에 겹치지 않게 입력 칸 오른쪽을 비워 둔다 */}
                <div className="relative">
                  <Input
                    id="login-password"
                    name="login-password"
                    type={showPassword ? "text" : "password"}
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
                      "border-line-field bg-surface-field text-ink-strong placeholder:text-ink-placeholder h-12.25 rounded-md pr-11 text-base font-medium placeholder:font-medium",
                      errors.password &&
                        "hover:ring-destructive focus-visible:ring-destructive",
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={
                      showPassword ? "비밀번호 숨기기" : "비밀번호 표시"
                    }
                    aria-pressed={showPassword}
                    className="text-ink-muted hover:text-ink-strong absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeOff aria-hidden="true" className="size-5" />
                    ) : (
                      <Eye aria-hidden="true" className="size-5" />
                    )}
                  </button>
                </div>
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
              className="bg-brand-primary hover:bg-brand-primary-hover text-ink-on-brand h-13 w-full rounded-lg px-4 text-sm font-bold"
            >
              로그인
            </Button>
          </form>
        )}
      </div>

      <div className="border-line-card flex flex-col items-center justify-center gap-2 border-t pt-5 sm:flex-row sm:gap-4">
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
