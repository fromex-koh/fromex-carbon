// 릴리스 메타데이터를 '타입이 확정된 객체'로 만들어 export 하는 단일 관문.
// 화면은 .generated.json 을 직접 import 하지 않고 반드시 여기서 가져온다.
//
// 세 생성물은 GitHub Actions 릴리스 단계에서 scripts/compute-asset-versions.mjs 가 만든다.
// 전달본·로컬 빌드는 git 을 조회하지 않고 커밋된 이 스냅샷만 읽는다.

import assetVersionsGenerated from "@/lib/publishing/asset-versions.generated.json"
import releaseNotesGenerated from "@/lib/publishing/release-notes.generated.json"
import screenVersionsGenerated from "@/lib/publishing/screen-versions.generated.json"

export type ReleaseNoteHandoffMode = "diff" | "new" | "overwrite"

export interface ReleaseNoteDetail {
  label: string
  value: string
}

export interface ReleaseNoteHandoff {
  type: "handoff"
  mode: ReleaseNoteHandoffMode
  title: string
  details: ReleaseNoteDetail[]
}

// 릴리스 노트는 일반 문자열과 프론트엔드 전달 카드 객체를 함께 지원한다.
export type ReleaseNoteChange = string | ReleaseNoteHandoff

export interface ReleaseNote {
  version: string
  releasedAt: string
  changes: ReleaseNoteChange[]
}

export interface AssetVersion {
  name: string
  version: string
  isCurrent: boolean
}

// 화면은 라우트 경로가 이름을 겸한다. 목록은 (content) 아래 page.tsx 에서 생성된다.
export interface ScreenVersion {
  path: string
  version: string
  isCurrent: boolean
}

const HANDOFF_MODES: readonly ReleaseNoteHandoffMode[] = [
  "diff",
  "new",
  "overwrite",
]

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null

const isHandoffMode = (value: string): value is ReleaseNoteHandoffMode =>
  HANDOFF_MODES.some((mode) => mode === value)

// 생성물이 어긋나면 화면에 나가기 전에 빌드 시점에 막는다.
const parseChange = (value: unknown, where: string): ReleaseNoteChange => {
  if (typeof value === "string") return value
  if (!isRecord(value) || value.type !== "handoff") {
    throw new Error(`[release] ${where}: 문자열 또는 handoff 객체여야 합니다.`)
  }
  const mode = value.mode
  if (typeof mode !== "string" || !isHandoffMode(mode)) {
    throw new Error(
      `[release] ${where} > mode: diff|new|overwrite 여야 합니다.`,
    )
  }
  if (typeof value.title !== "string" || value.title.length === 0) {
    throw new Error(`[release] ${where} > title: 비어 있지 않아야 합니다.`)
  }
  if (!Array.isArray(value.details)) {
    throw new Error(`[release] ${where} > details: 배열이어야 합니다.`)
  }

  const details = value.details.map((detail, index) => {
    if (
      !isRecord(detail) ||
      typeof detail.label !== "string" ||
      typeof detail.value !== "string"
    ) {
      throw new Error(
        `[release] ${where} > details[${index}]: label·value 문자열이 필요합니다.`,
      )
    }
    return { label: detail.label, value: detail.value }
  })

  return { type: "handoff", mode, title: value.title, details }
}

// 릴리스 전에는 releases·assets 가 빈 배열이라 never[] 로 추론된다.
// 생성물의 날것 형태를 명시해 두고, 값 검증은 parseChange 가 맡는다.
interface GeneratedRelease {
  version: string
  releasedAt: string
  changes: unknown[]
}

const generatedReleases = (
  releaseNotesGenerated as { releases: GeneratedRelease[] }
).releases

const generatedAssets = (
  assetVersionsGenerated as { version: string; assets: AssetVersion[] }
).assets

const generatedScreens = (
  screenVersionsGenerated as { version: string; screens: ScreenVersion[] }
).screens

export const RELEASE_NOTES: ReleaseNote[] = generatedReleases.map(
  (release): ReleaseNote => ({
    version: release.version,
    releasedAt: release.releasedAt,
    changes: release.changes.map((change, index) =>
      parseChange(change, `${release.version} > changes[${index}]`),
    ),
  }),
)

export const ASSET_VERSIONS: AssetVersion[] = generatedAssets

export const SCREEN_VERSIONS: ScreenVersion[] = generatedScreens

// 아직 어떤 릴리스에도 담기지 않은 자산의 표시 문구.
// git-info 의 "-"(커밋 이력 없음)와 생성물 누락(첫 릴리스 전)을 한 문구로 합친다.
export const UNRELEASED_ASSET_VERSION = "미반영"

// IA 표는 '미배포'로 적어 왔다. 자산 표의 '미반영'과 뜻은 같고 문구만 다르다.
export const UNRELEASED_SCREEN_VERSION = "미배포"

// IA 표는 라우트 경로로 화면을 찾는다. 생성물에 없으면 아직 릴리스에 담기지 않은 화면이다.
export const findScreenVersion = (
  path: string,
): { version: string; isCurrent: boolean } => {
  const found = SCREEN_VERSIONS.find((screen) => screen.path === path)
  const version =
    found === undefined || found.version === "-"
      ? UNRELEASED_SCREEN_VERSION
      : found.version

  return { version, isCurrent: found?.isCurrent ?? false }
}

// 인계 자산 표는 경로를 이름으로 쓴다. 생성물에 없으면 아직 추적 전이다.
export const findAssetVersion = (
  name: string,
): { version: string; isCurrent: boolean } => {
  const found = ASSET_VERSIONS.find((asset) => asset.name === name)
  const version =
    found === undefined || found.version === "-"
      ? UNRELEASED_ASSET_VERSION
      : found.version

  return { version, isCurrent: found?.isCurrent ?? false }
}
