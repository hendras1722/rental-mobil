'use client'
import { useMemo, useCallback } from 'react'

export interface Computed<T> {
  readonly value: T
}

export interface WritableComputed<T> {
  value: T
}

export function useReactive<T>(
  getter: () => T,
  setter?: (newValue: T) => void
): WritableComputed<T> {
  const computedValue = useMemo(() => {
    try {
      return getter()
    } catch (error) {
      console.error('Error in computed getter:', error)
      return undefined as T
    }
  }, [getter])

  // Setter function
  const setterFn = useCallback(
    (newValue: T) => {
      if (setter) {
        setter(newValue)
      }
    },
    [setter]
  )

  const reactive = useMemo(() => {
    return {
      get value(): T {
        return computedValue
      },
      set value(newVal: T) {
        setterFn(newVal)
      },
    }
  }, [computedValue, setterFn])

  return reactive
}

export function useComputed<T>(getter: () => T): Computed<T> {
  const computedValue = useMemo(() => {
    try {
      return getter()
    } catch (error) {
      console.error('Error in computed getter:', error)
      return undefined as T
    }
  }, [getter])

  return useMemo(
    () => ({
      get value(): T {
        return computedValue
      },
    }),
    [computedValue]
  )
}
