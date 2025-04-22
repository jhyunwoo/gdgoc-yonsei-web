import 'server-only'
import { unstable_cache } from 'next/cache'
import db from '@/db'
import { desc } from 'drizzle-orm'
import { projects } from '@/db/schema/projects'

export const preload = () => {
  void getProjects()
}

/**
 * Get Parts Data
 */
export const getProjects = unstable_cache(
  async () => {
    return db.query.projects.findMany({
      orderBy: desc(projects.updatedAt),
    })
  },
  [],
  {
    tags: ['projects'],
  }
)
