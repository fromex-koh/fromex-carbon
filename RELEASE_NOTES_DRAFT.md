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

- 퍼블리싱 인덱스 IA 표에 화면 키값 복사 기능 추가

## [신규 추가]

### 화면 키 복사 배지

- 대상: components/publishing/screen-key-badge.tsx
- 변경: 뎁스 배지를 버튼으로 만들어 클릭 시 화면 키값을 클립보드에 복사하고 토스트를 띄운다
- 결과: IA 표의 마지막 뎁스 배지를 누르면 carbon-leader-self-check-company-info 같은 키가 복사된다
- 적용: 신규 파일 추가. app/page.tsx 와 함께 반영한다
- 함께 적용: app/page.tsx
- 주의: 이 파일 없이 app/page.tsx 만 교체하면 import 를 찾지 못해 빌드가 실패한다

## [덮어쓰기]

### 퍼블리싱 인덱스 화면 키값 부여

- 대상: app/page.tsx
- 변경: IA 56개 행에 라우트 슬러그 형태의 key 를 부여하고, 각 행의 마지막 뎁스 배지를 복사 버튼으로 교체
- 결과: 화면마다 고유 키가 생겨 페이지 제작·상태 변경 요청 때 키로 지목할 수 있다
- 적용: 파일 전체를 교체한다
- 함께 적용: components/publishing/screen-key-badge.tsx
- 주의: 표 구성과 IA 데이터 자체는 바뀌지 않았고 key 필드만 추가됐다

### 인계 자산 목록에 퍼블리싱 전용 폴더 표기

- 대상: lib/publishing/handoff-assets.json
- 변경: components/publishing 행을 추가해 화면 원본 소스가 아님을 표기
- 결과: 인계 자산 표에서 전달받는 쪽이 퍼블리싱 전용 코드를 구분할 수 있다
- 적용: 파일 전체를 교체한다
