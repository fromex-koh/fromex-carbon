"use client"

import { type FormEvent, useEffect, useRef, useState } from "react"

import {
  BadgeCheck,
  Check,
  Download,
  Leaf,
  MoreHorizontal,
  Puzzle,
  X,
} from "lucide-react"

import ConfirmDialog from "@/app/(site)/(content)/carbon-leader/self-check/components/confirm-dialog"
import SupplementRequestDialog from "@/app/(site)/(content)/my-page/components/supplement-request-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  STATUS_FILTER_ALL,
  STATUS_FILTERS,
  STATUS_GROUPS,
  STATUS_PAGE_SIZE,
  STATUS_SORTS,
  type StatusItem,
  type StatusTone,
} from "@/constants/my-page-status"
import { cn } from "@/lib/utils"
import { smoothScrollTo } from "@/util/smooth-scroll-to"

// IA "현황조회". 로그인 회원의 평가·신청 내역을 한 화면에 모아 본다.
// [퍼블리싱 노출용] 목록은 전부 시안에 그려진 값이다. 실데이터를 붙일 때 걷어낸다.

/**
 * 묶음 색과 아이콘.
 * 색은 시안 #3a96ff · #7852e9 · #27b0bb 가 그대로 토큰에 있다.
 * 아이콘은 시안 그대로 퍼즐 조각 · 인증 배지 · 잎사귀이고, lucide 에 같은 모양이 있다.
 */
const GROUP_TONE = {
  info: { badge: "bg-brand-info", card: "bg-brand-info/8", Icon: Puzzle },
  violet: {
    badge: "bg-brand-done-violet",
    card: "bg-brand-done-violet/8",
    Icon: BadgeCheck,
  },
  teal: {
    badge: "bg-brand-done-teal",
    card: "bg-brand-done-teal/8",
    Icon: Leaf,
  },
} as const

/** 줄 앞 상태 알약. 시안은 58x28 · r6 · 흰 면 · 13/700 이다 */
const STATUS_TONE: Record<string, string> = {
  진행중: "text-primary",
  완료: "text-ink-body",
  검토완료: "text-ink-body",
  만료: "text-ink-hint",
  // 보완요청만 흰 면이 아니라 붉은 면에 흰 글자다
  보완요청: "bg-destructive text-white",
}

/**
 * 결과 줄 오른쪽 필터. 시안은 활성만 진한 글자에 체크 아이콘이 붙는다.
 * "전체" 를 뺀 나머지는 아래 묶음 이름과 같아서 그대로 걸러 쓴다.
 */
const ALL = STATUS_FILTER_ALL
const FILTERS = STATUS_FILTERS

/** 정렬 셀렉트. 시안 패널은 120x92(46 두 줄)이다 */
const SORTS = STATUS_SORTS

