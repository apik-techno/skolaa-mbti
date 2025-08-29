import { verifyPassword } from '@/server/session'
import { prisma } from '@repo/db'
import axios, { AxiosError } from 'axios'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const schema = z.object({
  identity: z.string(),
  password: z.string(),
})

export async function POST(req: NextRequest) {
  const body = await req.json()
  try {
    const { identity, password } = schema.parse(body)
    const user = await prisma.student.findFirst({ where: { identity } })
    if (!user || !user.password) throw new Error('identity or password is invalid')
    const isVerified = await verifyPassword(user.password, password)
    if (!isVerified) throw new Error('identity or password is invalid')
    return NextResponse.json(user)
  } catch (error) {
    const err = error as AxiosError | Error
    if (axios.isAxiosError(err)) {
      const message = err.response && err.response.data && err.response.data
      return NextResponse.json(message, { status: 500 })
    }
    const message = err.message || err.toString()
    return NextResponse.json(message, { status: 400 })
  }
}
