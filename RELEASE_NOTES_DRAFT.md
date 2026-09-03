# 다음 릴리스 변경사항

## [신규 추가]

### 3차 신청 STEP 2 인벤토리 배출량 산정
- 대상: app/(site)/(content)/carbon-leader/application-3/inventory-emission/page.tsx
  - app/(site)/(content)/carbon-leader/application-3/inventory-emission/item-select/page.tsx
  - app/(site)/(content)/carbon-leader/application-3/inventory-emission/detail-input/page.tsx
- 화면: 자가진단의 인벤토리 배출량 산정 컴포넌트를 그대로 쓰고, 스테퍼 6단계와 이전·다음 이동 경로만 3차 흐름으로 교체
- 적용: 신규 파일 추가

### 3차 신청 STEP 1 신청서 작성
- 대상: app/(site)/(content)/carbon-leader/application-3/application-form/page.tsx
  - app/(site)/(content)/carbon-leader/application-3/components/application-form.tsx
- 화면: 「중간 및 최종점검 신청서」 양식 — 기업정보·기업현황·담당자정보·탄소중립 투자계획(1차 정보·수정불가)·감축기술 도입현황 카드 5장
- 적용: 신규 파일 추가

### 3차 신청 STEP 5 신청서 최종 확인
- 대상: app/(site)/(content)/carbon-leader/application-3/final-confirm/page.tsx
  - app/(site)/(content)/carbon-leader/application-3/components/final-confirm.tsx
- 화면: 카드 8장(기업정보·기업현황·담당자정보·투자계획·도입현황·인벤토리 배출량·목표달성 평가·서류 제출)
  - 서류 제출은 「최종점검 제출서류 목록」 기준 3묶음 7건(기업정보·인벤토리 증빙서류·감축계획 실행서류)
- 적용: 신규 파일 추가

### 2차 신청 STEP 1 신청서 작성
- 대상: app/(site)/(content)/carbon-leader/application-2/application-form/page.tsx
- 화면: 1차 신청서 컴포넌트를 회차만 바꿔 재사용(중간점검 양식)
- 적용: 신규 파일 추가

### 2차 신청 STEP 3 신청서 최종 확인
- 대상: app/(site)/(content)/carbon-leader/application-2/final-confirm/page.tsx
  - app/(site)/(content)/carbon-leader/application-2/components/final-confirm.tsx
- 화면: 카드 6장(3차와 달리 인벤토리 배출량·목표달성 평가 카드 없음)
  - 서류 제출은 「중간점검 제출서류 목록」 기준 2묶음 4건(기업정보·감축계획 실행서류)
- 적용: 신규 파일 추가

### 선도기업 신청 기준 미달 안내 모달
- 대상: app/(site)/(content)/carbon-leader/application/components/eligibility-block-dialog.tsx
  - app/(site)/(content)/carbon-leader/application/initial/not-eligible/page.tsx
  - constants/carbon-leader-application-step-cards.ts
- 화면: 최초 진입 화면에서 [선도기업 1차 신청]을 눌렀을 때 기준 미달이면 뜨는 안내 모달
  - 조건 세 줄을 충족·미충족(체크·엑스, 값 색)으로 보여주고 [확인] 버튼 하나만 둔다(되돌릴 선택지 없음)
- 적용: 신규 파일 추가

## [Diff 확인]

### 인벤토리 배출량 산정 화면 다회차 재사용
- 대상: app/(site)/(content)/carbon-leader/self-check/components/inventory-emission.tsx
- 변경: 스테퍼 단계·이전/다음 이동 경로를 props(steps·prevHref·nextHref)로 받도록 확장
- 결과: 자가진단과 3차 신청이 같은 컴포넌트를 스테퍼·이동 경로만 바꿔 쓴다
- 커밋: [변경사항 보기](https://github.com/fromex-koh/fromex-carbon/commit/90b2a5fe3699a3c8c04a4cc5f66ef40390f76352)

### 신청서 작성 화면 팩스번호 선택 전환 및 도입현황 행 위치 보정
- 대상: app/(site)/(content)/carbon-leader/application-1/components/application-form.tsx
- 변경: 담당자정보의 팩스번호를 필수 검사에서 빼고 이름표에 (선택) 표시
  - 감축기술 도입현황은 [행 추가하기] 버튼을 기준점 삼아, 줄이 늘거나 준 만큼 창을 함께 옮김
  - 유효성 검사 칸과 오류 문구 사이 간격을 다른 입력 칸과 같게 정리
- 결과: 팩스번호를 비워도 [다음으로] 진행 가능하고, 행을 추가·삭제해도 보던 자리가 화면 밖으로 벗어나지 않는다
  - 팩스번호 선택 전환은 신규 추가한 application-3/components/application-form.tsx 에도 처음부터 반영(해당 파일은 신규 추가 커밋 참고)
- 커밋: [변경사항 보기](https://github.com/fromex-koh/fromex-carbon/commit/ebf0f94c42d2f071688feebd39790f6eec29a3ad)

### 3차 목표달성 평가 스테퍼 상수 공용화
- 대상: app/(site)/(content)/carbon-leader/application-3/components/target-achievement.tsx
  - constants/carbon-leader-application-form.ts
- 변경: 화면 안에 있던 6단계 스테퍼 배열을 걷어내고, 공용 상수 APPLICATION_THIRD_STEPS 를 새로 추가해 함께 쓰도록 정리
- 결과: 3차 신청서 작성·최종확인·목표달성 평가 세 화면이 같은 스테퍼 배열 하나를 본다
- 커밋: [변경사항 보기](https://github.com/fromex-koh/fromex-carbon/commit/3e54c415d162931d5c55ac992d912ae50bf08359)

### 이어서 작성 안내 모달 선택지 확장
- 대상: app/(site)/(content)/carbon-leader/self-check/components/resume-notice-dialog.tsx
- 변경: [확인] 버튼 하나였던 것을 [새로 작성하기]·[이어서 작성하기] 두 버튼으로 분리
- 결과: 기존 작성 내용을 이어갈지, 버리고 새로 시작할지 사용자가 직접 고른다
- 커밋: [변경사항 보기](https://github.com/fromex-koh/fromex-carbon/commit/b0cf89a7a9df878c37f65670c042968606a1a1c7)

### 감축사업 기대효과 표 입력 가능 전환
- 대상: app/(site)/(content)/carbon-leader/self-check/components/reduction-target.tsx
  - constants/carbon-leader-reduction-target.ts
- 변경: 고정값으로 채워져 있던 연도별 기대효과 칸을 입력 칸으로 바꾸고, 합계 줄을 입력값 기준으로 다시 계산
  - PC 표와 모바일 카드로 나뉘어 있던 마크업을 표 하나로 합쳐 반응형으로 처리(입력 name 중복 방지)
- 결과: 감축사업별 연도 기대효과를 직접 입력할 수 있고, 합계가 입력값에 맞춰 자동으로 갱신된다
- 커밋: [변경사항 보기](https://github.com/fromex-koh/fromex-carbon/commit/f1d29cc94ce0933968f3739020508425d267a99c)

## [덮어쓰기]

### 퍼블리싱 인덱스
- 대상: app/page.tsx
- 변경: 이번 회차 신규 화면(3차 인벤토리·신청서 작성·최종확인, 2차 신청서 작성·최종확인, 신청 기준 미달 안내 모달)의 UIUX 를 완료로 표시하고, '자료수급완료'·'개발 수정요청' 배지를 정리
- 적용: 지정한 파일만 교체

릴리스 성공 후 내용은 자동으로 비워집니다.
