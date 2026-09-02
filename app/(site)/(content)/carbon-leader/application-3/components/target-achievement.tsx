"use client"

import { createContext, useContext, useRef, useState } from "react"
import { ArrowLeft, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Stepper } from "@/components/ui/stepper"
import BaseInfo from "@/app/(site)/(content)/carbon-leader/self-check/components/base-info"
import StepMobileNav from "@/app/(site)/(content)/carbon-leader/self-check/components/step-mobile-nav"
import { cn } from "@/lib/utils"

// 선도기업 신청 3차 STEP 3(목표달성 평가).
// 평가 기본 설정 카드 하나에 이어 평가 기준 카드 4장이 같은 껍데기를 쓴다.
// 기준 카드는 안쪽이 [번호 붙은 표 블록] 여럿 + 마지막 요약 줄로 갈린다.

/** 3차 신청은 자가진단과 달리 6단계다. 지금 화면은 세 번째다 */
const STEPS = [
  "3차신청",
  "인벤토리 배출량",
  "목표달성평가",
  "서류제출",
  "최종확인",
  "제출완료",
]

/** 감축목표율 선택지. 4개 평가 기준에 공통으로 적용되는 값이다 */
const TARGET_RATES = ["4%", "6%", "8%", "10%"]

const NOTICES = [
  "최종 감축 실적 및 탄소중립 이행 결과 정보를 입력합니다. 관리자 검토 후 인증서가 발급됩니다.",
]

/** 표 한 줄. cells 는 columns 와 같은 개수이며 unit 은 칸 오른쪽에 붙는다 */
interface TableRow {
  label: string
  /** 앞 줄들로 자동 산출되는 줄. 칸 전체가 읽기 전용이다 */
  readOnly?: boolean
  /** 이름표 아래 줄에 붙는 단위 안내 */
  sub?: string
  /** 360 에서만 이름표 오른쪽에 붙는 단위 안내 */
  subMobile?: string
  cells: string[]
  unit: string
}

/** 번호가 붙는 표 블록 */
interface Block {
  title: string
  /** 실적처럼 다른 단계에서 넘어오는 값. 칸 전체가 읽기 전용이다 */
  readOnly?: boolean
  columns: string[]
  rows: TableRow[]
}

/** 블록 마지막의 요약 줄. 마지막 칸이 평가 결과라 색이 따로 붙는다 */
interface Summary {
  title: string
  columns: string[]
  values: string[]
}

interface Criterion {
  title: string
  desc: string
  blocks: Block[]
  summary: Summary
}

/**
 * 끝에 붙는 괄호를 보조 문구로 떼어 낸다. (자동)·(실적)·(2021) 이 여기 해당한다.
 * 가운데에 낀 괄호(최종년도(3차) 실적 배출량)는 이름의 일부라 그대로 둔다.
 */
const withNote = (text: string, noteClass: string) => {
  const match = /^(.*?)\s*(\([^)]*\))$/.exec(text)
  if (!match) return text
  return (
    <>
      {match[1]}
      <span className={cn("ml-1", noteClass)}>{match[2]}</span>
    </>
  )
}

/**
 * 값 뒤에 붙는 단위. 표 머리의 괄호와 같은 규칙으로 색은 그대로 두고 크기만 줄인다.
 * "480 tCO₂eq" 처럼 숫자와 단위가 한 문자열로 오는 요약 표에서 쓴다.
 */
const withUnit = (value: string) => {
  const match = /^(\S+)\s+(\S+)$/.exec(value)
  if (!match) return value
  return (
    <>
      {match[1]}
      <span className="ml-1 text-xs">{match[2]}</span>
    </>
  )
}

/** 칸마다 붙는 오류 문구를 아래로 내려 보내는 통로 */
const FieldErrorContext = createContext<Record<string, string>>({})

/** 오류 문구 한 줄. 다른 자가진단·신청 화면과 같은 규격이다 */
const FieldError = ({ message }: { message?: string }) =>
  message ? <p className="text-ink-error text-sm">{message}</p> : null

/**
 * 숫자 칸 검사 규칙. 비었는지 먼저 보고 그다음 숫자인지 본다.
 * 배출량·생산량·허용량 모두 0 이하가 나올 수 없다.
 */
const fieldErrorOf = (raw: string) => {
  const value = raw.trim()
  if (!value) return "값을 입력해 주세요."
  if (!/^\d+(\.\d+)?$/.test(value)) return "숫자만 입력해 주세요."
  if (Number(value) <= 0) return "0 보다 큰 값을 입력해 주세요."
  return null
}

/** 앞 칸들로 자동 산출되는 열. 사용자가 채우는 칸이 아니다 */
const isAutoColumn = (column: string) =>
  column.includes("자동") || column === "최종년도 배출량"

/** [퍼블리싱 노출용] 화면을 보여 주려고 넣어 둔 값이다 */

