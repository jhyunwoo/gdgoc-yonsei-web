import 'server-only'
import db from '@/db'
import cacheTag from '@/lib/server/cacheTag'

/**
 * Generic fetcher to reduce boilerplate for findMany queries with cache tagging.
 * @param tableName The name of the table in the schema
 * @param tags Cache tags to apply
 * @param options Drizzle findMany options
 */
export async function baseFetcher<T extends keyof typeof db.query>(
  tableName: T,
  tags: string[],
  options: any = {}
) {
  'use cache'
  cacheTag(...tags)
  // @ts-ignore
  const result = await db.query[tableName].findMany(options)
  return result
}

export async function baseFirstFetcher<T extends keyof typeof db.query>(
  tableName: T,
  tags: string[],
  options: any = {}
) {
  'use cache'
  cacheTag(...tags)
  // @ts-ignore
  const result = await db.query[tableName].findFirst(options)
  return result
}
