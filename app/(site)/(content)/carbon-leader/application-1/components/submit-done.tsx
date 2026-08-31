import Link from "next/link"

import { ArrowRight, Check, Download, House } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Stepper } from "@/components/ui/stepper"
import StepMobileNav from "@/app/(site)/(content)/carbon-leader/self-check/components/step-mobile-nav"
import { APPLICATION_STEPS } from "@/constants/carbon-leader-application-form"
import { cn } from "@/lib/utils"

// 선도기업 신청 1차 STEP 4 "제출 완료".
// 접수 결과만 보여 주는 화면이라 입력 컨트롤이 없다.
// [퍼블리싱 노출용] 접수번호·일시 등은 시안 값을 그대로 박아 두었다.

/** 차수별 접수번호. 시안에 그려진 값이라 실데이터를 붙일 때 걷어낸다. */
const RECEIPT_NUMBERS: Record<number, string> = {
  1: "2026-512",
  2: "2026-2ND-001",
  3: "2026-3RD-001",
}

const RECEIPT = {
  items: [
    "접수일시 : 2026-07-31 03:11",
    "처리 예상기간 : 2~3주",
    "신청기업 : 주식회사 그린에너지텍",
  ],
}

/** 접수 후 처리 절차 세 단계. period 는 오른쪽 초록 알약이다. */
const STEPS = [
  {
    title: "서류 검토",
    desc: "담당자가 제출된 서류의 유효성 및 완결성을 검토합니다.",
    period: "약 3~5 영업일 소요",
  },
  {
    title: "현장 실사 (필요 시)",
    desc: "배출량 산정 및 감축계획 이행 여부 확인을 위해 현장 실사가 진행될 수 있습니다.",
    period: "담당자 별도 연락",
  },
  {
    title: "심사 결과 통보",
    desc: "심사 결과는 등록하신 이메일 및 문자로 안내드립니다. 인증 적합 시 인증서가 발급됩니다.",
    period: "접수일로부터 2~3주 이내",
  },
]

const NOTICES = [
  "제출된 신청서는 수정이 불가합니다. 수정이 필요한 경우 담당자(1544-1120)에게 문의하세요.",
  "신청번호는 진행상황 조회 및 문의 시 필요하니 반드시 저장해두세요.",
  "추가 서류 제출이 요청될 경우 등록된 이메일로 안내드립니다.",
]

/** 안내 문구 앞 점 */
const Dot = () => (
  <span
    aria-hidden="true"
    className="flex h-5.5 w-2.5 shrink-0 items-center justify-center"
  >
    <span className="bg-ink-bullet size-1 rounded-full" />
  </span>
)