/** 일반기업 · 달성 — 절대배출량 하나로 끝난다 */
const GENERAL_MET: Criterion[] = [
  // 절대배출량 달성 — (480 − 370) ÷ 480 = 22.9% ≥ 6%
  {
    title: "절대배출량 기준",
    desc: "감축목표율과 평가 기간을 확인합니다. 감축목표율은 4개 평가 기준에 공통 적용됩니다.",
    blocks: [
      {
        title: "기준배출량",
        columns: ["구분", "2019년", "2020년", "2021년", "3개년 평균 (자동)"],
        rows: [
          {
            label: "온실가스 배출량",
            subMobile: "(tCO₂eq)",
            cells: ["500", "480", "460", "480"],
            unit: "tCO₂eq",
          },
        ],
      },
      {
        title: "탄소배출량 (실적)",
        readOnly: true,
        columns: [
          "구분",
          "1차년도 (2021)",
          "2차년도 (2022)",
          "3차년도 (2023)",
          "최종년도 배출량",
        ],
        rows: [
          {
            label: "실적 배출량",
            cells: ["430", "400", "370", "370"],
            unit: "tCO₂eq",
          },
        ],
      },
    ],
    summary: {
      title: "목표달성 평가",
      columns: [
        "기준연도 평균 배출량",
        "최종년도(3차) 실적 배출량",
        "절대배출량 감축률 (자동계산)",
        "목표감축률",
        "평가 결과",
      ],
      values: ["480 tCO₂eq", "370 tCO₂eq", "22.9%", "6%", "달성"],
    },
  },
]

/** 일반기업 · 미달성 — 절대배출량이 미달이라 원단위 · 감축량이 함께 열린다 */
const GENERAL_UNMET: Criterion[] = [
  // 절대배출량 미달 — (475 − 465) ÷ 475 = 2.1% < 6%
  {
    title: "절대배출량 기준",
    desc: "감축목표율과 평가 기간을 확인합니다. 감축목표율은 4개 평가 기준에 공통 적용됩니다.",
    blocks: [
      {
        title: "기준배출량",
        columns: ["구분", "2019년", "2020년", "2021년", "3개년 평균 (자동)"],
        rows: [
          {
            label: "온실가스 배출량",
            subMobile: "(tCO₂eq)",
            cells: ["480", "475", "470", "475"],
            unit: "tCO₂eq",
          },
        ],
      },
      {
        title: "탄소배출량 (실적)",
        readOnly: true,
        columns: [
          "구분",
          "1차년도 (2021)",
          "2차년도 (2022)",
          "3차년도 (2023)",
          "최종년도 배출량",
        ],
        rows: [
          {
            label: "실적 배출량",
            cells: ["470", "468", "465", "465"],
            unit: "tCO₂eq",
          },
        ],
      },
    ],
    summary: {
      title: "목표달성 평가",
      columns: [
        "기준연도 평균 배출량",
        "최종년도(3차) 실적 배출량",
        "절대배출량 감축률 (자동계산)",
        "목표감축률",
        "평가 결과",
      ],
      values: ["475 tCO₂eq", "465 tCO₂eq", "2.1%", "6%", "미달성"],
    },
  },
  // 원단위 미달 — (0.048 − 0.045) ÷ 0.048 = 5.0% < 6%
  {
    title: "원단위 기준",
    desc: "생산량 단위당 배출량(원단위) 감축률로 평가합니다. 기준연도·이행연도 생산량을 입력하세요.",
    blocks: [
      {
        title: "기준연도 원단위",
        columns: ["구분", "2019년", "2020년", "2021년", "3개년 평균 (자동)"],
        rows: [
          {
            label: "온실가스 배출량",
            sub: "(tCO₂eq)",
            readOnly: true,
            cells: ["480", "475", "470", "475"],
            unit: "tCO₂eq",
          },
          {
            label: "생산량/매출액",
            sub: "(TON or 백만원)",
            cells: ["10,000", "10,000", "10,000", "10,000"],
            unit: "백만원",
          },
          {
            label: "원단위",
            sub: "(tCO₂eq/TON or 백만원)",
            readOnly: true,
            cells: ["0.048", "0.048", "0.047", "0.048"],
            unit: "tCO₂eq",
          },
        ],
      },
      {
        title: "이행연도 원단위 (최종년도 기준)",
        columns: ["구분", "1차 (2021)", "2차 (2022)", "3차 (2023)"],
        rows: [
          {
            label: "온실가스 배출량",
            sub: "(tCO₂eq)",
            readOnly: true,
            cells: ["470", "468", "465"],
            unit: "tCO₂eq",
          },
          {
            label: "생산량/매출액",
            sub: "(TON or 백만원)",
            cells: ["10,200", "10,250", "10,300"],
            unit: "백만원",
          },
          {
            label: "원단위",
            sub: "(tCO₂eq/TON or 백만원)",
            readOnly: true,
            cells: ["0.046", "0.046", "0.045"],
            unit: "tCO₂eq",
          },
        ],
      },
    ],
    summary: {
      title: "목표달성 평가",
      columns: [
        "기준연도 원단위 평균",
        "3차년도 원단위",
        "원단위 감축률 (자동계산)",
        "목표감축률",
        "평가 결과",
      ],
      values: ["0.048", "0.045", "5.0%", "6%", "미달성"],
    },
  },
  // 감축량 미달 — 이행평균 7.33 ÷ 기준평균 475 = 1.5% < 6%
  {
    title: "감축량 기준",
    desc: "이행기간 3개년 평균 감축량의 기준연도 대비 비율로 평가합니다. 기준연도 배출량 입력 후 자동 산출됩니다.",
    blocks: [
      {
        title: "기준배출량",
        readOnly: true,
        columns: ["구분", "2019년", "2020년", "2021년", "3개년 평균 (자동)"],
        rows: [
          {
            label: "온실가스 배출량",
            sub: "(tCO₂eq)",
            cells: ["480", "475", "470", "475"],
            unit: "tCO₂eq",
          },
        ],
      },
      {
        title: "탄소감축량",
        readOnly: true,
        columns: [
          "구분",
          "1차년도 (2021)",
          "2차년도 (2022)",
          "3차년도 (2023)",
          "이행평균 (자동)",
        ],
        rows: [
          {
            label: "감축량",
            subMobile: "(tCO₂eq)",
            cells: ["5", "7", "10", "7"],
            unit: "tCO₂eq",
          },
          {
            label: "연도별 감축율",
            sub: "(감축량 ÷ 기준평균)",
            cells: ["1.1", "1.5", "2.1", "1.5"],
            unit: "%",
          },
        ],
      },
    ],
    summary: {
      title: "목표달성 평가",
      columns: [
        "기준연도 평균 배출량",
        "이행기간 평균 감축량",
        "평가기준 감축율 (자동계산)",
        "목표감축률",
        "평가 결과",
      ],
      values: ["475 tCO₂eq", "7 tCO₂eq", "1.5%", "6%", "미달성"],
    },
  },
]

