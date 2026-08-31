"use client"

import { useEffect, useState } from "react"
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Minus,
  Plus,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Stepper } from "@/components/ui/stepper"
import BaseInfo from "@/app/(site)/(content)/carbon-leader/self-check/components/base-info"
import CertificationTypeDialog from "@/app/(site)/(content)/carbon-leader/self-check/components/certification-type-dialog"
import EmissionSourceExampleDialog from "@/app/(site)/(content)/carbon-leader/self-check/components/emission-source-example-dialog"
import GradeBadge from "@/app/(site)/(content)/carbon-leader/self-check/components/grade-badge"
import MandatoryTrainingDialog from "@/app/(site)/(content)/carbon-leader/self-check/components/mandatory-training-dialog"
import StepMobileNav from "@/app/(site)/(content)/carbon-leader/self-check/components/step-mobile-nav"
import {
  EVALUATION_FINAL_GRADE,
  EVALUATION_SECTIONS,
  EVALUATION_SUMMARY_ROWS,
  EVALUATION_TOTAL_SCORE,
  type Grade,
  type HelpTopic,
  type Indicator,
  type IndicatorType,
} from "@/constants/carbon-leader-evaluation-index-items"
import { SELF_CHECK_STEPS } from "@/constants/carbon-leader-self-check-steps"
import { cn } from "@/lib/utils"

// 자가진단 STEP 5 평가지표 작성.
// 지표 하나가 아코디언 한 칸이다. 펼침/접힘은 details 로만 처리하고 자바스크립트를 쓰지 않는다.
// 표시 값은 전부 고정 문구다. constants/carbon-leader-evaluation-index-items 참고.

/** 모두 열기·닫기 버튼이 다룰 지표 전체 */
const ALL_INDICATORS = EVALUATION_SECTIONS.flatMap((section) =>
  section.groups.flatMap((group) => group.indicators),
)

/** 요약 카드도 같은 버튼으로 여닫는다. 지표 번호와 겹치지 않는 키를 쓴다. */
const SUMMARY_KEY = "summary"

const ALL_KEYS = [...ALL_INDICATORS.map((item) => item.no), SUMMARY_KEY]

/**
 * 유효성 검사 대상. 선택지가 있는 정성 지표만 응답이 필요하다.
 * 체크 지표는 하나도 고르지 않아도 E 등급이 나오므로 선택 입력이다.
 */
const REQUIRED_INDICATORS = ALL_INDICATORS.filter((item) => item.choices)

const NOTICES = [
  "평가지표별 해당 항목을 선택하면 산정등급과 산출점수가 자동으로 계산됩니다.",
]

/** A 부터 E 까지. 등급 기준표와 체크 개수 환산에 함께 쓴다. */
const GRADES: Grade[] = ["A", "B", "C", "D", "E"]

/** 등급별 색. 시안이 라이트·다크 같은 색을 쓴다. */
const GRADE_COLOR: Record<Grade, string> = {
  A: "text-brand-done-teal",
  B: "text-brand-info",
  C: "text-brand-done-violet",
  D: "text-candy-pink",
  E: "text-ocean-blue",
}

const GRADE_RING: Record<Grade, string> = {
  A: "ring-brand-done-teal",
  B: "ring-brand-info",
  C: "ring-brand-done-violet",
  D: "ring-candy-pink",
  E: "ring-ocean-blue",
}

/** 섹션 카드에서 가장 마지막에 놓이는 지표 번호 */
const lastIndicatorNo = (section: (typeof EVALUATION_SECTIONS)[number]) =>
  section.groups[section.groups.length - 1]?.indicators.at(-1)?.no

/** 유형 배지 색. 정성은 녹색, 체크는 파랑, 계량은 보라다. */
const TYPE_COLOR: Record<IndicatorType, string> = {
  정성: "bg-forest-light/20 text-brand-required",
  체크: "bg-brand-progress/20 text-brand-primary",
  계량: "bg-brand-done-violet/20 text-brand-done-violet",
}

/** 물음표 버튼이 여는 설명 팝업 */
const HELP_DIALOG: Record<
  HelpTopic,
  (props: { children: React.ReactNode }) => React.ReactElement
> = {
  "mandatory-training": MandatoryTrainingDialog,
  "emission-source-example": EmissionSourceExampleDialog,
  "certification-type": CertificationTypeDialog,
}

