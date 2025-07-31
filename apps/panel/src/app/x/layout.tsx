import MenuLayout from '@/core/layouts/MenuLayout'
import navigation from '@/navigation'
import React from 'react'

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <MenuLayout navItems={navigation()}> {children}</MenuLayout>
}
