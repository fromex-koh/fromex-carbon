# fromex-carbon

기술보증기금 채널계 프론트엔드 프로젝트. 주 작업자는 퍼블리셔이며 화면(마크업/스타일) 작업이 중심이다.

## 코드 컨벤션

`docs/CODE_CONVENTION.md`(채널계 프론트엔드 개발 표준 가이드 v1)를 따른다.
코드를 작성하거나 수정하기 전에 해당 문서를 읽고, 관련 규칙 ID(ST/NA/NC/MD/CD)를 지킨다.

### `docs/CODE_CONVENTION.md`는 절대 수정하지 않는다

**어떤 경우에도 이 파일을 편집·포맷·재작성·삭제하지 않는다.** 읽기 전용으로만 다룬다.

기술보증기금 ICT운영센터가 배포한 **프로젝트 작업 지침**이다.
이 프로젝트에서 만든 문서가 아니므로 사용자도 수정하지 않으며, 개정은 발행 조직에서만 이루어진다.
`kibo-ktop` 프로젝트에서 그대로 복사해 왔고, 원본과 바이트 단위로 동일하게 유지해야 한다.
아래 상황에서도 예외 없이 손대지 않는다.

- 포맷터 검사에 걸릴 때 (`.prettierignore`에 `docs`가 등록되어 있다)
- 오타·표 정렬·마크다운 문법이 어색해 보일 때
- 이 프로젝트 상황과 규칙 내용이 맞지 않을 때
- 일괄 치환이나 전체 포맷 명령의 대상 범위에 포함될 때

문서 내용과 프로젝트 현실이 어긋나면 문서를 고치지 말고, 이 CLAUDE.md의 "이 프로젝트에 맞춘 해석"에 기록한다.
문서 수정이 필요해 보이는 상황이면 사용자에게 보고만 하고, 직접 고치겠다고 제안하지 않는다.

파일 권한을 읽기 전용(`444`)으로 설정해 두었다.

## 요청하지 않은 파일을 만들지 않는다

**사용자가 시키지 않은 파일은 임의로 생성하지 않는다.** 없는 모듈을 스텁으로 채워 넣는 것도 금지다.

없는 모듈(`@/actions/logout` 등) 때문에 컴포넌트가 컴파일되지 않으면:

1. 해당 import 와 호출부를 **주석 처리**해서 컴파일을 통과시킨다. 코드는 지우지 않고 주석 안에 남긴다.
2. 무엇을 왜 주석 처리했는지 **사용자에게 보고**한다.
3. 파일을 새로 만들지 않는다. 만들어야 할 것 같으면 먼저 물어본다.

컴파일을 막는 것과 타입 에러만 나는 것을 구분한다. Turbopack 은 타입체크를 하지 않으므로,
타입 에러(`Property 'accessToken' does not exist` 등)는 화면에 영향이 없어 주석 처리 대상이 아니다.
`Module not found` 만 실제로 화면을 죽인다.

### 적용 범위 — 중요

**앞으로 새로 작성하거나 수정하는 코드에만 적용한다.**

기존 소스는 외부에서 받은 원본이라 컨벤션 위반이 이미 다수 존재한다
(고정 px 81건, `as` 단언 70건, hex 하드코딩 9건, `function` 키워드 58건 등).
대부분 shadcn/ui 원본 코드이며, 이를 고치는 것은 오히려 `NA-007`(공통 컴포넌트 원본 수정 금지) 위반이다.

- 기존 위반을 찾아내 고치지 않는다. 리팩터링을 먼저 제안하지 않는다.
- 기존 파일을 건드릴 때는 **내가 손대는 라인만** 컨벤션에 맞추고, 주변 코드는 그대로 둔다.
- 사용자가 명시적으로 요청할 때만 기존 코드를 정리한다.

### 이 프로젝트에 맞춘 해석

문서와 실제 프로젝트 설정이 다른 부분은 아래를 따른다.

- **포맷터**: **Prettier**를 쓴다. 설정은 프로젝트 루트의 `.prettierrc`.
  기존 소스 65개 전부가 이 설정을 이미 통과하므로 원본을 건드리지 않고 새 코드만 정렬된다.
  - `extends` 키는 Prettier가 지원하지 않아 무시된다(경고만 뜸).
    실질 설정은 `semi: false` + `endOfLine: auto` + Prettier 기본값이며,
    이것이 기존 코드 스타일과 정확히 일치한다 — 세미콜론 없음, 큰따옴표, 2칸 들여쓰기, printWidth 80.
  - 원본 소스는 줄바꿈이 **CRLF**다. `endOfLine: auto`가 이를 보존하므로 임의로 바꾸지 않는다.
  - `package.json`의 `format` 스크립트는 아직 **oxfmt**를 가리킨다. oxfmt는 세미콜론을 붙이므로
    `yarn format`은 **실행하지 않는다**. 포맷은 `npx prettier --write <파일>`로 건드린 파일에만 적용한다.
  - `docs/`는 다른 프로젝트에서 그대로 복사한 원본 문서이므로 포맷하지 않는다.
