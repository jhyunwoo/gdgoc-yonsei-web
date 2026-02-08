import { baseFetcher } from '../base-fetcher'

export const preload = () => {
  void getMembersWithGeneration()
}

export async function getMembersWithGeneration() {
  return baseFetcher('generations', ['members', 'generations'], {
    with: {
      parts: {
        with: {
          usersToParts: {
            with: {
              user: true, // Include the full user object for each member
            },
          },
        },
      },
    },
  })
}
