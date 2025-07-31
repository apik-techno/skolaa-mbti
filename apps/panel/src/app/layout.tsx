import { auth } from '@/auth'
import Providers from '@/components/providers/main-providers'
import QueryProvider from '@/components/providers/query-provider'
import type { Metadata } from 'next'
import { Lato } from 'next/font/google'
import NextTopLoader from 'nextjs-toploader'
import './globals.css'

export const metadata: Metadata = {
  title: 'Skolaa - Dashboard',
  description: 'Manage skolaa content and settings',
}

const lato = Lato({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  display: 'swap',
})

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  return (
    <html lang="en" className={`${lato.className}`} suppressHydrationWarning>
      <body>
        <NextTopLoader showSpinner={false} />
        <Providers session={session}>
          <QueryProvider>{children}</QueryProvider>
        </Providers>
      </body>
    </html>
  )
}
