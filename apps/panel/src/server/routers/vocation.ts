import { prisma } from '@repo/db'
import { publicProcedure, router } from '../trpc'

export const vocationRouter = router({
  list: publicProcedure.query(async () => {
    return await prisma.vocation.findMany({ orderBy: { name: 'asc' }, select: { id: true, name: true } })
  }),
})
