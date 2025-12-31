'use client'

import { useState, useCallback } from 'react'
import { isValidDOB, parseDate } from '@/utils/calculations'
import DatePicker from './DatePicker'

interface DOBOverlayProps {
  onSubmit: (dob: string) => void
}

export default function DOBOverlay({ onSubmit }: DOBOverlayProps) {
  const [date, setDate] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()

      if (!date) {
        setError('Please select your date of birth')
        return
      }

      const parsedDate = parseDate(date)
      if (!parsedDate) {
        setError('Please enter a valid date')
        return
      }

      if (!isValidDOB(parsedDate)) {
        setError('Please enter a valid birth date')
        return
      }

      onSubmit(date)
    },
    [date, onSubmit]
  )

  const handleDateChange = useCallback((newDate: string) => {
    setDate(newDate)
    setError('')
  }, [])

  return (
    <div className="overlay-backdrop fixed inset-0 z-50 flex items-center justify-center p-4 overflow-auto">
      <div className="animate-fade-in max-w-md w-full text-center py-8">
        {/* Title */}
        <h1 className="font-serif text-4xl md:text-5xl italic mb-3">
          Life in Weeks
        </h1>

        {/* Subtitle */}
        <p className="text-gray-500 text-sm mb-10 tracking-wide">
          Visualize your life. Make it count.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-4">
              When were you born?
            </label>

            <DatePicker value={date} onChange={handleDateChange} />

            {error && (
              <p className="text-red-400 text-xs mt-2">{error}</p>
            )}
          </div>

          <button
            type="submit"
            className={`btn btn-primary mt-6 ${!date ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={!date}
          >
            See Your Life
          </button>
        </form>

        {/* Footer note */}
        <p className="mt-10 text-xs text-gray-600">
          Your data stays in your browser
        </p>
      </div>
    </div>
  )
}
