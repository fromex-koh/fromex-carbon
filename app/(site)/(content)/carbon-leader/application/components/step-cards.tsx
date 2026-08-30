import StepCard, {
  type StepCardData,
} from "@/app/(site)/(content)/carbon-leader/application/components/step-card"

// 신청 이력에 따라 상태가 갈리는 카드 4장.
// 지금은 page.tsx 가 넘겨 주는 정적 상수를 그대로 그리지만,
// 신청 이력 API 를 붙일 때는 이 컴포넌트를 async 로 바꿔 안에서 await 하면 된다.
// 그러면 상위 Suspense 가 StepCardsLoading 을 보여 주고 나머지 화면은 먼저 그려진다.
const StepCards = ({ cards }: { cards: StepCardData[] }) => {
  return (
    <ul className="grid gap-7 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <StepCard key={card.step} data={card} />
      ))}
    </ul>
  )
}

export default StepCards
