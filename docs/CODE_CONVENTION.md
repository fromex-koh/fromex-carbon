# 채널계 프론트엔드 개발 표준 가이드 (v1)

2026. 3.

기술보증기금 ICT운영센터

## 1. 작성 개요

### 문서 목적

채널계 플랫폼 확장 및 수행에 있어 개발자 간 코드 일관성을 가지고 유지보수성을 높이고, 대민 플랫폼의 특수성을 고려하여 중소벤처 ONE 플랫폼 구축 사업을 기반으로 한 채널계 기술 베이스를 확립한다.

### 적용 범위

채널계 프로젝트에 참여하는 모든 개발자(수행사 및 현업 담당자 등)가 숙지하여 준수해야 하며, 모든 코드는 본 문서에 정의된 규칙 및 리뷰 절차를 모두 통과해야만 형상관리 서버로 병합될 수 있다.

### 표준 기술 스택 및 환경

| 구분       | 기술 요소      | 상세 버전       | 비고                                                                  |
| ---------- | -------------- | --------------- | --------------------------------------------------------------------- |
| 언어       | TypeScript     | 5.x 이상(LTS)   | `strict` 적용 필수                                                    |
| 프레임워크 | Next.js(React) | 15.x 이상       | App Router 아키텍처 적용                                              |
| 빌드 도구  | Yarn           | 1.2x 이상       | -                                                                     |
| API Docs   | Swagger/Orval  | 7.9.x 이상      | 백엔드 API 명세서를 바탕으로 Orval을 이용하여 API 호출 코드 자동 생성 |
| 스타일     | Tailwind CSS   | 2.18.x 이상/LTS | `absolute` 사용 제한                                                  |
| 컴포넌트   | shadcn/ui      | LTS             | Headless 컴포넌트                                                     |
| 아이콘     | lucide-react   | LTS             | 표준 단일 아이콘 라이브러리                                           |
| 포맷팅     | Prettier       | LTS             | 가이드라인 자동 IDE 검출                                              |

- **TypeScript**: 자바스크립트에 정적 타입을 더해 컴파일 단계에서 런타임 에러를 차단하는 언어
- **Next.js**: 서버 사이드 렌더링 및 라우팅을 기본 제공하는 React 프레임워크
- **React**: 화면을 독립적인 컴포넌트 단위로 나누어 UI를 구축하는 자바스크립트 라이브러리
- **Yarn**: 캐싱과 병렬 처리를 통해 안정적으로 프로젝트 의존성을 설치·관리하는 도구
- **Orval**: 백엔드의 OpenAPI 명세서를 읽어 프론트엔드용 호출 코드를 자동 생성하는 도구
- **Tailwind CSS**: 미리 정의된 유틸리티 클래스를 조합하여 별도 CSS 없이 디자인하는 프레임워크
- **shadcn/ui**: 잘 만들어진 컴포넌트 소스 코드를 자유롭게 수정해 사용하는 UI 컬렉션
- **Lucide**: 일관된 굵기와 디자인을 제공하는 오픈소스 아이콘 라이브러리
- **Prettier**: 들여쓰기나 줄바꿈 등의 코드 스타일을 자동으로 맞추는 포맷터

### 개발 원칙

코드를 작성하는 시간보다 읽는 시간이 길다는 사실을 인지한다.

- **가독성 우선**: 비전공자 및 업무 담당자도 이해할 수 있는 직관적인 코드를 작성한다.
- **기술 독립성**: 비즈니스 로직 및 도메인은 특정 프레임워크 또는 라이브러리에 종속되지 않아야 한다.
- **테스트 용이성**: 모든 비즈니스 로직은 단위 테스트가 가능하도록 의존성 주입(DI)을 받아야 한다.
- **표준 준수**: 팀에서 정한 필수 컨벤션은 개인의 선호보다 우선한다.

## 2. 코딩 컨벤션 개요

카테고리는 필수(MUST), 권장(RECOMMENDED)으로 구분되며 전체 명명 규칙은 하단의 붙임 코드 컨벤션 가이드북을 참고한다.

