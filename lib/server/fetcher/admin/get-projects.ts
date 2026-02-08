/**
 * @file This file contains a server-side function for fetching all projects.
 * It uses Next.js's unstable_cache for caching.
 */

import 'server-only'
import { desc } from 'drizzle-orm'
import { projects } from '@/db/schema/projects'
import { baseFetcher } from '../base-fetcher'

export const preload = () => {
  void getProjects()
}

export async function getProjects() {
  console.log(new Date(), 'Fetch Projects Data')
  return baseFetcher('projects', ['projects'], {
    orderBy: desc(projects.updatedAt),
  })
}
