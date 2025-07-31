/**
 * Instantiates a single instance PrismaClient and save it on the global object.
 * @link https://www.prisma.io/docs/support/help-articles/nextjs-prisma-client-dev-practices
 */
import { Prisma, PrismaClient } from '@prisma/client'
export * from '@prisma/client'

export type SoftDelete<T = any> = {
  where: Prisma.Args<T, 'delete'>['where']
  force?: boolean
}
export type SoftDeleteMany<T> = {
  where: Prisma.Args<T, 'deleteMany'>['where']
  force?: boolean
}
export type ExtendedPrismaClient = ReturnType<typeof prismaExtends>

const prismaGlobal = globalThis as typeof globalThis & {
  prisma?: ExtendedPrismaClient
}

const prismaExtends = (prismaClient: PrismaClient) => {
  return prismaClient.$extends({
    model: {
      presaleTransfer: {
        async softDelete<T, A>(this: T, args: SoftDelete<T>): Promise<Prisma.Result<T, A, 'update'>> {
          const context = Prisma.getExtensionContext(this)
          return await (context as any).update({
            ...args,
            data: { deleted: true },
          })
        },
        async softDeleteMany<T, A>(this: T, args: SoftDeleteMany<T>): Promise<Prisma.Result<T, A, 'updateMany'>> {
          const context = Prisma.getExtensionContext(this)
          return await (context as any).updateMany({
            ...args,
            data: { deleted: true },
          })
        },
      },
    },
  })
}
export const prisma: ExtendedPrismaClient =
  prismaGlobal.prisma ??
  prismaExtends(
    new PrismaClient({
      log: ['error'],
    }),
  )

if (process.env.NODE_ENV !== 'production') prismaGlobal.prisma = prisma
