import { Fragment } from "react"
import Link from "next/link"

import { ArrowLeft, Check, Download, Files } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Stepper } from "@/components/ui/stepper"
import StepMobileNav from "@/app/(site)/(content)/carbon-leader/self-check/components/step-mobile-nav"
import { APPLICATION_STEPS } from "@/constants/carbon-leader-application-form"
import {
  COMPANY_FIELDS,
  INVESTMENT_COLUMNS,
  INVESTMENT_ROWS,
  MANAGER_FIELDS,
  STATUS_FIELDS,
  type SummaryField,
} from "@/constants/carbon-leader-final-confirm"
import { cn } from "@/lib/utils"

// 선도기업 신청 2차 STEP 3 "신청서 최종 확인".
// 앞 단계 입력을 읽기 전용으로 훑어보는 화면이라 입력 컨트롤이 없다.
// 3차 최종확인과 같은 규격이며, 중간점검이라 인벤토리 배출량·목표달성 평가 카드가 없고
// 제출서류도 「중간점검 제출서류 목록」(인벤토리 증빙서류 제외) 2묶음이다.
// 기업정보·기업현황·담당자정보·투자계획은 1차 최종확인과 같은 값을 되짚으므로
// constants/carbon-leader-final-confirm 을 그대로 쓰고, 2차 값만 아래에 둔다.

/** 2차 상단 스테퍼 4단계. 첫 단계 이름만 회차를 탄다(다른 2차 화면과 같은 규칙) */
const STEPS = APPLICATION_STEPS.map((step, index) =>
  index === 0 ? "2차신청" : step,
)

/**
 * 기업정보. 값은 1차 최종확인과 같고 COMPANY_FIELDS 는 1차 화면도 함께 쓰는
 * 상수라 그쪽에 넣지 않는다. 2차만 쓰는 신청차수는 사업자등록번호 자리에 끼워 넣고,
 * 사업자등록번호는 그 자리를 내주고 마지막 묶음으로 내린다.
 */
const [
  companyNameField,
  ceoNameField,
  businessNumberField,
  corporationNumberField,
  addressField,
  ceoPhoneField,
  companyEmailField,
] = COMPANY_FIELDS

const COMPANY_FIELDS_SECOND: SummaryField[] = [
  companyNameField,
  ceoNameField,
  { label: "신청차수", value: "2차 신청" },
  businessNumberField,
  corporationNumberField,
  ceoPhoneField,
  companyEmailField,
  addressField,
]

/**
 * 담당자정보. MANAGER_FIELDS 는 1차·3차 화면도 함께 쓰는 상수라 그쪽에 넣지 않고,
 * 마지막 두 항목(전자우편 · 연락처(HP))만 이 화면에서 순서를 바꾼다.
 */
const MANAGER_FIELDS_SECOND: SummaryField[] = [
  ...MANAGER_FIELDS.slice(0, 4),
  MANAGER_FIELDS[5],
  MANAGER_FIELDS[4],
]

/** 감축기술 도입현황 표의 열. 투자계획 표와 같은 격자를 쓰고 열만 다르다 */
const ADOPTION_COLUMNS: { label: string; unit?: string }[] = [
  { label: "감축기술" },
  { label: "감축설비명" },
  { label: "도입시기" },
  { label: "투자금", unit: "(천원)" },
]

/** [퍼블리싱 노출용] 2차 신청서에서 입력한 도입현황 */
const ADOPTION_ROWS: string[][] = [
  ["고효율 설비교체", "고효율 인버터 컴프레서", "2025-08-15", "120,000"],
  ["재생에너지 도입", "태양광 자가발전 설비(50kW)", "2026-01-20", "280,000"],
]

/** 투자계획 표는 상수의 줄을 격자표가 쓰는 칸 배열로 편다 */
const INVESTMENT_CELLS: string[][] = INVESTMENT_ROWS.map((row) => [
  row.tech,
  row.facility,
  row.period,
  row.amount,
  row.reduction,
])

