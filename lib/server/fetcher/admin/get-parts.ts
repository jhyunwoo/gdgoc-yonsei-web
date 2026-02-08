import 'server-only'
import { asc, desc } from 'drizzle-orm'
import { generations } from '@/db/schema/generations'
import { parts } from '@/db/schema/parts'
import { baseFetcher } from '../base-fetcher'

export const preload = () => {
  void getParts()
}

export async function getParts() {
  console.log(new Date(), 'Fetch Parts Data')
  return baseFetcher('generations', ['parts', 'members'], {
    with: {
      parts: {
        with: {
          usersToParts: {
            with: {
              user: true, // Include full user object for each member
            },
          },
        },
      },
    },
    orderBy: [desc(generations.id), asc(parts.createdAt)],
  })
}
