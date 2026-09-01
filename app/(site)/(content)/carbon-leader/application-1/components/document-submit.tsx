"use client"

import { useId, useRef, useState } from "react"

import { ArrowLeft, ArrowRight, Files, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Stepper } from "@/components/ui/stepper"
import StepMobileNav from "@/app/(site)/(content)/carbon-leader/self-check/components/step-mobile-nav"
import {
  DOCUMENT_GROUPS,
  SUBMIT_NOTICE_SPECS,
  type SubmitDocument,
  type SubmitGroup,
  type SubmittedFile,
} from "@/constants/carbon-leader-document-submit"
import { APPLICATION_STEPS } from "@/constants/carbon-leader-application-form"
import { cn } from "@/lib/utils"

// 선도기업 신청 1차 STEP 2 "서류 제출".
// 서류 묶음 세 개(기업정보 · 인벤토리 증빙서류 · 감축계획 증빙서류) 아래에
// 항목 카드가 놓이고, 첨부된 항목만 시안의 청록 강조를 쓴다.

/** 화면 상단 "서류 제출 안내" 박스. 문구가 이 화면 전용이라 여기에 둔다. */
const SubmitNotice = () => (
  <section className="bg-surface-notice flex flex-col gap-3 px-6 pt-6 pb-6 max-md:rounded-none md:rounded-2xl lg:px-10 lg:pb-8">
    <h3 className="text-ink-strong text-lg font-bold lg:text-xl">
      서류 제출 안내
    </h3>
    <ul className="flex flex-col gap-2 md:gap-3">
      <li className="text-ink-body flex gap-1 text-base break-keep">
        <Dot />
        <span>
          모든 서류는 필수가 아닌{" "}
          <strong className="font-bold">선택 제출</strong>
          입니다. 해당하는 서류를 자유롭게 선택하여 첨부해 주세요.
        </span>
      </li>
      {/* 시안은 조건 세 가지가 PC 에서 한 줄에 나란히 붙는다 */}
      <li className="text-ink-body flex flex-wrap gap-x-4 gap-y-2 text-base break-keep">
        {SUBMIT_NOTICE_SPECS.map((spec) => (
          <span key={spec.label} className="flex gap-1">
            <Dot />
            <span>
              {spec.value ? (
                <>
                  {spec.label} :{" "}
                  <strong className="font-bold">{spec.value}</strong>
                </>
              ) : (
                spec.label
              )}
            </span>
          </span>
        ))}
      </li>
    </ul>
  </section>
)

/** 안내 문구 앞 점 */
const Dot = () => (
  <span
    aria-hidden="true"
    className="flex h-6.5 w-2.5 shrink-0 items-center justify-center"
  >
    <span className="bg-ink-bullet size-1 rounded-full" />
  </span>
)

