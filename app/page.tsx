'use client'

import { useState, useCallback, useRef, useMemo, useEffect } from 'react'
import { useAppSettings, defaultSettings } from '@/hooks/useLocalStorage'
import { useTheme, useZoom, useKeyboardShortcuts, ZoomLevel } from '@/hooks/useTheme'
import { parseDate, getAdjustedLifeExpectancy } from '@/utils/calculations'
import { exportGridAsImage, generateFilename } from '@/utils/export'
import DOBOverlay from '@/components/DOBOverlay'
import LifeGrid from '@/components/LifeGrid'
import Stats from '@/components/Stats'
import Controls from '@/components/Controls'
import Settings from '@/components/Settings'

const zoomLevels: ('tiny' | 'small' | 'medium')[] = ['tiny', 'small', 'medium']

export default function Home() {
  const { settings, updateSettings, isLoaded } = useAppSettings()
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [pageReady, setPageReady] = useState(false)
  const gridRef = useRef<HTMLDivElement>(null)

  // Trigger page animation after mount
  useEffect(() => {
    if (isLoaded) {
      const timer = setTimeout(() => setPageReady(true), 50)
      return () => clearTimeout(timer)
    }
  }, [isLoaded])

  // Parse DOB
  const dob = useMemo(() => {
    if (!settings.dob) return null
    return parseDate(settings.dob)
  }, [settings.dob])

  // Auto-adjust life expectancy if needed
  const adjustedLifeExpectancy = useMemo(() => {
    if (!dob) return settings.lifeExpectancy
    return getAdjustedLifeExpectancy(dob, settings.lifeExpectancy)
  }, [dob, settings.lifeExpectancy])

  // Apply theme and zoom
  useTheme(settings.theme)
  useZoom(settings.zoom)

  // Handlers
  const handleDOBSubmit = useCallback(
    (dobString: string) => {
      setPageReady(false)
      setTimeout(() => {
        updateSettings({ dob: dobString })
        setTimeout(() => setPageReady(true), 50)
      }, 300)
    },
    [updateSettings]
  )

  const handleZoomChange = useCallback(
    (zoom: ZoomLevel) => {
      updateSettings({ zoom })
    },
    [updateSettings]
  )

  const handleThemeToggle = useCallback(() => {
    updateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' })
  }, [settings.theme, updateSettings])

  const handleLifeExpectancyChange = useCallback(
    (value: number) => {
      updateSettings({ lifeExpectancy: value })
    },
    [updateSettings]
  )

  const handleReset = useCallback(() => {
    updateSettings(defaultSettings)
    setSettingsOpen(false)
  }, [updateSettings])

  const handleEditDOB = useCallback(() => {
    setPageReady(false)
    setTimeout(() => {
      updateSettings({ dob: null })
      setTimeout(() => setPageReady(true), 50)
    }, 300)
  }, [updateSettings])

  const handleExport = useCallback(async () => {
    if (!gridRef.current || !dob) return
    try {
      const filename = generateFilename(dob)
      await exportGridAsImage(gridRef.current, filename)
    } catch (error) {
      console.error('Export failed:', error)
    }
  }, [dob])

  // Keyboard shortcuts
  const handleZoomIn = useCallback(() => {
    const currentIndex = zoomLevels.indexOf(settings.zoom)
    if (currentIndex < zoomLevels.length - 1) {
      updateSettings({ zoom: zoomLevels[currentIndex + 1] })
    }
  }, [settings.zoom, updateSettings])

  const handleZoomOut = useCallback(() => {
    const currentIndex = zoomLevels.indexOf(settings.zoom)
    if (currentIndex > 0) {
      updateSettings({ zoom: zoomLevels[currentIndex - 1] })
    }
  }, [settings.zoom, updateSettings])

  const handleEscape = useCallback(() => {
    setSettingsOpen(false)
  }, [])

  useKeyboardShortcuts(handleZoomIn, handleZoomOut, handleEscape)

  // Loading state
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-dark text-sm tracking-widest uppercase">
          Loading...
        </div>
      </div>
    )
  }

  // Show DOB overlay if no date set
  if (!dob) {
    return (
      <div className={`transition-all duration-500 ${pageReady ? 'opacity-100' : 'opacity-0'}`}>
        <DOBOverlay onSubmit={handleDOBSubmit} />
      </div>
    )
  }

  return (
    <div className={`min-h-screen flex flex-col transition-all duration-500 ${pageReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      {/* Fixed Header Controls */}
      <div className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center header-bar">
        <Controls
          theme={settings.theme}
          onThemeToggle={handleThemeToggle}
          onSettingsOpen={() => setSettingsOpen(true)}
          onExport={handleExport}
          onEditDOB={handleEditDOB}
        />
      </div>

      {/* Main content with padding for fixed header */}
      <main className="flex-1 flex flex-col items-center pt-20 pb-12 px-4">
        {/* Title & Stats */}
        <header className="text-center mb-8">
          <h1 className="font-serif text-2xl md:text-3xl italic mb-6 opacity-80">
            Life in Weeks
          </h1>
          <Stats
            dob={dob}
            lifeExpectancy={adjustedLifeExpectancy}
          />
        </header>

        {/* Grid */}
        <div ref={gridRef} className="grid-container flex-1 overflow-auto p-4">
          <LifeGrid
            dob={dob}
            lifeExpectancy={adjustedLifeExpectancy}
          />
        </div>
      </main>

      {/* Settings Modal */}
      <Settings
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        zoom={settings.zoom}
        onZoomChange={handleZoomChange}
        lifeExpectancy={settings.lifeExpectancy}
        onLifeExpectancyChange={handleLifeExpectancyChange}
        onReset={handleReset}
      />
    </div>
  )
}