/** 목표관리업체 · 달성 — 목표관리 하나로 끝난다 */
const TARGET_MET: Criterion[] = [
  // 목표관리 달성 — 3차년도 실적 370 ≤ 허용량 380
  {
    title: "목표관리업체 기준",
    desc: "정부 할당 배출허용량 이내로 실적을 달성했는지 절대량으로 비교합니다.",
    blocks: [
      {
        title: "당해연도(이행 3차) 배출허용량",
        columns: ["구분", "1차년도 (2021)", "2차년도 (2022)", "3차년도 (2023)"],
        rows: [
          {
            label: "배출허용량",
            subMobile: "(tCO₂eq)",
            cells: ["440", "410", "380"],
            unit: "tCO₂eq",
          },
        ],
      },
      {
        title: "탄소배출량(실적)",
        readOnly: true,
        columns: ["구분", "1차년도 (2021)", "2차년도 (2022)", "3차년도 (2023)"],
        rows: [
          {
            label: "실적 배출량",
            subMobile: "(tCO₂eq)",
            cells: ["430", "400", "370"],
            unit: "tCO₂eq",
          },
          {
            label: "연도별 감축율",
            sub: "((허용 − 실적) ÷ 허용)",
            cells: ["2.3", "2.4", "2.6"],
            unit: "%",
          },
        ],
      },
    ],
    summary: {
      title: "목표달성 평가",
      columns: [
        "3차년도 실적 배출량",
        "3차년도 배출허용량",
        "평가 결과 (실적 ≤ 허용량)",
      ],
      values: ["370 tCO₂eq", "380 tCO₂eq", "달성"],
    },
  },
]

/** 목표관리업체 · 절대배출량 달성 — 목표관리가 미달이라 절대배출량이 이어서 열린다 */
const TARGET_ABS_MET: Criterion[] = [
  // 목표관리 미달 — 370 > 360. 뒤이어 열리는 절대배출량은 달성한다
  {
    title: "목표관리업체 기준",
    desc: "정부 할당 배출허용량 이내로 실적을 달성했는지 절대량으로 비교합니다.",
    blocks: [
      {
        title: "당해연도(이행 3차) 배출허용량",
        columns: ["구분", "1차년도 (2021)", "2차년도 (2022)", "3차년도 (2023)"],
        rows: [
          {
            label: "배출허용량",
            subMobile: "(tCO₂eq)",
            cells: ["440", "410", "360"],
            unit: "tCO₂eq",
          },
        ],
      },
      {
        title: "탄소배출량(실적)",
        readOnly: true,
        columns: ["구분", "1차년도 (2021)", "2차년도 (2022)", "3차년도 (2023)"],
        rows: [
          {
            label: "실적 배출량",
            subMobile: "(tCO₂eq)",
            cells: ["430", "400", "370"],
            unit: "tCO₂eq",
          },
          {
            label: "연도별 감축율",
            sub: "((허용 − 실적) ÷ 허용)",
            cells: ["2.3", "2.4", "-2.8"],
            unit: "%",
          },
        ],
      },
    ],
    summary: {
      title: "목표달성 평가",
      columns: [
        "3차년도 실적 배출량",
        "3차년도 배출허용량",
        "평가 결과 (실적 ≤ 허용량)",
      ],
      values: ["370 tCO₂eq", "360 tCO₂eq", "미달성"],
    },
  },
  // 절대배출량 달성 — (480 − 370) ÷ 480 = 22.9% ≥ 6%
  {
    title: "절대배출량 기준",
    desc: "감축목표율과 평가 기간을 확인합니다. 감축목표율은 4개 평가 기준에 공통 적용됩니다.",
    blocks: [
      {
        title: "기준배출량",
        columns: ["구분", "2019년", "2020년", "2021년", "3개년 평균 (자동)"],
        rows: [
          {
            label: "온실가스 배출량",
            subMobile: "(tCO₂eq)",
            cells: ["500", "480", "460", "480"],
            unit: "tCO₂eq",
          },
        ],
      },
      {
        title: "탄소배출량 (실적)",
        readOnly: true,
        columns: [
          "구분",
          "1차년도 (2021)",
          "2차년도 (2022)",
          "3차년도 (2023)",
          "최종년도 배출량",
        ],
        rows: [
          {
            label: "실적 배출량",
            cells: ["430", "400", "370", "370"],
            unit: "tCO₂eq",
          },
        ],
      },
    ],
    summary: {
      title: "목표달성 평가",
      columns: [
        "기준연도 평균 배출량",
        "최종년도(3차) 실적 배출량",
        "절대배출량 감축률 (자동계산)",
        "목표감축률",
        "평가 결과",
      ],
      values: ["480 tCO₂eq", "370 tCO₂eq", "22.9%", "6%", "달성"],
    },
  },
]

