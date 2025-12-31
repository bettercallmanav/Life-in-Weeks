'use client'

import { useState, useCallback, useMemo } from 'react'

interface DatePickerProps {
  value: string
  onChange: (date: string) => void
}

const ChevronLeft = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M15 18l-6-6 6-6" />
  </svg>
)

const ChevronRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 18l6-6-6-6" />
  </svg>
)

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

export default function DatePicker({ value, onChange }: DatePickerProps) {
  const today = new Date()
  const [viewYear, setViewYear] = useState(value ? new Date(value).getFullYear() : today.getFullYear() - 25)
  const [viewMonth, setViewMonth] = useState(value ? new Date(value).getMonth() : today.getMonth())
  const [showYearPicker, setShowYearPicker] = useState(false)

  const selectedDate = value ? new Date(value) : null

  // Get days in month
  const daysInMonth = useMemo(() => {
    const firstDay = new Date(viewYear, viewMonth, 1)
    const lastDay = new Date(viewYear, viewMonth + 1, 0)
    const daysCount = lastDay.getDate()
    const startDay = firstDay.getDay()

    const days: (number | null)[] = []

    // Add empty cells for days before the first
    for (let i = 0; i < startDay; i++) {
      days.push(null)
    }

    // Add the days
    for (let i = 1; i <= daysCount; i++) {
      days.push(i)
    }

    return days
  }, [viewYear, viewMonth])

  // Generate year options (100 years back from current)
  const yearOptions = useMemo(() => {
    const years = []
    const currentYear = today.getFullYear()
    for (let y = currentYear; y >= currentYear - 100; y--) {
      years.push(y)
    }
    return years
  }, [])

  const handlePrevMonth = useCallback(() => {
    if (viewMonth === 0) {
      setViewMonth(11)
      setViewYear(y => y - 1)
    } else {
      setViewMonth(m => m - 1)
    }
  }, [viewMonth])

  const handleNextMonth = useCallback(() => {
    if (viewMonth === 11) {
      setViewMonth(0)
      setViewYear(y => y + 1)
    } else {
      setViewMonth(m => m + 1)
    }
  }, [viewMonth])

  const handleDayClick = useCallback((day: number) => {
    const date = new Date(viewYear, viewMonth, day)
    // Don't allow future dates
    if (date > today) return

    // Format as YYYY-MM-DD
    const formatted = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    onChange(formatted)
  }, [viewYear, viewMonth, onChange])

  const handleYearSelect = useCallback((year: number) => {
    setViewYear(year)
    setShowYearPicker(false)
  }, [])

  const isSelected = useCallback((day: number) => {
    if (!selectedDate) return false
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === viewMonth &&
      selectedDate.getFullYear() === viewYear
    )
  }, [selectedDate, viewMonth, viewYear])

  const isDisabled = useCallback((day: number) => {
    const date = new Date(viewYear, viewMonth, day)
    return date > today
  }, [viewYear, viewMonth])

  const isToday = useCallback((day: number) => {
    return (
      today.getDate() === day &&
      today.getMonth() === viewMonth &&
      today.getFullYear() === viewYear
    )
  }, [viewMonth, viewYear])

  return (
    <div className="date-picker w-full max-w-xs mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={handlePrevMonth}
          className="icon-btn"
          aria-label="Previous month"
        >
          <ChevronLeft />
        </button>

        <button
          type="button"
          onClick={() => setShowYearPicker(!showYearPicker)}
          className="text-sm font-mono hover:text-white transition-colors"
        >
          {MONTHS[viewMonth]} {viewYear}
        </button>

        <button
          type="button"
          onClick={handleNextMonth}
          className="icon-btn"
          aria-label="Next month"
        >
          <ChevronRight />
        </button>
      </div>

      {/* Year picker dropdown */}
      {showYearPicker && (
        <div className="year-picker mb-4 max-h-48 overflow-y-auto rounded border border-gray-700 bg-black/90">
          <div className="grid grid-cols-4 gap-1 p-2">
            {yearOptions.map(year => (
              <button
                key={year}
                type="button"
                onClick={() => handleYearSelect(year)}
                className={`px-2 py-1 text-xs font-mono rounded transition-colors ${
                  year === viewYear
                    ? 'bg-white text-black'
                    : 'hover:bg-gray-800 text-gray-400 hover:text-white'
                }`}
              >
                {year}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Calendar grid */}
      {!showYearPicker && (
        <>
          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {DAYS.map(day => (
              <div
                key={day}
                className="text-center text-xs text-gray-500 font-mono py-1"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Days */}
          <div className="grid grid-cols-7 gap-1">
            {daysInMonth.map((day, index) => (
              <div key={index} className="aspect-square">
                {day !== null && (
                  <button
                    type="button"
                    onClick={() => handleDayClick(day)}
                    disabled={isDisabled(day)}
                    className={`w-full h-full rounded text-sm font-mono transition-all ${
                      isSelected(day)
                        ? 'bg-white text-black'
                        : isToday(day)
                        ? 'border border-gray-500 text-white'
                        : isDisabled(day)
                        ? 'text-gray-700 cursor-not-allowed'
                        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    {day}
                  </button>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* Selected date display */}
      {selectedDate && (
        <div className="mt-4 text-center text-sm text-gray-400 font-mono">
          Selected: {selectedDate.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
          })}
        </div>
      )}
    </div>
  )
}
