// ** MUI Imports
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'

// ** Icon Imports
import Icon from '@/core/components/icon'

// ** Type Import
import { Settings } from '@/core/contexts/settings'

// ** Components
import IconifyIcon from '@/core/icon'
import ModeToggler from '@/core/layouts/shared-components/ModeToggler'

// ** Hook Import

interface Props {
  hidden: boolean
  settings: Settings
  saveSettings: (updatedSettings: Settings) => void
  toggleNavVisibility: () => void
  onLogout?: () => void
}

const AppBarContent = (props: Props) => {
  // ** Props
  const { hidden, toggleNavVisibility, settings, saveSettings, onLogout } = props
  const onChangeMode = (data: Settings) => {
    saveSettings(data)
  }
  return (
    <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Box className="actions-left" sx={{ mr: 2, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {hidden && !settings.navHidden ? (
          <IconButton color="inherit" sx={{ ml: -2.75 }} onClick={toggleNavVisibility}>
            <Icon icon="mdi:menu" />
          </IconButton>
        ) : null}
      </Box>
      <Box className="actions-right" sx={{ display: 'flex', alignItems: 'center' }}>
        <ModeToggler settings={settings} saveSettings={onChangeMode} />
        <IconButton color="inherit" sx={{ ml: 2 }} onClick={onLogout}>
          <IconifyIcon icon="mdi:logout" />
        </IconButton>
      </Box>
    </Box>
  )
}

export default AppBarContent
