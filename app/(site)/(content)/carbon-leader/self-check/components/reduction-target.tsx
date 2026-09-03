"use client"

import { useMemo, useState } from "react"

import { ArrowLeft, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Stepper } from "@/components/ui/stepper"
import BaseInfo from "@/app/(site)/(content)/carbon-leader/self-check/components/base-info"
import StepMobileNav from "@/app/(site)/(content)/carbon-leader/self-check/components/step-mobile-nav"
import { SELF_CHECK_STEPS } from "@/constants/carbon-leader-self-check-steps"
import {
  BASE_YEAR_EMISSION,
  EXPECTED_EFFECT_ROWS,
  EXPECTED_REDUCTION,
  PLAN_VERDICT,
  REDUCTION_RATES,
  type PlanVerdict,
} from "@/constants/carbon-leader-reduction-target"
import { cn } from "@/lib/utils"

// 자가진단 STEP 4 감축목표 설정.
// 계획 적정성 판정에 따라 화면이 셋이라 verdict 프롭으로 나눈다.
// 표시 값은 전부 고정 문구다. constants/carbon-leader-reduction-target 참고.

const NOTICES = [
  "이전 단계에서 산정된 감축사업 기대효과를 확인하고, 탄소중립 감축 목표 및 이행계획의 적정성을 산정합니다.",
]

const YEAR_HEADS = ["1차 이행년도", "2차 이행년도", "3차 이행년도(최종)"]

/** 감축사업 기대효과 칸 이름. 사업 번호와 연도 자리로 만든다 */
const effectName = (no: number, index: number) => `effect-${no}-${index}`

