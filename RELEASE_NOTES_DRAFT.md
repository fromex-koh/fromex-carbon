# 다음 릴리스 변경사항

<!--
일반 변경사항은 불릿(-)으로 작성하세요.
아래 예시는 형식 안내용 주석이며 실제 릴리즈 내용으로 수집되지 않습니다.
프론트엔드 전달 항목은 ## 구분자, ### 작업명, - 라벨: 내용 순서로 작성하세요.
한 라벨에 여러 줄을 넣으려면 다음 줄을 들여쓴 - 로 이어서 쓰세요(아래 대상 참고).

## [Diff 확인]

### 퍼블리싱 인덱스 표 헤더 고정
- 대상: app/page.tsx
- 변경: 버전 업데이트·인계 자산 표 헤더에 sticky 적용
- 결과: 표를 스크롤해도 헤더가 영역 상단에 남는다
- 커밋: [변경사항 보기](https://github.com/fromex-koh/fromex-carbon/commit/{commit-hash})

## [신규 추가]

### 릴리스 메타데이터 생성기
- 대상: scripts/compute-asset-versions.mjs
  - scripts/git-info.mjs
- 적용: 신규 파일 추가

## [덮어쓰기]

### GNB 메뉴 상수
- 대상: lib/const.ts
- 적용: 지정한 파일만 교체

릴리스 성공 후 내용은 자동으로 비워집니다.
-->

- 선도기업 신청 화면 6종과 자가진단 STEP 1·3 퍼블리싱(STEP 2 인벤토리 배출량은 삭제)
- STEP 2 인벤토리 배출량은 만들었다가 걷어내 이번 전달본에 없다. Scope 설명 팝업(/carbon-leader/self-check/inventory-emission/scope-guide)만 남는다
- 선도기업 공통 배너·팝업을 carbon-leader 로 모으고 섹션 레이아웃·constants·util 로 정리
- GNB 를 신규 IA 기준으로 교체하고 마이페이지를 우측 유틸리티 영역으로 이동
- 색상 토큰에 primitive 계층과 화면 전용 시맨틱을 추가
- 릴리스 노트 전달 카드를 구분별 색으로 나누고 대상 파일·주의 영역 가독성 개선
- 퍼블리싱 인덱스 표에 화면별 최종 반영 버전을 표시
- 전달 범위에 constants·util 폴더 추가

## [신규 추가]

### (content) 라우트 그룹 공통 레이아웃

- 대상: app/(site)/(content)/layout.tsx
- 변경: 배너를 화면 폭 가득 깔고 본문만 가운데로 모으는 래퍼를 그룹 레이아웃으로 한 번만 잡았다
- 결과: 하위 page.tsx 는 배너와 본문만 순서대로 렌더하면 된다
- 적용: 신규 파일 추가

### 선도기업 신청 화면과 신청 플로우 6단계 페이지

- 대상: app/(site)/(content)/carbon-leader/application/
  - constants/carbon-leader-application-step-cards.ts
- 변경: 안내 박스·진행 플로우 바·단계 카드 4장으로 구성된 화면을 만들고, 신청 이력에 따른 6가지 상태를 라우트별 페이지로 나눴다
- 결과: initial · self-check-done · first-done · middle-review · middle-done · final-done 경로에서 상태별 카드(default·progress·complete·disabled)를 확인할 수 있다. 카드 4상태와 버튼 Default·Hover·Active·Disabled 를 라이트·다크 시안 값으로 맞췄다
- 적용: 신규 파일 추가
- 주의: 마지막 최종점검 완료 카드만 다음 단계가 없어 CTA 없이 현황조회만 그린다(hideAction)
- 주의: 카드 상태·날짜는 constants 의 정적 값이다. 신청 이력 API 를 붙일 때는 components/step-cards.tsx 를 async 로 바꾸면 상위 Suspense 가 로딩 화면을 처리한다

### 서브 비주얼 배너

- 대상: public/carbon-leader-illust.svg
  - public/carbon-leader-illust-dark.svg
  - public/carbon-leader-illust-small.svg
  - public/carbon-leader-illust-small-dark.svg
- 변경: 신청·자가진단 화면 상단 배너를 만들고, 일러스트는 next/image 대신 CSS 배경으로 넣어 조건에 맞는 한 장만 내려받게 했다
- 결과: 라이트·다크와 모바일·데스크톱 조합으로 네 장 중 한 장만 요청되고, preload 미사용·LCP 콘솔 경고가 없다
- 결과: 브레드크럼은 모바일부터 노출되며 크기·굵기·간격을 시안에 맞췄다
- 적용: 신규 파일 추가
- 주의: 이 카드의 대상은 배너가 쓰는 일러스트다. 배너 컴포넌트는 carbon-leader/components/sub-visual.tsx 에 있다(선도기업 도메인 공통 컴포넌트 정리 참고)
- 주의: html font-size 가 17px 이라 rem 유틸리티가 1.0625 배로 계산된다. 시안의 16px·8px·12px 은 가장 가까운 Tailwind 스케일(text-base · gap-2 · h-3)로 넣었다

### 자가진단 STEP 1 기업 정보 입력 화면

- 대상: app/(site)/(content)/carbon-leader/self-check/company-info/
  - app/(site)/(content)/carbon-leader/self-check/components/company-info.tsx
  - app/(site)/(content)/carbon-leader/self-check/components/base-info.tsx
  - app/(site)/(content)/carbon-leader/self-check/components/step-mobile-nav.tsx
  - constants/carbon-leader-self-check-steps.ts
- 변경: 업종코드·업력·폐기물/공정배출 여부·3개년 매출액 입력 폼과 유효성 메시지를 만들고, 업종코드 조회 팝업이 열린 상태의 페이지를 하위 경로로 추가했다
- 결과: /carbon-leader/self-check/company-info 와 하위 industry-code-search 경로에서 폼과 팝업을 확인할 수 있다
- 적용: 신규 파일 추가
- 주의: 업종코드 팝업은 기존 공통 다이얼로그를 그대로 쓴다는 것만 표시해 둔 상태다

### 다이얼로그 자동 오픈 훅과 숫자 포맷 함수

- 대상: util/use-dialog-auto-open.ts
  - util/format-number.ts
- 변경: 팝업 전용 라우트로 진입했을 때 다이얼로그를 여는 훅과, 천 단위 쉼표 포맷 함수를 공용으로 뺐다
- 결과: 팝업 라우트 3곳과 금액·배출량 입력이 같은 코드를 쓴다
- 적용: 신규 파일 추가

### 헤더 로그인 상태 확인용 화면

- 대상: app/(site)/preview/header/page.tsx
- 변경: 로그인·로그아웃별 헤더 메뉴 구성만 보는 화면을 만들었다. 본문은 비우고 컨테이너만 헤더와 같은 max-w-[1276px] · px-4 로 맞췄다
- 결과: /preview/header 는 로그아웃, /preview/header?login=true 는 로그인 헤더를 보여준다. 헤더 로고와 본문 좌측 선이 1440·1280·1100·768·375px 에서 모두 일치한다
- 적용: 신규 파일 추가
- 주의: [퍼블리싱 노출용] 확인용 화면이라 IA 화면 개수에 넣지 않았다. 실제 로그인 연동 시 app/(site)/preview 폴더째 삭제하면 된다

### 자가진단 STEP 3 감축잠재량 산정 화면

- 대상: app/(site)/(content)/carbon-leader/self-check/reduction-potential/
  - app/(site)/(content)/carbon-leader/self-check/components/reduction-potential.tsx
  - app/(site)/(content)/carbon-leader/self-check/components/business-card.tsx
  - app/(site)/(content)/carbon-leader/self-check/components/business-detail.tsx
  - constants/carbon-leader-reduction-schema.ts
  - constants/carbon-leader-reduction-methodologies.ts
- 변경: [사업 추가]로 카드를 늘리는 화면을 만들고, 카드 안을 ① 기업 정보 · ② 감축방법론 선택 · ③ 상세 입력 · ④ 결과 네 구간으로 나눴다
- 변경: 시안에 그려진 4케이스(태양광 발전 · 기타(3) · 연료전환(1) · 폐열(B))만 남기고, 방법론별 입력표·데이터 근거·결과표 구성을 데이터로 정의했다
- 결과: /carbon-leader/self-check/reduction-potential 에서 카드 추가·접기·삭제(확인 모달)·방법론 변경(확인 모달)과 네 케이스 화면을 확인할 수 있다
- 결과: 라이트·다크와 PC(1920)·태블릿(768)·모바일(360) 시안을 각각 대조해 간격·글자 크기·굵기를 맞췄다
- 적용: 신규 파일 추가
- 주의: [퍼블리싱 노출용] 값은 계산하지 않는다. ④ 결과·경제성 지표·안내 문구는 케이스별 시안 수치를 스키마에 넣어 그대로 보여준다. 개발에서 산식을 붙일 때 sample* 필드를 실제 계산값으로 바꾸면 된다
- 주의: 폐열(B)는 시안에 그려지지 않은 입력 행이 있어 스키마에 hidden 으로 두었다. 계산을 붙일 때 이 플래그를 풀어야 입력을 받을 수 있다
- 주의: 유효성은 ③ 상세 입력과 데이터 근거까지 필수로 잡혀 있다. [다음으로]를 누르면 미입력 카드가 펼쳐지고 첫 오류 칸으로 포커스가 간다

### 3차 신청용 Scope 설명 페이지

- 대상: app/(site)/(content)/carbon-leader/application-3/
- 변경: 자가진단의 Scope 설명 팝업 화면을 3차 신청 경로에도 만들었다. 배너 문구만 3차 신청용으로 바꾸고 팝업은 공통 컴포넌트를 쓴다
- 결과: /carbon-leader/application-3/inventory-emission/scope-guide 에서 팝업이 열린 상태로 확인된다
- 적용: 신규 파일 추가

### 화면별 반영 버전 스냅샷

- 대상: lib/publishing/screen-versions.generated.json
- 변경: 인계 자산 버전과 같은 형태로, 화면(라우트)별 마지막 반영 릴리스를 담는 생성물을 추가했다
- 결과: 퍼블리싱 인덱스가 이 스냅샷만 읽어 반영 버전을 표시한다. 화면에서 git 을 조회하지 않는다
- 적용: 신규 파일 추가
- 주의: 릴리스 때 자동으로 다시 만들어지는 파일이라 손으로 고치지 않는다. release-note.ts 가 import 하므로 지우면 빌드가 깨진다

### 퍼블리싱 인덱스 화면 키값 복사 배지

- 대상: components/publishing/screen-key-badge.tsx
- 변경: IA 표의 마지막 뎁스 배지를 누르면 그 화면의 고유 키를 클립보드로 복사하고 토스트로 알린다. 상위 메뉴 뎁스는 여러 화면을 대표하므로 버튼으로 만들지 않았다
- 결과: 퍼블리싱 인덱스에서 화면 키를 눈으로 옮겨 적지 않아도 된다
- 적용: 신규 파일 추가
- 주의: [퍼블리싱 노출용] 인덱스 전용 컴포넌트다. 전달본에 함께 들어가지만 서비스 화면에서는 쓰지 않는다
- 커밋: [변경사항 보기](https://github.com/fromex-koh/fromex-carbon/commit/7005bb289d30768e0e3e2ea668eea4ec98d1556f)

## [덮어쓰기]

### GNB 메뉴 상수 교체

- 대상: lib/const.ts
- 변경: menuList 를 신규 IA 기준으로 교체했다. 탄소감축 → 탄소중립 선도기업, K-택소노미 → K-택소노미 적합성평가로 바꾸고 마이페이지 메뉴를 추가했다. 고객지원은 그대로 뒀다
- 변경: 마이페이지에 loginOnly 플래그를 넣었다. nav-bar 가 이 값으로 메뉴를 가린다
- 결과: 헤더에 4개 메뉴가 노출되고 서브메뉴 링크가 IA 경로(/carbon-leader · /k-taxonomy-assessment · /my-page)로 연결된다
- 적용: 지정한 파일만 교체
- 주의: loginOnly 는 [퍼블리싱 노출용] 주석이 달린, 원본에 없던 값이다. 노출 규칙이 정해지면 nav-bar 의 필터와 함께 정리한다

### 색상 토큰 primitive 계층 도입

- 대상: app/globals.css
- 변경: 시맨틱 변수에 직접 박혀 있던 HSL 값을 primitive 로 분리하고 var() 로 참조하게 바꿨다. 값 문자열을 그대로 옮겨 렌더 결과는 달라지지 않는다
- 변경: 선도기업 신청 화면은 기존 토큰을 쓰지 않고, 시안에서 뽑은 전용 시맨틱 23개(--ink-* · --surface-* · --line-* · --brand-*)를 따로 쓴다
- 결과: 기존 토큰 값을 하나도 건드리지 않아 다른 화면 색이 그대로다. 시맨틱 54토큰 × 2모드와 컴파일된 유틸리티 CSS 5,020개 규칙을 전후 대조해 차이 0 을 확인했다
- 적용: 지정한 파일만 교체
- 주의: 신규 primitive·시맨틱은 주석으로 기존과 구분해 두었다. 다른 화면에 쓰기 전에 그 화면 시안을 확인할 것

### 선도기업 도메인 공통 컴포넌트 정리

- 대상: app/(site)/(content)/carbon-leader/components/sub-visual.tsx
  - app/(site)/(content)/carbon-leader/components/scope-guide-dialog.tsx
  - app/(site)/(content)/carbon-leader/self-check/layout.tsx
  - app/(site)/(content)/carbon-leader/application/layout.tsx
  - app/(site)/(content)/carbon-leader/self-check/components/industry-code-dialog.tsx
- 변경: 자가진단·신청 화면이 각자 갖고 있던 배너(carbon-banner · sub-visual)를 carbon-leader/components/sub-visual.tsx 한 벌로 합치고, 높이·문구를 props 로 받게 했다
- 변경: Scope 설명 팝업을 도메인 공통으로 올리고, 업종코드 팝업을 별도 컴포넌트로 분리했다
- 변경: 배너와 metadata 를 섹션 layout.tsx 로 올려 page.tsx 는 본문만 렌더한다
- 결과: 배너를 쓰는 화면 10곳이 같은 컴포넌트를 쓰고, 배너·본문 좌측 라인이 1276px 기준으로 맞는다
- 적용: 지정한 파일만 교체
- 주의: 배너와 Scope 팝업은 carbon-leader/components 아래 한 벌만 둔다. 자가진단·신청 폴더에 같은 배너를 다시 만들지 않는다

### 색상 토큰 추가

- 대상: app/globals.css
- 변경: 시안 값에 맞는 시맨틱 4개를 추가했다. --surface-action(사업 추가 버튼 배경) · --surface-chip · --ink-chip(한계비용 뱃지) · --ink-hint(안내 문구)
- 결과: 사업 추가 버튼이 라이트 #d7e0f3 · 다크 #001331 로, 한계비용 뱃지가 두 모드 모두 #f8f8f8 + #333333 으로 나온다
- 적용: 지정한 파일만 교체
- 주의: 기존 토큰 값은 건드리지 않았다. --surface-chip · --ink-chip · --ink-hint 는 시안이 라이트·다크 같은 값이라 세 블록에 같은 값으로 넣었다

### 선도기업 신청 화면 색상 토큰 적용

- 대상: app/(site)/(content)/carbon-leader/application/components/step-card.tsx
  - app/(site)/(content)/carbon-leader/application/components/application-screen.tsx
  - app/(site)/(content)/carbon-leader/application/components/base-info.tsx
  - app/(site)/(content)/carbon-leader/application/components/process-flow.tsx
  - constants/carbon-leader-application-step-cards.ts
- 변경: 화면에 남아 있던 기존 토큰(ash-* · primary · foreground)을 이번 릴리스에서 만든 시맨틱(ink-* · surface-* · line-* · brand-*)으로 교체했다
- 변경: 단계 카드에 hideAction 을 추가해 마지막 최종점검 완료 카드는 CTA 없이 현황조회만 그린다
- 결과: 라이트·다크 전환 시 카드 4상태(default · progress · complete · disabled)와 진행 플로우 바 색이 시안과 맞는다
- 적용: 지정한 파일만 교체
- 주의: 현재 단계 표시는 primary/80 을 얹어 맞추던 임시 처리를 없애고 --brand-step 토큰으로 바꿨다

### 섹션 레이아웃 도입에 따른 페이지 정리

- 대상: app/(site)/(content)/carbon-leader/application/initial/page.tsx
  - app/(site)/(content)/carbon-leader/application/self-check-done/page.tsx
  - app/(site)/(content)/carbon-leader/application/first-done/page.tsx
  - app/(site)/(content)/carbon-leader/application/middle-review/page.tsx
  - app/(site)/(content)/carbon-leader/application/middle-done/page.tsx
  - app/(site)/(content)/carbon-leader/application/final-done/page.tsx
  - app/(site)/(content)/carbon-leader/self-check/company-info/industry-code-search/page.tsx
  - app/(site)/(content)/carbon-leader/self-check/inventory-emission/scope-guide/page.tsx
- 변경: 각 page.tsx 에 흩어져 있던 metadata 와 배너 import 를 지웠다. 두 값 모두 섹션 layout.tsx 로 올라갔다
- 결과: page.tsx 는 본문 컴포넌트만 렌더한다. 화면 결과는 그대로다
- 적용: 지정한 파일만 교체

### 다이얼로그 자동 오픈 훅 주석 정리

- 대상: util/use-dialog-auto-open.ts
- 변경: 삭제한 인벤토리 항목 선택 라우트를 사용처 주석에서 뺐다
- 결과: 남아 있는 팝업 전용 라우트 3곳만 주석에 남는다
- 적용: 지정한 파일만 교체

## [Diff 확인]

### GNB 드롭다운 위치와 서브메뉴 노출

- 대상: components/nav-bar.tsx
- 변경: 드롭다운 패널을 트리거 기준 가운데로 옮기고, 서브메뉴를 가리던 인덱스 하드코딩 필터를 PC·모바일 2곳에서 제거했다
- 결과: 패널이 각 메뉴 아래 가운데에 뜨고 menuList 의 서브메뉴가 모두 노출된다
- 주의: 위치는 shadcn 원본(components/ui/navigation-menu.tsx)의 right-0 을 className 으로 덮어썼다. 원본 파일은 건드리지 않았다
- 주의: 제거한 필터는 두 번째 메뉴의 3·4번째 항목을 숨기는 코드였다. 새 메뉴 구조에서는 K-택소노미의 전문평가가 항상 가려졌다
- 커밋: [변경사항 보기](https://github.com/fromex-koh/fromex-carbon/commit/6676beb9a6fd97e32eece93e6a8c13841c06eaaa)

### GNB 로그인 상태 전환과 로고 축소 대응

- 대상: components/nav-bar.tsx
- 변경: ?login=true 로 로그인 헤더를 볼 수 있게 분기를 넣고, loginOnly 메뉴를 로그아웃 상태에서 가린다. 로그인 로직은 타지 않는다
- 변경: 헤더 우측 현황조회 버튼을 PC·모바일에서 뺐다. 마이페이지 서브메뉴에 이미 있어 중복이다
- 변경: 로고에 shrink-0 을 주고 메뉴 간격을 줄였으며, PC·모바일 전환 폭을 910px 에서 1080px 로 올렸다
- 결과: 로그아웃은 탄소중립 선도기업 · K-택소노미 적합성평가 · 고객지원 + 회원가입 · 로그인, 로그인은 여기에 마이페이지가 붙고 로그아웃 버튼으로 바뀐다
- 결과: 1024px 안팎에서 로고가 240px 에서 81px 로 눌리던 현상이 없어졌다. 1440~375px 전 구간에서 로고 폭이 고정되고 가로 스크롤도 없다
- 주의: ?login=true 분기와 loginOnly 필터에는 [퍼블리싱 노출용] 주석을 달아 뒀다. 실제 세션이 붙으면 searchParams 조건만 지우면 원본 동작으로 돌아간다
- 주의: 모바일 메뉴는 activeMenuIndex 가 원본 배열 인덱스를 쓰기 때문에, 가릴 항목을 걸러내지 않고 null 로 렌더한다
- 커밋: [변경사항 보기](https://github.com/fromex-koh/fromex-carbon/commit/1a9a8d4302a0105baa219b269bcd8ab1349059ac)

### 헤더 마이페이지 위치 이동

- 대상: components/nav-bar.tsx
  - lib/const.ts
- 변경: 마이페이지를 menuList 에서 빼고 myPageMenu 로 분리해, PC 는 우측 유틸리티 영역(회원가입 자리)에서 hover 드롭다운으로, 모바일·태블릿은 패널 탭 목록 안에서 열리게 했다
- 결과: 로그인 상태에서 상단 우측에 마이페이지 · 로그아웃이 뜨고, 하위 3개(하위계정 관리 · 회원정보 수정 · 현황조회)가 드롭다운으로 열린다
- 주의: 드롭다운 위치는 shadcn 원본을 건드리지 않고 className 으로 우측 정렬만 덮었다
- 커밋: [변경사항 보기](https://github.com/fromex-koh/fromex-carbon/commit/1a9a8d4302a0105baa219b269bcd8ab1349059ac)

### 푸터 아래 빈 공간 제거

- 대상: app/layout.tsx
- 변경: main 을 min-h-dvh flex 로 잡고 푸터에 mt-auto 를 줬다
- 결과: 본문이 짧은 화면(팝업 전용 라우트 등)에서도 푸터가 화면 아래에 붙는다
- 커밋: [변경사항 보기](https://github.com/fromex-koh/fromex-carbon/commit/691922f87149b0fdb32683244c4b84e1d68355cd)

### 자가진단 STEP 1 화면 정리

- 대상: app/(site)/(content)/carbon-leader/self-check/components/company-info.tsx
  - app/(site)/(content)/carbon-leader/self-check/components/base-info.tsx
  - app/(site)/(content)/carbon-leader/self-check/components/step-mobile-nav.tsx
- 변경: 직전 3개년 매출액 섹션을 시안대로 고치고(안내 문구를 입력 3개 묶음 아래로), 업력 placeholder 를 10 으로 바꿨다
- 변경: 모바일 스텝퍼 제목 글자를 시안(16px)에 맞췄다
- 결과: /carbon-leader/self-check/company-info 의 매출액 영역 간격·문구 위치가 시안과 같아진다
- 커밋: [변경사항 보기](https://github.com/fromex-koh/fromex-carbon/commit/2492e900dcd4d9a29cfddf49e46f872f80c0692a)

### 퍼블리싱 인덱스 IA V1.3 반영

- 대상: app/page.tsx
- 변경: IA 문서 V1.3 기준으로 화면 목록을 다시 만들고, 메뉴명·경로·화면 Type 을 문서와 1:1로 맞췄다
- 변경: 수정필요 칼럼을 비고로 바꾸고, 디자인≠개발 · 개발확인필요 뱃지를 추가했다
- 변경: 로그인 여부별 헤더 구성을 HEADER_STATE_ROWS 로 분리해 화면 개수 집계에서 뺐다
- 결과: 목록에서 신규·유지·삭제 화면과 디자인·개발 확인이 필요한 행을 뱃지로 구분할 수 있다
- 주의: [퍼블리싱 노출용] HEADER_STATE_ROWS 는 확인용 화면 표라 IA 화면 수에 넣지 않는다
- 커밋: [변경사항 보기](https://github.com/fromex-koh/fromex-carbon/commit/980c2671f0c4ac26c2e0add002404e66066461d7)

### 퍼블리싱 인덱스 반영 버전 표시

- 대상: lib/publishing/release-note.ts
  - app/page.tsx
- 변경: 인계 자산의 findAssetVersion 과 짝이 되는 findScreenVersion(경로) 을 추가했다
- 변경: IA 표가 이 값을 읽어, 이번 릴리스에 나간 화면의 행에 강조색을 깔고 버전 배지를 채운다. 인계 자산 표와 같은 규칙이다
- 변경: IA_ROWS 58행에 손으로 적던 version 필드를 지웠다. 반영 버전의 출처를 생성물 한 곳으로 모은다
- 결과: 릴리스마다 행을 고칠 필요가 없고, 두 표가 같은 방식으로 이번 릴리스 항목을 보여준다
- 주의: 생성물에 없는 경로는 '미배포'로 표시된다
- 주의: 화면은 라우트 폴더·상위 layout.tsx·상위 components 를 함께 본다. 공통 컴포넌트를 고치면 그것을 쓰는 화면들의 반영 버전이 함께 올라가며, 실제로 함께 바뀌므로 의도한 동작이다
- 커밋: [변경사항 보기](https://github.com/fromex-koh/fromex-carbon/commit/5e2e4f1d04191d05caf3fb12b7ae045b374d8e81)

### 릴리스 노트 전달 카드와 버전 헤더

- 대상: app/page.tsx
- 변경: 카드 면색과 좌측 띠를 배지 계열로 나눴다. Diff 확인은 파랑, 덮어쓰기는 보라, 신규 추가는 초록이며, 좌측 띠는 항상 깔고 면색은 최신 릴리스 카드에만 얹는다
- 변경: 대상 파일 패널을 흰색으로, 주의 콜아웃을 흰색에 가까운 노랑으로 고정했다. 카드 면색이 구분별로 달라지면서 기존 회색·하늘색으로는 묻혔다
- 변경: 커밋 링크를 Diff 배지와 같은 파랑을 채운 버튼으로 바꿨다
- 변경: 버전 헤더에 Diff 확인·덮어쓰기·신규 추가 건수를 카드와 같은 색 배지로 붙였다. 건수가 0인 구분은 그리지 않는다
- 결과: 배지를 읽기 전에 색으로 카드 종류가 구분되고, 두 패널과 커밋 링크가 세 가지 카드 위에서 모두 같게 읽힌다
- 결과: 헤더가 스크롤에 붙어 있어 카드를 세지 않아도, 접힌 이전 릴리스를 펼치지 않아도 구성이 보인다
- 주의: 두 패널은 테마와 무관하게 밝은 색을 쓴다. 다크 모드에서도 흰색·연노랑 그대로다
- 커밋: [변경사항 보기](https://github.com/fromex-koh/fromex-carbon/commit/c38764bb4535d17a6806db71d8ac08b7a124bd9e)

### 전달 범위에 constants·util 추가

- 대상: lib/publishing/handoff-assets.json
- 변경: 인계 자산 목록에 constants·util 폴더를 넣고, 퍼블리싱 인덱스 전용인 components/publishing 을 화면 원본이 아님으로 표시했다
- 결과: 이번 전달본부터 constants(화면 데이터 상수)와 util(공용 훅·포맷 함수) 폴더가 함께 전달된다
- 결과: 전달 스크립트와 인계 자산 표가 같은 파일을 읽어 전달 범위와 화면 표기가 어긋나지 않는다
- 주의: v0.0.1 전달본에는 두 폴더가 없었다. 이번 전달본부터 화면이 이 경로를 참조하므로 통째로 받아야 한다
- 커밋: [변경사항 보기](https://github.com/fromex-koh/fromex-carbon/commit/acc4c7e1cbe5715c6e8addeb47a3a3285e16e8d6)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/fromex-carbon/commit/7005bb289d30768e0e3e2ea668eea4ec98d1556f)
