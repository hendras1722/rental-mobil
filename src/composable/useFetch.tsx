import { ofetch, type FetchOptions } from 'ofetch'

export const useFetch = ofetch.create({
  baseURL: '/v1',

  onRequest({ options }: { options: FetchOptions }) {
    const token = process.env.NEXT_PUBLIC_API_TOKEN

    if (token) {
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      }
    }

    // handle query params
    if (options.params) {
      const url = new URL(options.baseURL ?? '', 'http://localhost')
      Object.entries(options.params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value))
        }
      })

      options.baseURL = url.pathname + url.search
    }
  },

  onResponse({ response }) {
    console.log('[API RESPONSE]', response.status, response.statusText)
  },
  onResponseError({ response, error }) {
    console.log('[API ERROR]', response, error)
  },
})
