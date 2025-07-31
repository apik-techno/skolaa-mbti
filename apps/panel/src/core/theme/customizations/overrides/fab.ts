// ** Type Import
import { OwnerStateThemeType } from '.'
import { ComponentTheme } from './type'

const Fab = (): Pick<ComponentTheme, 'MuiFab'> => ({
  MuiFab: {
    styleOverrides: {
      root: ({ theme }: OwnerStateThemeType) => ({
        boxShadow: theme.shadows[5],
      }),
    },
  },
})

export default Fab
