// ** React Imports
import { ElementType, Fragment } from 'react'

// ** Next Imports
import { usePathname, useRouter } from 'next/navigation'

// ** MUI Imports
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import List from '@mui/material/List'
import MuiListItem, { ListItemProps } from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import { styled } from '@mui/material/styles'

// ** Third Party Imports
import clsx from 'clsx'

// ** Theme Config Import
import themeConfig from '@/core/configs/theme'

// ** Types
import { Settings } from '@/core/contexts/settings'
import { NavLink } from '@/types/layout'

// ** Custom Components Imports
import CanViewNavLink from '@/core/components/acl/CanViewNavLink'
import UserIcon from '@/core/components/icon/UserIcon'

// ** Util Imports
import { hexToRGBA } from '@/utils/hex-to-rgba'
import { handleURLQueries } from '@/utils/layout'
import Link from 'next/link'

interface Props {
  item: NavLink
  settings: Settings
  hasParent: boolean
}

const ListItem = styled(MuiListItem)<
  ListItemProps & { component?: ElementType; href: string; target?: '_blank' | undefined }
>(({ theme }) => ({
  width: 'auto',
  paddingTop: theme.spacing(2.25),
  color: theme.palette.text.primary,
  paddingBottom: theme.spacing(2.25),
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
  '&.active, &.active:hover': {
    backgroundColor: hexToRGBA(theme.palette.primary.main, 0.08),
  },
  '&.active .MuiTypography-root, &.active .MuiListItemIcon-root': {
    color: theme.palette.primary.main,
  },
  '&:focus-visible': {
    outline: 0,
    backgroundColor: theme.palette.action.focus,
  },
}))

const HorizontalNavLink = (props: Props) => {
  // ** Props
  const { item, settings, hasParent } = props

  // ** Hook & Vars
  const router = useRouter()
  const pathname = usePathname()
  const { navSubItemIcon, menuTextTruncate } = themeConfig

  const icon = item.icon ? item.icon : navSubItemIcon

  const Wrapper = !hasParent ? List : Fragment

  const isNavLinkActive = () => {
    if (pathname === item.path || handleURLQueries(item.path)) {
      return true
    } else {
      return false
    }
  }

  return (
    <CanViewNavLink navLink={item}>
      <Wrapper {...(!hasParent ? { component: 'div', sx: { py: settings.skin === 'bordered' ? 2.625 : 2.75 } } : {})}>
        <ListItem
          component={Link}
          // @ts-ignore
          disabled={item.disabled || false}
          {...(item.disabled && { tabIndex: -1 })}
          className={clsx({ active: isNavLinkActive() })}
          target={item.openInNewTab ? '_blank' : undefined}
          href={item.path === undefined ? '/' : `${item.path}`}
          onClick={(e) => {
            if (item.path === undefined) {
              e.preventDefault()
              e.stopPropagation()
            }
          }}
          sx={{
            ...(item.disabled ? { pointerEvents: 'none' } : { cursor: 'pointer' }),
            ...(!hasParent
              ? {
                  borderRadius: '8px',
                  '&.active, &.active:hover': {
                    backgroundColor: 'primary.main',
                    '&:focus-visible': { backgroundColor: 'primary.dark' },
                    '& .MuiTypography-root, & .MuiListItemIcon-root': {
                      color: 'common.white',
                    },
                  },
                }
              : {
                  '&.active, &.active:hover': {
                    '&:focus-visible': {
                      backgroundColor: (theme) => hexToRGBA(theme.palette.primary.main, 0.24),
                    },
                  },
                }),
          }}
        >
          <Box sx={{ gap: 2, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                ...(menuTextTruncate && { overflow: 'hidden' }),
              }}
            >
              <ListItemIcon sx={{ mr: hasParent ? 3 : 2.5, color: 'text.primary' }}>
                <UserIcon icon={icon} fontSize={icon === navSubItemIcon ? '0.5rem' : '1.5rem'} />
              </ListItemIcon>
            </Box>
            {item.badgeContent ? (
              <Chip
                size="small"
                label={item.badgeContent}
                color={item.badgeColor || 'primary'}
                sx={{ '& .MuiChip-label': { px: 2.5, lineHeight: 1.385, textTransform: 'capitalize' } }}
              />
            ) : null}
          </Box>
        </ListItem>
      </Wrapper>
    </CanViewNavLink>
  )
}

export default HorizontalNavLink
