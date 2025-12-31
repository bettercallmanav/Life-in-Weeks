'use client'

import { memo } from 'react'

interface YearLabelsProps {
  lifeExpectancy: number
}

function YearLabels({ lifeExpectancy }: YearLabelsProps) {
  const decades = []
  for (let i = 10; i <= lifeExpectancy; i += 10) {
    decades.push(i)
  }

  return (
    <div className="absolute left-0 top-0 h-full pointer-events-none select-none">
      {decades.map((decade) => (
        <div
          key={decade}
          className="year-label absolute -left-8 transform -translate-y-1/2"
          style={{
            top: `calc(${(decade / lifeExpectancy) * 100}% - var(--square-gap))`,
          }}
        >
          {decade}
        </div>
      ))}
    </div>
  )
}

export default memo(YearLabels)
