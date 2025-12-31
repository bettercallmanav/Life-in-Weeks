export const WEEKS_PER_YEAR = 52
export const MILESTONE_AGES = [18, 30, 50, 65]

export interface WeekInfo {
  weekIndex: number
  weekNumber: number
  totalWeeks: number
  date: Date
  age: {
    years: number
    months: number
    weeks: number
  }
  year: number
  weekOfYear: number
  isMilestone: boolean
  milestoneAge?: number
}

export function calculateWeeksLived(dob: Date): number {
  const now = new Date()
  const diffTime = now.getTime() - dob.getTime()
  const diffWeeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7))
  return Math.max(0, diffWeeks)
}

export function calculateTotalWeeks(lifeExpectancy: number): number {
  return lifeExpectancy * WEEKS_PER_YEAR
}

export function calculateAge(dob: Date): { years: number; months: number; weeks: number } {
  const now = new Date()

  let years = now.getFullYear() - dob.getFullYear()
  let months = now.getMonth() - dob.getMonth()
  let days = now.getDate() - dob.getDate()

  if (days < 0) {
    months--
    const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0)
    days += prevMonth.getDate()
  }

  if (months < 0) {
    years--
    months += 12
  }

  const weeks = Math.floor(days / 7)

  return { years, months, weeks }
}

export function getWeekInfo(weekIndex: number, dob: Date, lifeExpectancy: number): WeekInfo {
  const weekDate = new Date(dob)
  weekDate.setDate(weekDate.getDate() + weekIndex * 7)

  const year = Math.floor(weekIndex / WEEKS_PER_YEAR)
  const weekOfYear = (weekIndex % WEEKS_PER_YEAR) + 1

  // Calculate age at this week
  const ageInWeeks = weekIndex
  const ageYears = Math.floor(ageInWeeks / WEEKS_PER_YEAR)
  const remainingWeeks = ageInWeeks % WEEKS_PER_YEAR
  const ageMonths = Math.floor(remainingWeeks / 4)
  const ageWeeksRemainder = remainingWeeks % 4

  // Check if this is a milestone week (first week of a milestone year)
  const isMilestone = MILESTONE_AGES.includes(year) && weekOfYear === 1

  return {
    weekIndex,
    weekNumber: weekIndex + 1,
    totalWeeks: calculateTotalWeeks(lifeExpectancy),
    date: weekDate,
    age: {
      years: ageYears,
      months: ageMonths,
      weeks: ageWeeksRemainder,
    },
    year,
    weekOfYear,
    isMilestone,
    milestoneAge: isMilestone ? year : undefined,
  }
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  })
}

export function formatAge(age: { years: number; months: number; weeks: number }): string {
  if (age.years === 0) {
    if (age.months === 0) {
      return `${age.weeks} week${age.weeks !== 1 ? 's' : ''}`
    }
    return `${age.months} month${age.months !== 1 ? 's' : ''}`
  }
  return `${age.years} year${age.years !== 1 ? 's' : ''}`
}

export function getAdjustedLifeExpectancy(dob: Date, currentExpectancy: number): number {
  const age = calculateAge(dob)
  if (age.years >= currentExpectancy) {
    return age.years + 5
  }
  return currentExpectancy
}

export function parseDate(dateString: string): Date | null {
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return null
  return date
}

export function isValidDOB(date: Date): boolean {
  const now = new Date()
  const minDate = new Date(now.getFullYear() - 120, now.getMonth(), now.getDate())
  return date <= now && date >= minDate
}

export function getPercentageLived(weeksLived: number, totalWeeks: number): number {
  return Math.min(100, (weeksLived / totalWeeks) * 100)
}
