// Protecting routes with next-auth
// https://next-auth.js.org/configuration/nextjs#middleware
// https://nextjs.org/docs/app/building-your-application/routing/middleware

import { createMiddleware, MiddlewareConfig } from '@rescale/nemo'
import { authMiddleware } from './middleware/auth'
import { guestMiddleware } from './middleware/guest'

const middlewares: MiddlewareConfig = {
  '/': [guestMiddleware],
  '/x': [authMiddleware],
  '/x/*path': [authMiddleware],
  // Add more routes and their respective middlewares as needed
}

export const middleware = createMiddleware(middlewares)

export const config = {
  matcher: '/((?!api/|_next/|_static|_vercel|[\\w-]+\\.\\w+).*)',
}
