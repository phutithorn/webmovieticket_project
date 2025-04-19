import { cookies } from 'next/headers'

export async function GET() {
  const userId = cookies().get('user_id')?.value

  if (!userId) {
    return new Response(JSON.stringify({ loggedIn: false }), { status: 200 })
  }

  return new Response(JSON.stringify({ loggedIn: true, userId }), { status: 200 })
}