| 접두사 | 의미                   | 정의                                            |
| ------ | ---------------------- | ----------------------------------------------- |
| ST     | Strict Restriction     | 특별한 경우를 제외하고 일반적으로 금지되는 규칙 |
| NA     | NextJS Architecture    | Next.js 프레임워크 및 외부 통신 관련 규칙       |
| NC     | Naming Convention      | 변수, 함수, DOM 요소 등의 네이밍 규칙           |
| MD     | Method Design          | JavaScript/TypeScript 로직 및 규칙              |
| CD     | Component & CSS Design | UI 컴포넌트 및 스타일링 설계 규칙               |

## 3. 코딩 컨벤션 상세

### Strict Restriction

허용 시 해당 방식에 의존하여 개발하는 경우가 있어 금지 사항으로 운용하는 컨벤션이다.

#### 필수(MUST) [ST-001] `any` 타입 사용 금지

TypeScript의 에러 검출 기능을 무력화하는 `any` 타입의 사용을 금지한다.

```ts
// 옳은 예시
interface RequestData {
    value: number
}
const processData = (data: RequestData) => data.value * 2

// 잘못된 예시
const processData = (data: any) => data.value * 2
```

리뷰 예시: `P1(필수): ST-001 위반 / any 타입 데이터는 사용 지양 부탁드립니다.`

#### 필수(MUST) [ST-002] `as`(Type Assertion) 사용 금지

런타임 에러의 주 원인이므로 반드시 타입 가드(Type Guard)를 구현하여 검증한다.

```ts
// 옳은 예시
if (event.payload && typeof event.payload === 'object' && 'name' in event.payload) {
    const user: User = event.payload
}

// 잘못된 예시
const user = event.payload as User
```

#### 권장(RECOMMENDED) [ST-003] 변수 재할당 및 `for`/`forEach`문 지양

상태 변경은 디버깅 난이도를 높이므로 람다식(`map`, `reduce` 등)을 사용하여 불변성을 유지한다.

```ts
// 옳은 예시
const total = prices.reduce((acc, price) => acc + price, 0)

// 잘못된 예시
let total = 0
prices.forEach((price) => (total += price))
```

#### 필수(MUST) [ST-004] `height` 및 `width` 고정값 사용 금지

반응형 웹 대응을 불가능하게 하므로 `max-w`, `min-w`, `%` 및 브레이크 포인트(`md:`, `max-md:`) 등을 활용하여 디자인한다.

```tsx
// 옳은 예시
<div className="w-full max-w-4xl min-h-[50vh] md:w-3/4">컨텐츠</div>

// 잘못된 예시
<div className="w-[800px] h-[600px]">컨텐츠</div>
```

#### 권장(RECOMMENDED) [ST-005] Tailwind CSS `absolute` 사용 지양

반응형 웹 대응을 어렵게 하므로 레이아웃 구성에는 Flex 등을 우선 활용하고, 특정 요소의 배치처럼 필요한 범위에서만 `absolute`를 사용한다.

```tsx
// 옳은 예시
<div className="flex h-64 w-full items-center justify-center bg-gray-100 relative">
    <div className="bg-blue-500 p-4 text-white">중앙 정렬</div>
    <div className="absolute right-4 top-4">
        <span className="flex h-3 w-3 rounded-full bg-red-500" />
    </div>
</div>

// 잘못된 예시: 코드 복잡도 및 반응형 대응이 어려움
<div className="relative h-64 w-full bg-gray-100">
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-500 p-4 text-white">
        중앙 정렬
    </div>
    <div className="absolute right-4 bottom-4 bg-red-500 p-2 text-white">알림창</div>
</div>
```

### Next.js Architecture

Next.js 프레임워크 및 외부 통신 관련 규칙이다.

#### 필수(MUST) [NA-001] 외부 URL 및 엔드포인트는 환경변수 처리

```ts
// 옳은 예시
const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/data`

