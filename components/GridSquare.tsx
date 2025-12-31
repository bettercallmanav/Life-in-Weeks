'use client'

import { memo } from 'react'

interface GridSquareProps {
  isFilled: boolean
  isCurrent: boolean
  onMouseEnter?: (e: React.MouseEvent) => void
  onMouseLeave?: () => void
}

function GridSquare({
  isFilled,
  isCurrent,
  onMouseEnter,
  onMouseLeave,
}: GridSquareProps) {
  const classes = [
    'grid-square',
    isFilled ? 'filled' : 'empty',
    isCurrent ? 'current' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div
      className={classes}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    />
  )
}

export default memo(GridSquare)