const StatusCard = ({
  item,
  tone,
  onDelete,
}: {
  item: StatusItem
  tone: StatusTone
  onDelete: () => void
}) => {
  /** 패널의 [삭제하기] 로 여는 확인 모달 */
  const [deleteOpen, setDeleteOpen] = useState(false)
  // 보완요청이 붙은 카드는 아직 받을 확인서가 없어 다운로드를 감춘다
  const download = item.supplement ? undefined : item.download
  // 유효기간이 지난 건은 확인서를 받을 수 없어 버튼을 잠근다
  const expired = !!item.validity?.expired

  return (
    <li
      className={cn(
        "flex flex-col rounded-2xl px-5 py-5 md:px-8 md:py-7",
        GROUP_TONE[tone].card,
      )}
    >
      {/* 제목 줄. 오른쪽에 다운로드 링크와 더보기 점 세 개가 붙는다 */}
      <div className="flex items-start justify-between gap-3">
        {/* 시안은 어느 폭에서나 제목이 한 줄이다. 1024 아래에서 넘치면 앞 조각을 말줄임한다 */}
        <h4 className="text-ink-body flex min-w-0 items-center gap-x-1.5 text-lg font-bold break-keep max-lg:flex-nowrap md:gap-x-2 md:text-2xl lg:flex-wrap lg:gap-y-1">
          {item.title.map((part, index) => (
            <span
              key={part}
              className={cn(
                "flex min-w-0 items-center gap-1.5 md:gap-2",
                // 뒤 조각(여신심사용 등)은 줄이지 않고 앞 조각만 줄인다
                index > 0 && "shrink-0",
              )}
            >
              {index > 0 ? (
                <span
                  aria-hidden="true"
                  className="bg-ink-on-fill-muted size-1 shrink-0 rounded-full"
                />
              ) : null}
              <span className="max-lg:truncate">{part}</span>
            </span>
          ))}
        </h4>
        <div className="flex shrink-0 items-center gap-3">
          {/* 시안(PC 상태값)은 제목 줄 오른쪽, 다운로드 왼쪽에 붉은 테두리 알약이 붙는다.
              360 은 대신 카드 아래 전체폭 버튼이 나온다 */}
          {item.supplement ? (
            <SupplementRequestDialog>
              <button
                type="button"
                className="bg-destructive/10 text-destructive hover:bg-destructive/15 h-7.5 cursor-pointer rounded-md px-3 text-sm font-bold whitespace-nowrap transition-colors max-md:hidden"
              >
                보완요청 보기
              </button>
            </SupplementRequestDialog>
          ) : null}
          {download ? (
            <button
              type="button"
              disabled={expired}
              // 모바일은 아래 전체폭 버튼이 대신하므로 이 링크는 768 부터만 보인다.
              // 평소에는 면색 없이 글자만 둔다. 카드 면이 옅은 색이라 회색 hover 는 묻힌다.
              // 라이트는 흰 면으로 밝히고, 다크는 같은 방향(밝게)으로 흰색 10% 를 덮는다.
              // 다크에서 어두운 면(#111)을 깔면 차이가 작아 잘 안 보인다.
              className="text-primary hover:bg-surface-field dark:hover:bg-white/10 disabled:bg-fill-disabled disabled:text-ink-on-fill-muted disabled:hover:bg-fill-disabled dark:disabled:hover:bg-fill-disabled inline-flex h-7.5 cursor-pointer items-center gap-1.5 rounded-md px-2 text-sm font-bold whitespace-nowrap transition-colors max-md:hidden disabled:cursor-not-allowed [&_svg]:size-4"
            >
              <Download aria-hidden="true" />
              {download}
            </button>
          ) : null}
          {/* 시안 btn_기타 — 114x92 r8 흰 면 · 선 #d2d2d2, 항목 46 높이 15/500.
            수정하기 #666666 · 삭제하기 #ef4444 */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                aria-label="더 보기"
                className="text-ink-hint hover:bg-surface-field data-[state=open]:ring-primary inline-flex size-7 cursor-pointer items-center justify-center rounded transition-colors outline-hidden data-[state=open]:ring-2 [&_svg]:size-5"
              >
                <MoreHorizontal aria-hidden="true" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              sideOffset={6}
              className="border-line-field bg-surface-field w-27 rounded-lg p-0"
            >
              <DropdownMenuItem className="text-ink-muted focus:bg-surface-notice h-11 cursor-pointer justify-start rounded-none px-5 text-sm font-medium">
                수정하기
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => setDeleteOpen(true)}
                className="text-destructive focus:text-destructive focus:bg-surface-notice h-11 cursor-pointer justify-start rounded-none px-5 text-sm font-medium"
              >
                삭제하기
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2.5 md:mt-6">
        {item.rows.map((row) => (
          <div
            key={row.text}
            // 360 은 알약 · 설명 · 날짜가 위아래로 쌓이고, 768 부터 한 줄이 된다
            className="flex flex-col items-start gap-2 md:flex-row md:flex-nowrap md:items-center md:gap-3"
          >
            <span
              className={cn(
                "bg-surface-field inline-flex h-7 shrink-0 items-center justify-center rounded-md px-3 text-xs font-bold whitespace-nowrap",
                STATUS_TONE[row.status] ?? "text-ink-body",
              )}
            >
              {row.status}
            </span>
            {/* 768 구간만 한 줄로 줄인다. 360 은 줄이 세로로 쌓여 자리가 넉넉하므로
                시안대로 두 줄까지 흘려 쓴다 */}
            <p className="text-ink-body min-w-0 flex-1 text-sm font-medium break-keep md:text-base md:max-lg:truncate">
              {row.text}
            </p>
            <span className="text-ink-hint shrink-0 text-xs font-normal md:text-sm">
              {row.date}
            </span>
          </div>
        ))}

        {item.validity ? (
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="text-ink-hint text-xs font-bold md:text-sm">
              {item.validity.label}
            </span>
            {/* 시안은 기간이 정해진 카드만 값을 진하게 쓴다 */}
            <span
              className={cn(
                "text-xs md:text-sm",
                item.validity.expired
                  ? "text-ink-strong font-medium"
                  : "text-ink-hint font-normal",
              )}
            >
              {item.validity.value}
            </span>
            {item.validity.expired ? (
              <span className="text-destructive text-xs font-bold md:text-sm">
                만료
              </span>
            ) : null}
          </div>
        ) : null}

        {item.supplement ? (
          <SupplementRequestDialog>
            <button
              type="button"
              className="bg-destructive/10 text-destructive hover:bg-destructive/15 mt-1 h-10 w-full cursor-pointer rounded-md text-sm font-bold transition-colors md:hidden"
            >
              보완요청 보기
            </button>
          </SupplementRequestDialog>
        ) : null}
      </div>

      {/* 360 시안은 다운로드가 카드 맨 아래 전체폭 버튼이다. 768 부터는 제목 줄 오른쪽 링크만 남는다 */}
      {download ? (
        <button
          type="button"
          disabled={expired}
          className="bg-surface-action text-primary hover:bg-surface-flow disabled:bg-fill-disabled disabled:text-ink-on-fill-muted mt-2.5 inline-flex h-10 w-full cursor-pointer items-center justify-center gap-1.5 rounded-md text-sm font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-100 md:hidden [&_svg]:size-4"
        >
          <Download aria-hidden="true" />
          {download}
        </button>
      ) : null}

      {/* 자가진단 삭제 확인과 같은 껍데기를 쓴다 */}
      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="삭제하시겠습니까?"
        description="삭제된 데이터는 복구할 수 없습니다."
        cancelLabel="취소"
        confirmLabel="삭제하기"
        confirmTone="destructive"
        onConfirm={onDelete}
      />
    </li>
  )
}

