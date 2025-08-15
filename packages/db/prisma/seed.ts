/**
 * Adds seed data to your db
 *
 * @link https://www.prisma.io/docs/guides/database/seed-database
 */
import { Prisma, PrismaClient, Role } from '@prisma/client'
import argon2 from 'argon2'

const prisma = new PrismaClient()
async function user() {
  const roleData = [{ name: 'user' }]
  const roles: Role[] = []
  for (const data of roleData) {
    const role = await prisma.role.upsert({
      create: data,
      update: data,
      where: {
        name: data.name,
      },
    })
    roles.push(role)
  }
  const role = roles[0]?.id
  if (!role) throw new Error('Role not found')
  const userData: Prisma.UserUncheckedCreateInput[] = [
    {
      name: 'Agung Suprianto',
      identity: '32567890',
      password: await argon2.hash('12071998'),
      roleId: roles.find((role) => role.name === 'user')?.id || role,
    },
    {
      name: 'Budi Nugroho',
      identity: '87654321',
      password: await argon2.hash('15071998'),
      roleId: roles.find((role) => role.name === 'user')?.id || role,
    },
    {
      name: 'Citra Halim',
      identity: '23456789',
      password: await argon2.hash('08122000'),
      roleId: roles.find((role) => role.name === 'user')?.id || role,
    },
    {
      name: 'Dewi Siregar',
      identity: '34567890',
      password: await argon2.hash('22052002'),
      roleId: roles.find((role) => role.name === 'user')?.id || role,
    },
    {
      name: 'Eko Prabowo',
      identity: '45678901',
      password: await argon2.hash('30111997'),
      roleId: roles.find((role) => role.name === 'user')?.id || role,
    },
    {
      name: 'Fajar Ginting',
      identity: '56789012',
      password: await argon2.hash('14042003'),
      roleId: roles.find((role) => role.name === 'user')?.id || role,
    },
    {
      name: 'Gita Kusuma',
      identity: '67890123',
      password: await argon2.hash('09081999'),
      roleId: roles.find((role) => role.name === 'user')?.id || role,
    },
    {
      name: 'Hadi Purnama',
      identity: '78901234',
      password: await argon2.hash('27122001'),
      roleId: roles.find((role) => role.name === 'user')?.id || role,
    },
    {
      name: 'Indra Wijaya',
      identity: '89012345',
      password: await argon2.hash('18061996'),
      roleId: roles.find((role) => role.name === 'user')?.id || role,
    },
    {
      name: 'Joko Santoso',
      identity: '90123456',
      password: await argon2.hash('05101995'),
      roleId: roles.find((role) => role.name === 'user')?.id || role,
    },
    {
      name: 'Ahmad Sihombing',
      identity: '12345678',
      password: await argon2.hash('29032004'),
      roleId: roles.find((role) => role.name === 'user')?.id || role,
    },
  ]

  for (const user of userData) {
    await upsertUser(user)
  }
}
async function upsertUser(userData: Prisma.UserUncheckedCreateInput) {
  await prisma.user.upsert({
    create: userData,
    update: userData,
    where: {
      identity: userData.identity,
    },
  })
}

// Seeder for ScoreGroup
async function scoreGroups() {
  const groups = [
    'Pendidikan Agama Islam dan Budi Pekerti',
    'Pendidikan Pancasila dan Kewarganegaraan',
    'Bahasa Indonesia',
    'Matematika',
    'Sejarah Indonesia',
    'Bahasa Inggris',
    'Seni Budaya',
    'Pendidikan Jasmani, Olahraga dan Kesehatan',
    'Prakarya dan Kewirausahaan',
    'Muatam Lokal Bahasa Daerah',
    'Sejarah',
    'Ekonomi',
    'Geografi',
    'Sosiologi',
    'Bahasa Arab',
    'Kecerdasan Umum',
    'Pemahaman',
    'Kemampuan Bahasa',
    'Kemampuan Angka',
    'Kemampuan Analisis',
    'Kreativitas',
    'Daya Ingat',
    'Kemampuan Daya Bayang Ruang',
    'Dorongan Berprestasi',
    'Konsentrasi',
    'Ketelitian',
    'Kecepatan',
    'Kepercayaan Diri',
    'Stabilitas Emosi',
    'Hubungan Antar Pribadi',
    'Penyesuaian Diri',
    'Kemandirian',
  ]
  for (const name of groups) {
    await prisma.scoreGroup.upsert({
      where: { name },
      update: {},
      create: { name },
    })
  }
}

async function main() {
  const seeders: Promise<void>[] = [user(), scoreGroups()]
  await Promise.all(seeders)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
