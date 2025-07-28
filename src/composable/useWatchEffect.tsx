import { useEffect, useRef, useCallback } from 'react'

type WatchCallback<T> = (newValue: T, oldValue: T | undefined) => void
type WatchEffectCallback = () => void | (() => void)

interface UseWatchOptions {
  immediate?: boolean
  deep?: boolean
}

/**
 * Watch a value and execute a callback when it changes.
 *
 * Warning use useWatch can cause infinite loop
 * @param source The value to watch.
 * @param callback The callback to execute when the value changes.
 * @param options Options for the watcher.
 * @param options.immediate Whether to execute the callback immediately.
 * @param options.deep Whether to deep-watch the value.
 * @returns Nothing.
 */
export function useWatch<T>(
  source: T,
  callback: WatchCallback<T>,
  options?: UseWatchOptions
): void {
  const { immediate = false, deep = false } = options || {}
  const previousValue = useRef<T | undefined>(undefined)
  const isFirstRun = useRef(true)

  const isEqual = useCallback(
    (a: T, b: T | undefined): boolean => {
      if (b === undefined) return false
      if (!deep) return Object.is(a, b)

      if (a === b) return true
      if (a == null || b == null) return a === b
      if (typeof a !== 'object' || typeof b !== 'object') return a === b

      try {
        return JSON.stringify(a) === JSON.stringify(b)
      } catch {
        // Fallback to strict equality if stringify fails (e.g., circular references)
        return Object.is(a, b)
      }
    },
    [deep]
  )

  useEffect(() => {
    if (isFirstRun.current) {
      if (immediate) {
        callback(source, previousValue.current)
      }
      previousValue.current = source
      isFirstRun.current = false
      return
    }

    if (!isEqual(source, previousValue.current)) {
      callback(source, previousValue.current)
    }

    previousValue.current = source
  }, [source, callback, immediate, isEqual])
}

interface UseWatchEffectOptions {
  flush?: 'pre' | 'post' | 'sync'
}

/**
 * useWatchEffect is a custom React hook that executes a side-effect function when its dependencies change.
 *
 * @param effect - The side-effect function to run. It can optionally return a cleanup function.
 * @param options - Optional configuration object.
 * @param options.flush - Determines when the effect should be flushed ('pre', 'post', or 'sync').
 *                        Note: 'pre' and 'sync' are not fully implemented and will behave like 'post'.
 *
 * The effect function is executed initially and then on every dependency change.
 * If the effect function returns a cleanup function, it will be called before the effect is re-run.
 */

export function useWatchEffect(
  effect: WatchEffectCallback,
  options?: UseWatchEffectOptions
): void {
  const { flush = 'post' } = options || {}
  const cleanupFn = useRef<(() => void) | undefined>(undefined)

  const runEffect = useCallback(() => {
    if (cleanupFn.current) {
      cleanupFn.current()
    }

    cleanupFn.current = effect() ?? undefined
  }, [effect])

  useEffect(() => {
    runEffect()

    return () => {
      if (cleanupFn.current) {
        cleanupFn.current()
      }
    }
  }, [runEffect])

  if (flush === 'pre' || flush === 'sync') {
    console.warn(
      `flush option '${flush}' is not yet fully implemented in useWatchEffect.  It will behave like 'post'.`
    )
  }
}
