"use client"

import { Fragment, useEffect, useMemo, useState } from "react"
import { ChevronDown, ChevronRight, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogCloseButton,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useDialogAutoOpen } from "@/util/use-dialog-auto-open"
import { cn } from "@/lib/utils"
import {
  INVENTORY_SCOPE,
  INVENTORY_TREE,
  type InventoryNode,
} from "@/constants/carbon-leader-inventory-items"

/** Scope 배지. 시안은 등급마다 면색이 다르다 */
const SCOPE_CLASS = {
  S: "bg-brand-done-violet",
  "S1-2": "bg-brand-info",
  S3: "bg-forest",
} as const

/** 배출량 산출 입력 표는 같은 배지를 긴 이름(Scope 1-2)으로 쓴다 */
const SCOPE_LABEL = {
  S: "Scope",
  "S1-2": "Scope 1-2",
  S3: "Scope 3",
} as const

export const ScopeTag = ({
  scope,
  long,
}: {
  scope: keyof typeof SCOPE_CLASS
  /** 시안 표에서는 82×28 에 "Scope 1-2" 로 길게 쓴다 */
  long?: boolean
}) => (
  <span
    className={cn(
      "text-ink-on-brand inline-flex shrink-0 items-center justify-center rounded-full text-xs font-bold",
      long ? "h-7 w-20.5" : "h-5 w-12",
      SCOPE_CLASS[scope],
    )}
  >
    {long ? SCOPE_LABEL[scope] : scope}
  </span>
)

/** 필수 대분류에 붙는 배지. 배출량 산출 입력 표에서도 같은 것을 쓴다 */
export const RequiredTag = ({ className }: { className?: string }) => (
  <span
    className={cn(
      "bg-destructive/20 text-destructive inline-flex h-5 w-9.5 shrink-0 items-center justify-center rounded-full text-xs font-bold",
      className,
    )}
  >
    필수
  </span>
)

/** 선택 수 / 전체 수. 앞자리만 브랜드 색이다 */
const Count = ({ picked, total }: { picked: number; total: number }) => (
  <span className="text-ink-muted shrink-0 text-xs font-bold">
    <span className="text-brand-primary">{picked}</span>/{total}
  </span>
)

/** 트리에서 펼칠 수 있는 마디인지 */
const hasChildren = (node: InventoryNode) => (node.children?.length ?? 0) > 0

/** 목록 한 줄. 잎 하나와 거기까지 오는 이름들이다 */
interface Leaf {
  code: string
  path: string[]
  level: number
}

/** 코드 자릿수가 곧 단계다. E01=1 · E0101=2 · E010101=3 · E01010101=4 */
const levelOf = (code: string) => (code.length - 1) / 2

/** 마디 아래 잎을 모두 모은다. 경로는 대분류를 뺀 중분류부터다 */
const leavesOf = (node: InventoryNode, trail: string[] = []): Leaf[] => {
  // 바로 윗 단계와 이름이 같으면 한 번만 적는다 (원유 › 원유 → 원유)
  const next = trail.at(-1) === node.name ? trail : [...trail, node.name]
  if (!hasChildren(node))
    return [{ code: node.code, path: next, level: levelOf(node.code) }]
  return (node.children ?? []).flatMap((child) => leavesOf(child, next))
}

/**
 * 트리에서 더 펼칠 마디인지.
 * 잎이 하나뿐이면 내려가 봐야 같은 이름 한 줄이라 여기서 끝낸다.
 */
const isBranch = (node: InventoryNode) =>
  hasChildren(node) && leavesOf(node).length > 1

/**
 * 잎마다 경로를 미리 매겨 둔다. 어느 마디를 골라도 같은 경로가 나온다.
 * 대분류(에너지 사용 등) 이름은 시안대로 경로에서 뺀다.
 */
const ALL_LEAVES: Leaf[] = INVENTORY_TREE.flatMap((category) =>
  hasChildren(category)
    ? (category.children ?? []).flatMap((child) => leavesOf(child))
    : leavesOf(category),
)

