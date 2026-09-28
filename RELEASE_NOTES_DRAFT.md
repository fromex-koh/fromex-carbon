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

## [Diff 확인]

### 전역 색상 토큰 추가

- 대상: app/globals.css
- 변경: 시맨틱 토큰 7개 추가
  - primitive 1개 추가 (gray-95-3-c)
  - 네 블록(@theme · :root · .light · .dark) 끝에 신규 구간 주석 표시
- 결과: 기존 토큰 값 변경·삭제 없음
  - 기존 화면 색상 영향 없음
- 커밋: [변경사항 보기](https://github.com/fromex-koh/fromex-carbon/commit/d8ff13ce12cce114872b6656bd9f43624f7f8897)
  - [주석 보강 보기](https://github.com/fromex-koh/fromex-carbon/commit/32fdaecbef2c6926bab672933e119c1e7817b9d3)

## [신규 추가]

### 로그인 화면

- 대상: app/(site)/login/page.tsx
  - app/(site)/login/components/login-card.tsx
- 화면: 기업회원 · 기관회원 탭 로그인 카드
  - 기업회원: [기보 ONE 로그인] 으로 기보 ONE 플랫폼 이동, 복귀 안내 2줄
  - 기관회원: 아이디 · 비밀번호 폼, 두 칸 필수
  - 오류 표시는 기존 규칙 (ring-destructive · text-ink-error)
- 주의: 로그인 API 연동 자리는 TODO 주석으로 비워 둠
  - 배너 없는 화면이라 (content) 아닌 (site) 바로 아래 배치
- 적용: 신규 파일 추가

### 기관회원 가입 안내 팝업

- 대상: app/(site)/login/components/agency-signup-guide-dialog.tsx
  - app/(site)/login/agency-signup-guide/page.tsx
- 화면: 기관회원 탭 [회원가입] 으로 여는 안내 팝업
  - 대상 기관 표 + 계정 발급 5단계
  - 제목 고정, 본문만 스크롤
- 적용: 신규 파일 추가

### 아이디 · 비밀번호 찾기 팝업

- 대상: app/(site)/login/components/find-account-dialog.tsx
  - app/(site)/login/find-account/page.tsx
- 화면: 기관회원 탭 [아이디 · 비밀번호 찾기] 로 여는 연락처 안내
  - 담당자 번호 안내 + [닫기] 버튼 하나
- 적용: 신규 파일 추가

## [덮어쓰기]

### 퍼블리싱 인덱스

- 대상: app/page.tsx
- 변경: 로그인 UIUX 완료 전환, 하위 모달 2행 추가 (3뎁스)
  - 화면 파일 존재 검사 범위를 (site) 바로 아래까지 확대
  - 릴리스 카드 본문·주의를 점 목록으로 표시
  - 총 화면 75 → 77
- 적용: 지정한 파일만 교체
