'use client'

import { getBaseUrl } from '@/constants'
import { trpc } from '@/server/client'
import { transformer } from '@/server/transformer'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { httpLink } from '@trpc/react-query'
import { useState } from 'react'

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())
  const [trpcClient] = useState(
    trpc.createClient({ links: [httpLink({ transformer, url: `${getBaseUrl()}/api/trpc` })] }),
  )
  if (!trpcClient) {
    return <div>Loading...</div>
  }
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  )
}
