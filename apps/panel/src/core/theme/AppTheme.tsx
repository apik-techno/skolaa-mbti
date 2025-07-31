// ** React Imports
import { ReactNode } from 'react'

// ** MUI Imports
import CssBaseline from '@mui/material/CssBaseline'
import GlobalStyles from '@mui/material/GlobalStyles'
import { ThemeProvider, createTheme } from '@mui/material/styles'

// ** Type Imports
import { Settings } from '@/core/contexts/settings'

// ** Theme
import options from './options'

// ** Global Styles
import GlobalStyling from './globalStyles'

interface Props {
  settings: Settings
  children: ReactNode
}

const AppTheme = (props: Props) => {
  // ** Props
  const { settings, children } = props

  // ** Pass merged options (of core and user) to createTheme function
  const theme = createTheme(options(settings))

  return (
    <ThemeProvider theme={theme} disableTransitionOnChange>
      <CssBaseline />
      <GlobalStyles styles={() => GlobalStyling(theme)} />
      {children}
    </ThemeProvider>
  )
}

export default AppTheme
