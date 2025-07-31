// ** Type Import
import { OwnerStateThemeType } from '.'

// ** Util Imports
import { hexToRGBA } from '@/utils/hex-to-rgba'
import { ComponentTheme } from './type'

const Chip = (): Pick<ComponentTheme, 'MuiChip'> => ({
  MuiChip: {
    styleOverrides: {
      root: {
        '&.MuiChip-rounded': {
          borderRadius: 4,
        },
      },
      outlined: ({ theme }: OwnerStateThemeType) => ({
        '&.MuiChip-colorDefault': {
          borderColor: `rgba(${theme.palette.customColors.main}, 0.22)`,
        },
      }),
      avatar: ({ theme }: OwnerStateThemeType) => ({
        color: theme.palette.text.primary,
      }),
      deletableColorPrimary: ({ theme }: OwnerStateThemeType) => ({
        '&.MuiChip-light .MuiChip-deleteIcon': {
          color: hexToRGBA(theme.palette.primary.main, 0.7),
          '&:hover': {
            color: theme.palette.primary.main,
          },
        },
      }),
      deletableColorSecondary: ({ theme }: OwnerStateThemeType) => ({
        '&.MuiChip-light .MuiChip-deleteIcon': {
          color: hexToRGBA(theme.palette.secondary.main, 0.7),
          '&:hover': {
            color: theme.palette.secondary.main,
          },
        },
      }),
    },
  },
})

export default Chip
