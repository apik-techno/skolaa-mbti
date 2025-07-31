// ** Type Import
import { OwnerStateThemeType } from '.'

// ** Util Import
import { hexToRGBA } from '@/utils/hex-to-rgba'
import { ComponentTheme } from './type'

const Progress = (): Pick<ComponentTheme, 'MuiLinearProgress'> => {
  return {
    MuiLinearProgress: {
      styleOverrides: {
        root: ({ theme }: OwnerStateThemeType) => ({
          height: 6,
          borderRadius: theme.shape.borderRadius,
          '&.MuiLinearProgress-colorPrimary': {
            backgroundColor: hexToRGBA(theme.palette.primary.main, 0.12),
          },
          '&.MuiLinearProgress-colorSecondary': {
            backgroundColor: hexToRGBA(theme.palette.secondary.main, 0.12),
          },
          '&.MuiLinearProgress-colorSuccess': {
            backgroundColor: hexToRGBA(theme.palette.success.main, 0.12),
          },
          '&.MuiLinearProgress-colorError': {
            backgroundColor: hexToRGBA(theme.palette.error.main, 0.12),
          },
          '&.MuiLinearProgress-colorWarning': {
            backgroundColor: hexToRGBA(theme.palette.warning.main, 0.12),
          },
          '&.MuiLinearProgress-colorInfo': {
            backgroundColor: hexToRGBA(theme.palette.info.main, 0.12),
          },
        }),
        bar: ({ theme }: OwnerStateThemeType) => ({
          borderRadius: theme.shape.borderRadius,
        }),
      },
    },
  }
}

export default Progress
