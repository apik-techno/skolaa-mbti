// ** Type Import
import { OwnerStateThemeType } from '.'
import { ComponentTheme } from './type'

const List = (): Pick<
  ComponentTheme,
  'MuiListItemIcon' | 'MuiListItemAvatar' | 'MuiListItemText' | 'MuiListSubheader'
> => ({
  MuiListItemIcon: {
    styleOverrides: {
      root: ({ theme }: OwnerStateThemeType) => ({
        minWidth: '0 !important',
        marginRight: theme.spacing(3),
        color: theme.palette.text.secondary,
      }),
    },
  },
  MuiListItemAvatar: {
    styleOverrides: {
      root: ({ theme }: OwnerStateThemeType) => ({
        minWidth: 0,
        marginRight: theme.spacing(4),
      }),
    },
  },
  MuiListItemText: {
    styleOverrides: {
      dense: ({ theme }: OwnerStateThemeType) => ({
        '& .MuiListItemText-primary': {
          color: theme.palette.text.primary,
        },
        '& .MuiListItemText-primary, & .MuiListItemText-secondary': {
          lineHeight: 1.43,
        },
      }),
    },
  },
  MuiListSubheader: {
    styleOverrides: {
      root: ({ theme }: OwnerStateThemeType) => ({
        fontWeight: 600,
        textTransform: 'uppercase',
        color: theme.palette.text.primary,
      }),
    },
  },
})
export default List
