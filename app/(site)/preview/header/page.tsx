import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "헤더 상태 확인",
}

// [퍼블리싱 노출용] 원래 IA 에 없는 확인용 화면이다.
// 로그인/로그아웃별 헤더 메뉴 구성만 보여주려고 만들었고, 본문은 비워 둔다.
// 헤더·푸터는 app/layout.tsx 가 그리므로 이 파일에는 본문 자리만 있다.
// 로그인 상태는 ?login=true 로 전환한다(nav-bar 의 퍼블리싱용 분기).
// 실제 로그인 연동 시 이 폴더째 삭제하면 된다.
const HeaderPreviewPage = () => {
  return (
    // 좌우 정렬을 헤더와 맞춘다. 헤더는 px-4 안에서 max-w-[1276px] 를 쓴다.
    <div className="flex w-full justify-center px-4">
      <div className="flex w-full max-w-[1276px] flex-col gap-2 py-20 md:py-30">
        <p className="text-ink-strong text-lg font-bold break-keep md:text-xl">
          헤더 상태 확인용 화면
        </p>
        <p className="text-ink-body text-base break-keep">
          위 헤더와 아래 푸터만 확인하는 화면입니다. 본문은 비어 있습니다.
        </p>
      </div>
    </div>
  )
}

export default HeaderPreviewPage