const SubmitDone = ({
  /** 신청 차수. 스테퍼 첫 단계 이름과 안내 문구·접수번호가 이 값을 탄다 */
  round = 1,
}: {
  round?: number
}) => {
  const steps = APPLICATION_STEPS.map((step, index) =>
    index === 0 ? `${round}차신청` : step,
  )
  const receiptNumber = RECEIPT_NUMBERS[round] ?? RECEIPT_NUMBERS[1]

  return (
    <div className="flex w-full max-w-316 flex-col md:gap-10 md:px-7 md:py-10 lg:px-8">
      <StepMobileNav title="제출 완료" step={4} total={steps.length} />

      <div className="flex flex-col gap-6 max-md:hidden lg:flex-row lg:items-center lg:justify-between lg:gap-8">
        <h2 className="text-ink-strong text-lg font-bold whitespace-nowrap md:text-3xl lg:text-4xl">
          제출 완료
        </h2>
        {/* Stepper 내부 ol 의 줄바꿈·폭을 밖에서 제어한다. 지우면 스테퍼가 접힌다. */}
        <div className="[&_ol]:flex-nowrap sm:w-full sm:[&_ol]:w-full sm:[&_ol>li]:flex-1 sm:[&_ol>li>div:nth-child(1)]:flex-1 sm:[&_ol>li>div:nth-child(3)]:flex-1 lg:w-104">
          <Stepper items={steps} activeIndex={3} size={13} />
        </div>
      </div>

      <div className="flex flex-col gap-6 max-md:px-5 max-md:pt-12 max-md:pb-24 lg:gap-10">
        {/* 접수 완료 카드 */}
        <section className="border-line-card bg-surface-card flex flex-col items-center rounded-2xl border px-5 py-10 md:px-8 md:py-15 lg:px-10">
          {/* 시안 아이콘은 브랜드색 원 + 그보다 연한 테두리 링이다.
              링 색은 흰 바탕에 브랜드색 30% 를 덮은 값이라 라이트·다크가 같다 */}
          <span
            aria-hidden="true"
            className="motion-safe:animate-pop-in relative flex size-23 shrink-0 items-center justify-center rounded-full bg-white"
          >
            <span className="bg-brand-primary absolute inset-0 rounded-full opacity-30" />
            <span className="bg-brand-primary relative flex size-18 items-center justify-center rounded-full text-white">
              <Check strokeWidth={2.5} className="size-9" />
            </span>
          </span>

          <p className="text-ink-strong mt-6 text-center text-xl leading-normal font-bold break-keep md:text-2xl">
            신청이 완료되었습니다!
          </p>
          <p className="text-ink-bullet mt-2 text-center text-sm leading-normal font-normal break-keep md:text-base">
            {/* 1차 시안만 차수를 빼고 적는다. 2차부터는 "2차 신청서가" 로 들어간다 */}
            탄소중립 선도기업 {round > 1 ? `${round}차 ` : ""}신청서가
            성공적으로 접수되었습니다.
            <br />
            신청번호를 통해 진행상황을 확인하실 수 있습니다.
          </p>

          <div className="bg-surface-flow mt-10 flex w-full flex-col items-center rounded-2xl py-10 lg:mt-15">
            <span className="bg-brand-primary flex h-8 items-center rounded-full px-5 text-sm font-medium text-white">
              신청번호 (접수증)
            </span>
            <strong className="text-brand-primary mt-2 text-4xl leading-tight font-bold md:text-5xl lg:text-6xl">
              {receiptNumber}
            </strong>
          </div>

          {/* 360 은 한 줄씩, 768 은 두 칸 + 아래 한 칸, PC 는 세 칸이다 */}
          <dl className="mt-4 grid w-full gap-2 md:grid-cols-2 lg:grid-cols-3 lg:gap-4">
            {RECEIPT.items.map((item, index) => (
              <div
                key={item}
                className={cn(
                  "bg-surface-panel text-ink-strong flex h-13 items-center justify-center rounded-md px-4 text-sm font-medium break-keep lg:justify-start lg:px-6",
                  index === 2 && "md:col-span-2 lg:col-span-1",
                )}
              >
                {item}
              </div>
            ))}
          </dl>
        </section>

        {/* 접수 후 처리 절차 */}
        <section className="border-line-card bg-surface-card flex flex-col rounded-2xl border px-5 py-8 md:p-8 lg:p-10">
          <h3 className="border-line-card text-ink-strong border-b pb-6 text-xl leading-normal font-bold break-keep md:text-2xl">
            접수 후 처리 절차
          </h3>
          <ol className="mt-4 flex flex-col gap-4">
            {STEPS.map((step, index) => (
              // 360 은 번호+제목 한 줄, 설명·기간이 그 아래로 내려간다
              <li
                key={step.title}
                className="border-line-card flex flex-wrap items-center gap-x-2 gap-y-3 border-b py-2 last:border-b-0 md:flex-nowrap md:gap-x-4"
              >
                <span
                  aria-hidden="true"
                  className="bg-ink-on-disabled text-ink-strong flex size-6 shrink-0 items-center justify-center rounded-full text-sm font-bold md:size-11 md:text-base"
                >
                  {index + 1}
                </span>
                {/* max-md:contents 로 묶음을 풀어 제목만 첫 줄에 남긴다 */}
                <div className="flex min-w-0 flex-col max-md:contents md:flex-1">
                  <span className="text-ink-strong text-sm font-bold break-keep max-md:min-w-0 max-md:flex-1 md:text-base">
                    {step.title}
                  </span>
                  <span className="text-ink-bullet text-xs leading-normal font-normal break-keep max-md:order-1 max-md:basis-full">
                    {step.desc}
                  </span>
                </div>
                {/* 시안: 라이트는 연한 초록, 다크는 한 단계 진한 초록이다 */}
                <span className="bg-forest-light dark:bg-forest flex h-6 shrink-0 items-center rounded-full px-4 text-xs font-bold whitespace-nowrap text-white max-md:order-2 md:h-7">
                  {step.period}
                </span>
              </li>
            ))}
          </ol>
        </section>

        {/* 유의사항 */}
        <section className="bg-surface-panel flex flex-col gap-1 rounded-2xl p-5 md:p-8 lg:p-10">
          {/* 시안은 제목에는 점이 없다. 점은 아래 항목들만 붙는다 */}
          <p className="text-ink-body text-sm font-bold break-keep">유의사항</p>
          {NOTICES.map((notice) => (
            <p
              key={notice}
              className="text-ink-body flex gap-1 text-sm font-medium break-keep"
            >
              <Dot />
              <span>{notice}</span>
            </p>
          ))}
        </section>

        {/* 메인으로 왼쪽 · 나머지 둘 오른쪽 한 줄을 374 까지 지킨다.
            374~767 은 글자·여백을 줄이고 아이콘을 감춰 세 칸을 끼워 넣고,
            374 밑으로 더 좁아지면 줄이 깨지므로 세 칸을 한 줄씩 내려 쌓는다 */}
        <div className="mt-4 flex flex-col gap-2 min-[374px]:flex-row min-[374px]:items-center min-[374px]:gap-1.5 md:gap-3 lg:mt-0">
          <Link
            href="/carbon-leader/self-check/result/result-certificate"
            // 시안: 면 #ecf0f8 · 글 브랜드색 · 테두리 없음
            className="bg-surface-flow text-brand-primary hover:bg-surface-action focus-visible:ring-ash-600 flex h-10.5 cursor-pointer items-center justify-center gap-1 rounded-lg px-4 text-sm font-bold transition-colors outline-hidden focus-visible:ring-2 min-[374px]:order-2 min-[374px]:ml-auto min-[374px]:min-w-0 min-[374px]:px-3 min-[374px]:text-xs min-[374px]:max-md:[&_svg]:hidden md:h-13 md:w-42 md:px-4 md:text-sm lg:w-47 [&_svg]:size-5"
          >
            출력물 받기
            <Download aria-hidden="true" />
          </Link>
          <Button
            asChild
            variant="outline"
            className="h-10.5 gap-1 rounded-lg text-sm font-bold min-[374px]:order-1 min-[374px]:min-w-0 min-[374px]:px-3 min-[374px]:text-xs min-[374px]:max-md:[&_svg]:hidden md:h-13 md:w-42 md:px-4 md:text-sm lg:w-47 [&_svg]:size-5"
          >
            <Link href="/">
              <House aria-hidden="true" />
              메인으로
            </Link>
          </Button>
          <Button
            asChild
            className="h-10.5 gap-1 rounded-lg text-sm font-bold min-[374px]:order-3 min-[374px]:min-w-0 min-[374px]:px-3 min-[374px]:text-xs min-[374px]:max-md:[&_svg]:hidden md:h-13 md:w-42 md:px-4 md:text-sm lg:w-49 [&_svg]:size-5"
          >
            <Link href="/my-page/status">
              신청내역 확인
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default SubmitDone
