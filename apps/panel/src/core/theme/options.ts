// ** MUI Theme Provider
import { ThemeOptions } from '@mui/material'

// ** Type Import
import { Settings } from '@/core/contexts/settings'

// ** Theme Override Imports
import breakpoints from './customizations/breakpoints'
import overrides from './customizations/overrides'
import palette from './customizations/palette'
import shadows from './customizations/shadows'
import spacing from './customizations/spacing'
import typography from './customizations/typography'

const themeOptions = (settings: Settings): ThemeOptions => {
  // ** Vars
  const { mode, direction, themeColor } = settings

  const baseThemeConfig: ThemeOptions = {
    breakpoints: breakpoints(),
    direction,
    components: overrides(),
    palette: palette(mode),
    ...spacing,
    shape: {
      borderRadius: 10,
    },
    mixins: {
      toolbar: {
        minHeight: 64,
      },
    },
    shadows: shadows(mode),
    typography,
  }

  // Tambahkan properti primary palette tanpa deepmerge
  if (baseThemeConfig.palette) {
    baseThemeConfig.palette.primary = {
      ...(baseThemeConfig.palette[themeColor] || palette(mode).primary),
    }
  }

  return baseThemeConfig
}

export default themeOptions
