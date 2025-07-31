import { ComponentTheme } from './type'

const Paper = (): Pick<ComponentTheme, 'MuiPaper'> => ({
  MuiPaper: {
    styleOverrides: {
      root: {
        backgroundImage: 'none',
      },
    },
  },
})

export default Paper
