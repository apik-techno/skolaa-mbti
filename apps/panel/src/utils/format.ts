import { addMinutes, isValid, parseISO, subMinutes } from 'date-fns'

/**
 ** Format and return date in Humanize format
 ** Intl docs: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/format
 ** Intl Constructor: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
 * @param {String} value date to format
 * @param {Object} formatting Intl object to format with
 */

// ** Checks if the passed date is today
const isToday = (date: Date | string) => {
  const today = new Date()

  return (
    new Date(date).getDate() === today.getDate() &&
    new Date(date).getMonth() === today.getMonth() &&
    new Date(date).getFullYear() === today.getFullYear()
  )
}

export const formatDate = (
  value: Date | string,
  formatting: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' },
) => {
  if (!value) return value

  return new Intl.DateTimeFormat('en-US', formatting).format(new Date(value))
}

// ** Returns short month of passed date
export const formatDateToMonthShort = (value: Date | string, toTimeForCurrentDay = true) => {
  const date = new Date(value)
  let formatting: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' }

  if (toTimeForCurrentDay && isToday(date)) {
    formatting = { hour: 'numeric', minute: 'numeric' }
  }

  return new Intl.DateTimeFormat('en-US', formatting).format(new Date(value))
}

// ? The following functions are taken from https://codesandbox.io/s/ovvwzkzry9?file=/utils.js for formatting credit card details
// Get only numbers from the input value
const clearNumber = (value = '') => {
  return value.replace(/\D+/g, '')
}

// Format expiration date in any credit card
export const formatExpirationDate = (value: string) => {
  const finalValue = value
    .replace(/^([1-9]\/|[2-9])$/g, '0$1/') // 3 > 03/
    .replace(/^(0[1-9]|1[0-2])$/g, '$1/') // 11 > 11/
    .replace(/^([0-1])([3-9])$/g, '0$1/$2') // 13 > 01/3
    .replace(/^(0?[1-9]|1[0-2])([0-9]{2})$/g, '$1/$2') // 141 > 01/41
    .replace(/^([0]+)\/|[0]+$/g, '0') // 0/ > 0 and 00 > 0
    // To allow only digits and `/`
    .replace(/[^\d\/]|^[\/]*$/g, '')
    .replace(/\/\//g, '/') // Prevent entering more than 1 `/`

  return finalValue
}

export function trimText(text: string, maxLength = 30): string {
  if (text.length > maxLength) {
    return text.substring(0, maxLength)
  }
  return text
}
export function removeExtension(filename: string): string {
  const lastDotPosition = filename.lastIndexOf('.')
  if (lastDotPosition === -1) return filename // Tidak ada titik ditemukan, tidak ada ekstensi
  return filename.substring(0, lastDotPosition)
}

export function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${(bytes / k ** i).toFixed(dm)} ${sizes[i]}`
}

export const uuidToNumber = (uuid: string): number => {
  // Convert the UUID to a number by hashing it and taking a portion of the hash
  const hash = uuid.split('-').join('') // Remove hyphens from UUID
  const numericValue = parseInt(hash, 16) // Convert hexadecimal string to a number
  return numericValue
}

export function localToUTC(dateInput: string | Date): Date | null {
  // Convert input to Date object if it's a string
  let date: Date
  if (!dateInput) {
    return null
  } else if (typeof dateInput === 'string') {
    date = parseISO(dateInput)
    if (!isValid(date)) {
      console.error('Invalid date string provided')
      return null
    }
  } else {
    date = dateInput
  }
  // Calculate timezone offset
  const timezoneOffset = date.getTimezoneOffset() // in minutes

  // Add the timezone offset to get the UTC time
  return addMinutes(date, timezoneOffset)
}

export function utcToLocal(dateInput: string | Date): Date | null {
  // Convert input to Date object if it's a string
  let date: Date
  if (!dateInput) {
    return null
  } else if (typeof dateInput === 'string') {
    date = parseISO(dateInput)
    if (!isValid(date)) {
      console.error('Invalid date string provided')
      return null
    }
  } else {
    date = dateInput
  }

  // Calculate timezone offset
  const timezoneOffset = date.getTimezoneOffset() // in minutes

  // Subtract the timezone offset to get the local time
  return subMinutes(date, timezoneOffset)
}

export function timeToString(time: number, withDay = true, withMaxHour = true) {
  const secNum = parseInt(String(time), 10)
  let secLeft = secNum
  const days = Math.floor(secNum / 3600 / 24)
  if (withDay) secLeft -= days * 3600 * 24
  const hours = Math.floor(secLeft / 3600)
  secLeft -= hours * 3600
  const minutes = Math.floor(secLeft / 60)
  secLeft -= minutes * 60
  let countInView = 0
  let resString = ''
  if (withDay && days > 0) {
    countInView += 1
    resString += `${days}d`
  }
  if (countInView < 2 && hours > 0) {
    countInView += 1
    resString += `${withMaxHour && hours > 9999 ? 9999 : hours}h`
  }
  if (countInView < 2 && minutes > 0) {
    countInView += 1
    resString += `${minutes}m`
  }
  if (countInView < 2) {
    countInView += 1
    resString += `${secLeft}s`
  }
  return resString
}

export const convertMetersToKilometers = (meters: number): string => {
  if (meters < 1000) {
    return `${meters}m`
  } else {
    const kilometers = meters / 1000
    return `${kilometers.toFixed(2)}km`
  }
}

export function getFormattedTimeDifference(date: Date): string {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return 'Updated just now'
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `Updated ${minutes} minute${minutes !== 1 ? 's' : ''} ago`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `Updated ${hours} hour${hours !== 1 ? 's' : ''} ago`
  } else {
    const days = Math.floor(diffInSeconds / 86400)
    return `Updated ${days} day${days !== 1 ? 's' : ''} ago`
  }
}
export function formatDifferentTime(date: Date): string {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return 'just now'
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours} hour${hours !== 1 ? 's' : ''} ago`
  } else {
    const days = Math.floor(diffInSeconds / 86400)
    return `${days} day${days !== 1 ? 's' : ''} ago`
  }
}

