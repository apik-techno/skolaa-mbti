// ** React Imports
import { ReactNode, useContext } from 'react'

// ** Component Imports
import { AbilityContext } from './Can'

// ** Types
import { MenuItem } from '@/types/layout'

interface Props {
  navLink?: MenuItem
  children: ReactNode
}

const CanViewMenu = (props: Props) => {
  // ** Props
  const { children, navLink } = props

  // ** Hook
  const ability = useContext(AbilityContext)
  if (navLink && navLink.auth === false) {
    return <>{children}</>
  } else if (ability) {
    for (const access of navLink?.access || []) {
      if (ability.can(access.action, access.subject)) return <>{children}</>
    }
  }
  return null
}

export default CanViewMenu
