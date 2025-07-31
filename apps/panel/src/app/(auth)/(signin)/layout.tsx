import { checkMe } from '@/utils/auth'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Authentication | Sign In',
  description: 'Sign In page for authentication.',
}
export default async function Layout({ children }: { children: React.ReactNode }) {
  const redirectPath = await checkMe(true)
  if (redirectPath) redirect(redirectPath)
  return children
}