/** 고른 마디 아래 잎들. 코드 앞자리가 곧 부모라 앞자리로 고른다 */
const rowsOf = (node: InventoryNode): Leaf[] =>
  node.code === ROOT_CODE
    ? ALL_LEAVES
    : ALL_LEAVES.filter((leaf) => leaf.code.startsWith(node.code))

const countOf = (node: InventoryNode): number => rowsOf(node).length

/**
 * 굴림 막대. 기본 막대가 두껍고 면 색이 튀어 얇은 회색 알약으로 바꾼다.
 * 막대가 둥근 모서리를 물지 않도록, 굴림은 바깥 상자 안쪽 요소가 맡는다.
 */
const SCROLLBAR =
  "[&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-line-field [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:w-1.5 hover:[&::-webkit-scrollbar-thumb]:bg-ink-hint"

/**
 * 단계별 왼쪽 들여쓰기. 전체 6 · 대분류 16 · 중분류 70, 그 아래는 한 단계씩 더 민다.
 * 안쪽 여백이 아니라 바깥 여백이라 고른 줄의 면도 단계에 맞춰 들어온다.
 * 줄이 갖는 좌우 안쪽 여백(px-1.5)만큼 빼 둔 값이라 글자 자리는 그대로다.
 */
const INDENT = ["ml-0", "ml-2.5", "ml-16", "ml-21.5", "ml-27", "ml-32.5"]

/** 배지는 코드 앞 세 자리(대분류)로 정한다. 뿌리는 보라 S 다 */
const scopeOf = (code: string): keyof typeof SCOPE_CLASS =>
  code === ROOT_CODE ? "S" : INVENTORY_SCOPE[code.slice(0, 3)]

/** 트리 맨 위 "전체 인벤토리 항목" 줄의 코드 */
const ROOT_CODE = "S"

/**
 * 항목 코드의 윗 단계 코드들. 코드가 두 자리씩 늘어나므로 앞자리를 잘라 쓴다.
 * E01010201 → E01 · E0101 · E010102
 */
const ancestorsOf = (code: string) => {
  const list: string[] = []
  for (let end = 3; end < code.length; end += 2) list.push(code.slice(0, end))
  return list
}

/** 코드로 마디를 바로 찾으려고 트리를 한 번 펼쳐 둔다 */
const NODE_BY_CODE: Record<string, InventoryNode> = (() => {
  const map: Record<string, InventoryNode> = {}
  const walk = (node: InventoryNode) => {
    map[node.code] = node
    node.children?.forEach(walk)
  }
  INVENTORY_TREE.forEach(walk)
  return map
})()

/**
 * 항목 코드에 해당하는 트리 줄.
 * 잎이 하나뿐인 마디에서 트리가 멈추므로, 항목 자체가 아니라
 * 트리에 실제로 그려지는 가장 깊은 마디를 돌려준다.
 */
const visibleNodeOf = (code: string): InventoryNode | null => {
  for (const step of [...ancestorsOf(code), code]) {
    const node = NODE_BY_CODE[step]
    if (node && !isBranch(node)) return node
  }
  return NODE_BY_CODE[code] ?? null
}

interface TreeRowProps {
  node: InventoryNode
  depth: number
}

