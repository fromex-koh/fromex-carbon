# 다음 릴리스 변경사항

## [신규 추가]

### 문서용 명조 폰트 내장
- 대상: app/(font)/fonts.ts
  - app/(font)/NotoSerifKR-Variable.ttf
  - app/(font)/NotoSerifKR-OFL.txt
- 화면: 확인서처럼 명조가 필요한 문서에 쓰는 Noto Serif KR 을 next/font/local 로 묶었다
  - 보는 사람 PC 에 글꼴이 깔려 있는지와 무관하게 화면·인쇄·PDF 가 같은 글꼴로 나온다
- 적용: 신규 파일 추가

### 결과 확인서 PDF 템플릿 (1·2·3차 공통)
- 대상: app/(site)/(content)/carbon-leader/application-1/components/result-certificate.tsx
  - constants/carbon-leader-certificate.ts
  - app/(site)/(content)/carbon-leader/application-1/result/result-certificate/page.tsx
  - app/(site)/(content)/carbon-leader/application-2/result/result-certificate/page.tsx
  - app/(site)/(content)/carbon-leader/application-3/result/result-certificate/page.tsx
- 화면: A4 한 장짜리 확인서. 문서번호·제목·업체명·대표자·주소·인증단계·유효기간·본문·발급일·발급기관이 모두 값이라 CertificateData 하나만 넘기면 된다
  - 치수는 전부 pt 다. 시안이 A4 를 72dpi 로 그려 시안의 px 값이 곧 pt 이고, 인쇄하면 A4 에 1:1 로 앉는다
  - CertificateDownloadButton 을 화면에 놓으면 인쇄창 없이 PDF 파일로 바로 내려받는다(html-to-image + jspdf)
  - 2·3차 페이지는 같은 템플릿에 회차별 예시 상수만 갈아 끼운다
- 적용: 신규 파일 추가

### 자가진단 결과보고서 PDF 템플릿
- 대상: app/(site)/(content)/carbon-leader/self-check/components/result-certificate.tsx
  - constants/carbon-leader-self-check-report.ts
  - app/(site)/(content)/carbon-leader/self-check/result/result-certificate/page.tsx
- 화면: A4 두 쪽짜리 결과보고서. 값은 SelfCheckReportData 하나로 받는다
  - 감축사업 표는 배열을 그리므로 사업 수에 맞춰 행이 늘고 준다
  - SelfCheckReportDownloadButton 만 놓으면 데이터 양에 맞는 쪽수를 만들어 PDF 로 내려받는다
  - 시안대로 본문 글꼴은 내장 Pretendard 를 쓴다
- 적용: 신규 파일 추가

### 1차 신청서 PDF 템플릿
- 대상: app/(site)/(content)/carbon-leader/application-1/components/application-download.tsx
  - constants/carbon-leader-application-download.ts
  - app/(site)/(content)/carbon-leader/application-1/result/application-download/page.tsx
- 화면: 신청서 출력물 골격(ReportSheet · ReportCard · 머리글)과 1차 본문을 담았다. 2·3차도 이 골격을 가져다 쓴다
  - 투자계획·첨부서류 배열 길이에 따라 표의 행과 A4 쪽수가 저절로 늘고 준다
  - ApplicationDownloadButton 하나로 인쇄창 없이 PDF 파일이 내려받아진다
  - result/application-download 는 퍼블리싱 확인용 미리보기 화면이라 실제 서비스에는 버튼만 놓으면 된다
- 적용: 신규 파일 추가

### 2차 신청서 PDF 템플릿
- 대상: app/(site)/(content)/carbon-leader/application-2/components/application-download.tsx
  - constants/carbon-leader-application-2-download.ts
  - app/(site)/(content)/carbon-leader/application-2/result/application-download/page.tsx
- 화면: 1차 골격을 그대로 쓰고 2차 본문(감축기술 도입현황 · 중간점검 첨부)만 얹었다
  - 도입현황 표와 첨부 쪽을 만드는 함수를 따로 빼 3차에서도 같이 쓴다
- 적용: 신규 파일 추가

### 3차 신청서 PDF 템플릿
- 대상: app/(site)/(content)/carbon-leader/application-3/components/application-download.tsx
  - constants/carbon-leader-application-3-download.ts
  - app/(site)/(content)/carbon-leader/application-3/result/application-download/page.tsx
- 화면: 1·2차 골격을 재사용하고 3차 본문(목표달성 평가)을 더했다
  - 평가기준 값에 따라 절대배출량·원단위 등 케이스별 표가 갈린다
- 적용: 신규 파일 추가

## [Diff 확인]

