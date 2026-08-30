import { cn } from "@/lib/utils"

interface StepMobileNavProps {
  title: string
  /** 1부터 시작하는 현재 단계 */
  step: number
  total: number
}

// 모바일 전용 상단 네비. PC·태블릿의 Stepper 를 대신한다.
// 자가진단 6단계가 모두 같은 형태라 단계 번호만 바꿔 쓰면 된다.
const StepMobileNav = ({ title, step, total }: StepMobileNavProps) => {
  const steps = Array.from({ length: total }, (_, index) => index + 1)

  return (
    <nav className="border-border flex items-center justify-between gap-3 border-b px-5 py-4 md:hidden">
      <h2 className="text-ink-strong text-base font-bold break-keep">
        {title}
      </h2>
      <ol
        aria-label={`${total}단계 중 ${step}단계`}
        className="flex shrink-0 items-center"
      >
        {steps.map((current, index) => (
          <li key={current} className="flex items-center">
            {index > 0 && (
              <span
                aria-hidden="true"
                className={cn(
                  "h-0.5 w-4",
                  current <= step ? "bg-primary-light" : "bg-input",
                )}
              />
            )}
            {current === step ? (
              <span className="bg-primary text-primary-foreground rounded-full px-3 py-0.5 text-xs font-bold">
                Step{current}
              </span>
            ) : (
              <span
                aria-hidden="true"
                className={cn(
                  "size-2 rounded-full",
                  current < step
                    ? "bg-primary-light"
                    : "border-input bg-background border",
                )}
              />
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

export default StepMobileNav