export const getTimezone = () => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone
}

export const limitStringWithStars = (input: string, maxLength: number): string => {
  if (input.length <= maxLength) return input // Kembalikan string jika panjangnya kurang dari atau sama dengan maxLength

  const halfLength = Math.floor(maxLength / 2)
  const firstHalf = input.slice(0, halfLength) // Bagian pertama string
  const secondHalf = input.slice(input.length - halfLength) // Bagian kedua string

  return `${firstHalf}*****${secondHalf}` // Gabungkan bagian pertama, tiga bintang, dan bagian kedua
}

export function formatNumber(number: number, decimals = 20): string {
  return number?.toLocaleString('en-US', {
    minimumFractionDigits: 0, // Minimal angka desimal yang akan ditampilkan
    maximumFractionDigits: decimals, // Maksimal angka desimal yang akan ditampilkan
  })
}

export function splitArrayIntoParts<T = any>(array: T[], maxPartSize: number): T[][] {
  const result: T[][] = []

  for (let i = 0; i < array.length; i += maxPartSize) {
    const part = array.slice(i, i + maxPartSize)
    result.push(part)
  }

  return result
}

export function empty(value: any): boolean {
  // Handle undefined, null, empty string, false, empty array, and empty object
  return (
    value === undefined ||
    value === null ||
    value === false ||
    (typeof value === 'string' && value.trim().length === 0) ||
    (Array.isArray(value) && value.length === 0) ||
    (typeof value === 'object' && value !== null && Object.keys(value).length === 0)
  )
}

// Usage of !empty (inverted logic)
export function notEmpty(value: any): boolean {
  return !empty(value)
}

function nFormatter(num: number, digits = 2) {
  const lookup = [
    { value: 1, symbol: '' },
    { value: 1e3, symbol: 'K' },
    { value: 1e6, symbol: 'M' },
    { value: 1e9, symbol: 'B' },
    { value: 1e12, symbol: 'T' },
    { value: 1e15, symbol: 'P' },
    { value: 1e18, symbol: 'E' },
  ]
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/
  const item = lookup.slice().find((val) => {
    return Math.round(num / val.value) < 100
  })
  if (item) {
    const resDump = num / item.value
    if (parseInt(String(resDump / 10), 10) > 0) digits = 1
    if (parseInt(String(resDump / 100), 10) > 0) digits = 0
    return (num / item.value).toFixed(digits).replace(rx, '$1') + ' ' + item.symbol
  }
  return '0'
}

export function shortenNumber(number: number | string, decimals = 20) {
  const newNumber = parseFloat(String(number))
  const stringNumber = String(number)
  if (newNumber > 1000) return nFormatter(newNumber, decimals)
  return Number.parseFloat(stringNumber).toLocaleString('en-US', {
    minimumFractionDigits: 0, // Minimal angka desimal yang akan ditampilkan
    maximumFractionDigits: decimals, // Maksimal angka desimal yang akan ditampilkan
  })
}
