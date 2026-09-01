"use client"

import { useEffect, useState } from "react"

import { X } from "lucide-react"

import { Button } from "@/components/ui/button"
import SubAccountRegisterDialog, {
  type SubAccountDraft,
} from "@/app/(site)/(content)/my-page/components/sub-account-register-dialog"
import { cn } from "@/lib/utils"
import { smoothScrollTo } from "@/util/smooth-scroll-to"

// IA 58번 하위 "하위계정 관리".
// 기관회원이 등록해 둔 소속 담당자 계정을 보여 주는 화면이다.
// [퍼블리싱 노출용] 첫 목록은 시안에 그려진 두 건이다. 등록·삭제는 화면 안 상태로만 돌아간다.
// SUB_ACCOUNTS 를 빈 배열로 두면 처음부터 시안의 "등록된 하위 계정이 없습니다" 상태로 뜬다.

interface SubAccountRow {
  /** 계정 ID */
  id: string
  /** 담당자 이름 */
  manager: string
  /** 구분 / 소속 */
  team: string
  /** 사용 여부. 상태 알약의 색이 갈린다 */
  status: "active" | "suspended"
  /** 등록일 */
  registeredAt: string
}

const SUB_ACCOUNTS: SubAccountRow[] = [
  {
    id: "sub_001",
    manager: "홍길동",
    team: "기획팀",
    status: "active",
    registeredAt: "2026-08-26",
  },
  {
    id: "sub_002",
    manager: "홍길동",
    team: "기획팀",
    status: "suspended",
    registeredAt: "2026-08-26",
  },
]

const STATUS_LABEL: Record<SubAccountRow["status"], string> = {
  active: "사용",
  suspended: "사용정지",
}

/** 상태 알약. 색만 다르고 크기 규격은 같아서 공통으로 뺀다 */
const PILL =
  "inline-flex h-6.5 shrink-0 items-center justify-center rounded-full border px-4 text-xs font-bold whitespace-nowrap md:h-7 md:px-5 lg:h-7.5"

const STATUS_TONE: Record<SubAccountRow["status"], string> = {
  active: "bg-forest-light/20 border-forest text-forest",
  // 시안의 회색 알약은 라이트 #eee / 다크 #eee 40% — ink-on-disabled 가 그 짝이다
  suspended:
    "bg-ink-on-disabled border-line-muted text-ink-on-fill-muted dark:border-ink-muted",
}

/** PC·태블릿 표의 열 이름. 모바일에서는 마지막 "관리" 를 뺀 네 개만 이름표로 쓴다 */
const COLUMNS = ["계정 ID", "담당자", "구분 / 소속", "상태", "등록일", "관리"]

/** 모바일 카드 안 2×2 이름표. 표의 앞 두 열과 뒤 두 열을 접어 놓은 모양이다 */
const MOBILE_FIELDS: {
  label: string
  value: (row: SubAccountRow) => string
}[] = [
  { label: "계정 ID", value: (row) => row.id },
  { label: "담당자", value: (row) => row.manager },
  { label: "구분 / 소속", value: (row) => row.team },
  { label: "등록일", value: (row) => row.registeredAt },
]

/** 줄 오른쪽 X */
const DeleteIconButton = ({
  id,
  onDelete,
}: {
  id: string
  onDelete: () => void
}) => (
  <button
    type="button"
    onClick={onDelete}
    aria-label={`${id} 계정 삭제`}
    className="text-ink-strong hover:bg-surface-disabled inline-flex size-6 cursor-pointer items-center justify-center rounded-full transition-colors"
  >
    <X className="size-3.5" strokeWidth={2} />
  </button>
)

/** 등록일에 넣을 오늘 날짜. 시안과 같은 yyyy-MM-dd 다 */
const today = () => {
  const now = new Date()
  const pad = (value: number) => String(value).padStart(2, "0")
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
}

