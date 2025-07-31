// ** MUI Imports
import MuiTimelineDot from '@mui/lab/TimelineDot'
import { useTheme } from '@mui/material/styles'

// ** Hooks Imports
import useBgColor, { UseBgColorType } from '@/hooks/use-bg-color'

// ** Util Import
import { hexToRGBA } from '@/utils/hex-to-rgba'

// ** Types
import { ColorsType, CustomTimelineDotProps } from './types'

const TimelineDot = (props: CustomTimelineDotProps) => {
  // ** Props
  const { sx, skin, color, variant } = props

  // ** Hook
  const theme = useTheme()
  const bgColors: UseBgColorType = useBgColor()

  const colors: ColorsType = {
    primary: {
      boxShadow: 'none',
      color: theme.palette.primary.main,
      backgroundColor: bgColors.primaryLight?.backgroundColor ?? theme.palette.primary.light,
    },
    secondary: {
      boxShadow: 'none',
      color: theme.palette.secondary.main,
      backgroundColor: bgColors.secondaryLight?.backgroundColor ?? theme.palette.secondary.light,
    },
    success: {
      boxShadow: 'none',
      color: theme.palette.success.main,
      backgroundColor: bgColors.successLight?.backgroundColor ?? theme.palette.success.light,
    },
    error: {
      boxShadow: 'none',
      color: theme.palette.error.main,
      backgroundColor: bgColors.errorLight?.backgroundColor ?? theme.palette.error.light,
    },
    warning: {
      boxShadow: 'none',
      color: theme.palette.warning.main,
      backgroundColor: bgColors.warningLight?.backgroundColor ?? theme.palette.warning.light,
    },
    info: {
      boxShadow: 'none',
      color: theme.palette.info.main,
      backgroundColor: bgColors.infoLight?.backgroundColor ?? theme.palette.info.light,
    },
    grey: {
      boxShadow: 'none',
      color: theme.palette.grey[500],
      backgroundColor: hexToRGBA(theme.palette.grey[500], 0.12),
    },
  }

  return (
    <MuiTimelineDot
      {...props}
      sx={color && skin === 'light' && variant === 'filled' && colors[color] ? Object.assign(colors[color], sx) : sx}
    />
  )
}

TimelineDot.defaultProps = {
  color: 'grey',
  variant: 'filled',
}

export default TimelineDot
