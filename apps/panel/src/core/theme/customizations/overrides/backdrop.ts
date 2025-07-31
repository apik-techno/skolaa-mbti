// ** Type Import
import { OwnerStateThemeType } from '.'

// ** Util Import
import { hexToRGBA } from '@/utils/hex-to-rgba'
import { ComponentTheme } from './type'

const Backdrop = (): Pick<ComponentTheme, 'MuiBackdrop'> => {
  return {
    MuiBackdrop: {
      styleOverrides: {
        root: ({ theme }: OwnerStateThemeType) => ({
          backgroundColor: theme.palette.mode === 'light' ? hexToRGBA('#ffffff', 0.4) : hexToRGBA('#000000', 0.4),
        }),
        invisible: {
          backgroundColor: 'transparent',
        },
      },
    },
  }
}

export default Backdrop
