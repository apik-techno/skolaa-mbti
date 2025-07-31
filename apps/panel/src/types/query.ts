export type Success<T> = (data: T) => void
export type Error<T> = (error: T) => void

export type MutationParams<T, E = any> = {
  onSuccess?: Success<T>
  onError?: Error<E>
}
export type QueryParams<T = any> = {
  params: T
  enabled?: boolean
  refetchInterval?: number
  refetchOnWindowFocus?: boolean
}
