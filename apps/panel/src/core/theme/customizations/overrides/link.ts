import CustomLink from '../custom/link'

import { ComponentTheme } from './type'
const Link = (): Pick<ComponentTheme, 'MuiLink'> => ({
  MuiLink: {
    styleOverrides: {
      root: {
        textDecorationColor: 'transparent',
      },
    },
    defaultProps: {
      component: CustomLink,
    },
  },
})

export default Link
