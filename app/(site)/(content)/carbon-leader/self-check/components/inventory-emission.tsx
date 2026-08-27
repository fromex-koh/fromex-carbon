"use client"

import { useState } from "react"

import { Checkbox } from "@/components/ui/checkbox"
import { Stepper } from "@/components/ui/stepper"
import { SELF_CHECK_STEPS } from "@/constants/carbon-leader-self-check-steps"
import StepMobileNav from "@/app/(site)/(content)/carbon-leader/self-check/components/step-mobile-nav"
import BaseInfo from "@/app/(site)/(content)/carbon-leader/self-check/components/base-info"
import StepNav from "@/app/(site)/(content)/carbon-leader/self-check/components/step-nav"
import EmissionInput from "@/app/(site)/(content)/carbon-leader/self-check/components/emission-input"
import ItemSelectDialog from "@/app/(site)/(content)/carbon-leader/self-check/components/item-select-dialog"
import type { EmissionLeaf } from "@/constants/carbon-leader-self-check-emission-items"
import ScopeGuideDialog from "@/app/(site)/(content)/carbon-leader/self-check/components/scope-guide-dialog"

const NOTICES = [
  "[인벤토리 설정]에서 산정할 배출 항목을 선택하면, 선택한 항목의 입력 필드가 아래에 나타납니다.",
  "연도별 사용량(활동량)을 입력하면 배출계수가 자동 적용되어 배출량이 실시간 산정됩니다.",
]

// 자가진단 Step 2. 항목을 고르기 전에는 빈 상태, 모달에서 [선택] 하면 값 입력 카드가 나온다.
// [인벤토리 추가] 는 항목 선택 모달(self-check/inventory-emission/item-select),
// [Scope 설명] 은 Scope 안내 다이얼로그(.../scope-guide)를 여는 자리다.
// 모바일은 상단 제목·스테퍼 대신 StepMobileNav 를 쓰고, 안내 박스가 화면 폭을 꽉 채운다.
interface InventoryEmissionProps {
  /** 인벤토리 항목 선택 모달을 연 채로 진입 (IA 11) */
  openItemSelect?: boolean
  /** Scope 설명 다이얼로그를 연 채로 진입 (IA 12) */
  openScopeGuide?: boolean
  /** 항목 선택 모달의 "검색 결과 없음" 화면을 확인하기 위한 퍼블리싱용 플래그 */
  emptyItems?: boolean
}

const InventoryEmission = ({
  openItemSelect,
  openScopeGuide,
  emptyItems,
}: InventoryEmissionProps) => {
  // 모달에서 고른 항목. 실제로는 저장된 자가진단 데이터를 불러와 채운다.
  const [picked, setPicked] = useState<EmissionLeaf[]>([])
  // 정보 활용에 동의해야 다음 단계로 넘어갈 수 있다.
  const [agreed, setAgreed] = useState(false)

  const itemSelect = (
    <ItemSelectDialog
      defaultOpen={openItemSelect}
      emptyItems={emptyItems}
      value={picked}
      onConfirm={setPicked}
    />
  )

  return (
    <div className="flex w-full max-w-[1344px] flex-col md:gap-8 md:px-7 md:py-10 lg:gap-10 lg:px-8">
      <StepMobileNav
        title="인벤토리 배출량 산정"
        step={2}
        total={SELF_CHECK_STEPS.length}
      />

      <div className="flex flex-col gap-8 max-md:hidden lg:flex-row lg:items-center lg:justify-between">
        <h2 className="text-lg font-bold whitespace-nowrap md:text-3xl lg:text-4xl">
          인벤토리 배출량 산정
        </h2>
        {/* Stepper 내부 ol 의 줄바꿈·폭을 밖에서 제어한다. 지우면 스테퍼가 접힌다. */}
        <div className="[&_ol]:flex-nowrap sm:w-full sm:[&_ol]:w-full sm:[&_ol>li]:flex-1 sm:[&_ol>li>div:nth-child(1)]:flex-1 sm:[&_ol>li>div:nth-child(3)]:flex-1 lg:w-[730px]">
          <Stepper items={SELF_CHECK_STEPS} activeIndex={1} size={13} />
        </div>
      </div>

      <BaseInfo items={NOTICES} />

      {/* 입력값·동의 여부를 한 번에 넘기려고 폼으로 감싼다. 저장 API 는 프론트에서 연결한다. */}
      <form
        onSubmit={(event) => {
          event.preventDefault()
          // TODO: 자가진단 Step 2 저장 API 연동 후 다음 단계로 이동
        }}
        className="flex flex-col gap-10 max-md:px-5 max-md:pt-12 max-md:pb-10 md:gap-10"
      >
        <section className="flex flex-col gap-6">
          <div className="flex justify-end">
            <ScopeGuideDialog defaultOpen={openScopeGuide} />
          </div>

          {picked.length > 0 ? (
            <EmissionInput leaves={picked} addButton={itemSelect} />
          ) : (
            <div className="border-border flex flex-col items-center gap-10 rounded-2xl border px-5 py-10 text-center md:gap-14 md:px-8 md:py-14 lg:px-10">
              <div className="flex flex-col gap-2">
                <p className="text-lg font-bold break-all md:text-2xl">
                  [인벤토리 설정] 버튼을 눌러 인벤토리 항목을 선택해주세요
                </p>
                <p className="text-ash-700 text-sm break-all md:text-base">
                  Scope 1⋅2⋅3 의 대분류를 고르고, 중분류⋅소분류 항목을 선택하면
                  입력 필드가 생성 됩니다.
                </p>
              </div>
              {itemSelect}
            </div>
          )}
        </section>

        {/* 동의 여부는 폼 값 agree 로 전송되고, 체크 전에는 [다음으로] 가 잠긴다. */}
        <div className="flex items-start gap-2.5">
          <Checkbox
            id="inventory-agree"
            name="inventory-agree"
            checked={agreed}
            onCheckedChange={(checked) => setAgreed(checked === true)}
            className="bg-background mt-0.5"
          />
          <label
            htmlFor="inventory-agree"
            className="cursor-pointer text-base break-all lg:font-medium"
          >
            입력한 정보에 대해 기술보증기금이 활용하는 것에 동의합니다
          </label>
        </div>

        <StepNav
          prevHref="/carbon-leader/self-check/company-info"
          nextDisabled={!agreed}
        />
      </form>
    </div>
  )
}

export default InventoryEmission
