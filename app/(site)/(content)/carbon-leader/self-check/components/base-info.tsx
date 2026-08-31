// 화면 상단 "시작하기전에" 안내 박스.
// 모바일에서는 화면 폭을 꽉 채우고(테두리·라운드 없음), 태블릿부터 카드로 묶인다.
// 자가진단 단계들이 함께 쓴다. 문구만 items 로 넘긴다.
const BaseInfo = ({ items }: { items: string[] }) => {
  return (
    <section className="bg-surface-notice flex flex-col gap-3 px-6 pt-6 pb-8 max-md:rounded-none md:rounded-2xl md:pb-6 lg:px-10">
      <h3 className="text-ink-strong text-lg font-bold lg:text-xl">
        시작하기전에
      </h3>
      <ul className="flex flex-col gap-2">
        {items.map((item) => (
          <li
            key={item}
            className="text-ink-body flex gap-1 text-base break-all"
          >
            <span
              aria-hidden="true"
              className="flex h-6.5 w-2.5 shrink-0 items-center justify-center"
            >
              <span className="bg-ink-bullet size-1 rounded-full" />
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default BaseInfo
