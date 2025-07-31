// ** Type Imports
import { OwnerStateThemeType } from '.'
import { ComponentTheme } from './type'

const Menu = (): Pick<ComponentTheme, 'MuiMenu'> => {
  const boxShadow = (theme: OwnerStateThemeType['theme']) => {
    if (theme.palette.mode === 'light') {
      return theme.shadows[8]
    } else return theme.shadows[9]
  }

  return {
    MuiMenu: {
      styleOverrides: {
        root: ({ theme }: OwnerStateThemeType) => ({
          '& .MuiMenu-paper': {
            borderRadius: 5,
            boxShadow: boxShadow(theme),
          },
        }),
      },
    },
  }
}

export default Menu
