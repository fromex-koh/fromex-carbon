"use client"

import { Fragment, type ChangeEvent, type ReactNode } from "react"
import { ChevronRight } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { withThousandsComma } from "@/util/format-number"
import {
  REQUIRED_MAJOR_NOTES,
  type EmissionLeaf,
} from "@/constants/carbon-leader-self-check-emission-items"

// [인벤토리 추가] 로 항목을 고른 뒤 나타나는 "선택 항목별 값 입력" 카드.
// 연도·단위·세부 입력 필드는 실제로는 항목별 배출계수 정보와 함께 API 로 내려온다.
// 지금은 3개년 고정 + 하폐수 세부 입력만 정적으로 두었다.

const YEARS = ["2019년", "2020년", "2021년"]

const handleNumberInput = (event: ChangeEvent<HTMLInputElement>) => {
  event.target.value = withThousandsComma(event.target.value, {
    decimal: true,
  })
}

// 하폐수(하수·폐수)는 소분류 하나가 세부 입력표를 갖는다. 항목·단위는 API 값으로 교체한다.
const WASTE_WATER_FIELDS: { label: string; unit: string }[] = [
  { label: "처리 유형", unit: "select" },
  { label: "유입수 유량", unit: "m³" },
  { label: "유입수 BOD 농도", unit: "mg-BOD/L" },
  { label: "유입수 총 질소 농도", unit: "mg-T-N/L" },
  { label: "방류수 유량", unit: "m³" },
  { label: "방류수 BOD 농도", unit: "mg-BOD/L" },
  { label: "방류수 총 질소 농도", unit: "mg-T-N/L" },
  { label: "슬러지 반출량", unit: "m³" },
  { label: "슬러지 BOD 농도", unit: "mg-BOD/L" },
  { label: "슬러지 총 질소 농도", unit: "mg-T-N/L" },
]

const TREATMENT_TYPES = ["혐기성", "비혐기성"]

// 연도별 총배출량. 실제 값은 입력값 × 배출계수로 서버에서 계산된다.
const TOTALS = [
  { year: "2019년", value: "170.75" },
  { year: "2020년", value: "1,596.00" },
  { year: "2021년", value: "1,460.75" },
]

const SCOPE_SUMMARY = [
  { label: "Scope 1:", value: "3,227.50 kg" },
  { label: "Scope2:", value: "-" },
  { label: "Scope 3:", value: "구조입력" },
]

// 단위가 따로 정해진 항목("기타(선택)" 은 "-")만 예외로 두고 나머지는 kg 이다.
// 실제로는 항목별 배출계수와 함께 API 로 내려온다.
const UNIT_BY_NAME: Record<string, string> = { "기타(선택)": "-" }

const unitOf = (leaf: EmissionLeaf) => UNIT_BY_NAME[leaf.name] ?? "kg"

const isWasteWater = (leaf: EmissionLeaf) =>
  leaf.major === "폐기물 처리" && leaf.mid === "하폐수"

/** 선택항목 열: Scope 배지 + 대분류 › 중분류 › 소분류 */
const ItemPath = ({ leaf }: { leaf: EmissionLeaf }) => (
  <div className="flex shrink-0 flex-col gap-2 xl:w-66 xl:gap-2.5">
    <span className="bg-ash-800 text-background w-fit rounded-full px-5 py-1 text-xs font-bold lg:py-1.5">
      {leaf.scope}
    </span>
    <p className="flex flex-wrap items-center gap-1 text-base font-bold break-all">
      {[leaf.major, leaf.mid || "-", leaf.name].map((step, index, steps) => (
        <span key={step + index} className="flex items-center gap-1">
          {index > 0 && (
            <ChevronRight
              aria-hidden="true"
              className="text-ash-500 size-3 shrink-0"
            />
          )}
          <span className={cn(index === steps.length - 1 && "text-primary")}>
            {step}
          </span>
        </span>
      ))}
    </p>
  </div>
)

