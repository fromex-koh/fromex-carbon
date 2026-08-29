"use client"

import { ChevronDown, ChevronUp } from "lucide-react"

import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import {
  FUEL_OPTIONS,
  type MethodologySchema,
  type SchemaRow,
} from "@/constants/carbon-leader-reduction-schema"

/** 제품수명 입력을 담는 키 */
const LIFETIME_KEY = "life"
/** 연료 선택값을 담는 키 */
const fuelCellKey = (cellRef: string) => `dd:${cellRef}`
/** 데이터 근거 출처 입력을 담는 키 */
const basisCellKey = (key: string) => `src:${key}`

// ③ 상세 입력 · ④ 결과. 표 구성은 시안(case1~4), 계산은 기획 사이트를 따른다.

// 시안 라이트/다크 대조: 표 배경 #fff/#111 · 테두리 #eee/#222 · 헤더 #f3f3f3/#222
// 헤더 글자와 placeholder 는 두 모드의 값이 서로 달라 dark: 로 한 번 더 지정한다.
// 모바일 시안은 표 박스 없이 항목만 쌓인다.
const boxClass =
  "md:border-line-card md:bg-surface-field md:overflow-hidden md:rounded-md md:border"
const headClass =
  "bg-ash-200 text-ink-muted dark:text-ink-placeholder hidden gap-2 px-6 py-2.5 text-xs font-bold md:grid"
const cellClass =
  "border-line-field bg-surface-field text-ink-strong placeholder:text-ink-placeholder h-13 rounded-md border text-sm"
// 숫자 칸 placeholder 는 다크에서만 밝다(시안 #d2d2d2). 출처 입력은 #666 그대로.
const numCellClass = cn(cellClass, "dark:placeholder:text-ink-muted")
const rowClass = "grid items-center gap-2"
const labelClass = "text-ink-strong text-sm font-bold break-keep md:text-base"
const YEAR_LABELS = ["1차년도", "2차년도", "3차년도"]
// ④ 표는 시안 기준 헤더 38 · 행 62 이고, 행 구분선은 좌우 여백만큼 안쪽으로 들어온다.
const resultHeadClass =
  "bg-ash-200 text-ink-muted dark:text-ink-placeholder hidden gap-2 px-7 py-2.5 text-center text-xs font-bold md:grid"
const resultRowClass = "grid items-center gap-2 py-2"
// 시안의 읽기 전용 칸(고정 연료·연료표에서 채워지는 값)
const readOnlyCellClass =
  "border-line-field bg-ash-200 text-ash-500 h-13 rounded-md border text-sm"
// 시안 ④ 표 안쪽 여백: 태블릿 24/16 · PC 28/32
const resultBodyClass = "flex flex-col md:px-6 md:py-4 lg:px-7 lg:py-8"

/** 계산으로 채워지는 칸에 보여줄 숫자. 소수는 네 자리까지만 남긴다. */
const formatCell = (value: number) => {
  if (!Number.isFinite(value)) return ""
  const rounded = Math.round(value * 10000) / 10000
  return rounded.toLocaleString("ko-KR", { maximumFractionDigits: 4 })
}

/** 모바일에서만 보이는 개선전·개선후 라벨. 시안은 칸마다 라벨이 붙는다. */
const ColumnLabel = ({
  side,
  single,
}: {
  side: "Before" | "After"
  single?: boolean
}) => (
  <span
    className={cn(
      "text-xs font-bold md:hidden",
      side === "After" && !single ? "text-brand-primary" : "text-ink-muted",
    )}
  >
    {single ? "값 입력" : side === "Before" ? "개선전" : "개선후"}
  </span>
)

/** ④ 표의 값 칸. 시안은 입력 상자가 아니라 값·단위를 두 줄로 적은 표다. */
const ResultCell = ({
  value,
  unit,
  head,
  accent,
}: {
  value?: string
  unit?: string
  /** 모바일에서 값 위에 붙는 칸 이름 */
  head?: string
  accent?: boolean
}) => {
  const text = (value || "").trim()
  const valid = text !== "" && text !== "-"
  return (
    <div className="text-ink-body flex flex-col items-center justify-center text-center text-sm md:text-base">
      {head ? (
        <span
          className={cn(
            "mb-1 text-xs font-bold md:hidden",
            accent ? "text-brand-primary" : "text-ink-muted",
          )}
        >
          {head}
        </span>
      ) : null}
      {valid ? (
        <>
          <span>{text}</span>
          {unit ? <span className="text-ink-body text-xs">{unit}</span> : null}
        </>
      ) : (
        "-"
      )}
    </div>
  )
}

