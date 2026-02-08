import 'server-only'
import { desc, eq } from 'drizzle-orm'
import { parts } from '@/db/schema/parts'
import { baseFirstFetcher } from '../base-fetcher'

export const preload = (partId: number) => {
  void getPart(partId)
}

export async function getPart(partId: number) {
  console.log(new Date(), 'Fetch Part Data', partId)
  return baseFirstFetcher('parts', ['parts', 'members'], {
    where: eq(parts.id, partId),
    with: {
      usersToParts: {
        with: {
          user: true, // Include the full user object for each member
        },
      },
    },
    orderBy: desc(parts.createdAt),
  })
}
