'use client'

import { queryClient } from '@/utils/queryClient'
import { QueryClientProvider } from '@tanstack/react-query'

export function QueryProvider({
  children,
}: {
  readonly children: React.ReactNode
}) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
