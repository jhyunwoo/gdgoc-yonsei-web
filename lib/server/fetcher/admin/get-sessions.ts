import { sessions } from '@/db/schema/sessions'
import 'server-only'
import { desc } from 'drizzle-orm'
import { generations } from '@/db/schema/generations'
import { baseFetcher } from '../base-fetcher'

export const preload = () => {
  void getSessions()
}

export async function getSessions() {
  console.log(new Date(), 'Fetch Sessions Data')
  return baseFetcher('generations', ['generations', 'sessions'], {
    with: {
      parts: {
        with: {
          sessions: {
            orderBy: desc(sessions.startAt),
          },
        },
      },
    },
    orderBy: desc(generations.id),
  })
}
