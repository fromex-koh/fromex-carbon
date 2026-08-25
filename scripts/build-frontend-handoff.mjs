import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs"
import { basename, resolve } from "node:path"
import process from "node:process"

const outputArgument = process.argv[2]

if (!outputArgument) {
  throw new Error(
    "사용법: node scripts/build-frontend-handoff.mjs <output-directory>",
  )
}

const repositoryRoot = process.cwd()
const outputDirectory = resolve(outputArgument)

if (
  outputDirectory === repositoryRoot ||
  basename(outputDirectory) !== "frontend-handoff"
) {
  throw new Error(
    "출력 경로는 현재 저장소 밖의 frontend-handoff 디렉터리여야 합니다.",
  )
}

const copy = (source, destination = source) => {
  const sourcePath = resolve(repositoryRoot, source)
  if (!existsSync(sourcePath)) return
  cpSync(sourcePath, resolve(outputDirectory, destination), { recursive: true })
}

const copyRequiredHandoffAsset = (source, destination) => {
  const sourcePath = resolve(repositoryRoot, source)
  if (!existsSync(sourcePath)) {
    throw new Error(`handoff 전용 파일이 없습니다: ${source}`)
  }
  cpSync(sourcePath, resolve(outputDirectory, destination), { recursive: true })
}

rmSync(outputDirectory, { recursive: true, force: true })
mkdirSync(outputDirectory, { recursive: true })

// 전달본에 포함할 경로만 명시한다.
// 여기에 없는 것(.github, .claude, CLAUDE.md, docs, scripts 등)은 전달되지 않는다.
for (const path of [
  ".gitignore",
  "app",
  "components",
  "components.json",
  "lib",
  "postcss.config.mjs",
  "public",
  "tsconfig.json",
  "yarn.lock",
]) {
  copy(path)
}

for (const path of [".DS_Store", "app/.DS_Store", "components/.DS_Store"]) {
  rmSync(resolve(outputDirectory, path), { force: true })
}

// package.json 은 원본 저장소의 것을 그대로 쓰지 않는다.
// 릴리스 스크립트 등 퍼블리싱 쪽 사정으로 늘어나는 항목이 전달본에 새어 나가지 않도록,
// main 최초 상태를 고정해 둔 handoff/package.json 을 전달한다.
// 실제 의존성이 바뀌어 전달본이 깨지면 CI 의 handoff 빌드 단계에서 걸린다.
copyRequiredHandoffAsset("handoff/package.json", "package.json")

const version = process.env.RELEASE_VERSION ?? "(미지정)"
const sourceCommit = process.env.HANDOFF_SOURCE_COMMIT ?? "(미지정)"
const generatedAt = process.env.HANDOFF_GENERATED_AT ?? "(미지정)"

writeFileSync(
  resolve(outputDirectory, "README.md"),
  `# fromex-carbon (FE 전달본)

탄소중립 플랫폼 FO 퍼블리싱 결과물입니다.
\`main\` 브랜치에서 자동 생성되므로 이 브랜치에 직접 커밋하지 마세요.

| 항목 | 값 |
| --- | --- |
| 릴리스 | ${version} |
| 원본 커밋 | ${sourceCommit} |
| 생성 시각 | ${generatedAt} |

## 실행

\`\`\`bash
yarn install
yarn dev
\`\`\`

- \`/\` 퍼블리싱 인덱스 (IA 기준 화면 목록)
- \`/home\` 서비스 홈

## 전달 범위

퍼블리싱 산출물(\`app\`, \`components\`, \`lib\`, \`public\`)과 구동에 필요한 설정만 담았습니다.
원본 저장소의 CI 설정과 작업 문서는 포함하지 않습니다.
`,
)

console.log(`frontend handoff 생성 완료: ${outputDirectory}`)
