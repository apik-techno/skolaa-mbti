import { z } from 'zod'

export const pagination = {
  page: z.number().default(1),
  pageSize: z.number().default(10),
  showAll: z.boolean().default(false).optional(),
  search: z.string().nullable(),
  filter: z.any(),
}
