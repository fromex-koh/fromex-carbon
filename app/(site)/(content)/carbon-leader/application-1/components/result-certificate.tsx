"use client";

import { Button } from "@/components/ui/button";
import { LoaderCircle, Printer } from "lucide-react";
import { useRef, useState } from "react";
import { createPortal, flushSync } from "react-dom";
import { toast } from "sonner";
import { notoSerifKr } from "@/app/(font)/fonts";
import { CERTIFICATE_SAMPLE, type CertificateData } from "@/constants/carbon-leader-certificate";
import { cn } from "@/lib/utils";

/*
 * 선도기업 결과 확인서. 화면에 종이 한 장을 그대로 그리고, 그 종이를 PDF 로 내려받는다.
 *
 * [프론트 개발 안내]
 * 1. 값은 data prop 하나로만 들어온다. 서버 응답을 CertificateData 모양으로 맞춰 넘기면 끝이다.
 * 2. 치수는 전부 pt 다. 시안이 A4 를 72dpi(598×842)로 그려 시안의 px 값이 곧 pt 라
 *    숫자를 그대로 옮겼고, 인쇄하면 A4(595.28×841.89pt)에 1:1 로 앉는다.
 * 3. 실제 화면에서는 CertificateDownloadButton 에 data 만 넘긴다. 버튼을 누르면 확인서가
 *    화면 밖의 전용 영역에 잠시 렌더링되고 인쇄창 없이 PDF 파일로 바로 내려받아진다.
 * 4. Noto Serif KR 파일을 next/font/local 로 프로젝트에 내장하므로 화면과 인쇄/PDF가
 *    로컬 OS의 폰트 설치 여부와 관계없이 같은 글꼴을 사용한다.
 */

/**
 * 이름표 · 콜론 · 값 한 줄.
 * 시안은 두 글자(주소)든 네 글자(인증단계)든 이름표를 같은 폭에 양끝으로 벌려 놓는다.
 * CSS 양끝 정렬은 한글처럼 띄어쓰기가 없는 낱말을 벌리지 못해, 글자를 하나씩 놓고 사이를 벌린다.
 */
const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex items-start gap-[12pt]">
    <span
      className={cn(
        "flex h-[23pt] shrink-0 items-center",
        label.length <= 3 ? "w-[64pt] justify-between" : "justify-center",
      )}
      aria-label={label}
    >
      {[...label].map((letter, index) => (
        <span key={`${letter}-${index}`} aria-hidden="true">
          {letter}
        </span>
      ))}
    </span>
    <span className="shrink-0">:</span>
    <span className="min-w-0 flex-1">{children}</span>
  </div>
);

/**
 * 확인서 종이 한 장. 이 컴포넌트만 따로 가져다 캡처하거나 인쇄해도 된다.
 * 바깥 여백·그림자는 화면에서만 쓰고 인쇄에는 나가지 않는다.
 */
