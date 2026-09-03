"use client"

import { Check, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useDialogAutoOpen } from "@/util/use-dialog-auto-open"
import { cn } from "@/lib/utils"

// 선도기업 신청 기준에 미달해 신청을 막는 안내 모달.
// 최초 진입 화면에서 [선도기업 1차 신청] 을 눌렀을 때 조건을 못 채웠으면 뜬다.
// 확인 모달과 달리 닫기(X) 가 없고 [확인] 한 개만 있다 — 되돌릴 선택지가 없어서다.
//
// 조건 줄은 충족 여부에 따라 아이콘과 값 색이 갈린다.
//   충족   체크 · 값은 본문색
//   미충족 엑스 · 값은 오류색
//   등급처럼 통과했음을 더 드러낼 값은 tone 으로 초록을 준다.

export type ConditionTone = "default" | "pass" | "fail"

export interface EligibilityCondition {
  /** 조건 이름. 시안 예시는 "자가진단 작성완료" */
  label: string
  /** 오른쪽에 붙는 현재 값. 시안 예시는 "미완료" · "적정" · "BBB" */
  value: string
  /** 조건을 채웠는지. 아이콘이 이 값으로 갈린다 */
  met: boolean
  /** 값 글자색. 기본은 본문색이고 pass 는 초록, fail 은 오류색이다 */
  tone?: ConditionTone
}

interface EligibilityBlockDialogProps {
  /** 기준이 되는 해. 설명 문구에 들어간다 */
  baseYear?: string
  conditions: EligibilityCondition[]
  onConfirm?: () => void
  open?: boolean
  onOpenChange?: (open: boolean) => void
  /** 모달 전용 라우트로 바로 들어왔을 때 열어 준다 */
  defaultOpen?: boolean
}

const VALUE_TONE: Record<ConditionTone, string> = {
  default: "text-ink-body",
  pass: "text-forest",
  fail: "text-ink-error",
}

const EligibilityBlockDialog = ({
  baseYear = "2026",
  conditions,
  onConfirm,
  open,
  onOpenChange,
  defaultOpen,
}: EligibilityBlockDialogProps) => {
  const [autoOpen, setAutoOpen] = useDialogAutoOpen(defaultOpen)
  const isOpen = open ?? autoOpen
  const setOpen = onOpenChange ?? setAutoOpen

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      {/*
        구조·수치는 이어서 작성 안내 모달(resume-notice-dialog)을 따른다.
        제목 → 회색 패널 상자 → 작은 회색 안내 → 버튼 순서가 같고,
        조건 목록이 그 모달의 진행상태 상자 자리에 들어간다.
        조건이 세 줄이라 상자 폭만 한 단계 넓게 잡았다.
      */}
      <DialogContent className="bg-surface-field w-[calc(100%-2.5rem)] gap-0 rounded-xl px-5 py-6 sm:max-w-[420px] sm:px-7 sm:py-8 lg:max-w-[480px] lg:px-10 lg:py-9">
        {/* DialogHeader 원본이 sm 부터 왼쪽 정렬이라 되돌린다 */}
        <DialogHeader className="gap-4 text-center sm:gap-5 sm:text-center lg:gap-6">
          {/* 제목 색·크기·굵기는 다른 모달과 같다. 줄바꿈 자리는 시안대로 고정한다 */}
          <DialogTitle className="text-ink-strong text-xl leading-7 font-bold break-keep sm:text-2xl sm:leading-9">
            선도기업 신청 기준에 미달되어
            <br />
            신청을 할 수 없습니다.
          </DialogTitle>

          <ul className="bg-surface-panel flex flex-col gap-2.5 rounded-lg px-4 py-3 lg:gap-3">
            {conditions.map((condition) => (
              <li
                key={condition.label}
                className="flex items-center gap-2 text-sm leading-5"
              >
                {condition.met ? (
                  <Check
                    aria-hidden="true"
                    className="text-ink-muted size-4 shrink-0 stroke-[2.75]"
                  />
                ) : (
                  <X
                    aria-hidden="true"
                    className="text-ink-error size-4 shrink-0 stroke-[2.75]"
                  />
                )}
                <span className="text-ink-muted min-w-0 flex-1 text-left font-normal break-keep">
                  {condition.label}
                </span>
                <span
                  className={cn(
                    "shrink-0 font-bold",
                    VALUE_TONE[condition.tone ?? "default"],
                  )}
                >
                  {condition.value}
                </span>
              </li>
            ))}
          </ul>

          <DialogDescription className="text-ash-500 text-xs leading-4 break-keep lg:leading-5">
            기준년도 {baseYear}년 자가진단 기준입니다.
            <br />위 조건을 모두 충족해야 선도기업 신청을 할 수 있습니다.
          </DialogDescription>
        </DialogHeader>

        {/* 되돌릴 선택지가 없어 버튼은 하나뿐이다 */}
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

export default EligibilityBlockDialog
