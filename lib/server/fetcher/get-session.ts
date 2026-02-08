import 'server-only'
import { and, eq, lte } from 'drizzle-orm'
import { sessions } from '@/db/schema/sessions'
import { baseFirstFetcher } from './base-fetcher'

export const preload = (sessionId: string) => {
  void getSession(sessionId)
}

export async function getSession(sessionId: string) {
  return baseFirstFetcher('sessions', ['sessions'], {
    where: and(
      eq(sessions.id, sessionId),
      lte(sessions.endAt, new Date()),
      eq(sessions.displayOnWebsite, true)
    ),
  })
}
