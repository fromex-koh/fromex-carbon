const latestVersion = process.argv[2]

if (!latestVersion) {
  throw new Error("최신 릴리스 버전(vX.Y.Z)을 인자로 전달해야 합니다.")
}

const match = /^v(\d+)\.(\d+)\.(\d+)$/.exec(latestVersion)

if (!match) {
  throw new Error(`잘못된 릴리스 버전입니다: ${latestVersion}`)
}

const [, majorString, minorString, patchString] = match
const major = Number(majorString)
const minor = Number(minorString)
const patch = Number(patchString)

// PATCH를 한 자리로 유지하고, 9 다음 릴리스는 MINOR를 올린다.
if (patch >= 9) {
  console.log(`v${major}.${minor + 1}.0`)
} else {
  console.log(`v${major}.${minor}.${patch + 1}`)
}
