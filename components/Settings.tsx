'use client'

import { useState, useEffect } from 'react'

interface SettingsProps {
  isOpen: boolean
  onClose: () => void
  lifeExpectancy: number
  onLifeExpectancyChange: (value: number) => void
  onReset: () => void
}

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
)

export default function Settings({
  isOpen,
  onClose,
  lifeExpectancy,
  onLifeExpectancyChange,
  onReset,
}: SettingsProps) {
  const [localValue, setLocalValue] = useState(lifeExpectancy)

  useEffect(() => {
    setLocalValue(lifeExpectancy)
  }, [lifeExpectancy])

  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10)
    setLocalValue(value)
    onLifeExpectancyChange(value)
  }

  return (
    <div className="overlay-backdrop fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="animate-fade-in max-w-sm w-full p-6 rounded-lg border modal-content"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-xl italic">Settings</h2>
          <button onClick={onClose} className="icon-btn">
            <CloseIcon />
          </button>
        </div>

        {/* Life expectancy slider */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs uppercase tracking-widest text-muted-dark">
              Life Expectancy
            </label>
            <span className="font-mono text-lg">{localValue}</span>
          </div>
          <input
            type="range"
            min="50"
            max="100"
            value={localValue}
            onChange={handleSliderChange}
            className="w-full"
          />
          <div className="flex justify-between mt-2 text-xs text-muted-dark">
            <span>50</span>
            <span>100</span>
          </div>
        </div>

        {/* Reset button */}
        <div className="pt-4 border-t border-empty-dark">
          <button
            onClick={onReset}
            className="btn btn-ghost w-full text-red-400 border-red-400/30 hover:border-red-400/50"
          >
            Reset All Data
          </button>
          <p className="text-xs text-muted-dark text-center mt-2">
            This will clear your saved date of birth
          </p>
        </div>
      </div>

      {/* Click outside to close */}
      <div className="absolute inset-0 -z-10" onClick={onClose} />
    </div>
  )
}
