'use client'

import { useMemo } from 'react'
import {
  calculateWeeksLived,
  calculateTotalWeeks,
  calculateAge,
  getPercentageLived,
} from '@/utils/calculations'

interface StatsProps {
  dob: Date
  lifeExpectancy: number
  showDetailed: boolean
}

export default function Stats({ dob, lifeExpectancy, showDetailed }: StatsProps) {
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

  return (
    <div className="animate-slide-up">
      {/* Minimal stats (always shown) */}
      <div className="flex items-baseline gap-4 justify-center mb-2">
        <div className="text-center">
          <div className="stat-value">{age.years}</div>
          <div className="stat-label">years old</div>
        </div>
        <span className="text-muted-dark text-2xl opacity-30">·</span>
        <div className="text-center">
          <div className="stat-value">{weeksLived.toLocaleString()}</div>
          <div className="stat-label">weeks lived</div>
        </div>
      </div>

      {/* Detailed stats (toggle) */}
      {showDetailed && (
        <div className="flex items-baseline gap-4 justify-center mt-4 animate-fade-in">
          <div className="text-center">
            <div className="font-mono text-lg">{weeksRemaining.toLocaleString()}</div>
            <div className="stat-label">weeks left</div>
          </div>
          <span className="text-muted-dark opacity-30">·</span>
          <div className="text-center">
            <div className="font-mono text-lg">{percentage.toFixed(1)}%</div>
            <div className="stat-label">lived</div>
          </div>
          <span className="text-muted-dark opacity-30">·</span>
          <div className="text-center">
            <div className="font-mono text-lg">{lifeExpectancy}</div>
            <div className="stat-label">expectancy</div>
          </div>
        </div>
      )}
    </div>
  )
}