/** ④ 표 한 벌. 모바일은 항목마다 미니 표로, 태블릿 이상은 한 장의 표로 그린다. */
const ResultTable = ({
  heads,
  cols,
  rows,
}: {
  heads: { label: string; accent?: boolean }[]
  /** 태블릿 이상에서 쓰는 그리드 컬럼 */
  cols: string
  rows: { label?: string; unit?: string; values: (string | undefined)[] }[]
}) => {
  // 모바일 미니 표는 값 칸 수만큼 균등 분할한다.
  const miniCols = heads.length === 3 ? "grid-cols-3" : "grid-cols-2"
  return (
    <div className={boxClass}>
      <div className={cn(resultHeadClass, cols)}>
        <span>구분</span>
        {heads.map((head) => (
          <span
            key={head.label}
            className={cn(head.accent && "text-brand-primary")}
          >
            {head.label}
          </span>
        ))}
      </div>
      <div className={resultBodyClass}>
        {rows.map((row, index) => (
          <div
            key={row.label}
            className={cn(
              "flex flex-col gap-3 md:grid md:items-center md:gap-2 md:py-2",
              cols,
              index < rows.length - 1 &&
                "mb-3 md:mb-4 md:border-b md:border-line-card",
            )}
          >
            {/* 모바일: 라벨 왼쪽 · 단위 오른쪽 */}
            <div className="flex items-baseline justify-between gap-2 md:block">
              <span className={labelClass}>{row.label}</span>
              {row.unit ? (
                <span className="text-ash-500 text-xs md:block md:text-xs">
                  ({row.unit})
                </span>
              ) : null}
            </div>

            {/* 모바일 전용 미니 표 */}
            {/* 시안 미니 표는 모서리 각지고, 바깥 #eeeeee · 값 칸 #d2d2d2 테두리 */}
            <div className="border-line-card border md:hidden">
              <div className={cn("bg-ash-200 grid", miniCols)}>
                {heads.map((head) => (
                  <span
                    key={head.label}
                    className={cn(
                      "text-ink-muted py-1.5 text-center text-xs font-bold",
                      head.accent && "text-brand-primary",
                    )}
                  >
                    {head.label}
                  </span>
                ))}
              </div>
              {/* 시안의 값 칸은 테두리 없이 배경만 있다(스트로크가 숨김 처리돼 있음) */}
              <div className={cn("bg-surface-field grid", miniCols)}>
                {row.values.map((value, cell) => (
                  <div
                    key={heads[cell]?.label ?? cell}
                    className="flex h-15 items-center justify-center"
                  >
                    <ResultCell value={value} unit={row.unit} />
                  </div>
                ))}
              </div>
            </div>

            {/* 태블릿 이상: 값 칸을 그대로 나열 */}
            {row.values.map((value, cell) => (
              <div key={heads[cell]?.label ?? cell} className="hidden md:block">
                <ResultCell value={value} unit={row.unit} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

/** ④ 표의 구분 칸. 단위는 라벨 아래에 옅게 붙인다. */
const ResultLabel = ({ label, unit }: { label?: string; unit?: string }) => (
  <span className={labelClass}>
    {label}
    {unit ? (
      <span className="text-ash-500 block text-xs font-normal">({unit})</span>
    ) : null}
  </span>
)

/** 결과 항목을 "N차년도 ○○" 으로 갈라 연차별 표로 세운다. */
const pivotByYear = (items: SchemaRow[]) => {
  const rows: {
    label: string
    unit?: string
    values: (string | undefined)[]
  }[] = []
  for (const item of items) {
    const matched = (item.label || "").match(/^([1-3])차년도\s*(.+)$/)
    if (!matched || (item.label || "").includes("한계비용")) continue
    const [, year, name] = matched
    const row = rows.find((entry) => entry.label === name) ?? {
      label: name,
      unit: item.unit,
      values: [undefined, undefined, undefined] as (string | undefined)[],
    }
    if (!rows.includes(row)) rows.push(row)
    row.values[Number(year) - 1] = item.sample
  }
  return rows
}

interface DetailProps {
  schema: MethodologySchema
  cells: Record<string, string>
  /** 다음으로를 누른 뒤부터 빈 칸을 표시한다 */
  showErrors?: boolean
  onCellChange: (cellRef: string, value: string) => void
}

/** 상세 입력의 빈 칸 안내. 기본정보 칸과 같은 규격이다. */
const FieldError = ({ show, message }: { show: boolean; message: string }) =>
  show ? <p className="text-ink-error text-sm">{message}</p> : null

const BusinessDetail = ({
  schema,
  cells,
  showErrors = false,
  onCellChange,
}: DetailProps) => {
  // 값은 계산하지 않고 시안 수치를 그대로 보여준다.
  const yearRows = pivotByYear(schema.resultItems)
  // 경제성 지표는 시안처럼 한계비용 한 건만 보여준다.
  const marginal = schema.resultItems.find((item) =>
    (item.label || "").includes("한계비용"),
  )
  const fuels = FUEL_OPTIONS
  // 폐열회수는 시안과 같이 '값 입력' 한 칸만 쓴다.
  const isSingle = !!schema.singleColumn
  const columnsClass = isSingle
    ? "md:grid-cols-[1fr_1fr]"
    : "md:grid-cols-[1fr_1fr_1fr]"

  const renderCell = (row: SchemaRow, side: "Before" | "After") => {
    const ref = side === "Before" ? row.cellRefBefore : row.cellRefAfter
    // 시안에서 개선전이 비어 있는 행은 칸 자체를 두지 않는다.
    if (!ref || (row.afterOnly && side === "Before")) return <div />
    // 시안에 값이 적힌 칸은 읽기 전용으로 그 값을 그대로 보여준다.
    const sample = side === "Before" ? row.sampleBefore : row.sampleAfter
    const isReadOnly = !!sample
    const unit = (row.unit || "").trim()
    const invalid =
      showErrors && !isReadOnly && !String(cells[ref] ?? "").trim()
    return (
      <div className="flex flex-col gap-1">
        <ColumnLabel side={side} single={isSingle} />
        <div className="relative">
          <Input
            id={`cell-${ref}`}
            isValid={!invalid}
            data-invalid={invalid || undefined}
            value={isReadOnly ? sample : (cells[ref] ?? "")}
            inputMode="decimal"
            placeholder={
              (side === "Before"
                ? row.placeholderBefore
                : row.placeholderAfter) ?? "0"
            }
            readOnly={isReadOnly}
            onChange={(event) => onCellChange(ref, event.target.value)}
            className={cn(
              isReadOnly ? readOnlyCellClass : numCellClass,
              "w-full",
              unit && "pr-16",
              // 오류일 때는 기본정보 칸처럼 빨간 링만 보이게 테두리를 감춘다.
              invalid && "border-0",
            )}
          />
          {unit ? (
            <span className="text-ink-body pointer-events-none absolute inset-y-0 right-4 flex items-center text-sm">
              {unit}
            </span>
          ) : null}
        </div>
        <FieldError show={invalid} message="값을 입력해 주세요." />
      </div>
    )
  }

  const renderFuel = (row: SchemaRow, side: "Before" | "After") => {
    const ref = side === "Before" ? row.cellRefBefore : row.cellRefAfter
    const fallback = (
      (side === "Before" ? row.beforeValue : row.afterValue) || ""
    ).trim()
    if (!ref) return <div />
    // 연료표에 없는 값(스팀·태양열 등)은 시안처럼 읽기 전용 상자로 보여준다.
    if (fallback && !fuels.includes(fallback))
      return (
        <div className="flex flex-col gap-1">
          <ColumnLabel side={side} single={isSingle} />
          <div className={cn(readOnlyCellClass, "flex items-center px-3")}>
            {`${fallback} (고정)`}
          </div>
        </div>
      )
    const key = fuelCellKey(ref)
    const invalid = showErrors && !String(cells[key] ?? "").trim()
    return (
      <div className="flex flex-col gap-1">
        <ColumnLabel side={side} single={isSingle} />
        <Select
          value={cells[key] ?? ""}
          onValueChange={(next) => onCellChange(key, next)}
        >
          <SelectTrigger
            data-invalid={invalid || undefined}
            className={cn(
              cellClass,
              "w-full min-w-0 data-[size=default]:h-13 [&>span[data-slot=select-value]]:block [&>span[data-slot=select-value]]:min-w-0 [&>span[data-slot=select-value]]:truncate",
              // 오류 표시는 ② 감축방법론 select 와 같은 규격을 쓴다.
              invalid && "border-ink-error border-2",
            )}
          >
            <SelectValue placeholder="연료 선택" />
          </SelectTrigger>
          <SelectContent>
            {fuels.map((fuel: string) => (
              <SelectItem key={fuel} value={fuel}>
                {fuel}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <FieldError show={invalid} message="연료를 선택해 주세요." />
      </div>
    )
  }

  // 제품수명은 기획 사이트와 같이 표의 마지막 줄에 둔다.
  const basisRows = [
    ...schema.basisRows.filter((row) => row.rowType !== "lifetime"),
    ...schema.basisRows.filter((row) => row.rowType === "lifetime"),
  ]

  const renderBasis = (row: SchemaRow) => {
    const invalidOf = (key: string) =>
      showErrors && !String(cells[key] ?? "").trim()
    if (row.rowType === "lifetime") {
      // 시안의 제품수명은 위아래 화살표로 조절하는 숫자 입력이다.
      const step = (delta: number) => {
        const current = Number(cells[LIFETIME_KEY] || row.fixedValue || 0)
        const next = Math.min(50, Math.max(1, current + delta))
        onCellChange(LIFETIME_KEY, String(next))
      }
      return (
        <div className="flex flex-col gap-1">
          <div className="relative">
            <Input
              type="number"
              min={1}
              max={50}
              isValid={!invalidOf(LIFETIME_KEY)}
              data-invalid={invalidOf(LIFETIME_KEY) || undefined}
              value={cells[LIFETIME_KEY] ?? ""}
              placeholder={String(row.fixedValue ?? 0)}
              onChange={(event) =>
                onCellChange(LIFETIME_KEY, event.target.value)
              }
              className={cn(
                numCellClass,
                "w-full pr-20",
                "[&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
              )}
            />
            <div className="absolute inset-y-0 right-4 flex items-center gap-2">
              <span className="text-ink-body flex flex-col">
                <button
                  type="button"
                  aria-label="제품수명 1년 늘리기"
                  onClick={() => step(1)}
                >
                  <ChevronUp aria-hidden="true" className="size-3" />
                </button>
                <button
                  type="button"
                  aria-label="제품수명 1년 줄이기"
                  onClick={() => step(-1)}
                >
                  <ChevronDown aria-hidden="true" className="size-3" />
                </button>
              </span>
              <span className="text-ink-body text-sm">{row.unit || "년"}</span>
            </div>
          </div>
          <FieldError
            show={invalidOf(LIFETIME_KEY)}
            message="제품수명을 입력해 주세요."
          />
        </div>
      )
    }

    // 시안의 스팀 배출계수는 계수 · 단위 · 근거가 한 줄에 놓인다.
    if (row.rowType === "steam-ef" && row.cellRef)
      return (
        <div className="flex flex-col gap-1">
          {/* 모바일 시안은 [계수 + 단위] 아래에 근거 입력이 한 줄 더 놓인다 */}
          <div className="flex flex-col gap-2.5 md:flex-row md:items-center md:gap-2">
            <div className="flex min-w-0 items-center gap-2 md:contents">
              <Input
                isValid={!invalidOf(row.cellRef as string)}
                data-invalid={invalidOf(row.cellRef as string) || undefined}
                value={cells[row.cellRef] ?? ""}
                inputMode="decimal"
                placeholder={String(row.fixedValue ?? 0)}
                onChange={(event) =>
                  onCellChange(row.cellRef as string, event.target.value)
                }
                className={cn(
                  numCellClass,
                  "min-w-0 flex-1 md:w-20 md:flex-none",
                )}
              />
              <span className="text-ink-body shrink-0 text-sm">{row.unit}</span>
            </div>
            <Input
              value={cells[basisCellKey(row.key || "")] ?? ""}
              isValid={!invalidOf(basisCellKey(row.key || ""))}
              data-invalid={invalidOf(basisCellKey(row.key || "")) || undefined}
              placeholder={row.placeholder ?? "배출계수 근거 입력"}
              onChange={(event) =>
                onCellChange(basisCellKey(row.key || ""), event.target.value)
              }
              className={cn(
                cellClass,
                "w-full min-w-0 text-xs md:flex-1 md:text-sm",
              )}
            />
          </div>
          <FieldError
            show={
              invalidOf(row.cellRef as string) ||
              invalidOf(basisCellKey(row.key || ""))
            }
            message="배출계수와 근거를 입력해 주세요."
          />
        </div>
      )

    return (
      <div className="flex flex-col gap-1">
        <Input
          isValid={!invalidOf(basisCellKey(row.key || ""))}
          data-invalid={invalidOf(basisCellKey(row.key || "")) || undefined}
          value={cells[basisCellKey(row.key || "")] ?? ""}
          placeholder={
            row.placeholder ?? "측정기기, 카달로그, 계량기 등 출처 입력"
          }
          onChange={(event) =>
            onCellChange(basisCellKey(row.key || ""), event.target.value)
          }
          className={cn(cellClass, "w-full text-xs md:text-sm")}
        />
        <FieldError
          show={invalidOf(basisCellKey(row.key || ""))}
          message="데이터 출처를 입력해 주세요."
        />
      </div>
    )
  }

  // 폐열회수 시안은 입력 항목과 근거 항목을 좌우 두 표에 반씩 나눠 담는다.
  const visible = (rows: SchemaRow[]) => rows.filter((row) => !row.hidden)
  const singleRows = isSingle
    ? [
        ...visible(schema.dropdowns).map((row) => ({
          key: `dd-${row.key}`,
          label: row.label,
          control: renderFuel(row, "Before"),
        })),
        ...visible(schema.inputRows).map((row) => ({
          key: `in-${row.key}`,
          label: row.label,
          control: renderCell(row, "Before"),
        })),
        ...visible(basisRows).map((row) => ({
          key: `bs-${row.key}`,
          label: row.label,
          control: renderBasis(row),
        })),
      ]
    : []
  const singleColumnGroups = [
    singleRows.slice(0, Math.ceil(singleRows.length / 2)),
    singleRows.slice(Math.ceil(singleRows.length / 2)),
  ]

  // '구분 / 값 입력' 표 한 벌. 시안은 태블릿 이하 한 표, PC 두 표다.
  const renderSingleTable = (
    group: { key: string; label?: string; control: React.ReactNode }[],
  ) => (
    <div className={boxClass}>
      <div className={cn(headClass, "grid-cols-[1fr_2.4fr]")} role="row">
        <span>구분</span>
        <span className="text-center">값 입력</span>
      </div>
      <div className="flex flex-col gap-3 md:gap-2.5 md:px-6 md:py-4 lg:px-8 lg:py-8">
        {group.map((row) => (
          <div
            key={row.key}
            className={cn(rowClass, "md:grid-cols-[1fr_2.4fr]")}
          >
            <span className={labelClass}>{row.label}</span>
            {row.control}
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <>
      {/* ③ 상세 입력 */}
      <div className="flex flex-col gap-3 md:gap-4 md:px-5 lg:gap-6">
        <div className="flex items-start gap-3">
          <span className="bg-ash-200 text-ink-strong dark:bg-surface-inverse dark:text-ink-on-inverse flex size-8 shrink-0 items-center justify-center rounded-full text-base font-bold">
            3
          </span>
          <h3 className="text-ink-strong text-xl font-bold md:text-2xl">
            상세 입력
          </h3>
        </div>

        {isSingle ? (
          /* 폐열회수는 시안대로 '구분 / 값 입력' 표 두 개에 항목을 나눠 담는다. */
          <div className="flex flex-col gap-3">
            <p className="text-ink-strong text-base font-bold">
              {schema.sheetName}
            </p>
            {/* 태블릿 이하는 한 표에 모든 항목 */}
            <div className="lg:hidden">{renderSingleTable(singleRows)}</div>
            {/* PC 는 좌우 두 표로 나눈다 */}
            <div className="hidden items-start gap-6 lg:grid lg:grid-cols-2">
              {singleColumnGroups.map((group, index) => (
                <div key={index}>{renderSingleTable(group)}</div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid items-start gap-4 lg:grid-cols-2 lg:gap-6">
            {/* 방법론별 입력표 */}
            <div className="flex flex-col gap-3">
              <p className="text-ink-strong text-base font-bold">
                {schema.sheetName}
              </p>
              <div className={boxClass}>
                <div
                  className={cn(headClass, "grid-cols-[1fr_1fr_1fr]")}
                  role="row"
                >
                  <span>구분</span>
                  <span className="text-center">개선전</span>
                  <span className="text-brand-primary text-center">개선후</span>
                </div>
                <div className="flex flex-col gap-3 md:gap-2.5 md:px-6 md:py-4 lg:px-8 lg:py-8">
                  {visible(schema.dropdowns).map((row) => (
                    <div key={row.key} className={cn(rowClass, columnsClass)}>
                      <span className={labelClass}>{row.label}</span>
                      {renderFuel(row, "Before")}
                      {renderFuel(row, "After")}
                    </div>
                  ))}
                  {visible(schema.inputRows).map((row) => (
                    <div key={row.key} className={cn(rowClass, columnsClass)}>
                      <span className={labelClass}>{row.label}</span>
                      {renderCell(row, "Before")}
                      {renderCell(row, "After")}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 데이터 근거 */}
            <div className="flex flex-col gap-3">
              <p className="text-ink-strong text-base font-bold">데이터 근거</p>
              <div className={boxClass}>
                <div
                  className={cn(headClass, "grid-cols-[1fr_2fr]")}
                  role="row"
                >
                  <span>구분</span>
                  <span className="text-center">데이터 출처</span>
                </div>
                <div className="flex flex-col gap-3 md:gap-2.5 md:px-6 md:py-4 lg:px-8 lg:py-8">
                  {visible(basisRows).map((row) => (
                    <div
                      key={row.key}
                      className="grid items-center gap-2 md:grid-cols-[1fr_2fr]"
                    >
                      <span className={labelClass}>{row.label}</span>
                      {renderBasis(row)}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <hr className="border-line-card border-t" />

      {/* ④ 온실가스 감축량 및 에너지 절감량 */}
      <div className="flex flex-col gap-3 md:gap-4 md:px-5 lg:gap-6">
        <div className="flex items-start gap-3">
          <span className="bg-ash-200 text-ink-strong dark:bg-surface-inverse dark:text-ink-on-inverse flex size-8 shrink-0 items-center justify-center rounded-full text-base font-bold">
            4
          </span>
          <h3 className="text-ink-strong text-xl font-bold md:text-2xl">
            온실가스 감축량 및 에너지 절감량
          </h3>
        </div>

        <div className="grid items-start gap-4 md:gap-6 lg:grid-cols-2">
          {/* 개선전·개선후 중간 계산 */}
          <ResultTable
            cols="md:grid-cols-[1.84fr_1fr_1fr]"
            heads={[{ label: "개선전" }, { label: "개선후", accent: true }]}
            rows={schema.computeRows.map((row) => ({
              label: row.label,
              unit: row.unit,
              values: [row.sampleBefore, row.sampleAfter],
            }))}
          />

          {/* 연차별 결과 · 경제성 지표 */}
          <div className="flex flex-col gap-4 md:gap-6 lg:gap-3.5">
            <ResultTable
              cols="md:grid-cols-[1.2fr_1fr_1fr_1fr]"
              heads={YEAR_LABELS.map((year) => ({ label: year }))}
              rows={yearRows}
            />

            <div className="flex flex-col gap-4">
              {marginal ? (
                <div className="bg-surface-flow flex flex-col items-center gap-2 rounded-md px-6 py-5">
                  <p className="text-ink-strong text-base font-bold">
                    경제성 지표
                  </p>
                  {/* 모바일은 뱃지 아래 줄에 값이 놓인다(시안) */}
                  <div className="flex flex-col items-center gap-3 md:flex-row">
                    {/* 시안의 한계비용 뱃지는 라이트·다크 모두 #f8f8f8 + #333 이다. */}
                    <span className="bg-surface-chip text-ink-chip inline-flex h-6 items-center rounded-full px-4 text-xs font-bold lg:h-7">
                      한계비용
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-brand-primary text-xl font-bold md:text-2xl">
                        {marginal.sample || "-"}
                      </span>
                      <span className="text-ink-muted text-xs">
                        {marginal.unit}
                      </span>
                    </div>
                  </div>
                </div>
              ) : null}

              {/* 안내 문구는 경제성 지표 아래에 붙는다. */}
              {/* 시안: 모바일·태블릿 12/400 · PC 13/500 */}
              <p className="text-ink-hint text-xs font-normal break-keep lg:font-medium">
                {schema.sampleHint}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default BusinessDetail
