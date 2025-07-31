export type ErrCallbackType = (err: { [key: string]: string }) => void
export type SucCallbackType = () => void

export type AuthInitialData = {
  info: {
    name: string
    email: string
    avatar?: string | null
  }
  employee?: {
    id: string
    name: string
  }
  role?: string
}

export type LoginParams = {
  email: string
  password: string
  rememberMe?: boolean
}

export type UserRoleType = {
  id: string
  name: string
  icon: string
  description: string
  subject: string
  access: UserPermType[]
}
export type UserPermType = { actions: string[]; subject: string }
export type SinglePermType = { action: string; subject: string }
export type AuthValuesType = {
  loading: boolean
  session: AuthInitialData | null
  setLoading: (value: boolean) => void
}
