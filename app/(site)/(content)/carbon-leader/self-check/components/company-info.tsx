"use client"

import type { ReactNode } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogCloseButton,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio"
import { Stepper } from "@/components/ui/stepper"
import StepMobileNav from "@/app/(site)/(content)/carbon-leader/self-check/components/step-mobile-nav"
import { useDialogAutoOpen } from "@/util/use-dialog-auto-open"
import BaseInfo from "@/app/(site)/(content)/carbon-leader/self-check/components/base-info"
import { cn } from "@/lib/utils"
import { SELF_CHECK_STEPS } from "@/constants/carbon-leader-self-check-steps"
import { withThousandsComma } from "@/util/format-number"

// 업종코드 조회 팝업은 기존 컴포넌트(components/ui/lobzcd-dialog.tsx)를 그대로 붙인다.
// 이 화면에서는 팝업이 뜨는 자리만 표시해 둔다.
const IndustryCodeDialog = ({
  children,
  defaultOpen,
}: {
  children: ReactNode
  defaultOpen?: boolean
}) => {
  const [open, setOpen] = useDialogAutoOpen(defaultOpen)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-[calc(100%-1.25rem)] max-w-[560px] gap-0 rounded-xl p-0">
        <DialogHeader className="border-input gap-0 border-b px-6 py-5 text-left">
          <DialogTitle className="text-lg font-bold break-all">
            업종을 검색해보세요
          </DialogTitle>
          <DialogDescription className="sr-only">
            업종코드 조회 팝업이 들어갈 자리입니다.
          </DialogDescription>
          <DialogCloseButton className="absolute top-5 right-5" />
        </DialogHeader>

        <div className="px-6 py-10">
          <p className="border-input text-muted-foreground rounded-md border border-dashed px-6 py-12 text-center text-sm break-all">
            업종코드 조회 팝업 기존 사용
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}

const NOTICES = [
  "자가진단은 입력하신 기업 정보를 바탕으로 탄소중립 준비 수준을 진단해 드리는 서비스입니다.",
  "원활한 진단을 위해 업종코드, 업력, 최근 3개년 매출액 정보를 미리 준비해주세요.",
  "소요 시간은 약 5분이며, 진단 결과는 마지막 단계에서 확인할 수 있습니다.",
]

const SALES_YEARS = ["sales2019", "sales2020", "sales2021"] as const
const SALES_LABELS: Record<(typeof SALES_YEARS)[number], string> = {
  sales2019: "2019년",
  sales2020: "2020년",
  sales2021: "2021년",
}

const YES_NO = [
  { value: "yes", label: "여(해당)" },
  { value: "no", label: "부(비해당)" },
]

// 매출액은 백만원 단위 정수만 받는다. 천 단위 쉼표는 지우고 검사한다.
const amount = (label: string) =>
  z
    .string()
    .min(1, `${label}을 입력해 주세요.`)
    .refine((v) => /^[0-9,]+$/.test(v), "숫자만 입력해 주세요.")

const formSchema = z.object({
  industryCode: z.string().min(1, "업종코드를 선택해 주세요."),
  businessYears: z
    .string()
    .min(1, "업력을 입력해 주세요.")
    .refine((v) => /^[0-9]+$/.test(v), "숫자만 입력해 주세요."),
  wasteDirect: z.string().min(1, "폐기물 직접 처리 여부를 선택해 주세요."),
  processEmission: z.string().min(1, "공정배출 해당여부를 선택해 주세요."),
  sales2019: amount("2019년 매출액"),
  sales2020: amount("2020년 매출액"),
  sales2021: amount("2021년 매출액"),
  agree: z.literal(true, {
    errorMap: () => ({ message: "정보 활용에 동의해 주세요." }),
  }),
})

type FormValues = z.infer<typeof formSchema>

// 입력칸 오른쪽에 단위를 붙인다. 입력 폭은 화면에 맞춰 줄어든다.
// 오류일 때 Input 원본의 focus·hover 링 색이 빨강을 덮으므로 같은 변형자로 되돌린다.
const UnitField = ({
  unit,
  className,
  isValid = true,
  ...props
}: React.ComponentProps<typeof Input> & { unit: string }) => (
  <div className="relative w-full">
    <Input
      isValid={isValid}
      className={cn(
        "pr-16",
        !isValid && "hover:ring-destructive focus-visible:ring-destructive",
        className,
      )}
      {...props}
    />
    <span className="text-muted-foreground pointer-events-none absolute inset-y-0 right-4 flex items-center text-sm">
      {unit}
    </span>
  </div>
)

interface CompanyInfoProps {
  /** 업종코드 조회 팝업을 연 채로 진입 (IA 9) */
  openIndustryCode?: boolean
}

