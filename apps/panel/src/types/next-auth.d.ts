import 'next-auth'
import { AuthSessionData } from '.'

declare module 'next-auth' {
  interface JWT extends User {
    sub?: string
    iat?: number
    exp?: number
    jti?: string
  }
  interface User extends AuthSessionData {
    identity: string
  }

  interface Session {
    session: User
  }

  interface CredentialsInputs {
    identity: string
    password: string
  }
}
