import { Fragment } from "react"
import Link from "next/link"

import { ArrowLeft, ArrowRight, Check, Download, Files } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Stepper } from "@/components/ui/stepper"
import StepMobileNav from "@/app/(site)/(content)/carbon-leader/self-check/components/step-mobile-nav"
import { APPLICATION_STEPS } from "@/constants/carbon-leader-application-form"
import {
  BASE_YEAR_COLUMNS,
  BASE_YEAR_ROWS,
  COMPANY_FIELDS,
  FINAL_CONFIRM_NOTICES,
  INVESTMENT_COLUMNS,
  INVESTMENT_ROWS,
  MANAGER_FIELDS,
  REDUCTION_PLAN_ROWS,
  STATUS_FIELDS,
  STATUS_FILES,
  SUBMITTED_DOCUMENTS,
  type SummaryField,
  type SummaryRow,
} from "@/constants/carbon-leader-final-confirm"
import { cn } from "@/lib/utils"

// 선도기업 신청 1차 STEP 3 "신청서 최종 확인".
// 앞 단계 입력을 읽기 전용으로 훑어보는 화면이라 입력 컨트롤이 없다.

/** 표 상자. 360 은 상자 없이 줄만 쌓인다. */
const TABLE_BOX =
  "md:border-line-card md:bg-surface-field md:overflow-hidden md:rounded-md md:border"

