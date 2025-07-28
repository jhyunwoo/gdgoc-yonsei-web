'use client'

import Image from 'next/image'
import { useRef, useState, useEffect, useCallback, useMemo, memo } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

interface ImagesSliderProps {
  images: string[]
}

function ImagesSlider({ images }: ImagesSliderProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const boxRef = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState<number>(0)
  const imageRefs = useRef<(HTMLDivElement | null)[]>([])

  // 이미지 배열이 변경될 때만 ref 배열 초기화
  useEffect(() => {
    imageRefs.current = new Array(images.length).fill(null)
  }, [images.length])

  // Intersection Observer 설정 - 메모이제이션으로 재생성 방지
  const observerOptions = useMemo(() => ({
    root: scrollRef.current,
    threshold: 0.5,
    rootMargin: '0px',
  }), [])

  // Observer 콜백 메모이제이션
  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const targetIndex = imageRefs.current.findIndex(
          (ref) => ref === entry.target
        )
        if (targetIndex !== -1 && targetIndex !== index) {
          setIndex(targetIndex)
        }
      }
    })
  }, [index])

  // Intersection Observer 설정
  useEffect(() => {
    if (images.length === 0) {
      return
    }

    const observer = new IntersectionObserver(handleIntersection, observerOptions)

    // 현재 설정된 모든 이미지 참조에 대해 관찰 시작
    const currentRefs = imageRefs.current.filter(Boolean)
    currentRefs.forEach((ref) => {
      if (ref) {
        observer.observe(ref)
      }
    })

    return () => {
      observer.disconnect()
    }
  }, [images.length, handleIntersection, observerOptions])

  // 이미지 미리보기 클릭 핸들러 - 메모이제이션
  const handleImagePreviewClick = useCallback((targetIndex: number) => {
    const scrollContainer = scrollRef.current
    if (!scrollContainer || targetIndex === index) {
      return
    }

    const scrollAmount = scrollContainer.clientWidth * (index - targetIndex)
    setIndex(targetIndex)

    scrollContainer.scrollTo({
      left: scrollContainer.scrollLeft - scrollAmount,
      behavior: 'smooth',
    })
  }, [index])

  // 스크롤 핸들러 - 메모이제이션
  const handleScroll = useCallback((direction: 'left' | 'right') => {
    const scrollContainer = scrollRef.current
    if (!scrollContainer) {
      return
    }

    const scrollAmount = scrollContainer.clientWidth
    const newIndex = direction === 'left' 
      ? Math.max(0, index - 1)
      : Math.min(images.length - 1, index + 1)

    if (newIndex === index) {
      return
    }

    setIndex(newIndex)
    scrollContainer.scrollTo({
      left: direction === 'left'
        ? scrollContainer.scrollLeft - scrollAmount
        : scrollContainer.scrollLeft + scrollAmount,
      behavior: 'smooth',
    })
  }, [index, images.length])

  // 이미지가 없는 경우 빈 상태 반환
  if (images.length === 0) {
    return (
      <div className="flex w-full items-center justify-center p-8">
        <p className="text-gray-500">표시할 이미지가 없습니다.</p>
      </div>
    )
  }

  return (
    <div
      className="flex w-full flex-col items-center md:flex-row md:items-start md:justify-center"
      ref={boxRef}
    >
      {/* Images */}
      <div
        className="flex w-full max-w-xl min-w-0 snap-x snap-mandatory overflow-x-scroll bg-neutral-100 whitespace-nowrap transition-all"
        ref={scrollRef}
      >
        {images.map((image, i) => (
          <ImageSlide
            key={`${image}-${i}`}
            src={image}
            index={i}
            ref={(el) => {
              imageRefs.current[i] = el
            }}
          />
        ))}
      </div>
      
      <div className="w-full max-w-xl md:w-24">
        {/* Image Control Button Group */}
        <ImageControls
          onPrevious={() => handleScroll('left')}
          onNext={() => handleScroll('right')}
          canGoPrevious={index > 0}
          canGoNext={index < images.length - 1}
        />
        
        {/* Image Preview */}
        <ImagePreviewList
          images={images}
          currentIndex={index}
          onImageClick={handleImagePreviewClick}
        />
      </div>
    </div>
  )
}

// 개별 이미지 슬라이드 컴포넌트 - 메모이제이션
const ImageSlide = memo(({ src, index, ref: forwardedRef }: {
  src: string
  index: number
  ref: (el: HTMLDivElement | null) => void
}) => (
  <div
    ref={forwardedRef}
    className="relative w-full flex-shrink-0 snap-center"
    style={{ paddingTop: '100%' }}
  >
    <Image
      src={src}
      alt={`슬라이드 이미지 ${index + 1}`}
      fill
      className="absolute top-0 left-0 h-full w-full object-contain"
      priority={index === 0} // 첫 번째 이미지만 우선 로딩
      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
    />
  </div>
))

ImageSlide.displayName = 'ImageSlide'

// 이미지 컨트롤 버튼 컴포넌트 - 메모이제이션
const ImageControls = memo(({ 
  onPrevious, 
  onNext, 
  canGoPrevious, 
  canGoNext 
}: {
  onPrevious: () => void
  onNext: () => void
  canGoPrevious: boolean
  canGoNext: boolean
}) => (
  <div className="flex w-full items-center justify-between p-2 md:w-28">
    <button
      type="button"
      onClick={onPrevious}
      disabled={!canGoPrevious}
      className="rounded-full p-1 transition-colors hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed"
      aria-label="이전 이미지"
    >
      <ChevronLeftIcon className="size-8" />
    </button>
    <button
      type="button"
      onClick={onNext}
      disabled={!canGoNext}
      className="rounded-full p-1 transition-colors hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed"
      aria-label="다음 이미지"
    >
      <ChevronRightIcon className="size-8" />
    </button>
  </div>
))

ImageControls.displayName = 'ImageControls'

// 이미지 미리보기 리스트 컴포넌트 - 메모이제이션
const ImagePreviewList = memo(({ 
  images, 
  currentIndex, 
  onImageClick 
}: {
  images: string[]
  currentIndex: number
  onImageClick: (index: number) => void
}) => (
  <div className="flex gap-2 overflow-x-scroll p-2 whitespace-nowrap md:h-[528px] md:w-28 md:flex-col md:overflow-y-scroll">
    {images.map((image, i) => (
      <button
        key={`preview-${image}-${i}`}
        type="button"
        onClick={() => onImageClick(i)}
        className="flex-shrink-0"
        aria-label={`${i + 1}번째 이미지로 이동`}
      >
        <Image
          src={image}
          alt={`미리보기 ${i + 1}`}
          width={100}
          height={100}
          className={`aspect-square size-24 rounded-lg object-cover transition-all ${
            currentIndex === i ? 'brightness-50 grayscale' : 'hover:opacity-80'
          }`}
          sizes="100px"
        />
      </button>
    ))}
  </div>
))

ImagePreviewList.displayName = 'ImagePreviewList'

// 메인 컴포넌트 메모이제이션
export default memo(ImagesSlider)
