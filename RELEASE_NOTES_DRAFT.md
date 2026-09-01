# 다음 릴리스 변경사항

- 마이페이지 3개 화면(하위계정 관리 · 회원정보 수정 · 현황조회)과 딸린 모달 6종을 퍼블리싱했다
- 현황조회에 검색·묶음 필터·정렬·묶음별 더보기를 붙였다. 목업을 화면에서 거르는 방식이라 API 를 끼울 자리를 한곳에 모아 두었다
- 설립일자 달력의 연·월 선택을 시스템 셀렉트로 바꾸고 공용 상수로 뺐다. 감축잠재량 산정 · 선도기업 신청 1차 신청서 작성 · 회원정보 수정 세 화면이 같은 규격을 쓴다
- 퍼블리싱 인덱스 마이페이지 묶음에 화면 5행을 추가하고, 보안요청을 보완요청으로 고친 뒤 현황조회 하위 행 순서를 정리했다

## [신규 추가]

### 마이페이지 - 하위계정 관리
- 대상: app/(site)/(content)/my-page/components/sub-account.tsx
  - app/(site)/(content)/my-page/components/sub-account-register-dialog.tsx
  - app/(site)/(content)/my-page/sub-account/page.tsx
  - app/(site)/(content)/my-page/sub-account/register/page.tsx
- 적용: 신규 파일 추가
- 내용: PC 는 표, 768 미만은 카드 목록으로 갈린다. [계정 추가] 모달에서 등록하면 목록 맨 아래에 줄이 붙고 그 줄까지 화면이 따라 내려간다. [삭제] 로 모두 지우면 빈 화면이 나온다
- 주의: 등록 모달의 유효성 검사는 아이디 형식·필수값까지만 본다. 중복 확인은 서버 몫이라 자리만 비워 두었다

### 마이페이지 - 회원정보 수정
- 대상: app/(site)/(content)/my-page/components/profile-edit.tsx
  - app/(site)/(content)/my-page/profile-edit/page.tsx
  - app/(site)/(content)/my-page/profile-edit/company/page.tsx
  - app/(site)/(content)/my-page/profile-edit/cancel-confirm/page.tsx
  - app/(site)/(content)/my-page/profile-edit/save-confirm/page.tsx
- 적용: 신규 파일 추가
- 내용: 기관회원·기업회원을 memberType 프롭 하나로 가른다. 기관회원에만 비밀번호 변경 카드가 붙는다. [취소]·[저장하기] 는 각각 확인 모달을 띄운다
- 주의: 현재 비밀번호 대조는 목업 상수(CURRENT_PASSWORD)로 하고 있다. 실제 검증으로 바꿀 때 이 상수를 걷어내면 된다

### 마이페이지 - 현황조회
- 대상: app/(site)/(content)/my-page/components/status.tsx
  - app/(site)/(content)/my-page/components/supplement-request-dialog.tsx
  - app/(site)/(content)/my-page/status/page.tsx
  - app/(site)/(content)/my-page/status/empty/page.tsx
  - app/(site)/(content)/my-page/status/delete-confirm/page.tsx
  - app/(site)/(content)/my-page/status/supplement-request/page.tsx
  - constants/my-page-status.ts
- 적용: 신규 파일 추가
- 내용: 전문평가·K-택소노미·탄소감축 세 묶음을 각각 다른 색 카드로 그린다. 검색·필터·정렬·묶음별 더보기(4건 단위)가 모두 붙어 있고, 카드 [⋯] 에서 삭제 확인·보완요청 모달로 이어진다
- 주의: API 연계 지점은 두 곳이다. status.tsx 의 matchesKeyword(검색어 판정)와 handleSearch(검색 실행)이며, 서버가 걸러 주게 되면 matchesKeyword 와 파이프라인의 filter 한 줄만 지우면 된다. 응답이 constants/my-page-status.ts 의 StatusGroup[] 모양이기만 하면 정렬·필터·페이징은 그대로 돈다

