// ** React Import
import { useRef, useState } from 'react'

// ** MUI Imports
import Box, { BoxProps } from '@mui/material/Box'
import List from '@mui/material/List'
import { styled } from '@mui/material/styles'

//
import PerfectScrollbar from 'react-perfect-scrollbar'

// ** Type Import
import { LayoutProps } from '@/types/layout'

// ** Theme Config
import themeConfig from '@/core/configs/theme'

// ** Component Imports
import VerticalNavItems from './VerticalNavItems'

// ** Theme Options

// ** Util Import
import { hexToRGBA } from '../../../../utils/hex-to-rgba'
import Drawer from './Drawer'
import VerticalNavHeader from './VerticalNavHeader'

interface Props {
  navWidth: number
  navVisible: boolean
  collapsedNavWidth: number
  hidden: LayoutProps['hidden']
  navigationBorderWidth: number
  toggleNavVisibility: () => void
  settings: LayoutProps['settings']
  children: LayoutProps['children']
  setNavVisible: (value: boolean) => void
  saveSettings: LayoutProps['saveSettings']
  navMenuContent: LayoutProps['verticalLayoutProps']['navMenu']['content']
  navMenuBranding: LayoutProps['verticalLayoutProps']['navMenu']['branding']
  menuLockedIcon: LayoutProps['verticalLayoutProps']['navMenu']['lockedIcon']
  verticalNavItems: LayoutProps['verticalLayoutProps']['navMenu']['navItems']
  navMenuProps: LayoutProps['verticalLayoutProps']['navMenu']['componentProps']
  menuUnlockedIcon: LayoutProps['verticalLayoutProps']['navMenu']['unlockedIcon']
  afterNavMenuContent: LayoutProps['verticalLayoutProps']['navMenu']['afterContent']
  beforeNavMenuContent: LayoutProps['verticalLayoutProps']['navMenu']['beforeContent']
}

const StyledBoxForShadow = styled(Box)<BoxProps>(({ theme }) => ({
  top: 60,
  left: -8,
  zIndex: 2,
  opacity: 0,
  position: 'absolute',
  pointerEvents: 'none',
  width: 'calc(100% + 15px)',
  height: theme.mixins.toolbar.minHeight,
  transition: 'opacity .15s ease-in-out',
  background: `linear-gradient(${theme.palette.background.default} ${
    theme.direction === 'rtl' ? '95%' : '5%'
  },${hexToRGBA(theme.palette.background.default, 0.85)} 30%,${hexToRGBA(
    theme.palette.background.default,
    0.5,
  )} 65%,${hexToRGBA(theme.palette.background.default, 0.3)} 75%,transparent)`,
  '&.scrolled': {
    opacity: 1,
  },
}))

const Navigation = (props: Props) => {
  // ** Props
  const { hidden, afterNavMenuContent, beforeNavMenuContent, navMenuContent: userNavMenuContent } = props

  // ** States
  const [navHover, setNavHover] = useState<boolean>(false)
  const [groupActive, setGroupActive] = useState<string[]>([])
  const [currentActiveGroup, setCurrentActiveGroup] = useState<string[]>([])

  // ** Ref
  const shadowRef = useRef(null)

  // ** Var
  const { afterVerticalNavMenuContentPosition, beforeVerticalNavMenuContentPosition } = themeConfig

  const navMenuContentProps = {
    ...props,
    navHover,
    groupActive,
    setGroupActive,
    currentActiveGroup,
    setCurrentActiveGroup,
  }

  // ** Fixes Navigation InfiniteScroll
  const handleInfiniteScroll = (ref: HTMLElement) => {
    if (ref) {
      // Store the original `getBoundingClientRect` function
      const originalGetBoundingClientRect = ref.getBoundingClientRect.bind(ref)

      // Override `getBoundingClientRect`
      ref.getBoundingClientRect = () => {
        const original = originalGetBoundingClientRect()
        return { ...original, height: Math.floor(original.height) }
      }
    }
  }

  // ** Scroll Menu
  const scrollMenu = (container: any) => {
    // Use `container.target` for hidden elements; otherwise, use the container itself
    const scrollContainer = hidden ? container.target : container

    if (beforeVerticalNavMenuContentPosition === 'static' || !beforeNavMenuContent) {
      if (scrollContainer.scrollTop > 0) {
        // Add 'scrolled' class if the container is scrolled down
        // @ts-ignore
        shadowRef?.current?.classList.add('scrolled')
      } else {
        // Remove 'scrolled' class if at the top
        // @ts-ignore
        shadowRef?.current?.classList.remove('scrolled')
      }
    }
  }

  const ScrollWrapper = hidden ? Box : PerfectScrollbar

  return (
    <Drawer {...props} navHover={navHover} setNavHover={setNavHover}>
      <VerticalNavHeader {...props} navHover={navHover} />
      {beforeNavMenuContent && beforeVerticalNavMenuContentPosition === 'fixed'
        ? beforeNavMenuContent(navMenuContentProps)
        : null}
      {(beforeVerticalNavMenuContentPosition === 'static' || !beforeNavMenuContent) && (
        <StyledBoxForShadow ref={shadowRef} />
      )}
      <Box sx={{ position: 'relative', overflow: 'hidden' }}>
        {/* @ts-ignore */}
        <ScrollWrapper
          {...(hidden
            ? {
                onScroll: (container: any) => scrollMenu(container),
                sx: { height: '100%', overflowY: 'auto', overflowX: 'hidden' },
              }
            : {
                options: { wheelPropagation: false },
                onScrollY: (container: any) => scrollMenu(container),
                containerRef: (ref: any) => handleInfiniteScroll(ref),
              })}
        >
          {beforeNavMenuContent && beforeVerticalNavMenuContentPosition === 'static'
            ? beforeNavMenuContent(navMenuContentProps)
            : null}
          {userNavMenuContent ? (
            userNavMenuContent(navMenuContentProps)
          ) : (
            <List className="nav-items" sx={{ pt: 0, '& > :first-of-type': { mt: '0' } }}>
              <VerticalNavItems
                navHover={navHover}
                groupActive={groupActive}
                setGroupActive={setGroupActive}
                currentActiveGroup={currentActiveGroup}
                setCurrentActiveGroup={setCurrentActiveGroup}
                {...props}
              />
            </List>
          )}
          {afterNavMenuContent && afterVerticalNavMenuContentPosition === 'static'
            ? afterNavMenuContent(navMenuContentProps)
            : null}
        </ScrollWrapper>
      </Box>
      {afterNavMenuContent && afterVerticalNavMenuContentPosition === 'fixed'
        ? afterNavMenuContent(navMenuContentProps)
        : null}
    </Drawer>
  )
}

export default Navigation