const SubAccount = () => {
  const [accounts, setAccounts] = useState<SubAccountRow[]>(SUB_ACCOUNTS)
  const [registerOpen, setRegisterOpen] = useState(false)
  /** 방금 등록한 계정 ID. 그 줄까지 화면을 옮기고 나면 비운다 */
  const [addedId, setAddedId] = useState<string | null>(null)
  const isEmpty = accounts.length === 0

  const handleRegister = (draft: SubAccountDraft) => {
    setAccounts((prev) => [
      ...prev,
      {
        id: draft.id,
        manager: draft.manager,
        team: draft.team,
        status: draft.status,
        registeredAt: today(),
      },
    ])
    setAddedId(draft.id)
  }

  // 등록 직후 새로 생긴 줄을 화면 가운데로 올린다.
  // 팝업이 닫히면서 Radix 가 body 스크롤 잠금을 풀고 [계정 추가] 로 포커스를 되돌리는데,
  // 그 전에 옮기면 스크롤이 도로 끌려가서 닫힘 애니메이션이 끝난 뒤에 움직인다.
  useEffect(() => {
    if (!addedId) return

    const timer = window.setTimeout(() => {
      const rows = document.querySelectorAll(
        `[data-account-id="${CSS.escape(addedId)}"]`,
      )
      // 표(PC·태블릿)와 카드 목록(모바일)이 같은 값을 그리므로 보이는 쪽만 고른다
      const visible = [...rows].find(
        (row) => (row as HTMLElement).offsetParent !== null,
      )
      if (visible) {
        const rect = visible.getBoundingClientRect()
        const center =
          window.scrollY + rect.top - (window.innerHeight - rect.height) / 2
        const max = document.documentElement.scrollHeight - window.innerHeight
        smoothScrollTo(Math.min(Math.max(center, 0), max))
      }
      setAddedId(null)
    }, 250)

    return () => window.clearTimeout(timer)
  }, [addedId])

  const handleDelete = (id: string) =>
    setAccounts((prev) => prev.filter((account) => account.id !== id))

  return (
    <div className="flex w-full max-w-316 flex-col px-5 pt-12 pb-24 md:px-7 md:pb-28 lg:px-8 lg:pt-14 lg:pb-42">
      {/* 모바일에는 카드 테두리가 없다. 시안대로 md 부터만 테두리·안여백이 붙는다 */}
      <section className="md:border-line-card flex flex-col md:rounded-2xl md:border md:p-8 lg:p-10">
        {/* 모바일은 [계정 추가] 가 안내 문구 아래로 내려가 폭을 꽉 채운다 */}
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between md:gap-4">
          <div className="flex min-w-0 flex-col gap-2 md:gap-3">
            <h2 className="text-ink-strong text-lg font-bold md:text-xl md:leading-8">
              등록된 계정
            </h2>
            <p className="text-ink-strong text-sm font-normal break-keep md:text-base">
              소속 담당자 계정을&nbsp;
              <span className="text-primary font-bold">{accounts.length}</span>
              개 등록해 두었습니다.
            </p>
          </div>
          {/* 모바일 빈 화면에서는 이 버튼이 아래 안내 상자 안으로 내려간다 */}
          <Button
            type="button"
            onClick={() => setRegisterOpen(true)}
            className={cn(
              "h-13 w-full shrink-0 rounded-lg text-sm font-bold md:w-47",
              isEmpty && "max-md:hidden",
            )}
          >
            계정 추가
          </Button>
        </div>

        {isEmpty ? (
          <div className="border-line-card mt-6 flex flex-col items-center justify-center gap-5 rounded-xl border px-5 py-10 md:mt-10 md:min-h-25 md:gap-0 md:rounded-none md:border-0 md:p-0 lg:min-h-29.5">
            <p className="text-ink-body text-base font-normal break-keep">
              등록된 하위 계정이 없습니다
            </p>
            <Button
              type="button"
              onClick={() => setRegisterOpen(true)}
              className="h-11.5 w-42 rounded-lg text-sm font-bold md:hidden"
            >
              계정 추가
            </Button>
          </div>
        ) : (
          <>
            {/* PC·태블릿: 표 */}
            <div className="border-line-card mt-10 overflow-hidden rounded-md border max-md:hidden">
              <table className="w-full table-fixed border-collapse">
                <colgroup>
                  <col className="w-3/12" />
                  <col />
                  <col />
                  <col />
                  <col />
                  <col className="w-1/12" />
                </colgroup>
                <thead>
                  <tr className="bg-surface-disabled">
                    {COLUMNS.map((column) => (
                      <th
                        key={column}
                        scope="col"
                        className="text-ink-muted h-9 px-2 text-xs font-bold"
                      >
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {accounts.map((account) => (
                    <tr
                      key={account.id}
                      data-account-id={account.id}
                      className="border-line-card h-17 border-t first:border-t-0 lg:h-14.5"
                    >
                      <td className="text-ink-strong px-2 text-center text-xs font-bold">
                        {account.id}
                      </td>
                      <td className="text-ink-strong px-2 text-center text-xs font-bold">
                        {account.manager}
                      </td>
                      <td className="text-ink-strong px-2 text-center text-xs font-bold">
                        {account.team}
                      </td>
                      <td className="px-2 text-center">
                        <span className={cn(PILL, STATUS_TONE[account.status])}>
                          {STATUS_LABEL[account.status]}
                        </span>
                      </td>
                      <td className="text-ink-strong px-2 text-center text-xs font-bold">
                        {account.registeredAt}
                      </td>
                      <td className="px-2 text-center">
                        <DeleteIconButton
                          id={account.id}
                          onDelete={() => handleDelete(account.id)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 모바일: 계정 한 건이 카드 한 장이 된다 */}
            <ul className="mt-6 flex flex-col gap-6 md:hidden">
              {accounts.map((account) => (
                <li
                  key={account.id}
                  data-account-id={account.id}
                  className="border-line-card flex flex-col rounded-2xl border px-5 py-6"
                >
                  {/* 폭이 좁아지면 계정 ID 를 말줄임하지 않고 알약 아래 줄로 내려 온전히 보여 준다.
                      break-words 는 최소 폭을 낱말 기준으로 잡아 줘서 글자가 아니라 줄이 먼저 넘어간다. */}
                  <div className="border-line-card flex items-start justify-between gap-3 border-b pb-7">
                    <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-3 gap-y-2">
                      <span className={cn(PILL, STATUS_TONE[account.status])}>
                        {STATUS_LABEL[account.status]}
                      </span>
                      <span className="text-ink-strong text-lg font-bold break-words">
                        {account.id}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDelete(account.id)}
                      aria-label={`${account.id} 계정 삭제`}
                      className="border-line-field text-ink-strong hover:bg-surface-disabled h-7 shrink-0 cursor-pointer rounded-md border px-3 text-xs font-bold transition-colors"
                    >
                      삭제
                    </button>
                  </div>
                  {/* 350 아래로 좁아지면 두 칸으로는 등록일이 잘려 한 칸으로 편다 */}
                  <dl className="mt-4 grid grid-cols-1 gap-2.5 min-[350px]:grid-cols-2">
                    {MOBILE_FIELDS.map((field) => (
                      <div
                        key={field.label}
                        className="flex flex-col gap-3 rounded-md px-2.5 py-3"
                      >
                        <dt className="text-ink-muted text-sm font-medium">
                          {field.label}
                        </dt>
                        <dd className="text-ink-strong text-base font-bold break-words">
                          {field.value(account)}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>

      <SubAccountRegisterDialog
        open={registerOpen}
        onOpenChange={setRegisterOpen}
        existingIds={accounts.map((account) => account.id)}
        onSubmit={handleRegister}
      />
    </div>
  )
}

export default SubAccount
