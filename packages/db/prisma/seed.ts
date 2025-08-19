/**
 * Adds seed data to your db
 *
 * @link https://www.prisma.io/docs/guides/database/seed-database
 */
import { Prisma, PrismaClient } from '@prisma/client'
import argon2 from 'argon2'

const prisma = new PrismaClient()
async function student() {
  const studentData: Prisma.StudentUncheckedCreateInput[] = [
    {
      name: 'Agung Suprianto',
      identity: '32567890',
      password: await argon2.hash('12071998'),
    },
    {
      name: 'Budi Nugroho',
      identity: '87654321',
      password: await argon2.hash('15071998'),
    },
    {
      name: 'Citra Halim',
      identity: '23456789',
      password: await argon2.hash('08122000'),
    },
    {
      name: 'Dewi Siregar',
      identity: '34567890',
      password: await argon2.hash('22052002'),
    },
    {
      name: 'Eko Prabowo',
      identity: '45678901',
      password: await argon2.hash('30111997'),
    },
    {
      name: 'Fajar Ginting',
      identity: '56789012',
      password: await argon2.hash('14042003'),
    },
    {
      name: 'Gita Kusuma',
      identity: '67890123',
      password: await argon2.hash('09081999'),
    },
    {
      name: 'Hadi Purnama',
      identity: '78901234',
      password: await argon2.hash('27122001'),
    },
    {
      name: 'Indra Wijaya',
      identity: '89012345',
      password: await argon2.hash('18061996'),
    },
    {
      name: 'Joko Santoso',
      identity: '90123456',
      password: await argon2.hash('05101995'),
    },
    {
      name: 'Ahmad Sihombing',
      identity: '12345678',
      password: await argon2.hash('29032004'),
    },
  ]

  for (const student of studentData) {
    await upsertUser(student)
  }
}
async function upsertUser(studentData: Prisma.StudentUncheckedCreateInput) {
  await prisma.student.upsert({
    create: studentData,
    update: studentData,
    where: { identity: studentData.identity },
  })
}

const vocationData = [
  {
    key: 'ips',
    name: 'Ilmu Pengetahuan Sosial',
    subjects: [
      'Pendidikan Agama Islam dan Budi Pekerti',
      'Pendidikan Pancasila dan Kewarganegaraan',
      'Bahasa Indonesia',
      'Matematika',
      'Sejarah Indonesia',
      'Bahasa Inggris',
      'Seni Budaya',
      'Pendidikan Jasmani, Olahraga dan Kesehatan',
      'Prakarya dan Kewirausahaan',
      'Muatan Lokal Bahasa Daerah',
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
    ],
  },
  {
    key: 'ipa',
    name: 'Ilmu Pengetahuan Alam',
    subjects: [
      'Pendidikan Agama Islam dan Budi Pekerti',
      'Pendidikan Pancasila dan Kewarganegaraan',
      'Bahasa Indonesia',
      'Matematika',
      'Sejarah Indonesia',
      'Bahasa Inggris',
      'Seni Budaya',
      'Pendidikan Jasmani, Olahraga dan Kesehatan',
      'Prakarya dan Kewirausahaan',
      'Muatan Lokal Bahasa Daerah',
      'Matematika (Peminatan)',
      'Biologi',
      'Fisika',
      'Kimia',
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
    ],
  },
]

// Seeder for ScoreGroup
async function subjects() {
  const groups = vocationData.flatMap((vocation) => vocation.subjects)
  for (const name of groups) {
    await prisma.subject.upsert({
      where: { name },
      update: {},
      create: { name },
    })
  }
}

async function vocations() {
  for (const vocation of vocationData) {
    await prisma.vocation.upsert({
      where: { key: vocation.key },
      update: {},
      create: {
        key: vocation.key,
        name: vocation.name,
        subjects: {
          connectOrCreate: vocation.subjects.map((subject) => ({
            where: { name: subject },
            create: { name: subject },
          })),
        },
      },
    })
  }
}

async function main() {
  const seeders: Promise<void>[] = [student(), vocations()]
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
