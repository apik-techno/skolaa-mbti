'use client'

import AclGuard from '@/core/components/auth/AclGuard'
import { SettingsConsumer, SettingsProvider } from '@/core/contexts/settings'
import ReactHotToast from '@/core/styles/react-hot-toast'
import AppTheme from '@/core/theme/AppTheme'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SessionProvider, SessionProviderProps } from 'next-auth/react'
import NextTopLoader from 'nextjs-toploader'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { useEffect, useState } from 'react'
import { Toaster } from 'react-hot-toast'

const Provider = ({ children, session }: { children: React.ReactNode; session: SessionProviderProps['session'] }) => {
  const [mounted, setMounted] = useState(false)
  const [queryClient] = useState(() => new QueryClient())

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <NuqsAdapter>
      <QueryClientProvider client={queryClient}>
        <SettingsProvider>
          <SettingsConsumer>
            {({ settings }) => {
              return (
                <AppTheme settings={settings}>
                  <NextTopLoader showSpinner={false} color="#e0a800" />
                  <SessionProvider session={session}>
                    <AclGuard>{children}</AclGuard>
                  </SessionProvider>
                  <ReactHotToast>
                    <Toaster position={settings.toastPosition} toastOptions={{ className: 'react-hot-toast' }} />
                  </ReactHotToast>
                </AppTheme>
              )
            }}
          </SettingsConsumer>
        </SettingsProvider>
      </QueryClientProvider>
    </NuqsAdapter>
  )
}

export default Provider
