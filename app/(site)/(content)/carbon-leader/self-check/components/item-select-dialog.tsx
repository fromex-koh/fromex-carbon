"use client"

import { useEffect, useMemo, useState } from "react"
import { ChevronDown, Search, SearchX } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogClose,
  DialogCloseButton,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import ItemSelectPagination from "@/app/(site)/(content)/carbon-leader/self-check/components/item-select-pagination"
import { useDialogAutoOpen } from "@/util/use-dialog-auto-open"
import {
  DEFAULT_GROUP_KEY,
  GROUP_BY_KEY,
  LEAVES,
  PER_PAGE,
  SCOPES,
  TOTAL_COUNT,
  leafBadge,
  type EmissionLeaf,
} from "@/constants/carbon-leader-self-check-emission-items"

// 선택 개수 표기 "0/373" — 앞 숫자만 강조된다.
const Count = ({ selected, total }: { selected: number; total: number }) => (
  <span className="text-ash-700 shrink-0 text-xs">
    <span className="text-primary font-bold">{selected}</span>/{total}
  </span>
)

// 목록에 노출할 항목이 없을 때.
const EmptyItems = ({ message }: { message: string }) => (
  <div className="bg-ash-100 flex flex-1 flex-col items-center justify-center-safe gap-2 overflow-y-auto rounded-2xl px-6 py-4 text-center sm:py-8 lg:py-10">
    <SearchX
      aria-hidden="true"
      className="text-ash-400 size-8 shrink-0 max-sm:hidden lg:size-10"
    />
    <p className="text-ash-800 text-base font-bold break-all">{message}</p>
  </div>
)

