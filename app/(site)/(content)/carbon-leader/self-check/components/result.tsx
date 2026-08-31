"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"

import { ArrowRight, Check, Download, LoaderCircle, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Stepper } from "@/components/ui/stepper"
import GradeBadge from "@/app/(site)/(content)/carbon-leader/self-check/components/grade-badge"
import StepMobileNav from "@/app/(site)/(content)/carbon-leader/self-check/components/step-mobile-nav"
import type { Grade } from "@/constants/carbon-leader-evaluation-index-items"
import { SELF_CHECK_STEPS } from "@/constants/carbon-leader-self-check-steps"
import { cn } from "@/lib/utils"

// 자가진단 STEP 6 결과 확인.
// 시안이 셋이라 프롭 둘로 나눈다.
//   verdict="fit"                 이행계획 적정 · [작성완료] 활성
//   verdict="fit" completed       작성완료를 누른 뒤 · [선도기업 신청하기] 활성
//   verdict="unfit"               이행계획 부적정 · 선도기업 신청 불가
//
// [작성완료] 를 누르면 화면 안에서 두 번째 상태로 바뀐다.
// completed 는 그 첫 값일 뿐이라, /result/done 은 눌린 상태로 바로 들어간다.

export type ResultVerdict = "fit" | "unfit"

/**
 * 판정에 따라 달라지는 값. 색은 라이트·다크가 같다(시안 동일).
 *
 * grade 는 [퍼블리싱 노출용] 고정값이다. 시안이 적정=A · 부적정=D 로 그려져 있어
 * 그대로 박아 두었을 뿐, 실제로는 STEP 5 평가지표에서 산출된 등급을 넘겨야 한다.
 * (평가지표 화면은 EVALUATION_FINAL_GRADE 를 같은 방식으로 쓴다)
 */
const VERDICT = {
  fit: {
    word: "가능",
    grade: "A" as Grade,
    tone: "text-forest",
    circle: "bg-forest",
    label: "적정",
    badge: "bg-forest",
  },
  unfit: {
    word: "불가능",
    grade: "D" as Grade,
    tone: "text-destructive",
    circle: "bg-destructive",
    label: "부적정",
    badge: "bg-destructive",
  },
} as const

/** 판정 알약. 등급 배지(GradeBadge)와 같은 규격이라 두 줄이 나란히 선다. */
const PILL =
  "inline-flex h-7.5 min-w-18 shrink-0 items-center justify-center rounded-full px-5 text-sm font-bold whitespace-nowrap text-white lg:h-8"

/** 상단 한 줄 안내. 자가진단 다른 단계의 "시작하기전에" 와 달리 제목이 없다. */
const ResultNotice = () => (
  <section className="bg-surface-notice flex px-5 py-6 max-md:rounded-none md:rounded-2xl md:px-10">
    <p className="text-ink-body flex gap-1 text-base break-keep">
      <span
        aria-hidden="true"
        className="flex h-6.5 w-2.5 shrink-0 items-center justify-center"
      >
        <span className="bg-ink-bullet size-1 rounded-full" />
      </span>
      <span>자가진단이 완료되었습니다. 아래에서 진단 결과를 확인하세요.</span>
    </p>
  </section>
)

