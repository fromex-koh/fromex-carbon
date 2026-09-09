"use client"

import { Button } from "@/components/ui/button"
import {
  SELF_CHECK_REPORT_SAMPLE,
  type ReportValue,
  type SelfCheckReportData,
} from "@/constants/carbon-leader-self-check-report"
import { cn } from "@/lib/utils"
import { LoaderCircle, Printer } from "lucide-react"
import Image from "next/image"
import KiboLogo from "@/public/logo-kibo.svg"
import { useRef, useState } from "react"
import { createPortal, flushSync } from "react-dom"
import { toast } from "sonner"

/*
 * 자가진단 결과보고서 2페이지 공통 템플릿.
 *
 * [프론트 개발 안내]
 * 1. 서버 값을 SelfCheckReportData 모양으로 만든 뒤 data prop 하나로 넘긴다.
 * 2. 감축사업 표는 reductionEffects.projects를 map하므로 배열 길이에 맞춰 행이 증감한다.
 * 3. 실제 서비스 화면에는 SelfCheckReportDownloadButton만 놓아도 된다. 클릭하면
 *    데이터 양에 맞는 A4 페이지를 생성해 인쇄창 없이 PDF 파일로 바로 내려받는다.
 * 4. 이 보고서는 Figma와 동일하게 프로젝트 내장 Pretendard를 사용한다.
 */

const formatValue = (value: ReportValue | undefined) => {
  if (value === undefined || value === null || value === "") return "-"
  return typeof value === "number" ? value.toLocaleString("ko-KR") : value
}

const numericValue = (value: ReportValue | undefined) => {
  if (typeof value === "number") return value
  const parsed = Number(String(value ?? "").replaceAll(",", ""))
  return Number.isFinite(parsed) ? parsed : 0
}

const ReportHeader = ({ data }: { data: SelfCheckReportData }) => (
  <>
    <div className="flex items-center justify-between border-b-[0.5pt] border-[#d2d2d2] pb-[16pt]">
      {/* 흰 종이 위 보고서라 사이트 다크 모드와 무관하게 컬러 원본을 고정한다. */}
      <Image
        priority
        src={KiboLogo}
        alt="KIBO 기술보증기금"
        className="h-[20pt] w-[150pt]"
      />
      <div className="flex items-center gap-[12pt] text-[10pt] leading-[14pt] font-bold whitespace-nowrap">
        <span className="text-[#111]">
          {data.company.headerName ?? data.company.name}
        </span>
        <span className="flex items-center gap-[4pt]">
          <span className="text-[#888]">생성일자</span>
          <span className="text-[#111]">{data.generatedOn}</span>
        </span>
      </div>
    </div>
    <h1 className="mt-[16pt] text-[16pt] leading-[24pt] font-bold text-[#111]">
      탄소중립 선도기업 자가진단 결과보고서
    </h1>
  </>
)

const ReportCard = ({
  title,
  unit,
  children,
  className,
}: {
  title: string
  unit?: string
  children: React.ReactNode
  className?: string
}) => (
  <section
    className={cn(
      "rounded-[8pt] border-[0.5pt] border-[#eee] px-[20pt] pt-[16pt] pb-[24pt]",
      className,
    )}
  >
    <div className="mb-[16pt] flex items-center justify-between border-b-[0.5pt] border-[#eee] pb-[8pt]">
      <h2 className="text-[12pt] leading-[16pt] font-bold text-[#111]">
        {title}
      </h2>
      {unit && (
        <span className="text-[10pt] leading-[14pt] text-[#888]">{unit}</span>
      )}
    </div>
    {children}
  </section>
)

const CompanyInfoItem = ({
  label,
  value,
  className,
}: {
  label: string
  value: React.ReactNode
  className?: string
}) => (
  <div
    className={cn(
      "flex min-w-0 flex-col gap-[8pt] text-[10pt] leading-[14pt]",
      className,
    )}
  >
    <dt className="w-[71pt] font-normal text-[#888]">{label}</dt>
    <dd className="min-w-0 break-words font-bold text-[#333]">{value}</dd>
  </div>
)

