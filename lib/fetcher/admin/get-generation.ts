import 'server-only'
import { unstable_cache } from 'next/cache'
import db from '@/db'
import { generations } from '@/db/schema/generations'
import { eq } from 'drizzle-orm'

export const preload = (generationId: number) => {
  void getGeneration(generationId)
}

/**
 * Get generation data
 * @param generationId - generation id
 */
export const getGeneration = unstable_cache(
  async (generationId: number) => {
    return db.query.generations.findFirst({
      where: eq(generations.id, generationId),
      with: {
        parts: {
          with: {
            usersToParts: {
              with: {
                user: true,
              },
            },
          },
        },
      },
    })
  },
  [],
  {
    tags: ['generations'],
  }
)
