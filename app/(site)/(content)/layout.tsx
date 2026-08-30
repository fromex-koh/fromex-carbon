import type { ReactNode } from "react"

// (content) 그룹 공통 껍데기.
// 이 아래 화면들은 배너·서브비주얼을 화면 폭 가득 깔고 본문만 가운데로 모으는 구조가 같아서,
// 그 래퍼를 여기서 한 번만 잡는다. 각 page.tsx 는 배너와 본문만 순서대로 렌더하면 된다.
const ContentLayout = ({ children }: { children: ReactNode }) => {
  return <div className="flex w-full flex-col items-center">{children}</div>
}

export default ContentLayout
