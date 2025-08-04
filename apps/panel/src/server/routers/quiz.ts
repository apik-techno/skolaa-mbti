/**
 *
 * This is an example router, you can delete this file and then update `../pages/api/trpc/[trpc].tsx`
 */
import { auth } from '@/auth'
import { baseResponse } from '@/utils/response'
import { prisma } from '@repo/db'
import { TRPCError } from '@trpc/server'
import OpenAI from 'openai'
import { z } from 'zod'
import { pagination } from '../global'
import { privateProcedure, publicProcedure, router } from '../trpc'

const openai = new OpenAI({
  apiKey:
    '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',
})

export const quizRouter = router({
  makeAnswer: privateProcedure
    .input(
      z.object({
        mainAnswer: z.string().nonempty('Main answer cannot be empty'),
        mainReason: z.string().nonempty('Main reason cannot be empty'),
        subAnswer: z.string().optional(),
        subReason: z.string().optional(),
        mbtiTestResult: z.string().nonempty('MBTI test result cannot be empty'),
      }),
    )
    .mutation(async ({ input }) => {
      const own = await auth()
      if (!own || !own.session?.id) throw new TRPCError({ code: 'BAD_REQUEST', message: 'User not found' })

      // Get userId from the authenticated user
      const userId = own.session.user?.id || own.session.id

      // Verify user exists in database
      const user = await prisma.user.findFirst({ where: { id: userId } })
      if (!user) throw new TRPCError({ code: 'BAD_REQUEST', message: 'User not found in database' })

      // Construct the content for AI, making subAnswer optional
      let userContent = `User's main answer: ${input.mainAnswer}, Main reason: ${input.mainReason}, User's MBTI test result: ${input.mbtiTestResult}.`
      if (input.subAnswer && input.subAnswer.trim() !== '') {
        userContent += ` User's additional answer: ${input.subAnswer}.`
        if (input.subReason && input.subReason.trim() !== '') {
          userContent += ` Additional reason: ${input.subReason}.`
        }
      }
      userContent += ' Provide a career recommendation and detailed explanation in JSON format.'

      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content:
              'You are a helpful assistant that provides career recommendations based on user input. Your response should be in JSON format with two fields: "recomendation" (short career recommendation in Indonesian) and "recomendationDetail" (detailed explanation in Indonesian).',
          },
          {
            role: 'user',
            content: userContent,
          },
        ],
        response_format: { type: 'json_object' },
        max_tokens: 500,
        temperature: 0.7,
      })

      const aiResponse = response.choices[0]?.message.content
      let aiResult = null
      let aiRecommendation = null

      if (aiResponse) {
        try {
          const parsedResponse = JSON.parse(aiResponse)
          aiResult = parsedResponse.recomendation || 'Rekomendasi karir tidak tersedia'
          aiRecommendation = parsedResponse.recomendationDetail || 'Rekomendasi detail tidak tersedia'
        } catch {
          aiResult = 'Error saat memproses respons AI'
          aiRecommendation = 'Silakan coba lagi nanti'
        }
      }

      await prisma.answer.create({
        data: {
          mainAnswer: input.mainAnswer,
          mainReason: input.mainReason,
          subAnswer: input.subAnswer || '', // Store empty string if not provided
          subReason: input.subReason || '', // Store empty string if not provided
          mbtiTestResult: input.mbtiTestResult,
          aiResult,
          aiRecommendation,
          userId: userId,
        },
      })
      return baseResponse({ message: 'Answer saved successfully', result: null })
    }),

  latestAnswer: privateProcedure.query(async () => {
    const own = await auth()
    if (!own || !own.session?.id) throw new TRPCError({ code: 'BAD_REQUEST', message: 'User not found' })

    // Get userId from the authenticated user
    const userId = own.session.user?.id || own.session.id

    const latestAnswer = await prisma.answer.findFirst({
      where: { userId: userId },
      orderBy: { createdAt: 'desc' },
    })

    if (!latestAnswer) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'No answers found for the user' })
    }

    return baseResponse({ message: 'Latest answer retrieved successfully', result: latestAnswer })
  }),

  listAnswers: publicProcedure
    .input(z.object({ ...pagination, showAll: z.boolean().optional() }).partial())
    .query(async ({ input }) => {
      const { page = 0, pageSize = 10, search, showAll } = input

      // Build where clause for search
      const where = search
        ? {
            user: {
              OR: [
                { name: { contains: search, mode: 'insensitive' as const } },
                { identity: { contains: search, mode: 'insensitive' as const } },
              ],
            },
          }
        : {}

      const result = await prisma.answer.findMany({
        where,
        ...(showAll ? {} : { take: pageSize, skip: page * pageSize }),
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { id: true, name: true, identity: true } } },
      })
      const total = await prisma.answer.count({ where })
      const lastPage = Math.ceil(total / pageSize)
      return baseResponse({
        message: 'Success',
        result,
        paginate: showAll ? undefined : { page, pageSize, lastPage, total },
      })
    }),
})
