# 다음 릴리스 변경사항

- 선도기업 신청 1차 화면 4종(신청서 작성 · 서류 제출 · 최종 확인 · 제출 완료)을 퍼블리싱하고, 2·3차는 같은 컴포넌트에 차수만 넘겨 재사용한다
- 자가진단 STEP 6 결과 확인을 판정별 화면 3종(적정 · 적정+작성완료 · 부적정)으로 나눠 추가
- 주소 검색 모달을 공용 컴포넌트로 빼서 신청 1·2·3차와 마이페이지가 같은 모달을 쓴다
- 자가진단·신청 플로우의 하단 버튼을 한 규격으로 맞췄다. 374 미만은 세로로 쌓고, 374부터 한 줄로 서며, 768부터 원래 크기로 돌아온다
- 퍼블리싱 인덱스에 화면 6행을 추가하고 비고 배지 두 종(자료수급필요 · 미정)과 한 줄 메모 칸을 늘렸다

## [Diff 확인]

### 확인 팝업에 확인 버튼 색 프롭 추가

- 대상: app/(site)/(content)/carbon-leader/self-check/components/confirm-dialog.tsx
- 변경: confirmTone 프롭(destructive | default)을 받아 확인 버튼 색을 고르게 하고, 모바일 닫기 버튼을 모달 위 10px 바깥으로 통일
- 결과: 삭제 계열은 빨강, 제출 계열은 브랜드 파랑으로 갈린다. 기본값은 기존과 같은 destructive 라 호출부를 고치지 않아도 동작이 같다
- 주의: 프롭을 추가한 변경이라 이 파일을 통째로 덮으면 기존 호출부의 다른 수정이 지워질 수 있다
- 커밋: [변경사항 보기](https://github.com/fromex-koh/fromex-carbon/commit/992c24911989c793038e105867963325275d3d2e)

### 모바일 단계 헤더 제목 크기

- 대상: app/(site)/(content)/carbon-leader/self-check/components/step-mobile-nav.tsx
- 변경: 제목 글자를 text-base 에서 text-lg 로 올려 시안값(20)에 맞췄다
- 결과: 자가진단·신청 플로우의 모든 모바일 상단 제목이 같이 커진다
- 커밋: [변경사항 보기](https://github.com/fromex-koh/fromex-carbon/commit/6feff720537a40f622d3756a18e194465b7fcd95)

### 안내 박스 아래 여백

- 대상: app/(site)/(content)/carbon-leader/self-check/components/base-info.tsx
- 변경: 768 이상에서 아래 여백을 pb-8 에서 pb-6 으로 줄였다
- 결과: 시안의 24px 과 맞고, 이 박스를 쓰는 자가진단 단계 화면 전체에 반영된다
- 커밋: [변경사항 보기](https://github.com/fromex-koh/fromex-carbon/commit/58d21f2b950bda580685ba8330a3de1a38b62e8e)

### 판정 아이콘 등장 애니메이션 토큰

- 대상: app/globals.css
- 변경: 기존 marquee 애니메이션이 있는 @theme inline 블록에 --animate-pop-in 과 @keyframes pop-in 을 덧붙였다(추가만, 기존 토큰 수정 없음)
- 결과: animate-pop-in 으로 0.5s 오버슈트 등장이 걸린다. 결과 확인·제출 완료 화면의 판정 아이콘이 쓴다
- 주의: 파일을 통째로 덮지 말고 이 두 블록만 옮길 것. 색상 토큰이 같은 파일에 있다
- 커밋: [변경사항 보기](https://github.com/fromex-koh/fromex-carbon/commit/2155107a0674b994c765f7e4ffd926a69cf7f6fe)

### 자가진단 하단 버튼 규격 통일

- 대상: app/(site)/(content)/carbon-leader/self-check/components/evaluation-index.tsx
  - app/(site)/(content)/carbon-leader/self-check/components/reduction-target.tsx
  - app/(site)/(content)/carbon-leader/self-check/components/reduction-potential.tsx
- 변경: 버튼 사이 간격을 360 에서 8.5 로 좁히고(768 이상 12.75 유지), 감축잠재량 화면만 달랐던 상자(rounded-md)와 폭(w-44)을 플로우 표준(rounded-lg · w-42)으로 맞췄다
- 결과: 자가진단 네 단계와 신청 플로우의 하단 버튼이 같은 간격·상자·폭·높이를 쓴다
- 커밋: [변경사항 보기](https://github.com/fromex-koh/fromex-carbon/commit/47ed3e738b2c3f5d5bae848aa0ca23525bf0c1e2)

## [덮어쓰기]

### 퍼블리싱 인덱스

- 대상: app/page.tsx
- 변경: 화면 6행 추가(자가진단 결과 확인 3종 · 인벤토리 상세 입력 팝업 2종 · 신청 3차 상세 입력), 비고 배지 자료수급필요·미정 신설, 배지로 표현하기 어려운 한 줄 메모(note) 칸 추가, 상위 뎁스 rowSpan 재계산
- 결과: 표 63행이 되고 결과 확인·신청결과 확인 묶음의 정렬이 맞는다
- 적용: 지정한 파일만 교체

## [신규 추가]

### 주소 검색 모달 공용화

- 대상: components/address-search-dialog.tsx
  - app/(site)/(content)/carbon-leader/application-1/application-form/address-search/page.tsx
  - app/(site)/(content)/carbon-leader/application-2/application-form/address-search/page.tsx
  - app/(site)/(content)/carbon-leader/application-3/application-form/address-search/page.tsx
  - app/(site)/(content)/my-page/profile-edit/address-search/page.tsx
- 변경: 카카오 주소 검색 API 를 붙일 자리를 공용 모달 하나로 만들고, 네 화면이 같은 모달을 defaultOpen 으로 띄운다
- 적용: 신규 파일 추가

### 선도기업 신청 1차 화면 4종

- 대상: app/(site)/(content)/carbon-leader/application-1/
  - constants/carbon-leader-application-form.ts
  - constants/carbon-leader-document-submit.ts
  - constants/carbon-leader-final-confirm.ts
- 변경: 신청서 작성 · 서류 제출 · 최종 확인 · 제출 완료를 만들고 섹션 배너·metadata 는 layout.tsx 가 맡는다. 서류 제출은 파일 선택·용량 표시·개별 삭제와 10MB 초과 시 안내가 실제로 동작한다
- 결과: 표시 값은 constants 세 파일의 [퍼블리싱 노출용] 상수다. 실데이터를 붙일 때 상수만 걷어내면 된다
- 적용: 신규 파일 추가

### 신청 2·3차 화면

- 대상: app/(site)/(content)/carbon-leader/application-2/
  - app/(site)/(content)/carbon-leader/application-3/document-submit/page.tsx
  - app/(site)/(content)/carbon-leader/application-3/final-confirm/submit-confirm/page.tsx
  - app/(site)/(content)/carbon-leader/application-3/result/page.tsx
- 변경: 1차 컴포넌트에 round 프롭만 넘겨 재사용한다. 차수에 따라 스테퍼 첫 단계 이름·안내 문구·접수번호가 바뀐다
- 결과: 화면을 고칠 때 1차 컴포넌트 한 곳만 고치면 세 차수에 함께 반영된다
- 적용: 신규 파일 추가

### 자가진단 결과 확인 화면 3종

- 대상: app/(site)/(content)/carbon-leader/self-check/components/result.tsx
  - app/(site)/(content)/carbon-leader/self-check/result/
- 변경: 이행계획 적정 · 적정(작성완료 후) · 부적정 세 경우를 verdict·completed 프롭으로 나눴다. 작성완료를 누르면 전송 스피너가 돌고 끝난 뒤 선도기업 신청하기가 열린다
- 결과: 등급 배지는 기존 GradeBadge(A~E)를 그대로 쓰고, 배지 옆 주석에 등급별 색이 어디 있는지 적어 뒀다
- 적용: 신규 파일 추가