// 잘못된 예시
const apiUrl = 'https://api.domain.com/data'
```

#### 권장(RECOMMENDED) [NA-002] API 통신 시 Orval을 통한 백엔드 경유

OpenAPI 스펙을 기반으로 자동 생성된 훅과 함수만 사용하여 프론트엔드와 백엔드 스펙을 일치시킨다.

```ts
// 옳은 예시
const {data} = useGetUsers()

// 잘못된 예시
const {data} = await axios.get('/api/users')
```

#### 필수(MUST) [NA-003] 프론트엔드에서 직접 외부 API 호출 금지

CORS 정책 위반 및 API Key 노출 방지를 위해 모든 외부 요청은 백엔드를 경유한다.

- 보안: 민감한 인증 키(Authorization Token, API Key)는 `NEXT_PUBLIC_` 환경변수로 설정하지 않는다.
- CORS: 클라이언트에서 외부 도메인을 직접 호출하지 않고 내부 API 라우트를 거쳐 CORS 에러를 차단한다.

```tsx
// 옳은 예시
export default async function GoodExample() {
    const res = await fetch(`https://api.external.com/data?key=${process.env.SECRET_API_KEY}`)
    const data = await res.json()

    return <div>{data.title}</div>
}

// 잘못된 예시
;('use client')

import {useEffect, useState} from 'react'

export default function BadExample() {
    const [data, setData] = useState(null)

    useEffect(() => {
        fetch(`https://api.external.com/data?key=${process.env.NEXT_PUBLIC_API_KEY}`)
            .then((res) => res.json())
            .then(setData)
    }, [])

    return <div>{data?.title}</div>
}
```

#### 권장(RECOMMENDED) [NA-004] 상황에 맞는 `use client`와 `use server` 분리

무분별한 `use client`는 렌더링 성능 저하를 일으키므로 상호작용이 필요한 경우에 제한적으로 사용한다.

- **`use server`(서버 액션)**: 브라우저에 코드가 노출되지 않는다. DB에 직접 접근하거나 보안이 필요한 API를 호출할 때 파일 최상단에 선언한다.
- **`use client`(클라이언트 컴포넌트)**: `onClick`, `onChange` 같은 이벤트나 `useState`, `useEffect` 같은 React Hook이 필요할 때 파일 최상단에 선언한다.

```ts
// 옳은 예시: 데이터 영역의 서버 액션(actions.ts)
'use server'

export async function updateSystemStatus(id: string, status: string) {
    const res = await fetch(`https://api.internal.com/status/${id}`, {
        method: 'POST',
        body: JSON.stringify({status}),
        headers: {Authorization: `Bearer ${process.env.SECRET_TOKEN}`},
    })

    return res.ok
}
```

```tsx
// 옳은 예시: UI 영역의 클라이언트 컴포넌트(StatusButton.tsx)
'use client'

import {useState} from 'react'
import {updateSystemStatus} from './actions'

export default function StatusButton({systemId}) {
    const [isUpdating, setIsUpdating] = useState(false)
    const handleUpdate = async () => {
        setIsUpdating(true)
        const success = await updateSystemStatus(systemId, 'ACTIVE')
        if (success) alert('상태가 업데이트 되었습니다.')
        setIsUpdating(false)
    }

    return (
        <button onClick={handleUpdate} disabled={isUpdating}>
            {isUpdating ? '처리 중...' : '상태 업데이트'}
        </button>
    )
}
```

#### 필수(MUST) [NA-005] `<img>` 태그 지양, `next/image` 사용(경로 import)

자동 이미지 최적화(WebP 변환, 리사이징, 레이지 로딩)를 적용하고 레이아웃 시프트를 방지하기 위해 Next.js 내장 Image 컴포넌트를 사용하며, 로컬 이미지는 정적으로 import한다.

```tsx
// 옳은 예시: 빌드 타임에 이미지 크기 자동 계산 및 최적화 적용
import Image from 'next/image'
import logoImg from '@/public/assets/logo.png'

;<Image src={logoImg} alt="로고" placeholder="blur" />

