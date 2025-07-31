import { AxiosProgressEvent } from 'axios'

export type GenericObject<T = any> = {
  [key: string]: T
}
export type Pagination = {
  currentPage: number
  lastPage: number
  pageSize: number
  total: number
}

type DefaultResponse = {
  status?: boolean
  message: string
}

export type DefaultRes<T = undefined> = DefaultResponse & {
  result: T
}

export type PaginationRes<T> = DefaultResponse & {
  result: T[]
  paginate: Pagination
}

export type OrderReq = { orderBy?: string; orderDirection?: string }

export type PaginationReq<Filter = undefined> = OrderReq & {
  page?: number
  pageSize?: number
  all?: boolean | number
  search?: string
  filter?: Filter
}
export type FindReq<Body = any> = {
  id: string
  refId?: string
  body?: Body
}

export type ProgressReq<Body = undefined> = {
  body?: Body
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void
}
export type UpdateReq<Body = undefined> = {
  id: string
  refId?: any
  body: Body
}
export type ChangeReq<Body = undefined> = {
  id: any
  refId?: any
  body: Body
}