/** 숫자 + 단위 한 칸. 단위는 필요한 만큼만 차지하고 남는 폭을 입력칸이 가져간다. */
const NumberField = ({
  unit,
  label,
  name,
}: {
  unit: string
  label: string
  name: string
}) => (
  <div className="border-input focus-within:ring-ash-600 flex h-12 w-full items-center gap-1 rounded-md border px-4 focus-within:ring-2 md:px-2 lg:px-4">
    <Input
      type="text"
      inputMode="numeric"
      placeholder="0"
      id={name}
      name={name}
      aria-label={label}
      onChange={handleNumberInput}
      className="h-auto w-full min-w-8 flex-1 rounded-none border-0 p-0 text-sm placeholder:font-medium hover:ring-0 focus-visible:ring-0"
    />
    {/* 단위가 사라지지 않도록 최소 폭을 주고, 짧은 단위는 예외로 둬 숫자 자리를 살린다. */}
    <span
      title={unit}
      className={cn(
        "text-ash-800 max-w-16 shrink truncate text-sm",
        unit.length > 3 ? "min-w-11" : "min-w-0",
      )}
    >
      {unit}
    </span>
  </div>
)

/** 연도별 입력 칸 한 개 */
const YearField = ({
  year,
  unit,
  name,
}: {
  year: string
  unit: string
  name: string
}) => (
  <div className="flex min-w-0 flex-1 flex-col gap-1.5">
    <span className="text-ash-700 text-xs font-bold md:text-foreground md:text-sm md:font-medium">
      {year}
    </span>
    <NumberField unit={unit} label={`${year} 사용량`} name={name} />
  </div>
)

