'use client'

import { useState, useMemo, useCallback, useRef } from 'react'
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
}

export default function LifeGrid({
  dob,
  lifeExpectancy,
}: LifeGridProps) {
  const [hoveredWeek, setHoveredWeek] = useState<WeekInfo | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })
  const gridRef = useRef<HTMLDivElement>(null)

  const weeksLived = useMemo(() => calculateWeeksLived(dob), [dob])
  const totalWeeks = useMemo(
    () => calculateTotalWeeks(lifeExpectancy),
    [lifeExpectancy]
  )

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

  // Generate all weeks
  const weeks = useMemo(() => {
    const result = []
    for (let i = 0; i < totalWeeks; i++) {
      result.push({
        weekIndex: i,
        isFilled: i < weeksLived,
        isCurrent: i === weeksLived,
      })
    }
    return result
  }, [totalWeeks, weeksLived])

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
        {weeks.map(({ weekIndex, isFilled, isCurrent }) => (
          <GridSquare
            key={weekIndex}
            isFilled={isFilled}
            isCurrent={isCurrent}
            onMouseEnter={(e) => handleMouseMove(e, weekIndex)}
            onMouseLeave={handleMouseLeave}
          />
        ))}
      </div>

      {/* Tooltip */}
      <WeekTooltip weekInfo={hoveredWeek} position={tooltipPosition} />
    </div>
  )
}
