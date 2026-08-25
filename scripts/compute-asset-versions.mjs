// GitHub Actions 의 전체 git 이력에서 다음 릴리스 메타데이터를 확정한다.
// 결과 파일은 릴리스 커밋에 포함되며, 전달본·로컬 빌드는 git 을 다시 조회하지 않고 이 스냅샷만 읽는다.
// ⚠️ 직접 실행할 때도 RELEASE_VERSION=vX.Y.Z 가 반드시 필요하다.

import { readFileSync, writeFileSync } from "node:fs"
import { execFileSync } from "node:child_process"
import { format, resolveConfig } from "prettier"
import { resolvePathVersion } from "./git-info.mjs"

const SOURCE = "lib/publishing/handoff-assets.json"
const ASSET_VERSIONS_OUTPUT = "lib/publishing/asset-versions.generated.json"
const RELEASE_NOTES_OUTPUT = "lib/publishing/release-notes.generated.json"
const RELEASE_NOTES_DRAFT = "RELEASE_NOTES_DRAFT.md"

const EMPTY_RELEASE_NOTES_DRAFT = `# 다음 릴리스 변경사항

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
`

const releaseVersion = process.env.RELEASE_VERSION

if (!releaseVersion || !/^v\d+\.\d+\.\d+$/.test(releaseVersion)) {
  throw new Error(
    "RELEASE_VERSION=vX.Y.Z 형식의 다음 릴리스 버전이 필요합니다.",
  )
}

// 릴리스 문장이 길어지면 JSON.stringify 들여쓰기만으로는 Prettier 결과와 달라질 수 있다.
// 생성 시점에 프로젝트 설정을 적용해, 생성 직후 format:check 가 항상 같은 결과를 보게 한다.
const prettierConfig = (await resolveConfig(RELEASE_NOTES_OUTPUT)) ?? {}
const formatJson = (value, filepath) =>
  format(JSON.stringify(value), { ...prettierConfig, filepath })

// 인계 자산 목록이 곧 버전 추적 대상이다. 경로가 이름을 겸한다.
const handoffAssets = JSON.parse(readFileSync(SOURCE, "utf8"))

const assets = handoffAssets.map(({ path }) => {
  const resolvedVersion = resolvePathVersion(path)
  // 최신 태그 이후 변경은 아직 이를 포함하는 태그가 없어서 '미배포'다. 릴리스 파일을 만드는
  // 이 시점에만 해당 변경을 곧 생성할 태그 버전으로 확정한다.
  const version =
    resolvedVersion === "미배포" ? releaseVersion : resolvedVersion
  return { name: path, version, isCurrent: version === releaseVersion }
})

writeFileSync(
  ASSET_VERSIONS_OUTPUT,
  await formatJson({ version: releaseVersion, assets }, ASSET_VERSIONS_OUTPUT),
)

const git = (...args) => execFileSync("git", args, { encoding: "utf8" }).trim()
const previousTag = git(
  "tag",
  "--list",
  "v[0-9]*.[0-9]*.[0-9]*",
  "--sort=-v:refname",
).split("\n")[0]
const releaseRange = previousTag ? `${previousTag}..HEAD` : "HEAD"
const commitSubjects = git("log", releaseRange, "--format=%s", "--no-merges")
  .split("\n")
  .filter(Boolean)
  .filter((subject) => !subject.startsWith("chore(release):"))
  .filter((subject) => !subject.startsWith("chore: sync frontend handoff"))

const summarizeSubject = (subject) =>
  subject
    .replace(
      /^(?:feat|fix|docs|refactor|perf|test|build|ci|chore|style)(?:\([^)]*\))?!?:\s*/i,
      "",
    )
    .trim()

const parseDraftChanges = (draft) => {
  const changes = []
  const lines = draft.replace(/<!--[\s\S]*?-->/g, "").split("\n")
  let handoffMode
  let handoff
  let handoffDetail

  const flushHandoff = () => {
    if (handoff !== undefined) changes.push(handoff)
    handoff = undefined
    handoffDetail = undefined
  }

  for (const line of lines) {
    const modeMatch = /^##\s+\[(Diff 확인|신규 추가|덮어쓰기)\]\s*$/.exec(
      line.trim(),
    )
    if (modeMatch) {
      flushHandoff()
      handoffMode =
        modeMatch[1] === "Diff 확인"
          ? "diff"
          : modeMatch[1] === "신규 추가"
            ? "new"
            : "overwrite"
      continue
    }

    const titleMatch = /^###\s+(.+)$/.exec(line.trim())
    if (titleMatch && handoffMode !== undefined) {
      flushHandoff()
      handoff = {
        type: "handoff",
        mode: handoffMode,
        title: titleMatch[1].trim(),
        details: [],
      }
      handoffDetail = undefined
      continue
    }

    const nestedDetailMatch = /^\s{2,}-\s+(.+)$/.exec(line)
    if (nestedDetailMatch && handoffDetail !== undefined) {
      handoffDetail.value = [handoffDetail.value, nestedDetailMatch[1].trim()]
        .filter(Boolean)
        .join("\n")
      continue
    }

    const detailMatch = /^-\s+([^:]+):\s*(.*)$/.exec(line.trim())
    if (detailMatch && handoff !== undefined) {
      handoffDetail = {
        label: detailMatch[1].trim(),
        value: detailMatch[2].trim(),
      }
      handoff.details.push(handoffDetail)
      continue
    }

    const changeMatch = /^-\s+(.+)$/.exec(line.trim())
    if (changeMatch && handoffMode === undefined)
      changes.push(changeMatch[1].trim())
  }

  flushHandoff()
  return changes
}

const draftChanges = parseDraftChanges(
  readFileSync(RELEASE_NOTES_DRAFT, "utf8"),
)
const automaticChanges = [
  ...new Set(commitSubjects.map(summarizeSubject).filter(Boolean)),
].slice(0, 8)
const changes = draftChanges.length > 0 ? draftChanges : automaticChanges
const releasedAt = git("log", "-1", "--format=%cs", "HEAD")
const previousReleaseNotes = JSON.parse(
  readFileSync(RELEASE_NOTES_OUTPUT, "utf8"),
).releases
const releases = [
  {
    version: releaseVersion,
    releasedAt,
    changes: changes.length > 0 ? changes : ["릴리스 메타데이터 업데이트"],
  },
  ...previousReleaseNotes.filter(
    (release) => release.version !== releaseVersion,
  ),
].slice(0, 30)
writeFileSync(
  RELEASE_NOTES_OUTPUT,
  await formatJson({ releases }, RELEASE_NOTES_OUTPUT),
)

if (process.env.PRESERVE_RELEASE_NOTES_DRAFT !== "true") {
  writeFileSync(RELEASE_NOTES_DRAFT, EMPTY_RELEASE_NOTES_DRAFT)
}

const updated = assets.filter((asset) => asset.isCurrent).map((a) => a.name)
console.log(
  `릴리스 메타데이터 생성: ${releaseVersion} / 변경 자산 ${updated.length}건${
    updated.length > 0 ? ` (${updated.join(", ")})` : ""
  }`,
)
