# 다음 릴리스 변경사항

## [Diff 확인]

### 2·3차 신청서 감축기술 도입현황 도입시기 연·월 선택
- 대상: app/(site)/(content)/carbon-leader/application-1/components/application-form.tsx
  - app/(site)/(content)/carbon-leader/application-3/components/application-form.tsx
- 변경: 도입시기를 날짜 달력에서 연·월만 고르는 칸으로 바꿨다. 연도를 좌우 화살표로 옮기고 12개월 목록에서 한 달을 고른다
  - 고른 값은 2026-03 꼴로 칸과 폼에 함께 담기고, 빈 칸 안내 문구는 '도입연월' 이다
  - 신청서의 다른 날짜 칸(설립일자·사업기간)은 그대로 날짜 달력을 쓴다
- 결과: 도입시기를 일 단위까지 고르지 않고 연·월로만 받는다
- 커밋: [변경사항 보기](https://github.com/fromex-koh/fromex-carbon/commit/066293785d08d3afb4f46001a6084cb2dd25a9b5)

### 2·3차 신청서 탄소중립 투자계획 읽기 전용 복귀
- 대상: app/(site)/(content)/carbon-leader/application-1/components/application-form.tsx
  - app/(site)/(content)/carbon-leader/application-3/components/application-form.tsx
- 변경: 직전 회차에서 입력으로 열어 두었던 투자계획을 다시 읽기 전용으로 되돌렸다
  - 줄마다 있던 [삭제]·표 아래 [행 추가하기] 와 표 헤더의 삭제 버튼 자리를 걷어냈다
  - 감축기술·감축설비명·사업기간·투자금·온실가스감축량을 모두 회색 읽기 전용 칸으로 되돌리고, 사업기간은 다시 한 칸에 기간 전체를 적는다
  - 투자계획 칸의 유효성 검사도 함께 뺐다(감축기술 도입현황 검사는 그대로)
- 결과: 표가 INVESTMENT_ROWS 목록을 그대로 그리므로, 그 배열을 서버 응답으로 갈아 끼우면 줄 수와 값이 그대로 매핑된다
- 커밋: [변경사항 보기](https://github.com/fromex-koh/fromex-carbon/commit/7fa2a464a28257b7c52a739be19021359642ae57)

### 신청 금액 입력 칸 단위 백만원
- 대상: constants/carbon-leader-application-form.ts
- 변경: 칸 오른쪽에 붙던 '원' 을 '백만원' 으로 바꿨다 — 총매출액 · 탄소감축투자 계획금액 · 투자계획 투자금 · 감축기술 도입현황 투자금
- 결과: 이름표의 (백만원) 과 칸 단위가 같아져, 1·2·3차 신청서 작성의 금액 칸이 모두 백만원 기준으로 읽힌다
- 커밋: [변경사항 보기](https://github.com/fromex-koh/fromex-carbon/commit/009e17106d6eac5a531b4e799d40c894eb3486cd)

릴리스 성공 후 내용은 자동으로 비워집니다.
