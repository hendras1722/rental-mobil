'use client'

import { usePathname, useParams } from 'next/navigation'
import { useEffect } from 'react'
import { default as ref } from '@/composable/ref'
import { useComputed } from './useComputed'

export const useRoute = () => {
  const pathname = usePathname()
  const params = useParams()

  const query = ref<Record<string, string>>({})
  const origin = ref('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      const result: Record<string, string> = {}
      urlParams.forEach((value, key) => {
        result[key] = value
      })
      query.value = result
      origin.value = window.location.origin
    }
  }, [pathname, params])

  const asPath = useComputed(() => {
    const qs = new URLSearchParams(query.value).toString()
    return qs ? `${pathname}?${qs}` : pathname
  })

  return {
    pathname,
    query: query.value,
    params,
    asPath: asPath.value,
    fullPath: `${origin.value}${asPath.value}`,
    origin: origin.value,
  }
}
