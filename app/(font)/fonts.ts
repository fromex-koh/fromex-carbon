import localFont from "next/font/local"

/**
 * 확인서처럼 명조 계열 서체가 필요한 문서에 사용하는 프로젝트 내장 폰트.
 * 로컬 OS의 폰트 설치 여부와 관계없이 화면과 인쇄/PDF에 동일하게 적용된다.
 */
export const notoSerifKr = localFont({
  src: "./NotoSerifKR-Variable.ttf",
  display: "swap",
  style: "normal",
  weight: "200 900",
})
