"use client"

import type { ReactNode } from "react"

import {
  Dialog,
  DialogCloseButton,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { useDialogAutoOpen } from "@/util/use-dialog-auto-open"

// 로그인 화면 기관회원 탭 바닥글의 [회원가입] 으로 여는 안내 팝업.
// 기관회원은 스스로 가입할 수 없고 담당자 확인을 거치므로, 절차만 알려 주고 끝난다.

/** 안내 문장 한 줄. strong 인 조각만 굵게 나온다 */
type NoticeLine = { text: string; strong?: boolean }[]

const TOP_NOTICES: NoticeLine[] = [
  [
    { text: "기관회원 가입은 " },
    { text: "기술보증기금 담당자 확인 후 진행", strong: true },
    { text: "됩니다." },
  ],
  [{ text: "아래 절차에 따라 진행해 주시기 바랍니다." }],
]

const BOTTOM_NOTICES: NoticeLine[] = [
  [{ text: "가입을 원하시는 기관회원은 담당자(051-606-7471)에게 연락주세요." }],
]

/** 대상 기관 표. 금융기관은 한 줄이라 글머리표가 없고, 지원기관만 목록이다 */
const TARGET_ROWS = [
  {
    head: "금융기관",
    bulleted: false,
    items: ["기금법 제2조3에 의한 금융회사(은행법에 의한 은행 등)"],
  },
  {
    head: "지원기관",
    bulleted: true,
    items: [
      "신용정보업 영위 기업 및 기술평가기관 지정 기업",
      "공공기관운영법 제4조에 따른 공공기관(공기업, 준정부기관, 기타공공기관)",
      "연구개발특구의 육성에 관한 특별법 시행령 제3조에 의한 공공연구기관",
      "벤처투자법에 의한 중소기업창업투자회사·조합 및 벤처투자회사·조합",
      "그 외 담당이사가 인정한 비영리법인(벤처기업협회, 중소기업기술혁신협회) 등",
      "한국형 녹색채권 외부검토기관 등록 및 관리규정 제4조에 의한 외부검토기관",
    ],
  },
]

const STEPS = [
  {
    title: "담당자 문의",
    desc: "기술보증기금 관계자와 통화 후 가입 의향을 전달해 주세요.",
  },
  {
    title: "필요서류 제출",
    desc: "담당자 안내에 따라 필요 서류를 제출해 주세요.",
  },
  {
    title: "승인 검토",
    desc: "기술보증기금 담당자가 제출 서류를 검토합니다.",
  },
  {
    title: "계정 발급",
    desc: "승인 완료 후 기관회원 ID / PW를 생성하여 전달드립니다.",
  },
  {
    title: "로그인 및 이용",
    desc: "전달받은 계정으로 로그인 후 서비스를 이용하실 수 있습니다.",
  },
]

/** 시안의 3px 점. 줄 높이가 서로 달라 위 여백을 밖에서 넘긴다 */
const Bullet = ({ className }: { className?: string }) => (
  <span aria-hidden="true" className="flex w-2.5 shrink-0 justify-center">
    <span
      className={cn("bg-ink-bullet size-0.75 shrink-0 rounded-full", className)}
    />
  </span>
)

/** 팝업 위아래에 같은 모양으로 들어가는 회색 안내 상자 */
const NoticeBox = ({ lines }: { lines: NoticeLine[] }) => (
  <div className="bg-surface-panel flex shrink-0 flex-col gap-1 rounded-lg px-3 py-4 md:rounded-2xl md:px-4 md:py-5 lg:px-5 lg:py-6">
    {lines.map((line) => (
      <p
        key={line.map((part) => part.text).join("")}
        className="text-ink-body flex gap-1 text-base break-keep"
      >
        <Bullet className="mt-3" />
        <span>
          {line.map((part) =>
            part.strong ? (
              <strong key={part.text} className="font-bold">
                {part.text}
              </strong>
            ) : (
              part.text
            ),
          )}
        </span>
      </p>
    ))}
  </div>
)

/** 표 본문 칸. 여백은 시안의 12 / 16 / 20 이다 */
const CELL = "text-ink-body p-3 text-left align-middle text-xs md:p-4 lg:p-5"
/**
 * 표 머리 칸. 폭은 시안의 66 / 81 / 92 다.
 * 좌우 여백은 시안(12/16/20)보다 좁다. 기준 글자 크기가 17px 이라 같은 폭에
 * 시안대로 여백을 주면 "금융기관" 네 글자가 줄바꿈된다.
 */
const HEAD_CELL =
  "bg-surface-disabled text-ink-muted border-line-panel w-15.5 border-r px-2 py-3 text-center text-xs font-bold whitespace-nowrap md:w-19 md:py-4 md:text-sm lg:w-21.5 lg:py-5"

const AgencySignupGuideDialog = ({
  children,
  defaultOpen,
}: {
  /** 넘기면 이 요소가 팝업을 여는 버튼이 된다 */
  children?: ReactNode
  /** 모달 전용 라우트(/login/agency-signup-guide)로 바로 들어왔을 때 열어 둔다 */
  defaultOpen?: boolean
}) => {
  const [open, setOpen] = useDialogAutoOpen(defaultOpen)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children ? <DialogTrigger asChild>{children}</DialogTrigger> : null}
      {/* 폭은 시안의 340 / 648 / 640 이다. 640~767 구간은 시안이 없어
          다른 팝업과 같이 태블릿 폭을 앞당겨 쓴다 */}
      <DialogContent className="bg-surface-field max-h-5/6 lg:max-h-11/12 flex w-19/20 max-w-80 flex-col gap-0 rounded-xl p-5 sm:max-w-152.5 md:p-7.5 lg:max-w-150.5 lg:p-14">
        {/* 좁은 화면은 닫기 버튼이 카드 밖 위쪽에, PC 는 카드 안 우상단에 붙는다 */}
        <DialogCloseButton className="bg-surface-inverse text-ink-on-inverse absolute -top-10 right-0 lg:top-4.5 lg:right-4.5" />

        <DialogHeader className="shrink-0 gap-1.5 text-left sm:text-left">
          <DialogTitle className="text-ink-strong text-xl leading-normal font-bold break-keep md:text-2xl lg:text-3xl">
            기관회원 가입 안내
          </DialogTitle>
          <p className="text-ink-muted text-base font-medium break-keep">
            기술보증기금 기관회원 계정 발급 절차
          </p>
        </DialogHeader>

        {/* 내용이 길어 화면보다 커진다. 제목만 고정하고 본문 전체가 구른다.
            여백은 카드가 들고 있어야 스크롤 막대가 카드 모서리에 붙지 않는다.
            다른 팝업(emission-source-example-dialog)과 같은 구조다 */}
        <div className="flex min-h-0 flex-col gap-5 overflow-y-auto overscroll-contain pt-5 md:gap-6.5 md:pt-6.5 lg:gap-9.5 lg:pt-9.5">
          <NoticeBox lines={TOP_NOTICES} />

          <div className="flex shrink-0 flex-col gap-5 lg:gap-7.5">
            <div className="flex flex-col gap-4 md:gap-5.5">
              <div className="flex flex-col gap-1 text-center">
                <p className="text-ink-body text-base font-medium break-keep">
                  아래 대상 해당하는 기관 회원
                </p>
                <p className="text-ink-bullet text-sm break-keep">
                  ( 회원가입 후 사용자 승인 필요 )
                </p>
              </div>

              <div className="border-line-panel bg-surface-field overflow-hidden rounded-md border">
                <table className="w-full table-fixed border-collapse">
                  <tbody>
                    {TARGET_ROWS.map((row, index) => (
                      <tr key={row.head}>
                        {/* 모바일 시안에는 좌측 "기관회원" 열이 없다 */}
                        {index === 0 ? (
                          <th
                            scope="rowgroup"
                            rowSpan={TARGET_ROWS.length}
                            className={cn(HEAD_CELL, "hidden md:table-cell")}
                          >
                            기관회원
                          </th>
                        ) : null}
                        <th
                          scope="row"
                          className={cn(
                            HEAD_CELL,
                            index === 0 && "border-line-panel border-b",
                          )}
                        >
                          {row.head}
                        </th>
                        <td
                          className={cn(
                            CELL,
                            index === 0 && "border-line-panel border-b",
                          )}
                        >
                          {row.bulleted ? (
                            <ul className="flex flex-col gap-1">
                              {row.items.map((item) => (
                                <li key={item} className="flex gap-1">
                                  <Bullet className="mt-2" />
                                  <span className="break-keep">{item}</span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <span className="break-keep">{row.items[0]}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <ol className="flex flex-col">
              {STEPS.map((step, index) => {
                const last = index === STEPS.length - 1

                return (
                  <li key={step.title} className="flex gap-3">
                    <div className="flex shrink-0 flex-col items-center">
                      {/* 라이트는 세 해상도 모두 #F3F3F3 로 같지만,
                          다크는 PC 만 #EEEEEE 40% 이고 태블릿·모바일은 #222222 다 */}
                      <span className="bg-surface-disabled lg:bg-surface-step-badge text-ink-strong flex size-7.5 shrink-0 items-center justify-center rounded-full text-base font-bold">
                        {index + 1}
                      </span>
                      {/* 마지막 단계 아래로는 선을 잇지 않는다 */}
                      {last ? null : (
                        <span
                          aria-hidden="true"
                          className="bg-line-panel w-0.5 flex-1"
                        />
                      )}
                    </div>

                    <div
                      className={cn(
                        "flex flex-col gap-1",
                        !last && "pb-4.75 md:pb-5.5 lg:pb-7.5",
                      )}
                    >
                      <p className="text-ink-strong text-lg leading-6.5 font-bold break-keep md:leading-7 lg:text-xl lg:leading-8">
                        {step.title}
                      </p>
                      <p className="text-ink-muted text-sm leading-4.25 font-medium break-keep md:leading-4.75 lg:leading-5.25">
                        {step.desc}
                      </p>
                    </div>
                  </li>
                )
              })}
            </ol>
          </div>

          <NoticeBox lines={BOTTOM_NOTICES} />
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default AgencySignupGuideDialog
