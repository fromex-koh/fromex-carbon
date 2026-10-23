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

## [신규 추가]

### 선도기업 신청 보완요청 팝업

- 대상: app/(site)/login/components/leader-supplement-notice-dialog.tsx
  - app/(site)/login/leader-supplement-notice/page.tsx
- 화면: 선도기업 신청 건의 보완요청을 알리는 안내
  - [현황조회 이동하기] 로 /my-page/status 이동
- 적용: 신규 파일 추가
- 커밋: [변경사항 보기](https://github.com/fromex-koh/fromex-carbon/commit/3552f628cdd88634ae9a085d7973001f5772af2f)

## [덮어쓰기]

### 퍼블리싱 인덱스

- 대상: app/page.tsx
- 변경: 로그인 아래 선도기업 신청 보완요청 팝업 1행 추가 (3뎁스)
  - 총 화면 77 → 78
- 적용: 지정한 파일만 교체
- 커밋: [변경사항 보기](https://github.com/fromex-koh/fromex-carbon/commit/a72815aed53a6a10349f3556fc4671478fc2e64a)
