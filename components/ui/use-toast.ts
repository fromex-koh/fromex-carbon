"use client"
import { toast as sonnerToast, ExternalToast } from "sonner"

const toast = (message: string | React.ReactNode, options?: ExternalToast) => {
  const defaultOptions: ExternalToast = {
    classNames: {
      title: "font-extrabold",
      icon: "w-4 h-4",
    },
    richColors: false,
    ...options,
  }

  return sonnerToast(message, defaultOptions)
}

// 각 toast 타입별 함수 추가
toast.success = (
  message: string | React.ReactNode,
  options?: ExternalToast,
) => {
  const defaultOptions: ExternalToast = {
    classNames: {
      title: "font-extrabold",
      icon: "w-4 h-4 text-green-600",
    },
    richColors: false,
    ...options,
  }

  return sonnerToast.success(message, defaultOptions)
}

toast.warning = (
  message: string | React.ReactNode,
  options?: ExternalToast,
) => {
  const defaultOptions: ExternalToast = {
    classNames: {
      title: "font-extrabold",
      icon: "w-4 h-4 text-yellow-500",
    },
    richColors: false,
    ...options,
  }

  return sonnerToast.warning(message, defaultOptions)
}

toast.error = (message: string | React.ReactNode, options?: ExternalToast) => {
  const defaultOptions: ExternalToast = {
    classNames: {
      title: "font-extrabold",
      icon: "w-4 h-4 text-red-500",
    },
    richColors: false,
    ...options,
  }

  return sonnerToast.error(message, defaultOptions)
}

toast.info = (message: string | React.ReactNode, options?: ExternalToast) => {
  const defaultOptions: ExternalToast = {
    classNames: {
      title: "font-extrabold",
      icon: "w-4 h-4 text-blue-500",
    },
    richColors: false,
    ...options,
  }

  return sonnerToast.info(message, defaultOptions)
}

export default toast
