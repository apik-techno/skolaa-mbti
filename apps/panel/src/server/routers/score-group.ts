import { prisma } from '@repo/db'
import { publicProcedure, router } from '../trpc'

export const scoreGroupRouter = router({
  list: publicProcedure.query(async () => {
    const groups = await prisma.scoreGroup.findMany({
      orderBy: { name: 'asc' },
    })
    return groups
  }),
})
