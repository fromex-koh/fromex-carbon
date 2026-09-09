"use client";

import { flushSync } from "react-dom";
import { useState } from "react";
import { Download, LoaderCircle } from "lucide-react";
import { toast } from "sonner";

import {
  ApplicationDownloadPageOne,
  ReportCard,
  ReportSheet,
  formatValue,
} from "@/app/(site)/(content)/carbon-leader/application-1/components/application-download";
import {
  AdoptionTable,
  AttachmentCards,
  InvestmentTable,
  buildAttachmentPages,
  buildPlanPages,
} from "@/app/(site)/(content)/carbon-leader/application-2/components/application-download";
import { Button } from "@/components/ui/button";
import {
  APPLICATION_THIRD_EVALUATION_CASES,
  buildThirdApplicationCase,
  type ApplicationThirdDownloadData,
  type ApplicationThirdEvaluation,
} from "@/constants/carbon-leader-application-3-download";
import { cn } from "@/lib/utils";

/*
 * 탄소중립 선도기업 3차 신청서 PDF 템플릿.
 *
 * [프론트 개발 안내]
 * 1. API 응답을 ApplicationThirdDownloadData로 변환해 data prop 하나로 넘긴다.
 * 2. investments, adoptions, attachments는 배열 길이에 따라 A4 페이지가 자동 증감한다.
 * 3. evaluation.criterion으로 네 평가 기준의 레이블과 카드 수가 자동 결정된다.
 * 4. evaluation.achieved가 false이면 Figma 미달성 규격의 빨간 뱃지를 표시한다.
 */

