'use client'

import { useState, useCallback, useRef, useMemo } from 'react'
import { useAppSettings, defaultSettings } from '@/hooks/useLocalStorage'
import { useTheme, useZoom, useKeyboardShortcuts, ZoomLevel } from '@/hooks/useTheme'
import { parseDate, getAdjustedLifeExpectancy } from '@/utils/calculations'
import { exportGridAsImage, generateFilename } from '@/utils/export'
import DOBOverlay from '@/components/DOBOverlay'
import LifeGrid from '@/components/LifeGrid'
import Stats from '@/components/Stats'
import Controls, { zoomLevels } from '@/components/Controls'
import Settings from '@/components/Settings'

export default function Home() {
  const { settings, updateSettings, isLoaded } = useAppSettings()
  const [settingsOpen, setSettingsOpen] = useState(false)
  const gridRef = useRef<HTMLDivElement>(null)

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
      updateSettings({ dob: dobString })
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

  const handleStatsToggle = useCallback(() => {
    updateSettings({ showDetailedStats: !settings.showDetailedStats })
  }, [settings.showDetailedStats, updateSettings])

  const handleMilestonesToggle = useCallback(() => {
    updateSettings({ showMilestones: !settings.showMilestones })
  }, [settings.showMilestones, updateSettings])

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
    updateSettings({ dob: null })
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
    return <DOBOverlay onSubmit={handleDOBSubmit} />
  }

  return (
    <main className="min-h-screen flex flex-col items-center py-12 px-4">
      {/* Header */}
      <header className="text-center mb-8">
        <h1 className="font-serif text-2xl md:text-3xl italic mb-6 opacity-80">
          Life in Weeks
        </h1>
        <Stats
          dob={dob}
          lifeExpectancy={adjustedLifeExpectancy}
          showDetailed={settings.showDetailedStats}
        />
      </header>

      {/* Grid */}
      <div ref={gridRef} className="grid-container flex-1 overflow-auto p-4">
        <LifeGrid
          dob={dob}
          lifeExpectancy={adjustedLifeExpectancy}
          showMilestones={settings.showMilestones}
        />
      </div>

      {/* Controls */}
      <Controls
        zoom={settings.zoom}
        onZoomChange={handleZoomChange}
        theme={settings.theme}
        onThemeToggle={handleThemeToggle}
        showDetailedStats={settings.showDetailedStats}
        onStatsToggle={handleStatsToggle}
        showMilestones={settings.showMilestones}
        onMilestonesToggle={handleMilestonesToggle}
        onSettingsOpen={() => setSettingsOpen(true)}
        onExport={handleExport}
        onEditDOB={handleEditDOB}
      />

      {/* Settings Modal */}
      <Settings
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        lifeExpectancy={settings.lifeExpectancy}
        onLifeExpectancyChange={handleLifeExpectancyChange}
        onReset={handleReset}
      />
    </main>
  )
}
