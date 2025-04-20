'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'


export default function MovieDetailPage() {
  const router = useRouter()
  const { id } = useParams()
  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loggedIn, setLoggedIn] = useState(false)
  const [username, setUsername] = useState('')


  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await fetch(`/api/movies/${id}`)
        const data = await res.json()
        setMovie(data)
      } catch (err) {
        console.error('Failed to load movie:', err)
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchMovie()
  }, [id])

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await fetch('/api/session')
        const data = await res.json()
        setLoggedIn(data.loggedIn)
        if (data.username) setUsername(data.username)
      } catch (err) {
        console.error('Failed to check session:', err)
      }
    }

    checkLogin()
  }, [])


  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()
  }

  if (loading) return <p className="text-white text-center mt-20">Loading...</p>
  if (!movie) return <p className="text-white text-center mt-20">Movie not found</p>

  return (
    <div className="min-h-screen relative text-white px-6 py-1 bg-gradient-custom">
      {/* Topbar */}
      <div className="absolute top-6 left-6">
        <button onClick={() => router.push('/home')} className="transition transform hover:scale-105 hover:brightness-125">
          <Image src="/logo.png" alt="Logo" width={100} height={40} />
        </button>
      </div>
      <div className="absolute top-6 right-6 flex items-center gap-4">
        {loggedIn ? (
          <>
            <div className="text-sm text-[#00E676] font-medium bg-white/10 px-3 py-1 rounded-full shadow-inner backdrop-blur-sm border border-[#00E676]/30 transition-all hover:scale-[1.03]">
              <Link href="/account">
                <button className="text-white font-medium">{username}</button>
              </Link>            </div>

            <Link href="/myticket">
              <button className="bg-white/10 text-white px-4 py-2 rounded-lg font-medium border border-white/20 hover:bg-[#00E676] hover:text-black transition-all duration-200 shadow">
                🎟️ My Ticket
              </button>
            </Link>

            <button
              onClick={async () => {
                await fetch('/api/logout', { method: 'POST' })
                window.location.href = '/login'
              }}
              className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-all shadow"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login">
              <button className="bg-[#00E676] text-black px-4 py-2 rounded-md font-semibold hover:bg-[#00C853] transition-all">
                Login
              </button>
            </Link>
            <Link href="/register">
              <button className="border border-white text-white px-4 py-2 rounded-md font-semibold hover:bg-white hover:text-black transition-all">
                Register
              </button>
            </Link>
          </>
        )}
      </div>



      {/* Main content */}
      <div className="max-w-5xl mx-auto mt-28">
        <div className="flex flex-col md:flex-row gap-10">
          {movie.poster?.startsWith('http') ? (
            <img
              src={movie.poster}
              alt={movie.title}
              width={250}
              height={350}
              className="rounded-lg object-cover"
            />
          ) : (
            <Image
              src={movie.poster || '/default.jpg'}
              alt={movie.title}
              width={250}
              height={350}
              className="rounded-lg object-cover"
            />
          )}
          <div className="flex-1">
            <h1 className="text-3xl font-bold thai-font mb-3">{movie.title}</h1>
            <p className="thai-font mb-2"><strong>ประเภท:</strong> {movie.category}</p>
            <p className="thai-font mb-2"><strong>ระยะเวลา:</strong> {movie.duration}</p>
            <p className="thai-font mb-2"><strong>ภาษา:</strong> {movie.language}</p>
            <p className="thai-font mb-2"><strong>วันที่เข้าฉาย:</strong> {formatDate(movie.release_date)}</p>

            {movie.imdb_rating && (
              <div className="thai-font mb-4 flex items-center gap-3">
                <Image src="/imdb.png" alt="IMDb" width={40} height={20} className="object-contain" />
                <span className="text-xl font-semibold text-yellow-400">{movie.imdb_rating}</span>
              </div>
            )}
            <p className="thai-font mt-4"><strong>ผู้กำกับ:</strong> {movie.director || 'ชื่อผู้กำกับ (ใส่จริงทีหลัง)'}</p>
            <p className="thai-font"><strong>นักแสดง:</strong> {movie.cast || 'รายชื่อนักแสดง (ใส่จริงทีหลัง)'}</p>
            <p className="thai-font mt-4"><strong>เรื่องย่อ:</strong> {movie.synopsis || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce sed semper risus.'}</p>

            <div className="mt-6">
              <Link href={`/booking/${movie.id}`}>
                <button className="bg-[#00E676] text-black w-40 py-2 rounded-md hover:bg-[#00c765] transition thai-font">
                  ดูรอบฉาย
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .bg-gradient-custom {
          background: radial-gradient(800px at bottom left, #0B3D29 0%, transparent 70%),
                      radial-gradient(1000px at top right, #04371F 0%, transparent 70%), #000;
        }
      `}</style>
    </div>
  )
}
