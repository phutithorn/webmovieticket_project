import mysql from 'mysql2/promise'
import { cookies } from 'next/headers'

export async function GET() {
    const cookieStore = cookies()
    const userId = cookieStore.get('user_id')?.value

    if (!userId) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
    }

    try {
        const connection = await mysql.createConnection({
            host: process.env.TIDB_HOST,
            user: process.env.TIDB_USER,
            password: process.env.TIDB_PASSWORD,
            database: process.env.TIDB_DATABASE,
            ssl: { rejectUnauthorized: true }
        })

        const [bookings] = await connection.execute(
            `SELECT b.*, m.title AS movie_title, m.poster
         FROM bookings b
         JOIN movies m ON b.movie_id = m.id
         WHERE b.user_id = ?
         ORDER BY b.created_at DESC`,
            [userId]
        )


        const bookingIds = bookings.map(b => b.id)
        let seatsMap = {}
        if (bookingIds.length > 0) {
            const [seats] = await connection.query(
                `SELECT * FROM booking_seats WHERE booking_id IN (${bookingIds.map(() => '?').join(',')})`,
                bookingIds
            )

            seatsMap = seats.reduce((map, seat) => {
                if (!map[seat.booking_id]) map[seat.booking_id] = []
                map[seat.booking_id].push(seat)
                return map
            }, {})
        }

        const result = bookings.map(booking => ({
            ...booking,
            seats: seatsMap[booking.id] || []
        }))

        await connection.end()
        return new Response(JSON.stringify(result), { status: 200 })
    } catch (err) {
        console.error('Error fetching tickets:', err)
        return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 })
    }
}
