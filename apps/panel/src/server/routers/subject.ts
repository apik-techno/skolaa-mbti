import { prisma } from '@repo/db'
import { publicProcedure, router } from '../trpc'

export const subjectRouter = router({
  list: publicProcedure.query(async () => {
    const groups = await prisma.subject.findMany({ orderBy: { name: 'asc' } })
    return groups
  }),
})
