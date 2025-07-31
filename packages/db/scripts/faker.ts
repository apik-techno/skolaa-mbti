/**
 * Adds seed data to your db
 *
 * @link https://www.prisma.io/docs/guides/database/seed-database
 */
import { faker } from '@faker-js/faker'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

type DonationData = {
  projectId: string
  amount: number
  anonymous: boolean
  createdAt: Date
}
type DonorParams = {
  projectIds?: string[]
  totalDonation?: number
  total?: number
}

const randomNumber = ({ min, max }: { min: number; max: number }) => Math.floor(Math.random() * (max - min + 1)) + min

async function donorsFaker(params?: DonorParams) {
  const total = params?.total || 10
  for (let i = 0; i < total; i++) {
    const donations: DonationData[] = []
    if (params?.projectIds) {
      const inputTotal = params.totalDonation || 5
      const totalDonation = faker.number.int({ min: 0, max: inputTotal })
      for (let j = 0; j < totalDonation; j++) {
        const randomId = randomNumber({ min: 0, max: params.projectIds.length - 1 })
        donations.push({
          projectId: params.projectIds[randomId],
          amount: parseFloat(faker.finance.amount({ min: 10, max: 1000 })) * 1000,
          anonymous: faker.datatype.boolean(),
          createdAt: faker.date.past({ years: 1 }),
        })
      }
    }
    const donor = await prisma.donor.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        phone: faker.phone.number(),
        address: faker.location.streetAddress(),
        donations: donations.length > 0 ? { create: donations } : undefined,
      },
    })
    console.log(`Created donor with id: ${donor.id}`)
  }
  console.log(`Seeding finished.`)
}

async function donor(argMap: Record<string, string | undefined>) {
  const projectIds = argMap['--with-donation']?.split('_') || []
  const total = Number(argMap['--total']) || 10
  if (projectIds) {
    const maxDonation = Number(argMap['--max-count-donation']) || undefined
    await donorsFaker({ projectIds, totalDonation: maxDonation, total })
  } else {
    await donorsFaker({ total })
  }
}

/**
 * Additional Flags :
 * --table=donors
 * --total=5
 * --with-donation=<project_id>_<project_id>_<project_id>
 * --max-count-donation=10
 */
async function main() {
  const args = process.argv.slice(2)

  const argMap = args.reduce((acc, arg) => {
    const [key, value] = arg.split('=')
    acc[key] = value
    return acc
  }, {} as Record<string, string | undefined>)
  console.log('[CMD]', argMap)

  if (argMap['--table'] === 'donors') {
    await donor(argMap)
  } else {
    // You can add more default seeders here if needed
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
