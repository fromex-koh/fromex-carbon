"use client";

import { createPortal, flushSync } from "react-dom";
import { useRef, useState } from "react";
import { Download, LoaderCircle } from "lucide-react";
import { toast } from "sonner";

import {
  ApplicationDownloadPageOne,
  ReportCard,
  ReportSheet,
  formatValue,
} from "@/app/(site)/(content)/carbon-leader/application-1/components/application-download";
import { Button } from "@/components/ui/button";
import {
  APPLICATION_SECOND_DOWNLOAD_SAMPLE,
  type ApplicationSecondDownloadData,
} from "@/constants/carbon-leader-application-2-download";
import type { ApplicationAttachmentGroup } from "@/constants/carbon-leader-application-download";
import { cn } from "@/lib/utils";

/*
 * 탄소중립 선도기업 2차 신청서 PDF 템플릿.
 *
 * [프론트 개발 안내]
 * 1. API 응답을 ApplicationSecondDownloadData로 변환해 data prop 하나로 넘긴다.
 * 2. investments, adoptions, attachments 배열 길이에 따라 행과 A4 페이지가 자동 증감한다.
 * 3. 실제 결과 화면에는 SecondApplicationDownloadButton만 사용한다.
 * 4. 클릭 시 인쇄 미리보기나 화면 스크롤 변경 없이 PDF가 바로 다운로드된다.
 */

type InvestmentRows = ApplicationSecondDownloadData["investments"];
type AdoptionRows = ApplicationSecondDownloadData["adoptions"];

