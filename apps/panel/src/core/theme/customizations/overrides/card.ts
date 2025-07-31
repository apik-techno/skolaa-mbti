// ** Type Imports
import { OwnerStateThemeType } from '.'
import { ComponentTheme } from './type'

const Card = (): Pick<ComponentTheme, 'MuiCard' | 'MuiCardHeader' | 'MuiCardContent' | 'MuiCardActions'> => {
  return {
    MuiCard: {
      styleOverrides: {
        root: ({ theme }: OwnerStateThemeType) => ({
          borderRadius: '0.5rem',
          '& .card-more-options': {
            marginTop: theme.spacing(-1),
            marginRight: theme.spacing(-3),
          },
          '& .MuiTableContainer-root, & .MuiDataGrid-root, & .MuiDataGrid-columnHeaders': {
            borderRadius: 0,
          },
        }),
      },
      defaultProps: {
        elevation: 6,
      },
    },
    MuiCardHeader: {
      styleOverrides: {
        root: ({ theme }: OwnerStateThemeType) => ({
          padding: '0.75rem 1.25rem',
          paddingBottom: '0.75rem !important',
          '& + .MuiCardContent-root, & + .MuiCardActions-root, & + .MuiCollapse-root .MuiCardContent-root': {
            paddingTop: 0,
          },
          pb: 4,
          '& .MuiCardHeader-subheader': {
            fontSize: '0.875rem',
            color: theme.palette.text.secondary,
          },
        }),
        title: {
          fontWeight: 600,
          fontSize: '1.125rem',
          letterSpacing: '0.15px',
          lineHeight: '38px',
          '@media (min-width: 600px)': {
            fontSize: '1.25rem',
          },
        },
        action: {
          marginTop: 0,
          marginRight: 0,
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: ({ theme }: OwnerStateThemeType) => ({
          padding: '0.75rem 1.25rem',
          paddingBottom: '0.75rem !important',
          '& + .MuiCardHeader-root, & + .MuiCardContent-root, & + .MuiCardActions-root': {
            paddingTop: 0,
          },
          '&:last-of-type': {
            paddingBottom: theme.spacing(5),
          },
        }),
      },
    },
    MuiCardActions: {
      styleOverrides: {
        root: ({ theme }: OwnerStateThemeType) => ({
          padding: theme.spacing(5),
          '& .MuiButton-text': {
            paddingLeft: theme.spacing(2.5),
            paddingRight: theme.spacing(2.5),
          },
          '&.card-action-dense': {
            padding: theme.spacing(0, 2.5, 2.5),
            '.MuiCard-root .MuiCardMedia-root + &': {
              paddingTop: theme.spacing(2.5),
            },
          },
          '.MuiCard-root &:first-of-type': {
            paddingTop: theme.spacing(2.5),
            '& + .MuiCardHeader-root, & + .MuiCardContent-root, & + .MuiCardActions-root': {
              paddingTop: 0,
            },
          },
        }),
      },
    },
  }
}

export default Card
