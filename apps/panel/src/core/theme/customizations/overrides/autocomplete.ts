// ** Type Imports
import { OwnerStateThemeType } from '.'
import { ComponentTheme } from './type'

const Autocomplete = (): Pick<ComponentTheme, 'MuiAutocomplete'> => {
  return {
    MuiAutocomplete: {
      styleOverrides: {
        paper: ({ theme }: OwnerStateThemeType) => ({
          boxShadow: theme.shadows[6],
        }),
      },
    },
  }
}

export default Autocomplete
