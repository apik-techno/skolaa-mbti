import { auth } from '@/auth'
import { cookie } from '@/constants'
import { initTRPC, TRPCError } from '@trpc/server'
import { cookies } from 'next/headers'
import { transformer } from './transformer'

const t = initTRPC.context().create({
  /**
   * @link https://trpc.io/docs/v11/data-transformers
   */
  transformer,
  /**
   * @link https://trpc.io/docs/v11/error-formatting
   */
  errorFormatter({ shape }) {
    return shape
  },
})

export const router = t.router
export const procedure = t.procedure

/**
 * Create an unprotected procedure
 * @link https://trpc.io/docs/v11/procedures
 **/
export const publicProcedure = t.procedure

/**
 * Merge multiple routers together
 * @link https://trpc.io/docs/v11/merging-routers
 */
export const mergeRouters = t.mergeRouters

/**
 * Create a server-side caller
 * @link https://trpc.io/docs/v11/server/server-side-calls
 */
export const createCallerFactory = t.createCallerFactory

const enforceUserIsAuthed = t.middleware(async ({ ctx, next }) => {
  const accessCookie = (await cookies()).get(cookie.TOKEN)

  if (!accessCookie) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
    })
  }
  try {
    const verifiedToken = await auth()
    const user = verifiedToken?.user
    return next({ ctx: { user } })
  } catch (_) {
    ;(await cookies()).delete(cookie.TOKEN)
    throw new TRPCError({
      code: 'UNAUTHORIZED',
    })
  }
})

export const privateProcedure = t.procedure.use(enforceUserIsAuthed)
