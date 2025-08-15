/**
 * This file contains the root router of your tRPC-backend
 */

import { createCallerFactory, publicProcedure, router } from '../trpc'
import { authRouter } from './auth'
import { quizRouter } from './quiz'
import { scoreGroupRouter } from './score-group'

export const appRouter = router({
  healthcheck: publicProcedure.query(() => 'yay!'),
  auth: authRouter,
  quiz: quizRouter,
  scoreGroup: scoreGroupRouter,
})

export const createCaller = createCallerFactory(appRouter)

export type AppRouter = typeof appRouter
