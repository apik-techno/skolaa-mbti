// ** MUI Imports
import { ComponentsPropsList } from '@mui/material'
import { Theme } from '@mui/material/styles'

// ** Overrides Imports
import { useMemo } from 'react'
import MuiAccordion from './accordion'
import MuiAlerts from './alerts'
import MuiAutocomplete from './autocomplete'
import MuiAvatar from './avatars'
import MuiBackdrop from './backdrop'
import MuiBreadcrumb from './breadcrumbs'
import MuiButton from './button'
import MuiButtonGroup from './buttonGroup'
import MuiCard from './card'
import MuiChip from './chip'
import MuiDataGrid from './dataGrid'
import MuiDialog from './dialog'
import MuiDivider from './divider'
import MuiFab from './fab'
import MuiInput from './input'
import MuiLink from './link'
import MuiList from './list'
import MuiMenu from './menu'
import MuiPagination from './pagination'
import MuiPaper from './paper'
import MuiPopover from './popover'
import MuiProgress from './progress'
import MuiRating from './rating'
import MuiSelect from './select'
import MuiSnackbar from './snackbar'
import MuiSwitches from './switches'
import MuiTable from './table'
import MuiTabs from './tabs'
import MuiTimeline from './timeline'
import MuiToggleButton from './toggleButton'
import MuiTooltip from './tooltip'
import { ComponentTheme } from './type'
import MuiTypography from './typography'

// ** Type Import
export type OwnerStateThemeType = {
  theme: Theme
  ownerState: ComponentsPropsList[keyof ComponentsPropsList] & Record<string, unknown>
}

const ThemeOverrides = (): Partial<ComponentTheme> => {
  return useMemo(
    () => ({
      ...MuiFab(),
      ...MuiChip(),
      ...MuiList(),
      ...MuiMenu(),
      ...MuiTabs(),
      ...MuiCard(),
      ...MuiInput(),
      ...MuiSelect(),
      ...MuiAlerts(),
      ...MuiButton(),
      ...MuiDialog(),
      ...MuiRating(),
      ...MuiTable(),
      ...MuiAvatar(),
      ...MuiDivider(),
      ...MuiPopover(),
      ...MuiTooltip(),
      ...MuiLink(),
      ...MuiBackdrop(),
      ...MuiPaper(),
      ...MuiProgress(),
      ...MuiSwitches(),
      ...MuiTimeline(),
      ...MuiAccordion(),
      ...MuiPagination(),
      ...MuiAutocomplete(),
      ...MuiSnackbar(),
      ...MuiTypography(),
      ...MuiBreadcrumb(),
      ...MuiButtonGroup(),
      ...MuiToggleButton(),
      ...MuiDataGrid(),
    }),
    [],
  )
}

export default ThemeOverrides
