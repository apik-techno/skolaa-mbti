import { auth } from '@/auth'
import { cookie } from '@/constants'
import { AppSession } from '@/types'
import { MiddlewareFunction } from '@rescale/nemo'
import { NextResponse } from 'next/server'

export const authMiddleware: MiddlewareFunction = async (req, event) => {
  const res = NextResponse.next()
  const url = req.nextUrl.clone()

  const sessions: AppSession = { user: null, role: null }

  try {
    const authData = await auth()
    if (!authData) throw new Error('No access data')
    sessions.user = {
      name: authData.session.name || '',
      email: authData.session.email || '',
      id: authData.session.id || '',
    }
    sessions.role = authData.session.role || ''
  } catch (_) {}

  if (!sessions.user || !sessions.role) {
    req.cookies.delete(cookie.TOKEN)
    req.cookies.delete(cookie.ROLE)
    if (req.nextUrl.pathname !== '/') {
      url.pathname = '/'
      return NextResponse.redirect(url)
    }
  }
  return res
}
