import { ComponentTheme } from './type'

const BtnGroup = (): Pick<ComponentTheme, 'MuiButtonGroup'> => ({
  MuiButtonGroup: {
    styleOverrides: {
      root: {
        borderRadius: 8,
      },
    },
  },
})

export default BtnGroup
