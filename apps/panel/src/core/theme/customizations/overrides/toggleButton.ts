import { ComponentTheme } from './type'

const Tooggle = (): Pick<ComponentTheme, 'MuiToggleButtonGroup' | 'MuiToggleButton'> => ({
  MuiToggleButtonGroup: {
    styleOverrides: {
      root: {
        borderRadius: 8,
      },
    },
  },
  MuiToggleButton: {
    styleOverrides: {
      root: {
        borderRadius: 8,
      },
    },
  },
})

export default Tooggle
