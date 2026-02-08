import 'server-only'
import { baseFetcher } from './base-fetcher'

export const preload = () => {
  void getProjects()
}

export async function getProjects() {
  return baseFetcher('projects', ['projects', 'generations'], {
    with: {
      generation: true,
    },
  })
}
