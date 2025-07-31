import { startOfMonth, subDays, subMonths } from 'date-fns'

export function getDaysInRange(startDate: Date, endDate: Date) {
  const days = []
  let currentDate = startDate
  while (currentDate <= endDate) {
    days.push(currentDate)
    currentDate = subDays(currentDate, -1)
  }
  return days
}

export function getMonthInRange(startDate: Date, endDate: Date) {
  const months = []
  let currentDate = startOfMonth(startDate)
  const end = startOfMonth(endDate)
  while (currentDate <= end) {
    months.push(currentDate)
    currentDate = subMonths(currentDate, -1)
  }
  return months
}