### 신청 결과 화면 출력물 받기 연결
- 대상: app/(site)/(content)/carbon-leader/application-1/components/submit-done.tsx
- 변경: [출력물 받기] 를 링크에서 회차별 신청서 PDF 다운로드 버튼으로 바꿨다(1·2·3차 각각)
  - 결과 확인서 링크도 회차에 맞는 경로로 갈라 준다
  - 회차별 PDF 값을 넣을 자리를 prop 세 개로 열어 두었다. 비우면 퍼블리싱 예시 값을 쓴다
  - 버튼 모양·반응형 배치는 기존 시안 그대로 두었다
- 결과: 1·2·3차 결과 화면에서 신청서와 확인서를 각각 내려받는다
- 커밋: [변경사항 보기](https://github.com/fromex-koh/fromex-carbon/commit/5f87298aabe0709db1c96634c8d314b5e55b6f4f)

### 3차 최종확인 화면 출력물·목표달성 평가 정리
- 대상: app/(site)/(content)/carbon-leader/application-3/components/final-confirm.tsx
- 변경: 출력물 받기를 3차 신청서 PDF 다운로드 버튼으로 연결했다
  - 목표달성 평가 요약(평가기준 · 기준연도 평균 배출량 · 최종년도 실적 · 감축률 · 목표감축률 · 평가결과)을 카드로 정리했다
  - 첨부 서류 예시를 최종점검 목록에 맞춰 손봤다
- 결과: 3차 최종확인에서 평가 결과를 한눈에 보고 신청서를 내려받는다
- 커밋: [변경사항 보기](https://github.com/fromex-koh/fromex-carbon/commit/184451183958870cabfb0620523fb365f4eae20a)

### 자가진단 결과 화면 출력물 받기 연결
- 대상: app/(site)/(content)/carbon-leader/self-check/components/result.tsx
  - app/(site)/(content)/carbon-leader/self-check/result/page.tsx
  - app/(site)/(content)/carbon-leader/self-check/result/done/page.tsx
  - app/(site)/(content)/carbon-leader/self-check/result/unfit/page.tsx
- 변경: 결과보고서 PDF 값을 넣을 reportData prop 을 열고 [출력물 받기] 를 다운로드 버튼으로 바꿨다
  - 값을 안 넘기면 화면의 적정·부적정 판정과 어긋나지 않게 예시 값을 맞춰 쓴다
  - 세 라우트에 API 연계 예시를 한 줄씩 주석으로 남겼다
- 결과: 자가진단 결과 화면에서 판정에 맞는 결과보고서를 내려받는다
- 커밋: [변경사항 보기](https://github.com/fromex-koh/fromex-carbon/commit/6195e67a81e46a75955d7f3538aacf1508456f06)

### 마이페이지 신청현황 다운로드 연결
- 대상: app/(site)/(content)/my-page/components/status.tsx
  - constants/my-page-status.ts
- 변경: 행마다 어떤 출력물인지 downloadKind 로 지정하게 했다(확인서 1·2·3차 · 자가진단 결과보고서)
  - 목록의 내려받기 버튼이 그 값에 맞는 PDF 템플릿을 부른다
- 결과: 신청현황에서 회차별 확인서와 자가진단 결과보고서를 바로 내려받는다
- 커밋: [변경사항 보기](https://github.com/fromex-koh/fromex-carbon/commit/c5361237827318b098935971062348926c0e365c)

### PDF 만들 때 쓰는 전역 스타일
- 대상: app/globals.css
- 변경: 화면 밖에서 종이를 그렸다 지우는 캡처 영역 세 가지를 추가했다(확인서 · 자가진단 보고서 · 신청서)
  - 여러 장짜리 출력물은 한 장씩 같은 자리에 복제해 둘째 장부터 머리글이 잘리지 않게 한다
  - 확인서 인쇄용 @page 규칙(A4 · 여백 0)을 함께 넣었다
- 결과: 화면에는 아무것도 비치지 않고 PDF 만 만들어진다
- 커밋: [변경사항 보기](https://github.com/fromex-koh/fromex-carbon/commit/13c89c671551745c4d23093ac077fdbd3d4d15fd)

## [덮어쓰기]

### 퍼블리싱 인덱스
- 대상: app/page.tsx
- 변경: 출력물 항목 이름을 신청서(template) · 결과확인서(template) 로 통일하고, 자가진단만 결과보고서(template) 로 적었다
  - 이 항목 7건의 타입을 Link 에서 Download 로 바꿨다
  - 확인서 3건의 '미정' 배지를 떼고, 쓰는 행이 없어진 배지 정의도 함께 걷어냈다
  - 이번에 화면이 나온 항목의 상태·UIUX 를 완료로 표시했다
- 적용: 지정한 파일만 교체

릴리스 성공 후 내용은 자동으로 비워집니다.