const ItemSelectDialog = ({
  defaultOpen,
  emptyItems,
  onConfirm,
  value,
}: {
  defaultOpen?: boolean
  /** 퍼블리싱 확인용 — 목록을 비워 "항목 없음" 화면을 그대로 노출한다. */
  emptyItems?: boolean
  /** [선택] 을 누르면 고른 소분류 항목을 넘긴다. */
  onConfirm?: (leaves: EmissionLeaf[]) => void
  /** 이미 확정된 항목. 모달을 다시 열면 이 값이 체크된 상태로 복원된다. */
  value?: EmissionLeaf[]
}) => {
  const [open, setOpen] = useDialogAutoOpen(defaultOpen)

  const [checked, setChecked] = useState<string[]>([])
  const [openScopes, setOpenScopes] = useState<string[]>([SCOPES[0].key])
  const [openMajors, setOpenMajors] = useState<string[]>([
    SCOPES[0].majors[0].key,
  ])
  const [activeGroup, setActiveGroup] = useState(DEFAULT_GROUP_KEY)
  const [page, setPage] = useState(1)
  const [keyword, setKeyword] = useState("")

  // 확정된 선택은 모달을 다시 열 때 그대로 복원한다. 검색어·페이지는 초기화한다.
  const confirmedIds = useMemo(
    () => (value ?? []).map((leaf) => leaf.id),
    [value],
  )

  useEffect(() => {
    if (!open) return

    setChecked(confirmedIds)
    setKeyword("")
    setPage(1)

    const first = value?.[0]
    if (!first) return

    // 고른 항목이 있는 분류를 펼쳐서 바로 확인·수정할 수 있게 한다.
    const majorKey = `${first.scope}||${first.major}`
    setOpenScopes((prev) =>
      prev.includes(first.scope) ? prev : [...prev, first.scope],
    )
    setOpenMajors((prev) =>
      prev.includes(majorKey) ? prev : [...prev, majorKey],
    )
    setActiveGroup(`${majorKey}||${first.mid}`)
  }, [open, confirmedIds, value])

  const toggle = (list: string[], id: string) =>
    list.includes(id) ? list.filter((x) => x !== id) : [...list, id]

  const selected = new Set(checked)
  const countOf = (leaves: EmissionLeaf[]) =>
    leaves.filter((leaf) => selected.has(leaf.id)).length

  // 하위가 일부만 선택된 상태. 체크박스에 "-" 로 표시한다.
  const isPartial = (leaves: EmissionLeaf[]) => {
    const count = countOf(leaves)
    return count > 0 && count < leaves.length
  }

  // 하위 항목이 모두 선택돼 있으면 전체 해제, 아니면 전체 선택.
  const toggleLeaves = (leaves: EmissionLeaf[]) => {
    const ids = leaves.map((leaf) => leaf.id)
    const allOn = ids.every((id) => selected.has(id))
    setChecked((prev) =>
      allOn
        ? prev.filter((id) => !ids.includes(id))
        : [...prev, ...ids.filter((id) => !prev.includes(id))],
    )
  }

  // 검색어가 있으면 전체 항목에서 찾고, 없으면 좌측에서 고른 분류의 항목만 노출한다.
  const query = keyword.trim()
  const currentGroup = GROUP_BY_KEY[activeGroup]
  const listLeaves = emptyItems
    ? []
    : query
      ? LEAVES.filter((leaf) =>
          `${leaf.name} ${leaf.mid} ${leaf.major} ${leaf.scope}`.includes(
            query,
          ),
        )
      : (currentGroup?.leaves ?? [])

  const totalPage = Math.max(1, Math.ceil(listLeaves.length / PER_PAGE))
  const currentPage = Math.min(page, totalPage)
  const visibleLeaves = listLeaves.slice(
    (currentPage - 1) * PER_PAGE,
    currentPage * PER_PAGE,
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          size="lg"
          className="h-11 min-w-38 px-5 font-bold md:h-13 md:min-w-50 md:px-12"
        >
          인벤토리 추가
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[80dvh] w-[calc(100%-1.25rem)] max-w-none gap-0 rounded-xl p-0 sm:w-[calc(100%-4rem)] sm:max-w-[640px] lg:max-h-[90dvh] lg:max-w-[1172px]">
        <div className="flex max-h-[80dvh] flex-col overflow-hidden rounded-xl lg:max-h-[90dvh]">
          <DialogCloseButton className="absolute -top-10 right-0 lg:top-5 lg:right-5" />

          <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-hidden px-5 pt-6 pb-6 sm:px-8 sm:pt-8 sm:pb-8 lg:gap-5 lg:px-20 lg:pt-13 lg:pb-5">
            <DialogHeader className="gap-2 text-left">
              <DialogTitle className="text-xl leading-normal font-bold break-all lg:text-3xl lg:leading-snug">
                인벤토리 항목을 선택해 주세요.
              </DialogTitle>
              <DialogDescription className="text-muted-foreground text-base break-all">
                좌측에서 Scope·대분류·중분류를 고르고, 우측에서 소분류 항목을
                선택합니다.
              </DialogDescription>
            </DialogHeader>

            <div className="relative">
              <Search
                aria-hidden="true"
                className="text-ash-500 pointer-events-none absolute inset-y-0 left-4 my-auto size-6 max-lg:hidden"
              />
              <Input
                type="search"
                id="item-select-search"
                name="item-select-search"
                placeholder="분류명 또는 배출 항목명을 검색해 보세요"
                aria-label="분류명 또는 배출 항목명 검색"
                value={keyword}
                onChange={(e) => {
                  setKeyword(e.target.value)
                  setPage(1)
                }}
                className="border-input h-12 rounded-md text-sm placeholder:font-medium lg:pl-12"
              />
            </div>

            <div className="grid min-h-0 flex-1 gap-5 max-lg:overflow-y-auto lg:grid-cols-[286px_1fr]">
              {/* 좌측: Scope · 대분류 · 중분류 트리 */}
              <div className="bg-ash-100 flex flex-col gap-5 rounded-xl px-6 py-5 lg:min-h-0 lg:overflow-hidden lg:rounded-2xl lg:p-6">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-ash-800 flex items-baseline gap-2 text-base font-medium whitespace-nowrap">
                    인벤토리 전체
                    <Count selected={checked.length} total={TOTAL_COUNT} />
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => toggleLeaves(LEAVES)}
                    className="border-input ring-input text-foreground h-8 shrink-0 rounded-md px-3 text-xs font-bold"
                  >
                    전체 선택
                  </Button>
                </div>

                <ul className="flex flex-col gap-3 lg:min-h-0 lg:flex-1 lg:overflow-x-hidden lg:overflow-y-auto">
                  {SCOPES.map((scope) => {
                    const scopeOpen = openScopes.includes(scope.key)

                    return (
                      <li key={scope.key} className="flex flex-col gap-3">
                        <div className="flex items-center gap-2">
                          <Checkbox
                            id={scope.key}
                            name={scope.key}
                            aria-label={`${scope.name} 전체 선택`}
                            checked={countOf(scope.leaves) > 0}
                            isOptionalCheck={isPartial(scope.leaves)}
                            onCheckedChange={() => toggleLeaves(scope.leaves)}
                            className="bg-background"
                          />
                          <button
                            type="button"
                            aria-expanded={scopeOpen}
                            onClick={() =>
                              setOpenScopes((prev) => toggle(prev, scope.key))
                            }
                            className="flex flex-1 cursor-pointer items-baseline gap-2 text-left text-sm font-bold"
                          >
                            {scope.name}
                            <Count
                              selected={countOf(scope.leaves)}
                              total={scope.leaves.length}
                            />
                          </button>
                          <button
                            type="button"
                            aria-label={`${scope.name} 하위 분류 ${scopeOpen ? "접기" : "펼치기"}`}
                            aria-expanded={scopeOpen}
                            onClick={() =>
                              setOpenScopes((prev) => toggle(prev, scope.key))
                            }
                            className="cursor-pointer"
                          >
                            <ChevronDown
                              aria-hidden="true"
                              className={cn(
                                "text-ash-700 size-4 transition-transform",
                                scopeOpen && "rotate-180",
                              )}
                            />
                          </button>
                        </div>

                        {scopeOpen && (
                          <ul className="flex flex-col gap-2">
                            {scope.majors.map((major) => {
                              // 중분류가 없는 대분류(용수·통근 등)는 대분류 행이 곧 목록 선택지다.
                              const onlyGroup =
                                major.groups.length === 1 &&
                                !major.groups[0].mid
                                  ? major.groups[0]
                                  : null
                              const majorOpen = openMajors.includes(major.key)
                              const majorActive = onlyGroup?.key === activeGroup

                              return (
                                <li
                                  key={major.key}
                                  className="flex flex-col gap-2"
                                >
                                  <div
                                    className={cn(
                                      "flex items-center gap-2 rounded-lg px-2 py-2",
                                      majorActive && "bg-sky-blue-light",
                                    )}
                                  >
                                    <Checkbox
                                      id={major.key}
                                      name={major.key}
                                      aria-label={`${major.name} 전체 선택`}
                                      checked={countOf(major.leaves) > 0}
                                      isOptionalCheck={isPartial(major.leaves)}
                                      onCheckedChange={() =>
                                        toggleLeaves(major.leaves)
                                      }
                                      className="bg-background"
                                    />
                                    <button
                                      type="button"
                                      aria-expanded={
                                        onlyGroup ? undefined : majorOpen
                                      }
                                      onClick={() => {
                                        if (!onlyGroup) {
                                          setOpenMajors((prev) =>
                                            toggle(prev, major.key),
                                          )
                                          return
                                        }
                                        setActiveGroup(onlyGroup.key)
                                        setPage(1)
                                      }}
                                      className={cn(
                                        "flex flex-1 cursor-pointer items-center gap-2 text-left text-sm font-bold",
                                        majorActive && "text-primary",
                                      )}
                                    >
                                      {major.name}
                                      {major.required && (
                                        <Badge
                                          variant="forest"
                                          className="shrink-0 px-2 py-0.5 text-xs font-bold"
                                        >
                                          필수
                                        </Badge>
                                      )}
                                    </button>
                                    <Count
                                      selected={countOf(major.leaves)}
                                      total={major.leaves.length}
                                    />
                                    {!onlyGroup && (
                                      <button
                                        type="button"
                                        aria-label={`${major.name} 하위 분류 ${majorOpen ? "접기" : "펼치기"}`}
                                        aria-expanded={majorOpen}
                                        onClick={() =>
                                          setOpenMajors((prev) =>
                                            toggle(prev, major.key),
                                          )
                                        }
                                        className="cursor-pointer"
                                      >
                                        <ChevronDown
                                          aria-hidden="true"
                                          className={cn(
                                            "text-ash-700 size-4 transition-transform",
                                            majorOpen && "rotate-180",
                                          )}
                                        />
                                      </button>
                                    )}
                                  </div>

                                  {!onlyGroup && majorOpen && (
                                    <ul className="flex flex-col gap-2 pl-4">
                                      {major.groups.map((group) => {
                                        const groupActive =
                                          group.key === activeGroup

                                        return (
                                          <li key={group.key}>
                                            <div
                                              className={cn(
                                                "flex items-center gap-2 rounded-lg px-2 py-2",
                                                groupActive &&
                                                  "bg-sky-blue-light",
                                              )}
                                            >
                                              <Checkbox
                                                id={group.key}
                                                name={group.key}
                                                aria-label={`${group.mid} 전체 선택`}
                                                checked={
                                                  countOf(group.leaves) > 0
                                                }
                                                isOptionalCheck={isPartial(
                                                  group.leaves,
                                                )}
                                                onCheckedChange={() =>
                                                  toggleLeaves(group.leaves)
                                                }
                                                className="bg-background"
                                              />
                                              <button
                                                type="button"
                                                onClick={() => {
                                                  setActiveGroup(group.key)
                                                  setPage(1)
                                                }}
                                                className={cn(
                                                  "flex flex-1 cursor-pointer items-center gap-2 text-left text-sm font-bold break-all",
                                                  groupActive && "text-primary",
                                                )}
                                              >
                                                {group.mid}
                                              </button>
                                              <Count
                                                selected={countOf(group.leaves)}
                                                total={group.leaves.length}
                                              />
                                            </div>
                                          </li>
                                        )
                                      })}
                                    </ul>
                                  )}
                                </li>
                              )
                            })}
                          </ul>
                        )}
                      </li>
                    )
                  })}
                </ul>
              </div>

              {/* 우측: 선택한 분류의 소분류 목록 */}
              <div className="flex flex-col gap-4 max-lg:pb-4 lg:min-h-0">
                {listLeaves.length === 0 ? (
                  <EmptyItems
                    message={
                      query
                        ? "검색 결과가 없습니다."
                        : "좌측에서 분류를 선택하면 소분류 항목이 표시됩니다."
                    }
                  />
                ) : (
                  <>
                    <ul className="flex flex-col gap-1.5 lg:flex-1 lg:overflow-y-auto">
                      {visibleLeaves.map((leaf) => {
                        const leafOn = selected.has(leaf.id)

                        return (
                          <li key={leaf.id}>
                            <button
                              type="button"
                              aria-pressed={leafOn}
                              onClick={() =>
                                setChecked((prev) => toggle(prev, leaf.id))
                              }
                              className={cn(
                                "flex w-full cursor-pointer flex-wrap items-center justify-between gap-x-4 gap-y-2 rounded-md border px-6 py-5 text-left",
                                leafOn
                                  ? "border-primary-light bg-sky-blue"
                                  : "border-transparent bg-ash-100",
                              )}
                            >
                              <span className="bg-sky-blue-light text-primary rounded-full px-4 py-1.5 text-xs font-bold break-all">
                                {leafBadge(leaf)}
                              </span>
                              <span className="text-ash-800 ml-auto shrink-0 text-sm font-bold">
                                {leaf.name}
                              </span>
                            </button>
                          </li>
                        )
                      })}
                    </ul>

                    {/* PC 는 목록 아래에 두고, 태블릿부터는 목록 위에 띄운다. */}
                    <div className="flex shrink-0 justify-center max-lg:sticky max-lg:bottom-4 max-lg:z-10">
                      <ItemSelectPagination
                        currentPage={currentPage}
                        setCurrentPage={setPage}
                        totalPage={totalPage}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="border-input flex flex-col gap-4 border-t px-5 py-5 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-20">
            <span className="flex items-baseline gap-2 text-sm font-bold whitespace-nowrap">
              선택한 항목
              <span className="text-ash-700">
                <span className="text-primary">{checked.length}</span>건
              </span>
            </span>

            <div className="flex gap-3 md:flex-none">
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    // 취소는 이번에 바꾼 내용을 버리고 확정 상태로 되돌린다.
                    setChecked(confirmedIds)
                    setKeyword("")
                    setPage(1)
                  }}
                  className="h-12 flex-1 px-4 font-bold md:w-30 md:flex-none"
                >
                  취소
                </Button>
              </DialogClose>
              <Button
                type="button"
                onClick={() => {
                  onConfirm?.(LEAVES.filter((leaf) => selected.has(leaf.id)))
                  setOpen(false)
                }}
                disabled={checked.length === 0}
                className="disabled:bg-ash-400 disabled:text-ash-200 h-12 flex-1 px-4 font-bold disabled:opacity-100 md:w-30 md:flex-none"
              >
                선택
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ItemSelectDialog
