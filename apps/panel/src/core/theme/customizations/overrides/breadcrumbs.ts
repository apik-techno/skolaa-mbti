// ** Type Import
import { OwnerStateThemeType } from '.'
import { ComponentTheme } from './type'

const Breadcrumbs = (): Pick<ComponentTheme, 'MuiBreadcrumbs'> => {
  return {
    MuiBreadcrumbs: {
      styleOverrides: {
        root: ({ theme }: OwnerStateThemeType) => ({
          '& a': {
            textDecoration: 'none',
            color: theme.palette.primary.main,
          },
        }),
        li: ({ theme }: OwnerStateThemeType) => ({
          color: theme.palette.text.secondary,
          '& > .MuiLink-root': {
            textDecoration: 'none',
          },
          '& .MuiTypography-root': {
            color: 'inherit',
          },
        }),
      },
    },
  }
}

export default Breadcrumbs