// 잘못된 예시: 최적화 미적용 및 레이아웃 틀어짐 발생 가능성
;<img src="/assets/logo.png" alt="로고" />
```

#### 필수(MUST) [NA-006] `<a>` 태그 지양, `next/link` 사용

페이지 이동 시 전체 새로고침(Full Reload)을 막고 다음 페이지 리소스를 미리 가져오는 프리패칭(Prefetching)을 통해 SPA처럼 빠른 라우팅을 구현한다.

```tsx
// 옳은 예시
import Link from 'next/link'

;<Link href="/dashboard">대시보드 이동</Link>

// 잘못된 예시
;<a href="/dashboard">대시보드 이동</a>
```

#### 필수(MUST) [NA-007] 공통 컴포넌트(shadcn 등) 내부 코드 수정 금지

공통 라이브러리 업데이트 시 충돌을 방지하고 디자인 일관성을 유지하기 위해 원본 파일은 수정하지 않고 외부에서 `className`이나 props로 덮어 사용한다.

```tsx
// 옳은 예시: 제공되는 variant나 외부 className으로 스타일 확장
import {Button} from '@/components/ui/button'

;<Button variant="outline" className="border-primary mt-4 w-full">
    제출하기
</Button>

// 잘못된 예시: 공통 버튼 컴포넌트 파일 자체를 수정
// 원본 파일 내: className="bg-blue-500 hover:bg-blue-600 text-white..."
```

#### 필수(MUST) [NA-008] `lucide-react` 사용

SVG 파일을 직접 관리하는 번거로움을 없애고 프로젝트 전체의 아이콘 디자인 톤앤매너를 통일하기 위해 단일 라이브러리만 사용한다.

```tsx
// 옳은 예시
import {CheckCircle} from 'lucide-react'

;<CheckCircle className="h-5 w-5 text-green-500" />

// 잘못된 예시
;<i className="fas fa-check" />
;<svg width="24" height="24">
    ...
</svg>
```

#### 필수(MUST) [NA-009] Tailwind CSS 색상 하드코딩 금지

향후 다크 모드 도입이나 브랜드 테마 변경 시 일괄 적용할 수 있도록 임의의 Hex 코드 대신 `tailwind.config.ts`에 정의된 시맨틱 변수(Semantic Colors)만 사용한다.

```tsx
// 옳은 예시
;<div className="bg-background text-destructive">내용</div>

// 잘못된 예시
;<div className="bg-[#1e1e2f] text-red-500">내용</div>
```

#### 권장(RECOMMENDED) [NA-010] 요소 간 간격은 Flex `gap` 활용

```tsx
// 옳은 예시: Flex 컨테이너의 gap으로 일관된 간격 제어
<div className="flex flex-col gap-4">
    <div>입력폼 1</div>
    <div>입력폼 2</div>
    <div className="pt-4">
        <button>저장</button>
    </div>
</div>

// 잘못된 예시
<div className="block">
    <div className="mb-4">입력폼 1</div>
    <div className="mb-4">입력폼 2</div>
    <button className="mt-8">저장</button>
</div>
```

### Naming Convention

파일과 폴더명만으로 해당 코드의 역할(UI, 로직, 라우팅)을 즉시 파악할 수 있도록 용도에 따라 일관된 표기법을 사용한다.

#### 필수(MUST) [NC-001] 파일 및 디렉터리 네이밍

`kebab-case`를 사용한다.

- 예: `app/user-profile/page.tsx`

#### 필수(MUST) [NC-002] Boolean 타입 네이밍

참·거짓을 알 수 있도록 `is`, `has`, `can` 접두사 등을 포함한다.

```ts
// 옳은 예시
const isLoading = true

