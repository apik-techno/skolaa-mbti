import { Components, Theme } from '@mui/material'

export type ComponentTheme = Components<Omit<Theme, 'components'>>
