import { useContext } from 'react'
import { SettingsContext, SettingsContextValue } from '../core/contexts/settings'

export const useSettings = (): SettingsContextValue => useContext(SettingsContext)