// 잘못된 예시
const loading = true
```

#### 필수(MUST) [NC-003] 상수 네이밍(`SCREAMING_SNAKE_CASE`)

애플리케이션 전반에서 공유되는 환경 설정, 매직 넘버, 고정된 코드값 등은 대문자와 언더스코어만 사용하여 작성한다. 일반 변수나 함수와 뚜렷하게 대비시켜 실수로 값을 덮어쓰거나 변경하는 휴먼 에러를 차단한다.

```ts
const MAX_UPLOAD_SIZE_MB = 10
```

### Method Design

로직의 실행 결과를 100% 예측할 수 있도록 변수의 유효 범위(스코프)를 엄격히 통제하고, 데이터의 불변성을 유지하여 사이드 이펙트를 차단한다.

#### 필수(MUST) [MD-001] `const` 우선 사용(`var` 사용 금지)

의도치 않은 값의 재할당과 스코프 오염을 막기 위해 모든 변수는 `const`로 우선 선언하며, 반복문 카운터나 상태 업데이트 등 재할당이 명확히 필요한 상황에서는 `let`을 사용한다.

```ts
// 옳은 예시
const calculateTotal = (items) => {
    const DISCOUNT_RATE = 0.1
    let finalPrice = basePrice * (1 - DISCOUNT_RATE)
    return finalPrice
}

// 잘못된 예시
const calculateTotal = (items) => {
    let discountRate = 0.1
    return basePrice * (1 - discountRate)
}
```

#### 권장(RECOMMENDED) [MD-002] Truthy와 Falsy 속성 적극 활용

- **Truthy**: 실제 `true`는 아니지만 JavaScript 조건문에서 `true`로 간주되어 로직을 실행시키는 값
- **Falsy**: JavaScript 조건문에서 `false`로 평가되는 값(`false`, `0`, `""`, `null`, `undefined` 등)

```ts
// 옳은 예시
if (!userList.length || !userName || !isLoaded) {
    // ...
}

// 잘못된 예시
if (userList.length === 0 || userName === '' || isLoaded === false) {
    // ...
}
```

#### 필수(MUST) [MD-003] Nullish Coalescing 연산자 활용

기존 논리 OR 연산자가 `0`이나 빈 문자열까지 `false`로 인식하여 발생하는 버그를 방지한다. Nullish Coalescing은 왼쪽 값이 오직 `null` 또는 `undefined`일 때만 우항의 기본값을 반환한다.

```ts
// 옳은 예시
const inputCount = 0
const maxCount = inputCount ?? 10

// 잘못된 예시: 10이 할당되는 버그 발생
const inputCount = 0
const maxCount = inputCount || 10
```

#### 권장(RECOMMENDED) [MD-004] Early Return 패턴 권장

중첩된 `else`, `else if`를 지양하고 예외 상황을 최상단에서 처리한다.

```ts
const processOrder = (order: Order) => {
    if (!order.isValid) return '유효하지 않은 주문'
    if (!order.isPaid) return '미결제 상태'
    return '결제 완료 처리 로직'
}
```

#### 권장(RECOMMENDED) [MD-005] `break`/`continue` 지양

반복문 내 `break`, `continue`는 제어 흐름을 강제로 끊어 가독성을 해치므로 배열 고차 함수(`filter`, `map`, `some`, `every`)로 목적을 선언적으로 표현한다.

```ts
// 옳은 예시
const validItems = items.filter((item) => item.status === 'ACTIVE').filter((item) => item.price <= 10000)
const total = validItems.reduce((acc, item) => acc + item.price, 0)

// 잘못된 예시
let total = 0
for (let i = 0; i < items.length; i += 1) {
    if (items[i].status === 'INACTIVE') continue
    if (items[i].price > 10000) break
    total += items[i].price
}
```

#### 필수(MUST) [MD-006] 증감 연산자 독립 사용

전·후위 연산 시점 차이로 인한 버그 방지를 위해 증감 연산자는 독립 라인에서 사용한다.

```ts
// 옳은 예시
currentId += 1
const targetId = currentId

// 잘못된 예시
const targetId = currentId++
```

#### 필수(MUST) [MD-007] 변수는 사용 직전에 선언 및 초기화

함수 최상단에 모든 변수를 몰아서 선언하지 않고, 코드를 읽는 흐름에 맞춰 실제 쓰이는 시점 바로 위에 선언 및 초기화한다.

```ts
// 옳은 예시
const processOrder = (order) => {
    // ... 비즈니스 로직 ...
    const finalPrice = order.price - 1000
    return finalPrice
}

