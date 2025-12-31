'use client'

import { useState, useEffect, useCallback } from 'react'

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, boolean] {
  const [storedValue, setStoredValue] = useState<T>(initialValue)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key)
      if (item) {
        setStoredValue(JSON.parse(item))
      }
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error)
    }
    setIsLoaded(true)
  }, [key])

  // Save to localStorage whenever value changes
  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value
        setStoredValue(valueToStore)
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error)
      }
    },
    [key, storedValue]
  )

  return [storedValue, setValue, isLoaded]
}

export interface AppSettings {
  dob: string | null
  lifeExpectancy: number
  theme: 'dark' | 'light'
  zoom: 'tiny' | 'small' | 'medium'
  showDetailedStats: boolean
  showMilestones: boolean
}

export const defaultSettings: AppSettings = {
  dob: null,
  lifeExpectancy: 80,
  theme: 'dark',
  zoom: 'small',
  showDetailedStats: false,
  showMilestones: false,
}

export function useAppSettings() {
  const [settings, setSettings, isLoaded] = useLocalStorage<AppSettings>(
    'life-in-weeks-settings',
    defaultSettings
  )

  const updateSettings = useCallback(
    (updates: Partial<AppSettings>) => {
      setSettings((prev) => ({ ...prev, ...updates }))
    },
    [setSettings]
  )

  return { settings, updateSettings, isLoaded }
}