/** 하폐수 세부 입력표 */
const WasteWaterTable = ({ leafId }: { leafId: string }) => (
  <div className="bg-background w-full md:border-border md:overflow-hidden md:rounded-md md:border">
    <div className="bg-ash-200 text-ash-700 flex gap-8 px-5 py-2.5 text-xs font-bold max-md:hidden md:px-8 lg:px-12">
      <span className="shrink-0 md:w-26 lg:w-31">세부분류</span>
      <div className="flex flex-1 gap-2.5 max-md:hidden">
        {YEARS.map((year) => (
          <span key={year} className="flex-1 text-center">
            {year}
          </span>
        ))}
      </div>
    </div>

    <ul className="flex flex-col gap-2.5 px-0 py-0 md:px-8 md:py-6 lg:px-12 lg:py-8">
      {WASTE_WATER_FIELDS.map((field) => (
        <li
          key={field.label}
          className="flex flex-col gap-2 md:flex-row md:items-center md:gap-8"
        >
          <span className="text-base font-bold break-all md:w-26 md:shrink-0 md:text-sm lg:w-31 lg:text-base">
            {field.label}
          </span>
          <div className="flex min-w-0 flex-1 flex-col gap-2.5 md:flex-row">
            {YEARS.map((year) =>
              field.unit === "select" ? (
                <div
                  key={year}
                  className="flex min-w-0 flex-1 flex-col gap-1.5"
                >
                  <span className="text-ash-700 text-xs font-bold md:hidden">
                    {year}
                  </span>
                  <Select
                    name={`${leafId}|${field.label}|${year}`}
                    defaultValue={TREATMENT_TYPES[0]}
                  >
                    <SelectTrigger
                      aria-label={`${year} ${field.label}`}
                      className="border-input h-12 w-full rounded-md px-3 text-sm shadow-none lg:px-4"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-background">
                      {TREATMENT_TYPES.map((type) => (
                        <SelectItem
                          key={type}
                          value={type}
                          className="bg-background hover:bg-accent hover:text-accent-foreground"
                        >
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <div
                  key={year}
                  className="flex min-w-0 flex-1 flex-col gap-1.5"
                >
                  <span className="text-ash-700 text-xs font-bold md:hidden">
                    {year}
                  </span>
                  <NumberField
                    unit={field.unit}
                    label={`${year} ${field.label}`}
                    name={`${leafId}|${field.label}|${year}`}
                  />
                </div>
              ),
            )}
          </div>
        </li>
      ))}
    </ul>
  </div>
)

interface EmissionInputProps {
  /** 모달에서 고른 소분류 항목 */
  leaves: EmissionLeaf[]
  /** 카드 우측 상단 [인벤토리 추가] 자리 — 항목 선택 모달 트리거 */
  addButton: ReactNode
}

const EmissionInput = ({ leaves, addButton }: EmissionInputProps) => {
  // 필수 대분류인데 아직 고른 항목이 없으면 안내 줄을 먼저 노출한다.
  const missing = REQUIRED_MAJOR_NOTES.filter(
    (note) => !leaves.some((leaf) => leaf.major === note.major),
  )

  return (
    <section className="border-border flex flex-col gap-6 rounded-xl border p-5 md:rounded-2xl md:p-8 lg:gap-14 lg:p-10">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-8">
        <div className="flex flex-col gap-2 lg:gap-3">
          <h3 className="text-lg font-bold break-all md:text-xl">
            선택 항목별 값 입력
          </h3>
          <p className="text-ash-800 text-base break-all">
            선택한 배출 항목·연도별 입력값·산정 배출량을 확인할 수 있습니다.
          </p>
        </div>
        <div className="[&_button]:w-full md:shrink-0 md:[&_button]:w-auto md:[&_button]:min-w-29 md:[&_button]:px-6 lg:[&_button]:min-w-47 lg:[&_button]:px-12">
          {addButton}
        </div>
      </header>

      <div className="flex flex-col">
        <div className="bg-ash-200 text-ash-700 flex gap-10 px-8 py-2.5 text-xs font-bold max-xl:hidden">
          <span className="w-66 shrink-0">선택항목</span>
          <span className="flex-1 text-center">입력(연도별 사용량⋅활동량)</span>
        </div>

        {missing.map((note) => (
          <div
            key={note.major}
            className="bg-forest-light/10 flex flex-col gap-3 rounded-md px-5 py-6 xl:flex-row xl:items-center xl:gap-10 xl:px-8 xl:py-5"
          >
            <div className="flex shrink-0 flex-col gap-2 xl:w-66 xl:gap-2.5">
              <div className="flex items-center gap-2">
                <span className="bg-ash-800 text-background rounded-full px-5 py-1 text-xs font-bold lg:py-1.5">
                  {note.scope}
                </span>
                <Badge
                  variant="forest"
                  className="px-3 py-0.5 text-xs font-bold"
                >
                  필수
                </Badge>
              </div>
              <p className="text-primary text-base font-bold break-all">
                {note.major}
              </p>
            </div>
            <p className="text-forest-dark flex-1 text-sm leading-tight font-bold break-all md:leading-normal">
              {note.message}
            </p>
          </div>
        ))}

        {leaves.map((leaf) => (
          <div
            key={leaf.id}
            className="flex flex-col gap-2.5 px-5 py-6 md:gap-6 xl:flex-row xl:items-start xl:gap-10 xl:px-8 xl:py-5"
          >
            <ItemPath leaf={leaf} />

            {isWasteWater(leaf) ? (
              <WasteWaterTable leafId={leaf.id} />
            ) : (
              <div className="flex min-w-0 flex-1 flex-col gap-3 md:flex-row">
                {YEARS.map((year) => (
                  <YearField
                    key={year}
                    year={year}
                    unit={unitOf(leaf)}
                    name={`${leaf.id}|${year}`}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="bg-sky-blue-light flex flex-col items-center gap-8 rounded-md px-5 py-8 lg:gap-10 lg:p-10">
        <h4 className="text-lg font-bold break-all md:text-xl">
          온실가스 총배출량
        </h4>

        <ul className="flex w-full flex-col gap-5 md:flex-row md:flex-wrap md:items-center md:justify-center md:gap-8 lg:gap-15">
          {TOTALS.map((total, index) => (
            <Fragment key={total.year}>
              {index > 0 && (
                <li
                  aria-hidden="true"
                  className="bg-sky-blue h-px w-10 self-center md:h-10 md:w-px"
                />
              )}
              <li className="flex min-w-0 flex-col items-center gap-2 md:flex-1">
                <span className="bg-ash-100 text-ash-800 rounded-full px-4 py-1.5 text-xs font-bold">
                  {total.year}
                </span>
                <p className="text-primary flex max-w-full flex-col items-center text-xl font-bold md:text-2xl lg:flex-row lg:flex-wrap lg:items-baseline lg:justify-center lg:gap-x-1">
                  {total.value}
                  <span className="text-ash-700 text-xs font-normal">
                    kgCO₂eq
                  </span>
                </p>
              </li>
            </Fragment>
          ))}
        </ul>

        <div className="bg-background w-full rounded-md px-5 py-4 text-sm break-all">
          <div className="mx-auto flex w-fit flex-col gap-x-6 gap-y-2 md:w-full md:flex-row md:flex-wrap md:items-center md:justify-center">
            {SCOPE_SUMMARY.map((item) => (
              <span key={item.label} className="flex items-baseline gap-2">
                <span className="font-normal">{item.label}</span>
                <span className="font-bold">{item.value}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default EmissionInput