/**
 * 체크 항목 옆 물음표 버튼. 누르면 그 항목의 설명 팝업이 뜬다.
 * 시안이 채운 원 안에 흰 물음표라 lucide 아이콘 대신 글자로 그린다.
 */
const HelpButton = ({ topic, label }: { topic: HelpTopic; label: string }) => {
  const Popup = HELP_DIALOG[topic]

  return (
    <Popup>
      <button
        type="button"
        aria-label={`${label} 설명 보기`}
        className="bg-brand-primary text-ink-on-brand inline-flex size-5 shrink-0 cursor-pointer items-center justify-center rounded-full align-middle text-xs font-bold"
      >
        ?
      </button>
    </Popup>
  )
}

/** 지표 헤더의 알약 배지 한 벌 */
const Pill = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => (
  <span
    className={cn(
      "inline-flex h-7 shrink-0 items-center justify-center rounded-full px-5 text-sm font-bold whitespace-nowrap md:h-7.5 lg:h-8",
      className,
    )}
  >
    {children}
  </span>
)

/** 오류 문구 한 줄. 감축잠재량 산정 화면과 같은 규격이다. */
const FieldError = ({ show, message }: { show: boolean; message: string }) =>
  show ? <p className="text-ink-error text-sm">{message}</p> : null

/** 설명 박스의 불릿 한 줄 */
const Bullet = ({ children }: { children: React.ReactNode }) => (
  <li className="text-ink-body flex gap-1 text-sm font-medium break-keep">
    <span
      aria-hidden="true"
      className="flex h-5.5 w-2.5 shrink-0 items-center justify-center"
    >
      <span className="bg-ink-bullet size-1 rounded-full" />
    </span>
    <span>{children}</span>
  </li>
)

/** 접기·펼치기 표시. details 의 open 상태를 따라간다. */
const ToggleMark = ({ className }: { className?: string }) => (
  <span
    className={cn(
      "text-brand-primary inline-flex h-8 shrink-0 items-center gap-2 px-3 text-sm font-bold whitespace-nowrap lg:text-base [&_svg]:size-4",
      className,
    )}
  >
    <span className="w-12 text-right">
      <span className="hidden group-open:inline">접기</span>
      <span className="group-open:hidden">펼치기</span>
    </span>
    <ChevronUp
      aria-hidden="true"
      strokeWidth={3}
      className="hidden group-open:block"
    />
    <ChevronDown
      aria-hidden="true"
      strokeWidth={3}
      className="group-open:hidden"
    />
  </span>
)

