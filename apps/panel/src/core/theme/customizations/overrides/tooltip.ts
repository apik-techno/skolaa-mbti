// ** Type Import
import { OwnerStateThemeType } from '.'

// ** Util Import
import { hexToRGBA } from '@/utils/hex-to-rgba'
import { ComponentTheme } from './type'

const Tooltip = (): Pick<ComponentTheme, 'MuiTooltip'> => {
  return {
    MuiTooltip: {
      styleOverrides: {
        tooltip: ({ theme }: OwnerStateThemeType) => ({
          marginTop: '4px !important',
          borderRadius: 6,
          lineHeight: 1.455,
          backgroundColor: hexToRGBA(theme.palette.customColors.tooltipBg, 0.9),
        }),
        arrow: ({ theme }: OwnerStateThemeType) => ({
          color: hexToRGBA(theme.palette.customColors.tooltipBg, 0.9),
        }),
      },
    },
  }
}

export default Tooltip
