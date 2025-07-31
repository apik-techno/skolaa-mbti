import 'next-auth'
import { AuthSessionData } from '.'

declare module 'next-auth' {
  interface JWT extends User {
    sub?: string
    iat?: number
    exp?: number
    jti?: string
  }
  interface User extends AuthSessionData {}

  interface Session {
    session: User
  }

  interface CredentialsInputs {
    email: string
    password: string
  }
}
