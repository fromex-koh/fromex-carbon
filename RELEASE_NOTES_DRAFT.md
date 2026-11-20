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

### 로그인 화면 UI 개선

- 대상: app/(site)/login/components/login-card.tsx
  - app/(site)/login/page.tsx
- 변경: 회원 유형 탭이 세그먼트 구조로 바뀜 — 표시자 1장과 버튼 2개를 grid 로 겹쳐 둔다
  - 비밀번호 보기 토글 추가 (showPassword 상태)
  - 탭 설명줄 · 안내 상자 두 번째 문단 · 브레드크럼 제거
- 결과: globals.css 무수정, 기존 시맨틱 토큰만 써서 다른 화면 영향 없음
  - 모달 연결과 유효성 검사 규칙은 그대로
- 커밋: [변경사항 보기](https://github.com/fromex-koh/fromex-carbon/commit/7ba050c4ad2d7541a4b86aa5748dd7458700e13e)
