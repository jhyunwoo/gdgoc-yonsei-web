'use server'

import { revalidateTag } from 'next/cache'

export default async function refresh() {
  revalidateTag('generations')
  revalidateTag('parts')
  revalidateTag('projects')
  revalidateTag('members')
  revalidateTag('sessions')
}