const PlanInfoItem = ({
  label,
  value,
  valueClassName,
}: {
  label: string
  value: React.ReactNode
  valueClassName?: string
}) => (
  <div className="flex min-w-0 flex-col gap-[8pt] text-[10pt] leading-[14pt]">
    <dt className="w-[71pt] font-normal text-[#888]">{label}</dt>
    <dd
      className={cn(
        "min-w-0 break-words font-bold text-[#333]",
        valueClassName,
      )}
    >
      {value}
    </dd>
  </div>
)

const PageNumber = ({ children }: { children: React.ReactNode }) => (
  <p className="mt-auto text-center text-[10pt] leading-[14pt] font-normal text-[#888]">
    - {children} -
  </p>
)

export const SelfCheckReportPageOne = ({
  data,
  className,
}: {
  data: SelfCheckReportData
  className?: string
}) => (
  <article
    className={cn(
      "self-check-report-sheet flex h-[842pt] w-[598pt] shrink-0 flex-col bg-white p-[20pt] text-[#111]",
      className,
    )}
  >
    <ReportHeader data={data} />

    <div className="mt-[16pt] flex flex-col gap-[24pt]">
      <ReportCard title="기업정보">
        {/* Figma: 정보는 두 칸씩, 라벨 위·값 아래로 배치하고 마지막 소재지는 전폭을 쓴다. */}
        <dl className="grid grid-cols-2 gap-x-[24pt] gap-y-[16pt] border-b-[0.5pt] border-[#eee] pb-[16pt]">
          <CompanyInfoItem label="업체명" value={data.company.name} />
          <CompanyInfoItem label="대표자" value={data.company.ceo} />
          <CompanyInfoItem
            label="사업자등록번호"
            value={data.company.businessNumber}
          />
          <CompanyInfoItem
            label="법인등록번호"
            value={data.company.corporationNumber}
          />
          <CompanyInfoItem label="설립일자" value={data.company.foundedOn} />
          <CompanyInfoItem
            label="업종 (업종코드)"
            value={data.company.industry}
          />
          <CompanyInfoItem
            label="기업소재지"
            value={data.company.address}
            className="col-span-2"
          />
        </dl>

        {/* Figma: 좌측 라벨 81, 열 영역과의 간격 60. 박스 테두리 없이 헤더 밑줄만 사용한다. */}
        <div className="mt-[8pt] flex items-start gap-[60pt] text-[10pt] leading-[14pt]">
          <div className="w-[81pt] shrink-0">
            <p className="flex h-[38pt] items-center justify-center whitespace-nowrap text-[#888]">
              직전 3개년도 매출액
            </p>
            <div className="h-[38pt]" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex h-[38pt] items-center border-b-[0.5pt] border-[#eee] text-[#888]">
              {data.company.sales.map(({ year }) => (
                <span
                  key={year}
                  className="flex min-w-0 flex-1 items-center justify-center"
                >
                  {year}년
                </span>
              ))}
            </div>
            <div className="flex h-[38pt] items-center font-bold text-[#333]">
              {data.company.sales.map(({ year, value }) => (
                <span
                  key={year}
                  className="flex min-w-0 flex-1 items-center justify-center whitespace-nowrap"
                >
                  {formatValue(value)}만원
                </span>
              ))}
            </div>
          </div>
        </div>
      </ReportCard>

      <ReportCard title="온실가스 총배출량" unit="(tCO₂eq)">
        {/* Figma: 외곽선만 있는 표. 첫 열 182, 헤더 28, 각 데이터 행 40. */}
        <div className="overflow-hidden rounded-[4pt] border-[0.5pt] border-[#f1f4f9]">
          <table className="w-full table-fixed border-collapse text-[10pt] leading-[14pt] text-[#333]">
            <colgroup>
              <col className="w-[182pt]" />
              {data.emissions.years.map((year) => (
                <col key={year} />
              ))}
            </colgroup>
            <thead>
              <tr className="h-[28pt] bg-[#f1f4f9] font-bold text-[#666]">
                <th aria-label="구분" />
                {data.emissions.years.map((year) => (
                  <th key={year} className="text-center font-bold">
                    {year}년
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="h-[40pt]">
                <th className="px-[16pt] text-left font-bold">
                  직전 3개년도 배출량
                </th>
                {data.emissions.years.map((year, index) => (
                  <td key={year} className="text-center font-normal">
                    {formatValue(data.emissions.values[index])}
                  </td>
                ))}
              </tr>
              <tr className="h-[40pt]">
                <th className="px-[16pt] text-left font-bold">평균</th>
                <td className="text-center font-normal">
                  {formatValue(data.emissions.average)}
                </td>
                {data.emissions.years.slice(1).map((year) => (
                  <td key={year} aria-hidden="true" />
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </ReportCard>
    </div>

    <PageNumber>1</PageNumber>
  </article>
)

export const SelfCheckReportPageTwo = ({
  data,
  className,
  projects = data.reductionEffects.projects,
  projectStartIndex = 0,
  showReductionEffects = true,
  showTotals = true,
  showSummary = true,
  pageNumber = 2,
}: {
  data: SelfCheckReportData
  className?: string
  projects?: SelfCheckReportData["reductionEffects"]["projects"]
  projectStartIndex?: number
  showReductionEffects?: boolean
  showTotals?: boolean
  showSummary?: boolean
  pageNumber?: number
}) => {
  const totals =
    data.reductionEffects.totals ??
    data.reductionEffects.years.map((_, yearIndex) =>
      data.reductionEffects.projects.reduce(
        (sum, project) => sum + numericValue(project.values[yearIndex]),
        0,
      ),
    )

  return (
    <article
      className={cn(
        "self-check-report-sheet flex h-[842pt] w-[598pt] shrink-0 flex-col bg-white p-[20pt] text-[#111]",
        className,
      )}
    >
      <ReportHeader data={data} />

      <div className="mt-[16pt] flex flex-col gap-[24pt]">
        {showReductionEffects && (
          <ReportCard title="감축사업 기대효과" unit="(tCO₂eq)">
            {/* 동적 행도 Figma의 40 높이를 기본값으로 쓰며 긴 사업명은 행과 함께 늘어난다. */}
            <div className="overflow-hidden rounded-[4pt] border-[0.5pt] border-[#f1f4f9]">
              <table className="w-full table-fixed border-collapse text-[10pt] leading-[14pt] text-[#333]">
                <colgroup>
                  <col className="w-[182pt]" />
                  {data.reductionEffects.years.map((year) => (
                    <col key={year} />
                  ))}
                </colgroup>
                <thead>
                  <tr className="h-[28pt] bg-[#f1f4f9] font-bold text-[#666]">
                    <th className="text-center font-bold">사업내역</th>
                    {data.reductionEffects.years.map((year) => (
                      <th key={year} className="text-center font-bold">
                        {year}년
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {projects.map((project, projectIndex) => (
                    <tr
                      key={`${project.name}-${projectIndex}`}
                      className="h-[40pt]"
                    >
                      <th className="px-[16pt] py-[8pt] text-left align-middle font-bold break-words">
                        {projectStartIndex + projectIndex + 1}. {project.name}
                      </th>
                      {data.reductionEffects.years.map((year, yearIndex) => (
                        <td
                          key={year}
                          className="py-[8pt] text-center font-normal"
                        >
                          {formatValue(project.values[yearIndex])}
                        </td>
                      ))}
                    </tr>
                  ))}
                  {showTotals && (
                    <tr className="h-[40pt]">
                      <th className="px-[16pt] text-left font-bold">합계</th>
                      {data.reductionEffects.years.map((year, index) => (
                        <td key={year} className="text-center font-normal">
                          {formatValue(totals[index])}
                        </td>
                      ))}
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </ReportCard>
        )}

        {showSummary && (
          <>
            <ReportCard title="탄소중립 이행계획" unit="(tCO₂eq)">
              {/* Figma: 한 행에 세 칸, 다음 행에 두 칸. 각 칸은 라벨 위·값 아래 구조다. */}
              <dl className="grid grid-cols-3 gap-x-[24pt] gap-y-[16pt]">
                <PlanInfoItem
                  label="기준연도 배출량"
                  value={formatValue(data.plan.baselineEmission)}
                />
                <PlanInfoItem
                  label="감축률(%)"
                  value={`${formatValue(data.plan.reductionRate)}%`}
                />
                <PlanInfoItem
                  label="목표 감축량"
                  value={formatValue(data.plan.targetReduction)}
                />
                <PlanInfoItem
                  label="예상 감축량"
                  value={formatValue(data.plan.expectedReduction)}
                />
            <PlanInfoItem
              label="계획 적정성"
              value={data.plan.adequacy}
              valueClassName={
                data.plan.adequacy.includes("부적정")
                  ? "text-destructive"
                  : "text-[#51a854]"
              }
            />
              </dl>
            </ReportCard>

            <ReportCard title="탄소중립 경영혁신 자가진단" unit="(tCO₂eq)">
              <dl className="flex h-[36pt] items-center gap-[8pt]">
                <dt className="w-[71pt] shrink-0 text-[10pt] leading-[14pt] font-normal text-[#888]">
                  최종등급
                </dt>
                <dd className="text-[12pt] leading-[18pt] font-bold text-[#333]">
                  {data.grade}
                </dd>
              </dl>
            </ReportCard>
          </>
        )}
      </div>

      <PageNumber>{pageNumber}</PageNumber>
    </article>
  )
}

/**
 * PDF 전용 페이지 구성.
 * 화면 미리보기와 분리해 감축사업이 많아져도 카드나 행이 용지 경계에서 잘리지 않게 한다.
 * 10행씩 나누고, 마지막 묶음이 5행 이하면 이행계획·최종등급을 같은 장에 붙인다.
 */
const SelfCheckReportPrintSheets = ({
  data,
}: {
  data: SelfCheckReportData
}) => {
  const rowsPerPage = 10
  const rowsWithSummary = 5
  const projectChunks: SelfCheckReportData["reductionEffects"]["projects"][] =
    []

  for (
    let startIndex = 0;
    startIndex < data.reductionEffects.projects.length;
    startIndex += rowsPerPage
  ) {
    projectChunks.push(
      data.reductionEffects.projects.slice(
        startIndex,
        startIndex + rowsPerPage,
      ),
    )
  }

  // 사업이 하나도 없어도 합계와 하단 요약이 들어가는 결과 페이지 한 장은 만든다.
  if (projectChunks.length === 0) projectChunks.push([])

  const lastChunkIndex = projectChunks.length - 1
  const summaryFitsOnLastProjectPage =
    projectChunks[lastChunkIndex].length <= rowsWithSummary

  return (
    <>
      <SelfCheckReportPageOne data={data} />

      {projectChunks.map((projects, chunkIndex) => {
        const isLastChunk = chunkIndex === lastChunkIndex

        return (
          <SelfCheckReportPageTwo
            key={`reduction-page-${chunkIndex}`}
            data={data}
            projects={projects}
            projectStartIndex={chunkIndex * rowsPerPage}
            showTotals={isLastChunk}
            showSummary={isLastChunk && summaryFitsOnLastProjectPage}
            pageNumber={chunkIndex + 2}
          />
        )
      })}

      {!summaryFitsOnLastProjectPage && (
        <SelfCheckReportPageTwo
          data={data}
          showReductionEffects={false}
          showTotals={false}
          showSummary
          pageNumber={projectChunks.length + 2}
        />
      )}
    </>
  )
}

export const SelfCheckReportDownloadButton = ({
  data,
  className,
  children,
}: {
  data: SelfCheckReportData
  className?: string
  /** 화면별 버튼 문구·아이콘. 생략하면 보고서 예시 화면의 기본 버튼을 사용한다. */
  children?: React.ReactNode
}) => {
  const [isGenerating, setIsGenerating] = useState(false)
  const exportRootRef = useRef<HTMLDivElement>(null)

  const downloadReport = async () => {
    if (isGenerating) return
    flushSync(() => setIsGenerating(true))

    try {
      const exportRoot = exportRootRef.current
      if (!exportRoot) throw new Error("PDF export root was not created.")

      // 로컬 Pretendard와 로고가 모두 준비된 뒤 캡처해야 화면/PDF가 동일하게 나온다.
      await document.fonts.ready
      await new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      )

      await Promise.all(
        Array.from(exportRoot.querySelectorAll("img")).map((image) =>
          image.decode().catch(() => undefined),
        ),
      )

      // 초기 화면 번들에는 무거운 PDF 라이브러리를 싣지 않고 클릭할 때만 불러온다.
      const [{ toPng }, { jsPDF }] = await Promise.all([
        import("html-to-image"),
        import("jspdf"),
      ])
      const sheets = Array.from(
        exportRoot.querySelectorAll<HTMLElement>(".self-check-report-sheet"),
      )
      if (sheets.length === 0) throw new Error("PDF sheets were not created.")

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        compress: true,
      })

      for (const [index, sheet] of sheets.entries()) {
        const pageImage = await toPng(sheet, {
          backgroundColor: "#fff",
          cacheBust: true,
          pixelRatio: 2,
        })

        if (index > 0) pdf.addPage("a4", "portrait")
        pdf.addImage(pageImage, "PNG", 0, 0, 210, 297, undefined, "FAST")
      }

      const dateSuffix = data.generatedOn.replace(/[^0-9.-]/g, "")
      pdf.save(
        `탄소중립-선도기업-자가진단-결과보고서${dateSuffix ? `-${dateSuffix}` : ""}.pdf`,
      )
    } catch (error) {
      console.error("자가진단 결과보고서 PDF 생성에 실패했습니다.", error)
      toast.error("PDF 파일을 만들지 못했습니다. 잠시 후 다시 시도해 주세요.")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <>
      <Button
        type="button"
        onClick={downloadReport}
        disabled={isGenerating}
        aria-busy={isGenerating}
        className={cn(
          "h-11 gap-1.5 rounded-lg text-sm font-bold md:h-13 md:w-42 [&_svg]:size-5",
          className,
        )}
      >
        {isGenerating ? (
          <>
            <LoaderCircle aria-hidden="true" className="animate-spin" />
            PDF 생성 중...
          </>
        ) : (
          (children ?? (
            <>
              <Printer aria-hidden="true" />
              PDF로 저장
            </>
          ))
        )}
      </Button>

      {isGenerating &&
        createPortal(
          <div
            ref={exportRootRef}
            className="self-check-report-export-root"
            aria-hidden="true"
          >
            <SelfCheckReportPrintSheets data={data} />
          </div>,
          document.body,
        )}
    </>
  )
}

const SelfCheckResultCertificate = ({
  data = SELF_CHECK_REPORT_SAMPLE,
}: {
  data?: SelfCheckReportData
}) => (
  <div className="self-check-report-page flex w-full max-w-316 flex-col items-center gap-6 px-5 py-12 md:gap-8 md:px-7 md:py-14">
    <div
      className="flex w-full items-center justify-between gap-3"
      data-print-hide
    >
      <h2 className="text-ink-strong text-lg font-bold md:text-2xl">
        자가진단 결과보고서
      </h2>
      <SelfCheckReportDownloadButton data={data} />
    </div>

    <div className="flex w-full flex-col gap-6 overflow-x-auto pb-2">
      <SelfCheckReportPageOne
        data={data}
        className="mx-auto shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_10px_30px_rgba(0,0,0,0.08)]"
      />
      <SelfCheckReportPageTwo
        data={data}
        className="mx-auto shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_10px_30px_rgba(0,0,0,0.08)]"
      />
    </div>
  </div>
)

export default SelfCheckResultCertificate
