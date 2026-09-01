/**
 * 창을 목표 위치까지 부드럽게 굴린다.
 *
 * 네이티브 `scrollTo({ behavior: "smooth" })` 가 통째로 무시되는 환경이 있어(요청해도
 * 한 칸도 안 움직인다) 직접 그린다. easeInOutCubic 이라 처음과 끝이 느리고 가운데가 빠르다.
 *
 * 쓰는 곳
 * - 하위계정 관리(sub-account.tsx): 계정을 등록한 뒤 새 줄로
 * - 현황조회(status.tsx): [더보기] 로 펼친 뒤 마지막 카드로
 *
 * @param target 문서 기준 목표 scrollY. 부르는 쪽에서 0 ~ 최대 스크롤로 잘라 넘긴다
 * @param duration 이동에 쓸 시간(ms)
 */
export const smoothScrollTo = (target: number, duration = 450) => {
  const start = window.scrollY
  const distance = target - start
  if (Math.abs(distance) < 1) return

  // 모션을 줄여 달라는 설정이거나, 탭이 가려져 requestAnimationFrame 이 멈춰 있으면
  // 애니메이션이 한 프레임도 못 돌아 아예 움직이지 않는다. 그때는 한 번에 옮긴다.
  if (
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    document.visibilityState === "hidden"
  ) {
    window.scrollTo(0, target)
    return
  }

  let startedAt: number | null = null
  let done = false

  const step = (now: number) => {
    if (startedAt === null) startedAt = now

    const progress = Math.min((now - startedAt) / duration, 1)
    const eased =
      progress < 0.5 ? 4 * progress ** 3 : 1 - (-2 * progress + 2) ** 3 / 2

    window.scrollTo(0, start + distance * eased)

    if (progress < 1) window.requestAnimationFrame(step)
    else done = true
  }

  window.requestAnimationFrame(step)

  // 그래도 프레임이 돌지 않은 경우를 대비한 안전망
  window.setTimeout(() => {
    if (!done) window.scrollTo(0, target)
  }, duration + 200)
}
