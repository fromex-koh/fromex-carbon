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

- 탄소중립 선도기업 신청 화면과 자가진단 STEP 1·2 화면 퍼블리싱
- 본문 폰트를 Pretendard Variable 로 교체
- 화면 데이터는 constants, 공용 훅·함수는 util 로 분리하고 import 를 @/ 절대 경로로 통일
- GNB 헤더 메뉴를 신규 IA 기준으로 교체하고 드롭다운 위치·서브메뉴 노출 정리

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
- 결과: initial · self-check-done · first-done · middle-review · middle-done · final-done 경로에서 상태별 카드(default·progress·complete·disabled)를 확인할 수 있다
- 적용: 신규 파일 추가
- 주의: 카드 상태·날짜는 constants 의 정적 값이다. 신청 이력 API 를 붙일 때는 components/step-cards.tsx 를 async 로 바꾸면 상위 Suspense 가 로딩 화면을 처리한다

### 자가진단 STEP 1 기업 정보 입력 화면

- 대상: app/(site)/(content)/carbon-leader/self-check/company-info/
  - app/(site)/(content)/carbon-leader/self-check/components/company-info.tsx
  - app/(site)/(content)/carbon-leader/self-check/components/base-info.tsx
  - app/(site)/(content)/carbon-leader/self-check/components/step-nav.tsx
  - app/(site)/(content)/carbon-leader/self-check/components/step-mobile-nav.tsx
  - constants/carbon-leader-self-check-steps.ts
- 변경: 업종코드·업력·폐기물/공정배출 여부·3개년 매출액 입력 폼과 유효성 메시지를 만들고, 업종코드 조회 팝업이 열린 상태의 페이지를 하위 경로로 추가했다
- 결과: /carbon-leader/self-check/company-info 와 하위 industry-code-search 경로에서 폼과 팝업을 확인할 수 있다
- 적용: 신규 파일 추가
- 주의: 업종코드 팝업은 기존 공통 다이얼로그를 그대로 쓴다는 것만 표시해 둔 상태다

### 자가진단 STEP 2 인벤토리 배출량 산정 화면

- 대상: app/(site)/(content)/carbon-leader/self-check/inventory-emission/
  - app/(site)/(content)/carbon-leader/self-check/components/inventory-emission.tsx
  - app/(site)/(content)/carbon-leader/self-check/components/item-select-dialog.tsx
  - app/(site)/(content)/carbon-leader/self-check/components/item-select-pagination.tsx
  - app/(site)/(content)/carbon-leader/self-check/components/scope-guide-dialog.tsx
  - constants/carbon-leader-self-check-emission-items.ts
- 변경: 항목 미선택 빈 상태 화면과 인벤토리 항목 선택 모달(Scope·대분류·중분류 3뎁스 트리, 검색, 5건 페이징), Scope 설명 다이얼로그를 만들었다
- 결과: item-select · scope-guide 경로로 각 모달이 열린 화면을 볼 수 있고, 모달을 다시 열면 이전에 고른 항목이 복원된다
- 적용: 신규 파일 추가
- 주의: 분류·항목 373건은 화면 확인용 정적 데이터다. 실제로는 API 응답으로 대체된다

### 인벤토리 선택 항목별 값 입력 화면

- 대상: app/(site)/(content)/carbon-leader/self-check/components/emission-input.tsx
- 변경: 모달에서 고른 항목마다 연도별 입력 필드를 만들고, 하폐수는 세부 입력표를, 하단에는 온실가스 총배출량 패널을 붙였다. 입력값은 폼으로 묶여 천 단위 쉼표가 적용된다
- 결과: 항목을 선택하면 빈 상태 카드가 값 입력 카드로 바뀌고, 필수 대분류를 고르지 않으면 안내 줄이 노출된다
- 적용: 신규 파일 추가
- 주의: 단위·총배출량은 화면 확인용 예시값이다. 실제 산정식은 입력값 × 배출계수이며 Scope 1 + Scope 2 만 합산한다

### 서브 비주얼 배너

- 대상: app/(site)/(content)/carbon-leader/application/components/sub-visual.tsx
  - app/(site)/(content)/carbon-leader/self-check/components/carbon-banner.tsx
  - public/carbon-leader-illust.svg
  - public/carbon-leader-illust-dark.svg
  - public/carbon-leader-illust-small.svg
  - public/carbon-leader-illust-small-dark.svg
- 변경: 신청·자가진단 화면 상단 배너를 만들고, 일러스트는 next/image 대신 CSS 배경으로 넣어 조건에 맞는 한 장만 내려받게 했다
- 결과: 라이트·다크와 모바일·데스크톱 조합으로 네 장 중 한 장만 요청되고, preload 미사용·LCP 콘솔 경고가 없다
- 적용: 신규 파일 추가

### 다이얼로그 자동 오픈 훅과 숫자 포맷 함수

- 대상: util/use-dialog-auto-open.ts
  - util/format-number.ts
- 변경: 팝업 전용 라우트로 진입했을 때 다이얼로그를 여는 훅과, 천 단위 쉼표 포맷 함수를 공용으로 뺐다
- 결과: 팝업 라우트 3곳과 금액·배출량 입력이 같은 코드를 쓴다
- 적용: 신규 파일 추가

## [덮어쓰기]

### GNB 메뉴 상수 교체

- 대상: lib/const.ts
- 변경: menuList 를 신규 IA 기준으로 교체했다. 탄소감축 → 탄소중립 선도기업, K-택소노미 → K-택소노미 적합성평가로 바꾸고 마이페이지 메뉴를 추가했다. 고객지원은 그대로 뒀다
- 결과: 헤더에 4개 메뉴가 노출되고 서브메뉴 링크가 IA 경로(/carbon-leader · /k-taxonomy-assessment · /my-page)로 연결된다
- 적용: 지정한 파일만 교체
- 주의: 로그인 상태에 따른 노출 제어는 넣지 않았다. IA 표에는 마이페이지와 전문평가가 로그인 시에만 노출로 적혀 있다

### 본문 폰트 Pretendard Variable 교체

- 대상: app/layout.tsx
  - app/(font)/PretendardVariable.woff2
  - app/(font)/LICENSE-PRETENDARD.txt
- 변경: PretendardGOVVariable 대신 Pretendard Variable 을 로드하고 weight 범위를 100 900 으로 맞췄다
- 결과: 전 화면 본문 서체가 Pretendard 로 표시된다
- 적용: 지정한 파일만 교체
- 주의: 기존 app/(font)/PretendardGOVVariable.woff2 는 삭제한다

## [Diff 확인]

### GNB 드롭다운 위치와 서브메뉴 노출

- 대상: components/nav-bar.tsx
- 변경: 드롭다운 패널을 트리거 기준 가운데로 옮기고, 서브메뉴를 가리던 인덱스 하드코딩 필터를 PC·모바일 2곳에서 제거했다
- 결과: 패널이 각 메뉴 아래 가운데에 뜨고 menuList 의 서브메뉴가 모두 노출된다
- 주의: 위치는 shadcn 원본(components/ui/navigation-menu.tsx)의 right-0 을 className 으로 덮어썼다. 원본 파일은 건드리지 않았다
- 주의: 제거한 필터는 두 번째 메뉴의 3·4번째 항목을 숨기는 코드였다. 새 메뉴 구조에서는 K-택소노미의 전문평가가 항상 가려졌다. 로그인 상태별 노출은 프론트엔드에서 처리한다
- 커밋: [변경사항 보기](https://github.com/fromex-koh/fromex-carbon/commit/6676beb9a6fd97e32eece93e6a8c13841c06eaaa)
