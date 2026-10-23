import type { Metadata } from "next"

import LeaderSupplementNoticeDialog from "@/app/(site)/login/components/leader-supplement-notice-dialog"

export const metadata: Metadata = {
  title: "선도기업 신청 보완요청",
}

// 다른 모달 전용 라우트와 같이 본문은 비워 두고 모달만 열린 상태로 둔다.
const LeaderSupplementNoticePage = () => {
  return (
    <>
      <div className="bg-surface-page flex w-full justify-center px-5 pt-12 pb-24 md:px-7 md:pt-15 md:pb-42" />
      <LeaderSupplementNoticeDialog defaultOpen />
    </>
  )
}

export default LeaderSupplementNoticePage
