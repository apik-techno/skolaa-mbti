/**
 *
 * This is an example router, you can delete this file and then update `../pages/api/trpc/[trpc].tsx`
 */
import { auth } from '@/auth'
import { cookie } from '@/constants'
import { baseResponse } from '@/utils/response'
import { prisma } from '@repo/db'
import { TRPCError } from '@trpc/server'
import argon2, { verify } from 'argon2'
import { cookies } from 'next/headers'
import { z } from 'zod'
import { privateProcedure, publicProcedure, router } from '../trpc'

export const authRouter = router({
  logout: publicProcedure.mutation(async () => {
    ;(await cookies()).delete(cookie.TOKEN)
    return baseResponse({ message: 'Logout Success', result: null })
  }),
  changePassword: privateProcedure
    .input(
      z.object({
        password: z.string().nonempty('password cannot be empty'),
        oldPassword: z.string().nonempty('old password cannot be empty'),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const own = await auth()
      if (!own || !own.session.id) throw new TRPCError({ code: 'BAD_REQUEST', message: 'User not found' })

      const user = await prisma.user.findFirst({ where: { id: own.session.id } })
      if (!user || !user.password) throw new TRPCError({ code: 'BAD_REQUEST', message: 'User not found' })
      if (!(await verify(user.password, input.oldPassword)))
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Old password is invalid' })
      const password = await argon2.hash(input.password)
      await prisma.user.update({ where: { id: own.session.id }, data: { password } })
      return baseResponse({ message: 'Password Changed Successfully', result: null })
    }),
})
