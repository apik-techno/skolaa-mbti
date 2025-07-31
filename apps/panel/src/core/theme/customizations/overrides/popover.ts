// ** Type Imports
import { OwnerStateThemeType } from '.'
import { ComponentTheme } from './type'

const Popover = (): Pick<ComponentTheme, 'MuiPopover'> => {
  return {
    MuiPopover: {
      styleOverrides: {
        root: ({ theme }: OwnerStateThemeType) => ({
          '& .MuiPopover-paper': {
            boxShadow: theme.shadows[6],
          },
        }),
      },
    },
  }
}

export default Popover
