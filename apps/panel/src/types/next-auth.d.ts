import 'next-auth'
import { AuthSessionData, AuthUserData } from '.'

declare module 'next-auth' {
  interface JWT extends User {
    sub?: string
    iat?: number
    exp?: number
    jti?: string
  }
  interface User extends AuthSessionData {
    user?: AuthUserData
    student?: AuthUserData
    role?: string
  }

  interface Session {
    session: User
  }

  interface CredentialsInputs {
    identity: string
    password: string
  }
}
