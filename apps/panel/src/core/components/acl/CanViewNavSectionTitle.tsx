// ** React Imports
import { ReactNode, useContext } from 'react'

// ** Component Imports
import { AbilityContext } from './Can'

// ** Types
import { NavSectionTitle } from '@/types/layout'

interface Props {
  children: ReactNode
  navTitle?: NavSectionTitle
}

const CanViewNavSectionTitle = (props: Props) => {
  // ** Props
  const { children, navTitle } = props

  // ** Hook
  const ability = useContext(AbilityContext)

  if (navTitle && navTitle.auth === false) {
    return <>{children}</>
  } else if (ability) {
    for (const access of navTitle?.access || []) {
      if (ability.can(access.action, access.subject)) return <>{children}</>
    }
  }
  return null
}

export default CanViewNavSectionTitle
