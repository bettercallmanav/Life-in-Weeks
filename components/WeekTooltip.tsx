'use client'

import { useEffect, useState } from 'react'
import { WeekInfo, formatDate, formatAge } from '@/utils/calculations'

interface WeekTooltipProps {
  weekInfo: WeekInfo | null
  position: { x: number; y: number }
}

export default function WeekTooltip({ weekInfo, position }: WeekTooltipProps) {
  const [adjustedPosition, setAdjustedPosition] = useState(position)

  useEffect(() => {
    if (!weekInfo) return

    // Adjust position to keep tooltip on screen
    const padding = 10
    const tooltipWidth = 200
    const tooltipHeight = 40

    let x = position.x + 15
    let y = position.y - tooltipHeight / 2

    if (x + tooltipWidth > window.innerWidth - padding) {
      x = position.x - tooltipWidth - 15
    }

    if (y < padding) {
      y = padding
    } else if (y + tooltipHeight > window.innerHeight - padding) {
      y = window.innerHeight - tooltipHeight - padding
    }

    setAdjustedPosition({ x, y })
  }, [position, weekInfo])

  if (!weekInfo) return null

  return (
    <div
      className={`tooltip ${weekInfo ? 'visible' : ''}`}
      style={{
        left: adjustedPosition.x,
        top: adjustedPosition.y,
      }}
    >
      <span className="opacity-70">Week {weekInfo.weekNumber.toLocaleString()}</span>
      <span className="mx-2 opacity-30">·</span>
      <span>{formatDate(weekInfo.date)}</span>
      <span className="mx-2 opacity-30">·</span>
      <span>Age {formatAge(weekInfo.age)}</span>
    </div>
  )
}
