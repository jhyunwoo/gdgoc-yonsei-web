import 'server-only'
import { asc, desc } from 'drizzle-orm'
import { usersToParts } from '@/db/schema/users-to-parts'
import { parts } from '@/db/schema/parts'
import { baseFetcher } from './base-fetcher'

export const preloadMembers = () => {
  void getMembers()
}

export async function getMembers() {
  return baseFetcher('users', ['members', 'parts', 'generations'], {
    with: {
      usersToParts: {
        with: {
          part: {
            columns: {
              name: true,
            },
            with: {
              generation: {
                columns: {
                  id: false,
                },
              },
            },
          },
        },
        columns: {
          partId: false,
          userId: false,
        },
        orderBy: desc(usersToParts.partId),
      },
    },
    columns: {
      createdAt: false,
      emailVerified: false,
      id: false,
      registeredAt: false,
      studentId: false,
      telephone: false,
      updatedAt: false,
    },
    orderBy: asc(parts.id),
  })
}
