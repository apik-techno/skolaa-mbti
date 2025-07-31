import { AuthContext } from '@/core/contexts/auth'
import { useContext } from 'react'

export const useAuth = () => useContext(AuthContext)
