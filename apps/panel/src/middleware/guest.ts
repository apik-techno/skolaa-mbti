import { auth } from '@/auth'
import { AppSession } from '@/types'
import { MiddlewareFunction } from '@rescale/nemo'
import { NextResponse } from 'next/server'

export const guestMiddleware: MiddlewareFunction = async (req, event) => {
  const sessions: AppSession = { user: null, role: null }
  const url = req.nextUrl.clone()
  const res = NextResponse.next()
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
  if (sessions.user && req.nextUrl.pathname === '/') {
    url.pathname = '/x'
    return NextResponse.redirect(url)
  }
  console.log('AAAAA')

  return res
}
