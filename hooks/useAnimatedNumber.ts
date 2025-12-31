'use client'

import { useState, useEffect, useRef } from 'react'

interface UseAnimatedNumberOptions {
  duration?: number
  delay?: number
  easing?: (t: number) => number
}

// Easing functions
export const easings = {
  linear: (t: number) => t,
  easeOut: (t: number) => 1 - Math.pow(1 - t, 3),
  easeInOut: (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
  easeOutExpo: (t: number) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
}

export function useAnimatedNumber(
  targetValue: number,
  options: UseAnimatedNumberOptions = {}
): number {
  const {
    duration = 1000,
    delay = 0,
    easing = easings.easeOutExpo,
  } = options

  const [displayValue, setDisplayValue] = useState(0)
  const animationRef = useRef<number>()
  const startTimeRef = useRef<number>()
  const startValueRef = useRef(0)
  const hasStartedRef = useRef(false)

  useEffect(() => {
    // Cancel any existing animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }

    const startAnimation = () => {
      startValueRef.current = displayValue
      startTimeRef.current = undefined
      hasStartedRef.current = true

      const animate = (timestamp: number) => {
        if (!startTimeRef.current) {
          startTimeRef.current = timestamp
        }

        const elapsed = timestamp - startTimeRef.current
        const progress = Math.min(elapsed / duration, 1)
        const easedProgress = easing(progress)

        const currentValue = startValueRef.current + (targetValue - startValueRef.current) * easedProgress
        setDisplayValue(Math.round(currentValue))

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate)
        }
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    if (delay > 0 && !hasStartedRef.current) {
      const timeoutId = setTimeout(startAnimation, delay)
      return () => {
        clearTimeout(timeoutId)
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current)
        }
      }
    } else {
      startAnimation()
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [targetValue, duration, delay, easing])

  return displayValue
}

// Hook for animating percentages with decimal
export function useAnimatedPercentage(
  targetValue: number,
  options: UseAnimatedNumberOptions = {}
): string {
  const {
    duration = 1000,
    delay = 0,
    easing = easings.easeOutExpo,
  } = options

  const [displayValue, setDisplayValue] = useState(0)
  const animationRef = useRef<number>()
  const startTimeRef = useRef<number>()
  const startValueRef = useRef(0)

  useEffect(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }

    const startAnimation = () => {
      startValueRef.current = displayValue
      startTimeRef.current = undefined

      const animate = (timestamp: number) => {
        if (!startTimeRef.current) {
          startTimeRef.current = timestamp
        }

        const elapsed = timestamp - startTimeRef.current
        const progress = Math.min(elapsed / duration, 1)
        const easedProgress = easing(progress)

        const currentValue = startValueRef.current + (targetValue - startValueRef.current) * easedProgress
        setDisplayValue(currentValue)

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate)
        }
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    if (delay > 0) {
      const timeoutId = setTimeout(startAnimation, delay)
      return () => {
        clearTimeout(timeoutId)
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current)
        }
      }
    } else {
      startAnimation()
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [targetValue, duration, delay, easing])

  return displayValue.toFixed(1)
}