const CompanyInfo = ({ openIndustryCode }: CompanyInfoProps) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    // 제출을 눌러 처음 검사한 뒤에는 입력할 때마다 다시 검사한다.
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      industryCode: "",
      businessYears: "",
      wasteDirect: "",
      processEmission: "",
      sales2019: "",
      sales2020: "",
      sales2021: "",
    },
  })

  const onSubmit = (values: FormValues) => {
    // TODO: 자가진단 저장 API 연동 후 다음 단계로 이동
    console.log(values)
  }

  return (
    <div className="flex w-full max-w-[1344px] flex-col md:gap-10 md:px-7 md:py-10 lg:px-8">
      <StepMobileNav
        title="기업 정보 입력"
        step={1}
        total={SELF_CHECK_STEPS.length}
      />

      <div className="flex flex-col gap-6 max-md:hidden lg:flex-row lg:items-center lg:justify-between lg:gap-8">
        <h2 className="text-lg font-bold whitespace-nowrap md:text-3xl lg:text-4xl">
          기업 정보 입력
        </h2>
        {/* Stepper 내부 ol 의 줄바꿈·폭을 밖에서 제어한다. 지우면 스테퍼가 접힌다. */}
        <div className="[&_ol]:flex-nowrap sm:w-full sm:[&_ol]:w-full sm:[&_ol>li]:flex-1 sm:[&_ol>li>div:nth-child(1)]:flex-1 sm:[&_ol>li>div:nth-child(3)]:flex-1 lg:w-[730px]">
          <Stepper items={SELF_CHECK_STEPS} activeIndex={0} size={13} />
        </div>
      </div>

      <BaseInfo items={NOTICES} />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          noValidate
          className="flex flex-col gap-10 max-md:px-5 max-md:pt-12 max-md:pb-10"
        >
          <section className="border-border flex flex-col gap-8 rounded-2xl border p-5 md:p-10">
            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-bold lg:text-2xl">기업 정보 입력</h3>
              <p className="text-muted-foreground text-sm lg:text-base">
                기업의 기본 정보를 입력해주세요
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 md:gap-x-12 md:gap-y-12">
              <FormField
                control={form.control}
                name="industryCode"
                render={({ field, fieldState }) => (
                  <FormItem className="flex flex-col gap-3">
                    <FormLabel
                      htmlFor="industry-code"
                      className="text-foreground"
                    >
                      업종코드
                    </FormLabel>
                    <IndustryCodeDialog defaultOpen={openIndustryCode}>
                      <Button
                        id="industry-code"
                        type="button"
                        variant="ghost"
                        isValid={!fieldState.error}
                        className="border-input hover:ring-ash-600 h-12 w-full justify-start rounded-md border px-3 text-sm font-semibold hover:ring-2"
                      >
                        {field.value || (
                          <span className="text-muted-foreground font-normal">
                            클릭하여 업종코드를 선택해주세요
                          </span>
                        )}
                      </Button>
                    </IndustryCodeDialog>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="businessYears"
                render={({ field, fieldState }) => (
                  <FormItem className="flex flex-col gap-3">
                    <FormLabel
                      htmlFor="business-years"
                      className="text-foreground"
                    >
                      업력
                    </FormLabel>
                    <FormControl>
                      <UnitField
                        id="business-years"
                        unit="년"
                        placeholder="100,000"
                        inputMode="numeric"
                        isValid={!fieldState.error}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {[
                {
                  name: "wasteDirect" as const,
                  label: "폐기물 직접 처리 여부",
                },
                {
                  name: "processEmission" as const,
                  label: "공정배출 해당여부",
                },
              ].map(({ name, label }) => (
                <FormField
                  key={name}
                  control={form.control}
                  name={name}
                  render={({ field, fieldState }) => (
                    <FormItem className="flex flex-col gap-3">
                      <FormLabel isNotNeedHtmlFor className="text-foreground">
                        {label}
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          name={name}
                          value={field.value}
                          onValueChange={field.onChange}
                          isValid={!fieldState.error}
                          className="flex flex-wrap gap-6 md:gap-14"
                        >
                          {YES_NO.map((option) => (
                            <div
                              key={option.value}
                              className="flex items-center gap-2"
                            >
                              <RadioGroupItem
                                value={option.value}
                                id={`${name}-${option.value}`}
                              />
                              <Label
                                htmlFor={`${name}-${option.value}`}
                                className="text-base font-medium"
                              >
                                {option.label}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}

              <div className="flex flex-col gap-3 md:col-span-2">
                <div className="flex flex-col gap-1">
                  <p className="text-base font-bold">직전 3개년 매출액</p>
                  <p className="text-muted-foreground text-xs">
                    최근 3개년도 매출액을 백만원 단위로 입력해주세요
                  </p>
                </div>
                <div className="flex flex-col gap-4 md:flex-row md:gap-3">
                  {SALES_YEARS.map((name) => (
                    <FormField
                      key={name}
                      control={form.control}
                      name={name}
                      render={({ field, fieldState }) => (
                        <FormItem className="flex flex-1 flex-col gap-2">
                          <FormLabel
                            htmlFor={name}
                            className="text-muted-foreground text-sm font-medium"
                          >
                            {SALES_LABELS[name]}
                          </FormLabel>
                          <FormControl>
                            <UnitField
                              id={name}
                              unit="백만원"
                              placeholder="100,000"
                              inputMode="numeric"
                              isValid={!fieldState.error}
                              {...field}
                              onChange={(event) =>
                                field.onChange(
                                  withThousandsComma(event.target.value),
                                )
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>

          <FormField
            control={form.control}
            name="agree"
            render={({ field, fieldState }) => (
              <FormItem className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <FormControl>
                    <Checkbox
                      id="agree"
                      name="agree"
                      checked={field.value ?? false}
                      onCheckedChange={field.onChange}
                      isValid={!fieldState.error}
                    />
                  </FormControl>
                  <Label
                    htmlFor="agree"
                    className="text-base font-medium break-keep"
                  >
                    입력한 정보에 대해 기술보증기금이 활용하는 것에 동의합니다
                  </Label>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex md:justify-end">
            <Button
              type="submit"
              size="lg"
              className="h-11 w-full font-bold [&_svg]:size-5 md:h-13 md:w-auto md:min-w-50"
            >
              다음으로
              <ArrowRight aria-hidden="true" />
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default CompanyInfo