/** 화면에 적는 파일 크기. 시안 표기(1.2 MB)와 같은 모양으로 맞춘다. */
const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`
  const kb = bytes / 1024
  if (kb < 1024) return `${Math.round(kb)} KB`
  return `${(kb / 1024).toFixed(1)} MB`
}

/** 안내 박스에 적어 둔 허용 형식. 파일 선택창이 이 목록으로 걸러 준다. */
const ACCEPT = ".pdf,.jpg,.jpeg,.png"

/**
 * 안내 박스의 "파일 당 최대 용량 : 10MB".
 * 선택창은 형식만 거르고 용량은 못 막아서 고른 뒤에 여기서 본다.
 * 문구를 고치면 이 값도 같이 고친다.
 */
const MAX_FILE_BYTES = 10 * 1024 * 1024

/** 서류 한 건. 첨부 파일이 있으면 청록 강조 카드가 된다. */
const DocumentItem = ({
  document,
  onErrorChange,
}: {
  document: SubmitDocument
  /** 용량 초과 안내가 뜨고 지는 것을 화면 전체에 알린다([다음으로] 잠금용) */
  onErrorChange: (key: string, hasError: boolean) => void
}) => {
  // 시안에 그려진 첨부 예시를 첫 상태로 두고, 이후는 사용자가 고른 파일이 쌓인다
  const [files, setFiles] = useState<SubmittedFile[]>(document.files ?? [])
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const errorId = useId()
  const attached = files.length > 0

  const handlePick = (event: React.ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(event.target.files ?? [])
    // 같은 파일을 다시 고를 수 있게 값을 비운다
    event.target.value = ""
    if (picked.length === 0) return

    // 용량을 넘긴 파일이 하나라도 있으면 그 선택은 통째로 버린다.
    // 일부만 올라가면 무엇이 빠졌는지 알기 어렵다.
    const oversized = picked.filter((file) => file.size > MAX_FILE_BYTES)
    if (oversized.length > 0) {
      const first = oversized[0]
      setError(
        oversized.length === 1
          ? `파일 하나당 10MB 까지 첨부할 수 있습니다. (${first.name} · ${formatFileSize(first.size)})`
          : `파일 하나당 10MB 까지 첨부할 수 있습니다. (${first.name} 외 ${oversized.length - 1}건)`,
      )
      onErrorChange(document.title, true)
      return
    }

    setError(null)
    onErrorChange(document.title, false)
    setFiles((previous) => [
      ...previous,
      ...picked.map((file) => ({
        name: file.name,
        size: formatFileSize(file.size),
      })),
    ])
  }

  const handleRemove = (index: number) => {
    setFiles((previous) => previous.filter((_, at) => at !== index))
  }

  return (
    <li
      className={cn(
        "flex flex-col rounded-xl p-5 md:rounded-2xl md:p-6",
        attached
          ? "border-brand-done-teal bg-brand-done-teal/6 border"
          : "bg-surface-disabled",
        // 용량을 넘긴 파일을 고른 칸은 테두리로 표시한다
        error && "border-ink-error border",
      )}
    >
      {/* 360 은 제목·버튼이 한 줄, 설명이 그 아래 한 줄 전체를 쓴다.
          max-md:contents 로 이름 묶음을 풀어 세 조각이 같은 줄에서 접히게 한다 */}
      <div className="flex flex-wrap items-center gap-3 md:flex-nowrap">
        <div className="flex min-w-0 flex-col gap-1 max-md:contents md:flex-1 lg:gap-1.5">
          <span className="text-ink-strong text-sm font-bold break-keep max-md:min-w-0 max-md:flex-1 md:text-base">
            {document.title}
          </span>
          {document.description ? (
            <span className="text-ink-hint text-xs font-normal break-keep max-md:order-last max-md:basis-full md:text-sm md:font-medium">
              {document.description}
            </span>
          ) : null}
        </div>

        <div className="flex shrink-0 items-center gap-5 max-md:order-1">
          {/* 첨부 건수 배지는 시안에서 768 부터 보인다 */}
          {attached ? (
            <span className="bg-brand-done-teal text-surface-field hidden h-8 items-center rounded-full px-3.5 text-xs font-bold md:inline-flex">
              {files.length}건 첨부
            </span>
          ) : null}
          <input
            ref={inputRef}
            id="document-attachment"
            name="document-attachment"
            type="file"
            multiple
            accept={ACCEPT}
            className="hidden"
            aria-hidden="true"
            tabIndex={-1}
            onChange={handlePick}
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
            className={cn(
              "bg-surface-field text-ink-body focus-visible:ring-ash-600 flex h-10 cursor-pointer items-center justify-center rounded-md border px-3 text-xs font-bold whitespace-nowrap transition-colors outline-hidden focus-visible:ring-2 md:px-5 lg:px-6",
              attached
                ? "border-brand-done-teal hover:bg-brand-done-teal/10"
                : "border-ink-bullet hover:bg-surface-outline-hover",
            )}
          >
            파일첨부
          </button>
        </div>
      </div>

      {/* 다른 화면 입력 오류와 같은 규격(ink-error · 12/14)을 쓴다 */}
      {error ? (
        <p
          id={errorId}
          role="alert"
          className="text-ink-error mt-3 text-xs font-medium break-keep lg:text-sm"
        >
          {error}
        </p>
      ) : null}

      {attached ? (
        <ul className="mt-4 flex flex-col gap-4">
          {files.map((file, index) => (
            <li
              key={`${file.name}-${index}`}
              className="bg-brand-done-teal/10 flex h-11 items-center gap-1.5 rounded-lg px-2.5 md:h-13 md:gap-4 md:px-4"
            >
              <div className="flex min-w-0 flex-1 items-center gap-2">
                {/* 시안 아이콘은 뒷장이 비치는 문서 모양이라 Files 가 가장 가깝다 */}
                <Files
                  aria-hidden="true"
                  className="text-ink-muted size-6 shrink-0"
                />
                <span className="text-ink-muted min-w-0 flex-1 truncate text-xs font-normal md:text-sm md:font-medium">
                  {file.name}
                </span>
              </div>
              <span className="text-ink-bullet shrink-0 text-xs">
                {file.size}
              </span>
              <button
                type="button"
                aria-label={`${file.name} 첨부 취소`}
                onClick={() => handleRemove(index)}
                className="text-ink-muted hover:bg-surface-disabled focus-visible:ring-ash-600 flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors outline-hidden focus-visible:ring-2"
              >
                <X aria-hidden="true" className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </li>
  )
}

/** 번호가 붙는 서류 묶음 카드 */
const GroupCard = ({
  group,
  index,
  id,
  onErrorChange,
}: {
  group: SubmitGroup
  index: number
  /** 최종 확인 화면의 [수정] 이 건너뛰는 앵커 */
  id?: string
  onErrorChange: (key: string, hasError: boolean) => void
}) => (
  <section
    id={id}
    className="border-line-card flex scroll-mt-28 flex-col rounded-xl border px-5 py-6 md:rounded-2xl md:p-7.5"
  >
    <header className="border-line-card flex items-center gap-3 border-b pb-4 md:pb-6">
      <span className="bg-surface-disabled text-ink-strong flex size-8 shrink-0 items-center justify-center rounded-full text-base font-bold">
        {index + 1}
      </span>
      <h3 className="text-ink-strong text-xl font-bold break-keep md:text-2xl">
        {group.title}
      </h3>
    </header>

    <ul className="mt-4 flex flex-col gap-4 md:mt-6 lg:mt-4">
      {group.documents.map((document) => (
        <DocumentItem
          key={document.title}
          document={document}
          onErrorChange={onErrorChange}
        />
      ))}
    </ul>
  </section>
)

const DocumentSubmit = ({
  /** 신청 차수. 스테퍼 첫 단계 이름만 이 값을 탄다(1차신청 / 2차신청 …) */
  round = 1,
}: {
  round?: number
}) => {
  const steps = APPLICATION_STEPS.map((step, index) =>
    index === 0 ? `${round}차신청` : step,
  )

  // 용량 안내가 떠 있는 서류 이름들. 하나라도 있으면 다음 단계로 못 넘어간다
  const [errorKeys, setErrorKeys] = useState<string[]>([])
  const handleErrorChange = (key: string, hasError: boolean) => {
    setErrorKeys((previous) =>
      hasError
        ? previous.includes(key)
          ? previous
          : [...previous, key]
        : previous.filter((name) => name !== key),
    )
  }
  const blocked = errorKeys.length > 0

  return (
    <div className="flex w-full max-w-316 flex-col md:gap-8 md:px-7 md:pt-12 md:pb-28 lg:gap-10 lg:px-8 lg:pt-14 lg:pb-42">
      {/* 360 시안의 상단 이름은 카드 이름이 아니라 단계 이름이다 */}
      <StepMobileNav title="서류 제출" step={2} total={steps.length} />

      <div className="flex flex-col gap-8 max-md:hidden lg:flex-row lg:items-start lg:justify-between lg:gap-8">
        <h2 className="text-ink-strong text-lg font-bold whitespace-nowrap md:text-3xl lg:text-4xl">
          서류 제출
        </h2>
        {/* Stepper 내부 ol 의 줄바꿈·폭을 밖에서 제어한다. 지우면 스테퍼가 접힌다. */}
        <div className="[&_ol]:flex-nowrap sm:w-full sm:[&_ol]:w-full sm:[&_ol>li]:flex-1 sm:[&_ol>li>div:nth-child(1)]:flex-1 sm:[&_ol>li>div:nth-child(3)]:flex-1 lg:w-104">
          <Stepper items={steps} activeIndex={1} size={13} />
        </div>
      </div>

      <SubmitNotice />

      <div className="flex flex-col gap-6 max-md:px-5 max-md:pt-12 max-md:pb-24 lg:gap-10">
        {DOCUMENT_GROUPS.map((group, index) => (
          <GroupCard
            key={group.title}
            id={index === 0 ? "documents" : undefined}
            group={group}
            index={index}
            onErrorChange={handleErrorChange}
          />
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
            disabled={blocked}
            // 비활성 표시는 자가진단 [다음] 버튼과 같은 규격(회색 면 + 회색 글)
            className="disabled:bg-fill-disabled disabled:text-ink-on-disabled h-11 flex-1 gap-1 rounded-lg text-sm font-bold disabled:opacity-100 md:h-13 md:w-42 md:flex-none [&_svg]:size-5"
          >
            다음으로
            <ArrowRight aria-hidden="true" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default DocumentSubmit
