"use client";

import Image from "next/image";
import { createPortal, flushSync } from "react-dom";
import { useRef, useState } from "react";
import { Download, LoaderCircle } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  APPLICATION_DOWNLOAD_SAMPLE,
  type ApplicationAttachmentGroup,
  type ApplicationDownloadData,
  type ApplicationReportValue,
} from "@/constants/carbon-leader-application-download";
import { cn } from "@/lib/utils";
import KiboLogo from "@/public/logo-kibo.svg";

/*
 * 탄소중립 선도기업 1차 신청서 PDF 공통 템플릿.
 *
 * [프론트 개발 안내]
 * 1. API 응답을 ApplicationDownloadData 모양으로 만든 뒤 data prop 하나로 넘긴다.
 * 2. investments와 attachments 배열 길이에 맞춰 행과 A4 페이지가 자동 증감한다.
 * 3. 실제 결과 화면에는 ApplicationDownloadButton만 배치하면 된다.
 * 4. 클릭 시 인쇄 미리보기 없이 PDF 파일이 바로 다운로드된다.
 */

export const formatValue = (value: ApplicationReportValue | undefined) => {
  if (value === undefined || value === null || value === "") return "-";
  return typeof value === "number" ? value.toLocaleString("ko-KR") : value;
};

const ReportHeader = ({
  data,
  round = 1,
  titleClassName,
}: {
  data: ApplicationDownloadData;
  round?: number;
  titleClassName?: string;
}) => (
  <div
    className={cn(
      "application-download-page-heading h-[77pt] shrink-0 bg-white",
      titleClassName && "h-auto",
    )}
  >
    <div className="flex shrink-0 items-center justify-between border-b-[0.5pt] border-[#d2d2d2] pb-[16pt]">
      <Image priority src={KiboLogo} alt="KIBO 기술보증기금" className="h-[20pt] w-[150pt]" />
      <div className="flex items-center gap-[12pt] text-[10pt] leading-[14pt] font-bold whitespace-nowrap">
        <span className="text-[#111]">{data.company.headerName ?? data.company.name}</span>
        <span className="flex items-center gap-[4pt]">
          <span className="text-[#888]">생성일자</span>
          <span className="text-[#111]">{data.generatedOn}</span>
        </span>
      </div>
    </div>
    <h1
      className={cn(
        "mt-[16pt] shrink-0 text-[16pt] leading-[24pt] font-bold text-[#111]",
        titleClassName,
      )}
    >
      탄소중립 선도기업 {round}차 확인서
    </h1>
  </div>
);

export const ReportCard = ({
  title,
  children,
  className,
  titleClassName,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
  titleClassName?: string;
}) => (
  <section
    className={cn(
      "rounded-[8pt] border-[0.5pt] border-[#eee] px-[20pt] pt-[16pt] pb-[24pt]",
      className,
    )}
  >
    <h2
      className={cn(
        "mb-[16pt] border-b-[0.5pt] border-[#eee] pb-[8pt] text-[12pt] leading-[16pt] font-bold text-[#111]",
        titleClassName,
      )}
    >
      {title}
    </h2>
    {children}
  </section>
);

const InfoItem = ({
  label,
  value,
  className,
}: {
  label: string;
  value: React.ReactNode;
  className?: string;
}) => (
  <div className={cn("flex min-w-0 flex-col gap-[8pt] text-[10pt] leading-[14pt]", className)}>
    <dt className="font-normal text-[#888]">{label}</dt>
    <dd className="min-w-0 break-words font-bold text-[#333]">{value}</dd>
  </div>
);

const PageNumber = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <p
    className={cn(
      "mt-auto shrink-0 text-center text-[10pt] leading-[14pt] font-normal text-[#888]",
      className,
    )}
  >
    - {children} -
  </p>
);

export const ReportSheet = ({
  data,
  round = 1,
  pageNumber,
  children,
  className,
  contentClassName,
  pageNumberClassName,
  titleClassName,
}: {
  data: ApplicationDownloadData;
  round?: number;
  pageNumber: number;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  pageNumberClassName?: string;
  titleClassName?: string;
}) => (
  <article
    className={cn(
      "application-download-sheet flex h-[842pt] w-[598pt] shrink-0 flex-col bg-white p-[20pt] text-[#111]",
      className,
    )}
  >
    <ReportHeader data={data} round={round} titleClassName={titleClassName} />
    <div className={cn("mt-[16pt] flex shrink-0 flex-col gap-[24pt]", contentClassName)}>
      {children}
    </div>
    <PageNumber className={pageNumberClassName}>{pageNumber}</PageNumber>
  </article>
);