/** 목표관리업체 · 전 기준 미달 — 네 기준이 모두 열린다 */
const TARGET_UNMET: Criterion[] = [
  // 목표관리 미달 — 465 > 450. 뒤이어 열리는 기준도 모두 미달이다
  {
    title: "목표관리업체 기준",
    desc: "정부 할당 배출허용량 이내로 실적을 달성했는지 절대량으로 비교합니다.",
    blocks: [
      {
        title: "당해연도(이행 3차) 배출허용량",
        columns: ["구분", "1차년도 (2021)", "2차년도 (2022)", "3차년도 (2023)"],
        rows: [
          {
            label: "배출허용량",
            subMobile: "(tCO₂eq)",
            cells: ["480", "470", "450"],
            unit: "tCO₂eq",
          },
        ],
      },
      {
        title: "탄소배출량(실적)",
        readOnly: true,
        columns: ["구분", "1차년도 (2021)", "2차년도 (2022)", "3차년도 (2023)"],
        rows: [
          {
            label: "실적 배출량",
            subMobile: "(tCO₂eq)",
            cells: ["470", "468", "465"],
            unit: "tCO₂eq",
          },
          {
            label: "연도별 감축율",
            sub: "((허용 − 실적) ÷ 허용)",
            cells: ["2.1", "0.4", "-3.3"],
            unit: "%",
          },
        ],
      },
    ],
    summary: {
      title: "목표달성 평가",
      columns: [
        "3차년도 실적 배출량",
        "3차년도 배출허용량",
        "평가 결과 (실적 ≤ 허용량)",
      ],
      values: ["465 tCO₂eq", "450 tCO₂eq", "미달성"],
    },
  },
  // 절대배출량 미달 — (475 − 465) ÷ 475 = 2.1% < 6%
  {
    title: "절대배출량 기준",
    desc: "감축목표율과 평가 기간을 확인합니다. 감축목표율은 4개 평가 기준에 공통 적용됩니다.",
    blocks: [
      {
        title: "기준배출량",
        columns: ["구분", "2019년", "2020년", "2021년", "3개년 평균 (자동)"],
        rows: [
          {
            label: "온실가스 배출량",
            subMobile: "(tCO₂eq)",
            cells: ["480", "475", "470", "475"],
            unit: "tCO₂eq",
          },
        ],
      },
      {
        title: "탄소배출량 (실적)",
        readOnly: true,
        columns: [
          "구분",
          "1차년도 (2021)",
          "2차년도 (2022)",
          "3차년도 (2023)",
          "최종년도 배출량",
        ],
        rows: [
          {
            label: "실적 배출량",
            cells: ["470", "468", "465", "465"],
            unit: "tCO₂eq",
          },
        ],
      },
    ],
    summary: {
      title: "목표달성 평가",
      columns: [
        "기준연도 평균 배출량",
        "최종년도(3차) 실적 배출량",
        "절대배출량 감축률 (자동계산)",
        "목표감축률",
        "평가 결과",
      ],
      values: ["475 tCO₂eq", "465 tCO₂eq", "2.1%", "6%", "미달성"],
    },
  },
  // 원단위 미달 — (0.048 − 0.045) ÷ 0.048 = 5.0% < 6%
  {
    title: "원단위 기준",
    desc: "생산량 단위당 배출량(원단위) 감축률로 평가합니다. 기준연도·이행연도 생산량을 입력하세요.",
    blocks: [
      {
        title: "기준연도 원단위",
        columns: ["구분", "2019년", "2020년", "2021년", "3개년 평균 (자동)"],
        rows: [
          {
            label: "온실가스 배출량",
            sub: "(tCO₂eq)",
            readOnly: true,
            cells: ["480", "475", "470", "475"],
            unit: "tCO₂eq",
          },
          {
            label: "생산량/매출액",
            sub: "(TON or 백만원)",
            cells: ["10,000", "10,000", "10,000", "10,000"],
            unit: "백만원",
          },
          {
            label: "원단위",
            sub: "(tCO₂eq/TON or 백만원)",
            readOnly: true,
            cells: ["0.048", "0.048", "0.047", "0.048"],
            unit: "tCO₂eq",
          },
        ],
      },
      {
        title: "이행연도 원단위 (최종년도 기준)",
        columns: ["구분", "1차 (2021)", "2차 (2022)", "3차 (2023)"],
        rows: [
          {
            label: "온실가스 배출량",
            sub: "(tCO₂eq)",
            readOnly: true,
            cells: ["470", "468", "465"],
            unit: "tCO₂eq",
          },
          {
            label: "생산량/매출액",
            sub: "(TON or 백만원)",
            cells: ["10,200", "10,250", "10,300"],
            unit: "백만원",
          },
          {
            label: "원단위",
            sub: "(tCO₂eq/TON or 백만원)",
            readOnly: true,
            cells: ["0.046", "0.046", "0.045"],
            unit: "tCO₂eq",
          },
        ],
      },
    ],
    summary: {
      title: "목표달성 평가",
      columns: [
        "기준연도 원단위 평균",
        "3차년도 원단위",
        "원단위 감축률 (자동계산)",
        "목표감축률",
        "평가 결과",
      ],
      values: ["0.048", "0.045", "5.0%", "6%", "미달성"],
    },
  },
  // 감축량 미달 — 이행평균 7.33 ÷ 기준평균 475 = 1.5% < 6%
  {
    title: "감축량 기준",
    desc: "이행기간 3개년 평균 감축량의 기준연도 대비 비율로 평가합니다. 기준연도 배출량 입력 후 자동 산출됩니다.",
    blocks: [
      {
        title: "기준배출량",
        readOnly: true,
        columns: ["구분", "2019년", "2020년", "2021년", "3개년 평균 (자동)"],
        rows: [
          {
            label: "온실가스 배출량",
            sub: "(tCO₂eq)",
            cells: ["480", "475", "470", "475"],
            unit: "tCO₂eq",
          },
        ],
      },
      {
        title: "탄소감축량",
        readOnly: true,
        columns: [
          "구분",
          "1차년도 (2021)",
          "2차년도 (2022)",
          "3차년도 (2023)",
          "이행평균 (자동)",
        ],
        rows: [
          {
            label: "감축량",
            subMobile: "(tCO₂eq)",
            cells: ["5", "7", "10", "7"],
            unit: "tCO₂eq",
          },
          {
            label: "연도별 감축율",
            sub: "(감축량 ÷ 기준평균)",
            cells: ["1.1", "1.5", "2.1", "1.5"],
            unit: "%",
          },
        ],
      },
    ],
    summary: {
      title: "목표달성 평가",
      columns: [
        "기준연도 평균 배출량",
        "이행기간 평균 감축량",
        "평가기준 감축율 (자동계산)",
        "목표감축률",
        "평가 결과",
      ],
      values: ["475 tCO₂eq", "7 tCO₂eq", "1.5%", "6%", "미달성"],
    },
  },
]

