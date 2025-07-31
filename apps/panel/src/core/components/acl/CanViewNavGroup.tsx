// ** React Imports
import { ReactNode, useContext } from 'react'

// ** Component Imports
import { AbilityContext } from './Can'

// ** Types
import { NavGroup, NavLink } from '@/types/layout'

interface Props {
  navGroup?: NavGroup
  children: ReactNode
}

const CanViewNavGroup = (props: Props) => {
  // ** Props
  const { children, navGroup } = props

  // ** Hook
  const ability = useContext(AbilityContext)

  const checkForVisibleChild = (arr: NavLink[] | NavGroup[]): boolean => {
    return arr.some((i: NavGroup) => {
      if (i.children) {
        return checkForVisibleChild(i.children)
      } else if (ability) {
        for (const access of i?.access || []) {
          if (ability.can(access.action, access.subject)) return <>{children}</>
        }
      }
    })
  }

  const canViewMenuGroup = (item: NavGroup) => {
    const hasAnyVisibleChild = item.children && checkForVisibleChild(item.children)

    if (!item.access) {
      return hasAnyVisibleChild
    } else if (ability) {
      for (const access of item?.access || []) {
        if (ability.can(access.action, access.subject)) return hasAnyVisibleChild
      }
    }
    return false
  }

  if (navGroup && navGroup.auth === false) {
    return <>{children}</>
  } else {
    return navGroup && canViewMenuGroup(navGroup) ? <>{children}</> : null
  }
}

export default CanViewNavGroup
