# 다음 릴리스 변경사항

## [신규 추가]

### 인벤토리 배출량 산정 화면
- 대상: app/(site)/(content)/carbon-leader/self-check/inventory-emission/page.tsx
  - app/(site)/(content)/carbon-leader/self-check/inventory-emission/item-select/page.tsx
  - app/(site)/(content)/carbon-leader/self-check/inventory-emission/detail-input/page.tsx
  - app/(site)/(content)/carbon-leader/self-check/components/inventory-emission.tsx
  - app/(site)/(content)/carbon-leader/self-check/components/inventory-item-dialog.tsx
  - constants/carbon-leader-inventory-items.ts
- 화면: PC·태블릿·모바일 시안에 맞춰 표·카드·간격을 반영
  - 사용량 단위를 칸 아래에서 빼고 묶음 이름에 「사용량 입력 (L)」 형태로 통일
  - 상세입력 버튼에 하위 항목 개수를 함께 표시
  - 자동 산출 칸을 읽기 전용 입력으로 바꿔 값이 없을 때 자리표시 0 만 보이도록 정리
  - 목록 선택 칸의 긴 보기를 말줄임 처리하고 초점 표시를 입력 칸과 통일
- 팝업 라우트: 항목 선택(IA 11)·상세 입력(IA 13) 을 모달 전용 화면으로 분리
  - 라우트로 바로 들어오면 본문 없이 모달만 열린 상태로 보여 준다
  - 상세 입력은 마디 코드 하나로 하위 항목을 세워, 다른 마디도 코드만 바꿔 볼 수 있다
- 상세입력 팝업: 태블릿·모바일 시안에 맞춰 정리하고 태블릿 가로 스크롤 제거
  - 닫기 버튼을 PC 는 카드 안, 태블릿 이하는 카드 위로 배치
  - 표 머리 줄을 굴림 상자 밖으로 빼 지나가는 줄이 비치던 틈 해소
- 유효성 검사: 사용량 빈값 검사 추가 — 빈 칸 표시·개수 문구·첫 칸으로 이동
  - 상세입력 팝업에도 같은 빈값 검사를 적용
  - 묶음을 접었다 펴도 입력값이 남도록 사용량 입력을 상태로 관리
- 어두운 화면: 카드 테두리·표 구분선을 시안대로 밝게 조정
  - Scope 배지 글자와 인벤토리 선택 줄의 면·선 색을 시안에 맞춤
- 적용: 신규 파일 추가

## [Diff 확인]

### Scope 설명 팝업 어두운 화면 대응
- 대상: app/(site)/(content)/carbon-leader/components/scope-guide-dialog.tsx
- 변경: 어두운 화면에서 테두리·글자·아이콘을 한 단계 밝은 회색으로 조정
- 결과: 어두운 배경에 묻히지 않고 시안과 같은 대비를 유지한다
- 커밋: [변경사항 보기](https://github.com/fromex-koh/fromex-carbon/commit/8109839369025e64926eedbc2b4803816cbd64c4)

### 담긴 항목 표시용 색상 토큰 추가
- 대상: app/globals.css
- 변경: 이미 담긴 항목을 초록으로 가르는 surface·line·ink-kept 세 토큰을 밝은 화면·어두운 화면에 모두 추가
- 결과: 인벤토리 선택 팝업이 새로 고른 항목과 이미 담긴 항목을 색으로 구분한다
- 커밋: [변경사항 보기](https://github.com/fromex-koh/fromex-carbon/commit/33056414f1a634a872a36e55f9f86a7e71904a28)

## [덮어쓰기]

### 퍼블리싱 인덱스
- 대상: app/page.tsx
- 변경: 인벤토리 배출량 산정·항목 선택·상세 입력 세 화면의 UIUX 를 완료로 표시
- 적용: 지정한 파일만 교체