export const CertificateSheet = ({
  data = CERTIFICATE_SAMPLE,
  className,
}: {
  data?: CertificateData;
  className?: string;
}) => {
  const { issuedOn } = data;

  return (
    <div
      className={cn(
        // Figma 원본 598×842. 인쇄할 때는 globals.css 에서 정확한 A4 폭으로 맞춘다.
        "certificate-sheet flex h-[842pt] w-[598pt] shrink-0 flex-col bg-white p-[20pt] text-[#111]",
        notoSerifKr.className,
        className,
      )}
    >
      {/* Figma: 2pt 테두리, 상 32 · 좌우 36 · 하 60 패딩 */}
      <div className="flex flex-1 flex-col justify-between rounded-[6pt] border-[2pt] border-[#111] px-[36pt] pt-[32pt] pb-[60pt]">
        {/* 상단 내용은 Figma의 60pt 세로 간격 그룹을 그대로 따른다. */}
        <div className="flex flex-col gap-[60pt]">
          <div className="flex flex-col gap-[32pt]">
            <p className="text-[16pt] leading-[23pt] font-semibold">{data.documentNo}</p>

            <h1 className="text-center text-[32pt] leading-[46pt] font-bold">{data.title}</h1>

            {/* Figma 정보 영역은 좌우 모두 28pt 안쪽으로 들어간다. */}
            <dl className="flex flex-col gap-[8pt] px-[28pt] text-[16pt] leading-[23pt] font-medium">
              <Row label="업체명">{data.company}</Row>
              <Row label="대표자">{data.ceo}</Row>
              <Row label="주소">{data.address}</Row>
              <Row label="인증단계">{data.stage}</Row>
              <Row label="유효기간">
                {data.validFrom} ~ {data.validTo}
              </Row>
            </dl>
          </div>

          {/* Figma의 첫 줄 들여쓰기 32pt와 40pt 줄높이 */}
          <p className="indent-[32pt] text-[24pt] leading-[40pt] font-medium">{data.body}</p>

          {/* 연·월·일은 각각 분리하고 Figma처럼 20pt 간격과 좌우 28pt 여백을 둔다. */}
          <p className="flex justify-end gap-[20pt] px-[28pt] text-right text-[20pt] leading-[29pt] font-medium">
            <span>{issuedOn.year}년</span>
            <span>{issuedOn.month}월</span>
            <span>{issuedOn.day}일</span>
          </p>
        </div>

        {/* 기관명은 하단 60pt 위치에 고정하고 글자 사이를 9.6pt 벌린다. */}
        <p className="text-center text-[32pt] leading-[50pt] font-semibold tracking-[9.6pt]">
          {data.issuer}
        </p>
      </div>
    </div>
  );
};

/**
 * 실제 서비스 화면에서 사용하는 다운로드 버튼.
 * 화면에는 버튼만 보이고, 다운로드할 때만 data가 채워진 확인서 한 장을 body 아래에 렌더링한다.
 */
export const CertificateDownloadButton = ({
  data,
  className,
  children,
  disabled = false,
}: {
  data: CertificateData;
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const exportRootRef = useRef<HTMLDivElement>(null);

  const downloadCertificate = async () => {
    if (isGenerating || disabled) return;
    flushSync(() => setIsGenerating(true));

    try {
      const exportRoot = exportRootRef.current;
      const sheet = exportRoot?.querySelector<HTMLElement>(".certificate-sheet");
      if (!sheet) throw new Error("Certificate sheet was not created.");

      await document.fonts.ready;
      await new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      );

      const [{ toPng }, { jsPDF }] = await Promise.all([import("html-to-image"), import("jspdf")]);
      const pageImage = await toPng(sheet, {
        backgroundColor: "#fff",
        cacheBust: true,
        pixelRatio: 2,
      });
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        compress: true,
      });
      pdf.addImage(pageImage, "PNG", 0, 0, 210, 297, undefined, "FAST");
      pdf.save(`${data.title.replaceAll(" ", "-")}.pdf`);
    } catch (error) {
      console.error("선도기업 결과 확인서 PDF 생성에 실패했습니다.", error);
      toast.error("PDF 파일을 만들지 못했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <Button
        type="button"
        onClick={downloadCertificate}
        disabled={disabled || isGenerating}
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
              PDF 로 저장
            </>
          ))
        )}
      </Button>

      {isGenerating &&
        createPortal(
          <div
            ref={exportRootRef}
            className="application-download-single-sheet-export-root"
            aria-hidden="true"
          >
            <CertificateSheet data={data} />
          </div>,
          document.body,
        )}
    </>
  );
};

/** 확인서 한 장과 내려받기 버튼만 있는 화면 */
const ResultCertificate = ({ data = CERTIFICATE_SAMPLE }: { data?: CertificateData }) => {
  return (
    <div className="certificate-page flex w-full max-w-316 flex-col items-center gap-6 px-5 py-12 md:gap-8 md:px-7 md:py-14">
      <div className="flex w-full items-center justify-between gap-3" data-print-hide>
        <h2 className="text-ink-strong text-lg font-bold md:text-2xl">결과 확인서</h2>
        <CertificateDownloadButton data={data} />
      </div>

      {/* 종이가 화면보다 넓은 구간에서는 좌우로 밀어 본다 */}
      <div className="w-full overflow-x-auto">
        <CertificateSheet
          data={data}
          className="mx-auto shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_10px_30px_rgba(0,0,0,0.08)]"
        />
      </div>
    </div>
  );
};

export default ResultCertificate;
