"use client"
import React from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

interface QueryProviderProps {
  children: React.ReactNode
}

const client = new QueryClient()

const QueryProvider = ({ children }: QueryProviderProps) => {
  return (
    <QueryClientProvider client={client}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default QueryProvider
