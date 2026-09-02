# 다음 릴리스 변경사항

## [신규 추가]

### 목표달성 평가 화면 (선도기업 신청 3차 STEP 3)

- 대상: app/(site)/(content)/carbon-leader/application-3/components/target-achievement.tsx
  - app/(site)/(content)/carbon-leader/application-3/target-achievement/page.tsx
  - app/(site)/(content)/carbon-leader/application-3/target-achievement/general-unmet/page.tsx
  - app/(site)/(content)/carbon-leader/application-3/target-achievement/target-management/page.tsx
  - app/(site)/(content)/carbon-leader/application-3/target-achievement/target-management-unmet/page.tsx
  - app/(site)/(content)/carbon-leader/application-3/target-achievement/target-management-all-unmet/page.tsx
- 적용: 신규 파일 추가
- 화면: 평가 기본 설정 카드 + 평가 기준 카드 4종(절대배출량·원단위·감축량·목표관리업체)
- 케이스: 기업 유형과 달성 여부로 열리는 카드가 달라 라우트 5개로 나눴다
  - 일반기업: 절대배출량 → (미달) 원단위·감축량
  - 목표관리업체: 목표관리 → (미달) 절대배출량 → (미달) 원단위·감축량
- 값: 화면에 보이는 값은 계산하지 않고 화면마다 상수에 그대로 적어 두었다
  - 연계 시 GENERAL_MET 등 케이스 상수를 계산 결과로 갈아 끼우면 된다
  - 계산식은 참고 화면(carbon-apply-3rd-step3-goal-evaluation)을 따랐다
- 입력: 마크업 한 벌에 반응형 클래스만 얹어 입력 칸이 칸당 하나다
  - 해상도별로 나눠 그리지 않으므로 숨은 칸이 함께 제출되지 않는다
- 검사: [다음으로] 에서 빈 값·숫자 아님·0 이하를 잡고 첫 오류 칸으로 이동한다
  - 읽기 전용 칸은 검사에서 빠지되 값은 함께 제출된다

## [Diff 확인]

### 자가진단 평가지표 2.1.4 입력 가능 전환

- 대상: app/(site)/(content)/carbon-leader/self-check/components/evaluation-index.tsx
  - constants/carbon-leader-evaluation-index-items.ts
- 변경: 읽기 전용이던 투자금액·매출액 칸을 사용자 입력으로 전환
  - 입력값으로 투자비율(%)을 산출해 아래 등급 기준표의 강조 표시를 움직인다
- 결과: 값을 넣으면 등급이 실시간으로 갈리고 다른 지표와 같은 규격의 검사가 붙는다
- 커밋: [변경사항 보기](https://github.com/fromex-koh/fromex-carbon/commit/ce8f8aed9163949d1d4067695f7de7b9a2919e5f)

### 미달성 표시 색

- 대상: app/globals.css
- 변경: 달성(surface-flow·brand-primary)과 채도·명도를 맞춘 빨강 짝을 추가
  - surface-fail·ink-fail 두 토큰이며 기존 토큰은 건드리지 않았다
- 결과: 평가 결과 칸이 달성은 파랑, 미달성은 빨강으로 갈린다
  - 대비는 밝은 화면 4.79:1, 어두운 화면 4.28:1
- 커밋: [변경사항 보기](https://github.com/fromex-koh/fromex-carbon/commit/ea1c19950149667e3e023ba9fd7ce4e335aceaeb)

### 퍼블리싱 인덱스 갱신

- 대상: app/page.tsx
- 변경: 목표달성 평가를 케이스 5행으로 나누고 상위 행 병합 수를 맞췄다
  - UIUX 열에 "개발 수정완료" 뱃지를 추가했다
- 결과: 화면 73행이 되고 목표달성 평가에서 케이스별 화면으로 바로 이동한다
- 커밋: [변경사항 보기](https://github.com/fromex-koh/fromex-carbon/commit/60677afa7cc105d344f583604f015d07dcd0599a)
