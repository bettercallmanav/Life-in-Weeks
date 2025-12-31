'use client'

import { memo } from 'react'

interface GridSquareProps {
  isFilled: boolean
  isCurrent: boolean
  isMilestone: boolean
  showMilestones: boolean
  animationDelay?: number
  onMouseEnter?: (e: React.MouseEvent) => void
  onMouseLeave?: () => void
}

function GridSquare({
  isFilled,
  isCurrent,
  isMilestone,
  showMilestones,
  animationDelay,
  onMouseEnter,
  onMouseLeave,
}: GridSquareProps) {
  const classes = [
    'grid-square',
    isFilled ? 'filled' : 'empty',
    isCurrent ? 'current' : '',
    showMilestones && isMilestone ? 'milestone' : '',
    animationDelay !== undefined ? 'animating' : '',
  ]
    .filter(Boolean)
    .join(' ')

  const style = animationDelay !== undefined
    ? { animationDelay: `${animationDelay}ms` }
    : undefined

  return (
    <div
      className={classes}
      style={style}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    />
  )
}

export default memo(GridSquare)
