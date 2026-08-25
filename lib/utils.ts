import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * 조건부 클래스명을 합치고 Tailwind 클래스 충돌을 뒤쪽 값 우선으로 정리한다.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
