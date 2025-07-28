'use client'

import { useEffect, useState, useCallback, memo } from 'react'
import { usePerformanceTracker } from '@/lib/hooks/use-performance-tracker'

// Window 인터페이스 확장
declare global {
  interface Window {
    __collectPerformanceMetrics?: () => Promise<void>
  }
}

interface PerformanceTrackerProps {
  userId?: string
  enabled?: boolean
  debug?: boolean
  showDashboard?: boolean
}

interface PerformanceDashboardProps {
  onManualCollect: () => void
  isCollecting: boolean
  lastCollected: Date | null
}

function PerformanceTrackerComponent({
  userId,
  enabled = true,
  debug = false,
  showDashboard = false,
}: PerformanceTrackerProps) {
  const { collectMetrics } = usePerformanceTracker({
    userId,
    enabled,
    sendImmediately: true,
    debug,
  })

  const [isCollecting, setIsCollecting] = useState(false)
  const [lastCollected, setLastCollected] = useState<Date | null>(null)

  // 수동 메트릭 수집 함수 - 메모이제이션
  const handleManualCollection = useCallback(async () => {
    if (isCollecting || !enabled) {
      return
    }

    setIsCollecting(true)
    try {
      await collectMetrics()
      setLastCollected(new Date())
      if (debug) {
        console.warn('Manual performance metrics collected at:', new Date())
      }
    } catch (error) {
      console.error('Failed to collect metrics manually:', error)
    } finally {
      setIsCollecting(false)
    }
  }, [isCollecting, enabled, collectMetrics, debug])

  // 주기적 자동 수집 (디버그 모드에서만) - 메모이제이션
  useEffect(() => {
    if (!debug || !enabled) {
      return
    }

    const interval = setInterval(() => {
      handleManualCollection()
    }, 30000) // 30초마다 자동 수집

    return () => clearInterval(interval)
  }, [debug, enabled, handleManualCollection])

  // 초기화 및 전역 함수 노출 - 메모이제이션
  useEffect(() => {
    if (!debug) {
      return
    }

    console.warn('Performance tracker initialized', {
      userId,
      enabled,
      showDashboard,
    })

    // 전역 함수로 수동 수집 기능 노출 (개발 환경에서)
    if (typeof window !== 'undefined') {
      window.__collectPerformanceMetrics = handleManualCollection
    }

    // 클린업 함수에서 전역 함수 제거
    return () => {
      if (typeof window !== 'undefined') {
        delete window.__collectPerformanceMetrics
      }
    }
  }, [debug, userId, enabled, showDashboard, handleManualCollection])

  // 대시보드 표시가 요청된 경우에만 렌더링
  if (showDashboard && debug) {
    return (
      <PerformanceDashboard
        onManualCollect={handleManualCollection}
        isCollecting={isCollecting}
        lastCollected={lastCollected}
      />
    )
  }

  // 기본적으로는 UI를 렌더링하지 않음
  return null
}

// 개발자 도구용 성능 대시보드 컴포넌트 - 메모이제이션
const PerformanceDashboard = memo(function PerformanceDashboard({
  onManualCollect,
  isCollecting,
  lastCollected,
}: PerformanceDashboardProps) {
  const lastCollectedTime = lastCollected?.toLocaleTimeString()

  return (
    <div className="bg-opacity-90 fixed right-4 bottom-4 z-50 min-w-64 rounded-lg bg-black p-4 text-xs text-white shadow-lg">
      <h3 className="mb-3 font-bold text-green-400">🚀 Performance Monitor</h3>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span>Status:</span>
          <span className="text-green-400">✓ Active</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Auto-collect:</span>
          <span className="text-blue-400">📊 30s interval</span>
        </div>
        {lastCollectedTime && (
          <div className="text-xs text-gray-300">
            Last: {lastCollectedTime}
          </div>
        )}
        <button
          onClick={onManualCollect}
          disabled={isCollecting}
          className={`w-full rounded px-3 py-2 text-xs font-medium transition-colors ${
            isCollecting
              ? 'cursor-not-allowed bg-gray-600 text-gray-400'
              : 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
          }`}
          aria-label="성능 메트릭을 지금 수집합니다"
        >
          {isCollecting ? '🔄 수집 중...' : '📊 지금 측정하기'}
        </button>
        <div className="mt-2 text-xs text-gray-400">
          Console: window.__collectPerformanceMetrics()
        </div>
      </div>
    </div>
  )
})

// 메인 컴포넌트 메모이제이션 및 export
export const PerformanceTracker = memo(PerformanceTrackerComponent)

// 기본 export도 유지 (하위 호환성을 위해)
export default PerformanceTracker