export const InvestmentTable = ({
  rows,
  startIndex,
  variant = "default",
}: {
  rows: InvestmentRows;
  startIndex: number;
  variant?: "default" | "third";
}) => (
  <ReportCard
    title="탄소중립 투자계획"
    className={variant === "third" ? undefined : "pb-[16pt]"}
  >
    <div className="overflow-hidden rounded-[4pt] border-[0.5pt] border-[#f1f4f9]">
      <table
        className={cn(
          "w-full table-fixed border-collapse text-[9pt] leading-[12pt] text-[#333]",
          variant === "third" && "text-[10pt] leading-[14pt]",
        )}
      >
        <colgroup>
          <col className="w-[28pt]" />
          <col className="w-[84pt]" />
          <col className="w-[118pt]" />
          <col className={variant === "third" ? "w-[147pt]" : "w-[122pt]"} />
          <col className={variant === "third" ? "w-[64pt]" : "w-[80pt]"} />
          <col />
        </colgroup>
        <thead>
          <tr
            className={cn(
              "h-[34pt] bg-[#f1f4f9] font-bold text-[#666]",
              variant === "third" && "h-[28pt]",
            )}
          >
            <th>No</th>
            <th>감축기술</th>
            <th>감축설비명</th>
            <th>사업기간</th>
            <th>
              투자금
              <br />
              <span className="font-normal">(백만원)</span>
            </th>
            <th>
              온실가스감축량
              <br />
              <span className="font-normal">(tCO₂eq)</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr className="h-[40pt]">
              <td colSpan={6} className="text-center text-[#888]">
                등록된 투자계획이 없습니다.
              </td>
            </tr>
          ) : (
            rows.map((row, index) => (
              <tr key={`${startIndex}-${index}-${row.tech}`}>
                <td className="h-[40pt] py-[6pt] text-center align-middle font-bold">
                  {startIndex + index + 1}
                </td>
                <td
                  className={cn(
                    "h-[40pt] px-[4pt] py-[6pt] text-center align-middle break-words",
                    variant === "third" && "px-[10pt] text-left",
                  )}
                >
                  {row.tech}
                </td>
                <td
                  className={cn(
                    "h-[40pt] px-[4pt] py-[6pt] text-center align-middle break-words",
                    variant === "third" && "px-[10pt] text-left",
                  )}
                >
                  {row.facility}
                </td>
                <td className="h-[40pt] px-[4pt] py-[6pt] text-center align-middle break-words">
                  {row.period || "-"}
                </td>
                <td className="h-[40pt] py-[6pt] text-center align-middle">
                  {formatValue(row.amount)}
                </td>
                <td className="h-[40pt] py-[6pt] text-center align-middle">
                  {formatValue(row.reduction)}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </ReportCard>
);

export const AdoptionTable = ({
  rows,
  startIndex,
  variant = "default",
}: {
  rows: AdoptionRows;
  startIndex: number;
  variant?: "default" | "third";
}) => (
  <ReportCard
    title="감축기술 도입현황"
    className={variant === "third" ? undefined : "pb-[16pt]"}
  >
    <div className="overflow-hidden rounded-[4pt] border-[0.5pt] border-[#f1f4f9]">
      <table
        className={cn(
          "w-full table-fixed border-collapse text-[9pt] leading-[12pt] text-[#333]",
          variant === "third" && "text-[10pt] leading-[14pt]",
        )}
      >
        <colgroup>
          <col className="w-[28pt]" />
          <col className="w-[98pt]" />
          <col />
          <col className="w-[100pt]" />
          <col className="w-[100pt]" />
        </colgroup>
        <thead>
          <tr
            className={cn(
              "h-[34pt] bg-[#f1f4f9] font-bold text-[#666]",
              variant === "third" && "h-[28pt]",
            )}
          >
            <th>No</th>
            <th>감축기술</th>
            <th>감축설비명</th>
            <th>사업기간</th>
            <th>
              투자금
              <br />
              <span className="font-normal">(백만원)</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr className="h-[40pt]">
              <td colSpan={5} className="text-center text-[#888]">
                등록된 도입현황이 없습니다.
              </td>
            </tr>
          ) : (
            rows.map((row, index) => (
              <tr key={`${startIndex}-${index}-${row.tech}`}>
                <td className="h-[40pt] py-[6pt] text-center align-middle font-bold">
                  {startIndex + index + 1}
                </td>
                <td
                  className={cn(
                    "h-[40pt] px-[4pt] py-[6pt] text-center align-middle break-words",
                    variant === "third" && "px-[10pt] text-left",
                  )}
                >
                  {row.tech}
                </td>
                <td
                  className={cn(
                    "h-[40pt] px-[6pt] py-[6pt] text-center align-middle break-words",
                    variant === "third" && "px-[10pt] text-left",
                  )}
                >
                  {row.facility}
                </td>
                <td className="h-[40pt] py-[6pt] text-center align-middle">
                  {row.introducedOn || "-"}
                </td>
                <td className="h-[40pt] py-[6pt] text-center align-middle">
                  {formatValue(row.amount)}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </ReportCard>
);

export type DisplayAttachmentGroup = ApplicationAttachmentGroup & { totalCount: number };

export const AttachmentCards = ({
  groups,
  variant = "default",
}: {
  groups: DisplayAttachmentGroup[];
  variant?: "default" | "third";
}) => {
  const cards = (
    <div className="flex flex-col gap-[12pt]">
      {groups.map((group, groupIndex) => (
        <section
          key={`${group.title}-${groupIndex}`}
          className={cn(
            "rounded-[6pt] bg-[#f7f7f7] p-[12pt]",
            variant === "third" &&
              "gap-[6pt] rounded-[8pt] bg-[#f8f8f8] px-[16pt] pt-[10pt] pb-[16pt]",
          )}
        >
          <div
            className={cn(
              "mb-[8pt] flex items-center justify-between text-[9pt] leading-[12pt] font-bold text-[#333]",
              variant === "third" && "mb-[6pt] text-[10pt] leading-[14pt]",
            )}
          >
            <h3 className="min-w-0 break-words">{group.title}</h3>
            <span
              className={cn(
                "flex h-[20pt] shrink-0 items-center rounded-full bg-white px-[9pt] text-[8pt] leading-none font-bold text-[#333]",
                variant === "third" &&
                  "h-auto flex-col justify-center px-[8pt] py-[4pt] text-[10pt] leading-[14pt]",
              )}
            >
              {group.totalCount}건 첨부
            </span>
          </div>
          <ul className="flex flex-col gap-[6pt]">
            {group.files.map((file, fileIndex) => (
              <li
                key={`${file.name}-${fileIndex}`}
                className={cn(
                  "flex h-[28pt] items-center justify-between gap-[12pt] rounded-[4pt] bg-[#eee] px-[12pt] text-[9pt] leading-[12pt] text-[#666]",
                  variant === "third" &&
                    "h-auto min-h-[34pt] items-start rounded-[8pt] p-[10pt] text-[10pt] leading-[14pt] text-[#333]",
                )}
              >
                <span
                  className={
                    variant === "third"
                      ? "min-w-0 flex-1 whitespace-normal break-all"
                      : "min-w-0 flex-1 truncate"
                  }
                >
                  {file.name}
                </span>
                <span className="shrink-0">{file.size}</span>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );

  if (variant === "third") {
    return (
      <section className="rounded-[16pt] border-[0.5pt] border-[#eee] p-[20pt]">
        <h2 className="mb-[8pt] border-b-[0.5pt] border-[#eee] pb-[8pt] text-[12pt] leading-[16pt] font-bold text-[#111]">
          서류첨부
        </h2>
        {cards}
      </section>
    );
  }

  return (
    <ReportCard title="서류첨부" className="pb-[16pt]">
      {cards}
    </ReportCard>
  );
};

type PlanPage = {
  investments?: InvestmentRows;
  investmentStart?: number;
  adoptions?: AdoptionRows;
  adoptionStart?: number;
};

export const buildPlanPages = (data: ApplicationSecondDownloadData) => {
  // 표 제목·헤더는 각 2칸, 데이터 행은 1칸으로 보아 A4 본문 14칸 안에서 묶는다.
  const capacity = 14;
  const pages: PlanPage[] = [];
  let investmentIndex = 0;
  let adoptionIndex = 0;

  while (investmentIndex < data.investments.length || pages.length === 0) {
    const count = Math.min(capacity - 2, data.investments.length - investmentIndex);
    pages.push({
      investments: data.investments.slice(investmentIndex, investmentIndex + Math.max(count, 0)),
      investmentStart: investmentIndex,
    });
    investmentIndex += Math.max(count, 0);
    if (data.investments.length === 0) break;
  }

  let lastPage = pages.at(-1)!;
  const lastInvestmentCount = lastPage.investments?.length ?? 0;
  let remainingCapacity = capacity - 2 - Math.max(lastInvestmentCount, 1);

  if (remainingCapacity >= 3 && adoptionIndex < data.adoptions.length) {
    const count = Math.min(remainingCapacity - 2, data.adoptions.length - adoptionIndex);
    lastPage.adoptions = data.adoptions.slice(adoptionIndex, adoptionIndex + count);
    lastPage.adoptionStart = adoptionIndex;
    adoptionIndex += count;
  }

  while (adoptionIndex < data.adoptions.length) {
    const count = Math.min(capacity - 2, data.adoptions.length - adoptionIndex);
    pages.push({
      adoptions: data.adoptions.slice(adoptionIndex, adoptionIndex + count),
      adoptionStart: adoptionIndex,
    });
    adoptionIndex += count;
  }

  if (data.adoptions.length === 0) {
    lastPage = pages.at(-1)!;
    if ((lastPage.investments?.length ?? 0) <= capacity - 5) {
      lastPage.adoptions = [];
      lastPage.adoptionStart = 0;
    } else {
      pages.push({ adoptions: [], adoptionStart: 0 });
    }
  }

  return pages;
};

type AttachmentCursor = { groupIndex: number; fileIndex: number };

export const buildAttachmentPages = (
  groups: ApplicationAttachmentGroup[],
  variant: "default" | "third" = "default",
) => {
  const pages: DisplayAttachmentGroup[][] = [];
  let cursor: AttachmentCursor = { groupIndex: 0, fileIndex: 0 };

  while (cursor.groupIndex < groups.length) {
    const page: DisplayAttachmentGroup[] = [];
    let usedUnits = 0;

    while (cursor.groupIndex < groups.length) {
      const group = groups[cursor.groupIndex];
      if (group.files.length === 0) {
        cursor = { groupIndex: cursor.groupIndex + 1, fileIndex: 0 };
        continue;
      }
      const availableUnits = 12 - usedUnits - 1;
      if (availableUnits < 1) break;
      let takeCount = 0;
      let fileUnits = 0;
      while (cursor.fileIndex + takeCount < group.files.length) {
        const file = group.files[cursor.fileIndex + takeCount];
        // 3차는 긴 파일명을 말줄임하지 않으므로 예상 줄 수만큼 페이지 용량도 함께 잡는다.
        const estimatedLines = variant === "third" ? Math.max(1, Math.ceil(file.name.length / 42)) : 1;
        const nextUnits = variant === "third" ? 1 + (estimatedLines - 1) * 0.5 : 1;
        if (takeCount > 0 && fileUnits + nextUnits > availableUnits) break;
        fileUnits += nextUnits;
        takeCount += 1;
        if (fileUnits >= availableUnits) break;
      }
      const files = group.files.slice(cursor.fileIndex, cursor.fileIndex + takeCount);
      page.push({ title: group.title, files, totalCount: group.files.length });
      usedUnits += 1 + fileUnits;
      const nextFileIndex = cursor.fileIndex + files.length;
      cursor =
        nextFileIndex >= group.files.length
          ? { groupIndex: cursor.groupIndex + 1, fileIndex: 0 }
          : { groupIndex: cursor.groupIndex, fileIndex: nextFileIndex };
      if (cursor.fileIndex > 0) break;
    }

    if (page.length === 0) break;
    pages.push(page);
  }

  // 첨부가 없어도 Figma의 서류첨부 장은 유지한다.
  if (pages.length === 0) pages.push([]);
  return pages;
};

export const SecondApplicationDownloadSheets = ({
  data,
  sheetClassName,
}: {
  data: ApplicationSecondDownloadData;
  sheetClassName?: string;
}) => {
  const planPages = buildPlanPages(data);
  const attachmentPages = buildAttachmentPages(data.attachments);

  return (
    <>
      <ApplicationDownloadPageOne data={data} round={2} className={sheetClassName} />
      {planPages.map((page, index) => (
        <ReportSheet
          key={`second-plan-${index}`}
          data={data}
          round={2}
          pageNumber={index + 2}
          className={sheetClassName}
        >
          {page.investments && (
            <InvestmentTable rows={page.investments} startIndex={page.investmentStart ?? 0} />
          )}
          {page.adoptions && (
            <AdoptionTable rows={page.adoptions} startIndex={page.adoptionStart ?? 0} />
          )}
        </ReportSheet>
      ))}
      {attachmentPages.map((groups, index) => (
        <ReportSheet
          key={`second-attachments-${index}`}
          data={data}
          round={2}
          pageNumber={planPages.length + index + 2}
          className={sheetClassName}
        >
          <AttachmentCards groups={groups} />
        </ReportSheet>
      ))}
    </>
  );
};

export const SecondApplicationDownloadButton = ({
  data,
  className,
  children,
}: {
  data: ApplicationSecondDownloadData;
  className?: string;
  children?: React.ReactNode;
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const exportRootRef = useRef<HTMLDivElement>(null);

  const downloadApplication = async () => {
    if (isGenerating) return;
    flushSync(() => setIsGenerating(true));

    try {
      const exportRoot = exportRootRef.current;
      if (!exportRoot) throw new Error("PDF export root was not created.");
      await document.fonts.ready;
      await new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      );
      await Promise.all(
        Array.from(exportRoot.querySelectorAll("img")).map((image) =>
          image.decode().catch(() => undefined),
        ),
      );

      const [{ toJpeg }, { jsPDF }] = await Promise.all([import("html-to-image"), import("jspdf")]);
      const sheets = Array.from(
        exportRoot.querySelectorAll<HTMLElement>(".application-download-sheet"),
      );
      if (sheets.length === 0) throw new Error("PDF sheets were not created.");

      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4", compress: true });
      // 캡처 DOM은 한 장씩만 유지해 겹친 fixed 요소 때문에 공통 헤더가 빠지지 않게 한다.
      for (const [index, sourceSheet] of sheets.entries()) {
        const root = document.createElement("div");
        root.className = "application-download-single-sheet-export-root";
        const sheet = sourceSheet.cloneNode(true) as HTMLElement;
        root.append(sheet);
        document.body.append(root);
        try {
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
          pdf.addImage(pageImage, "JPEG", 0, 0, 210, 297, `second-page-${index}`, "FAST");
        } finally {
          root.remove();
        }
      }

      const dateSuffix = data.generatedOn.replace(/[^0-9.-]/g, "");
      pdf.save(`탄소중립-선도기업-2차-신청서${dateSuffix ? `-${dateSuffix}` : ""}.pdf`);
    } catch (error) {
      console.error("선도기업 2차 신청서 PDF 생성에 실패했습니다.", error);
      toast.error("PDF 파일을 만들지 못했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
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
      {isGenerating &&
        createPortal(
          <div ref={exportRootRef} className="application-download-export-root" aria-hidden="true">
            <SecondApplicationDownloadSheets data={data} />
          </div>,
          document.body,
        )}
    </>
  );
};

const SecondApplicationDownloadPreview = ({
  data = APPLICATION_SECOND_DOWNLOAD_SAMPLE,
}: {
  data?: ApplicationSecondDownloadData;
}) => (
  <div className="flex w-full max-w-316 flex-col items-center gap-6 px-5 py-12 md:gap-8 md:px-7 md:py-14">
    <div className="flex w-full items-center justify-between gap-3">
      <h2 className="text-ink-strong text-lg font-bold md:text-2xl">선도기업 2차 신청서</h2>
      <SecondApplicationDownloadButton data={data} />
    </div>
    <div className="flex w-full flex-col gap-6 overflow-x-auto pb-2">
      <SecondApplicationDownloadSheets
        data={data}
        sheetClassName="mx-auto shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_10px_30px_rgba(0,0,0,0.08)]"
      />
    </div>
  </div>
);

export default SecondApplicationDownloadPreview;
