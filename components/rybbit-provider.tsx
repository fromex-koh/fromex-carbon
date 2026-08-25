"use client"
import { useEffect } from "react"
import rybbit from "@rybbit/js"

let initialized = false

const RybbitProvider = () => {
  useEffect(() => {
    if (initialized) {
      return
    }
    initialized = true

    void rybbit.init({
      analyticsHost: `${process.env.NEXT_PUBLIC_BASE_PATH}${process.env.NEXT_PUBLIC_RYBBIT_ANALYTICS_HOST}`,
      siteId: process.env.NEXT_PUBLIC_RYBBIT_SITEID!,
    })

    return () => rybbit.cleanup()
  }, [])

  return null
}

export default RybbitProvider
