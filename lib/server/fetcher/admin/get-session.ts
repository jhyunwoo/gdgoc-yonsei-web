import 'server-only'
import { eq } from 'drizzle-orm'
import { sessions } from '@/db/schema/sessions'
import { users } from '@/db/schema/users'
import { baseFirstFetcher } from '../base-fetcher'

/**
 * Preloads the data for a specific session into the cache.
 *
 * @param sessionId - The ID of the session to preload.
 */
export const preload = (sessionId: string) => {
  void getSession(sessionId)
}

export async function getSession(sessionId: string) {
  console.log(new Date(), 'Fetch Session Data', sessionId)

  // Fetch the main session data, including the generation it belongs to.
  const sessionData = await baseFirstFetcher('sessions', ['sessions'], {
    where: eq(sessions.id, sessionId),
    with: {
      part: true,
      userToSession: {
        with: {
          user: true,
        },
      },
    },
  })

  // If the session doesn't exist, return null.
  if (!sessionData) {
    return null
  }

  // If the session has an author, fetch the author's data.
  const authorData = sessionData.authorId
    ? await baseFirstFetcher('users', ['sessions'], {
        where: eq(users.id, sessionData.authorId),
      })
    : null

  // Combine the session data with the author data.
  return { ...sessionData, author: authorData }
}