/**
 * 화면 케이스. 참고 화면의 노출 규칙을 따른다.
 * 앞 기준이 미달일 때만 다음 기준이 이어서 열린다.
 *
 *   일반기업     절대배출량 → (미달) 원단위 · 감축량
 *   목표관리업체  목표관리 → (미달) 절대배출량 → (미달) 원단위 · 감축량
 *
 * 실제 서비스는 한 화면에서 입력값 판정에 따라 카드가 열린다.
 * 라우트를 다섯으로 나눈 것은 케이스를 눈으로 보라고 한 것뿐이다.
 */
export type TargetCase =
  | "general-met"
  | "general-unmet"
  | "target-met"
  | "target-abs-met"
  | "target-unmet"

const CASES: Record<TargetCase, Criterion[]> = {
  "general-met": GENERAL_MET,
  "general-unmet": GENERAL_UNMET,
  "target-met": TARGET_MET,
  "target-abs-met": TARGET_ABS_MET,
  "target-unmet": TARGET_UNMET,
}

/* [퍼블리싱 노출용] 끝 — 아래부터는 화면 코드다 */

/** 카드 껍데기. 어느 카드나 같은 테두리·반경·여백을 쓴다 */
const Card = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => (
  <section
    className={cn(
      "border-line-card flex flex-col rounded-2xl border px-5 py-6 md:p-8 lg:p-10",
      className,
    )}
  >
    {children}
  </section>
)

/** 카드 머리 — 제목과 설명. 아래에 구분선이 붙는다 */
const CardHead = ({ title, desc }: { title: string; desc: string }) => (
  <div className="border-line-card flex flex-col gap-1 border-b pb-6 md:gap-3">
    <h3 className="text-ink-strong text-xl font-bold break-keep md:text-2xl">
      {title}
    </h3>
    <p className="text-ink-body text-base font-normal break-keep">{desc}</p>
  </div>
)

/** 번호가 붙는 블록 머리 */
const BlockHead = ({ no, title }: { no: number; title: string }) => (
  <div className="flex items-center gap-3">
    <span
      aria-hidden="true"
      className="bg-surface-disabled text-ink-strong flex size-6 shrink-0 items-center justify-center rounded-full text-sm font-bold md:size-8 md:text-base"
    >
      {no}
    </span>
    <h4 className="text-ink-strong text-base font-bold break-keep md:text-xl">
      {withNote(title, "text-ink-hint text-sm font-normal")}
    </h4>
  </div>
)

/**
 * 값과 단위가 한 칸에 들어가는 입력.
 * 1차 신청서(application-form.tsx)의 UnitField 와 같은 규격을 쓴다.
 */
// 768~1023 은 칸이 좁아 적은 값이 잘린다. 그 구간만 여백을 줄여 값 자리를 넓힌다.
const FIELD_BOX =
  "border-line-field bg-surface-field hover:ring-ash-600 has-[:focus-visible]:ring-ash-600 focus-visible:ring-ash-600 flex h-12 items-center rounded-md border px-4 outline-hidden hover:ring-2 has-[:focus-visible]:ring-2 focus-visible:ring-2 md:max-lg:px-3"

const BARE =
  "text-ink-strong placeholder:text-ink-bullet min-w-0 flex-1 bg-transparent text-sm font-medium outline-hidden"

const UnitField = ({
  label,
  value,
  unit,
  readOnly,
  name,
  invalid,
  className,
}: {
  label: string
  value: string
  /** 없으면 단위 없이 값만 들어간다 */
  unit?: string
  readOnly?: boolean
  /**
   * 제출에 실리는 칸 이름.
   * readonly 는 disabled 와 달리 값이 함께 제출되므로 자동 산출 칸에도 붙인다.
   */
  name?: string
  invalid?: boolean
  className?: string
}) => (
  <div
    className={cn(
      FIELD_BOX,
      readOnly && "bg-surface-disabled",
      // 오류 테두리는 다른 화면과 같은 규격이다
      invalid &&
        "ring-destructive has-[:focus-visible]:ring-destructive ring-2",
      className,
    )}
  >
    <input
      aria-label={label}
      name={name}
      aria-invalid={invalid || undefined}
      // 숫자 칸이라 브라우저가 채울 값이 없다
      autoComplete="off"
      placeholder="0"
      // 값을 상태로 들지 않는다. 자동 산출 칸(3개년 평균·감축률·요약 표)이
      // 입력에 반응해야 하면 defaultValue 를 value + onChange 로 바꿔야 한다.
      {...(readOnly ? { readOnly: true, value } : { defaultValue: value })}
      className={cn(BARE, readOnly && "text-ash-500")}
    />
    {unit ? (
      // 읽기 전용 칸은 값과 단위를 같은 회색으로 흐린다
      <span
        className={cn(
          // 좁은 태블릿에서는 단위도 한 단계 줄여 값이 잘리지 않게 한다
          "shrink-0 pl-2 text-sm font-medium md:max-lg:pl-1.5 md:max-lg:text-xs",
          readOnly ? "text-ash-500" : "text-ink-body",
        )}
      >
        {unit}
      </span>
    ) : null}
  </div>
)