/** 최종점검 제출서류 묶음. 번호가 붙고 묶음마다 첨부 건수를 센다 */
interface DocumentGroup {
  title: string
  documents: { title: string; files: { name: string; size: string }[] }[]
}

/** [퍼블리싱 노출용] 서류 제출 화면에서 첨부한 파일 */
const DOCUMENT_GROUPS: DocumentGroup[] = [
  {
    title: "기업정보",
    documents: [
      {
        title: "법인등기부등본 및 사업자등록증",
        files: [
          {
            name: "법인등기부등본_사업자등록증_그린에너지텍.pdf",
            size: "1.1 MB",
          },
        ],
      },
      {
        title: "중소기업확인서",
        files: [
          { name: "중소기업확인서_그린에너지텍_2026.pdf", size: "0.9 MB" },
        ],
      },
      {
        title: "탄소중립 기업활동 자료",
        files: [
          { name: "탄소중립_기업활동_자료_그린에너지텍.pdf", size: "2.4 MB" },
        ],
      },
    ],
  },
  {
    title: "감축계획 실행서류",
    documents: [
      {
        title: "도입설비 견적서 및 계약서",
        files: [
          { name: "도입설비_견적서_계약서_그린에너지텍.pdf", size: "1.6 MB" },
        ],
      },
    ],
  },
]

/**
 * 상단 안내. 두 번째 줄은 앞머리만 굵게 둔다(시안 동일).
 * [퍼블리싱 노출용] 문구는 시안 그대로다.
 */
const NOTICES: { lead?: string; text: string }[] = [
  {
    text: "입력하신 내용을 최종 확인한 후 제출해주세요. 제출 후에는 수정이 불가합니다.",
  },
  {
    lead: "아래 내용이 모두 정확한지 확인해주세요.",
    text: " 제출 후에는 담당자 검토가 진행되며, 신청번호가 발급됩니다. 수정이 필요한 경우 [수정] 버튼을 이용하세요.",
  },
]

/** 카드 머리의 총 건수 안내에 쓴다 */
const TOTAL_FILE_COUNT = DOCUMENT_GROUPS.reduce(
  (total, group) =>
    total +
    group.documents.reduce(
      (count, document) => count + document.files.length,
      0,
    ),
  0,
)

/**
 * 화면 상단 안내 박스.
 * 원래 있던 "시작하기전에" 제목은 뺐다. 안내 문구만 남긴다.
 */
const ConfirmNotice = () => (
  <section className="bg-surface-notice flex flex-col gap-3 px-6 py-6 max-md:rounded-none md:rounded-2xl lg:px-10">
    <ul className="flex flex-col gap-3">
      {NOTICES.map((notice) => (
        <li
          key={notice.text}
          className="text-ink-body flex gap-1 text-base break-keep"
        >
          <span
            aria-hidden="true"
            className="flex h-6.5 w-2.5 shrink-0 items-center justify-center"
          >
            <span className="bg-ink-bullet size-1 rounded-full" />
          </span>
          <span>
            {notice.lead ? (
              <strong className="text-ink-strong font-bold">
                {notice.lead}
              </strong>
            ) : null}
            {notice.text}
          </span>
        </li>
      ))}
    </ul>
  </section>
)

