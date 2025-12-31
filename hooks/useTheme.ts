'use client'

import { useEffect, useCallback } from 'react'

export type Theme = 'dark' | 'light'
export type ZoomLevel = 'tiny' | 'small' | 'medium'

export function useTheme(theme: Theme) {
  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('light')
    } else {
      document.body.classList.remove('light')
    }
  }, [theme])
}

export function useZoom(zoom: ZoomLevel) {
  useEffect(() => {
    document.body.setAttribute('data-zoom', zoom)
  }, [zoom])
}

export function useKeyboardShortcuts(
  onZoomIn: () => void,
  onZoomOut: () => void,
  onEscape: () => void
) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Ignore if typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return
      }

      switch (e.key) {
        case '+':
        case '=':
          e.preventDefault()
          onZoomIn()
          break
        case '-':
        case '_':
          e.preventDefault()
          onZoomOut()
          break
        case 'Escape':
          e.preventDefault()
          onEscape()
          break
      }
    },
    [onZoomIn, onZoomOut, onEscape]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])
}
