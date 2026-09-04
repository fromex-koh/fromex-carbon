"use client"

import { useState } from "react"
import { ArrowLeft, ArrowRight, CirclePlus } from "lucide-react"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Stepper } from "@/components/ui/stepper"
import StepMobileNav from "@/app/(site)/(content)/carbon-leader/self-check/components/step-mobile-nav"
import BaseInfo from "@/app/(site)/(content)/carbon-leader/self-check/components/base-info"
import BusinessCard, {
  createBusiness,
  hasMissingOf,
  type Business,
} from "@/app/(site)/(content)/carbon-leader/self-check/components/business-card"
import { SELF_CHECK_STEPS } from "@/constants/carbon-leader-self-check-steps"

const NOTICES = [
  "해당 사업의 감축방법론을 선택하여, 상세정보 내에 개선전·개선후 값을 입력하면 GHG 감축량과 에너지 절감량이 자동으로 산정됩니다.",
]

const ReductionPotential = () => {
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [hasTried, setHasTried] = useState(false)
  // 다음으로를 누를 때마다 올라간다. 카드가 오류 표시를 다시 켜는 신호로 쓴다.
  const [errorTick, setErrorTick] = useState(0)

  // [사업 추가] 는 모달이 아니라 카드를 목록 끝에 붙이고 그 자리로 스크롤한다.
  const handleAddBusiness = () => {
    const next = createBusiness(Date.now())
    // 카드가 늘어나면 기존 카드는 접어 새 카드에 집중시킨다.
    setBusinesses((prev) => [
      ...prev.map((item) => ({ ...item, isOpen: false })),
      next,
    ])
    requestAnimationFrame(() =>
      document
        .getElementById(`business-anchor-${next.id}`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" }),
    )
  }

  // 카드가 펼쳐진 뒤 첫 번째 미입력 칸으로 옮겨간다.
  const focusFirstError = () => {
    // 카드가 펼쳐지고 오류 표시가 붙은 뒤에 잡아야 해서 한 박자 늦춘다.
    window.setTimeout(() => {
      const first = document.querySelector<HTMLElement>("[data-invalid]")
      if (!first) return
      first.scrollIntoView({ block: "center", behavior: "smooth" })
      first.focus({ preventScroll: true })
    }, 80)
  }

  // 버튼은 항상 누를 수 있게 두고, 눌렀을 때 미입력 항목을 표시한다.
  const handleNext = () => {
    setHasTried(true)
    setErrorTick((tick) => tick + 1)
    // 미입력 항목이 있는 카드는 펼쳐서 어디가 비었는지 보이게 한다.
    const invalid = businesses.filter((item) => hasMissingOf(item))
    if (invalid.length > 0) {
      setBusinesses((prev) =>
        prev.map((item) =>
          hasMissingOf(item) ? { ...item, isOpen: true } : item,
        ),
      )
      focusFirstError()
      return
    }
    // TODO: 다음 단계(감축목표 설정)로 이동
  }

  return (
    <div className="flex w-full max-w-[1344px] flex-col md:gap-10 md:px-7 md:py-10 lg:px-8">
      <StepMobileNav
        title="감축잠재량 산정"
        step={3}
        total={SELF_CHECK_STEPS.length}
      />

      <div className="flex flex-col gap-6 max-md:hidden lg:flex-row lg:items-center lg:justify-between lg:gap-8">
        <h2 className="text-ink-strong text-lg font-bold whitespace-nowrap md:text-3xl lg:text-4xl">
          감축잠재량 산정
        </h2>
        {/* Stepper 내부 ol 의 줄바꿈·폭을 밖에서 제어한다. 지우면 스테퍼가 접힌다. */}
        <div className="[&_ol]:flex-nowrap sm:w-full sm:[&_ol]:w-full sm:[&_ol>li]:flex-1 sm:[&_ol>li>div:nth-child(1)]:flex-1 sm:[&_ol>li>div:nth-child(3)]:flex-1 lg:w-[730px]">
          <Stepper items={SELF_CHECK_STEPS} activeIndex={2} size={13} />
        </div>
      </div>

      <BaseInfo items={NOTICES} />

      <div className="flex flex-col gap-10 max-md:px-5 max-md:pt-12 max-md:pb-10">
        {/* 시안 간격: 카드 → 체크박스 20px, 체크박스 → 버튼 40px */}
        <div className="flex flex-col gap-5">
          <section className="flex flex-col gap-5">
            {businesses.length === 0 ? (
              <div className="border-line-card bg-surface-card flex flex-col items-center rounded-xl border px-6 py-12 md:rounded-2xl md:py-15">
                <div className="flex flex-col items-center gap-2">
                  <p className="text-ink-strong text-xl font-bold break-keep md:text-2xl">
                    아직 추가된 사업이 없습니다.
                  </p>
                  <p className="text-ink-body text-base break-keep">
                    아래 버튼을 눌러 사업을 추가 해주세요.
                  </p>
                </div>
              </div>
            ) : (
              businesses.map((business, index) => (
                <div key={business.id} id={`business-anchor-${business.id}`}>
                  <BusinessCard
                    business={business}
                    index={index}
                    showErrors={hasTried}
                    errorTick={errorTick}
                    onChange={(next) =>
                      setBusinesses((prev) =>
                        prev.map((item) => (item.id === next.id ? next : item)),
                      )
                    }
                    onRemove={() =>
                      setBusinesses((prev) =>
                        prev.filter((item) => item.id !== business.id),
                      )
                    }
                  />
                </div>
              ))
            )}

            {/* 신청서 작성 화면의 [행 추가하기] 와 같은 규격(면 surface-action · hover 는 surface-flow + 브랜드색 테두리) */}
            <button
              type="button"
              onClick={handleAddBusiness}
              className="bg-surface-action text-brand-primary hover:bg-surface-flow hover:border-brand-primary focus-visible:ring-ash-600 flex h-14 w-full cursor-pointer items-center justify-center gap-1.5 rounded-md border border-transparent text-base font-bold transition-colors outline-hidden focus-visible:ring-2 md:h-16 [&_svg]:size-5"
            >
              <CirclePlus aria-hidden="true" />
              사업 추가
            </button>
          </section>
        </div>

        <div className="grid grid-cols-2 gap-2 md:flex md:items-center md:justify-between md:gap-3">
          <Link
            href="/carbon-leader/self-check/inventory-emission"
            className="min-w-0"
          >
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="border-brand-primary text-brand-primary hover:bg-surface-flow h-11 w-full gap-1 rounded-lg text-sm font-bold md:h-13 md:w-42 [&_svg]:size-5"
            >
              <ArrowLeft aria-hidden="true" />
              이전으로
            </Button>
          </Link>
          <Button
            type="button"
            size="lg"
            disabled={businesses.length === 0}
            onClick={handleNext}
            className="disabled:bg-fill-disabled disabled:text-ink-on-disabled h-11 w-full min-w-0 gap-1 rounded-lg text-sm font-bold disabled:opacity-100 md:h-13 md:w-42 [&_svg]:size-5"
          >
            다음으로
            <ArrowRight aria-hidden="true" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ReductionPotential
