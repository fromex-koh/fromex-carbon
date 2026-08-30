"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useDialogAutoOpen } from "@/util/use-dialog-auto-open"

// 자가진단 STEP 1(기업 정보 입력)의 "이어서 작성 안내" 팝업.
// 현재년도 자가진단 수행 내역이 이미 있을 때 재진입하면 뜬다.
// 삭제·변경 확인 모달과 달리 닫기(X) 버튼이 없고 [확인] 한 개만 있다.
//
// 시안 수치(px). html font-size 가 17px 이라 rem 유틸리티는 1.0625 배로 계산되므로,
// 아래 값은 가장 가까운 Tailwind 스케일로 넣었다.
//
//                  360        768        1920
//   카드 폭        100%-40    368        420
//   안쪽 여백      24 / 20    32 / 28    36 / 40
//   제목           20 / 30    24 / 36    26 / 38
//   칸 사이        16         20         24
//   상태 글자      14 / 18    14 / 20    15 / 22   (상자 높이 34 / 36 / 38)
//   본문           12 / 16    12 / 18    13 / 20
//   본문→버튼      20         32         36
//   버튼 높이      48         54         54
//
// 색은 시안 값과 토큰을 하나씩 맞췄다(라이트 / 다크).
//
//   카드 면색      #ffffff / #111111      surface-field
//   제목           #111111 / #ffffff      ink-strong
//   상태 박스      #f8f8f8 / #555555 30%  surface-panel (다크값에 30% 알파가 이미 들어 있다)
//   상태 글자      #666666 / #d2d2d2      ink-muted
//   본문           #999999 / #999999      ash-500 (두 모드 동일)
//   버튼           #4067b4 / #326de2      primary (Button default 변형)
//   버튼 글자      #ffffff                Button default 의 text-white

interface ResumeNoticeDialogProps {
  /** 상태 칸에 들어가는 값. 시안 예시는 "선도기업 신청 연계" */
  status?: string
  onConfirm?: () => void
  open?: boolean
  onOpenChange?: (open: boolean) => void
  /** 모달 전용 라우트로 바로 들어왔을 때 열어 준다 */
  defaultOpen?: boolean
}

const ResumeNoticeDialog = ({
  status = "선도기업 신청 연계",
  onConfirm,
  open,
  onOpenChange,
  defaultOpen,
}: ResumeNoticeDialogProps) => {
  const [autoOpen, setAutoOpen] = useDialogAutoOpen(defaultOpen)
  const isOpen = open ?? autoOpen
  const setOpen = onOpenChange ?? setAutoOpen

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent className="bg-surface-field w-[calc(100%-2.5rem)] gap-0 rounded-xl px-5 py-6 sm:max-w-[368px] sm:px-7 sm:py-8 lg:max-w-[420px] lg:px-10 lg:py-9">
        {/* 제목·상태·본문 사이 간격이 셋 다 같아 헤더 gap 하나로 처리한다.
            DialogHeader 원본이 sm 부터 왼쪽 정렬이라 되돌린다. */}
        <DialogHeader className="gap-4 text-center sm:gap-5 sm:text-center lg:gap-6">
          <DialogTitle className="text-ink-strong text-xl leading-7 font-bold break-keep sm:text-2xl sm:leading-9">
            현재년도(기준년도) 자가진단{" "}
            {/* 시안은 PC 만 이 자리에서 끊는다. 태블릿 이하는 자동 줄바꿈 */}
            <br className="hidden lg:block" />
            수행 내역이 존재합니다.
          </DialogTitle>

          <p className="bg-surface-panel flex items-center justify-center gap-1 rounded-lg py-2 text-sm leading-4 lg:leading-5">
            <span className="text-ink-muted font-normal">진행상태</span>
            <span className="text-ink-muted font-normal">:</span>
            <span className="text-ink-muted font-bold">{status}</span>
          </p>

          <DialogDescription className="text-ash-500 text-xs leading-4 break-keep lg:leading-5">
            해당 자가진단은 선도기업 신청 데이터를 불러온 것으로 추가 작성 또는
            초기화 할 수 없습니다. 내용은 조회만 가능합니다.
          </DialogDescription>
        </DialogHeader>

        <div className="pt-5 sm:pt-8 lg:pt-9">
          <Button
            type="button"
            className="h-11 w-full rounded-lg text-sm font-bold sm:h-13"
            onClick={() => {
              setOpen(false)
              onConfirm?.()
            }}
          >
            확인
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ResumeNoticeDialog
