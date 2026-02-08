import 'server-only'
import { generations } from '@/db/schema/generations'
import { eq } from 'drizzle-orm'
import { baseFirstFetcher } from '../base-fetcher'

export const preloadGeneration = (generationId: number) => {
  void getGeneration(generationId)
}

export async function getGeneration(generationId: number) {
  console.log(new Date(), 'Fetch Generation Data', generationId)
  return baseFirstFetcher('generations', ['generations', 'members', 'parts'], {
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
}