const InventoryItemDialog = ({
  defaultOpen,
  trigger,
  value,
  onSave,
}: {
  defaultOpen?: boolean
  /** 없으면 팝업 단독 라우트처럼 다이얼로그만 뜬다 */
  trigger?: React.ReactNode
  /** 화면이 들고 있는 선택. 팝업을 열 때 이 값에서 시작한다 */
  value?: string[]
  /** 저장을 누르면 고른 코드를 화면으로 올려 준다 */
  onSave?: (codes: string[]) => void
}) => {
  const [open, setOpen] = useDialogAutoOpen(defaultOpen)
  const [keyword, setKeyword] = useState("")
  // 펼쳐 둔 마디들. 단계 제한 없이 각각 접었다 폈다 한다.
  // 시안은 맨 위 "전체 인벤토리 항목" 이 펼쳐진 채로 시작한다.
  const [opened, setOpened] = useState<string[]>([ROOT_CODE])
  // 오른쪽 목록에 띄울 마디. null 이면 안내 문구가 나온다.
  const [current, setCurrent] = useState<InventoryNode | null>(null)
  const [picked, setPicked] = useState<string[]>(value ?? [])
  // 마지막으로 저장한 선택. 지금 고른 것과 다를 때만 저장 버튼이 열린다.
  const [saved, setSaved] = useState<string[]>(value ?? [])

  // 다시 열 때는 화면이 들고 있는 선택에서 시작한다.
  // 이미 담긴 항목이 보이도록 윗 단계를 모두 펼치고, 첫 항목을 골라 둬
  // 오른쪽 목록에도 담긴 것이 바로 뜨게 한다.
  useEffect(() => {
    if (!open) return
    const list = value ?? []
    setPicked(list)
    setSaved(list)
    setOpened([
      ROOT_CODE,
      ...new Set(list.flatMap((code) => ancestorsOf(code))),
    ])
    const first = [...list].sort()[0]
    setCurrent(first ? visibleNodeOf(first) : null)
  }, [open, value])

  // 켰다가 다시 끄면 저장한 상태로 돌아온 것이므로 저장 버튼도 닫혀야 한다.
  const dirty = useMemo(
    () =>
      picked.length !== saved.length ||
      picked.some((code) => !saved.includes(code)),
    [picked, saved],
  )

  const word = keyword.trim()
  const searching = word.length > 0

  // 검색어가 있으면 고른 마디와 상관없이 전체 432개에서 찾는다.
  // 왼쪽에서 무엇을 고르든 이름만으로 바로 찾게 하려는 것이다.
  const rows = useMemo(() => {
    if (word)
      return ALL_LEAVES.filter((leaf) => leaf.path.join(" ").includes(word))
    return current ? rowsOf(current) : []
  }, [current, word])

  const pickedIn = (node: InventoryNode) =>
    rowsOf(node).filter((leaf) => picked.includes(leaf.code)).length

  // 이미 화면으로 나가 있는 항목이 트리에서 어느 줄로 그려지는지 미리 모아 둔다.
  // 윗 분류까지 물들지 않도록 항목 줄만 담는다.
  const keptRows = useMemo(
    () =>
      new Set(
        saved
          .map((code) => visibleNodeOf(code)?.code)
          .filter((code): code is string => !!code),
      ),
    [saved],
  )

  const toggleItem = (id: string) => {
    setPicked((list) =>
      list.includes(id) ? list.filter((one) => one !== id) : [...list, id],
    )
  }

  const allPicked =
    rows.length > 0 && rows.every((r) => picked.includes(r.code))
  const somePicked = rows.some((r) => picked.includes(r.code))

  const toggleAll = () => {
    const ids = rows.map((r) => r.code)
    setPicked((list) =>
      allPicked
        ? list.filter((one) => !ids.includes(one))
        : [...new Set([...list, ...ids])],
    )
  }

  /**
   * 트리 한 줄. 세 단계가 들여쓰기로만 갈린다.
   * 전체 6 · 대분류 16 · 중분류 70 (중분류는 배지 자리만큼 밀린다)
   */
  const toggleOpen = (code: string) =>
    setOpened((list) =>
      list.includes(code)
        ? list.filter((one) => one !== code)
        : [...list, code],
    )

  /**
   * 트리 한 줄과 그 아래 가지.
   * 줄을 누르면 오른쪽 목록이 바뀌고, 화살표를 누르면 접었다 폈다 한다.
   * 단계 제한 없이 하위가 있으면 계속 내려간다.
   */
  const Row = ({ node, depth }: TreeRowProps) => {
    const on = current?.code === node.code
    const open = opened.includes(node.code)
    const branch = isBranch(node)
    // 이미 담겨 있던 항목 줄. 지금 보고 있는 줄이 아니면 초록으로 표시한다.
    const kept = !on && keptRows.has(node.code)

    return (
      <>
        <div
          className={cn(
            "flex h-7.5 shrink-0 items-center gap-1.5 rounded-lg border border-transparent px-1.5 lg:h-9",
            INDENT[Math.min(depth, INDENT.length - 1)],
            // 시안 다크는 면이 #001331, 선이 #222730 으로 밝은 화면과 맞물림이 반대다
            on &&
              "bg-surface-flow border-surface-action dark:bg-surface-action dark:border-surface-flow",
            kept && "bg-surface-kept border-line-kept",
            !on && !kept && "hover:bg-surface-flow/60",
          )}
        >
          <button
            type="button"
            onClick={() => setCurrent(node)}
            className="flex min-w-0 flex-1 cursor-pointer items-center gap-1.5 text-left"
          >
            {depth >= 2 ? null : <ScopeTag scope={scopeOf(node.code)} />}
            {node.required ? <RequiredTag className="-ml-0.5" /> : null}
            <span
              className={cn(
                "min-w-0 flex-1 truncate text-xs font-bold",
                on && "text-brand-primary dark:text-ink-strong",
                kept && "text-ink-kept",
                !on && !kept && "text-ink-strong",
              )}
            >
              {node.name}
            </span>
            <Count picked={pickedIn(node)} total={countOf(node)} />
          </button>
          <button
            type="button"
            onClick={() => branch && toggleOpen(node.code)}
            aria-label={`${node.name} ${open ? "접기" : "펼치기"}`}
            aria-expanded={branch ? open : undefined}
            disabled={!branch}
            className="ml-0.5 shrink-0 enabled:cursor-pointer"
          >
            <ChevronDown
              aria-hidden="true"
              className={cn(
                "text-ink-muted size-4 transition-transform",
                open && "rotate-180",
                !branch && "opacity-0",
              )}
            />
          </button>
        </div>
        {branch && open
          ? node.children?.map((child) => (
              <Row key={child.code} node={child} depth={depth + 1} />
            ))
          : null}
      </>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}
      {/* 원본이 sm:max-w-lg 로 폭을 잡고 있어 같은 변형으로 덮는다 */}
      <DialogContent className="flex max-h-[calc(100dvh-2.5rem)] w-[calc(100%-1.25rem)] max-w-[calc(100%-1.25rem)] flex-col gap-0 overflow-hidden rounded-xl p-0 sm:w-[calc(100%-4rem)] sm:max-w-293 md:w-[calc(100%-7.5rem)]">
        <DialogCloseButton className="absolute top-5 right-5" />

        <div className="flex min-h-0 flex-1 flex-col gap-2.5 px-5 pt-6 md:gap-5 md:px-8 md:pt-8 lg:px-15 lg:pt-10">
          <div className="flex items-baseline gap-3">
            <DialogTitle className="text-ink-strong text-xl font-bold break-keep lg:text-3xl">
              인벤토리 설정
            </DialogTitle>
            {searching ? (
              <span className="text-ink-muted text-sm font-bold break-keep">
                검색 결과 {rows.length}건
              </span>
            ) : current ? (
              <span className="text-ink-muted text-sm font-bold break-keep">
                {current.name}
              </span>
            ) : null}
          </div>

          {/*
            검색 칸 — 다른 화면 입력과 같은 테두리·높이 규격이다.
            겹침·초점 표시도 공통 Input·Select 와 같은 ash-600 두 겹 고리를 쓴다.
            고리는 안쪽 input 이 아니라 이 상자가 두르므로, 목표달성 평가 화면과
            같은 has-[:focus-visible] 를 쓴다.
          */}
          <div className="border-line-field bg-surface-field hover:ring-ash-600 has-[:focus-visible]:ring-ash-600 mt-2.5 flex h-13 shrink-0 items-center gap-2 rounded-md border px-4 outline-hidden transition-colors hover:ring-2 has-[:focus-visible]:ring-2 md:mt-0">
            <Search aria-hidden="true" className="text-ink-hint size-6" />
            <input
              // 이름이 없으면 브라우저가 "form field 에 id 나 name 이 없다"고 경고한다
              id="inventory-keyword"
              name="inventory-keyword"
              type="search"
              autoComplete="off"
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="인벤토리명 검색"
              aria-label="인벤토리명 검색"
              className="text-ink-body placeholder:text-ink-hint min-w-0 flex-1 bg-transparent text-sm font-medium outline-none"
            />
          </div>

          {/*
            분류를 접었다 펴도 팝업 높이가 흔들리지 않도록 두 상자의 키를 고정한다.
            최대 높이가 아니라 basis 라서 화면이 낮으면 여전히 줄어든다.
          */}
          <div className="flex min-h-0 flex-1 flex-col gap-2.5 md:gap-5 lg:basis-117 lg:flex-row">
            {/* 왼쪽 분류 트리 */}
            <div className="bg-surface-notice flex min-h-0 flex-col overflow-hidden rounded-2xl p-1.5 max-md:basis-91 md:max-lg:basis-95 lg:w-72 lg:shrink-0">
              <div
                className={cn(
                  "flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto px-1.5 py-2 lg:gap-1.5 lg:py-3.5",
                  SCROLLBAR,
                )}
              >
                <Row
                  node={{
                    code: ROOT_CODE,
                    name: "전체 인벤토리 항목",
                    children: INVENTORY_TREE,
                  }}
                  depth={0}
                />
              </div>
            </div>

            {/* 오른쪽 항목 목록 */}
            <div
              className={cn(
                "flex min-h-0 min-w-0 flex-1 rounded-2xl",
                rows.length === 0
                  ? "bg-surface-notice items-center justify-center p-6"
                  : // 화면이 낮으면 트리가 자리를 다 먹어 목록이 두 줄만 남는다.
                    // 목록에 네 줄 몫을 보장하고 모자란 만큼은 트리가 줄어 굴러간다.
                    "flex-col gap-1.5 overflow-hidden p-1.5 max-md:min-h-61 max-md:basis-41 md:max-lg:basis-43",
              )}
            >
              {rows.length === 0 ? (
                <p className="text-ink-hint text-center text-sm font-medium break-keep">
                  {searching ? (
                    <>
                      &lsquo;{word}&rsquo; 와 맞는 인벤토리가 없습니다.
                      <br />
                      다른 이름으로 찾아보세요.
                    </>
                  ) : (
                    <>
                      좌측 분류 트리에서 항목을 선택하면
                      <br />
                      하위 인벤토리 목록이 표시됩니다.
                    </>
                  )}
                </p>
              ) : (
                <>
                  {/*
                    머리 줄 — 시안은 높이 52 · 모서리 6 · 좌우 여백 20 이다.
                    굴림 상자 밖에 두어 지나가는 줄이 걸치지 않게 한다.
                  */}
                  <div
                    className={cn(
                      "flex h-13 shrink-0 items-center gap-2.5 rounded-md border border-transparent px-5",
                      // 하나라도 켜져 있으면 항목 줄과 같은 강조를 쓴다
                      allPicked || somePicked
                        ? "bg-surface-action border-surface-flow"
                        : "bg-surface-notice",
                    )}
                  >
                    <Checkbox
                      id="inventory-all"
                      checked={allPicked || somePicked}
                      isOptionalCheck={!allPicked && somePicked}
                      onCheckedChange={toggleAll}
                      className="border-line-field bg-surface-card size-5.5 cursor-pointer"
                    />
                    <label
                      htmlFor="inventory-all"
                      className={cn(
                        "flex-1 cursor-pointer text-xs font-bold",
                        allPicked || somePicked
                          ? "text-brand-primary"
                          : "text-ink-body",
                      )}
                    >
                      인벤토리 항목
                    </label>
                    {/* 시안에서 이 글자만 Regular 다 */}
                    <span className="text-ink-body text-xs">레벨</span>
                  </div>

                  <div
                    className={cn(
                      "flex min-h-0 flex-1 flex-col gap-1.5 overflow-y-auto",
                      SCROLLBAR,
                    )}
                  >
                    {rows.map((item) => {
                      const on = picked.includes(item.code)
                      // 이미 화면에 나가 있는 항목과 이번에 새로 고른 항목을 색으로 가른다
                      const kept = on && saved.includes(item.code)
                      return (
                        <div
                          key={item.code}
                          className={cn(
                            "flex h-13 shrink-0 items-center gap-2.5 rounded-md border border-transparent px-5",
                            !on && "bg-surface-notice",
                            // 새로 고른 줄은 시안 색 그대로 — 면 #d7e0f3 · 테두리 #ecf0f8
                            on &&
                              !kept &&
                              "bg-surface-action border-surface-flow",
                            // 이미 담겨 있던 줄은 한 단계 옅게 둬 새 선택이 눈에 띄게 한다
                            kept && "bg-surface-flow border-surface-action",
                          )}
                        >
                          <Checkbox
                            id={item.code}
                            checked={on}
                            onCheckedChange={() => toggleItem(item.code)}
                            className="border-line-field bg-surface-card size-5.5 cursor-pointer"
                          />
                          <label
                            htmlFor={item.code}
                            className="flex min-w-0 flex-1 cursor-pointer items-center gap-2 overflow-hidden text-xs font-bold"
                          >
                            {/*
                              위 단계는 자리가 모자라면 먼저 줄어들고, 좁은 화면에서는
                              아예 감춘다. 끝 이름이 잘리면 어떤 항목인지 알 수 없어서다.
                            */}
                            {item.path.length > 1 ? (
                              <span className="text-ink-hint flex min-w-0 items-center gap-2 truncate max-md:hidden">
                                {item.path.slice(0, -1).map((name, index) => (
                                  <Fragment key={`${item.code}-${index}`}>
                                    {index > 0 ? (
                                      <ChevronRight
                                        aria-hidden="true"
                                        className="size-3 shrink-0"
                                      />
                                    ) : null}
                                    {name}
                                  </Fragment>
                                ))}
                                <ChevronRight
                                  aria-hidden="true"
                                  className="size-3 shrink-0"
                                />
                              </span>
                            ) : null}
                            {/* 시안은 마지막 이름만 진하고 위 단계는 흐리다 */}
                            <span
                              className={cn(
                                "truncate",
                                // 새로 고른 줄만 끝 이름이 파랗게 든다
                                on && !kept
                                  ? "text-brand-primary"
                                  : "text-ink-body",
                              )}
                            >
                              {item.path[item.path.length - 1]}
                            </span>
                          </label>
                          {/* 시안에서 이 숫자만 Regular 다 */}
                          <span className="text-ink-body shrink-0 text-xs">
                            {item.level}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* 하단 바 — 위에 구분선이 있고 저장 버튼은 오른쪽 끝이다 */}
        <div className="border-line-field flex shrink-0 items-center justify-between gap-3 border-t px-5 py-5 md:px-8 lg:mt-5 lg:px-15">
          <p
            className={cn(
              "text-ink-error text-sm font-bold break-keep",
              !dirty && "invisible",
            )}
          >
            저장하지 않은 변경이 있습니다.
          </p>
          <Button
            type="button"
            size="lg"
            disabled={!dirty}
            onClick={() => {
              setSaved(picked)
              onSave?.(picked)
              if (onSave) setOpen(false)
            }}
            // 원본은 disabled 를 투명도로만 흐리는데, 시안은 면·글자색이 따로 있다
            className="disabled:bg-fill-disabled disabled:text-ink-on-fill-muted h-12 w-30 shrink-0 rounded-lg text-sm font-bold disabled:opacity-100 md:h-13 md:w-30.5 lg:w-32"
          >
            저장
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default InventoryItemDialog
