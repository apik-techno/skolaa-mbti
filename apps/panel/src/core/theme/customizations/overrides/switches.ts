// ** Type Import
import { OwnerStateThemeType } from '.'
import { ComponentTheme } from './type'

const Switch = (): Pick<ComponentTheme, 'MuiSwitch'> => {
  return {
    MuiSwitch: {
      styleOverrides: {
        root: ({ theme }: OwnerStateThemeType) => ({
          '& .MuiSwitch-track': {
            borderRadius: theme.shape.borderRadius,
          },

          '& .MuiSwitch-switchBase': {
            '&:not(.Mui-checked)': {
              '& .MuiSwitch-thumb': {
                color: theme.palette.grey[50],
              },
            },
          },
          '& .Mui-disabled + .MuiSwitch-track': {
            backgroundColor: `rgb(${theme.palette.customColors.main})`,
          },
        }),
      },
    },
  }
}

export default Switch