/**
 * [퍼블리싱 노출용] 검색어 일치 판정.
 *
 * 지금은 목업(STATUS_GROUPS)을 화면에서 그대로 걸러 낸다.
 * 실제 API 를 붙일 때는 이 함수와 아래 pipeline 의 filter 한 줄만 걷어내고,
 * handleSearch 에서 query 를 서버로 넘긴 뒤 응답을 setGroups(seedOf(응답)) 하면 된다.
 * 정렬·묶음필터·페이징은 응답이 StatusGroup[] 모양이기만 하면 그대로 돈다.
 *
 * 판정 규칙 — 공백으로 끊은 낱말이 "모두" 들어 있어야 한다(AND). 대소문자는 무시한다.
 * 훑는 범위는 제목·상태·설명·등록일시·유효기간이다.
 */
const matchesKeyword = (item: StatusItem, keyword: string) => {
  if (!keyword) return true

  const haystack = [
    ...item.title,
    item.validity?.value ?? "",
    ...item.rows.flatMap((row) => [row.status, row.text, row.date]),
  ]
    .join(" ")
    .toLowerCase()

  return keyword
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((word) => haystack.includes(word))
}

/** 지우고 다시 그릴 때 줄이 섞이지 않도록 항목마다 고정 키를 매겨 둔다 */
const seedOf = (source: typeof STATUS_GROUPS) =>
  source.map((group) => ({
    ...group,
    items: group.items.map((item, index) => ({
      ...item,
      key: `${group.title}-${index}`,
    })),
  }))

