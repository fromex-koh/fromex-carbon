import { Skeleton } from "@/components/ui/skeleton"

// 단계 카드 4장의 로딩 화면.
// 이 화면은 카드만 신청 이력 API 에 의존해서, 세그먼트 loading.tsx 대신
// application-screen.tsx 안의 Suspense fallback 으로 쓴다.
//
// 막대 높이는 자가진단 로딩(company-info-loading.tsx)과 같은 기준을 쓴다.
// h-4 본문 · h-5 라벨 · h-6 제목, 배지·버튼처럼 모양이 있는 요소만 실제 크기를 따른다.
const StepCardsLoading = () => {
  return (
    <ul className="grid gap-7 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <li
          key={index}
          className="border-border flex flex-col gap-2 rounded-xl border p-5 md:p-6 lg:gap-4 lg:p-8"
        >
          <div className="flex items-center justify-between gap-2">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-7 w-20 rounded-full" />
          </div>

          <div className="flex flex-1 flex-col gap-3 lg:gap-6">
            <div className="border-border flex flex-col gap-2 border-b pb-3 md:gap-2.5 lg:gap-3 lg:pb-6">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-10/12" />
              <Skeleton className="h-4 w-8/12" />
            </div>
            <Skeleton className="h-4 w-40" />
          </div>

          <div className="flex flex-col gap-2 pt-6 md:gap-2.5 lg:gap-2">
            <Skeleton className="h-13 w-full" />
          </div>
        </li>
      ))}
    </ul>
  )
}

export default StepCardsLoading