export const ApplicationDownloadPageOne = ({
  data,
  round = 1,
  className,
  pageNumberClassName,
}: {
  data: ApplicationDownloadData;
  round?: number;
  className?: string;
  pageNumberClassName?: string;
}) => (
  <ReportSheet
    data={data}
    round={round}
    pageNumber={1}
    className={className}
    pageNumberClassName={pageNumberClassName}
  >
    <ReportCard title="기업정보">
      <dl className="grid grid-cols-3 gap-x-[24pt] gap-y-[16pt]">
        <InfoItem label="업체명" value={data.company.name} />
        <InfoItem label="대표자" value={data.company.ceo} />
        <InfoItem label="사업자등록번호" value={data.company.businessNumber} />
        <InfoItem label="법인등록번호" value={data.company.corporationNumber} />
        <InfoItem label="기업소재지" value={data.company.address} className="col-span-2" />
        <div className="col-span-3 border-t-[0.5pt] border-[#eee]" />
        <InfoItem label="대표자 연락처" value={data.company.ceoPhone} />
        <InfoItem label="전자우편" value={data.company.email} className="col-span-2" />
      </dl>
    </ReportCard>

    <ReportCard title="기업현황">
      <dl className="grid grid-cols-3 gap-x-[24pt] gap-y-[16pt]">
        <InfoItem label="설립일자" value={data.company.foundedOn} />
        <InfoItem label="업종" value={data.company.industry} />
        <InfoItem label="업종코드" value={data.company.industryCode} />
        <InfoItem label="주생산품" value={data.company.mainProduct} />
        <InfoItem label="연간생산량" value={data.company.annualProduction} />
      </dl>
    </ReportCard>

    <ReportCard title="담당자 정보">
      <dl className="grid grid-cols-3 gap-x-[24pt] gap-y-[16pt]">
        <InfoItem label="담당자명" value={data.manager.name} />
        <InfoItem label="부서 / 직책" value={data.manager.department} />
        <InfoItem label="전화번호 (사무실)" value={data.manager.officePhone} />
        <InfoItem label="팩스번호" value={data.manager.fax} />
        <InfoItem label="전자우편" value={data.manager.email} />
        <InfoItem label="연락처 (HP)" value={data.manager.mobile} />
      </dl>
    </ReportCard>
  </ReportSheet>
);