const Status = ({
  /** 빈 화면 전용 라우트에서 목록을 비워 넘긴다 */
  groups: seed = STATUS_GROUPS,
}: {
  groups?: typeof STATUS_GROUPS
}) => {
  const [filter, setFilter] = useState(ALL)
  /** 입력칸에 적히는 값 */
  const [keyword, setKeyword] = useState("")
  const searchRef = useRef<HTMLInputElement>(null)
  /** [검색] 을 눌러 목록에 실제로 적용된 값. 입력 도중에는 목록이 흔들리지 않는다 */
  const [query, setQuery] = useState("")
  /** 묶음별로 지금까지 펼친 건수. [더보기] 를 누르면 STATUS_PAGE_SIZE 만큼 늘어난다 */
  const [shownCount, setShownCount] = useState<Record<string, number>>({})
  /** [더보기] 로 방금 펼친 묶음. 새로 나온 마지막 줄까지 화면을 옮기고 비운다 */
  const [expanded, setExpanded] = useState<string | null>(null)
  const [sort, setSort] = useState(SORTS[0])
  const [groups, setGroups] = useState(() => seedOf(seed))

  // 고른 묶음만 남기고, 그 안에서 등록일로 정렬한다.
  // 날짜가 같으면 원래 순서를 지킨다.
  const shown = groups
    .filter((group) => filter === ALL || group.title === filter)
    // 검색어 적용 — API 를 붙이면 이 한 줄을 지운다(서버가 걸러 준다)
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => matchesKeyword(item, query)),
    }))
    .map((group) => ({
      ...group,
      items: group.items
        .map((item, index) => ({ item, index }))
        .sort((a, b) => {
          const gap = (a.item.rows[0]?.date ?? "").localeCompare(
            b.item.rows[0]?.date ?? "",
          )
          const order = gap !== 0 ? gap : a.index - b.index
          return sort === "최신순" ? -order : order
        })
        .map(({ item }) => item),
    }))
    .map((group) => {
      const limit = shownCount[group.title] ?? STATUS_PAGE_SIZE
      return {
        ...group,
        // 묶음 전체 건수는 안내 문구에 쓰고, 화면에는 limit 까지만 그린다
        totalCount: group.items.length,
        rest: Math.max(group.items.length - limit, 0),
        // 버튼에 "1/5" 처럼 붙는 쪽수
        page: Math.ceil(limit / STATUS_PAGE_SIZE),
        pageTotal: Math.ceil(group.items.length / STATUS_PAGE_SIZE),
        items: group.items.slice(0, limit),
      }
    })

  const total = shown.reduce((sum, group) => sum + group.totalCount, 0)

  /** 검색어를 비우면 목록도 전체로 되돌린다. × 단추와 입력 비우기가 함께 쓴다 */
  const resetSearch = () => {
    setQuery("")
    setShownCount({})
  }

  /**
   * [검색] 또는 엔터. 여기가 API 를 끼워 넣을 자리다 —
   * 지금은 적힌 값을 목록에 적용만 하고, 실제로는 서버에 넘겨 받은 결과를
   * setGroups(seedOf(응답)) 로 갈아 끼우면 된다.
   */
  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setQuery(keyword.trim())
    // 검색 결과는 늘 첫 쪽부터 본다
    setShownCount({})
  }

  const showMore = (title: string) => {
    setShownCount((prev) => ({
      ...prev,
      [title]: (prev[title] ?? STATUS_PAGE_SIZE) + STATUS_PAGE_SIZE,
    }))
    setExpanded(title)
  }

  // 늘어난 줄이 그려진 뒤 마지막 카드를 화면 가운데로 올린다
  useEffect(() => {
    if (!expanded) return

    const timer = window.setTimeout(() => {
      const section = document.querySelector(
        `[data-group="${CSS.escape(expanded)}"]`,
      )
      const last = section?.querySelector("li:last-of-type")
      if (last) {
        const rect = last.getBoundingClientRect()
        const center =
          window.scrollY + rect.top - (window.innerHeight - rect.height) / 2
        const max = document.documentElement.scrollHeight - window.innerHeight
        smoothScrollTo(Math.min(Math.max(center, 0), max))
      }
      setExpanded(null)
    }, 60)

    return () => window.clearTimeout(timer)
  }, [expanded])

  // [삭제하기] 를 누른 카드를 목록에서 뺀다
  const handleDelete = (groupTitle: string, key: string) =>
    setGroups((prev) =>
      prev.map((group) =>
        group.title === groupTitle
          ? { ...group, items: group.items.filter((item) => item.key !== key) }
          : group,
      ),
    )

  return (
    <div className="flex w-full max-w-316 flex-col px-5 pt-10 pb-24 md:px-7 md:pt-12 md:pb-28 lg:px-8 lg:pt-14 lg:pb-42">
      <h2 className="text-ink-strong text-xl font-bold break-keep md:text-3xl">
        홍길동님, 안녕하세요
      </h2>

      {/* 검색 줄. 시안은 입력 테두리도 브랜드 파랑이다 */}
      <form onSubmit={handleSearch} className="mt-5 flex gap-2">
        <div className="relative flex min-w-0 flex-1 items-center">
          <input
            type="search"
            id="status-keyword"
            ref={searchRef}
            name="status-keyword"
            aria-label="현황 검색"
            placeholder="검색어를 입력해주세요"
            value={keyword}
            onChange={(event) => {
              const next = event.target.value
              setKeyword(next)
              // 입력을 비우면(× 버튼 포함) 검색을 누르지 않아도 전체로 돌아온다
              if (!next.trim()) resetSearch()
            }}
            // 브라우저가 그리는 기본 × 는 감추고 아래 단추로 대신한다
            className={cn(
              "border-primary bg-surface-field text-ink-strong placeholder:text-ink-placeholder focus-visible:ring-ash-600 h-12 w-full min-w-0 rounded-lg border px-6 text-base font-medium outline-hidden focus-visible:ring-2 md:h-14 [&::-webkit-search-cancel-button]:hidden",
              // 글자가 × 밑으로 들어가지 않게 적힌 동안만 오른쪽을 넓힌다
              keyword && "pr-14",
            )}
          />
          {/* 적힌 값이 있을 때만 나온다. 지우고 나서 포커스는 입력칸에 남긴다 */}
          {keyword ? (
            <button
              type="button"
              aria-label="검색어 지우기"
              onClick={() => {
                setKeyword("")
                resetSearch()
                searchRef.current?.focus()
              }}
              className="bg-fill-disabled hover:bg-ink-hint absolute right-5 inline-flex size-6 cursor-pointer items-center justify-center rounded-full text-white transition-colors [&_svg]:size-3.5"
            >
              <X aria-hidden="true" strokeWidth={3} />
            </button>
          ) : null}
        </div>
        {/* 360 시안에는 검색 버튼이 없다. 입력이 폭을 다 쓰고 엔터로 넘긴다 */}
        <button
          type="submit"
          className="bg-primary hover:bg-primary-dark inline-flex h-14 w-28 shrink-0 cursor-pointer items-center justify-center rounded-lg text-base font-medium text-white transition-colors max-md:hidden"
        >
          검색
        </button>
      </form>

      {/* 건수와 필터. 360 은 필터가 아래로 내려가 가로로 구른다 */}
      <div className="mt-12 flex flex-wrap items-center justify-between gap-x-2 gap-y-2 md:mt-14 md:gap-4">
        {/* 시안은 "n건" 만 브랜드 파랑 굵은 글씨다 */}
        <p className="text-ink-muted text-base font-medium">
          총 <span className="text-primary font-bold">{total}건</span>의 평가
          결과<span className="max-md:hidden">가 있습니다.</span>
        </p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 md:gap-4">
          {/* 768 부터는 시안대로 고스트 버튼이 늘어선다 */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-2 max-md:hidden md:gap-4">
            {FILTERS.map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => setFilter(name)}
                aria-pressed={filter === name}
                className={cn(
                  "hover:bg-accent inline-flex cursor-pointer items-center gap-1 rounded-md px-2 py-1 text-sm font-bold whitespace-nowrap transition-colors",
                  filter === name
                    ? "text-ink-strong"
                    : "text-ink-hint hover:text-ink-body",
                )}
              >
                {/* 시안은 켜진 항목 앞에만 20px 체크가 붙는다 */}
                {filter === name ? (
                  <Check
                    aria-hidden="true"
                    strokeWidth={2.5}
                    className="size-4"
                  />
                ) : null}
                {name}
              </button>
            ))}
          </div>
          {/* 360 시안은 버튼 대신 셀렉트 하나로 접힌다 */}
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger
              aria-label="분류"
              // 정렬 셀렉트와 같은 규칙 — 가장 긴 값("K-택소노미" 104px)에 맞춰
              // 폭을 고정해 고른 값에 따라 줄이 덜컹거리지 않게 한다
              className="text-ink-body hover:bg-accent w-26 shrink-0 justify-between gap-1 rounded-md border-0 bg-transparent px-2 py-1 text-sm font-bold whitespace-nowrap shadow-none transition-colors hover:ring-0 focus-visible:ring-0 data-[size=default]:h-auto md:hidden"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="center" className="w-40">
              {FILTERS.map((name) => (
                <SelectItem key={name} value={name} className="h-11 text-sm">
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span
            aria-hidden="true"
            className="bg-line-field h-3.5 w-px shrink-0 max-md:hidden"
          />
          {/* 시안은 테두리·면색 없는 셀렉트다. 달력 머리 셀렉트처럼 hover 에서만 배경이 뜬다 */}
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger
              aria-label="정렬"
              // hover 규칙·여백을 앞의 필터 버튼과 똑같이 맞춘다.
              // 원본이 높이와 hover 링을 arbitrary 변형으로 잡고 있어 같은 변형으로 덮는다.
              // 폭을 고정해 고른 값 길이에 따라 줄이 덜컹거리지 않게 한다.
              className="text-ink-body hover:bg-accent w-21 shrink-0 justify-between gap-1 rounded-md border-0 bg-transparent px-2 py-1 text-sm font-bold whitespace-nowrap shadow-none transition-colors hover:ring-0 focus-visible:ring-0 md:w-25 data-[size=default]:h-auto"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="center" className="w-30">
              {SORTS.map((name) => (
                <SelectItem key={name} value={name} className="h-11 text-sm">
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 묶음 세 개 */}
      <div className="mt-6 flex flex-col gap-8 md:gap-10">
        {shown.map((group) => (
          <section
            key={group.title}
            data-group={group.title}
            className="flex flex-col"
          >
            <div className="flex items-center gap-2.5 md:gap-3">
              {(() => {
                const { Icon } = GROUP_TONE[group.tone]
                return (
                  <span
                    aria-hidden="true"
                    className={cn(
                      "inline-flex size-7.5 shrink-0 items-center justify-center rounded-full text-white md:size-9.5 [&_svg]:size-4 md:[&_svg]:size-5",
                      GROUP_TONE[group.tone].badge,
                    )}
                  >
                    <Icon strokeWidth={2.25} />
                  </span>
                )
              })()}
              <h3 className="text-ink-strong text-xl font-bold break-keep md:text-2xl lg:text-3xl">
                {group.title}
              </h3>
            </div>
            {group.items.length === 0 ? (
              /* 시안에 없는 상태라 프로젝트의 기존 빈 화면 규격을 그대로 쓴다.
                 최종확인의 "첨부한 서류가 없습니다"(final-confirm.tsx 의 EmptyDocuments),
                 자가진단 STEP 3 의 "아직 추가된 사업이 없습니다" 와 같은 규칙 —
                 회색 면(surface-disabled) + 굵은 한 줄 + 흐린 보조 한 줄. */
              <div className="bg-surface-disabled mt-4 flex flex-col items-center gap-2 rounded-xl px-6 py-12 md:mt-6 md:rounded-2xl md:py-15">
                <p className="text-ink-strong text-base font-bold break-keep md:text-lg">
                  {query
                    ? `검색 결과가 없습니다.`
                    : `${group.title} 내역이 없습니다.`}
                </p>
                <p className="text-ink-muted text-sm break-keep">
                  {query
                    ? "다른 검색어로 다시 찾아보세요."
                    : "진행한 내역이 생기면 이곳에 표시됩니다."}
                </p>
              </div>
            ) : null}

            <ul className="mt-4 flex flex-col gap-3 empty:hidden md:mt-6">
              {group.items.map((item) => (
                <StatusCard
                  key={item.key}
                  item={item}
                  tone={group.tone}
                  onDelete={() => handleDelete(group.title, item.key)}
                />
              ))}
            </ul>

            {/* 남은 건이 있는 묶음에만 붙는다 */}
            {group.rest > 0 ? (
              <div className="mt-6 flex justify-center md:mt-8">
                {/* 시안 180x54 r8 — 흰 면에 브랜드 파랑 테두리·글자, 뒤에 쪽수가 붙는다.
                    쪽수는 "1" 만 파랑이고 "/5" 는 회색이다 */}
                <button
                  type="button"
                  onClick={() => showMore(group.title)}
                  className="border-primary bg-surface-field text-primary hover:bg-surface-flow inline-flex h-11.5 w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg border text-sm font-bold transition-colors md:h-13 md:w-42"
                >
                  더보기
                  <span className="text-xs font-bold">
                    {group.page}
                    <span className="text-ink-hint">/{group.pageTotal}</span>
                  </span>
                </button>
              </div>
            ) : null}
          </section>
        ))}
      </div>
    </div>
  )
}

export default Status
