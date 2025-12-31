'use client'

import { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import GridSquare from './GridSquare'
import YearLabels from './YearLabels'
import WeekTooltip from './WeekTooltip'
import {
  calculateWeeksLived,
  calculateTotalWeeks,
  getWeekInfo,
  WEEKS_PER_YEAR,
  WeekInfo,
} from '@/utils/calculations'

interface LifeGridProps {
  dob: Date
  lifeExpectancy: number
  showMilestones: boolean
}

export default function LifeGrid({
  dob,
  lifeExpectancy,
  showMilestones,
}: LifeGridProps) {
  const [hoveredWeek, setHoveredWeek] = useState<WeekInfo | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })
  const [hasAnimated, setHasAnimated] = useState(false)
  const gridRef = useRef<HTMLDivElement>(null)

  const weeksLived = useMemo(() => calculateWeeksLived(dob), [dob])
  const totalWeeks = useMemo(
    () => calculateTotalWeeks(lifeExpectancy),
    [lifeExpectancy]
  )

  // Mark animation as complete after initial render
  useEffect(() => {
    const timer = setTimeout(() => {
      setHasAnimated(true)
    }, Math.min(weeksLived * 0.5, 2000) + 500)

    return () => clearTimeout(timer)
  }, [weeksLived])

  const handleMouseMove = useCallback(
    (e: React.MouseEvent, weekIndex: number) => {
      const info = getWeekInfo(weekIndex, dob, lifeExpectancy)
      setHoveredWeek(info)
      setTooltipPosition({ x: e.clientX, y: e.clientY })
    },
    [dob, lifeExpectancy]
  )

  const handleMouseLeave = useCallback(() => {
    setHoveredWeek(null)
  }, [])

  // Generate years for the grid
  const years = useMemo(() => {
    const result = []
    for (let year = 0; year < lifeExpectancy; year++) {
      const weeks = []
      for (let week = 0; week < WEEKS_PER_YEAR; week++) {
        const weekIndex = year * WEEKS_PER_YEAR + week
        if (weekIndex < totalWeeks) {
          weeks.push(weekIndex)
        }
      }
      result.push({ year, weeks })
    }
    return result
  }, [lifeExpectancy, totalWeeks])

  return (
    <div className="relative">
      {/* Year labels */}
      <YearLabels lifeExpectancy={lifeExpectancy} />

      {/* Grid container */}
      <div
        ref={gridRef}
        className="grid-container ml-8"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${WEEKS_PER_YEAR}, var(--square-size))`,
          gap: 'var(--square-gap)',
        }}
      >
        {years.flatMap(({ year, weeks }) =>
          weeks.map((weekIndex) => {
            const isFilled = weekIndex < weeksLived
            const isCurrent = weekIndex === weeksLived
            const weekOfYear = (weekIndex % WEEKS_PER_YEAR) + 1
            const isMilestone = [18, 30, 50, 65].includes(year) && weekOfYear === 1

            // Calculate animation delay for sequential fill (only on first render)
            const animationDelay =
              !hasAnimated && isFilled
                ? Math.min(weekIndex * 0.5, 2000) // Cap at 2 seconds
                : undefined

            return (
              <GridSquare
                key={weekIndex}
                isFilled={isFilled}
                isCurrent={isCurrent}
                isMilestone={isMilestone}
                showMilestones={showMilestones}
                animationDelay={animationDelay}
                onMouseEnter={(e) => handleMouseMove(e, weekIndex)}
                onMouseLeave={handleMouseLeave}
              />
            )
          })
        )}
      </div>

      {/* Tooltip */}
      <WeekTooltip weekInfo={hoveredWeek} position={tooltipPosition} />
    </div>
  )
}
