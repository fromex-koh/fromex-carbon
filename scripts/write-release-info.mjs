import { writeFileSync } from "node:fs"
import { resolve } from "node:path"
import process from "node:process"

const version = process.env.RELEASE_VERSION
const releasedAt = process.env.RELEASE_TIME

if (!version) {
  throw new Error("RELEASE_VERSION 환경변수가 필요합니다.")
}

if (!releasedAt) {
  throw new Error("RELEASE_TIME 환경변수가 필요합니다.")
}

const target = resolve(process.cwd(), "lib/release-info.json")

writeFileSync(target, `${JSON.stringify({ version, releasedAt }, null, 2)}\n`)

console.log(`릴리스 정보 기록: ${version} / ${releasedAt}`)
