// ** React Imports
import { useSession } from 'next-auth/react'
import { createContext, ReactNode, useEffect, useState } from 'react'
// ** Types
import { AuthValuesType } from './types'

// ** Defaults
const defaultProvider: AuthValuesType = {
  session: null,
  loading: true,
  setLoading: () => Boolean,
}

const AuthContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
}

const AuthProvider: React.FC<Props> = ({ children }: Props) => {
  // ** States
  const [loading, setLoading] = useState<boolean>(defaultProvider.loading)
  const { data } = useSession()
  const session = data?.user as any
  // ** Hooks
  useEffect(() => {
    setLoading(false)
  }, [session])

  const values = {
    session,
    loading,
    setLoading,
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
