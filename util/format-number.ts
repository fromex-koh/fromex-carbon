/**
 * 숫자 문자열에 천 단위 쉼표를 찍는다. 숫자 외 문자는 버린다.
 *
 * 쓰는 곳
 * - 자가진단 STEP 1 매출액 입력 (정수)
 * - 자가진단 STEP 2 배출량 입력 (decimal: true — 소수점 이하 유지)
 */
export const withThousandsComma = (
  value: string,
  { decimal = false }: { decimal?: boolean } = {},
) => {
  const cleaned = value.replace(decimal ? /[^0-9.]/g : /[^0-9]/g, "")
  const [head, ...rest] = cleaned.split(".")
  const comma = head.replace(/\B(?=(\d{3})+(?!\d))/g, ",")

  return rest.length > 0 ? `${comma}.${rest.join("")}` : comma
}
