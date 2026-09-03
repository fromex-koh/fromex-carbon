"use client"

import { Fragment, useEffect, useMemo, useRef, useState } from "react"
import { ArrowLeft, ArrowRight, ChevronUp, CircleAlert } from "lucide-react"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Stepper } from "@/components/ui/stepper"
import StepMobileNav from "@/app/(site)/(content)/carbon-leader/self-check/components/step-mobile-nav"
import BaseInfo from "@/app/(site)/(content)/carbon-leader/self-check/components/base-info"
import ScopeGuideDialog from "@/app/(site)/(content)/carbon-leader/components/scope-guide-dialog"
import InventoryItemDialog, {
  RequiredTag,
  ScopeTag,
} from "@/app/(site)/(content)/carbon-leader/self-check/components/inventory-item-dialog"
import { SELF_CHECK_STEPS } from "@/constants/carbon-leader-self-check-steps"
import { useDialogAutoOpen } from "@/util/use-dialog-auto-open"
import { cn } from "@/lib/utils"
import {
  INVENTORY_DETAIL,
  INVENTORY_OPTIONS,
  INVENTORY_SCOPE,
  INVENTORY_TREE,
  INVENTORY_UNIT,
  type InventoryNode,
} from "@/constants/carbon-leader-inventory-items"
import {
  Dialog,
  DialogCloseButton,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const NOTICES = [
  "[인벤토리 설정]에서 산정할 배출 항목을 선택하면, 선택한 항목의 입력 필드가 아래에 나타납니다.",
  "하위 상세 항목을 설정한 항목은 [상세입력]에서 하위 항목을 입력하며, 그 합계가 이 화면에 표시됩니다.",
]

/** 경고 배너에서 붉게 두는 앞머리. 뒤 문장과 한 줄로 이어진다 */
const WARNING_TARGET = "폐기물 직접 처리, 공정배출"
const WARNING_REST =
  " 관련 인벤토리 설정을 확인하시기 바랍니다. 미 설정 시 관련 인벤토리 배출량을 산정할 수 없습니다."

/**
 * 표에 세울 연도.
 *
 * 연계 시에는 이 값을 쓰지 말고 `<InventoryEmission years={...} />` 로 넘기면 된다.
 * 사용량 칸 · 배출량 칸 · 총배출량 카드가 모두 이 배열 하나를 따라가고,
 * 칸 수도 배열 길이로 정해지므로 3개년이 아니어도 마크업은 손댈 필요가 없다.
 * 입력 칸 name 도 `use-{항목코드}-{연도}` 로 같이 따라간다.
 */
const YEARS = ["2023", "2024", "2025"]

/**
 * [퍼블리싱 노출용] 총배출량 카드 숫자. 계산하지 않고 시안 값을 그대로 적었다.
 * YEARS 와 같은 순서로 짝지으며, 연도가 더 많으면 남는 칸은 0 으로 채운다.
 */
const TOTAL_BY_YEAR = ["170.75", "1,596.00", "1,460.75"]
const SCOPE12_TOTAL = "3,227.50 kg"
const SCOPE3_TOTAL = "-"

/** 반드시 담아야 하는 대분류. 시안에서 필수 배지가 붙는 폐기물처리·공정배출이다 */
const REQUIRED_CATEGORIES = INVENTORY_TREE.filter((node) => node.required).map(
  (node) => node.code,
)

/** 코드로 이름을 찾으려고 트리를 한 번 펼쳐 둔다 */
const NAME_BY_CODE: Record<string, string> = (() => {
  const map: Record<string, string> = {}
  const walk = (node: InventoryNode) => {
    map[node.code] = node.name
    node.children?.forEach(walk)
  }
  INVENTORY_TREE.forEach(walk)
  return map
})()

/** 더 안 쪼개지는 잎 코드만 모아 둔다 */
const LEAF_CODES: string[] = (() => {
  const list: string[] = []
  const walk = (node: InventoryNode) => {
    if (node.children?.length) node.children.forEach(walk)
    else list.push(node.code)
  }
  INVENTORY_TREE.forEach(walk)
  return list
})()

/**
 * 표에 세우는 한 줄.
 * detail 이 있으면 값을 직접 넣지 않고 [상세입력] 팝업에서 받는 줄이다.
 */
interface PickedItem {
  code: string
  name: string
  detail: string[] | null
}

interface PickedGroup {
  code: string
  name: string
  required: boolean
  subs: { code: string; name: string; items: PickedItem[] }[]
  count: number
}

/** 이 항목이 [상세입력] 마디에 속하면 그 마디 코드를 돌려준다 */
const detailCodeOf = (code: string) => {
  for (let end = 3; end < code.length; end += 2) {
    const head = code.slice(0, end)
    if (INVENTORY_DETAIL.includes(head)) return head
  }
  return null
}

/** 고른 코드를 대분류 → 중분류 → 항목 세 단으로 묶는다 */
const groupPicked = (picked: string[]): PickedGroup[] => {
  const order = [...picked].sort()
  const groups: PickedGroup[] = []
  order.forEach((code) => {
    const catCode = code.slice(0, 3)
    const subCode = code.slice(0, 5)
    let group = groups.find((one) => one.code === catCode)
    if (!group) {
      group = {
        code: catCode,
        name: NAME_BY_CODE[catCode] ?? catCode,
        required: REQUIRED_CATEGORIES.includes(catCode),
        subs: [],
        count: 0,
      }
      groups.push(group)
    }
    let sub = group.subs.find((one) => one.code === subCode)
    if (!sub) {
      sub = { code: subCode, name: NAME_BY_CODE[subCode] ?? subCode, items: [] }
      group.subs.push(sub)
    }
    // 상세입력 마디에 속한 항목은 그 마디 한 줄로 모은다
    const detail = detailCodeOf(code)
    const rowCode = detail ?? code
    let item = sub.items.find((one) => one.code === rowCode)
    if (!item) {
      item = {
        code: rowCode,
        name: NAME_BY_CODE[rowCode] ?? rowCode,
        detail: detail ? [] : null,
      }
      sub.items.push(item)
      group.count += 1
    }
    item.detail?.push(code)
  })
  return groups
}

/**
 * 표 한 칸. 입력 칸과 자동 산출 칸이 같은 규격을 쓴다.
 * 시안 PC_Placeholder 기준 높이 52 · 좌우 여백 16 · 모서리 6 · 테두리 #d2d2d2 다.
 */
const CELL =
  "border-line-field bg-surface-field flex h-13 min-w-0 flex-1 items-center gap-1 rounded-md border px-4"

/**
 * 값을 넣는 칸. 겹침·초점 표시는 공통 Input·Select 와 같은 ash-600 두 겹 고리다.
 * 고리는 안쪽 input 이 아니라 이 상자가 두르므로 has-[:focus-visible] 를 쓴다.
 */
const FIELD_CELL = cn(
  CELL,
  "hover:ring-ash-600 has-[:focus-visible]:ring-ash-600 outline-hidden transition-colors hover:ring-2 has-[:focus-visible]:ring-2",
)

/**
 * 단위 자리는 화면에 따라 다르다.
 * PC·태블릿(md 이상)은 칸이 좁아 mg-BOD/L 같은 여덟 자 단위가 값을 밀어내므로 칸 아래 오른쪽에 적는다.
 * 모바일은 칸이 한 줄을 다 쓰므로 시안대로 칸 안 오른쪽에 둔다.
 * 세로로 쌓으므로 칸에는 flex-none 을 줘 FIELD_CELL 의 flex-1 이 높이를 무너뜨리지 않게 한다.
 */
const CELL_STACK = "flex min-w-0 flex-1 flex-col gap-1 max-md:gap-0"
const CELL_IN_STACK = "w-full flex-none"

/**
 * 자동 산출 칸. 값이 없으면 브라우저가 placeholder 로 0 을 보여 준다.
 * 굵기·색은 입력 칸과 같은 규칙을 그대로 쓴다 — 값은 Bold, 자리표시는 Medium 이다.
 * 스스로 고칠 수 없는 칸이라 탭 차례에서는 빼 두고, 검사에서 옮겨 올 때만 초점을 준다.
 */
const AutoCell = ({
  value,
  name,
  invalid,
  className,
}: {
  /** 아직 값이 없으면 null */
  value: string | null
  name?: string
  invalid?: boolean
  className?: string
}) => (
  <label
    className={cn(
      CELL,
      // 모바일은 세로로 쌓이므로 CELL 의 flex-1 이 높이를 무너뜨린다
      "bg-surface-disabled max-md:w-full max-md:flex-none",
      invalid && "ring-destructive ring-2",
      className,
    )}
  >
    <input
      readOnly
      tabIndex={-1}
      name={name}
      placeholder="0"
      value={value ?? ""}
      className="text-ink-hint placeholder:text-ink-hint min-w-0 flex-1 bg-transparent text-left text-sm font-bold outline-none placeholder:font-medium"
    />
  </label>
)

/** 표 머리와 좁은 화면 묶음 이름에 함께 쓴다 */
const USE_TITLE = "사용량 입력"
const EMIT_TITLE = "온실가스 배출량 (kgCO₂eq)"

/** 상세입력 값 — 항목 코드 → 연도 → 사용자가 넣은 글자 */
type DetailValues = Record<string, Record<string, string>>

/** 연도별 합계. 숫자가 아닌 글자는 0 으로 본다 */
const sumOf = (codes: string[], year: string, values: DetailValues) =>
  codes.reduce((total, code) => total + (Number(values[code]?.[year]) || 0), 0)

/** [다음으로] 가 향하는 화면 */
const PREV_HREF = "/carbon-leader/self-check/company-info"
const NEXT_HREF = "/carbon-leader/self-check/reduction-potential"

/** 표에 세울 숫자. 0 이면 그냥 0 으로 둔다 */
const formatAmount = (value: number) =>
  value ? value.toLocaleString("ko-KR", { maximumFractionDigits: 10 }) : "0"

/** 표의 사용량 칸. 목록형·상세입력형·직접입력형 세 가지가 있다 */
const ItemInput = ({
  item,
  year,
  detailValues,
  value,
  onChange,
  invalid,
}: {
  item: PickedItem
  year: string
  detailValues: DetailValues
  /** 묶음을 접었다 펴도 값이 남도록 밖에서 들고 있는다 */
  value: string
  onChange: (next: string) => void
  /** [다음으로] 를 눌렀을 때 비어 있던 칸 */
  invalid?: boolean
}) => {
  const name = `use-${item.code}-${year}`

  if (INVENTORY_OPTIONS[item.code])
    // 다른 화면과 같은 공통 Select 를 쓴다
    return (
      <Select name={name} value={value} onValueChange={onChange}>
        <SelectTrigger
          data-name={name}
          aria-label={`${item.name} ${year}`}
          // 모바일은 세로로 쌓이므로 flex-1 이 h-13 을 무너뜨린다
          className={cn(
            // 공통 트리거는 값에 line-clamp-1 과 flex 를 함께 걸어 둬 말줄임이 먹지 않는다.
            // block 으로 되돌리고 truncate 를 줘 칸을 넘는 보기를 … 로 줄인다.
            // button 기본값이 가운데 정렬이라 옆 입력 칸처럼 왼쪽으로 맞춘다
            "border-line-field bg-surface-field h-13 min-w-0 flex-1 rounded-md px-4 text-left text-sm max-md:w-full max-md:flex-none",
            "*:data-[slot=select-value]:block *:data-[slot=select-value]:min-w-0 *:data-[slot=select-value]:flex-1 *:data-[slot=select-value]:truncate",
            // 초점 표시는 옆 입력 칸(FIELD_CELL)과 같은 ash-600 두 겹 고리로 맞춘다.
            // 공통 트리거는 ring/50 에 테두리까지 바꾸므로 둘 다 덮어쓴다.
            "focus-visible:border-line-field focus-visible:ring-ash-600 focus-visible:ring-2",
            invalid && "ring-destructive ring-2",
          )}
        >
          <SelectValue placeholder="선택" />
        </SelectTrigger>
        {/*
          목록 폭을 트리거에 맞춘다. 공통 SelectContent 의 min-w-[8rem] 때문에
          칸보다 넓게 열려 있었으므로 min-w-0 으로 풀고 트리거 폭을 그대로 쓴다.
          칸이 좁아 긴 보기는 여러 줄로 접어 보여 준다.
        */}
        <SelectContent
          align="center"
          className="w-(--radix-select-trigger-width) min-w-0"
        >
          {INVENTORY_OPTIONS[item.code].map((option) => (
            <SelectItem
              key={option}
              value={option}
              className="whitespace-normal break-keep"
            >
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    )

  if (item.detail) {
    // 상세입력에서 저장한 값의 합계가 들어온다.
    // 하나도 넣지 않았으면 0 이 아니라 빈 칸으로 두어 미입력임을 드러낸다.
    const filled = item.detail.some((code) =>
      (detailValues[code]?.[year] ?? "").trim(),
    )
    return (
      <AutoCell
        name={name}
        invalid={invalid}
        value={
          filled ? formatAmount(sumOf(item.detail, year, detailValues)) : null
        }
      />
    )
  }

  return (
    <div className={CELL_STACK}>
      <label
        className={cn(
          FIELD_CELL,
          CELL_IN_STACK,
          invalid && "ring-destructive ring-2",
        )}
      >
        <input
          name={name}
          placeholder="0"
          inputMode="decimal"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-label={`${item.name} ${year} 사용량`}
          className="text-ink-strong placeholder:text-ink-hint min-w-12 flex-1 bg-transparent text-left text-sm font-bold outline-none placeholder:font-medium"
        />
      </label>
    </div>
  )
}

/**
 * [상세입력] 팝업. 하위 항목을 연도별로 받고 그 합계가 표의 상위 줄에 들어간다.
 * 팝업 안에서는 입력할 때마다 합계가 바로 갱신되고, 저장을 눌러야 표에 반영된다.
 */
const DetailDialog = ({
  item,
  years,
  values,
  onSave,
  defaultOpen,
}: {
  item: PickedItem
  years: string[]
  values: DetailValues
  onSave: (next: DetailValues) => void
  /** 모달 전용 라우트로 바로 들어왔을 때 열어 준다 */
  defaultOpen?: boolean
}) => {
  const [open, setOpen] = useDialogAutoOpen(defaultOpen)
  // 저장을 누르기 전까지는 팝업 안에서만 들고 있는다
  const [draft, setDraft] = useState<DetailValues>(values)

  // [저장] 을 한 번 누른 뒤부터 빈 칸 표시를 보여 준다
  const [hasTried, setHasTried] = useState(false)

  useEffect(() => {
    if (!open) return
    setDraft(values)
    setHasTried(false)
  }, [open, values])

  const codes = item.detail ?? []
  const put = (code: string, year: string, text: string) =>
    setDraft((old) => ({ ...old, [code]: { ...old[code], [year]: text } }))

  /** 비어 있는 칸의 name 을 모은다. 지금은 빈값만 본다. */
  const emptyOf = (draftValues: DetailValues) =>
    codes.flatMap((code) =>
      years
        .filter((year) => !(draftValues[code]?.[year] ?? "").trim())
        .map((year) => `detail-${code}-${year}`),
    )

  // 한 번 누른 뒤에는 값을 넣을 때마다 저절로 다시 본다
  const emptyKeys = useMemo(
    () => (hasTried ? emptyOf(draft) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [hasTried, codes, years, draft],
  )

  const handleSave = () => {
    setHasTried(true)
    const empty = emptyOf(draft)
    if (empty.length) {
      const first = document.querySelector<HTMLElement>(`[name="${empty[0]}"]`)
      first?.focus()
      first?.scrollIntoView({ block: "center" })
      return
    }
    onSave(draft)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="h-7 shrink-0 gap-1.5 rounded-md px-2.5 text-xs font-bold"
        >
          상세입력
          <span className="text-ink-muted">{codes.length}</span>
        </Button>
      </DialogTrigger>
      {/*
        시안은 닫기를 카드 밖 위에 두므로 넘침을 자르지 않는다.
        대신 버튼이 화면 밖으로 나가지 않게 카드 높이를 그만큼 줄인다.
      */}
      <DialogContent className="top-[calc(50%+1.25rem)] flex max-h-[calc(100dvh-6.5rem)] w-[calc(100%-1.25rem)] max-w-[calc(100%-1.25rem)] flex-col gap-0 rounded-xl p-0 sm:w-[calc(100%-7.5rem)] sm:max-w-232 lg:top-[50%] lg:max-h-[calc(100dvh-2.5rem)]">
        {/* 시안 닫기 — 32 원, 아이콘 10, 카드 위로 10 띄운다 */}
        {/* 시안은 PC 만 카드 안에 두고, 태블릿 이하는 카드 위로 뺀다 */}
        <DialogCloseButton className="absolute -top-10 right-0 flex size-7.5 items-center justify-center p-0 lg:top-5 lg:right-5 [&_svg:not([class*='size-'])]:size-5 [&_svg]:stroke-[2.3]" />

        <div className="flex min-h-0 flex-1 flex-col gap-5 px-5 pt-6 md:gap-6 md:px-8 md:pt-8">
          <div className="flex items-baseline gap-3">
            {/* 시안 제목은 28 · 뱃지는 28 높이에 13 이다 */}
            <DialogTitle className="text-ink-strong text-[28px] leading-10 font-bold break-keep">
              상세입력
            </DialogTitle>
            <span className="bg-surface-flow text-brand-primary inline-flex h-6.5 shrink-0 items-center rounded-full px-3 text-[13px] font-bold">
              {item.name}
            </span>
          </div>

          <ul className="bg-surface-notice text-ink-body flex flex-col gap-2.5 rounded-2xl px-5 py-5 text-base font-normal break-keep md:px-8 md:py-6">
            <li>
              · 해당 창에서 입력한 값의{" "}
              <b className="text-brand-primary font-bold">합계</b>가 상위 항목{" "}
              <b className="text-brand-primary font-bold">[{item.name}]</b>에
              반영됩니다.
            </li>
            <li>
              {/* 시안은 나머지 연도를 가운뎃점으로 이어 적는다. 연도 배열을 그대로 따른다 */}
              · {years[0]}년 사용량은 정수, {years.slice(1).join("·")}년은
              소수점 10자리까지 입력됩니다.
            </li>
          </ul>

          <div className="-mx-1 flex min-h-0 flex-1 flex-col px-1 pb-6">
            {/* 테두리·둥근 모서리는 바깥 상자가 갖고, 스크롤은 안쪽 상자가 맡는다 */}
            <div className="border-line-card flex min-h-0 flex-1 flex-col overflow-hidden rounded-md border dark:border-line-divider/40">
              {/*
              머리 줄 — 굴림 상자 밖에 두어 지나가는 줄이 걸치지 않게 한다.
              안에 두고 sticky 로 붙이면 둥근 모서리 틈으로 뒤가 비친다.
            */}
              <div className="bg-surface-disabled border-line-card flex h-16 shrink-0 items-stretch border-b max-md:h-8.5 md:max-lg:h-9.5 dark:border-line-divider/40">
                {/* 모바일 시안은 이 칸만 남기고 왼쪽에 붙인다 */}
                <span className="text-ink-muted flex w-50 shrink-0 items-center justify-center text-xs font-bold max-md:w-full max-md:justify-start max-md:px-5 md:max-lg:w-32.5 md:max-lg:justify-start md:max-lg:px-5">
                  인벤토리
                </span>
                <div className="border-line-card flex min-w-0 flex-1 flex-col border-l max-md:hidden dark:border-line-divider/40">
                  {/* 태블릿 시안 머리 줄은 연도 한 단이고, 묶음 이름은 각 줄이 안고 간다 */}
                  <span className="text-ink-muted border-line-card flex h-8 items-center justify-center border-b text-xs font-bold md:max-lg:hidden dark:border-line-divider/40">
                    입력항목
                  </span>
                  <div className="flex min-h-0 flex-1">
                    {years.map((year, index) => (
                      <span
                        key={year}
                        className={cn(
                          "text-ink-muted flex min-w-0 flex-1 items-center justify-center text-xs font-bold",
                          index < years.length - 1 &&
                            "border-line-card border-r",
                        )}
                      >
                        {year}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="min-h-0 flex-1 overflow-auto">
                {/*
                태블릿 시안은 가로 스크롤 없이 표가 폭에 맞는다.
                최소 폭은 칸이 좁아지는 PC 에서만 세운다.
              */}
                <div className="lg:min-w-172">
                  {codes.map((code) => (
                    <div
                      key={code}
                      className="bg-surface-field border-line-card flex border-b max-md:flex-col dark:border-line-divider/40 md:min-h-18"
                    >
                      {/* 모바일 시안은 이름을 38 높이 띠로 세우고 단위를 같은 줄에 붙인다 */}
                      <div className="border-line-card flex shrink-0 flex-col justify-center px-5 max-md:flex-row max-md:items-baseline max-md:justify-start max-md:gap-1 max-md:border-b max-md:py-2 md:w-50 md:max-lg:w-32.5 dark:border-line-divider/40">
                        <span
                          title={NAME_BY_CODE[code]}
                          className="text-ink-strong text-sm font-bold break-keep md:max-lg:text-base"
                        >
                          {NAME_BY_CODE[code]}
                        </span>
                        <span className="text-ink-hint truncate text-xs font-normal">
                          ({INVENTORY_UNIT[code]})
                        </span>
                      </div>
                      <div className="border-line-card flex min-w-0 flex-1 flex-col justify-center gap-1.5 px-5 max-md:py-5 md:border-l md:py-3 lg:flex-row lg:items-center lg:gap-3 dark:border-line-divider/40">
                        {/* 묶음 이름은 PC 머리 줄에 있고, 그 아래 해상도는 줄마다 안고 간다 */}
                        <span className="text-ink-muted text-xs font-bold lg:hidden">
                          입력항목
                        </span>
                        <div className="flex min-w-0 gap-3 max-md:flex-col max-md:gap-2 md:max-lg:gap-2 lg:flex-1">
                          {years.map((year) => (
                            // 이름 칸이 이미 단위를 달고 있어 칸 아래 단위는 두지 않는다
                            <div
                              key={year}
                              className={cn(CELL_STACK, "max-md:w-full")}
                            >
                              {/* 모바일 시안은 연도를 칸 안이 아니라 칸 위에 세운다 */}
                              <span className="text-ink-muted text-xs font-bold md:hidden">
                                {year}
                              </span>
                              <label
                                className={cn(
                                  FIELD_CELL,
                                  CELL_IN_STACK,
                                  emptyKeys.includes(
                                    `detail-${code}-${year}`,
                                  ) && "ring-destructive ring-2",
                                )}
                              >
                                <input
                                  name={`detail-${code}-${year}`}
                                  placeholder="0"
                                  inputMode="decimal"
                                  value={draft[code]?.[year] ?? ""}
                                  onChange={(event) =>
                                    put(code, year, event.target.value)
                                  }
                                  aria-label={`${NAME_BY_CODE[code]} ${year} 입력값`}
                                  className="text-ink-strong placeholder:text-ink-hint min-w-12 flex-1 bg-transparent text-left text-sm font-bold outline-none placeholder:font-medium"
                                />
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* 합계 줄 — 위 값들을 더해 표의 상위 줄로 올라간다 */}
                  <div className="bg-surface-field flex max-md:flex-col md:min-h-18">
                    {/* 모바일 시안은 여기도 38 높이 띠로 세운다 */}
                    <div className="border-line-card flex shrink-0 items-center px-5 max-md:border-b max-md:py-2 md:w-50 md:max-lg:w-32.5 dark:border-line-divider/40">
                      {/* 어느 항목의 합계인지 알아야 해서 줄임표 대신 줄바꿈으로 둔다 */}
                      <span className="text-brand-primary text-sm font-bold break-keep md:max-lg:text-base">
                        합계 → {item.name}
                      </span>
                    </div>
                    <div className="border-line-card flex min-w-0 flex-1 flex-col justify-center gap-1.5 px-5 max-md:py-5 md:border-l md:py-3 lg:flex-row lg:items-center lg:gap-3 dark:border-line-divider/40">
                      {/* 묶음 이름은 PC 머리 줄에 있고, 그 아래 해상도는 줄마다 안고 간다 */}
                      <span className="text-ink-muted text-xs font-bold lg:hidden">
                        입력항목
                      </span>
                      <div className="flex min-w-0 gap-3 max-md:flex-col max-md:gap-2 md:max-lg:gap-2 lg:flex-1">
                        {years.map((year) => (
                          <div
                            key={year}
                            className={cn(CELL_STACK, "max-md:w-full")}
                          >
                            {/* 모바일 시안은 연도를 칸 위에 세운다 */}
                            <span className="text-ink-muted text-xs font-bold md:hidden">
                              {year}
                            </span>
                            <AutoCell
                              className={CELL_IN_STACK}
                              value={
                                codes.some((code) =>
                                  (draft[code]?.[year] ?? "").trim(),
                                )
                                  ? formatAmount(sumOf(codes, year, draft))
                                  : null
                              }
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 시안은 모바일에서도 하단 바만 좌우 32 를 쓴다 */}
        <div className="border-line-field flex shrink-0 items-center justify-between gap-3 border-t px-8 py-5">
          <div className="flex min-w-0 flex-col gap-1">
            <p className="text-brand-primary text-sm font-bold">
              총 {codes.length}건
            </p>
            {hasTried && emptyKeys.length > 0 ? (
              <p className="text-ink-error text-xs font-medium break-keep">
                입력하지 않은 칸이 {emptyKeys.length}개 있습니다.
              </p>
            ) : null}
          </div>
          <Button
            type="button"
            size="lg"
            onClick={handleSave}
            className="h-13 w-30 shrink-0 rounded-lg text-sm font-bold"
          >
            저장
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

const InventoryEmission = ({
  /** 연계 시 신청 회차에서 내려오는 산정 대상 연도 */
  years = YEARS,
  /** 상단 스테퍼 단계 이름. 3차 신청은 6단계 이름이 달라 밖에서 넘긴다 */
  steps = SELF_CHECK_STEPS,
  /** [이전으로] 가 갈 곳. 흐름마다 앞 화면이 다르다 */
  prevHref = PREV_HREF,
  /** [다음으로] 가 갈 곳. 흐름마다 뒤 화면이 다르다 */
  nextHref = NEXT_HREF,
}: {
  years?: string[]
  steps?: string[]
  prevHref?: string
  nextHref?: string
}) => {
  const [picked, setPicked] = useState<string[]>([])
  const [closed, setClosed] = useState<string[]>([])
  // [상세입력] 팝업에서 저장한 값. 표의 상위 줄에는 이 값의 합계가 들어간다.
  const [detailValues, setDetailValues] = useState<DetailValues>({})
  // 저장할 때마다 1 씩 오른다. 값이 그대로여도 화면은 다시 옮겨 준다.
  const [savedAt, setSavedAt] = useState(0)
  // 저장 뒤에 화면을 옮겨 세울 자리. 표가 길어져도 총배출량은 보이게 한다.
  const cardRef = useRef<HTMLDivElement>(null)

  // 사용량 입력값. 묶음을 접으면 칸이 사라지므로 값은 여기에 들고 있는다.
  const [useValues, setUseValues] = useState<Record<string, string>>({})
  // 검사 대상 칸들이 들어 있는 자리. 첫 빈 칸으로 옮길 때만 쓴다.
  const fieldsRef = useRef<HTMLDivElement>(null)
  // [다음으로] 를 한 번 누른 뒤부터 표시를 보여 준다
  const [hasTried, setHasTried] = useState(false)

  /**
   * 검사할 칸의 이름들. 지금은 빈값만 본다.
   * 상세입력 마디에 속한 줄은 팝업에서 더해 내려오는 값이라 검사하지 않는다.
   */
  const requiredRows = useMemo(() => {
    const rows: { code: string; detail: string[] | null }[] = []
    picked.forEach((code) => {
      // 상세입력 마디에 속한 항목은 표에서 그 마디 한 줄로 모인다
      const detail = detailCodeOf(code)
      const rowCode = detail ?? code
      let row = rows.find((one) => one.code === rowCode)
      if (!row) {
        row = { code: rowCode, detail: detail ? [] : null }
        rows.push(row)
      }
      row.detail?.push(code)
    })
    return rows
  }, [picked])

  const emptyOf = (values: Record<string, string>, details: DetailValues) =>
    requiredRows.flatMap((row) =>
      years
        .filter((year) =>
          row.detail
            ? // 상세입력 줄은 팝업에 하나라도 넣었는지로 본다
              !row.detail.some((code) => (details[code]?.[year] ?? "").trim())
            : !(values[`use-${row.code}-${year}`] ?? "").trim(),
        )
        .map((year) => `use-${row.code}-${year}`),
    )

  // 한 번 검사한 뒤에는 값을 넣을 때마다 저절로 다시 본다
  const emptyKeys = useMemo(
    () => (hasTried ? emptyOf(useValues, detailValues) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [hasTried, requiredRows, years, useValues, detailValues],
  )

  const putValue = (key: string, value: string) =>
    setUseValues((prev) => ({ ...prev, [key]: value }))

  /** 그 줄·그 해의 사용량. 아직 안 들어왔으면 null 이다. */
  const useAmountOf = (item: PickedItem, year: string) => {
    if (item.detail) {
      const filled = item.detail.some((code) =>
        (detailValues[code]?.[year] ?? "").trim(),
      )
      return filled
        ? formatAmount(sumOf(item.detail, year, detailValues))
        : null
    }
    return (useValues[`use-${item.code}-${year}`] ?? "").trim() || null
  }

  const handleNext = (event: React.MouseEvent) => {
    setHasTried(true)
    const empty = emptyOf(useValues, detailValues)
    if (!empty.length) return

    event.preventDefault()
    // 빈 칸이 접힌 묶음 안에 있을 수 있어 모두 펼쳐 보여 준다
    setClosed([])
    window.setTimeout(() => {
      const first = fieldsRef.current?.querySelector<HTMLElement>(
        `[name="${empty[0]}"], [data-name="${empty[0]}"]`,
      )
      first?.focus()
      first?.scrollIntoView({ block: "center" })
    }, 0)
  }

  const handleSave = (codes: string[]) => {
    setPicked(codes)
    setSavedAt((count) => count + 1)
  }

  // 팝업을 닫고 나면 방금 만들어진 입력 표가 눈에 들어오도록 옮겨 준다.
  // 팝업이 닫히는 동안에는 본문 굴림이 잠겨 있어 바로 옮기면 제자리로 되돌아간다.
  useEffect(() => {
    if (!savedAt) return
    const timer = window.setTimeout(() => {
      // 부드러운 굴림은 환경에 따라 통째로 무시되는 곳이 있어 곧바로 옮긴다
      cardRef.current?.scrollIntoView({ block: "end" })
    }, 350)
    return () => window.clearTimeout(timer)
  }, [savedAt])

  const groups = useMemo(() => groupPicked(picked), [picked])

  // 필수 대분류를 하나라도 안 담았으면 위쪽 경고를 띄운다
  const missingRequired = REQUIRED_CATEGORIES.some(
    (code) => !picked.some((one) => one.startsWith(code)),
  )
  const toggleGroup = (code: string) =>
    setClosed((list) =>
      list.includes(code)
        ? list.filter((one) => one !== code)
        : [...list, code],
    )

  return (
    <div className="flex w-full max-w-316 flex-col md:gap-10 md:px-7 md:pt-15 md:pb-30 lg:px-8 lg:pb-32">
      <StepMobileNav
        title="인벤토리 배출량 산정"
        step={2}
        total={steps.length}
      />

      <div className="flex flex-col gap-8 max-md:hidden lg:flex-row lg:items-center lg:justify-between">
        <h2 className="text-ink-strong text-lg font-bold whitespace-nowrap md:text-3xl lg:text-4xl">
          인벤토리 배출량 산정
        </h2>
        {/* Stepper 내부 ol 의 줄바꿈·폭을 밖에서 제어한다. 지우면 스테퍼가 접힌다. */}
        <div className="[&_ol]:flex-nowrap sm:w-full sm:[&_ol]:w-full sm:[&_ol>li]:flex-1 sm:[&_ol>li>div:nth-child(1)]:flex-1 sm:[&_ol>li>div:nth-child(3)]:flex-1 lg:w-182">
          <Stepper items={steps} activeIndex={1} size={13} />
        </div>
      </div>

      <BaseInfo items={NOTICES} />

      <div className="flex flex-col gap-6 max-md:px-5 max-md:pt-12 max-md:pb-25">
        {/* Scope 설명은 안내 박스와 경고 배너 사이에 오른쪽으로 붙는다 */}
        <div className="flex justify-end">
          <ScopeGuideDialog
            trigger={
              <Button
                type="button"
                variant="outline"
                /* 시안 다크는 이 버튼만 테두리·글자를 #d2d2d2 로 밝게 쓴다 */
                className="text-ink-hint ring-ink-hint dark:text-ink-muted dark:ring-ink-muted h-11 gap-1.5 rounded-md px-3 text-sm font-bold md:text-xs [&_svg]:size-5"
              >
                <CircleAlert aria-hidden="true" />
                Scope 설명
              </Button>
            }
          />
        </div>

        {/* 필수 인벤토리를 다 담으면 사라진다 */}
        {missingRequired ? (
          <p className="bg-surface-flow border-surface-action text-ink-strong rounded-xl border px-4 py-4 text-left text-base font-medium break-keep md:px-6 lg:text-center">
            {/* 어두운 화면은 시안이 한 단계 옅은 빨강을 쓴다 */}
            <span className="text-ink-error font-bold dark:text-destructive">
              {WARNING_TARGET}
            </span>
            {WARNING_REST}
          </p>
        ) : null}

        {/* 인벤토리를 아직 고르지 않은 상태 */}
        {picked.length === 0 ? (
          <section className="border-line-field bg-surface-card flex flex-col items-center gap-9 rounded-xl border px-5 pt-10 pb-14 md:gap-14 md:rounded-2xl md:px-8 md:pt-15 md:pb-19 lg:border-line-card lg:gap-10 lg:px-10 lg:pb-20 dark:lg:border-line-field">
            <div className="flex flex-col items-center gap-2 text-center">
              <p className="text-ink-strong text-xl font-bold break-keep md:text-2xl">
                [인벤토리 설정] 버튼을 눌러 인벤토리 항목을 선택해주세요
              </p>
              {/* 시안 다크는 #666666 이지만 카드 면(#222222) 대비가 2.3:1 이라 한 단계 밝게 둔다 */}
              <p className="text-ink-muted dark:text-ink-hint text-sm break-keep md:text-base">
                Scope 1⋅2⋅3 의 대분류를 고르고, 중분류⋅소분류 항목을 선택하면
                입력 필드가 생성 됩니다.
              </p>
            </div>

            <InventoryItemDialog
              value={picked}
              onSave={handleSave}
              trigger={
                <Button
                  type="button"
                  size="lg"
                  className="h-11.5 w-39 rounded-lg text-sm font-bold md:h-13 md:w-50"
                >
                  인벤토리 설정
                </Button>
              }
            />
          </section>
        ) : (
          /* 고른 항목이 있으면 배출량 산출 입력 표가 들어선다 */
          /* 시안 카드: 밝은 화면 면 없이 #eeeeee 테두리 · 어두운 화면 면 #111111 에 #eeeeee 40% 테두리 */
          <section className="border-line-field bg-surface-field flex flex-col gap-6 rounded-xl border px-5 py-8 max-md:py-6 md:rounded-2xl md:px-8 md:py-10 lg:border-line-card lg:px-10 dark:border-line-divider/40">
            {/* 시안은 제목 줄 아래에 구분선이 있고 버튼과 선 사이에 16 여백이 있다 */}
            <div className="border-line-card flex items-center justify-between gap-3 border-b pb-4">
              <h3 className="text-ink-strong text-lg font-bold break-keep md:text-xl">
                탄소배출량 산출 입력
              </h3>
              <InventoryItemDialog
                value={picked}
                onSave={handleSave}
                trigger={
                  <Button
                    type="button"
                    className="h-11 w-32 shrink-0 rounded-lg text-sm font-bold md:h-12 md:w-38"
                  >
                    인벤토리 추가
                  </Button>
                }
              />
            </div>

            {/*
              해상도마다 표 구조가 다르다.
              PC 는 사용량·배출량이 가로로, 태블릿은 세로로 쌓이고,
              모바일은 연도까지 세로로 풀린다. 칸은 어느 해상도에서나 한 벌이다.
            */}
            {/* 시안 다크는 카드 테두리만 #eeeeee 40% 로 띄운다 (칸·행 선은 그대로) */}
            <div
              ref={fieldsRef}
              className="border-line-card overflow-hidden rounded-lg border max-md:rounded-md dark:border-line-divider/40"
            >
              {/*
                머리 줄 — 모바일에는 없다.
                묶음 이름은 줄마다 단위와 함께 나가므로 여기서는 연도만 세운다.
                태블릿은 연도 한 벌, PC 는 묶음마다 한 벌이다.
              */}
              <div className="bg-surface-disabled border-line-card flex h-9.5 border-b max-md:hidden dark:border-line-divider/40">
                {/* 시안은 이 칸만 왼쪽으로 붙이고 안쪽 여백 20 을 준다 */}
                <span className="text-ink-muted flex w-50 shrink-0 items-center px-5 text-xs font-bold md:max-lg:w-32.5">
                  인벤토리
                </span>
                {/* 태블릿은 연도 한 벌만 세운다 */}
                <div className="border-line-card flex min-w-0 flex-1 border-l dark:border-line-divider/40 lg:hidden">
                  {years.map((year, index) => (
                    <span
                      key={year}
                      className={cn(
                        "text-ink-muted flex min-w-0 flex-1 items-center justify-center text-xs font-bold",
                        index < years.length - 1 &&
                          "border-line-card border-r dark:border-line-divider/40",
                      )}
                    >
                      {year}
                    </span>
                  ))}
                </div>
                {[USE_TITLE, EMIT_TITLE].map((title) => (
                  <div
                    key={title}
                    className="border-line-card flex min-w-0 flex-1 border-l dark:border-line-divider/40 max-lg:hidden"
                  >
                    {years.map((year, index) => (
                      <span
                        key={year}
                        className={cn(
                          "text-ink-muted flex min-w-0 flex-1 items-center justify-center text-xs font-bold",
                          index < years.length - 1 &&
                            "border-line-card border-r dark:border-line-divider/40",
                        )}
                      >
                        {year}
                      </span>
                    ))}
                  </div>
                ))}
              </div>

              {groups.map((group) => {
                const open = !closed.includes(group.code)
                return (
                  <div key={group.code}>
                    {/* 대분류 줄 */}
                    {/*
                      모바일 시안은 이 줄이 두 단이다.
                      윗단에 Scope 뱃지, 아랫단에 이름·건수와 오른쪽 끝 접기 버튼이 온다.
                    */}
                    <div className="bg-surface-field border-line-card flex h-13 items-center gap-2 border-b px-5 dark:border-line-divider/40 max-md:h-auto max-md:flex-wrap max-md:gap-x-1.5 max-md:gap-y-2 max-md:px-5 max-md:py-5">
                      <ScopeTag long scope={INVENTORY_SCOPE[group.code]} />
                      {group.required ? <RequiredTag /> : null}
                      {/* 모바일에서 뱃지 뒤를 끊어 이름부터 다음 줄로 내린다 */}
                      <span className="basis-full max-md:block md:hidden" />
                      <span
                        title={group.name}
                        className="text-ink-strong truncate text-sm font-bold md:text-base"
                      >
                        {group.name}
                      </span>
                      {/* 시안 다크는 건수를 한 단계 밝게 쓴다 */}
                      <span className="text-ink-hint dark:text-ink-muted shrink-0 text-xs font-bold">
                        {group.count}건
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleGroup(group.code)}
                        aria-expanded={open}
                        className="text-brand-primary ml-auto flex shrink-0 cursor-pointer items-center gap-2 text-sm font-bold md:text-base"
                      >
                        {open ? "접기" : "펼치기"}
                        {/* 시안 아이콘은 jt-chevron-bottom-mini-3px-round — 선 굵기 3 이다 */}
                        <ChevronUp
                          aria-hidden="true"
                          strokeWidth={3}
                          className={cn(
                            "size-3 transition-transform",
                            !open && "rotate-180",
                          )}
                        />
                      </button>
                    </div>

                    {open
                      ? group.subs.map((sub) => (
                          <div key={sub.code}>
                            {/* 중분류 띠 */}
                            <div className="bg-surface-flow border-line-card flex h-9.5 items-center gap-1.5 border-b px-5 dark:border-line-divider/40">
                              <span
                                title={sub.name}
                                className="text-ink-muted truncate text-sm font-bold md:text-base"
                              >
                                {sub.name}
                              </span>
                              <span className="text-ink-on-fill-muted shrink-0 text-xs font-bold">
                                {sub.items.length}건
                              </span>
                            </div>

                            {sub.items.map((item) => (
                              <div
                                key={item.code}
                                className="bg-surface-field border-line-card flex border-b max-md:flex-col max-md:gap-0 max-md:px-0 max-md:py-0 dark:border-line-divider/40 lg:min-h-18"
                              >
                                {/* 항목 이름 */}
                                <div className="border-line-card flex shrink-0 items-center gap-2 px-5 dark:border-line-divider/40 max-md:border-b max-md:px-5 max-md:py-2.5 md:w-50 md:max-lg:w-32.5 md:max-lg:flex-col md:max-lg:items-start md:max-lg:justify-center">
                                  {/* 어떤 항목인지가 요점이라 줄임표 대신 줄바꿈으로 둔다 */}
                                  <span
                                    title={item.name}
                                    className="text-ink-strong min-w-0 text-xs font-bold break-keep"
                                  >
                                    {item.name}
                                  </span>
                                  {/* 하위 항목을 따로 받는 줄은 팝업으로 넘긴다 */}
                                  {item.detail ? (
                                    <DetailDialog
                                      item={item}
                                      years={years}
                                      values={detailValues}
                                      onSave={setDetailValues}
                                    />
                                  ) : null}
                                </div>

                                {/* 사용량·배출량 두 묶음 — PC 는 가로, 그 아래는 세로다 */}
                                <div className="flex min-w-0 flex-1 flex-col self-stretch lg:flex-row">
                                  {[
                                    { title: USE_TITLE, input: true },
                                    { title: EMIT_TITLE, input: false },
                                  ].map((column, columnIndex) => (
                                    <div
                                      key={column.title}
                                      className={cn(
                                        "border-line-card flex min-w-0 flex-1 flex-col justify-center gap-1.5 px-5 dark:border-line-divider/40 max-md:py-5 md:border-l md:py-3 md:max-lg:py-2.5",
                                        // 모바일 시안은 묶음 사이를 칸 안쪽 여백까지 가르는 선으로 나눈다
                                        columnIndex === 0 && "max-md:border-b",
                                      )}
                                    >
                                      {/*
                                        묶음 이름이 단위를 안고 간다.
                                        PC 도 태블릿과 같은 자리에 같은 모양으로 둔다.
                                      */}
                                      <span className="text-ink-hint text-xs font-bold">
                                        {/* 상세입력 마디·목록형처럼 단위가 없는 줄은 이름만 둔다 */}
                                        {column.input &&
                                        INVENTORY_UNIT[item.code]
                                          ? `${column.title} (${INVENTORY_UNIT[item.code]})`
                                          : column.title}
                                      </span>
                                      <div className="flex min-w-0 gap-3 max-md:flex-col max-md:gap-2 md:max-lg:gap-2">
                                        {years.map((year) => (
                                          <div
                                            key={year}
                                            className="flex min-w-0 items-center gap-2 max-md:flex-col max-md:items-stretch max-md:gap-0 md:flex-1"
                                          >
                                            {/* 모바일은 칸마다 연도를 붙인다 */}
                                            <span className="text-ink-muted shrink-0 text-xs font-bold max-md:w-auto md:hidden">
                                              {year}
                                            </span>
                                            {column.input ? (
                                              <ItemInput
                                                item={item}
                                                year={year}
                                                detailValues={detailValues}
                                                value={
                                                  useValues[
                                                    `use-${item.code}-${year}`
                                                  ] ?? ""
                                                }
                                                onChange={(next) =>
                                                  putValue(
                                                    `use-${item.code}-${year}`,
                                                    next,
                                                  )
                                                }
                                                invalid={emptyKeys.includes(
                                                  `use-${item.code}-${year}`,
                                                )}
                                              />
                                            ) : (
                                              // 사용량이 들어와야 계산된다. 연계 시 이 자리에 산출식이 붙는다.
                                              <AutoCell
                                                value={
                                                  useAmountOf(item, year) ===
                                                  null
                                                    ? null
                                                    : "0"
                                                }
                                              />
                                            )}
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        ))
                      : null}
                  </div>
                )
              })}
            </div>
            {/* 총배출량 — 값은 연계 시 위 입력에서 산출된다 */}
            <div
              ref={cardRef}
              className="bg-surface-flow flex flex-col gap-10 rounded-md p-5 md:p-10"
            >
              <p className="text-ink-strong text-center text-xl font-bold max-md:text-lg">
                온실가스 총배출량
              </p>
              <div className="flex flex-col items-center justify-center gap-6 md:flex-row md:gap-8 lg:gap-15">
                {years.map((year, index) => (
                  <Fragment key={year}>
                    {/* 시안은 연도 사이에 41 높이의 세로 선을 둔다 */}
                    {index > 0 ? (
                      <span
                        aria-hidden="true"
                        className="bg-surface-action shrink-0 max-md:h-px max-md:w-10 md:h-10 md:w-px"
                      />
                    ) : null}
                    <div className="flex flex-col items-center gap-2">
                      <span className="bg-surface-panel text-ink-body inline-flex h-7 items-center rounded-full px-4 text-xs font-bold">
                        {year}년
                      </span>
                      <p className="text-brand-primary text-2xl font-bold max-md:text-xl">
                        {TOTAL_BY_YEAR[index] ?? "0"}
                        {/* 시안에서 단위만 Regular 다 */}
                        <span className="text-ink-muted ml-1.5 text-xs font-normal">
                          kgCO₂eq
                        </span>
                      </p>
                    </div>
                  </Fragment>
                ))}
              </div>
              <div className="bg-surface-field text-ink-strong flex h-13 items-center justify-center rounded-md px-4 text-sm max-md:h-auto max-md:py-5">
                {/*
                  모바일 시안은 두 줄을 서로 왼쪽에 맞춘 뒤 묶음째 가운데에 둔다.
                  줄마다 가운데 정렬하면 "Scope 3" 줄이 안쪽으로 밀려 시안과 어긋난다.
                */}
                <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1 max-md:flex-col max-md:items-start max-md:gap-y-4">
                  {/* 시안은 라벨만 Regular 고 값이 Bold 다 */}
                  <span className="flex gap-2">
                    Scope 1&amp;2:
                    <span className="font-bold">{SCOPE12_TOTAL}</span>
                  </span>
                  <span className="flex gap-2">
                    Scope 3:
                    <span className="font-bold">{SCOPE3_TOTAL}</span>
                  </span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 검사 결과. 다른 자가진단 화면과 같은 자리·같은 표기다 */}
        {hasTried && emptyKeys.length > 0 ? (
          <p className="text-ink-error mt-4 text-sm font-medium break-keep">
            사용량을 입력하지 않은 칸이 {emptyKeys.length}개 있습니다.
          </p>
        ) : null}

        <div className="mt-4 grid grid-cols-2 gap-2 md:flex md:items-center md:justify-between md:gap-3">
          <Link href={prevHref} className="min-w-0">
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="border-brand-primary text-brand-primary hover:bg-surface-flow h-11.5 w-full gap-1 rounded-lg text-sm font-bold md:h-13 md:w-42 [&_svg]:size-5"
            >
              <ArrowLeft aria-hidden="true" />
              이전으로
            </Button>
          </Link>
          <Link href={nextHref} className="min-w-0" onClick={handleNext}>
            <Button
              type="button"
              size="lg"
              className="h-11.5 w-full gap-1 rounded-lg text-sm font-bold md:h-13 md:w-50 [&_svg]:size-5"
            >
              다음으로
              <ArrowRight aria-hidden="true" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

/**
 * IA 13번 "인벤토리 상세 입력 팝업" 전용 진입점.
 * 표 없이 팝업만 보는 라우트라, 마디 코드 하나로 줄을 만들어 넘긴다.
 */
export const DetailInputDialog = ({
  code,
  years = YEARS,
  defaultOpen,
}: {
  /** INVENTORY_DETAIL 의 마디 코드 */
  code: string
  years?: string[]
  defaultOpen?: boolean
}) => {
  const [values, setValues] = useState<DetailValues>({})
  const item: PickedItem = {
    code,
    name: NAME_BY_CODE[code] ?? code,
    detail: LEAF_CODES.filter((leaf) => leaf.startsWith(code)),
  }

  return (
    <DetailDialog
      item={item}
      years={years}
      values={values}
      onSave={setValues}
      defaultOpen={defaultOpen}
    />
  )
}

export default InventoryEmission
