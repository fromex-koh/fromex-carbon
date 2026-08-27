import { Suspense } from "react"

import BaseInfo from "@/app/(site)/(content)/carbon-leader/application/components/base-info"
import ProcessFlow from "@/app/(site)/(content)/carbon-leader/application/components/process-flow"
import StepCards from "@/app/(site)/(content)/carbon-leader/application/components/step-cards"
import StepCardsLoading from "@/app/(site)/(content)/carbon-leader/application/components/step-cards-loading"
import { type StepCardData } from "@/app/(site)/(content)/carbon-leader/application/components/step-card"
import SubVisual from "@/app/(site)/(content)/carbon-leader/application/components/sub-visual"

const NOTICES = [
  "탄소중립 선도기업 신청은 **자가진단**을 시작으로 총 3차 신청 및 점검 절차에 따라 진행됩니다.",
  "기업은 먼저 자가진단을 통해 직전 3개년도 매출액과 온실가스 배출량을 확인하고, 자가진단 완료 후 **선도기업 1차 신청서**를 작성합니다.",
  "1차 신청서 제출 후 **1년이 경과**하면 **2차 신청서**를 작성하고 담당자의 **중간점검**이 진행됩니다.",
  "중간점검 이후 **2년이 경과**하면 **3차 신청서**를 작성하고 **최종점검**을 거쳐 탄소중립 선도기업 인증서 발급 절차가 진행됩니다.",
]

// 신청 플로우 6단계가 모두 같은 화면을 쓰고 카드 상태만 다르다.
// 단계별 카드 데이터는 constants/carbon-leader-application-step-cards.ts 에 있고,
// 각 page.tsx 가 그중 하나를 넘긴다.
const ApplicationScreen = ({ cards }: { cards: StepCardData[] }) => {
  return (
    <>
      <SubVisual />
      <div className="flex w-full max-w-[1344px] flex-col gap-8 px-5 py-10 md:px-7 lg:px-8">
        <h2 className="text-2xl font-bold md:text-3xl lg:text-4xl">
          탄소중립 선도기업
        </h2>

        <BaseInfo items={NOTICES} />

        <ProcessFlow />

        <section className="flex flex-col gap-10">
          <div className="flex flex-col gap-2">
            <h3 className="text-2xl font-bold md:text-3xl lg:text-2xl">
              신청 안내
            </h3>
            {/* 문장 단위로 줄을 나눈다. 해상도와 무관하게 동일. */}
            <p className="text-ash-800 text-base break-all">
              <span className="block">
                탄소중립 선도기업 신청을 위해 먼저 자가진단을 진행해 주세요.
              </span>
              <span>
                자가진단에서는 직전 3개년 매출액과 온실가스 배출량, 감축잠재량,
                감축 목표 및 평가지표를 작성합니다.
              </span>
            </p>
          </div>

          {/* 카드 4장만 신청 이력 API 에 의존한다. StepCards 가 async 로 바뀌어도
              서브비주얼·안내·프로세스 바는 먼저 그려지고 이 자리만 스켈레톤이 뜬다. */}
          <Suspense fallback={<StepCardsLoading />}>
            <StepCards cards={cards} />
          </Suspense>
        </section>
      </div>
    </>
  )
}

export default ApplicationScreen
