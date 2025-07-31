// ** React Imports
import React, { ReactNode } from 'react'

// ** Next Import

// ** Types
import type { AppAbility } from '../../configs/acl'

// ** Context Imports
import { AbilityContext } from '../../components/acl/Can'

// ** Config Import
import { buildRoleAbility } from '../../configs/acl'

// ** Component Import

// ** Hooks
import { useSession } from 'next-auth/react'
import { AuthInitialData } from '../../contexts/types'

// ** Util Import

interface AclGuardProps {
  children: ReactNode
  authGuard?: boolean
  guestGuard?: boolean
}

const AclGuard = (props: AclGuardProps) => {
  // ** Props
  const { children } = props
  // ** Hooks
  const { data } = useSession()

  // ** State
  const [ability, setAbility] = React.useState<AppAbility>()

  React.useEffect(() => {
    const session = data?.session as unknown as AuthInitialData
    if (session?.role) {
      const ability = buildRoleAbility(session.role)
      setAbility(ability)
    } else {
      setAbility(undefined)
    }
  }, [data])
  // Check the access of current role and render pages
  if (ability) return <AbilityContext.Provider value={ability}>{children}</AbilityContext.Provider>
  else return <>{children}</>
}

export default AclGuard