/** 카드 한 장. 머리에 분류 칩과 제목, 오른쪽에 [수정] 이 붙는다. */
const SummaryCard = ({
  chip,
  title,
  href,
  note,
  lock,
  children,
}: {
  chip: string
  title: string
  /** 제목 줄 아래, 구분선 위에 놓이는 안내 문구 */
  note?: string
  /** [수정] 자리에 대신 놓는 문구. 1차에서 받아 고칠 수 없는 카드가 쓴다 */
  lock?: string
  /**
   * [수정] 이 여는 입력 화면 주소.
   *
   * 끝의 `#앵커` 를 지우지 말 것. 입력 화면 카드에 같은 id 가 달려 있어
   * 이 값이 있어야 그 카드 위치로 스크롤된다. 없으면 화면 맨 위로 이동한다.
   * (앵커 목록: application-form 의 company-info · company-status ·
   *  manager-info · investment-plan · adoption-status,
   *  document-submit 의 documents)
   */
  href?: string
  children: React.ReactNode
}) => (
  <section className="border-line-card flex flex-col rounded-2xl border px-5 py-6 md:p-7.5 lg:p-8 dark:border-line-divider/40">
    <header className="border-line-card flex flex-col gap-2 border-b pb-6 dark:border-line-divider/40">
      <div className="flex justify-between gap-3 max-md:items-start md:items-center">
        <div className="flex min-w-0 flex-1 items-center gap-3 max-md:flex-wrap max-md:gap-y-2.5">
          <span className="bg-surface-disabled text-ink-strong flex h-8 shrink-0 items-center rounded-full px-4 text-sm font-bold whitespace-nowrap">
            {chip}
          </span>
          <h3 className="text-ink-strong text-xl font-bold break-keep max-md:basis-full md:text-2xl">
            {title}
          </h3>
          {/* 옆에 붙는 안내(총 N건 첨부 등). 780 밑에서는 제목이 줄 전체를 먹어 title 다음 줄로 내려간다 */}
          {note ? (
            <span className="text-ink-hint text-sm font-medium whitespace-nowrap">
              {note}
            </span>
          ) : null}
        </div>
        {href ? (
          <Link
            href={href}
            className="border-line-field bg-surface-field text-ink-strong hover:bg-surface-outline-hover focus-visible:ring-ash-600 flex h-7 shrink-0 items-center rounded-md border px-3 text-xs font-extrabold transition-colors outline-hidden focus-visible:ring-2 max-md:mt-0.5 lg:h-8"
          >
            수정
          </Link>
        ) : lock ? (
          <span className="text-ink-hint shrink-0 text-xs font-medium whitespace-nowrap max-md:mt-1">
            {lock}
          </span>
        ) : null}
      </div>
    </header>
    {children}
  </section>
)

/** 이름표 + 값 묶음. 시안은 PC 3열 · 768 2열 · 360 1열이다. */
const FieldGrid = ({ fields }: { fields: SummaryField[] }) => (
  <dl className="mt-4 grid gap-2.5 md:grid-cols-2 md:gap-4 lg:grid-cols-3">
    {fields.map((field, index) => (
      <Fragment key={field.label}>
        <div
          className={cn(
            "flex flex-col gap-3 px-2.5 py-3 md:px-6",
            field.wide && "md:col-span-2",
          )}
        >
          <dt className="text-ink-hint text-sm font-medium">{field.label}</dt>
          <dd className="text-ink-strong text-base font-bold break-all">
            {field.value}
          </dd>
        </div>
        {/* 시안은 묶음 사이에 구분선을 한 줄 넣는다. 맨 끝 항목이면 카드 테두리와
            겹쳐 줄이 두 개로 보이니 마지막 항목일 때는 긋지 않는다 */}
        {field.groupEnd && index < fields.length - 1 ? (
          <div
            aria-hidden="true"
            className="border-line-card col-span-full border-t max-md:my-1.5 dark:border-line-divider/40"
          />
        ) : null}
      </Fragment>
    ))}
  </dl>
)

