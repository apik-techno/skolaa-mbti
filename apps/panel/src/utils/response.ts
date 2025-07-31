type PaginateProps = {
  page: number
  pageSize: number
  lastPage: number
  total: number
}

export const baseResponse = <T = any>({
  message,
  result,
  paginate,
}: {
  message: string
  result: T
  paginate?: PaginateProps
}): { message: string; result: T; paginate?: PaginateProps } => {
  const data = {
    message,
    result,
    paginate,
  }
  return data
}
