import 'server-only'
import { eq } from 'drizzle-orm'
import { projects } from '@/db/schema/projects'
import { baseFirstFetcher } from './base-fetcher'

export const preload = (projectId: string) => {
  void getProject(projectId)
}

export async function getProject(projectId: string) {
  return baseFirstFetcher('projects', ['projects'], {
    where: eq(projects.id, projectId),
    with: {
      usersToProjects: {
        with: {
          user: true,
        },
      },
    },
  })
}