const InventoryTable = ({ data }: { data: ApplicationThirdDownloadData }) => (
  <ReportCard title="인벤토리 배출량 신청">
    <div className="overflow-hidden rounded-[4pt] border-[0.5pt] border-[#f1f4f9]">
      <table className="w-full table-fixed border-collapse text-[10pt] leading-[14pt] text-[#333]">
        <colgroup>
          <col className="w-[116pt]" />
          {data.inventory.years.map((year) => (
            <col key={year} />
          ))}
        </colgroup>
        <thead>
          <tr className="h-[28pt] bg-[#f1f4f9] font-bold text-[#666]">
            <th>구분</th>
            {data.inventory.years.map((year) => (
              <th key={year}>{year}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="h-[40pt]">
            <th className="pr-[8pt] pl-[16pt] text-left font-bold whitespace-nowrap">
              온실가스 평균배출량
              <span className="block font-normal text-[#888]">(Scope 1&amp;2, tCO₂eq)</span>
            </th>
            {data.inventory.years.map((year, index) => (
              <td key={year} className="text-center">
                {formatValue(data.inventory.emissions[index])}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  </ReportCard>
);

type EvaluationStat = { label: string; value: string; result?: boolean };

const buildEvaluationStats = (evaluation: ApplicationThirdEvaluation): EvaluationStat[] => {
  const result: EvaluationStat = {
    label: evaluation.criterion === "target-management" ? "평가 결과 (실적 ≤ 허용량)" : "평가 결과",
    value: evaluation.achieved ? "달성" : "미달성",
    result: true,
  };

  switch (evaluation.criterion) {
    case "intensity":
      return [
        { label: "평가기준", value: "원단위 기준" },
        { label: "기준연도 원단위 평균", value: evaluation.baselineIntensity },
        { label: "3차년도 원단위", value: evaluation.finalIntensity },
        { label: "원단위 감축률", value: evaluation.reductionRate },
        { label: "목표감축률", value: evaluation.targetRate },
        result,
      ];
    case "reduction":
      return [
        { label: "평가기준", value: "감축량 기준" },
        { label: "기준연도 평균 배출량", value: evaluation.baselineAverage },
        { label: "3개년 평균 감축량", value: evaluation.averageReduction },
        {
          label: "평가기준 감축율 (평균 감축량 ÷ 기준평균)",
          value: evaluation.evaluationRate,
        },
        { label: "목표감축률", value: evaluation.targetRate },
        result,
      ];
    case "target-management":
      return [
        { label: "평가기준", value: "목표관리업체 기준" },
        { label: "3차년도 배출허용량", value: evaluation.allowance },
        { label: "3차년도 실적 배출량", value: evaluation.actualEmission },
        result,
      ];
    default:
      return [
        { label: "평가기준", value: "절대배출량 기준" },
        { label: "기준연도 평균 배출량", value: evaluation.baselineAverage },
        { label: "최종년도(3차) 실적 배출량", value: evaluation.finalEmission },
        { label: "절대배출량 감축률", value: evaluation.reductionRate },
        { label: "목표감축률", value: evaluation.targetRate },
        result,
      ];
  }
};

const AchievementEvaluation = ({ evaluation }: { evaluation: ApplicationThirdEvaluation }) => (
  <ReportCard title="목표달성 평가" titleClassName="text-[13pt] leading-[20pt]">
    <dl className="grid grid-cols-2 gap-[10pt]">
      {buildEvaluationStats(evaluation).map((stat) => (
        <div
          key={stat.label}
          className="flex min-h-[102pt] flex-col items-center justify-center gap-[12pt] rounded-[8pt] bg-[#f8f8f8] px-[10pt] py-[20pt]"
        >
          <dt className="rounded-full bg-white px-[20pt] py-[4pt] text-center text-[10pt] leading-[14pt] font-normal text-[#666]">
            {stat.label}
          </dt>
          {stat.result ? (
            <dd
              className={cn(
                "flex flex-col items-center justify-center rounded-[8pt] px-[10pt] py-[4pt] text-[14pt] leading-[20pt] font-bold",
                evaluation.achieved
                  ? "bg-[rgba(81,168,84,0.1)] text-[#51a854]"
                  : "bg-[rgba(239,68,68,0.1)] text-[#ef4444]",
              )}
            >
              {stat.value}
            </dd>
          ) : (
            <dd className="px-[10pt] py-[4pt] text-center text-[14pt] leading-[20pt] font-bold text-[#111]">
              {stat.value}
            </dd>
          )}
        </div>
      ))}
    </dl>
  </ReportCard>
);

export const ThirdApplicationDownloadSheets = ({
  data,
  sheetClassName,
}: {
  data: ApplicationThirdDownloadData;
  sheetClassName?: string;
}) => <>{buildThirdApplicationSheetElements(data, sheetClassName)}</>;

const buildThirdApplicationSheetElements = (
  data: ApplicationThirdDownloadData,
  sheetClassName?: string,
) => {
  const planPages = buildPlanPages(data);
  const attachmentPages = buildAttachmentPages(data.attachments, "third");
  const evaluationPageNumber = planPages.length + 2;

  return [
    <ApplicationDownloadPageOne
      key="third-company"
      data={data}
      round={3}
      className={sheetClassName}
      pageNumberClassName="font-bold text-[#333]"
    />,
    ...planPages.map((page, index) => (
      <ReportSheet
        key={`third-plan-${index}`}
        data={data}
        round={3}
        pageNumber={index + 2}
        className={sheetClassName}
        contentClassName="gap-[16pt]"
        pageNumberClassName="font-bold text-[#333]"
        titleClassName="text-[17pt] leading-[26pt]"
      >
        {page.investments && (
          <InvestmentTable
            rows={page.investments}
            startIndex={page.investmentStart ?? 0}
            variant="third"
          />
        )}
        {page.adoptions && (
          <AdoptionTable
            rows={page.adoptions}
            startIndex={page.adoptionStart ?? 0}
            variant="third"
          />
        )}
      </ReportSheet>
    )),
    <ReportSheet
      key="third-evaluation"
      data={data}
      round={3}
      pageNumber={evaluationPageNumber}
      className={sheetClassName}
      contentClassName="gap-[16pt]"
      pageNumberClassName="font-bold text-[#333]"
      titleClassName="text-[17pt] leading-[26pt]"
    >
      <InventoryTable data={data} />
      <AchievementEvaluation evaluation={data.evaluation} />
    </ReportSheet>,
    ...attachmentPages.map((groups, index) => (
      <ReportSheet
        key={`third-attachments-${index}`}
        data={data}
        round={3}
        pageNumber={evaluationPageNumber + index + 1}
        className={sheetClassName}
        contentClassName="gap-[16pt]"
        pageNumberClassName="font-bold text-[#333]"
        titleClassName="text-[17pt] leading-[26pt]"
      >
        <AttachmentCards groups={groups} variant="third" />
      </ReportSheet>
    )),
  ];
};

export const ThirdApplicationDownloadButton = ({
  data,
  className,
  children,
}: {
  data: ApplicationThirdDownloadData;
  className?: string;
  children?: React.ReactNode;
}) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const downloadApplication = async () => {
    if (isGenerating) return;
    flushSync(() => setIsGenerating(true));

    try {
      await document.fonts.ready;
      const [{ createRoot }, { toJpeg }, { jsPDF }] = await Promise.all([
        import("react-dom/client"),
        import("html-to-image"),
        import("jspdf"),
      ]);
      const sheets = buildThirdApplicationSheetElements(data);

      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4", compress: true });
      // 화면과 같은 레이아웃을 한 번만 캡처한다.
      // 반복 표 헤더의 재시도보다 본문 행의 좌표와 잘림 방지를 우선한다.
      for (const [index, sheetElement] of sheets.entries()) {
        const captureRoot = document.createElement("div");
        captureRoot.className = "application-download-single-sheet-export-root";
        document.body.append(captureRoot);
        const root = createRoot(captureRoot);
        try {
          flushSync(() => root.render(sheetElement));
          await new Promise<void>((resolve) =>
            requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
          );
          const sheet = captureRoot.querySelector<HTMLElement>(".application-download-sheet");
          if (!sheet) throw new Error(`PDF sheet ${index + 1} was not created.`);
          await Promise.all(
            Array.from(sheet.querySelectorAll("img")).map((image) =>
              image.decode().catch(() => undefined),
            ),
          );
          await new Promise<void>((resolve) =>
            requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
          );

          const pageImage = await toJpeg(sheet, {
            backgroundColor: "#fff",
            cacheBust: true,
            pixelRatio: 2,
            quality: 0.96,
            width: sheet.offsetWidth,
            height: sheet.offsetHeight,
            skipAutoScale: true,
          });
          if (index > 0) pdf.addPage("a4", "portrait");
          pdf.addImage(pageImage, "JPEG", 0, 0, 210, 297, `third-page-${index}`, "FAST");
        } finally {
          root.unmount();
          captureRoot.remove();
          await new Promise<void>((resolve) =>
            requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
          );
        }
      }

      const dateSuffix = data.generatedOn.replace(/[^0-9.-]/g, "");
      pdf.save(`탄소중립-선도기업-3차-신청서${dateSuffix ? `-${dateSuffix}` : ""}.pdf`);
    } catch (error) {
      console.error("선도기업 3차 신청서 PDF 생성에 실패했습니다.", error);
      toast.error("PDF 파일을 만들지 못했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      type="button"
      onClick={downloadApplication}
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
            신청서 다운로드
            <Download aria-hidden="true" />
          </>
        ))
      )}
    </Button>
  );
};

const CASE_OPTIONS = [
  { key: "absoluteAchieved", label: "절대배출량 · 달성" },
  { key: "absoluteUnmet", label: "절대배출량 · 미달성" },
  { key: "intensityAchieved", label: "원단위 기준" },
  { key: "reductionAchieved", label: "감축량 기준" },
  { key: "targetManagementAchieved", label: "목표관리업체 기준" },
] as const;

type CaseKey = (typeof CASE_OPTIONS)[number]["key"];

const ThirdApplicationDownloadPreview = () => {
  const [caseKey, setCaseKey] = useState<CaseKey>("absoluteAchieved");
  const data = buildThirdApplicationCase(APPLICATION_THIRD_EVALUATION_CASES[caseKey]);

  return (
    <div className="flex w-full max-w-316 flex-col items-center gap-6 px-5 py-12 md:gap-8 md:px-7 md:py-14">
      <div className="flex w-full flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-ink-strong text-lg font-bold md:text-2xl">선도기업 3차 신청서</h2>
          <ThirdApplicationDownloadButton data={data} />
        </div>
        <div className="flex flex-wrap gap-2" aria-label="목표달성 평가 케이스">
          {CASE_OPTIONS.map((option) => (
            <button
              key={option.key}
              type="button"
              onClick={() => setCaseKey(option.key)}
              aria-pressed={caseKey === option.key}
              className={cn(
                "h-9 rounded-full border px-4 text-sm font-bold transition-colors",
                caseKey === option.key
                  ? "border-brand-primary bg-brand-primary text-white"
                  : "border-line-field bg-surface-field text-ink-body hover:bg-surface-action",
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
      <div className="flex w-full flex-col gap-6 overflow-x-auto pb-2">
        <ThirdApplicationDownloadSheets
          data={data}
          sheetClassName="mx-auto shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_10px_30px_rgba(0,0,0,0.08)]"
        />
      </div>
    </div>
  );
};

export default ThirdApplicationDownloadPreview;
