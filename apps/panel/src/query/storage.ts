import { DefaultRes } from '@/types/axios'
import { MutationParams } from '@/types/query'
import { local } from '@/utils/service'

export const useUploadStorage = ({ onSuccess, onError }: MutationParams<DefaultRes<string>>) => {
  return {
    mutate: async ({ file, ...rest }: { file: File; directory?: string }) => {
      const { data } = await local.get<{ url: string; key: string }>(`/storage-sign`, { params: rest })
      const { key, url } = data
      await fetch(url, {
        method: 'PUT',
        body: file,
      })
      return { result: key }
    },
    onSuccess,
    onError,
  }
}
export const useDeleteStorage = ({ onSuccess, onError }: MutationParams<DefaultRes<string>>) => {
  return {
    mutate: async (params: { key: string }) => {
      return deleteStorage(params.key)
    },
    onSuccess,
    onError,
  }
}
export const deleteStorage = async (key: string) => {
  return local.delete(`/storage/${key}`, { timeout: 0 }).then((res) => res.data)
}