/** 등급 기준표. 예상등급 열만 강조한다. */
const GradeScaleTable = ({
  item,
  current,
}: {
  item: Indicator
  current: Grade | null
}) => {
  if (!item.scale) return null
  const grades = GRADES
  const cellOn = "bg-surface-flow text-brand-primary"

  return (
    <>
      {/* 360 시안은 등급을 세로로 세운 2열 표다 */}
      <div className="border-line-field border-t-ink-strong border-t border-b md:hidden">
        <table className="w-full table-fixed border-collapse">
          <tbody>
            {grades.map((grade, index) => (
              <tr key={grade}>
                <th
                  scope="row"
                  className={cn(
                    "border-line-field w-1/3 border-r px-3 py-3 text-center text-xs font-bold",
                    index < 4 && "border-b",
                    grade === current
                      ? cellOn
                      : "bg-surface-disabled text-ink-body",
                  )}
                >
                  {grade}등급
                </th>
                <td
                  className={cn(
                    "px-3 py-3 text-center text-xs font-medium break-keep",
                    index < 4 && "border-line-field border-b",
                    grade === current
                      ? cellOn
                      : "bg-surface-field text-ink-body",
                  )}
                >
                  {item.scale?.values[index]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 768 이상은 시안대로 가로 6열 */}
      <div className="border-line-field border-t-ink-strong overflow-x-auto border-t border-b max-md:hidden">
        <table className="w-full min-w-132 table-fixed border-collapse">
          <thead>
            <tr>
              <th
                scope="col"
                className="bg-surface-disabled text-ink-body border-line-field border-r border-b px-3 py-3 text-center text-sm font-bold lg:text-base"
              >
                등급
              </th>
              {grades.map((grade, index) => (
                <th
                  key={grade}
                  scope="col"
                  className={cn(
                    "border-line-field border-b px-3 py-3 text-center text-sm font-bold lg:text-base",
                    index < 4 && "border-r",
                    grade === current
                      ? cellOn
                      : "bg-surface-disabled text-ink-body",
                  )}
                >
                  {grade}등급
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <th
                scope="row"
                className="bg-surface-field text-ink-body border-line-field border-r px-3 py-4 text-center text-sm font-medium lg:text-base"
              >
                {item.scale.caption}
              </th>
              {item.scale.values.map((value, index) => (
                <td
                  key={grades[index]}
                  className={cn(
                    "px-3 py-4 text-center text-sm font-medium break-keep lg:text-base",
                    index < 4 && "border-line-field border-r",
                    grades[index] === current
                      ? cellOn
                      : "bg-surface-field text-ink-body",
                  )}
                >
                  {value}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </>
  )
}

/** 지표 한 칸. 헤더는 항상 보이고 본문은 details 로 접힌다. */
const IndicatorRow = ({
  item,
  open,
  onOpenChange,
  showErrors,
  onAnsweredChange,
  last,
}: {
  item: Indicator
  open: boolean
  onOpenChange: (open: boolean) => void
  showErrors: boolean
  /** 섹션 카드의 마지막 지표인지. 360 에서 아래 구분선을 뺄지 정한다 */
  last?: boolean
  /** 선택 여부를 위로 올린다. 오류 났을 때 첫 지표를 찾는 데 쓴다. */
  onAnsweredChange: (answered: boolean) => void
}) => {
  // 시안은 예상등급이 고정이지만, 선택지를 고르면 그 등급으로 배지가 바뀐다.
  const [choice, setChoice] = useState<Grade | null>(null)
  const [checkedList, setCheckedList] = useState<boolean[]>(() =>
    (item.checks ?? []).map(() => false),
  )
  const checkedCount = checkedList.filter(Boolean).length

  // 체크 지표는 충족 개수(배점이 있으면 점수 합)로 등급이 정해진다.
  // 모두 충족이면 A, 하나씩 모자랄수록 B·C·D 로 내려가고 미충족이면 E 다.
  const weightOf = (score?: string) =>
    score ? Number(score.replace(/\D/g, "")) : 1
  const fullScore = (item.checks ?? []).reduce(
    (sum, check) => sum + weightOf(check.score),
    0,
  )
  const earned = (item.checks ?? []).reduce(
    (sum, check, index) =>
      checkedList[index] ? sum + weightOf(check.score) : sum,
    0,
  )
  const checkGrade = item.checks
    ? GRADES[Math.min(Math.max(fullScore - earned, 0), GRADES.length - 1)]
    : null

  // 계량 지표는 입력 칸 대신 "계산 결과: … → A등급 해당" 문구가 등급을 알려 준다.
  const resultGrade = (item.result?.match(/([A-E])등급/)?.[1] ??
    null) as Grade | null

  // 정성 지표는 고르기 전까지 예상등급 배지를 비워 둔다.
  const grade = choice ?? checkGrade ?? resultGrade
  const invalidChoice = showErrors && !!item.choices && !choice

  return (
    <details
      open={open}
      onToggle={(event) => onOpenChange(event.currentTarget.open)}
      id={`indicator-${item.no}`}
      className={cn(
        "group border-line-card md:rounded-2xl md:border lg:rounded-none lg:border-0",
        // 360 은 카드 하나 안에서 구분선으로만 나뉜다. 마지막 지표 아래에는 긋지 않는다.
        !last && "max-md:border-b",
      )}
    >
      <summary className="cursor-pointer list-none pt-3 md:px-6 md:pt-6 lg:px-8 lg:pt-4">
        {/* 구분선은 카드를 가로지르지 않고 좌우 여백 안쪽에만 그어진다 */}
        <div className="border-line-card flex flex-col gap-3 pb-3 group-open:border-b md:gap-4 md:pb-4 lg:flex-row lg:items-center lg:gap-3 lg:border-b">
          {/* 360 은 번호·지표명 / 배지 / 접기 세 줄, 768 은 접기가 첫 줄에 붙어 두 줄이다 */}
          <div className="flex items-center gap-2.5 md:gap-2 lg:contents">
            <span className="shrink-0 lg:w-16">
              <span className="bg-surface-disabled text-ink-strong inline-flex h-6 items-center rounded-full px-2 text-sm font-bold md:h-6.5 md:px-3.5 lg:h-8">
                {item.no}
              </span>
            </span>
            <span className="text-ink-strong min-w-0 grow text-sm font-bold break-keep lg:text-base">
              {item.name}
            </span>
            <ToggleMark className="justify-end max-md:hidden lg:order-last lg:w-24" />
          </div>

          {/* 좁은 화면에서 배지가 한 줄에 안 들어가면 아랫줄로 내린다 */}
          <div className="flex flex-wrap items-center gap-2.5 md:gap-3 lg:contents">
            {/* 유형: 정성은 녹색, 체크는 파랑, 계량은 보라 */}
            <span className="flex shrink-0 justify-center lg:w-16">
              <Pill className={TYPE_COLOR[item.type]}>{item.type}</Pill>
            </span>
            <span className="flex shrink-0 justify-center lg:w-19">
              <Pill className="text-ink-muted ring-ink-muted ring">
                {item.target}
              </Pill>
            </span>
            <span className="flex shrink-0 justify-center lg:w-18">
              {/* 고르기 전에는 "미선택" 으로 그려진다 */}
              <GradeBadge grade={grade} />
            </span>
          </div>

          {/* 360 은 배지 줄과 접기 사이에 구분선이 한 줄 더 들어간다 */}
          <ToggleMark className="border-line-card h-7 justify-center border-t pt-3 md:hidden" />
        </div>
      </summary>

      <div className="flex flex-col gap-6 pt-5 pb-4 md:gap-4 md:px-6 md:pt-4 md:pb-6 lg:gap-10 lg:px-8 lg:pb-18">
        {/* 평가 설명 · 검토방법 */}
        <div className="bg-surface-flow flex flex-col gap-2 rounded-lg px-3 py-4 md:p-4 lg:rounded-2xl lg:px-10 lg:py-6">
          <ul className="flex flex-col gap-1">
            {item.summary.map((line) => (
              <Bullet key={line}>{line}</Bullet>
            ))}
          </ul>
          {item.formula ? (
            <p className="text-ink-body text-sm font-medium break-keep">
              {item.formula}
            </p>
          ) : null}
          {item.reviewMethods ? (
            <div className="flex flex-col gap-1">
              <p className="text-ink-body text-sm font-bold">검토방법</p>
              <ul className="flex flex-col gap-1">
                {item.reviewMethods.map((line) => (
                  <Bullet key={line}>{line}</Bullet>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        {/* 정성 지표: A~E 선택지 */}
        {item.choices ? (
          <div className="flex flex-col gap-2">
            <ul className="grid gap-x-2.5 gap-y-4 lg:grid-cols-3">
              {item.choices.map((choice) => (
                <li key={choice.grade}>
                  {/* 시안에 hover·선택 상태가 없어 이 화면의 강조 규칙을 그대로 빌려 왔다.
                  등급 기준표에서 해당 등급 열을 칠하는 surface-flow + brand-primary 조합이다. */}
                  <label className="bg-surface-panel has-[:checked]:bg-surface-flow has-[:checked]:ring-brand-primary has-[:focus-visible]:ring-brand-primary hover:ring-line-field flex h-full cursor-pointer items-center gap-2.5 rounded-md px-4 py-3 transition-colors hover:ring has-[:checked]:ring-2 has-[:focus-visible]:ring-2">
                    <input
                      type="radio"
                      name={`indicator-${item.no}`}
                      value={choice.grade}
                      onChange={() => {
                        setChoice(choice.grade)
                        onAnsweredChange(true)
                      }}
                      className="peer sr-only"
                    />
                    <span
                      aria-hidden="true"
                      className={cn(
                        "flex size-6.5 shrink-0 items-center justify-center rounded-full bg-white text-sm font-bold ring peer-checked:ring-2 peer-focus:ring-2",
                        GRADE_COLOR[choice.grade],
                        GRADE_RING[choice.grade],
                      )}
                    >
                      {choice.grade}
                    </span>
                    <span className="text-ink-strong peer-checked:text-brand-primary text-sm font-medium break-keep peer-checked:font-bold">
                      {choice.label}
                    </span>
                  </label>
                </li>
              ))}
            </ul>
            <FieldError
              show={invalidChoice}
              message="평가 항목을 선택해 주세요."
            />
          </div>
        ) : null}

        {/* 체크 지표: 항목 목록. 미체크도 E 등급이라 필수값이 아니다 */}
        {item.checks ? (
          <ul className="flex flex-col gap-4">
            {item.checks.map((check, index) => {
              const id = `indicator-${item.no}-${index + 1}`
              return (
                <li key={check.label} className="flex flex-col gap-1">
                  <div className="flex items-start gap-2.5">
                    {/* 테두리·면색은 STEP 1 동의 체크박스와 같은 값을 쓴다 */}
                    <Checkbox
                      id={id}
                      name={id}
                      onCheckedChange={(next) =>
                        setCheckedList((list) =>
                          list.map((on, at) => (at === index ? !!next : on)),
                        )
                      }
                      className="border-line-field bg-surface-card mt-0.5 shrink-0"
                    />
                    <label
                      htmlFor={id}
                      className="text-ink-strong grow cursor-pointer text-sm font-medium break-keep lg:text-base"
                    >
                      {check.label}
                      {check.help && !check.note ? (
                        <>
                          {" "}
                          <HelpButton topic={check.help} label={check.label} />
                        </>
                      ) : null}
                    </label>
                    {/* 배점 알약. PC 에만 나온다. 좁은 화면은 항목명 끝의 "(1점)" 이 대신한다.
                        다크는 같은 회색을 40% 로 낮춰 쓴다(ink-on-disabled) */}
                    {check.score ? (
                      <span className="bg-ink-on-disabled text-ink-strong hidden h-6 shrink-0 items-center rounded-full px-4 text-xs font-bold lg:inline-flex lg:h-6.5 lg:px-5">
                        {check.score}
                      </span>
                    ) : null}
                  </div>
                  {check.note ? (
                    <p className="text-ink-bullet pl-8 text-xs font-medium break-keep">
                      {check.note}
                      {check.help ? (
                        <>
                          {" "}
                          <HelpButton topic={check.help} label={check.note} />
                        </>
                      ) : null}
                    </p>
                  ) : null}
                </li>
              )
            })}
          </ul>
        ) : null}

        {/* 계산형 지표: 식 · 입력 칸 · 결과 */}
        {item.fields ? (
          <div className="flex flex-col gap-3">
            <div className="grid gap-3 md:grid-cols-2">
              {item.fields.map((field) => {
                const id = `indicator-${item.no}-${field.label}`
                return (
                  <div key={field.label} className="flex flex-col gap-2.5">
                    <label
                      htmlFor={id}
                      className="text-ink-strong text-sm font-bold break-keep lg:text-base"
                    >
                      {field.label}
                    </label>
                    <div className="border-line-field bg-surface-disabled flex h-12 items-center gap-2 rounded-md border px-4">
                      <input
                        id={id}
                        name={id}
                        readOnly
                        value={field.value}
                        className="text-ash-500 min-w-0 flex-1 truncate bg-transparent text-sm font-medium outline-hidden"
                      />
                      <span className="text-ash-500 shrink-0 text-sm font-medium">
                        {field.unit}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
            {item.result ? (
              <p className="bg-brand-progress/20 text-brand-primary rounded-lg p-4 text-center text-sm font-bold break-keep lg:rounded-2xl lg:px-10 lg:py-4 lg:text-base">
                {item.result}
              </p>
            ) : null}
          </div>
        ) : null}

        {/* 선택 개수와 등급 기준표는 시안에서 한 덩어리다. 사이에 여백이 없다.
            360 은 체크 목록 바로 아래에 붙어서 위 여백을 지운다. */}
        <div
          className={cn(
            "flex flex-col",
            item.selected && item.checks && "max-md:-mt-6",
          )}
        >
          {/* 시안이 개수를 표시하는 지표에만 붙는다. 숫자는 실제 체크 수를 따라간다. */}
          {item.selected && item.checks ? (
            <p className="text-ink-muted py-2.5 text-right text-sm font-bold">
              선택 <span className="text-brand-primary">{checkedCount}</span>/
              {item.checks.length}
            </p>
          ) : null}

          <GradeScaleTable item={item} current={grade} />
        </div>
      </div>
    </details>
  )
}

const EvaluationIndex = () => {
  // 시안은 모두 펼친 상태로 들어온다. 지표를 하나씩 접거나 버튼으로 한꺼번에 여닫는다.
  const [openMap, setOpenMap] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(ALL_KEYS.map((key) => [key, true])),
  )
  const allOpen = ALL_KEYS.every((key) => openMap[key])

  const toggleAll = () =>
    setOpenMap(Object.fromEntries(ALL_KEYS.map((key) => [key, !allOpen])))

  // 다음으로를 누른 뒤부터 오류 문구를 보여 준다. 다른 자가진단 화면과 같은 방식이다.
  const [hasTried, setHasTried] = useState(false)

  const setOpen = (no: string, open: boolean) =>
    setOpenMap((prev) => (prev[no] === open ? prev : { ...prev, [no]: open }))

  // 지표별 응답 여부. 값이 없으면 아직 응답하지 않은 것으로 본다.
  const [answered, setAnswered] = useState<Record<string, boolean>>({})
  const markAnswered = (no: string, value: boolean) =>
    setAnswered((prev) =>
      prev[no] === value ? prev : { ...prev, [no]: value },
    )

  // 오류가 난 첫 지표. 상태가 반영된 뒤 옮겨야 해서 렌더 후로 미룬다.
  const [focusTarget, setFocusTarget] = useState<string | null>(null)

  useEffect(() => {
    if (!focusTarget) return
    const row = document.getElementById(`indicator-${focusTarget}`)
    // 라디오는 sr-only 라 화면에서는 칩 테두리로 포커스가 드러난다.
    row?.querySelector<HTMLElement>('input[type="radio"]')?.focus()
    row?.scrollIntoView({ behavior: "smooth", block: "center" })
    setFocusTarget(null)
  }, [focusTarget])

  // 미응답 지표가 하나라도 있으면 오류 문구를 띄우고 전부 펼친다.
  // 어디가 비었는지 한눈에 보여 주고, 포커스는 첫 오류 지표로 옮긴다.
  const handleNext = () => {
    setHasTried(true)
    const first = REQUIRED_INDICATORS.find((item) => !answered[item.no])
    if (!first) return
    setOpenMap(Object.fromEntries(ALL_KEYS.map((key) => [key, true])))
    setFocusTarget(first.no)
  }

  return (
    <div className="flex w-full max-w-316 flex-col md:gap-10 md:px-7 md:py-10 lg:px-8">
      <StepMobileNav
        title="평가지표 작성"
        step={5}
        total={SELF_CHECK_STEPS.length}
      />

      <div className="flex flex-col gap-6 max-md:hidden lg:flex-row lg:items-center lg:justify-between lg:gap-8">
        <h2 className="text-ink-strong text-lg font-bold whitespace-nowrap md:text-3xl lg:text-4xl">
          평가지표 작성
        </h2>
        {/* Stepper 내부 ol 의 줄바꿈·폭을 밖에서 제어한다. 지우면 스테퍼가 접힌다. */}
        <div className="[&_ol]:flex-nowrap sm:w-full sm:[&_ol]:w-full sm:[&_ol>li]:flex-1 sm:[&_ol>li>div:nth-child(1)]:flex-1 sm:[&_ol>li>div:nth-child(3)]:flex-1 lg:w-172">
          <Stepper items={SELF_CHECK_STEPS} activeIndex={4} size={13} />
        </div>
      </div>

      <BaseInfo items={NOTICES} />

      <div className="flex flex-col gap-4 max-md:px-5 max-md:pt-12 max-md:pb-10">
        <div className="flex justify-end">
          <button
            type="button"
            onClick={toggleAll}
            className="border-line-field bg-surface-field text-ink-strong flex h-8 cursor-pointer items-center gap-1 rounded-md border px-3 text-sm font-bold lg:text-xs [&_svg]:size-3"
          >
            {allOpen ? (
              <Minus
                aria-hidden="true"
                strokeWidth={3}
                className="text-ink-muted"
              />
            ) : (
              <Plus
                aria-hidden="true"
                strokeWidth={3}
                className="text-ink-muted"
              />
            )}
            {allOpen ? "모두 닫기" : "모두 열기"}
          </button>
        </div>

        <div className="flex flex-col gap-9">
          {EVALUATION_SECTIONS.map((section) => (
            <section
              key={section.no}
              className="border-line-card flex flex-col gap-2 rounded-xl border px-5 py-6 md:rounded-2xl md:p-8 lg:gap-3 lg:p-10"
            >
              <h3 className="text-ink-strong text-lg font-bold md:text-2xl">
                {section.no}. {section.name}
              </h3>

              <div className="flex flex-col gap-8 lg:gap-14">
                {section.groups.map((group) => (
                  <div key={group.no} className="flex flex-col gap-4 lg:gap-8">
                    <p className="text-ink-body text-sm lg:text-base">
                      {group.no} {group.name}
                    </p>

                    {/* 360 은 지표별 카드가 없다. 섹션 카드 하나 안에서 구분선으로만 나뉜다 */}
                    <div className="border-line-card flex flex-col md:gap-3 lg:block lg:overflow-hidden lg:rounded-md lg:border">
                      {/* 표 헤더. 좁은 화면에서는 지표 헤더가 줄바꿈되어 의미가 겹치므로 감춘다 */}
                      <div className="bg-surface-disabled text-ink-muted hidden gap-3 px-8 py-2.5 text-xs font-bold lg:flex">
                        <span className="w-16 shrink-0 text-center">번호</span>
                        <span className="grow">지표명</span>
                        <span className="w-16 shrink-0 text-center">유형</span>
                        <span className="w-19 shrink-0 text-center">
                          평가대상
                        </span>
                        <span className="w-18 shrink-0 text-center">
                          예상등급
                        </span>
                        <span className="w-24 shrink-0" />
                      </div>

                      {group.indicators.map((item) => (
                        <IndicatorRow
                          key={item.no}
                          item={item}
                          open={openMap[item.no]}
                          onOpenChange={(next) => setOpen(item.no, next)}
                          showErrors={hasTried}
                          onAnsweredChange={(next) =>
                            markAnswered(item.no, next)
                          }
                          last={item.no === lastIndicatorNo(section)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}

          {/* 평가지표 작성 요약 */}
          <section className="border-line-card rounded-xl border px-5 py-6 md:rounded-2xl md:p-10">
            {/* 시안은 카드 안에 흰 패널을 한 겹 더 둔다 */}
            <details
              open={openMap[SUMMARY_KEY]}
              onToggle={(event) =>
                setOpen(SUMMARY_KEY, event.currentTarget.open)
              }
              className="group bg-surface-field rounded-md"
            >
              {/* 요약 헤더. 아래로 구분선이 하나 지나간다 */}
              <summary className="border-line-card flex cursor-pointer list-none flex-col gap-1.5 group-open:border-b group-open:pb-3 md:flex-row md:group-open:pb-6 md:flex-wrap md:items-center md:gap-x-7 md:gap-y-3 lg:flex-nowrap">
                <h3 className="text-ink-strong text-base font-bold whitespace-nowrap">
                  평가지표 작성 요약
                </h3>
                {/* 360 은 총점과 최종등급이 한 줄에 나란히 놓인다 */}
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 md:contents">
                  <p className="text-ink-strong text-lg font-bold whitespace-nowrap lg:ml-12 lg:text-xl">
                    총점{" "}
                    <span className={GRADE_COLOR[EVALUATION_FINAL_GRADE]}>
                      {EVALUATION_TOTAL_SCORE}
                    </span>{" "}
                    점
                  </p>
                  <p className="text-ink-strong flex items-center gap-2 text-lg font-bold whitespace-nowrap lg:text-xl">
                    최종등급
                    <GradeBadge grade={EVALUATION_FINAL_GRADE} variant="fill" />
                  </p>
                </div>
                <ToggleMark className="border-line-card mt-1.5 h-7 justify-center border-t pt-3 md:mt-0 md:ml-auto md:h-8 md:border-t-0 md:pt-0" />
              </summary>

              <div className="border-line-card mt-4 max-md:border-0 md:overflow-hidden md:rounded-md md:border lg:overflow-x-auto">
                {/* 768 시안은 행 구분선이 박스 좌우에서 32 씩 안으로 들어온다.
                    합계는 회색 면이 박스 끝까지 닿아야 해서 아래에서 표를 따로 그린다. */}
                <div className="md:px-8 lg:px-0">
                  <table className="w-full table-fixed border-collapse lg:min-w-132">
                    {/* 표 헤더는 PC 시안에만 있다 */}
                    <thead className="max-lg:hidden">
                      <tr className="bg-surface-disabled">
                        <th
                          scope="col"
                          className="text-ink-muted border-line-card w-1/6 border-b px-3 py-2.5 text-center text-xs font-bold"
                        >
                          평가번호
                        </th>
                        <th
                          scope="col"
                          className="text-ink-muted border-line-card border-b px-3 py-2.5 text-center text-xs font-bold"
                        >
                          평가지표명
                        </th>
                        <th
                          scope="col"
                          className="text-ink-muted border-line-card w-1/4 border-b px-3 py-2.5 text-center text-xs font-bold"
                        >
                          산정등급
                        </th>
                        <th
                          scope="col"
                          className="text-ink-muted border-line-card w-1/4 border-b px-3 py-2.5 text-center text-xs font-bold"
                        >
                          산출점수
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {EVALUATION_SUMMARY_ROWS.map((row) => (
                        <tr key={row.no} className="bg-surface-field">
                          <td className="border-line-card w-1/4 border-b px-1 py-2 text-center md:w-1/6 md:px-3 md:py-5">
                            <span className="bg-surface-disabled text-ink-strong inline-flex h-8 items-center rounded-full px-3.5 text-xs font-bold md:text-sm">
                              {row.no}
                            </span>
                          </td>
                          <td className="text-ink-body border-line-card border-b px-2 py-2 text-center text-xs font-medium break-words md:px-3 md:py-5 md:text-base lg:break-keep">
                            {row.name}
                          </td>
                          <td className="border-line-card w-1/5 border-b px-1 py-2 text-center md:w-1/12 md:px-3 md:py-5 lg:w-1/4">
                            <GradeBadge grade={row.grade} variant="circle" />
                          </td>
                          <td className="text-ink-body border-line-card w-1/6 border-b px-1 py-2 text-center text-xs font-medium md:w-1/4 md:px-3 md:py-5 md:text-base">
                            {row.score}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* 합계. 회색 면이 박스 폭을 꽉 채워야 해서 본문 표와 나눠 그린다.
                    PC 는 합계·최종등급·총점 세 칸, 768 은 최종등급·총점 두 칸이다. */}
                <table className="w-full table-fixed border-collapse max-md:hidden lg:min-w-132">
                  <tbody>
                    <tr className="bg-surface-disabled">
                      <td className="text-ink-strong hidden w-1/2 px-3 py-5 text-center text-base font-bold lg:table-cell">
                        합계
                      </td>
                      <td className="w-1/2 px-3 py-5 lg:w-1/4">
                        <span className="text-ink-strong flex items-center justify-center gap-2 text-base font-bold">
                          최종등급
                          <GradeBadge
                            grade={EVALUATION_FINAL_GRADE}
                            variant="fill"
                          />
                        </span>
                      </td>
                      <td className="w-1/2 px-3 py-5 lg:w-1/4">
                        <span className="text-ink-strong flex items-center justify-center gap-2 text-base font-bold">
                          총점 <span>{EVALUATION_TOTAL_SCORE} 점</span>
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* 360 은 합계가 표에서 떨어진 별도 회색 박스다. 이름표 아래에 값이 놓인다.
                  시안은 위쪽 모서리만 각지고 아래쪽만 둥글다. */}
              <div className="bg-surface-disabled mt-4 flex rounded-b-md md:hidden">
                <div className="text-ink-strong flex flex-1 flex-col items-center gap-2 py-5 text-sm font-bold">
                  최종등급
                  <GradeBadge grade={EVALUATION_FINAL_GRADE} />
                </div>
                <div className="text-ink-strong flex flex-1 flex-col items-center gap-2 py-5 text-sm font-bold">
                  총점
                  <span className="text-base">
                    {EVALUATION_TOTAL_SCORE}{" "}
                    <span className="text-ink-hint">점</span>
                  </span>
                </div>
              </div>
            </details>
          </section>

          <div className="flex items-center justify-between gap-2 md:gap-3">
            <Button
              type="button"
              variant="outline"
              className="h-11 flex-1 rounded-lg text-sm font-bold md:h-13 md:w-42 md:flex-none"
            >
              <ArrowLeft aria-hidden="true" />
              이전으로
            </Button>
            <Button
              type="button"
              onClick={handleNext}
              className="h-11 flex-1 rounded-lg text-sm font-bold md:h-13 md:w-42 md:flex-none"
            >
              다음으로
              <ArrowRight aria-hidden="true" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EvaluationIndex