/** 판정 한 줄. 이름표 왼쪽 · 알약 오른쪽 */
const VerdictRow = ({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) => (
  <div className="border-line-card md:border-line-field flex items-center justify-between gap-3 border-t py-4 md:px-10 md:py-5.5">
    <dt className="text-ink-muted text-base font-bold break-keep">{label}</dt>
    <dd>{children}</dd>
  </div>
)

const SelfCheckResult = ({
  verdict = "fit",
  completed = false,
}: {
  verdict?: ResultVerdict
  /** 작성완료를 누른 뒤 상태의 첫 값. [선도기업 신청하기] 가 열린다 */
  completed?: boolean
}) => {
  const view = VERDICT[verdict]
  const [done, setDone] = useState(completed)
  // 작성완료는 진단 내용을 서버로 보내는 요청이다.
  // 응답을 기다리는 동안 버튼을 잠가 같은 요청이 여러 번 나가지 않게 한다.
  // (지금은 1.5초 흉내다. 실제 저장 API 를 붙일 때 이 타이머만 갈아 끼운다)
  const [saving, setSaving] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current)
    },
    [],
  )

  const handleComplete = () => {
    if (saving || done) return
    setSaving(true)
    timer.current = setTimeout(() => {
      timer.current = null
      setSaving(false)
      setDone(true)
    }, 1500)
  }
  // 부적정은 작성완료를 눌러도 선도기업 신청으로 넘어갈 수 없다
  const canApply = verdict === "fit" && done

  return (
    <div className="flex w-full max-w-316 flex-col md:gap-10 md:px-7 md:py-10 lg:px-8">
      <StepMobileNav
        title="결과 확인"
        step={6}
        total={SELF_CHECK_STEPS.length}
      />

      <div className="flex flex-col gap-6 max-md:hidden lg:flex-row lg:items-center lg:justify-between lg:gap-8">
        <h2 className="text-ink-strong text-lg font-bold whitespace-nowrap md:text-3xl lg:text-4xl">
          결과 확인
        </h2>
        {/* Stepper 내부 ol 의 줄바꿈·폭을 밖에서 제어한다. 지우면 스테퍼가 접힌다. */}
        <div className="[&_ol]:flex-nowrap sm:w-full sm:[&_ol]:w-full sm:[&_ol>li]:flex-1 sm:[&_ol>li>div:nth-child(1)]:flex-1 sm:[&_ol>li>div:nth-child(3)]:flex-1 lg:w-172">
          <Stepper items={SELF_CHECK_STEPS} activeIndex={5} size={13} />
        </div>
      </div>

      <ResultNotice />

      <div className="flex flex-col gap-5 max-md:px-5 max-md:pt-12 max-md:pb-24">
        <section className="border-line-card flex flex-col rounded-2xl border p-5 md:p-6 lg:p-10">
          <div className="flex flex-col items-center gap-7 py-5 md:py-10">
            {/* 시안 아이콘은 판정색 원 + 그보다 연한 테두리 링(360 64 · 768~ 96)이다.
                링 색은 흰 바탕에 판정색 30% 를 덮은 값이라 라이트·다크가 같다 */}
            <span
              aria-hidden="true"
              // 화면이 뜰 때 한 번 튀어오른다. 모션을 줄인 환경에서는 그냥 나타난다
              className="motion-safe:animate-pop-in relative flex size-15 shrink-0 items-center justify-center rounded-full bg-white md:size-23"
            >
              <span
                className={cn(
                  "absolute inset-0 rounded-full opacity-30",
                  view.circle,
                )}
              />
              <span
                className={cn(
                  "relative flex size-12 items-center justify-center rounded-full text-white md:size-18",
                  view.circle,
                )}
              >
                {verdict === "fit" ? (
                  <Check strokeWidth={2.5} className="size-6 md:size-9" />
                ) : (
                  <X strokeWidth={2.5} className="size-6 md:size-9" />
                )}
              </span>
            </span>
            <p className="text-ink-strong text-center text-xl leading-normal font-bold break-keep md:text-2xl">
              귀사는 탄소중립 선도기업 확인신청이
              {/* PC·768 은 여기서 줄을 끊고, 360 은 폭에 맞춰 저절로 접힌다 */}
              <br className="max-md:hidden" />{" "}
              <span className={view.tone}>{view.word}</span>합니다.
            </p>
          </div>

          <dl className="mt-4 flex flex-col md:mt-10">
            <VerdictRow label="탄소중립 이행계획">
              <span className={cn(PILL, view.badge)}>{view.label}</span>
            </VerdictRow>
            <VerdictRow label="탄소중립 경영혁신 등급">
              {/*
                등급 배지는 A~E 다섯 가지다. variant="fill" 이 시안의 면색 알약이고,
                색은 grade-badge.tsx 의 BG 맵에 등급별로 잡혀 있다.
                  A 청록(brand-done-teal) · B 파랑(brand-info) · C 보라(brand-done-violet)
                  D 분홍(candy-pink)      · E 남색(ocean-blue)
                라이트·다크가 같은 색이라 모드 분기가 필요 없다.
                실데이터를 붙일 때는 grade 에 산출 등급만 넣으면 색·글자가 따라간다.
                  <GradeBadge grade={finalGrade} variant="fill" className="min-w-18" />
                min-w-18 은 위 줄의 판정 알약과 폭을 맞추는 값이다. 지우면 두 배지가 어긋난다.
              */}
              <GradeBadge
                grade={view.grade}
                variant="fill"
                className="min-w-18"
              />
            </VerdictRow>
          </dl>
        </section>

        <section className="bg-surface-flow flex flex-col items-center rounded-2xl px-10 py-8">
          <p className="text-ink-strong text-center text-xl leading-normal font-bold break-keep lg:text-2xl">
            해당 자가진단 {/* 360 은 여기서 줄을 끊는다 */}
            <br className="md:hidden" />
            작성을 완료합니다.
          </p>
          <p className="text-ink-muted mt-2 text-center text-base font-medium break-keep lg:mt-1">
            자가진단을 완료하면
            {/* PC 는 한 줄, 768 아래는 두 줄이다 */}
            <br className="lg:hidden" /> 선도기업을 신청할 수 있습니다.
          </p>
          <Button
            type="button"
            disabled={done || saving}
            onClick={handleComplete}
            // 잠긴 사이에도 화면 낭독기가 진행 중임을 읽도록 상태를 남긴다
            aria-busy={saving}
            // 비활성 표시는 자가진단 다른 단계 버튼과 같은 규격(회색 면 + 회색 글)
            className="disabled:bg-fill-disabled disabled:text-ink-on-disabled mt-8 h-11 w-37 gap-1.5 rounded-lg text-sm font-bold disabled:opacity-100 lg:mt-6 lg:h-13 lg:w-47 [&_svg]:size-5"
          >
            {saving ? (
              <>
                <LoaderCircle aria-hidden="true" className="animate-spin" />
                전송 중...
              </>
            ) : (
              "작성완료"
            )}
          </Button>
        </section>

        {/* 다시 진단하기 왼쪽 · 나머지 둘 오른쪽 한 줄을 374 까지 지킨다.
            374~767 은 글자·여백을 줄이고 아이콘을 감춰 세 칸을 끼워 넣고,
            374 밑으로 더 좁아지면 줄이 깨지므로 세 칸을 한 줄씩 내려 쌓는다.
            셋 다 다른 화면으로 넘어가는 링크라 Link 로 건다 */}
        <div className="mt-5 flex flex-col gap-2 min-[374px]:flex-row min-[374px]:items-center min-[374px]:gap-1.5 md:gap-3">
          {/* IA 26번 "결과 확인서 (다운로드)". 지금은 자리만 잡아 둔 경로이고,
              실제로는 결과 보고서 PDF 를 내려주는 주소로 바뀐다 */}
          <Link
            href="/carbon-leader/self-check/result/result-certificate"
            // 시안: 면 #ecf0f8 · 글 브랜드색 · 테두리 없음
            className="bg-surface-flow text-brand-primary hover:bg-surface-action focus-visible:ring-ash-600 flex h-10.5 cursor-pointer items-center justify-center gap-1 rounded-lg px-4 text-sm font-bold transition-colors outline-hidden focus-visible:ring-2 min-[374px]:order-2 min-[374px]:ml-auto min-[374px]:min-w-0 min-[374px]:px-3 min-[374px]:text-xs min-[374px]:max-md:[&_svg]:hidden md:h-13 md:w-42 md:px-4 md:text-sm lg:w-47 [&_svg]:size-5"
          >
            출력물 받기
            <Download aria-hidden="true" />
          </Link>
          {/* 자가진단을 처음(STEP 1 기업 정보 입력)부터 다시 한다 */}
          <Button
            asChild
            variant="outline"
            className="h-10.5 rounded-lg text-sm font-bold min-[374px]:order-1 min-[374px]:min-w-0 min-[374px]:px-3 min-[374px]:text-xs md:h-13 md:w-42 md:px-4 md:text-sm lg:w-43"
          >
            <Link href="/carbon-leader/self-check/company-info">
              다시 진단하기
            </Link>
          </Button>
          {/*
            선도기업 신청 1차로 넘어간다. 작성완료를 누르기 전이거나 부적정이면
            넘어갈 수 없어서, 그때는 링크 대신 잠긴 버튼으로 그린다.
            (a 태그에는 disabled 가 없어 눌리는 것을 막지 못한다)
          */}
          {canApply ? (
            <Button
              asChild
              className="h-10.5 gap-1 rounded-lg text-sm font-bold min-[374px]:order-3 min-[374px]:min-w-0 min-[374px]:px-3 min-[374px]:text-xs min-[374px]:max-md:[&_svg]:hidden md:h-13 md:w-42 md:px-4 md:text-sm lg:w-47 [&_svg]:size-5"
            >
              <Link href="/carbon-leader/application-1/application-form">
                선도기업 신청하기
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          ) : (
            <Button
              type="button"
              disabled
              className="disabled:bg-fill-disabled disabled:text-ink-on-disabled h-10.5 gap-1 rounded-lg text-sm font-bold disabled:opacity-100 min-[374px]:order-3 min-[374px]:min-w-0 min-[374px]:px-3 min-[374px]:text-xs min-[374px]:max-md:[&_svg]:hidden md:h-13 md:w-42 md:px-4 md:text-sm lg:w-47 [&_svg]:size-5"
            >
              선도기업 신청하기
              <ArrowRight aria-hidden="true" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default SelfCheckResult
