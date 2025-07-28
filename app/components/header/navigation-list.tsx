'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import { useAtom } from 'jotai'
import { homeMenuBarState } from '@/lib/atoms'
import { ReactNode, memo, useCallback } from 'react'

interface MotionLinkProps {
  children: ReactNode
  state: boolean
}

interface NavigationItem {
  href: string
  label: string
}

// 네비게이션 항목들을 상수로 분리
const NAVIGATION_ITEMS: NavigationItem[] = [
  { href: '/members', label: 'Members' },
  { href: '/projects', label: 'Projects' },
  { href: '/sessions', label: 'Sessions' },
  { href: '/calendar', label: 'Calendar' },
] as const

/**
 * Link 컴포넌트에 애니메이션을 주기 위한 컴포넌트
 * @param children - Link 컴포넌트
 * @param state - 애니메이션 상태
 */
const MotionLink = memo(function MotionLink({
  children,
  state,
}: MotionLinkProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: state ? 1 : 0 }}
      className="flex w-full p-1 px-4 last:pb-4"
    >
      {children}
    </motion.div>
  )
})

function NavigationListComponent() {
  const [isMenuOpen, setIsMenuOpen] = useAtom(homeMenuBarState)

  // 메뉴 닫기 핸들러 - 메모이제이션
  const handleMenuClose = useCallback(() => {
    setIsMenuOpen(false)
  }, [setIsMenuOpen])

  return (
    <motion.div
      initial={{ height: 0, visibility: 'hidden' }}
      animate={{
        height: isMenuOpen ? 'auto' : 0,
        visibility: isMenuOpen ? 'visible' : 'hidden',
      }}
      transition={{ duration: 0.2 }}
      className="flex w-full flex-col gap-2 text-lg md:hidden"
    >
      {NAVIGATION_ITEMS.map((item) => (
        <MotionLink key={item.href} state={isMenuOpen}>
          <Link
            href={item.href}
            onClick={handleMenuClose}
            className="w-full"
            aria-label={`${item.label} 페이지로 이동`}
          >
            {item.label}
          </Link>
        </MotionLink>
      ))}
      
      {/* Recruit 링크는 현재 주석 처리됨 */}
      {/*<MotionLink state={isMenuOpen}>
        <Link
          href="/recruit"
          onClick={handleMenuClose}
          className="w-full"
          aria-label="Recruit 페이지로 이동"
        >
          Recruit
        </Link>
      </MotionLink>*/}
    </motion.div>
  )
}

export default memo(NavigationListComponent)
