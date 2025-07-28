import React, { memo, Suspense, useMemo, useCallback } from 'react'

type LazyIconProps = {
  name: string
  fallbackClassName?: string
} & React.SVGProps<SVGSVGElement>

// 에러 바운더리 컴포넌트
class IconErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true }
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('LazyIcon 로딩 실패:', error, errorInfo)
  }

  override render() {
    if (this.state.hasError) {
      return this.props.fallback
    }

    return this.props.children
  }
}

const LazyIcon = memo(function LazyIcon({ 
  name, 
  fallbackClassName = "h-full w-full animate-pulse bg-gray-100",
  ...rest 
}: LazyIconProps) {
  // 아이콘 컴포넌트 동적 임포트 - 메모이제이션
  const IconComponent = useMemo(() => {
    return React.lazy(() => 
      import(`./${name}.svg?react`).catch(() => {
        // 아이콘 로딩 실패 시 기본 SVG 반환
        console.warn(`아이콘 '${name}'을 찾을 수 없습니다.`)
        return {
          default: () => (
            <svg 
              {...rest} 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor"
              className="h-6 w-6"
            >
              <circle cx="12" cy="12" r="10"/>
              <path d="m9 12 2 2 4-4"/>
            </svg>
          )
        }
      })
    )
  }, [name, rest])

  // 폴백 컴포넌트 - 메모이제이션
  const FallbackComponent = useCallback(
    () => <div className={fallbackClassName} aria-label={`${name} 아이콘 로딩 중`} />,
    [fallbackClassName, name]
  )

  // 에러 폴백 컴포넌트 - 메모이제이션
  const ErrorFallback = useCallback(
    () => (
      <div 
        className={fallbackClassName} 
        aria-label={`${name} 아이콘 로딩 실패`}
        title={`아이콘 '${name}'을 로드할 수 없습니다`}
      />
    ),
    [fallbackClassName, name]
  )

  return (
    <IconErrorBoundary fallback={<ErrorFallback />}>
      <Suspense fallback={<FallbackComponent />}>
        <IconComponent {...rest} />
      </Suspense>
    </IconErrorBoundary>
  )
})

export default LazyIcon
