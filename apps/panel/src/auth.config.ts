import { cookie, getLocalUrl } from '@/constants'
import { env } from '@/env.mjs'
import { Student } from '@repo/db'
import axios from 'axios'
import { NextAuthConfig } from 'next-auth'
import CredentialProvider from 'next-auth/providers/credentials'
import { decodeData, encodeData } from './middleware/utils'
import { AuthSessionData } from './types'

const authConfig: NextAuthConfig = {
  providers: [
    CredentialProvider({
      name: 'Credentials',
      credentials: {
        identity: { label: 'Identity', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          const identity = credentials?.identity as string
          const password = credentials?.password as string
          if (!identity || !password) {
            throw new Error('Invalid credentials')
          }
          const student = (await axios.post<Student>(`${getLocalUrl()}/api/student-login`, { identity, password })).data
          const auth: AuthSessionData = {
            student: { name: student.name, identity: student.identity, id: student.id },
          }
          return auth
        } catch (error) {
          console.error('Authorization error:', error)
          return null
        }
      },
    }),
  ],
  pages: {
    signIn: '/', // sign-in page
  },
  jwt: {
    maxAge: 60 * 60 * 24,
    async encode({ token, secret, maxAge }) {
      return encodeData({ secret: secret as string, token, maxAge })
    },
    async decode({ token, secret }) {
      return decodeData({ secret: secret as string, token: token as string })
    },
  },
  cookies: {
    sessionToken: {
      name: cookie.TOKEN,
      options: { httpOnly: true, sameSite: 'lax', path: '/', secure: env.NODE_ENV === 'production' },
    },
    csrfToken: {
      name: cookie.CSRF,
      options: { httpOnly: true, sameSite: 'lax', path: '/', secure: env.NODE_ENV === 'production' },
    },
    callbackUrl: {
      name: cookie.CALLBACK,
      options: { httpOnly: true, sameSite: 'lax', path: '/', secure: env.NODE_ENV === 'production' },
    },
  },
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (trigger === 'update' && session) {
        // Note, that `session` can be any arbitrary object, remember to validate it!
        const allowedUser = {
          role: session.role,
        }
        return { ...token, ...user, ...allowedUser }
      }
      return { ...token, ...user }
    },
    async session({ session, trigger, newSession, token }) {
      session.session = token as AuthSessionData
      if (trigger === 'update' && newSession) {
        session.session = { ...session.session, ...newSession.session }
      }
      return session
    },
  },
  secret: env.NEXTAUTH_SECRET,
} satisfies NextAuthConfig

export default authConfig
