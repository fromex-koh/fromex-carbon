// 전체 이력이 checkout 된 GitHub Actions 릴리스 단계에서만 사용하는 git 조회 유틸.
// 전달본·로컬 빌드는 이 파일을 호출하지 않고 커밋된 릴리스 메타데이터를 읽는다.

import { execSync } from "node:child_process"

const run = (command) =>
  execSync(command, { stdio: ["ignore", "pipe", "ignore"] })
    .toString()
    .trim()

const resolveLastCommit = (path) => {
  try {
    return run(`git log -1 --format=%H -- "${path}"`)
  } catch {
    return undefined
  }
}

// 주어진 경로(파일·폴더)가 마지막으로 바뀐 시점을 '그 변경을 포함하는 가장 가까운 태그'로 표현한다.
// 예: v0.1.0 이후 globals.css 만 바뀌었다면 → v0.1.0 은 그 변경을 포함하지 않으므로,
//     다음 태그(v0.2.0)가 만들어져야 그 값이 나온다. 아직 태그되지 않았으면 '미배포'.
export const resolvePathVersion = (path) => {
  const lastCommit = resolveLastCommit(path)
  if (lastCommit === undefined) return "-"
  if (!lastCommit) return "-"

  try {
    const described = run(`git describe --tags --contains "${lastCommit}"`)
    // "v0.2.0~3" 처럼 태그 뒤에 조상 거리(~N)가 붙을 수 있어, 태그명만 잘라낸다.
    return described.split(/[~^]/)[0]
  } catch {
    return "미배포" // 어떤 태그에도 포함되지 않음 = 마지막 릴리스 이후 변경, 아직 공유 전
  }
}
