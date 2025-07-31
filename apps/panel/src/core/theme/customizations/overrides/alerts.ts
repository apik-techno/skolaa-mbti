// ** MUI Imports
import { darken, lighten } from '@mui/material/styles'

// ** Type Import
import { Mode } from '@/types/layout'
import { OwnerStateThemeType } from '.'

// ** Util Import
import { hexToRGBA } from '@/utils/hex-to-rgba'
import { ComponentTheme } from './type'

const Alert = (): Pick<ComponentTheme, 'MuiAlert'> => {
  const getColor = (mode: Mode) => (mode === 'dark' ? lighten : darken)

  return {
    MuiAlert: {
      styleOverrides: {
        root: ({ theme }: OwnerStateThemeType) => ({
          borderRadius: 8,
          '& .MuiAlertTitle-root': {
            marginBottom: theme.spacing(1),
          },
          '& a': {
            fontWeight: 500,
            color: 'inherit',
          },
        }),
        standardSuccess: ({ theme }: OwnerStateThemeType) => ({
          color: getColor(theme.palette.mode)(theme.palette.success.main, 0.1),
          backgroundColor: hexToRGBA(theme.palette.success.main, 0.12),
          '& .MuiAlertTitle-root': {
            color: getColor(theme.palette.mode)(theme.palette.success.main, 0.1),
          },
          '& .MuiAlert-icon': {
            color: getColor(theme.palette.mode)(theme.palette.success.main, 0.1),
          },
        }),
        standardInfo: ({ theme }: OwnerStateThemeType) => ({
          color: getColor(theme.palette.mode)(theme.palette.info.main, 0.1),
          backgroundColor: hexToRGBA(theme.palette.info.main, 0.12),
          '& .MuiAlertTitle-root': {
            color: getColor(theme.palette.mode)(theme.palette.info.main, 0.1),
          },
          '& .MuiAlert-icon': {
            color: getColor(theme.palette.mode)(theme.palette.info.main, 0.1),
          },
        }),
        standardWarning: ({ theme }: OwnerStateThemeType) => ({
          color: getColor(theme.palette.mode)(theme.palette.warning.main, 0.1),
          backgroundColor: hexToRGBA(theme.palette.warning.main, 0.12),
          '& .MuiAlertTitle-root': {
            color: getColor(theme.palette.mode)(theme.palette.warning.main, 0.1),
          },
          '& .MuiAlert-icon': {
            color: getColor(theme.palette.mode)(theme.palette.warning.main, 0.1),
          },
        }),
        standardError: ({ theme }: OwnerStateThemeType) => ({
          color: getColor(theme.palette.mode)(theme.palette.error.main, 0.1),
          backgroundColor: hexToRGBA(theme.palette.error.main, 0.12),
          '& .MuiAlertTitle-root': {
            color: getColor(theme.palette.mode)(theme.palette.error.main, 0.1),
          },
          '& .MuiAlert-icon': {
            color: getColor(theme.palette.mode)(theme.palette.error.main, 0.1),
          },
        }),
        outlinedSuccess: ({ theme }: OwnerStateThemeType) => ({
          borderColor: theme.palette.success.main,
          color: getColor(theme.palette.mode)(theme.palette.success.main, 0.1),
          '& .MuiAlertTitle-root': {
            color: getColor(theme.palette.mode)(theme.palette.success.main, 0.1),
          },
          '& .MuiAlert-icon': {
            color: theme.palette.success.main,
          },
        }),
        outlinedInfo: ({ theme }: OwnerStateThemeType) => ({
          borderColor: theme.palette.info.main,
          color: getColor(theme.palette.mode)(theme.palette.info.main, 0.1),
          '& .MuiAlertTitle-root': {
            color: getColor(theme.palette.mode)(theme.palette.info.main, 0.1),
          },
          '& .MuiAlert-icon': {
            color: theme.palette.info.main,
          },
        }),
        outlinedWarning: ({ theme }: OwnerStateThemeType) => ({
          borderColor: theme.palette.warning.main,
          color: getColor(theme.palette.mode)(theme.palette.warning.main, 0.1),
          '& .MuiAlertTitle-root': {
            color: getColor(theme.palette.mode)(theme.palette.warning.main, 0.1),
          },
          '& .MuiAlert-icon': {
            color: theme.palette.warning.main,
          },
        }),
        outlinedError: ({ theme }: OwnerStateThemeType) => ({
          borderColor: theme.palette.error.main,
          color: getColor(theme.palette.mode)(theme.palette.error.main, 0.1),
          '& .MuiAlertTitle-root': {
            color: getColor(theme.palette.mode)(theme.palette.error.main, 0.1),
          },
          '& .MuiAlert-icon': {
            color: theme.palette.error.main,
          },
        }),
        filled: ({ theme }: OwnerStateThemeType) => ({
          fontWeight: 400,
          color: theme.palette.common.white,
        }),
      },
    },
  }
}

export default Alert