// 잘못된 예시
const processOrder = (order) => {
    let finalPrice
    let discountInfo
    // ... 비즈니스 로직 ...
    finalPrice = order.price - 1000
    return finalPrice
}
```

#### 필수(MUST) [MD-008] Optional Chaining 필수 사용

중첩 객체 접근 시 발생하는 에러를 방지하기 위해 Optional Chaining을 적극 사용한다. 중간 경로에 `null`이나 `undefined`가 있더라도 타입 에러를 발생시키지 않고 `undefined`를 반환한다.

```ts
// 옳은 예시
const zipCode = company?.address?.zipCode

// 잘못된 예시
const zipCode = company && company.address && company.address.zipCode
```

#### 필수(MUST) [MD-009] Arrow Function 사용 지향 및 스코프 유의

일반 `function` 키워드 대신 화살표 함수를 일관되게 사용하여 간결성을 높이고, `this` 바인딩이 런타임에 변하는 것을 방지하여 예상치 못한 스코프 오염을 막는다.

```tsx
// 옳은 예시
const calculate = (a, b) => a + b
const UserProfile = () => {
    return <div>...</div>
}

// 잘못된 예시
function calculate(a, b) {
    return a + b
}
```

#### 필수(MUST) [MD-010] 하드코딩된 숫자·문자(Magic Number) 지양

코드 내부에 의미를 알 수 없는 숫자나 문자열을 직접 쓰지 말고 반드시 상수로 선언한다.

```ts
// 옳은 예시
const STATUS_COMPLETED = 2
if (status === STATUS_COMPLETED) {
    // 비즈니스 로직
}

// 잘못된 예시
if (status === 2) {
    // ...
}
```

#### 필수(MUST) [MD-011] Deprecated 기능 사용 금지

언어 스펙이나 라이브러리에서 공식적으로 지원 중단을 선언한 API나 메서드는 보안 취약점 및 향후 버전 업데이트 시 호환성 문제가 발생할 가능성이 있으므로 사용을 금지한다.

```ts
// 옳은 예시
const str = 'hello'
const newStr = str.substring(1, 4)

// 잘못된 예시
const str = 'hello'
const newStr = str.substr(1, 3)
```

### CSS Design

전역 스타일 충돌을 차단하고 디자인 일관성을 강제하여 프로젝트 규모가 커져도 누구나 안전하고 예측 가능하게 UI를 유지보수할 수 있도록 제어하는 스타일링 원칙이다.

#### 필수(MUST) [CD-001] CSS `!important` 사용 금지

명시도를 꼬이게 만들어 스타일 유지보수를 어렵게 하는 원인이므로 선택자의 구체성을 높이거나 Tailwind 클래스 조합으로 해결한다.

```css
/* 옳은 예시 */
.container .button {
    background-color: blue;
}

/* 잘못된 예시 */
.button {
    background-color: blue !important;
}
```

```tsx
// 옳은 예시
className={'bg-primary'}

// 잘못된 예시
className={'!bg-primary'}
```

#### 필수(MUST) [CD-002] `z-index` 하드코딩 금지(DOM 배치 순서 우선)

`z-index`를 임의 설정하면 컨텍스트가 꼬여 전체 UI 유지보수가 어려워지므로 HTML 요소의 자연스러운 배치 순서를 우선하고, 예외 상황에서는 공통 컴포넌트의 Portal 기능을 활용한다.

```tsx
// 옳은 예시: 안정적인 오버레이 컴포넌트와 DOM 배치 순서 활용
<div className="relative">
    <div className="p-4 border">메인 콘텐츠</div>
    <div className="absolute top-full left-0 shadow-md bg-white">드롭다운 메뉴</div>
</div>

// 잘못된 예시
<div className="relative">
    <div className="absolute z-[999]">드롭다운 메뉴</div>
    <div className="fixed z-[9999]">모달 창</div>
    <div className="absolute z-[10000]">툴팁</div>
</div>
```
