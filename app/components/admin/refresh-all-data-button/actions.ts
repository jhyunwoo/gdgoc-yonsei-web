'use server'

import { revalidateTag } from 'next/cache'

export default async function refresh() {
  console.warn('Refresh All Data')
  revalidateTag('generations')
  revalidateTag('parts')
  revalidateTag('projects')
  revalidateTag('members')
  revalidateTag('sessions')
}
