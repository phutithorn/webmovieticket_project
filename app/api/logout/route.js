import { cookies } from 'next/headers'

export async function POST() {
  cookies().delete('user_id')
  cookies().delete('role')
  return new Response(JSON.stringify({ message: 'Logged out' }))
}
