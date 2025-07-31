import * as jwt from 'jose'
import { RequestCookies, ResponseCookies } from 'next/dist/compiled/@edge-runtime/cookies'
import { NextRequest, NextResponse } from 'next/server'

export function applySetCookie(req: NextRequest, res: NextResponse) {
  // 1. Parse Set-Cookie header from the response
  const setCookies = new ResponseCookies(res.headers)

  // 2. Construct updated Cookie header for the request
  const newReqHeaders = new Headers(req.headers)
  const newReqCookies = new RequestCookies(newReqHeaders)
  setCookies.getAll().forEach((cookie) => newReqCookies.set(cookie))

  // 3. Set up the “request header overrides” (see https://github.com/vercel/next.js/pull/41380)
  //    on a dummy response
  // NextResponse.next will set x-middleware-override-headers / x-middleware-request-* headers
  const dummyRes = NextResponse.next({ request: { headers: newReqHeaders } })

  // 4. Copy the “request header overrides” headers from our dummy response to the real response
  dummyRes.headers.forEach((value, key) => {
    if (key === 'x-middleware-override-headers' || key.startsWith('x-middleware-request-')) {
      res.headers.set(key, value)
    }
  })
}

export const encodeData = async ({
  secret,
  token,
  maxAge = 60 * 60 * 24,
}: {
  secret: string
  token: any
  maxAge?: number
}) => {
  const jwtKey = new TextEncoder().encode(secret as string)
  const tokenData = { ...token, exp: Math.floor(Date.now() / 1000) + (maxAge || 0) }
  const encodedToken = await new jwt.SignJWT(tokenData)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) + maxAge)
    .sign(jwtKey)
  return encodedToken
}

export const decodeData = async ({ secret, token }: { secret: string; token: string }) => {
  if (token === undefined) return null
  const jwtKey = new TextEncoder().encode(secret as string)
  const data = (await jwt.jwtVerify(token, jwtKey)).payload

  return data as Record<string, any>
}
