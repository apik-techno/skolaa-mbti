import { Settings } from '@/core/contexts/settings'

export type ThemeColor = 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success'

export type ContentWidth = 'full' | 'boxed'

export type NavLink = {
  path?: string
  title: string
  action?: string
  subject?: string
  disabled?: boolean
  badgeContent?: string
  externalLink?: boolean
  openInNewTab?: boolean
  icon?: string | string[] | React.ReactNode
  badgeColor?: 'default' | 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info'
}

export type NavSectionTitle = {
  sectionTitle: string
  action?: string
  subject?: string
}

export type VerticalNavItemsType = (NavLink | NavSectionTitle)[]

export type LayoutProps = {
  hidden: boolean
  settings: Settings
  children: React.ReactNode
  verticalNavItems?: VerticalNavItemsType
  scrollToTop?: (props?: any) => React.ReactNode
  saveSettings: (values: Settings) => void
  footerContent?: (props?: any) => React.ReactNode
  verticalAppBarContent?: (props?: any) => React.ReactNode
  verticalNavMenuContent?: (props?: any) => React.ReactNode
  verticalNavMenuBranding?: (props?: any) => React.ReactNode
  afterVerticalNavMenuContent?: (props?: any) => React.ReactNode
  beforeVerticalNavMenuContent?: (props?: any) => React.ReactNode
}

export type BlankLayoutProps = {
  children: React.ReactNode
}

export type AuthUserData = {
  id: string
  name: string
  identity: string
}
export type AuthEmployeeData = {
  id: string
  name: string
}
export type AppSession = {
  user: AuthUserData | null
  role: string | null
}

export type AuthSessionData = {
  user?: AuthUserData
  student?: AuthUserData
  role?: string
}
