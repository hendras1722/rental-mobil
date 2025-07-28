import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',

  /* config options here */
  async rewrites() {
    return {
      afterFiles: [
        {
          source: '/v1/:path*',
          destination:
            'https://67037f39bd7c8c1ccd41a62e.mockapi.io/rent-car/api/v1/:path*',
        },
      ],
      beforeFiles: [
        {
          source: '/v1/:path*',
          destination:
            'https://67037f39bd7c8c1ccd41a62e.mockapi.io/rent-car/api/v1/:path*',
        },
      ],
      fallback: [
        {
          source: '/v1/:path*',
          destination:
            'https://67037f39bd7c8c1ccd41a62e.mockapi.io/rent-car/api/v1/:path*',
        },
      ],
    }
    // return [
    //   {

    //     basePath: false,
    //   },
    // ]
  },
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
  async redirects() {
    return [
      // {
      //   source: '/',
      //   destination: '/',
      //   has: [
      //     {
      //       type: 'header',
      //       key: 'x-redirect-me',
      //     },
      //   ],
      //   permanent: false,
      // },
    ]
  },
  poweredByHeader: false,
  headers: async () => [
    {
      source: '/:path*',
      headers: [
        {
          key: 'Referrer-Policy',
          value: 'strict-origin-when-cross-origin',
        },
        {
          key: 'Permissions-Policy',
          value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
        },
      ],
    },
  ],
}

export default nextConfig
