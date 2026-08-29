import RichText from "@/app/(site)/(content)/carbon-leader/application/components/rich-text"

// 화면 상단 안내 박스.
// 문장 안의 **강조** 표기는 RichText 가 <strong> 으로 바꾼다.
// 이 화면에서만 쓰는 컴포넌트라 자가진단 쪽 BaseInfo 와 공유하지 않는다.
const BaseInfo = ({ items }: { items: string[] }) => {
  return (
    <section className="bg-surface-notice flex flex-col gap-2 rounded-2xl p-5 md:p-6 lg:p-10">
      <ul className="flex flex-col gap-2">
        {items.map((item) => (
          <li
            key={item}
            className="text-ink-body flex gap-1 text-sm leading-tight break-all md:text-base md:leading-relaxed"
          >
            <span
              aria-hidden="true"
              className="flex h-6.5 w-2.5 shrink-0 items-center justify-center"
            >
              <span className="bg-ink-bullet size-1 rounded-full" />
            </span>
            <span>
              <RichText text={item} />
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default BaseInfo
