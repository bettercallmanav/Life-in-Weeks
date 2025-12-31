'use client'

import { useMemo } from 'react'
import {
  calculateWeeksLived,
  calculateTotalWeeks,
  calculateAge,
  getPercentageLived,
} from '@/utils/calculations'
import { useAnimatedNumber, useAnimatedPercentage } from '@/hooks/useAnimatedNumber'

interface StatsProps {
  dob: Date
  lifeExpectancy: number
}

export default function Stats({ dob, lifeExpectancy }: StatsProps) {
  const weeksLived = useMemo(() => calculateWeeksLived(dob), [dob])
  const totalWeeks = useMemo(
    () => calculateTotalWeeks(lifeExpectancy),
    [lifeExpectancy]
  )
  const weeksRemaining = totalWeeks - weeksLived
  const percentage = useMemo(
    () => getPercentageLived(weeksLived, totalWeeks),
    [weeksLived, totalWeeks]
  )
  const age = useMemo(() => calculateAge(dob), [dob])

  // Animated values
  const animatedAge = useAnimatedNumber(age.years, { duration: 800, delay: 200 })
  const animatedWeeksLived = useAnimatedNumber(weeksLived, { duration: 1200, delay: 400 })
  const animatedWeeksRemaining = useAnimatedNumber(weeksRemaining, { duration: 1000, delay: 600 })
  const animatedPercentage = useAnimatedPercentage(percentage, { duration: 1000, delay: 600 })

  return (
    <div>
      <div className="flex items-baseline gap-4 justify-center mb-2">
        <div className="text-center">
          <div className="stat-value">{animatedAge}</div>
          <div className="stat-label">years old</div>
        </div>
        <span className="text-gray-600 text-2xl opacity-30">·</span>
        <div className="text-center">
          <div className="stat-value">{animatedWeeksLived.toLocaleString()}</div>
          <div className="stat-label">weeks lived</div>
        </div>
      </div>

      <div className="flex items-baseline gap-4 justify-center mt-4">
        <div className="text-center">
          <div className="font-mono text-lg">{animatedWeeksRemaining.toLocaleString()}</div>
          <div className="stat-label">weeks left</div>
        </div>
        <span className="text-gray-600 opacity-30">·</span>
        <div className="text-center">
          <div className="font-mono text-lg">{animatedPercentage}%</div>
          <div className="stat-label">lived</div>
        </div>
        <span className="text-gray-600 opacity-30">·</span>
        <div className="text-center">
          <div className="font-mono text-lg">{lifeExpectancy}</div>
          <div className="stat-label">expectancy</div>
        </div>
      </div>
    </div>
  )
}