/** 표에 세우는 숫자. 콤마를 뺀 뒤 더하고 소수 둘째 자리로 맞춘다 */
const toAmount = (text: string) => Number(text.replace(/,/g, "")) || 0
const formatAmount = (value: number) =>
  value.toLocaleString("ko-KR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

/** 라벨·입력·힌트 한 벌. 간격이 서로 달라 두 겹으로 쌓는다. */
const Field = ({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string
  htmlFor?: string
  hint: string
  children: React.ReactNode
}) => (
  <div className="flex min-w-0 flex-col gap-2.5">
    {htmlFor ? (
      <Label
        htmlFor={htmlFor}
        className="text-ink-strong text-base leading-6 font-bold"
      >
        {label}
      </Label>
    ) : (
      <span className="text-ink-strong text-base leading-6 font-bold">
        {label}
      </span>
    )}
    <div className="flex flex-col gap-1.5">
      {children}
      <p className="text-ink-hint text-xs font-normal break-keep lg:font-medium">
        {hint}
      </p>
    </div>
  </div>
)

// 자동 산정 칸. 사용자가 고치지 못할 뿐 값은 넘어가야 하므로 disabled 가 아니라
// readOnly 다. disabled 로 두면 폼 전송에서 빠지고 포커스·복사도 막힌다.
const ReadOnlyBox = ({
  id,
  value,
  unit,
  placeholder,
  className,
  boxClassName,
}: {
  id: string
  value: string
  unit?: string
  /** 값이 아직 없을 때 옅게 비춰 줄 글자 */
  placeholder?: string
  /** 표 안에서는 글자만 다르게 둘 때 쓴다 */
  className?: string
  /** 좁은 칸에서 좌우 여백을 줄일 때 쓴다 */
  boxClassName?: string
}) => (
  <div
    className={cn(
      "border-line-field bg-surface-disabled flex h-12 items-center gap-2 rounded-md border px-4",
      boxClassName,
    )}
  >
    <input
      id={id}
      name={id}
      readOnly
      tabIndex={-1}
      placeholder={placeholder}
      value={value}
      className={cn(
        "text-ash-500 min-w-0 flex-1 bg-transparent text-sm font-medium outline-hidden",
        className,
      )}
    />
    {unit ? (
      <span className="text-ash-500 shrink-0 text-sm font-medium">{unit}</span>
    ) : null}
  </div>
)

const ReductionTarget = ({
  verdict = "none",
}: {
  /** 계획 적정성 판정. 화면 셋과 1:1로 대응한다 */
  verdict?: PlanVerdict
}) => {
  // 감축율을 바꿔도 아래 값은 따라 바뀌지 않는다. 연동은 개발에서 붙인다.
  const preset = PLAN_VERDICT[verdict]

  // 감축사업 기대효과 표의 입력값. 처음에는 비어 있고 사용자가 채운다.
  const [effect, setEffect] = useState<Record<string, string>>({})

  const putEffect = (name: string, value: string) =>
    setEffect((prev) => ({ ...prev, [name]: value }))

  // 합계는 칸을 고칠 때마다 열별로 다시 더한다.
  // 그 열이 통째로 비어 있으면 계산된 0 과 헷갈리지 않게 빈 칸으로 둔다.
  const effectTotals = useMemo(
    () =>
      YEAR_HEADS.map((_, index) => {
        const filled = EXPECTED_EFFECT_ROWS.some((row) =>
          (effect[effectName(row.no, index)] ?? "").trim(),
        )
        if (!filled) return ""
        return formatAmount(
          EXPECTED_EFFECT_ROWS.reduce(
            (sum, row) =>
              sum + toAmount(effect[effectName(row.no, index)] ?? ""),
            0,
          ),
        )
      }),
    [effect],
  )

  return (
    <div className="flex w-full max-w-[1344px] flex-col md:gap-10 md:px-7 md:py-10 lg:px-8">
      <StepMobileNav
        title="감축목표 설정"
        step={4}
        total={SELF_CHECK_STEPS.length}
      />

      <div className="flex flex-col gap-6 max-md:hidden lg:flex-row lg:items-center lg:justify-between lg:gap-8">
        <h2 className="text-ink-strong text-lg font-bold whitespace-nowrap md:text-3xl lg:text-4xl">
          감축목표 설정
        </h2>
        {/* Stepper 내부 ol 의 줄바꿈·폭을 밖에서 제어한다. 지우면 스테퍼가 접힌다. */}
        <div className="[&_ol]:flex-nowrap sm:w-full sm:[&_ol]:w-full sm:[&_ol>li]:flex-1 sm:[&_ol>li>div:nth-child(1)]:flex-1 sm:[&_ol>li>div:nth-child(3)]:flex-1 lg:w-[730px]">
          <Stepper items={SELF_CHECK_STEPS} activeIndex={3} size={13} />
        </div>
      </div>

      <BaseInfo items={NOTICES} />

      <div className="flex flex-col gap-9 max-md:px-5 max-md:pt-12 max-md:pb-10">
        <section className="border-line-card flex flex-col gap-4 rounded-xl border p-5 md:rounded-2xl md:p-8 lg:gap-6 lg:p-10">
          <div className="flex flex-col gap-2">
            <h3 className="text-ink-strong text-lg font-bold md:text-xl lg:text-2xl">
              (1) 감축사업 기대효과
            </h3>
            <p className="text-ink-body text-sm wrap-break-word lg:text-base">
              감축잠재량 산정 단계에서 입력된 감축사업별 연도별 감축실적입니다.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-ink-body text-right text-xs md:text-sm">
              (단위: tCO₂eq)
            </p>

            {/*
              표 한 벌로 모든 해상도를 그린다.
              768 이상은 5열 표, 그 아래는 tr 을 격자로 바꿔 사업마다 카드로 쌓는다.
              카드용 마크업을 따로 두면 입력이 두 벌이 되어 같은 name 이 겹친다.
            */}
            <div className="border-line-field border-t-ink-strong border-t border-b max-md:border-0">
              <table className="w-full table-fixed border-collapse max-md:block">
                <thead className="max-md:hidden">
                  <tr className="bg-surface-disabled">
                    <th
                      scope="col"
                      /*
                        table-fixed 는 첫 줄에 적은 폭만 보고 min-w 는 무시한다.
                        6% 만 두면 좁은 화면에서 열이 글자보다 좁아져 번호가 칸을 넘치므로
                        1024 아래에서는 비율을 올려 네 자리까지 담는다.
                      */
                      className="text-ink-body border-line-field w-[6%] border-r border-b px-2 py-4 text-center text-sm font-bold whitespace-nowrap max-lg:w-[10%] lg:text-base"
                    >
                      번호
                    </th>
                    <th
                      scope="col"
                      // 번호 열을 넓힌 만큼 여기서 덜어 연도 열 폭을 지킨다. 이름은 두 줄로 감긴다
                      className="text-ink-body border-line-field w-[48%] border-r border-b px-4 py-4 text-center text-sm font-bold max-lg:w-[42%] lg:w-[36%] lg:text-base"
                    >
                      사업
                    </th>
                    {YEAR_HEADS.map((head, index) => (
                      <th
                        key={head}
                        scope="col"
                        className={cn(
                          "text-ink-body border-line-field border-b px-2 py-4 text-center text-sm font-bold break-keep lg:text-base",
                          index < YEAR_HEADS.length - 1 && "border-r",
                        )}
                      >
                        {head}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="max-md:block">
                  {EXPECTED_EFFECT_ROWS.map((row) => (
                    <tr
                      key={row.no}
                      className="bg-surface-field max-md:border-line-field max-md:border-t-ink-strong max-md:mb-2 max-md:grid max-md:grid-cols-3 max-md:border-t max-md:border-b"
                    >
                      {/* 모바일 카드 머리. 표에서는 열이 아니라 감춘다 */}
                      <td className="bg-surface-disabled text-ink-body border-line-field border-b px-3 py-2 text-center text-xs font-bold max-md:col-span-3 md:hidden">
                        사업
                      </td>
                      <td className="text-ink-body border-line-field border-r border-b px-2 py-6 text-center text-sm whitespace-nowrap max-md:hidden lg:text-base lg:font-medium">
                        {row.no}
                      </td>
                      <td className="text-ink-body border-line-field border-b text-center break-keep max-md:col-span-3 max-md:px-3 max-md:py-5 max-md:text-xs md:border-r md:px-4 md:py-6 md:text-sm lg:text-base lg:font-medium">
                        {row.name}
                      </td>
                      {/* 모바일 카드의 연도 머리. 표에서는 thead 가 대신한다 */}
                      {YEAR_HEADS.map((head, index) => (
                        <td
                          key={`head-${head}`}
                          className={cn(
                            // 카드일 때 이 줄 높이는 52 다. 테두리가 높이 안에 들어가므로 한 칸 더 준다
                            "bg-surface-disabled text-ink-body border-line-field flex h-12.25 items-center justify-center border-b px-2 text-center text-xs font-bold break-keep md:hidden",
                            index < YEAR_HEADS.length - 1 && "border-r",
                          )}
                        >
                          {head}
                        </td>
                      ))}
                      {YEAR_HEADS.map((_, index) => (
                        <td
                          key={YEAR_HEADS[index]}
                          className={cn(
                            "border-line-field px-3 py-4 max-md:border-0 max-md:px-1 max-md:py-2 md:border-b md:max-lg:px-1",
                            index < YEAR_HEADS.length - 1 && "md:border-r",
                            index === 0 && "max-md:pl-2",
                            index === YEAR_HEADS.length - 1 && "max-md:pr-2",
                          )}
                        >
                          <Input
                            name={effectName(row.no, index)}
                            inputMode="decimal"
                            placeholder="0"
                            aria-label={`${row.name} ${YEAR_HEADS[index]}`}
                            value={effect[effectName(row.no, index)] ?? ""}
                            onChange={(event) =>
                              putEffect(
                                effectName(row.no, index),
                                event.target.value,
                              )
                            }
                            // 1024 아래는 칸이 좁다. 99,999.00 까지 잘리지 않게 글자와 여백을 줄인다
                            className="border-line-field bg-surface-field text-ink-strong placeholder:text-ink-placeholder max-lg:px-2 max-lg:text-xs"
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                  <tr className="bg-surface-flow max-md:border-line-field max-md:border-t-ink-strong max-md:grid max-md:grid-cols-3 max-md:border-t max-md:border-b">
                    <td
                      colSpan={2}
                      // 모바일에서는 사업 카드처럼 「합계」를 머리 줄로 뺀다
                      className="text-ink-body border-line-field text-center font-bold max-md:col-span-3 max-md:border-b max-md:px-3 max-md:py-2 max-md:text-xs md:px-4 md:py-6 md:text-base"
                    >
                      합계
                    </td>
                    {effectTotals.map((value, index) => (
                      <td
                        key={YEAR_HEADS[index]}
                        className={cn(
                          "px-3 py-4 max-md:px-1 max-md:py-2 md:max-lg:px-1",
                          index === 0 && "max-md:pl-2",
                          index === YEAR_HEADS.length - 1 && "max-md:pr-2",
                        )}
                      >
                        <ReadOnlyBox
                          id={`effect-total-${index}`}
                          value={value}
                          placeholder="0"
                          className="font-bold max-lg:text-xs"
                          // 합계는 세 줄을 더한 값이라 한 자리 더 길어질 수 있다
                          boxClassName="max-lg:px-2 max-md:px-1.5"
                        />
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="border-line-card flex flex-col gap-6 rounded-xl border p-5 md:rounded-2xl md:p-8 lg:gap-14 lg:p-10">
          <div className="flex flex-col gap-2">
            <h3 className="text-ink-strong text-lg font-bold md:text-xl lg:text-2xl">
              (2) 목표 설정
            </h3>
            <p className="text-ink-body text-sm break-keep lg:text-base">
              기준연도 배출량을 토대로 탄소중립 목표를 설정하고 이행계획의
              적정성을 확인합니다.
            </p>
          </div>

          <div className="flex flex-col gap-4 lg:gap-8">
            <h4 className="text-ink-strong text-lg leading-7 font-bold md:text-xl md:leading-8">
              탄소중립 목표설정
            </h4>
            <div className="grid gap-3 lg:grid-cols-3 lg:gap-14">
              <Field
                label="기준연도 배출량"
                htmlFor="reduction-target-base-emission"
                hint="3개년 Scope 1+2 총배출량 평균 (자동 산정)"
              >
                <ReadOnlyBox
                  id="reduction-target-base-emission"
                  value={BASE_YEAR_EMISSION}
                  unit="tCO₂eq"
                />
              </Field>

              <Field
                label="감축율"
                htmlFor="reduction-target-rate"
                hint="기준연도 대비 온실가스 감축 목표율"
              >
                <Select
                  name="reduction-target-rate"
                  defaultValue={preset.rate || undefined}
                >
                  <SelectTrigger
                    id="reduction-target-rate"
                    className="border-line-field bg-surface-field text-ink-strong w-full rounded-md text-sm font-medium data-[size=default]:h-12"
                  >
                    <SelectValue placeholder="선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {REDUCTION_RATES.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field
                label="목표 감축량"
                htmlFor="reduction-target-goal"
                hint="기준연도 배출량 × 감축율 (자동 계산)"
              >
                <ReadOnlyBox
                  id="reduction-target-goal"
                  value={preset.targetReduction}
                  unit="tCO₂eq"
                />
              </Field>
            </div>
          </div>

          <div className="flex flex-col gap-4 lg:gap-8">
            <h4 className="text-ink-strong text-lg leading-7 font-bold md:text-xl md:leading-8">
              탄소중립 이행계획
            </h4>
            <div className="grid gap-3 lg:grid-cols-2 lg:gap-14">
              <Field
                label="예상 감축량"
                htmlFor="reduction-target-expected"
                hint="감축사업 3차 이행년도 실적 합계 (자동 산정)"
              >
                <ReadOnlyBox
                  id="reduction-target-expected"
                  value={EXPECTED_REDUCTION}
                  unit="tCO₂eq"
                />
              </Field>

              <Field
                label="계획 적정성"
                hint="예상 감축량 ≥ 목표 감축량이면 적정, 미만이면 부적정"
              >
                {/* 판정은 입력이 아니라 표시라 상자로만 그린다 */}
                <p
                  className={cn(
                    "flex h-12 items-center gap-3 rounded-md px-4 text-base font-bold",
                    verdict === "none" && "bg-line-divider text-ink-hint",
                    verdict === "fit" && "bg-surface-info text-brand-info",
                    verdict === "unfit" && "bg-surface-error text-destructive",
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "size-2 shrink-0 rounded-full",
                      verdict === "none" ? "bg-ash-500" : "bg-current",
                    )}
                  />
                  {preset.label}
                </p>
              </Field>
            </div>
          </div>
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
            disabled={verdict === "none"}
            className="disabled:bg-fill-disabled disabled:text-ink-on-disabled h-11 flex-1 rounded-lg text-sm font-bold disabled:opacity-100 md:h-13 md:w-42 md:flex-none"
          >
            다음으로
            <ArrowRight aria-hidden="true" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ReductionTarget
