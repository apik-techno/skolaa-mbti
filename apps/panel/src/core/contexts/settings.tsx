// ** React Imports
import { createContext, ReactNode, useEffect, useState } from 'react'

// ** MUI Imports
import { Direction } from '@mui/material'

// ** ThemeConfig Import
import themeConfig from '../configs/theme'

// ** Types Import
import { ThemeColor } from '@/types'
import { AppBar, ContentWidth, Footer, Mode, Skin, VerticalNavToggle } from '@/types/layout'
import { useTheme } from 'next-themes'

export type Settings = {
  modeToggle: boolean
  skin: Skin
  mode: Mode
  appBar?: AppBar
  footer?: Footer
  navHidden?: boolean // navigation menu
  appBarBlur: boolean
  direction: Direction
  navCollapsed: boolean
  themeColor: ThemeColor
  contentWidth: ContentWidth
  layout?: 'vertical' | 'horizontal'
  lastLayout?: 'vertical' | 'horizontal'
  verticalNavToggleType: VerticalNavToggle
  toastPosition?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'
}

export type PageSpecificSettings = {
  skin?: Skin
  mode?: Mode
  appBar?: AppBar
  footer?: Footer
  navHidden?: boolean // navigation menu
  appBarBlur?: boolean
  direction?: Direction
  navCollapsed?: boolean
  themeColor?: ThemeColor
  contentWidth?: ContentWidth
  layout?: 'vertical' | 'horizontal'
  lastLayout?: 'vertical' | 'horizontal'
  verticalNavToggleType?: VerticalNavToggle
  toastPosition?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'
}
export type SettingsContextValue = {
  settings: Settings
  saveSettings: (updatedSettings: Settings) => void
}

interface SettingsProviderProps {
  children: ReactNode
  modeToggle?: boolean
}

const initialSettings: Settings = {
  modeToggle: true,
  themeColor: themeConfig.themeColor,
  mode: themeConfig.mode,
  skin: themeConfig.skin,
  footer: themeConfig.footer,
  direction: themeConfig.direction,
  navHidden: themeConfig.navHidden,
  appBarBlur: themeConfig.appBarBlur,
  navCollapsed: themeConfig.navCollapsed,
  contentWidth: themeConfig.contentWidth,
  toastPosition: themeConfig.toastPosition,
  verticalNavToggleType: themeConfig.verticalNavToggleType,
  appBar: themeConfig.appBar === 'hidden' ? 'fixed' : themeConfig.appBar,
}

const staticSettings = {
  appBar: initialSettings.appBar,
  footer: initialSettings.footer,
  layout: initialSettings.layout,
  navHidden: initialSettings.navHidden,
  lastLayout: initialSettings.lastLayout,
  toastPosition: initialSettings.toastPosition,
}

const restoreSettings = ({ modeToggle }: { modeToggle: boolean }): Settings | null => {
  let settings = null

  try {
    const storedData: string | null = window.localStorage.getItem('settings')

    if (storedData) {
      settings = { ...JSON.parse(storedData), ...staticSettings, modeToggle }
    } else {
      settings = { ...initialSettings, modeToggle }
    }
  } catch (err) {
    console.error(err)
  }

  return settings
}

// set settings in localStorage
const storeSettings = (settings: Settings) => {
  const initSettings = Object.assign({}, settings)

  delete initSettings.appBar
  delete initSettings.footer
  delete initSettings.layout
  delete initSettings.navHidden
  delete initSettings.lastLayout
  delete initSettings.toastPosition
  window.localStorage.setItem('settings', JSON.stringify(initSettings))
}

// ** Create Context
export const SettingsContext = createContext<SettingsContextValue>({
  saveSettings: () => null,
  settings: initialSettings,
})

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children, modeToggle = true }) => {
  const [settings, setSettings] = useState<Settings>({
    ...initialSettings,
    modeToggle,
  })
  const { theme, setTheme } = useTheme()
  useEffect(() => {
    const currentTheme = theme as Mode
    setSettings((s) => ({ ...s, mode: currentTheme || 'light' }))
  }, [modeToggle, theme])
  const saveSettings = (updatedSettings: Settings) => {
    console.log('saveSettings', updatedSettings)
    setSettings(updatedSettings)
    if (updatedSettings.mode) setTheme(updatedSettings.mode)
  }

  return <SettingsContext.Provider value={{ settings, saveSettings }}>{children}</SettingsContext.Provider>
}

export const SettingsConsumer = SettingsContext.Consumer
