// app/api/movies/route.js (Next.js App Router)
import mysql from 'mysql2/promise'


export async function GET() {
const connection = await mysql.createConnection({
    host: process.env.TIDB_HOST,
    user: process.env.TIDB_USER,
    password: process.env.TIDB_PASSWORD,
    database: process.env.TIDB_DATABASE,
    ssl: { rejectUnauthorized: true } // TiDB Cloud often requires SSL
})

  const [rows] = await connection.execute('SELECT * FROM movies ORDER BY release_date ASC')
  await connection.end()

  return Response.json(rows)
}
