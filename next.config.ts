import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    authInterrupts: true,
    optimizePackageImports: [
      'motion', 
      'jotai', 
      'next-auth',
      '@heroicons/react',
      'react-markdown',
    ],
    // 서버 컴포넌트 외부 패키지 최적화
    serverComponentsExternalPackages: ['postgres'],
    // 메모리 기반 캐싱 활성화
    memoryBasedWorkersCount: true,
  },
  
  // 컴파일러 최적화
  compiler: {
    // 프로덕션에서 console.log 제거
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn']
    } : false,
  },

  // 이미지 최적화 설정
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'image.gdgyonsei.moveto.kr',
      },
      {
        protocol: 'https',
        hostname: 'dev.image.gdgyonsei.moveto.kr',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
    // 이미지 크기 최적화
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // WebP 포맷 우선 사용
    formats: ['image/webp', 'image/avif'],
  },

  // 성능 최적화
  poweredByHeader: false, // X-Powered-By 헤더 제거
  
  // 압축 설정
  compress: true,
  
  // 정적 파일 캐싱
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
      {
        source: '/assets/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },

  // 웹팩 설정 최적화
  webpack: (config, { isServer }) => {
    // 클라이언트 번들에서 서버 전용 패키지 제외
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      }
    }

    return config
  },
}

export default nextConfig
