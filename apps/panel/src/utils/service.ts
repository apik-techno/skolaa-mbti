import { getBaseUrl } from '@/constants'
import axios from 'axios'

export const local = axios.create({
  baseURL: `${getBaseUrl()}/api`,
  timeout: 10000,
})