/**
 * 입력 표. 해상도마다 배치가 달라지지만 **입력 칸은 칸당 하나**다.
 * 예전에는 PC·태블릿·모바일용으로 세 벌을 그려 두고 CSS 로 감췄는데,
 * 감춘 칸도 DOM 에 남아 같은 name 으로 함께 제출되고 값도 서로 갈렸다.
 * 지금은 마크업 하나에 반응형 클래스만 얹는다. 연도 이름표 같은 글자만 중복된다.
 *
 * 배치
 *   PC   [구분] 열이 있는 표 한 장. 테두리가 줄 전체를 감싼다.
 *   768  줄마다 표가 따로 선다. 테두리가 줄마다 붙고 [구분] 열이 없다.
 *   360  표가 접혀 연도마다 이름표 + 입력이 쌓인다. 테두리·머리 줄이 없다.
 */
const DataTable = ({
  columns,
  rows,
  readOnly,
  prefix,
}: {
  columns: string[]
  rows: TableRow[]
  readOnly?: boolean
  /** 칸 이름 앞머리. 카드·블록마다 달라 검사 대상이 겹치지 않는다 */
  prefix: string
}) => (
  <div className="flex flex-col">
    {/* PC 머리 줄 — 블록에 한 번, 상자 밖에 선다 */}
    <div className="bg-surface-disabled flex h-9.5 items-center rounded-t-lg max-lg:hidden">
      <span className="text-ink-muted w-48 shrink-0 text-center text-xs font-bold">
        {columns[0]}
      </span>
      <div className="flex flex-1 gap-2.5 pr-8">
        {columns.slice(1).map((column) => (
          <span
            key={column}
            className="text-ink-muted min-w-0 flex-1 text-center text-xs font-bold"
          >
            {withNote(column, "text-xs font-normal")}
          </span>
        ))}
      </div>
    </div>

    <div
      className={cn(
        "flex flex-col gap-3",
        // PC 만 줄 전체를 한 상자로 묶는다. 768 이하는 줄마다 따로 선다.
        "lg:border-line-card lg:gap-4 lg:rounded-b-lg lg:border lg:p-8",
        "dark:lg:border-line-divider/40",
      )}
    >
      {rows.map((row) => (
        <div
          key={row.label}
          className="flex flex-col gap-2.5 md:max-lg:gap-3 lg:flex-row lg:items-center lg:gap-0"
        >
          <RowLabel row={row} />

          <div className="min-w-0 lg:flex-1">
            {/* 768 머리 줄 — 줄마다 하나. [구분] 열이 없다 */}
            <div className="bg-surface-disabled flex h-9.5 items-center gap-2.5 rounded-t-lg px-6 max-md:hidden lg:hidden">
              {columns.slice(1).map((column) => (
                <span
                  key={column}
                  className="text-ink-muted min-w-0 flex-1 text-center text-xs font-bold"
                >
                  {withNote(column, "text-xs font-normal")}
                </span>
              ))}
            </div>

            <div
              className={cn(
                "flex min-w-0 gap-2.5 max-md:flex-col max-md:gap-2",
                // 테두리 상자는 768 에서만 줄마다 선다
                "md:max-lg:border-line-card md:max-lg:rounded-b-lg md:max-lg:border md:max-lg:px-6 md:max-lg:py-4",
                "dark:md:max-lg:border-line-divider/40",
              )}
            >
              {row.cells.map((cell, index) => (
                <UnitFieldCell
                  key={`${prefix}-${row.label}-${index}`}
                  prefix={prefix}
                  row={row}
                  column={columns[index + 1]}
                  index={index}
                  cell={cell}
                  locked={
                    !!readOnly ||
                    !!row.readOnly ||
                    isAutoColumn(columns[index + 1])
                  }
                />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
)

/**
 * 줄 이름과 단위 괄호.
 * 괄호 자리가 해상도마다 다르다 — PC 는 아랫줄, 768 은 이름 뒤, 360 은 오른쪽 끝.
 * subMobile 은 360 에만 붙는 단위라 768 부터 감춘다.
 */
const RowLabel = ({ row }: { row: TableRow }) => (
  <p
    className={cn(
      "text-ink-strong text-base font-bold break-keep",
      "max-md:flex max-md:items-baseline max-md:justify-between max-md:gap-2",
      "lg:w-40.5 lg:shrink-0 lg:pr-3",
    )}
  >
    {row.label}
    {row.sub ? (
      <span
        className={cn(
          "text-ink-hint font-normal",
          "max-md:shrink-0 max-md:text-xs",
          "md:max-lg:ml-1 md:max-lg:text-sm",
          "lg:block lg:text-xs",
        )}
      >
        {row.sub}
      </span>
    ) : null}
    {!row.sub && row.subMobile ? (
      <span className="text-ink-hint shrink-0 text-xs font-normal md:hidden">
        {row.subMobile}
      </span>
    ) : null}
  </p>
)

/** 표의 한 칸. 360 에서만 연도 이름표가 입력 위에 붙는다 */
const UnitFieldCell = ({
  prefix,
  row,
  column,
  index,
  cell,
  locked,
}: {
  prefix: string
  row: TableRow
  column: string
  index: number
  cell: string
  locked: boolean
}) => {
  const errors = useContext(FieldErrorContext)
  const name = `${prefix}-${row.label}-${index}`

  return (
    <div className="flex min-w-0 flex-col gap-1 md:flex-1 md:gap-1.5">
      <span className="text-ink-muted text-xs font-bold md:hidden">
        {withNote(column, "font-normal")}
      </span>
      <div className="flex flex-col gap-1.5">
        <UnitField
          label={`${row.label} ${column}`}
          value={cell}
          className="h-13"
          unit={row.unit}
          readOnly={locked}
          name={name}
          invalid={!!errors[name]}
        />
        <FieldError message={errors[name]} />
      </div>
    </div>
  )
}

/**
 * 블록 마지막 요약 표.
 * 자가진단 평가지표의 등급 기준표(evaluation-index.tsx 의 GradeScaleTable)와 같은 규격이다.
 */
const CELL_ON = "bg-surface-flow text-brand-primary"
/**
 * 미달성. 달성(surface-flow · brand-primary)과 짝을 이루는 색이다.
 */
const CELL_OFF = "bg-surface-fail text-ink-fail"

const SummaryTable = ({ columns, values }: Summary) => {
  const last = columns.length - 1
  // 마지막 칸이 평가 결과다. 미달성이면 표 색이 통째로 바뀐다.
  const resultCell = values[last] === "미달성" ? CELL_OFF : CELL_ON

  return (
    <>
      {/* 360 은 항목을 세로로 세운 2열 표다 */}
      <div className="border-line-field border-t-ink-strong border-t border-b md:hidden">
        <table className="w-full table-fixed border-collapse">
          <tbody>
            {columns.map((column, index) => (
              <tr key={column}>
                <th
                  scope="row"
                  className={cn(
                    "border-line-field w-3/5 border-r px-3 py-2.5 text-left text-sm font-bold break-keep",
                    index < last && "border-b",
                    index === last
                      ? resultCell
                      : "bg-surface-disabled text-ink-body",
                  )}
                >
                  {withNote(column, "text-xs font-normal")}
                </th>
                <td
                  className={cn(
                    "px-3 py-2.5 text-left text-sm font-normal break-keep",
                    index < last && "border-line-field border-b",
                    index === last
                      ? resultCell
                      : "bg-surface-field text-ink-body",
                  )}
                >
                  {withUnit(values[index])}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 768 부터 가로 표 */}
      <div className="border-line-field border-t-ink-strong overflow-x-auto border-t border-b max-md:hidden">
        <table className="w-full min-w-132 table-fixed border-collapse">
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th
                  key={column}
                  scope="col"
                  className={cn(
                    "border-line-field border-b px-3 py-3 text-center text-sm font-bold break-keep lg:text-base",
                    index < last && "border-r",
                    index === last
                      ? resultCell
                      : "bg-surface-disabled text-ink-body",
                  )}
                >
                  {withNote(column, "text-xs font-normal")}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {values.map((value, index) => (
                <td
                  key={columns[index]}
                  className={cn(
                    "px-3 py-4 text-center text-sm font-medium break-keep lg:text-base",
                    index < last && "border-line-field border-r",
                    index === last
                      ? resultCell
                      : "bg-surface-field text-ink-body",
                  )}
                >
                  {withUnit(value)}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </>
  )
}

const TargetAchievement = ({ name = "general-met" }: { name?: TargetCase }) => {
  const criteria = CASES[name]
  // 감축목표율은 아직 고르는 것까지만 한다. 요약 표의 목표감축률·달성 판정과는
  // 이어져 있지 않아, 값을 바꿔도 아래 표는 그대로다.
  const [targetRate, setTargetRate] = useState(TARGET_RATES[1])
  const formRef = useRef<HTMLFormElement>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  // [다음으로] 를 누른 뒤부터 오류를 보여 준다. 다른 신청 화면과 같은 방식이다.
  const [hasTried, setHasTried] = useState(false)

  const collectErrors = () => {
    const form = formRef.current
    if (!form) return {}
    const next: Record<string, string> = {}
    form
      .querySelectorAll<HTMLInputElement>("input[name]")
      .forEach((control) => {
        // 자동 산출·전달값 칸은 사용자가 못 고치니 검사 대상이 아니다
        if (control.readOnly) return
        const message = fieldErrorOf(control.value)
        if (message) next[control.name] = message
      })
    return next
  }

  const handleNext = () => {
    setHasTried(true)
    const next = collectErrors()
    setErrors(next)

    // 오류가 난 첫 칸으로 옮겨 준다
    const first = Object.keys(next)[0]
    if (!first) return
    const control = formRef.current?.querySelector<HTMLElement>(
      `[name="${first}"]`,
    )
    control?.focus()
    control?.scrollIntoView({ block: "center" })
  }

  // 한 번 검사한 뒤에는 입력할 때마다 다시 본다
  const revalidate = () => {
    if (hasTried) setErrors(collectErrors())
  }

  return (
    <div className="flex w-full max-w-316 flex-col max-md:gap-0 max-md:pb-20 md:gap-10 md:px-7 md:pt-12 md:pb-28 lg:px-8 lg:pt-14 lg:pb-42">
      {/* 360 상단 이름은 카드 이름이 아니라 단계 이름이다 */}
      <StepMobileNav title="목표달성 평가" step={3} total={STEPS.length} />

      <div className="flex flex-col gap-8 max-md:hidden lg:flex-row lg:items-start lg:justify-between lg:gap-8">
        <h2 className="text-ink-strong text-lg font-bold whitespace-nowrap md:text-3xl lg:text-4xl">
          목표달성 평가
        </h2>
        {/* Stepper 내부 ol 의 줄바꿈·폭을 밖에서 제어한다. 지우면 스테퍼가 접힌다. */}
        <div className="[&_ol]:flex-nowrap sm:w-full sm:[&_ol]:w-full sm:[&_ol>li]:flex-1 sm:[&_ol>li>div:nth-child(1)]:flex-1 sm:[&_ol>li>div:nth-child(3)]:flex-1 lg:w-152">
          <Stepper items={STEPS} activeIndex={2} size={13} />
        </div>
      </div>

      <BaseInfo items={NOTICES} />

      {/* 칸마다 붙는 오류 문구를 아래로 내려 보낸다 */}
      <FieldErrorContext.Provider value={errors}>
        <form
          ref={formRef}
          noValidate
          onSubmit={(event) => event.preventDefault()}
          onChange={revalidate}
          className="flex flex-col gap-6 max-md:mt-12 max-md:px-5 lg:gap-10"
        >
          {/* 평가 기본 설정 — 4개 기준이 공통으로 쓰는 값 */}
          <Card className="gap-6 md:gap-7.5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex min-w-0 flex-col gap-3">
                <h3 className="text-ink-strong text-xl font-bold break-keep md:text-2xl">
                  평가 기본 설정
                </h3>
                <p className="text-ink-body text-base font-normal break-keep">
                  감축목표율과 평가 기간을 확인합니다. 감축목표율은 4개 평가
                  기준에 공통 적용됩니다.
                </p>
              </div>
            </div>

            <dl className="grid grid-cols-1 gap-x-10 gap-y-6 md:grid-cols-2">
              {/* 감축목표율만 고르는 값이라 셀렉트다. 나머지는 넘어온 값이다 */}
              <div className="flex flex-col gap-2.5">
                <dt className="text-ink-strong text-base font-bold">
                  감축목표율
                </dt>
                <dd>
                  {/* 폼 안에서는 Radix 가 숨은 select 를 만든다. 이름이 있어야 값이 제출된다 */}
                  <Select
                    name="target-rate"
                    value={targetRate}
                    onValueChange={setTargetRate}
                  >
                    <SelectTrigger
                      aria-label="감축목표율"
                      // 원본이 높이를 data-[size=default] 변형으로 잡고 있어 같은 변형으로 덮는다.
                      // 옆 입력 칸(h-12 md:h-13)과 높이를 맞춘다.
                      className="border-line-field bg-surface-field text-ink-strong focus-visible:ring-ash-600 w-full rounded-md px-4 text-sm font-medium focus-visible:ring-2 data-[size=default]:h-12 md:data-[size=default]:h-13"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TARGET_RATES.map((rate) => (
                        <SelectItem key={rate} value={rate}>
                          {rate}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </dd>
              </div>
              {[
                {
                  name: "company-name",
                  label: "기업명",
                  value: "(주)그린에너지",
                },
                {
                  name: "base-period",
                  label: "기준연도 기간",
                  value: "2019 ~ 2021",
                },
                {
                  name: "run-period",
                  label: "이행연도 기간",
                  value: "2021 ~ 2023",
                },
              ].map((field) => (
                <div key={field.label} className="flex flex-col gap-2.5">
                  <dt className="text-ink-strong text-base font-bold">
                    {field.label}
                  </dt>
                  <dd>
                    {/* 넘어온 값이라 읽기 전용이다. 고르는 값은 위 감축목표율 하나뿐이다 */}
                    <UnitField
                      name={field.name}
                      label={field.label}
                      value={field.value}
                      readOnly
                      className="w-full md:h-13"
                    />
                  </dd>
                </div>
              ))}
            </dl>
          </Card>

          {/* 평가 기준 4장 */}
          {criteria.map((criterion) => (
            <Card key={criterion.title} className="gap-6 lg:gap-4">
              <CardHead title={criterion.title} desc={criterion.desc} />

              {criterion.blocks.map((block, index) => (
                <div
                  key={block.title}
                  className="flex flex-col gap-4 lg:gap-7.5 lg:pt-6"
                >
                  <BlockHead no={index + 1} title={block.title} />
                  <DataTable
                    columns={block.columns}
                    rows={block.rows}
                    readOnly={block.readOnly}
                    prefix={`${criterion.title}-${index}`}
                  />
                </div>
              ))}

              <div className="flex flex-col gap-4 lg:gap-7.5 lg:pt-6">
                <BlockHead
                  no={criterion.blocks.length + 1}
                  title={criterion.summary.title}
                />
                <SummaryTable {...criterion.summary} />
              </div>
            </Card>
          ))}

          <div className="flex items-center justify-between gap-2 md:gap-3">
            <Button
              type="button"
              variant="outline"
              className="h-11 flex-1 gap-1 rounded-lg text-sm font-bold md:h-13 md:w-42 md:flex-none [&_svg]:size-5"
            >
              <ArrowLeft aria-hidden="true" />
              이전으로
            </Button>
            <Button
              type="button"
              onClick={handleNext}
              className="h-11 flex-1 gap-1 rounded-lg text-sm font-bold md:h-13 md:w-42 md:flex-none [&_svg]:size-5"
            >
              다음으로
              <ArrowRight aria-hidden="true" />
            </Button>
          </div>
        </form>
      </FieldErrorContext.Provider>
    </div>
  )
}

export default TargetAchievement