const YearTable = ({
  years,
  rows,
}: {
  years: string[];
  rows: { label: string; unit?: string; values: ApplicationReportValue[] }[];
}) => (
  <div className="overflow-hidden rounded-[4pt] border-[0.5pt] border-[#f1f4f9]">
    <table className="w-full table-fixed border-collapse text-[10pt] leading-[14pt] text-[#333]">
      <colgroup>
        <col className="w-[182pt]" />
        {years.map((year) => (
          <col key={year} />
        ))}
      </colgroup>
      <thead>
        <tr className="h-[28pt] bg-[#f1f4f9] font-bold text-[#666]">
          <th className="text-center font-bold">구분</th>
          {years.map((year) => (
            <th key={year} className="text-center font-bold">
              {year}년
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.label} className="h-[52pt]">
            <th className="px-[16pt] text-left font-bold">
              {row.label}
              {row.unit && <span className="ml-[2pt] font-normal text-[#888]">{row.unit}</span>}
            </th>
            {years.map((year, index) => (
              <td key={year} className="text-center font-normal">
                {row.values.length === 1
                  ? index === 1
                    ? formatValue(row.values[0])
                    : ""
                  : formatValue(row.values[index])}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export const ApplicationDownloadPageTwo = ({
  data,
  className,
}: {
  data: ApplicationDownloadData;
  className?: string;
}) => (
  <ReportSheet data={data} pageNumber={2} className={className}>
    <ReportCard title="탄소중립 기준연도 현황">
      <YearTable
        years={data.baseline.years}
        rows={[
          { label: "총매출액", unit: "(백만원)", values: data.baseline.sales },
          { label: "온실가스 배출량", unit: "(tCO₂eq)", values: data.baseline.emissions },
          { label: "탄소중립 기준연도", values: [data.baseline.standardYear] },
          {
            label: "기준연도 온실가스 평균배출량",
            unit: "(tCO₂eq)",
            values: [data.baseline.averageEmissions],
          },
        ]}
      />
    </ReportCard>

    <ReportCard title="탄소감축계획">
      <YearTable
        years={data.reductionPlan.years}
        rows={[
          {
            label: "탄소감축투자 계획금액",
            unit: "(백만원)",
            values: data.reductionPlan.investments,
          },
          {
            label: "탄소중립 목표",
            unit: "(기준연도 대비감축, %)",
            values: data.reductionPlan.targets,
          },
        ]}
      />
    </ReportCard>
  </ReportSheet>
);

const InvestmentTable = ({
  data,
  startIndex,
  rows,
}: {
  data: ApplicationDownloadData;
  startIndex: number;
  rows: ApplicationDownloadData["investments"];
}) => (
  <ReportCard title="향후 3년간 탄소중립 투자계획" className="pb-[16pt]">
    <div className="overflow-hidden rounded-[4pt] border-[0.5pt] border-[#f1f4f9]">
      <table className="w-full table-fixed border-collapse text-[9pt] leading-[12pt] text-[#333]">
        <colgroup>
          <col className="w-[38pt]" />
          <col className="w-[102pt]" />
          <col className="w-[132pt]" />
          <col className="w-[92pt]" />
          <col className="w-[82pt]" />
          <col />
        </colgroup>
        <thead>
          <tr className="h-[34pt] bg-[#f1f4f9] font-bold text-[#666]">
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
            <tr className="h-[42pt]">
              <td colSpan={6} className="text-center text-[#888]">
                등록된 투자계획이 없습니다.
              </td>
            </tr>
          ) : (
            rows.map((row, index) => (
              <tr key={`${startIndex}-${index}-${row.tech}`} className="h-[34pt]">
                <td className="text-center font-bold">{startIndex + index + 1}</td>
                <td className="px-[4pt] text-center break-words">{row.tech}</td>
                <td className="px-[4pt] text-center break-words">{row.facility}</td>
                <td className="px-[4pt] text-center break-words">{row.period || "-"}</td>
                <td className="text-center">{formatValue(row.amount)}</td>
                <td className="text-center">{formatValue(row.reduction)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </ReportCard>
);

type DisplayAttachmentGroup = ApplicationAttachmentGroup & {
  /** 다음 장으로 나뉘어도 Figma 뱃지에는 그룹 전체 건수를 표시한다. */
  totalCount: number;
};

const AttachmentCards = ({ groups }: { groups: DisplayAttachmentGroup[] }) => (
  <ReportCard title="서류첨부" className="pb-[16pt]">
    <div className="flex flex-col gap-[12pt]">
      {groups.map((group, groupIndex) => (
        <section
          key={`${group.title}-${groupIndex}`}
          className="rounded-[6pt] bg-[#f7f7f7] p-[12pt]"
        >
          <div className="mb-[8pt] flex items-center justify-between text-[9pt] leading-[12pt] font-bold text-[#333]">
            <h3>{group.title}</h3>
            <span className="flex h-[20pt] shrink-0 items-center rounded-full bg-white px-[9pt] text-[8pt] leading-none font-bold text-[#333]">
              {group.totalCount}건 첨부
            </span>
          </div>
          <ul className="flex flex-col gap-[6pt]">
            {group.files.map((file, fileIndex) => (
              <li
                key={`${file.name}-${fileIndex}`}
                className="flex h-[28pt] items-center justify-between gap-[12pt] rounded-[4pt] bg-[#eee] px-[12pt] text-[9pt] leading-[12pt] text-[#666]"
              >
                <span className="min-w-0 flex-1 truncate">{file.name}</span>
                <span className="shrink-0">{file.size}</span>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  </ReportCard>
);

type AttachmentCursor = { groupIndex: number; fileIndex: number };

const takeAttachmentGroups = (
  groups: ApplicationAttachmentGroup[],
  cursor: AttachmentCursor,
  unitLimit: number,
) => {
  const result: DisplayAttachmentGroup[] = [];
  let { groupIndex, fileIndex } = cursor;
  let usedUnits = 0;

  while (groupIndex < groups.length) {
    const group = groups[groupIndex];
    if (group.files.length === 0) {
      groupIndex += 1;
      fileIndex = 0;
      continue;
    }
    // 그룹 제목 1칸 + 파일 한 줄당 1칸으로 계산한다.
    const remainingUnits = unitLimit - usedUnits - 1;
    if (remainingUnits < 1) break;
    const files = group.files.slice(fileIndex, fileIndex + remainingUnits);
    result.push({
      title: group.title,
      files,
      totalCount: group.files.length,
    });
    usedUnits += 1 + files.length;
    fileIndex += files.length;

    if (fileIndex >= group.files.length) {
      groupIndex += 1;
      fileIndex = 0;
    } else {
      break;
    }
  }

  return { groups: result, cursor: { groupIndex, fileIndex } };
};

const hasRemainingAttachments = (groups: ApplicationAttachmentGroup[], cursor: AttachmentCursor) =>
  cursor.groupIndex < groups.length;

/** PDF와 예시 화면이 함께 쓰는 가변 페이지 계산 결과. */
const buildVariablePages = (data: ApplicationDownloadData) => {
  const rowsPerPage = 15;
  const investmentChunks: ApplicationDownloadData["investments"][] = [];
  for (let index = 0; index < data.investments.length; index += rowsPerPage) {
    investmentChunks.push(data.investments.slice(index, index + rowsPerPage));
  }
  if (investmentChunks.length === 0) investmentChunks.push([]);

  const pages: {
    rows?: ApplicationDownloadData["investments"];
    rowStart?: number;
    attachments?: DisplayAttachmentGroup[];
  }[] = investmentChunks.map((rows, index) => ({
    rows,
    rowStart: index * rowsPerPage,
  }));

  let cursor: AttachmentCursor = { groupIndex: 0, fileIndex: 0 };
  const lastPage = pages.at(-1)!;
  const lastRowCount = lastPage.rows?.length ?? 0;

  // Figma 예시처럼 투자계획 4행 이하일 때만 같은 장 아래에 첨부 영역을 붙인다.
  if (lastRowCount <= 4 && hasRemainingAttachments(data.attachments, cursor)) {
    const taken = takeAttachmentGroups(data.attachments, cursor, 8);
    lastPage.attachments = taken.groups;
    cursor = taken.cursor;
  }

  // 첨부파일이 더 많으면 그룹 제목을 반복해 다음 A4 장으로 안전하게 넘긴다.
  while (hasRemainingAttachments(data.attachments, cursor)) {
    const taken = takeAttachmentGroups(data.attachments, cursor, 14);
    if (taken.groups.length === 0) break;
    pages.push({ attachments: taken.groups });
    cursor = taken.cursor;
  }

  return pages;
};

export const ApplicationDownloadSheets = ({
  data,
  sheetClassName,
}: {
  data: ApplicationDownloadData;
  sheetClassName?: string;
}) => {
  const pages = buildVariablePages(data);

  return (
    <>
      <ApplicationDownloadPageOne data={data} className={sheetClassName} />
      <ApplicationDownloadPageTwo data={data} className={sheetClassName} />
      {pages.map((page, index) => (
        <ReportSheet
          key={`application-page-${index}`}
          data={data}
          pageNumber={index + 3}
          className={sheetClassName}
        >
          {page.rows && (
            <InvestmentTable data={data} rows={page.rows} startIndex={page.rowStart ?? 0} />
          )}
          {page.attachments && page.attachments.length > 0 && (
            <AttachmentCards groups={page.attachments} />
          )}
        </ReportSheet>
      ))}
    </>
  );
};

export const ApplicationDownloadButton = ({
  data,
  className,
  children,
}: {
  data: ApplicationDownloadData;
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

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        compress: true,
      });

      // 여러 fixed 캡처 DOM을 동시에 두면 브라우저가 겹친 장의 헤더 레이아웃을
      // 생략하는 경우가 있어, 각 A4 장을 하나씩 붙이고 캡처한 뒤 즉시 제거한다.
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
          // 공통 헤더가 같은 PNG를 jsPDF가 같은 이미지로 재사용하지 않도록
          // 페이지별 고유 alias를 지정한다.
          pdf.addImage(pageImage, "JPEG", 0, 0, 210, 297, `application-page-${index}`, "FAST");
        } finally {
          root.remove();
        }
      }

      const dateSuffix = data.generatedOn.replace(/[^0-9.-]/g, "");
      pdf.save(`탄소중립-선도기업-1차-신청서${dateSuffix ? `-${dateSuffix}` : ""}.pdf`);
    } catch (error) {
      console.error("선도기업 1차 신청서 PDF 생성에 실패했습니다.", error);
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
            <ApplicationDownloadSheets data={data} />
          </div>,
          document.body,
        )}
    </>
  );
};

const ApplicationDownloadPreview = ({
  data = APPLICATION_DOWNLOAD_SAMPLE,
}: {
  data?: ApplicationDownloadData;
}) => (
  <div className="flex w-full max-w-316 flex-col items-center gap-6 px-5 py-12 md:gap-8 md:px-7 md:py-14">
    <div className="flex w-full items-center justify-between gap-3">
      <h2 className="text-ink-strong text-lg font-bold md:text-2xl">선도기업 1차 신청서</h2>
      <ApplicationDownloadButton data={data} />
    </div>
    <div className="flex w-full flex-col gap-6 overflow-x-auto pb-2">
      <ApplicationDownloadSheets
        data={data}
        sheetClassName="mx-auto shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_10px_30px_rgba(0,0,0,0.08)]"
      />
    </div>
  </div>
);

export default ApplicationDownloadPreview;
