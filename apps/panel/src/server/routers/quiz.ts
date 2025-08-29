/**
 *
 * This is an example router, you can delete this file and then update `../pages/api/trpc/[trpc].tsx`
 */
import { Model, predict, trainIPAData, trainIPSData } from '@/algoritm'
import { auth } from '@/auth'
import { env } from '@/env.mjs'
import { baseResponse } from '@/utils/response'
import { Prisma, prisma } from '@repo/db'
import { TRPCError } from '@trpc/server'
import OpenAI from 'openai'
import { zodTextFormat } from 'openai/helpers/zod'
import { z } from 'zod'
import { pagination } from '../global'
import { privateProcedure, publicProcedure, router } from '../trpc'

const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
})

const responseFormat = z.object({
  recomendation: z.string().nonempty('Rekomendasi tidak boleh kosong'),
  recomendationDetail: z.string().nonempty('Detail rekomendasi tidak boleh kosong'),
  isMatch: z.boolean(),
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
        vocationId: z.string().nonempty('Vocation ID cannot be empty'),
        scroes: z.array(
          z.object({
            groupId: z.string().nonempty('Group ID cannot be empty'),
            subjectId: z.string().nonempty('Subject ID cannot be empty'),
            title: z.string().nonempty('Tittle cannot be empty'),
            score: z.number().int().min(0, 'Score must be a non-negative integer'),
          }),
        ),
      }),
    )
    .mutation(async ({ input }) => {
      const own = await auth()
      if (!own || !own.session?.id) throw new TRPCError({ code: 'BAD_REQUEST', message: 'User not found' })
      const predictParams: Record<string, string | number> = input.scroes.reduce(
        (acc, score) => {
          acc[score.title] = score.score
          return acc
        },
        {} as Record<string, string | number>,
      )
      predictParams['MBTI'] = input.mbtiTestResult
      predictParams['Minat'] = input.mainAnswer
      const vocation = await prisma.vocation.findFirst({ where: { id: input.vocationId } })
      if (!vocation) throw new TRPCError({ code: 'BAD_REQUEST', message: 'Vocation not found' })
      const model: Model = vocation.key === 'ipa' ? trainIPAData : trainIPSData
      const prediction = predict({ input: predictParams, model: model })
      // console.log('Prediction:', predictParams, prediction)
      // throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Prediction not implemented yet' })
      // Get userId from the authenticated user
      const userId = own.session.user?.id || own.session.id

      // Verify user exists in database
      const user = await prisma.user.findFirst({ where: { id: userId } })
      if (!user) throw new TRPCError({ code: 'BAD_REQUEST', message: 'User not found in database' })

      // Bangun prompt dalam Bahasa Indonesia
      let userContent = `Jawaban utama siswa: ${input.mainAnswer}, Alasan utama: ${input.mainReason}, Hasil tes MBTI: ${input.mbtiTestResult}.`
      if (input.subAnswer && input.subAnswer.trim() !== '') {
        userContent += ` Jawaban tambahan: ${input.subAnswer}.`
        if (input.subReason && input.subReason.trim() !== '') {
          userContent += ` Alasan tambahan: ${input.subReason}.`
        }
      }
      if (input.scroes && input.scroes.length > 0) {
        const scoresList = input.scroes.map((s) => `${s.title}: ${s.score}`).join(', ')
        userContent += ` Nilai siswa pada mata pelajaran berikut: ${scoresList}.`
      }
      userContent += ' Berikan rekomendasi karir dan penjelasan detail dalam format JSON.'

      const response = await openai.responses.parse({
        model: 'gpt-4o-mini',
        input: [
          {
            role: 'system',
            content:
              'Kamu adalah asisten yang membantu memberikan rekomendasi karir berdasarkan data siswa. Jawaban harus dalam format JSON dengan dua field: "rekomendasi" (rekomendasi karir singkat dalam Bahasa Indonesia) dan "rekomendasiDetail" (penjelasan detail dalam Bahasa Indonesia).',
          },
          { role: 'user', content: userContent },
        ],
        text: {
          format: zodTextFormat(responseFormat, 'recommendation'),
        },
      })

      const aiResponse = response.output_parsed
      let aiResult = null
      let aiRecommendation = null
      let isMatch = false

      if (aiResponse) {
        try {
          aiResult = aiResponse.recomendation || 'Rekomendasi karir tidak tersedia'
          aiRecommendation = aiResponse.recomendationDetail || 'Rekomendasi detail tidak tersedia'
          isMatch = aiResponse.isMatch || false
        } catch {
          aiResult = 'Error saat memproses respons AI'
          aiRecommendation = 'Silakan coba lagi nanti'
          isMatch = false
        }
      }

      const result = await prisma.answer.create({
        data: {
          mainAnswer: input.mainAnswer,
          mainReason: input.mainReason,
          subAnswer: input.subAnswer || '', // Store empty string if not provided
          subReason: input.subReason || '', // Store empty string if not provided
          mbtiTestResult: input.mbtiTestResult,
          isMatch,
          aiResult,
          aiRecommendation,
          trainLabel: prediction.predictedLabel,
          trainPercentage: prediction.percentages,
          studentId: userId,
          vocationId: input.vocationId,
        },
      })
      if (input.scroes && input.scroes.length > 0) {
        const scoresData: Prisma.ScoreCreateManyInput[] = input.scroes.map((score) => ({
          groupId: score.groupId,
          subjectId: score.subjectId,
          answerId: result.id,
          value: score.score,
        }))
        await prisma.score.createMany({ data: scoresData })
      }
      return baseResponse({ message: 'Answer saved successfully', result: null })
    }),

  latestAnswer: privateProcedure.query(async () => {
    const own = await auth()
    if (!own || !own.session?.id) throw new TRPCError({ code: 'BAD_REQUEST', message: 'User not found' })

    // Get userId from the authenticated user
    const userId = own.session.user?.id || own.session.id

    const latestAnswer = await prisma.answer.findFirst({
      where: { studentId: userId },
      include: { scores: { include: { answer: false, subject: true } } },
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
            student: {
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
        include: {
          student: { select: { id: true, name: true, identity: true } },
          scores: { include: { answer: false, subject: true } },
        },
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