- **NA-009 시맨틱 색상**: Tailwind **v4**라 `tailwind.config.ts`가 없다.
  색상 변수는 `globals.css`의 `@theme`에 정의되어 있으며, 하드코딩 금지 취지는 동일하게 적용한다.

### 퍼블리싱 작업 시 특히 주의할 필수 규칙

- `ST-004` 고정 `w-[800px]`/`h-[600px]` 금지 → `max-w`, `%`, `vh/dvh`, 브레이크포인트
- `CD-001` `!important` 금지 (Tailwind의 `bg-primary!` 형태 포함)
- `CD-002` `z-index` 하드코딩 금지 → DOM 배치 순서 우선
- `NA-009` 색상 hex 하드코딩 금지 → 시맨틱 변수만
- `NA-005` `<img>` 금지 → `next/image` + 정적 import
- `NA-006` `<a>` 금지 → `next/link`
- `NA-008` 아이콘은 `lucide-react`만 사용
- `NA-007` shadcn 원본 파일 수정 금지 → `className`/props로 덮어쓰기
- `NA-010` 간격은 `margin` 대신 Flex `gap`
- `NC-001` 파일·폴더명 `kebab-case`

## 프로젝트 구조

Next.js 15 App Router / React 19 / TypeScript strict / Tailwind v4 / 패키지 매니저 **yarn**.
경로 alias는 `@/*` → 프로젝트 루트(`./*`).

```
app/          App Router 진입점
components/   도메인 컴포넌트
components/ui shadcn 기반 UI (원본 수정 금지)
lib/          utils.ts(cn) 등 공용 유틸
hooks/  constants/  util/  public/
globals.css   Tailwind v4 @theme 색상 정의
docs/         컨벤션 문서
```

## 알려진 타입 에러 — 전부 무시하기로 합의됨

`tsc --noEmit` 기준 에러 18건이 남아 있다. **사용자가 무시하기로 결정한 사항이므로 고치지 않는다.**
먼저 제안하지도 말고, 다른 작업 중에 지나가며 손보지도 않는다.

이유: 퍼블리싱(화면 마크업)이 현재 작업이고, `next dev`는 타입체크를 하지 않아 화면 확인에 지장이 없다.
원본 소스를 그대로 보존하는 쪽이 낫다는 판단.

| 파일 | 건수 | 원인 | 사용 여부 |
| --- | --- | --- | --- |
| `components/ui/inno-prod-dialog.tsx` | 6 | `@/hooks/remote-store` 없음 | 미사용 |
| `components/ui/wallpaper.tsx` | 4 | `@/lib/utils`의 `deepFlattenChildren`, `isIOS` 없음 | 미사용 |
| `components/ui/support-facility-dialog.tsx` | 3 | `@/hooks/remote-store` 없음 | 미사용 |
| `components/ui/core-tec-dialog.tsx` | 3 | `@/hooks/remote-store` 없음 | 미사용 |
| `components/nav-bar.tsx` | 2 | `@/actions/logout` 없음, next-auth `User`에 `accessToken` 없음 | 사용 중 |

나머지 60개 컴포넌트 파일은 에러가 없다.

`@/hooks/remote-store`는 원본에서 삭제된 모듈이며, 위 dialog 3개가 지우다 남은 참조다.

### 다시 손대야 하는 시점

아래 상황에서만 해결에 착수하고, 그전에는 그대로 둔다.

- 미사용 컴포넌트(`Wallpaper`, dialog 3종)를 실제 화면에 넣을 때
  → 타입 에러가 아니라 **런타임 에러로 화면이 안 나온다**. 반드시 먼저 해결해야 한다.
- `next build`(배포 빌드)를 실행해야 할 때 → 타입 에러로 빌드가 실패한다.
- `nav-bar.tsx`의 로그아웃 버튼 동작이나 로그인 상태 화면을 확인해야 할 때.

## 참고: 해결된 항목

- `@/lib/const` → `lib/const.ts` 생성 (`menuList`, `navBarHeight = 90`)
- `@/lib/utils` → `lib/utils.ts` 생성 (`cn`만)
- `@/public/*.svg|png` → `next-env.d.ts` 생성으로 타입 해결.
  단, 실제 파일은 `main-go-self-check` 계열 4개만 있고 나머지 22개는 아직 없다.
  `*.svg` 모듈 선언 때문에 **타입 에러 없이 통과하지만 렌더링하면 깨진다.**
