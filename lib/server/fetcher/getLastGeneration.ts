import { desc } from 'drizzle-orm'
import { generations } from '@/db/schema/generations'
import { baseFirstFetcher } from './base-fetcher'

export default async function getLastGeneration() {
  return baseFirstFetcher('generations', ['generations'], {
    orderBy: desc(generations.startDate),
  })
}
