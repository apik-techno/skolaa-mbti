import { useContext } from 'react'
import { AbilityContext } from './Can'

export const can = (access: { action?: string; subject?: string }[]) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const ability = useContext(AbilityContext)
  for (const acc of access || []) {
    if (ability?.can(acc.action, acc.subject)) return true
  }
  return false
}
