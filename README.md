# fromex-carbon

기술보증기금 탄소가치플랫폼 FO 퍼블리싱 저장소입니다.
작업자: 이윤화 (웹 퍼블리싱)

## 시작하기

Node 22 / 패키지 매니저는 **yarn** 입니다.

```bash
yarn install
yarn dev
```

`http://localhost:3000` 에서 확인합니다.

| 스크립트     | 설명                  |
| ------------ | --------------------- |
| `yarn dev`   | 개발 서버 (Turbopack) |
| `yarn build` | 프로덕션 빌드         |
| `yarn start` | 빌드 결과 실행        |
| `yarn lint`  | ESLint                |

> `yarn format` 은 실행하지 마세요. oxfmt 를 가리키고 있어 세미콜론을 붙입니다.
> 포맷은 `npx prettier --write <파일>` 로 건드린 파일에만 적용합니다.

## 화면

| 경로    | 설명                                          |
| ------- | --------------------------------------------- |
| `/`     | 퍼블리싱 인덱스 — 릴리스 노트·인계 자산·IA 표 |
| `/home` | 메인 홈                                       |

## 구조

```
app/          App Router 진입점과 전역 스타일
components/   도메인 컴포넌트
components/ui shadcn 기반 공통 UI (원본 수정 금지)
lib/          const.ts · utils.ts — 화면에서 쓰는 공용 코드
lib/publishing/ 퍼블리싱 인덱스 전용 데이터 (화면 원본 소스 아님)
scripts/      릴리스·전달본 생성 스크립트
docs/         코드 컨벤션 문서 (읽기 전용)
```

기술 스택은 Next.js 15 App Router · React 19 · TypeScript · Tailwind v4 입니다.
색상 변수는 `app/globals.css` 의 `@theme` 에 정의되어 있습니다.

## 브랜치

| 브랜치             | 역할                                   |
| ------------------ | -------------------------------------- |
| `dev`              | 작업 브랜치                            |
| `main`             | 퍼블리싱 제작·검수용                   |
| `frontend-handoff` | 프론트엔드 전달본. 릴리스 때 자동 생성 |

프론트엔드 개발은 `frontend-handoff` 를 내려받아 시작합니다.

## 릴리스

`main` 에 머지되면 워크플로가 자동으로 처리합니다.

1. 다음 버전 태그 확정
2. git 이력에서 자산별 반영 버전 산출
3. 릴리스 노트 초안을 기록에 쌓고 초안을 비움
4. `frontend-handoff` 브랜치에 전달본 생성

릴리스 노트는 머지 전에 **`RELEASE_NOTES_DRAFT.md`** 에 작성합니다.
작성 규칙은 해당 파일 상단 주석에 있습니다.

## 환경 변수

없어도 빌드와 렌더링은 정상입니다. 외부 링크와 분석 스크립트에만 영향을 줍니다.

| 변수                                | 용도                         |
| ----------------------------------- | ---------------------------- |
| `NEXT_PUBLIC_URL`                   | 헤더·푸터의 대외 사이트 링크 |
| `NEXT_PUBLIC_BASE_PATH`             | 분석 호스트 경로 접두사      |
| `NEXT_PUBLIC_RYBBIT_ANALYTICS_HOST` | Rybbit 분석 호스트           |
| `NEXT_PUBLIC_RYBBIT_SITEID`         | Rybbit 사이트 ID             |

`NEXT_PUBLIC_` 접두사라 빌드 시 번들에 포함됩니다. 값을 바꾸면 재배포해야 반영됩니다.

## 코드 컨벤션

`docs/CODE_CONVENTION.md` (채널계 프론트엔드 개발 표준 가이드) 를 따릅니다.
기술보증기금 ICT운영센터가 배포한 문서이므로 **수정하지 않습니다.**

프로젝트 상황에 맞춘 해석과 작업 규칙은 `CLAUDE.md` 에 정리되어 있습니다.
