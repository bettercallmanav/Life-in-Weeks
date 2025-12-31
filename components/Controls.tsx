'use client'

import { useState, useCallback } from 'react'
import { ZoomLevel } from '@/hooks/useTheme'

interface ControlsProps {
  zoom: ZoomLevel
  onZoomChange: (zoom: ZoomLevel) => void
  theme: 'dark' | 'light'
  onThemeToggle: () => void
  showDetailedStats: boolean
  onStatsToggle: () => void
  showMilestones: boolean
  onMilestonesToggle: () => void
  onSettingsOpen: () => void
  onExport: () => void
  onEditDOB: () => void
}

// Icons as inline SVGs for minimal dependencies
const ZoomInIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8" />
    <path d="M21 21l-4.35-4.35M11 8v6M8 11h6" />
  </svg>
)

const ZoomOutIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8" />
    <path d="M21 21l-4.35-4.35M8 11h6" />
  </svg>
)

const SunIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="5" />
    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
  </svg>
)

const MoonIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
)

const StatsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 20V10M12 20V4M6 20v-6" />
  </svg>
)

const FlagIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7" />
  </svg>
)

const SettingsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
)

const DownloadIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
  </svg>
)

const FullscreenIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
  </svg>
)

const ExitFullscreenIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
  </svg>
)

const EditIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
)

const zoomLevels: ZoomLevel[] = ['tiny', 'small', 'medium']

export default function Controls({
  zoom,
  onZoomChange,
  theme,
  onThemeToggle,
  showDetailedStats,
  onStatsToggle,
  showMilestones,
  onMilestonesToggle,
  onSettingsOpen,
  onExport,
  onEditDOB,
}: ControlsProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const handleFullscreenToggle = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true)
      }).catch((err) => {
        console.error('Fullscreen error:', err)
      })
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false)
      }).catch((err) => {
        console.error('Exit fullscreen error:', err)
      })
    }
  }, [])

  const handleZoomIn = useCallback(() => {
    const currentIndex = zoomLevels.indexOf(zoom)
    if (currentIndex < zoomLevels.length - 1) {
      onZoomChange(zoomLevels[currentIndex + 1])
    }
  }, [zoom, onZoomChange])

  const handleZoomOut = useCallback(() => {
    const currentIndex = zoomLevels.indexOf(zoom)
    if (currentIndex > 0) {
      onZoomChange(zoomLevels[currentIndex - 1])
    }
  }, [zoom, onZoomChange])

  return (
    <div
      className={`controls-wrapper fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 ${
        isVisible ? 'visible' : ''
      }`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      <div className="controls-bar flex items-center gap-1 p-2 rounded-lg border">
        {/* Zoom controls */}
        <button
          type="button"
          onClick={handleZoomOut}
          className="icon-btn"
          title="Zoom out (-)"
          disabled={zoom === 'tiny'}
        >
          <ZoomOutIcon />
        </button>
        <span className="text-xs text-gray-400 px-2 w-12 text-center">{zoom}</span>
        <button
          type="button"
          onClick={handleZoomIn}
          className="icon-btn"
          title="Zoom in (+)"
          disabled={zoom === 'medium'}
        >
          <ZoomInIcon />
        </button>

        <div className="w-px h-4 bg-gray-600 mx-2" />

        {/* Stats toggle */}
        <button
          type="button"
          onClick={onStatsToggle}
          className={`icon-btn ${showDetailedStats ? '!text-white' : ''}`}
          title="Toggle detailed stats"
        >
          <StatsIcon />
        </button>

        {/* Milestones toggle */}
        <button
          type="button"
          onClick={onMilestonesToggle}
          className={`icon-btn ${showMilestones ? '!text-white' : ''}`}
          title="Toggle milestones"
        >
          <FlagIcon />
        </button>

        {/* Theme toggle */}
        <button type="button" onClick={onThemeToggle} className="icon-btn" title="Toggle theme">
          {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
        </button>

        <div className="w-px h-4 bg-gray-600 mx-2" />

        {/* Settings */}
        <button type="button" onClick={onSettingsOpen} className="icon-btn" title="Settings">
          <SettingsIcon />
        </button>

        {/* Export */}
        <button type="button" onClick={onExport} className="icon-btn" title="Download as image">
          <DownloadIcon />
        </button>

        {/* Fullscreen */}
        <button type="button" onClick={handleFullscreenToggle} className="icon-btn" title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}>
          {isFullscreen ? <ExitFullscreenIcon /> : <FullscreenIcon />}
        </button>

        <div className="w-px h-4 bg-gray-600 mx-2" />

        {/* Edit DOB */}
        <button type="button" onClick={onEditDOB} className="icon-btn" title="Edit date of birth">
          <EditIcon />
        </button>
      </div>

      {/* Hover trigger area - behind the controls */}
      <div className="absolute -inset-4 -z-10" />
    </div>
  )
}

export { zoomLevels }