const GridTable = ({
  columns,
  rows,
}: {
  columns: { label: string; unit?: string }[]
  rows: string[][]
}) => (
  <div className="mt-4 md:mt-6 lg:mt-8">
    {/* 768 부터: 격자표 */}
    <div className="hidden md:flex md:flex-col">
      {/* 머리글은 위에 진한 선, 아래는 연한 선 */}
      <div className="border-t-ink-strong border-b-line-field flex border-t border-b">
        <span className="border-line-field bg-surface-disabled text-ink-body hidden w-16 shrink-0 items-center justify-center border-r text-base font-bold lg:flex">
          No.
        </span>
        {columns.map((column, index) => (
          <span
            key={column.label}
            className={cn(
              // 768 은 높이 66 · 좁아서 단위가 아랫줄로, PC 는 58 · 한 줄이다
              // flex-wrap 이라 줄 묶음 세로 정렬은 content-center 로 잡는다
              "border-line-field bg-surface-disabled text-ink-body flex min-h-16 min-w-0 flex-1 flex-wrap content-center items-baseline justify-center gap-x-1 px-3 py-3 text-center text-base font-bold break-keep lg:min-h-14 lg:px-2",
              index < columns.length - 1 && "border-r",
            )}
          >
            {column.label}
            {column.unit ? (
              // 시안: 단위는 이름과 같은 #333333, 크기만 작고 굵기는 400
              // 768 은 단위가 반드시 아랫줄이라 basis-full 로 줄을 끊는다(PC 는 한 줄)
              <span className="text-xs font-normal max-lg:basis-full">
                {column.unit}
              </span>
            ) : null}
          </span>
        ))}
      </div>

      {rows.map((row, index) => (
        <div
          key={`${row[0]}-${index}`}
          className="border-line-field flex min-h-15 border-b lg:min-h-18"
        >
          <span className="border-line-field text-ink-body hidden w-16 shrink-0 items-center justify-center border-r text-base font-medium lg:flex">
            {index + 1}
          </span>
          {row.map((value, cell) => (
            <span
              key={`${row[0]}-${cell}`}
              className={cn(
                // 768 시안은 글·설비·기간이 왼쪽, 숫자 칸이 가운데다. PC 는 모두 가운데
                "border-line-field text-ink-body flex min-w-0 flex-1 items-center px-3 py-3 text-sm font-normal break-words lg:px-2 lg:py-2 lg:text-base lg:font-medium",
                cell < 3
                  ? "justify-start text-left lg:justify-center lg:text-center"
                  : "justify-center text-center",
                cell < row.length - 1 && "border-r",
              )}
            >
              {/* flex 칸의 익명 텍스트는 줄바꿈 규칙이 안 먹어 한 겹 감싼다 */}
              <span className="min-w-0 break-words">{value}</span>
            </span>
          ))}
        </div>
      ))}
    </div>

    {/* 360: 감축기술·설비명을 제목으로 두고 나머지 세 칸만 표로 보여 준다 */}
    <div className="flex flex-col gap-4 md:hidden">
      {rows.map((row, index) => (
        <div key={`${row[0]}-m-${index}`} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <span className="text-ink-strong text-base font-bold break-keep">
              {row[0]}
            </span>
            <span className="text-ink-hint text-sm font-bold break-keep">
              {row[1]}
            </span>
          </div>
          <div className="flex flex-col">
            <div className="bg-surface-disabled flex">
              {columns.slice(2).map((column) => (
                <span
                  key={column.label}
                  className="text-ink-muted flex min-h-12 flex-1 flex-col items-center justify-center px-1 py-2 text-center text-xs font-bold break-keep"
                >
                  {column.label}
                  {/* 시안의 단위는 이름보다 연한 회색에 굵기 400 이다 */}
                  {column.unit ? (
                    <span className="text-ink-hint font-normal">
                      {column.unit}
                    </span>
                  ) : null}
                </span>
              ))}
            </div>
            <div className="border-line-card flex min-h-15 items-center border-b dark:border-line-divider/40">
              {row.slice(2).map((value, cell) => (
                <span
                  key={`${row[0]}-m-${cell}`}
                  // 사업기간처럼 띄어쓰기 없는 값도 칸을 넘기지 말고 접어 내린다
                  className="text-ink-body min-w-0 flex-1 px-1 text-center text-xs font-normal break-words"
                >
                  {value}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
)

/** 제출한 파일 한 줄 */
const SubmittedFileRow = ({
  name,
  size,
  done,
}: {
  name: string
  size: string
  done?: boolean
}) => (
  <li
    className={cn(
      "flex items-center gap-2.5",
      done
        ? "bg-surface-disabled h-11 rounded-2xl px-6"
        : "bg-brand-done-teal/10 h-11 rounded-lg px-2.5 md:h-14 md:px-4",
    )}
  >
    <div className="flex min-w-0 flex-1 items-center gap-2">
      {/* 시안 아이콘은 뒷장이 비치는 문서 모양이라 Files 가 가장 가깝다 */}
      <Files
        aria-hidden="true"
        className={cn(
          "size-6 shrink-0",
          done ? "text-ink-hint" : "text-ink-muted",
        )}
      />
      <span
        className={cn(
          "min-w-0 flex-1 truncate",
          done
            ? "text-ink-hint text-sm font-medium"
            : "text-ink-muted text-xs font-normal md:text-sm md:font-medium",
        )}
      >
        {name}
      </span>
    </div>

    {/* 시안: 용량 13/400, 제출완료 15/500. 용량과 체크 사이는 360 8 · PC 22 */}
    <div className="flex shrink-0 items-center gap-2 md:gap-5">
      <span className="text-ink-hint text-xs">{size}</span>
      {done ? (
        <span className="text-ink-strong flex items-center gap-1 text-sm font-medium md:gap-2">
          <Check aria-hidden="true" strokeWidth={2.5} className="size-4" />
          제출완료
        </span>
      ) : null}
    </div>
  </li>
)

const FORM = "/carbon-leader/application-2/application-form"

const FinalConfirm = () => {
  return (
    <div className="flex w-full max-w-316 flex-col md:gap-8 md:px-7 md:pt-12 md:pb-28 lg:gap-10 lg:px-8 lg:pt-14 lg:pb-42">
      <StepMobileNav title="최종 확인" step={3} total={STEPS.length} />

      <div className="flex flex-col gap-8 max-md:hidden lg:flex-row lg:items-start lg:justify-between lg:gap-8">
        <h2 className="text-ink-strong text-lg font-bold whitespace-nowrap md:text-3xl lg:text-4xl">
          신청서 최종 확인 (2차)
        </h2>
        {/* Stepper 내부 ol 의 줄바꿈·폭을 밖에서 제어한다. 지우면 스테퍼가 접힌다. */}
        <div className="[&_ol]:flex-nowrap sm:w-full sm:[&_ol]:w-full sm:[&_ol>li]:flex-1 sm:[&_ol>li>div:nth-child(1)]:flex-1 sm:[&_ol>li>div:nth-child(3)]:flex-1 lg:w-104">
          <Stepper items={STEPS} activeIndex={2} size={13} />
        </div>
      </div>

      <ConfirmNotice />

      <div className="flex flex-col gap-6 max-md:px-5 max-md:pt-12 max-md:pb-24 lg:gap-10">
        <SummaryCard
          chip="기업정보"
          title="기업정보"
          href={`${FORM}#company-info`}
        >
          <FieldGrid fields={COMPANY_FIELDS_SECOND} />
        </SummaryCard>

        <SummaryCard
          chip="기업현황"
          title="기업현황"
          href={`${FORM}#company-status`}
        >
          <FieldGrid fields={STATUS_FIELDS} />
        </SummaryCard>

        <SummaryCard
          chip="담당자"
          title="담당자정보"
          href={`${FORM}#manager-info`}
        >
          <FieldGrid fields={MANAGER_FIELDS_SECOND} />
        </SummaryCard>

        {/* 1차 신청 때 받은 값이라 이 화면에서도 고칠 수 없다 */}
        <SummaryCard
          chip="투자계획"
          title="탄소중립 투자계획"
          lock="1차 신청 정보 · 수정불가"
        >
          <GridTable columns={INVESTMENT_COLUMNS} rows={INVESTMENT_CELLS} />
        </SummaryCard>

        <SummaryCard
          chip="도입현황"
          title="감축기술 도입현황"
          href={`${FORM}#adoption-status`}
        >
          <GridTable columns={ADOPTION_COLUMNS} rows={ADOPTION_ROWS} />
        </SummaryCard>

        <SummaryCard
          chip="서류"
          title="서류 제출"
          note={`총 ${TOTAL_FILE_COUNT}건 첨부`}
          href="/carbon-leader/application-2/document-submit#documents"
        >
          <ul className="mt-4 flex flex-col gap-4">
            {DOCUMENT_GROUPS.map((group, index) => {
              const count = group.documents.reduce(
                (total, document) => total + document.files.length,
                0,
              )
              return (
                <li
                  key={group.title}
                  className="border-brand-done-teal bg-brand-done-teal/6 flex flex-col rounded-xl border p-5 md:rounded-2xl md:p-6"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-2.5">
                      {/* 최종점검 제출서류 목록은 묶음마다 번호가 붙는다 */}
                      <span className="bg-brand-done-teal text-surface-field flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold">
                        {index + 1}
                      </span>
                      <span className="text-ink-strong text-base font-bold break-keep">
                        {group.title}
                      </span>
                    </div>
                    <span className="bg-brand-done-teal text-surface-field flex h-8 shrink-0 items-center rounded-full px-3.5 text-xs font-bold">
                      {count}건 첨부
                    </span>
                  </div>

                  {/* 묶음 안은 서류 이름 아래에 그 서류의 파일이 붙는다 */}
                  <ul className="mt-4 flex flex-col gap-4 md:gap-5">
                    {group.documents.map((document) => (
                      <li key={document.title} className="flex flex-col gap-2">
                        <span className="text-ink-body text-sm font-bold break-keep">
                          {document.title}
                        </span>
                        <ul className="flex flex-col gap-2">
                          {document.files.map((file) => (
                            <SubmittedFileRow key={file.name} {...file} />
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ul>
                </li>
              )
            })}
          </ul>
        </SummaryCard>

        {/* 수정하기 왼쪽 · 나머지 둘 오른쪽 한 줄을 374 까지 지킨다.
            374~767 은 글자·여백을 줄이고 아이콘을 감춰 세 칸을 끼워 넣고,
            374 밑으로 더 좁아지면 줄이 깨지므로 세 칸을 한 줄씩 내려 쌓는다 */}
        <div className="flex flex-col gap-2 min-[374px]:flex-row min-[374px]:items-center min-[374px]:gap-1.5 md:gap-3">
          <button
            type="button"
            // 시안: 면 #ecf0f8 · 글 브랜드색 · 테두리 없음 · 201x56 · radius 8 · 아이콘 24
            className="bg-surface-flow text-brand-primary hover:bg-surface-action focus-visible:ring-ash-600 flex h-10.5 cursor-pointer items-center justify-center gap-1 rounded-lg px-4 text-sm font-bold transition-colors outline-hidden focus-visible:ring-2 min-[374px]:order-2 min-[374px]:ml-auto min-[374px]:min-w-0 min-[374px]:px-3 min-[374px]:text-xs min-[374px]:max-md:[&_svg]:hidden md:h-13 md:w-42 md:px-4 md:text-sm lg:w-47 [&_svg]:size-6"
          >
            출력물 받기
            <Download aria-hidden="true" />
          </button>
          <Button
            type="button"
            variant="outline"
            className="h-10.5 gap-1 rounded-lg text-sm font-bold min-[374px]:order-1 min-[374px]:min-w-0 min-[374px]:px-3 min-[374px]:text-xs min-[374px]:max-md:[&_svg]:hidden md:h-13 md:w-42 md:px-4 md:text-sm [&_svg]:size-5"
          >
            <ArrowLeft aria-hidden="true" />
            수정하기
          </Button>
          {/* 누르면 제출 확인 팝업이 뜬다(같은 이름의 하위 화면) */}
          <Button
            type="button"
            className="h-10.5 gap-1 rounded-lg text-sm font-bold min-[374px]:order-3 min-[374px]:min-w-0 min-[374px]:px-3 min-[374px]:text-xs md:h-13 md:w-42 md:px-4 md:text-sm [&_svg]:size-5"
          >
            최종제출
          </Button>
        </div>
      </div>
    </div>
  )
}

export default FinalConfirm
