"use client"

import { useId, useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogCloseButton,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { useDialogAutoOpen } from "@/util/use-dialog-auto-open"

// IA 60번 "하위계정 등록" 모달 팝업. 하위계정 관리 화면의 [계정 추가] 로 연다.
// 실제 등록 API 는 없고, 저장하면 부모가 들고 있는 목록에 한 줄이 늘어난다.

/** 새 계정 한 건. 목록 화면(sub-account.tsx)의 행 모양과 같다 */
export interface SubAccountDraft {
  id: string
  password: string
  manager: string
  team: string
  status: "active" | "suspended"
  memo: string
}

/**
 * 입력 칸 한 벌. 시안은 높이 52 · 라운드 6 · 테두리 line-field 다.
 * 신청서 작성 화면(application-form.tsx 의 FIELD)과 같은 규칙을 쓴다.
 */
const FIELD =
  "border-line-field bg-surface-field text-ink-strong placeholder:text-ink-placeholder dark:placeholder:text-ink-muted hover:ring-ash-600 focus-visible:ring-ash-600 h-12 w-full min-w-0 rounded-md border px-4 text-xs font-normal outline-hidden md:text-sm md:font-medium hover:ring-2 focus-visible:ring-2"

/**
 * 오류 표시. 기업 정보 입력(company-info.tsx)·신청서 작성 화면과 같은 규칙이다.
 * 테두리는 그대로 두고 2px 붉은 링을 두르며, hover·focus 링도 같이 붉게 바뀐다.
 * 시안에는 링이 그려져 있지 않지만 다른 화면 입력칸과 오류 표시를 맞춘다.
 */
const FIELD_ERROR =
  "ring-destructive hover:ring-destructive focus-visible:ring-destructive ring-2"

/** 검사 대상이 되는 칸. 상태는 기본값이 있고 메모는 선택이라 빠진다 */
type FieldKey = "id" | "password" | "manager" | "team"

/** 검사·포커스 순서. 시안의 칸 순서와 같다 */
const FIELD_ORDER: FieldKey[] = ["id", "password", "manager", "team"]

/** 계정 ID 규칙. 시안 플레이스홀더의 "영문으로 시작하는 4~20자" 를 그대로 옮겼다 */
const ID_PATTERN = /^[A-Za-z][A-Za-z0-9_]{3,19}$/

/**
 * 칸별 형식 검사. 통과하면 null 이다.
 * 계정 ID 는 여기를 통과해도 중복확인을 따로 받아야 저장된다.
 */
const RULES: Record<FieldKey, (value: string) => string | null> = {
  id: (value) => {
    if (!value) return "계정 ID를 입력해주세요"
    if (!ID_PATTERN.test(value))
      return "영문으로 시작하는 4~20자로 입력해주세요"
    return null
  },
  password: (value) => {
    if (!value) return "비밀번호를 입력해주세요"
    if (value.length < 8) return "비밀번호를 8자 이상 입력해주세요"
    return null
  },
  manager: (value) => (value ? null : "담당자 이름을 입력해주세요"),
  team: (value) => (value ? null : "구분 / 소속을 입력해주세요"),
}

const EMPTY: SubAccountDraft = {
  id: "",
  password: "",
  manager: "",
  team: "",
  status: "active",
  memo: "",
}

/** 칸 아래 안내 한 줄. 시안은 13/700 이고 통과했을 때만 초록이다 */
const FieldMessage = ({
  id,
  text,
  tone,
}: {
  id: string
  text: string
  tone: "error" | "ok"
}) => (
  <p
    id={id}
    role={tone === "error" ? "alert" : "status"}
    className={cn(
      "text-xs font-medium break-keep lg:text-sm",
      tone === "ok" ? "text-forest" : "text-ink-error",
    )}
  >
    {text}
  </p>
)

/** 이름표 + 입력 한 묶음. 시안은 이름표와 칸 사이가 10 이다 */
const Field = ({
  label,
  htmlFor,
  required,
  error,
  children,
}: {
  label: string
  htmlFor: string
  /** 이름표 뒤 빨간 별표 */
  required?: boolean
  /** 있으면 칸 아래에 붉은 안내가 붙는다 */
  error?: string
  children: React.ReactNode
}) => (
  <div className="flex flex-col gap-2.5">
    <label
      htmlFor={htmlFor}
      className="text-ink-strong text-sm font-bold break-keep md:text-base"
    >
      {label}
      {required ? <span className="text-destructive ml-1">*</span> : null}
    </label>
    {children}
    {error ? (
      <FieldMessage id={`${htmlFor}-message`} text={error} tone="error" />
    ) : null}
  </div>
)

const SubAccountRegisterDialog = ({
  open,
  onOpenChange,
  defaultOpen,
  existingIds = [],
  onSubmit,
}: {
  /** 목록 화면이 여닫을 때 넘긴다. 없으면 팝업이 스스로 상태를 든다 */
  open?: boolean
  onOpenChange?: (open: boolean) => void
  /** 모달 전용 라우트(/my-page/sub-account/register)로 바로 들어왔을 때 열어 둔다 */
  defaultOpen?: boolean
  /** 이미 등록된 계정 ID. 중복확인이 이 목록을 본다 */
  existingIds?: string[]
  onSubmit?: (draft: SubAccountDraft) => void
}) => {
  // 모달 전용 라우트에서는 목록이 없으니 팝업이 혼자 열고 닫는다
  const [selfOpen, setSelfOpen] = useDialogAutoOpen(defaultOpen)
  const isOpen = open ?? selfOpen
  const setOpen = onOpenChange ?? setSelfOpen

  const [draft, setDraft] = useState<SubAccountDraft>(EMPTY)
  const [errors, setErrors] = useState<Partial<Record<FieldKey, string>>>({})
  /** [저장하기] 에서 처음 걸린 칸으로 커서를 옮기려고 들고 있는다 */
  const inputRefs = useRef<Partial<Record<FieldKey, HTMLInputElement | null>>>(
    {},
  )
  /** 중복확인을 통과한 상태인지. ID 를 고치면 다시 false 가 된다 */
  const [idChecked, setIdChecked] = useState(false)
  const fieldId = useId()

  const set = <K extends keyof SubAccountDraft>(
    key: K,
    value: SubAccountDraft[K],
  ) => setDraft((prev) => ({ ...prev, [key]: value }))

  /** 고치는 동안에는 안내를 지운다. 다시 검사하는 시점은 blur 와 [저장하기] 다 */
  const clearError = (key: FieldKey) =>
    setErrors(({ [key]: _removed, ...rest }) => rest)

  const setError = (key: FieldKey, message: string | null) =>
    setErrors((prev) => {
      if (!message) {
        const { [key]: _removed, ...rest } = prev
        return rest
      }
      return { ...prev, [key]: message }
    })

  const handleChange = (key: FieldKey, value: string) => {
    set(key, value)
    clearError(key)
    // ID 를 고치면 앞서 받은 중복확인 결과는 무효다
    if (key === "id") setIdChecked(false)
  }

  const handleBlur = (key: FieldKey) => {
    const value = draft[key].trim()
    // 비어 있는 채로 지나가는 것은 아직 안 쓴 것으로 보고 넘긴다. 저장할 때 잡는다
    if (!value) return
    setError(key, RULES[key](value))
  }

  const handleIdCheck = () => {
    const value = draft.id.trim()
    const invalid = RULES.id(value)
    if (invalid) {
      setIdChecked(false)
      setError("id", invalid)
      return
    }
    if (existingIds.includes(value)) {
      setIdChecked(false)
      setError("id", "중복된 ID입니다")
      return
    }
    setIdChecked(true)
    setError("id", null)
  }

  const close = () => {
    setOpen(false)
    setDraft(EMPTY)
    setErrors({})
    setIdChecked(false)
  }

  const handleSave = () => {
    const next: Partial<Record<FieldKey, string>> = {}
    for (const key of FIELD_ORDER) {
      const message = RULES[key](draft[key].trim())
      if (message) next[key] = message
    }
    // 형식은 맞지만 중복확인을 아직 안 받은 경우
    if (!next.id && !idChecked) next.id = "계정 ID 중복확인을 해주세요"

    const firstInvalid = FIELD_ORDER.find((key) => next[key])
    if (firstInvalid) {
      setErrors(next)
      // 스크롤은 focus 에 맡기지 않고 직접 옮긴다. 팝업 본문이 따로 구르기 때문이다.
      // 잘못된 칸은 바로 보여야 하므로 여기는 애니메이션 없이 즉시 옮긴다.
      const node = inputRefs.current[firstInvalid]
      node?.scrollIntoView({ block: "center" })
      node?.focus({ preventScroll: true })
      return
    }

    onSubmit?.({
      ...draft,
      id: draft.id.trim(),
      manager: draft.manager.trim(),
      team: draft.team.trim(),
    })
    close()
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(next) => (next ? setOpen(true) : close())}
    >
      <DialogContent className="bg-surface-field max-h-5/6 lg:max-h-11/12 flex w-full flex-col gap-0 rounded-xl p-0 md:max-w-150 lg:max-w-184">
        {/* 시안은 PC 만 닫기 버튼이 머리글 안 우상단에 있고,
            768·360 은 팝업 밖 오른쪽 위(카드에서 10 띄움)로 빠진다.
            설명 팝업(emission-source-example-dialog.tsx)과 같은 규칙이다. */}
        <DialogCloseButton className="bg-surface-inverse text-ink-on-inverse absolute -top-10.5 right-0 size-8 lg:top-9 lg:right-10" />

        <DialogHeader className="border-line-card border-b px-5 pt-6 pb-3 text-left sm:text-left md:px-8 md:pt-8 md:pb-5 lg:px-10">
          <DialogTitle className="text-ink-strong text-xl font-bold break-keep md:text-2xl lg:text-3xl">
            하위 계정 등록
          </DialogTitle>
        </DialogHeader>

        {/* 화면이 낮으면 입력 묶음만 세로로 구른다. 머리글·바닥글은 붙어 있다 */}
        <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-5 py-6 md:gap-4 md:px-8 md:py-5 lg:px-10">
          <div className="flex flex-col gap-2.5">
            <label
              htmlFor={`${fieldId}-id`}
              className="text-ink-strong text-sm font-bold break-keep md:text-base"
            >
              계정 ID<span className="text-destructive ml-1">*</span>
            </label>
            <div className="flex gap-2.5">
              <input
                id={`${fieldId}-id`}
                ref={(node) => {
                  inputRefs.current.id = node
                }}
                name="sub-account-id"
                autoComplete="off"
                placeholder="영문으로 시작하는 4~20자"
                value={draft.id}
                onChange={(event) => handleChange("id", event.target.value)}
                onBlur={() => handleBlur("id")}
                aria-invalid={errors.id ? true : undefined}
                aria-describedby={
                  errors.id || idChecked ? `${fieldId}-id-message` : undefined
                }
                className={cn(FIELD, errors.id && FIELD_ERROR)}
              />
              <button
                type="button"
                onClick={handleIdCheck}
                className="border-brand-primary bg-surface-field text-brand-primary hover:bg-surface-flow h-12 w-20 shrink-0 cursor-pointer rounded-md border text-sm font-bold transition-colors"
              >
                중복확인
              </button>
            </div>
            {/* 오류가 먼저다. 오류가 없고 중복확인을 통과했을 때만 초록 안내가 뜬다 */}
            {errors.id ? (
              <FieldMessage
                id={`${fieldId}-id-message`}
                text={errors.id}
                tone="error"
              />
            ) : idChecked ? (
              <FieldMessage
                id={`${fieldId}-id-message`}
                text="사용 가능한 아이디입니다"
                tone="ok"
              />
            ) : null}
          </div>

          <Field
            label="비밀번호"
            htmlFor={`${fieldId}-password`}
            required
            error={errors.password}
          >
            <input
              id={`${fieldId}-password`}
              ref={(node) => {
                inputRefs.current.password = node
              }}
              name="sub-account-password"
              type="password"
              autoComplete="new-password"
              placeholder="8자 이상 입력"
              value={draft.password}
              onChange={(event) => handleChange("password", event.target.value)}
              onBlur={() => handleBlur("password")}
              aria-invalid={errors.password ? true : undefined}
              aria-describedby={
                errors.password ? `${fieldId}-password-message` : undefined
              }
              className={cn(FIELD, errors.password && FIELD_ERROR)}
            />
          </Field>

          <Field
            label="담당자 이름"
            htmlFor={`${fieldId}-manager`}
            required
            error={errors.manager}
          >
            <input
              id={`${fieldId}-manager`}
              ref={(node) => {
                inputRefs.current.manager = node
              }}
              name="sub-account-manager"
              autoComplete="off"
              placeholder="담당자 이름을 입력하세요"
              value={draft.manager}
              onChange={(event) => handleChange("manager", event.target.value)}
              onBlur={() => handleBlur("manager")}
              aria-invalid={errors.manager ? true : undefined}
              aria-describedby={
                errors.manager ? `${fieldId}-manager-message` : undefined
              }
              className={cn(FIELD, errors.manager && FIELD_ERROR)}
            />
          </Field>

          <Field
            label="구분 / 소속"
            htmlFor={`${fieldId}-team`}
            required
            error={errors.team}
          >
            <input
              id={`${fieldId}-team`}
              ref={(node) => {
                inputRefs.current.team = node
              }}
              name="sub-account-team"
              autoComplete="off"
              placeholder="예 : 기획팀, 환경안전팀"
              value={draft.team}
              onChange={(event) => handleChange("team", event.target.value)}
              onBlur={() => handleBlur("team")}
              aria-invalid={errors.team ? true : undefined}
              aria-describedby={
                errors.team ? `${fieldId}-team-message` : undefined
              }
              className={cn(FIELD, errors.team && FIELD_ERROR)}
            />
          </Field>

          <Field label="상태" htmlFor={`${fieldId}-status`} required>
            {/* 셀렉트 원본이 box-shadow 를 직접 잡고 있어 한 겹 감싼다 */}
            <div className="rounded-md">
              <Select
                name="sub-account-status"
                value={draft.status}
                onValueChange={(value) =>
                  set("status", value as SubAccountDraft["status"])
                }
              >
                <SelectTrigger
                  id={`${fieldId}-status`}
                  className="border-line-field bg-surface-flow text-ink-strong focus-visible:ring-ash-600 h-12 w-full rounded-md px-4 text-xs font-normal focus-visible:ring-2 md:text-sm md:font-medium"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">사용</SelectItem>
                  <SelectItem value="suspended">사용정지</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Field>

          <Field label="메모" htmlFor={`${fieldId}-memo`}>
            <textarea
              id={`${fieldId}-memo`}
              name="sub-account-memo"
              placeholder="메모를 입력하세요 (선택)"
              value={draft.memo}
              onChange={(event) => set("memo", event.target.value)}
              className={cn(FIELD, "h-40 resize-none py-4")}
            />
          </Field>
        </div>

        <div className="border-line-card flex gap-3 border-t px-5 py-5 md:justify-end md:px-8 lg:px-10">
          {/* 프로젝트의 다른 [취소]·[이전으로] 와 같이 outline 변형을 쓴다.
              모달 안이라 확인 모달(confirm-dialog.tsx)처럼 면색은 비워 팝업 면을 그대로 쓴다 */}
          <Button
            type="button"
            variant="outline"
            onClick={close}
            className="h-11.5 min-w-0 flex-1 rounded-lg bg-transparent text-sm font-bold md:h-13 md:w-30 md:flex-none"
          >
            취소
          </Button>
          {/* 눌러 봐야 어느 칸이 잘못됐는지 알 수 있어야 해서 잠그지 않는다.
              빈 칸이 있으면 저장 대신 칸마다 안내가 뜬다 */}
          <Button
            type="button"
            onClick={handleSave}
            className="h-11.5 min-w-0 flex-1 rounded-lg text-sm font-bold md:h-13 md:w-36 md:flex-none"
          >
            저장하기
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default SubAccountRegisterDialog
