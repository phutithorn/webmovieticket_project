import { cookies } from 'next/headers'

export async function POST() {
  cookies().delete('user_id')
  return new Response(JSON.stringify({ message: 'Logged out' }))
}
