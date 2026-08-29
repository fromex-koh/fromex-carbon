import type { StepCardData } from "@/app/(site)/(content)/carbon-leader/application/components/step-card"

/**
 * 탄소중립 선도기업 "선도기업 신청" 화면(/carbon-leader/application/*)의 단계 카드 데이터.
 *
 * 신청 플로우 6단계.
 * 카드 4장의 고정 텍스트는 STEP_TEXT 로 공유하고,
 * 단계마다 바뀌는 variant·statusLabel·meta·href 만 세트별로 지정한다.
 * 날짜·신청기간은 예시값이므로 신청 이력 API 값으로 교체해야 한다.
 */
const STEP_TEXT = {
  selfCheck: {
    step: "사전 단계",
    title: "자가진단",
    description:
      "직전 3개년 인벤토리 배출량·감축잠재량·목표 설정 및 평가지표를 작성하는 **사전 진단 단계**입니다. 진단 작성이 완료된 이후 현황 조회가 가능합니다.",
    actionLabel: "자가진단 하기",
  },
  first: {
    step: "STEP 1",
    title: "선도기업 1차 신청",
    description:
      "자가진단 결과인 직전 3개년 매출액·온실가스 배출량을 토대로 **선도기업 1차 신청서**를 작성·제출합니다. 제출 정보는 중간·최종점검의 기준 자료로 활용됩니다.",
    actionLabel: "선도기업 1차 신청",
  },
  middle: {
    step: "STEP 2",
    title: "중간점검",
    description:
      "1차 신청 후 **1년이 경과**하면 탄소감축 계획 및 투자 계획 정보를 담은 **2차 신청서**를 작성합니다. 제출 후 담당자의 중간점검을 거쳐 이행 실적을 확인합니다.",
    actionLabel: "중간점검",
  },
  final: {
    step: "STEP 3",
    title: "최종점검",
    description:
      "중간점검 완료 후 **2년이 경과**하면 최종 감축 실적 및 이행 결과를 담은 **3차 신청서**를 작성합니다. 담당자의 최종점검 통과 후 선도기업 인증서가 발급됩니다.",
    actionLabel: "최종점검",
  },
} as const

// meta(신청일·완료일)는 케이스마다 달라서 쓰는 쪽에서 채운다.
const SELF_CHECK_DONE: Omit<StepCardData, "meta"> = {
  ...STEP_TEXT.selfCheck,
  variant: "complete",
  tone: "teal",
  statusLabel: "신청완료",
  reviewHref: "/carbon-leader/self-check/result",
}

const FIRST_DONE: StepCardData = {
  ...STEP_TEXT.first,
  meta: ["신청일 **2025.05.02**", "완료일 **2025.05.20**"],
  variant: "complete",
  tone: "teal",
  statusLabel: "신청완료",
  reviewHref: "/carbon-leader/application-1/final-confirm/result",
}

const MIDDLE_DONE: StepCardData = {
  ...STEP_TEXT.middle,
  meta: ["신청일 **2026.05.02**", "완료일 **2026.05.20**"],
  variant: "complete",
  tone: "violet",
  statusLabel: "점검완료",
  reviewHref: "/carbon-leader/application-2/result",
}

// 1단계 · 최초 진입
export const INITIAL: StepCardData[] = [
  {
    ...STEP_TEXT.selfCheck,
    meta: "신청기간 **2025.04.01 ~ 2025.06.30**",
    href: "/carbon-leader/self-check/company-info",
    variant: "default",
  },
  { ...STEP_TEXT.first, meta: "신청기간 **미정**", variant: "disabled" },
  { ...STEP_TEXT.middle, meta: "신청기간 **미정**", variant: "disabled" },
  { ...STEP_TEXT.final, meta: "신청기간 **미정**", variant: "disabled" },
]

// 2단계 · 자가진단 완료
export const SELF_CHECK_COMPLETED: StepCardData[] = [
  {
    ...SELF_CHECK_DONE,
    meta: ["신청일 **2025.05.02**", "완료일 **2025.05.20**"],
  },
  {
    ...STEP_TEXT.first,
    meta: "신청기간 **2025.04.01 ~ 2025.06.30**",
    // 신청가능 카드의 CTA 문구는 단계와 무관하게 "자가진단 하기" 로 고정한다.
    actionLabel: "자가진단 하기",
    variant: "default",
  },
  { ...STEP_TEXT.middle, meta: "신청기간 **미정**", variant: "disabled" },
  { ...STEP_TEXT.final, meta: "신청기간 **미정**", variant: "disabled" },
]

// 3단계 · 1차 신청 완료
export const FIRST_COMPLETED: StepCardData[] = [
  { ...SELF_CHECK_DONE, meta: "완료일 **2025.04.20**" },
  FIRST_DONE,
  {
    ...STEP_TEXT.middle,
    meta: "신청기간 **2025.04.01 ~ 2025.06.30**",
    actionLabel: "자가진단 하기",
    variant: "default",
  },
  { ...STEP_TEXT.final, meta: "신청기간 **미정**", variant: "disabled" },
]

// 4단계 · 중간점검 접수
export const MIDDLE_IN_REVIEW: StepCardData[] = [
  { ...SELF_CHECK_DONE, meta: "완료일 **2025.04.20**" },
  FIRST_DONE,
  {
    ...STEP_TEXT.middle,
    meta: "신청일 **2026.05.10**",
    actionLabel: "중간점검 신청",
    variant: "progress",
    statusLabel: "점검 진행중",
  },
  { ...STEP_TEXT.final, meta: "신청기간 **미정**", variant: "disabled" },
]

// 5단계 · 중간점검 완료
export const MIDDLE_COMPLETED: StepCardData[] = [
  { ...SELF_CHECK_DONE, meta: "완료일 **2025.04.20**" },
  FIRST_DONE,
  MIDDLE_DONE,
  {
    ...STEP_TEXT.final,
    meta: "신청기간 **2025.04.01 ~ 2025.06.30**",
    actionLabel: "자가진단 하기",
    variant: "default",
  },
]

// 6단계 · 최종점검 완료
export const FINAL_COMPLETED: StepCardData[] = [
  { ...SELF_CHECK_DONE, meta: "완료일 **2025.04.20**" },
  FIRST_DONE,
  MIDDLE_DONE,
  {
    ...STEP_TEXT.final,
    meta: ["신청일 **2025.05.02**", "완료일 **2025.05.20**"],
    variant: "complete",
    tone: "violet",
    statusLabel: "점검완료",
    reviewHref: "/carbon-leader/application-3/final-confirm/result",
    // 마지막 단계라 다음 액션이 없다. 시안에도 CTA 없이 현황조회만 있다.
    hideAction: true,
  },
]
