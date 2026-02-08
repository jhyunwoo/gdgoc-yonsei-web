import 'server-only'
import { asc } from 'drizzle-orm'
import { generations } from '@/db/schema/generations'
import { parts } from '@/db/schema/parts'
import { baseFetcher } from './base-fetcher'

export const preload = () => {
  void getGenerations()
}

export async function getGenerations() {
  return baseFetcher('generations', ['generations', 'parts', 'members'], {
    columns: {
      id: false,
    },
    orderBy: asc(generations.id),
    with: {
      parts: {
        with: {
          usersToParts: {
            with: {
              user: true,
            },
          },
        },
        orderBy: asc(parts.id),
      },
    },
  })
}

