// ** Type Import
import { OwnerStateThemeType } from '.'
import { ComponentTheme } from './type'

const Tabs = (): Pick<ComponentTheme, 'MuiTabs' | 'MuiTab'> => ({
  MuiTabs: {
    styleOverrides: {
      root: {
        minHeight: 'auto',
      },
      vertical: ({ theme }: OwnerStateThemeType) => ({
        minWidth: 130,
        marginRight: theme.spacing(4),
        borderRight: `1px solid ${theme.palette.divider}`,
        '& .MuiTab-root': {
          minWidth: 130,
        },
      }),
    },
  },
  MuiTab: {
    styleOverrides: {
      root: {
        lineHeight: 1.5,
        minHeight: '2rem !important',
        padding: '0.5rem 1rem',
      },
      textColorSecondary: ({ theme }: OwnerStateThemeType) => ({
        '&.Mui-selected': {
          color: theme.palette.text.secondary,
        },
      }),
    },
  },
})

export default Tabs
