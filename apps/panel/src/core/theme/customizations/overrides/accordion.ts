// ** Type Import
import { OwnerStateThemeType } from '.'

// ** Hook Import
import { ComponentTheme } from './type'

const Accordion = (): Pick<ComponentTheme, 'MuiAccordion' | 'MuiAccordionSummary' | 'MuiAccordionDetails'> => {
  return {
    MuiAccordion: {
      styleOverrides: {
        root: ({ ownerState, theme }: OwnerStateThemeType) => ({
          boxShadow: theme.shadows[1],
          '&:first-of-type': {
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
          },
          '&:last-of-type': {
            borderBottomLeftRadius: 8,
            borderBottomRightRadius: 8,
          },
          ...(ownerState.disabled === true && {
            backgroundColor: `rgba(${theme.palette.customColors.main}, 0.12)`,
          }),
          ...(ownerState.expanded === true && {
            boxShadow: theme.shadows[3],
            '&:not(:first-of-type)': { borderTop: `1px solid ${theme.palette.divider}` },
          }),
        }),
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: ({ ownerState, theme }: OwnerStateThemeType) => ({
          minHeight: 50,
          borderRadius: 'inherit',
          padding: `0 ${theme.spacing(5)}`,
          ...(ownerState.expanded === true && {
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
          }),
          '& + .MuiCollapse-root': {
            '& .MuiAccordionDetails-root:first-of-type': {
              paddingTop: 0,
            },
          },
        }),
        content: ({ theme }: OwnerStateThemeType) => ({
          margin: `${theme.spacing(2.5)} 0`,
        }),
      },
    },
    MuiAccordionDetails: {
      styleOverrides: {
        root: ({ theme }: OwnerStateThemeType) => ({
          padding: theme.spacing(5),
          '& + .MuiAccordionDetails-root': {
            paddingTop: 0,
          },
        }),
      },
    },
  }
}

export default Accordion