### 공용 상수·유틸 2종
- 대상: constants/calendar-dropdown.ts
  - util/smooth-scroll-to.ts
- 적용: 신규 파일 추가
- 내용: calendar-dropdown 은 달력 머리를 [◀ 연도 월 ▶] 로 바꾸는 react-day-picker 프롭 묶음이다. smooth-scroll-to 는 rAF 기반 부드러운 스크롤로, prefers-reduced-motion 과 백그라운드 탭을 확인해 즉시 이동으로 물러난다
- 주의: 두 파일 모두 components/ui 원본을 건드리지 않으려고 호출부에서 주입하는 방식으로 만들었다

## [Diff 확인]

### 설립일자 달력에 연·월 셀렉트 적용
- 대상: app/(site)/(content)/carbon-leader/self-check/components/business-card.tsx — 자가진단 STEP 3 감축잠재량 산정
  - app/(site)/(content)/carbon-leader/application-1/components/application-form.tsx — 선도기업 신청 1차 신청서 작성
- 변경: CALENDAR_PROPS 를 펼쳐 넣고, Popover 를 제어 상태로 바꿔 날짜를 고르면 달력이 닫히게 했다. defaultMonth 로 이미 고른 날짜의 달을 먼저 연다
- 결과: 감축잠재량 산정 · 신청서 작성 두 화면이 바뀌고, 새로 만든 회원정보 수정까지 설립일자 달력 3곳이 같은 규격이 된다. 연도를 한 해씩 넘기지 않고 셀렉트로 고를 수 있다
- 주의: Radix Popover 는 안쪽 클릭으로 닫히지 않아 open/onOpenChange 를 직접 쥐어야 한다. 이 파일들의 다른 수정과 겹치므로 통째로 덮지 말 것
- 커밋: [변경사항 보기](https://github.com/fromex-koh/fromex-carbon/commit/e95afaa5eb1d818e1871f4bd725349c0398698d3)

### 서류 제출 - 숨은 파일 입력에 id·name 부여
- 대상: app/(site)/(content)/carbon-leader/application-1/components/document-submit.tsx
- 변경: [첨부파일 선택] 버튼이 클릭을 넘기는 숨은 input 에 id="document-attachment" / name="document-attachment" 를 넣었다
- 결과: 브라우저가 띄우던 "A form field element should have an id or name attribute" 경고가 사라진다. 이 컴포넌트를 1·2·3차 서류 제출 세 화면이 공유하므로 세 곳 모두 반영된다
- 커밋: [변경사항 보기](https://github.com/fromex-koh/fromex-carbon/commit/06bc096c43d4449b19624cc404669bb1b9f8ab01)

### GNB 로그인 메뉴 정렬·글자 크기
- 대상: components/nav-bar.tsx
- 변경: 트리거 글자를 text-base 에서 text-sm 로 낮춰 옆의 회원가입 버튼과 맞추고, 드롭다운을 오른쪽 정렬에서 트리거 가운데 정렬로 바꿨다
- 결과: 로그인 메뉴가 다른 GNB 메뉴와 같은 규칙으로 열린다
- 커밋: [변경사항 보기](https://github.com/fromex-koh/fromex-carbon/commit/f15da7e5a57163bab4a2dcdcbca784c9982bd917)

## [덮어쓰기]

### 퍼블리싱 인덱스 갱신
- 대상: app/page.tsx
- 적용: 지정한 파일만 교체
- 내용: 마이페이지 묶음에 5행을 추가했다(기업회원 · 수정 취소 확인 · 저장 확인 · 내역 없음 · 삭제 확인). 보안요청을 보완요청으로 고치고 현황조회 하위를 보완요청 · 내역 없음 · 삭제 확인 순으로 정렬했다. 마이페이지 12행의 상태를 대기중에서 완료로 올렸다
- 주의: 화면 원본이 아니라 퍼블리싱 인덱스다. 개발에서 손댈 파일이 아니므로 diff 를 볼 것 없이 통째로 덮으면 된다
