import 'server-only'
import { lte } from 'drizzle-orm'
import { sessions } from '@/db/schema/sessions'
import { baseFetcher } from './base-fetcher'

export const preload = () => {
  void getSessions()
}

export async function getSessions() {
  return baseFetcher('sessions', ['sessions'], {
    with: {
      part: {
        with: {
          generation: true,
        },
      },
    },
    where: lte(sessions.endAt, new Date()),
  })
}