/** 화면 상단 안내 박스 */
const ConfirmNotice = () => (
  <section className="bg-surface-notice flex flex-col gap-3 px-6 py-6 max-md:rounded-none md:rounded-2xl lg:px-10">
    <h3 className="text-ink-strong text-lg font-bold lg:text-xl">
      시작하기전에
    </h3>
    <ul className="flex flex-col gap-3">
      {FINAL_CONFIRM_NOTICES.map((notice) => (
        <li
          key={notice}
          className="text-ink-body flex gap-1 text-base break-keep"
        >
          <span
            aria-hidden="true"
            className="flex h-6.5 w-2.5 shrink-0 items-center justify-center"
          >
            <span className="bg-ink-bullet size-1 rounded-full" />
          </span>
          <span>{notice}</span>
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
  children,
}: {
  chip: string
  title: string
  /** 제목 줄 아래, 구분선 위에 놓이는 안내 문구 */
  note?: string
  /**
   * [수정] 이 여는 입력 화면 주소.
   *
   * 끝의 `#앵커` 를 지우지 말 것. 입력 화면 카드에 같은 id 가 달려 있어
   * 이 값이 있어야 그 카드 위치로 스크롤된다. 없으면 화면 맨 위로 이동한다.
   * (앵커 목록: application-form 의 company-info · company-status ·
   *  manager-info · base-year-status · reduction-plan · investment-plan,
   *  document-submit 의 documents)
   */
  href: string
  children: React.ReactNode
}) => (
  <section className="border-line-card flex flex-col rounded-2xl border px-5 py-6 md:p-7.5 lg:p-8">
    <header className="border-line-card flex flex-col gap-2 border-b pb-6">
      <div className="flex justify-between gap-3 max-md:items-start md:items-center">
        <div className="flex min-w-0 flex-1 items-center gap-3 max-md:flex-wrap max-md:gap-y-2.5">
          <span className="bg-surface-disabled text-ink-strong flex h-8 shrink-0 items-center rounded-full px-4 text-sm font-bold whitespace-nowrap">
            {chip}
          </span>
          <h3 className="text-ink-strong text-xl font-bold break-keep max-md:basis-full md:text-2xl">
            {title}
          </h3>
        </div>
        <Link
          href={href}
          className="border-line-field bg-surface-field text-ink-strong hover:bg-surface-outline-hover focus-visible:ring-ash-600 flex h-7 shrink-0 items-center rounded-md border px-3 text-xs font-bold transition-colors outline-hidden focus-visible:ring-2 max-md:mt-0.5 lg:h-8"
        >
          수정
        </Link>
      </div>
      {note ? <p className="text-ink-hint text-sm break-keep">{note}</p> : null}
    </header>
    {children}
  </section>
)

/** 이름표 + 값 묶음. 시안은 PC 3열 · 768 2열 · 360 1열이다. */
const FieldGrid = ({ fields }: { fields: SummaryField[] }) => (
  <dl className="mt-4 grid gap-2.5 md:grid-cols-2 md:gap-4 lg:grid-cols-3">
    {fields.map((field) => (
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
        {/* 시안은 묶음 사이에 구분선을 한 줄 넣는다 */}
        {field.groupEnd ? (
          <div
            aria-hidden="true"
            className="border-line-card col-span-full border-t max-md:my-1.5"
          />
        ) : null}
      </Fragment>
    ))}
  </dl>
)

/**
 * 연도별 표.
 * 768 부터는 구분 열 + 연도 열의 표, 360 은 줄마다 연도 머리글이 붙는 묶음이 된다.
 * 값이 하나뿐인 줄은 값 자리 가운데에 한 번만 찍는다(시안 동일).
 */
const SummaryTable = ({
  columns,
  rows,
}: {
  columns: string[]
  rows: SummaryRow[]
}) => (
  <div className="md:border-line-card md:bg-surface-field mt-4 flex flex-col md:mt-6 md:overflow-hidden md:rounded-md md:border lg:mt-8">
    {/* 표 머리글. 여백·이름 열·간격을 본문 줄과 같은 값으로 맞춰 칸이 어긋나지 않게 한다 */}
    <div className="bg-surface-disabled text-ink-muted hidden text-xs font-bold md:flex md:px-6">
      <span className="w-48 shrink-0 py-2.5 text-center">구분</span>
      <div className="ml-8 flex flex-1">
        {columns.map((column) => (
          <span key={column} className="flex-1 py-2.5 text-center">
            {column}
          </span>
        ))}
      </div>
    </div>

    <div className="flex flex-col gap-2.5 md:gap-4 md:py-4">
      {rows.map((row) => (
        <div
          key={row.label}
          className="md:border-line-card flex flex-col gap-3 md:min-h-15 md:flex-row md:items-center md:gap-8 md:border-b md:px-6 md:py-1.5 md:last:border-b-0"
        >
          {/* 360 은 이름 왼쪽 · 단위 오른쪽 끝, 768 부터는 단위가 이름 아래 줄이다 */}
          <div className="flex items-baseline justify-between gap-2 md:w-48 md:shrink-0 md:flex-col md:items-start md:gap-0">
            <span className="text-ink-strong text-base font-bold break-keep">
              {row.label}
            </span>
            {row.unit ? (
              <span className="text-ink-hint text-xs font-normal whitespace-nowrap">
                {row.unit}
              </span>
            ) : null}
          </div>

          {row.values.length > 1 ? (
            <div className="flex min-w-0 flex-1 flex-col">
              {/* 360 은 표 머리글이 없어 줄마다 연도를 붙인다 */}
              <div className="bg-surface-disabled text-ink-muted flex text-xs font-bold md:hidden">
                {columns.map((column) => (
                  <span key={column} className="flex-1 py-2 text-center">
                    {column}
                  </span>
                ))}
              </div>
              <div className="border-line-card flex min-h-15 items-center border-b md:min-h-0 md:border-b-0">
                {row.values.map((value, index) => (
                  <span
                    key={`${row.label}-${index}`}
                    className="text-ink-body flex-1 text-center text-sm font-medium md:text-base"
                  >
                    {value}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <span className="text-ink-body min-w-0 flex-1 text-sm font-medium max-md:mt-2 md:text-center md:text-base">
              {row.values[0]}
            </span>
          )}
        </div>
      ))}
    </div>
  </div>
)

/**
 * 투자계획 표.
 * 시안이 다른 표와 달리 칸마다 선이 있는 격자표다.
 * PC 는 No. 열까지 6칸, 768 은 No. 없이 5칸, 360 은 줄마다 묶음으로 쌓인다.
 */
const InvestmentTable = () => (
  <div className="mt-4 md:mt-6 lg:mt-8">
    {/* 768 부터: 격자표 */}
    <div className="hidden md:flex md:flex-col">
      {/* 머리글은 위에 진한 선, 아래는 연한 선 */}
      <div className="border-t-ink-strong border-b-line-field flex border-t border-b">
        <span className="border-line-field bg-surface-disabled text-ink-body hidden w-16 shrink-0 items-center justify-center border-r text-base font-bold lg:flex">
          No.
        </span>
        {INVESTMENT_COLUMNS.map((column, index) => (
          <span
            key={column.label}
            className={cn(
              // 768 은 높이 66 · 좁아서 단위가 아랫줄로, PC 는 58 · 한 줄이다
              // flex-wrap 이라 줄 묶음 세로 정렬은 content-center 로 잡는다
              "border-line-field bg-surface-disabled text-ink-body flex min-h-16 min-w-0 flex-1 flex-wrap content-center items-baseline justify-center gap-x-1 px-3 py-3 text-center text-base font-bold break-keep lg:min-h-14 lg:px-2",
              index < INVESTMENT_COLUMNS.length - 1 && "border-r",
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

      {INVESTMENT_ROWS.map((row, index) => (
        <div
          key={`${row.tech}-${index}`}
          className="border-line-field flex min-h-15 border-b lg:min-h-18"
        >
          <span className="border-line-field text-ink-body hidden w-16 shrink-0 items-center justify-center border-r text-base font-medium lg:flex">
            {index + 1}
          </span>
          {[row.tech, row.facility, row.period, row.amount, row.reduction].map(
            (value, cell) => (
              <span
                key={`${row.tech}-${cell}`}
                className={cn(
                  // 768 시안은 글·설비·기간이 왼쪽, 숫자 두 칸이 가운데다. PC 는 모두 가운데
                  "border-line-field text-ink-body flex min-w-0 flex-1 items-center px-3 py-3 text-sm font-normal break-words lg:px-2 lg:py-2 lg:text-base lg:font-medium",
                  cell < 3
                    ? "justify-start text-left lg:justify-center lg:text-center"
                    : "justify-center text-center",
                  cell < 4 && "border-r",
                )}
              >
                {/* flex 칸의 익명 텍스트는 줄바꿈 규칙이 안 먹어 한 겹 감싼다 */}
                <span className="min-w-0 break-words">{value}</span>
              </span>
            ),
          )}
        </div>
      ))}
    </div>

    {/* 360: 감축기술·설비명을 제목으로 두고 나머지 세 칸만 표로 보여 준다 */}
    <div className="flex flex-col gap-4 md:hidden">
      {INVESTMENT_ROWS.map((row, index) => (
        <div key={`${row.tech}-m-${index}`} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <span className="text-ink-strong text-base font-bold break-keep">
              {row.tech}
            </span>
            <span className="text-ink-hint text-sm font-bold break-keep">
              {row.facility}
            </span>
          </div>
          <div className="flex flex-col">
            <div className="bg-surface-disabled flex">
              {INVESTMENT_COLUMNS.slice(2).map((column) => (
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
            <div className="border-line-card flex min-h-15 items-center border-b">
              {[row.period, row.amount, row.reduction].map((value, cell) => (
                <span
                  key={`${row.tech}-m-${cell}`}
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

/**
 * 첨부한 서류가 하나도 없을 때.
 * 자가진단 STEP 3 의 "아직 추가된 사업이 없습니다" 안내와 같은 규격을 쓴다.
 */
const EmptyDocuments = () => (
  <div className="bg-surface-disabled mt-4 flex flex-col items-center gap-2 rounded-xl px-6 py-12 md:rounded-2xl md:py-15">
    {/* 카드 제목(20/24)보다 한 단계 낮춰 위계를 만든다 */}
    <p className="text-ink-strong text-base font-bold break-keep md:text-lg">
      첨부한 서류가 없습니다.
    </p>
    <p className="text-ink-muted text-sm break-keep">
      서류는 선택 제출입니다. 필요하면 [수정] 에서 첨부해 주세요.
    </p>
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
        : "bg-brand-done-teal/10 h-11 rounded-lg px-2.5 md:h-13 md:px-4",
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

const FinalConfirm = () => {
  return (
    <div className="flex w-full max-w-316 flex-col md:gap-8 md:px-7 md:pt-12 md:pb-28 lg:gap-10 lg:px-8 lg:pt-14 lg:pb-42">
      <StepMobileNav
        title="최종 확인"
        step={3}
        total={APPLICATION_STEPS.length}
      />

      <div className="flex flex-col gap-8 max-md:hidden lg:flex-row lg:items-start lg:justify-between lg:gap-8">
        <h2 className="text-ink-strong text-lg font-bold whitespace-nowrap md:text-3xl lg:text-4xl">
          신청서 최종 확인 (1차)
        </h2>
        {/* Stepper 내부 ol 의 줄바꿈·폭을 밖에서 제어한다. 지우면 스테퍼가 접힌다. */}
        <div className="[&_ol]:flex-nowrap sm:w-full sm:[&_ol]:w-full sm:[&_ol>li]:flex-1 sm:[&_ol>li>div:nth-child(1)]:flex-1 sm:[&_ol>li>div:nth-child(3)]:flex-1 lg:w-104">
          <Stepper items={APPLICATION_STEPS} activeIndex={2} size={13} />
        </div>
      </div>

      <ConfirmNotice />

      <div className="flex flex-col gap-6 max-md:px-5 max-md:pt-12 max-md:pb-24 lg:gap-10">
        <SummaryCard
          chip="기업정보"
          title="기업정보"
          href="/carbon-leader/application-1/application-form#company-info"
        >
          <FieldGrid fields={COMPANY_FIELDS} />
        </SummaryCard>

        <SummaryCard
          chip="기업현황"
          title="기업현황"
          href="/carbon-leader/application-1/application-form#company-status"
        >
          <FieldGrid fields={STATUS_FIELDS} />
          {/* 시안은 항목 묶음과 제출 파일 사이에 구분선이 있다 */}
          <ul className="border-line-card mt-4 flex flex-col gap-4 border-t pt-6">
            {STATUS_FILES.map((file, index) => (
              <SubmittedFileRow key={`${file.name}-${index}`} {...file} done />
            ))}
          </ul>
        </SummaryCard>

        <SummaryCard
          chip="담당자"
          title="담당자정보"
          href="/carbon-leader/application-1/application-form#manager-info"
        >
          <FieldGrid fields={MANAGER_FIELDS} />
        </SummaryCard>

        <SummaryCard
          chip="기준연도"
          title="탄소중립 기준연도 현황"
          href="/carbon-leader/application-1/application-form#base-year-status"
        >
          {/* 시안에는 담당자 항목이 한 번 더 들어가 있으나 디자인 실수라 뺀다 */}
          <SummaryTable columns={BASE_YEAR_COLUMNS} rows={BASE_YEAR_ROWS} />
        </SummaryCard>

        <SummaryCard
          chip="감축계획"
          title="탄소감축계획"
          href="/carbon-leader/application-1/application-form#reduction-plan"
        >
          <SummaryTable
            columns={BASE_YEAR_COLUMNS}
            rows={REDUCTION_PLAN_ROWS}
          />
        </SummaryCard>

        <SummaryCard
          chip="투자계획"
          title="향후 3년간 탄소중립 투자계획"
          href="/carbon-leader/application-1/application-form#investment-plan"
        >
          <InvestmentTable />
        </SummaryCard>

        <SummaryCard
          chip="서류"
          title="서류 첨부"
          href="/carbon-leader/application-1/document-submit#documents"
        >
          {/* 첨부가 하나도 없으면 빈 상태를 보여 준다 */}
          {SUBMITTED_DOCUMENTS.length === 0 ? <EmptyDocuments /> : null}
          <ul className="mt-4 flex flex-col gap-4 empty:hidden">
            {SUBMITTED_DOCUMENTS.map((document) => (
              <li
                key={document.title}
                className="border-brand-done-teal bg-brand-done-teal/6 flex flex-col rounded-xl border p-5 md:rounded-2xl md:p-6"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="text-ink-strong text-base font-bold break-keep">
                    {document.title}
                  </span>
                  <span className="bg-brand-done-teal text-surface-field flex h-8 shrink-0 items-center rounded-full px-3.5 text-xs font-bold">
                    {document.files.length}건 첨부
                  </span>
                </div>
                <ul className="mt-4 flex flex-col gap-4">
                  {document.files.map((file, index) => (
                    <SubmittedFileRow
                      key={`${file.name}-${index}`}
                      name={file.name}
                      size={file.size}
                    />
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </SummaryCard>

        {/* 이전으로 왼쪽 · 나머지 둘 오른쪽 한 줄을 374 까지 지킨다.
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
            이전으로
          </Button>
          <Button
            type="button"
            className="h-10.5 gap-1 rounded-lg text-sm font-bold min-[374px]:order-3 min-[374px]:min-w-0 min-[374px]:px-3 min-[374px]:text-xs min-[374px]:max-md:[&_svg]:hidden md:h-13 md:w-42 md:px-4 md:text-sm [&_svg]:size-5"
          >
            다음으로
            <ArrowRight aria-hidden="true" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default FinalConfirm
