// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { styled, useTheme } from '@mui/material/styles'

// ** Configs
import themeConfig from '@/core/configs/theme'

// ** Hook
import { useSettings } from '@/hooks/use-settings'
import { Box } from '@mui/material'
import Image from 'next/image'

const LinkStyled = styled(Link)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none',
  marginRight: theme.spacing(8),
}))

const BlankLayoutAppBar = () => {
  // ** Hooks & Vars
  const theme = useTheme()
  const { settings } = useSettings()
  const { skin } = settings

  return (
    <AppBar
      color="default"
      position="sticky"
      elevation={skin === 'bordered' ? 0 : 3}
      sx={{
        backgroundColor: 'background.paper',
        ...(skin === 'bordered' && {
          borderBottom: `1px solid ${theme.palette.divider}`,
        }),
      }}
    >
      <Toolbar
        sx={{
          justifyContent: 'space-between',
          p: (theme) => `${theme.spacing(0, 6)} !important`,
          minHeight: `${(theme.mixins.toolbar.minHeight as number) - (skin === 'bordered' ? 1 : 0)}px !important`,
        }}
      >
        <LinkStyled href="/">
          <Image src="/logo/logo-xs.png" width={40} height={40} alt="Logo" />
          <Box sx={{ ml: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography
              variant="subtitle1"
              className="gothic-a1"
              sx={{ lineHeight: '1rem', fontStyle: 'italic', fontWeight: 600 }}
            >
              {themeConfig.templateName.toUpperCase()}
            </Typography>
            <Typography variant="caption" className="gothic-a1" sx={{ lineHeight: '0.75rem' }} fontSize="0.5rem">
              {themeConfig.templateSubName}
            </Typography>
          </Box>
        </LinkStyled>
      </Toolbar>
    </AppBar>
  )
}

export default BlankLayoutAppBar
