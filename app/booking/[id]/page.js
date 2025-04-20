'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import dayjs from 'dayjs'

export default function BookingPage() {
  const router = useRouter()
  const { id } = useParams()

  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)
  const [theaters, setTheaters] = useState([])
  const [theater, setTheater] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [showTimeAlert, setShowTimeAlert] = useState(false)

  useEffect(() => {
    const fetchAll = async () => {
      const [movieRes, theaterRes] = await Promise.all([
        fetch(`/api/movies/${id}`),
        fetch('/api/theaters')
      ])

      const movieData = await movieRes.json()
      const theaterData = await theaterRes.json()

      setMovie(movieData)
      setTheaters(theaterData)
      setTheater(theaterData[0]?.name || '')
      const now = dayjs()
      const releaseDate = dayjs(movieData.release_date)
      const base = releaseDate.isAfter(now) ? releaseDate : now
      setDate(base.format('YYYY-MM-DD'))
      setLoading(false)
    }

    if (id) fetchAll()
  }, [id])

  if (loading) return <p className="text-white text-center mt-20">Loading...</p>
  if (!movie) return <p className="text-white text-center mt-20">Movie not found</p>

  const now = dayjs()
  const releaseDate = dayjs(movie.release_date)
  const isComingSoon = releaseDate.isAfter(now)
  const baseDate = isComingSoon ? releaseDate : now
  const availableDates = Array.from({ length: 6 }, (_, i) => baseDate.add(i, 'day'))
  const availableTimes = ['13:00', '15:40', '18:00', '20:30', '22:00', '23:00']

  const handleProceed = () => {
    if (!time) return setShowTimeAlert(true)
    router.push(`/seat/${id}?date=${date}&time=${time}&theater=${theater}`)
  }

  return (
    <div className="min-h-screen relative text-white px-6 py-1 bg-gradient-custom">
      <div className="absolute top-6 left-6">
        <button onClick={() => router.push('/home')} className="transition transform hover:scale-105 hover:brightness-125">
          <Image src="/logo.png" alt="Logo" width={100} height={40} />
        </button>
      </div>

      <div className="max-w-6xl mx-auto pt-28 grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          <h2 className="text-2xl font-bold mb-4">Theater</h2>
          <div className="flex gap-2 mb-6 flex-wrap">
            {theaters.map(t => (
              <button key={t.id} onClick={() => setTheater(t.name)} className={`px-4 py-2 rounded-full border ${theater === t.name ? 'bg-[#00E676] text-black' : 'text-white border-white'}`}>{t.name}</button>
            ))}
          </div>

          <h2 className="text-2xl font-bold mb-4">Date</h2>
          <div className="flex gap-2 mb-6 flex-wrap">
            {availableDates.map((d, i) => {
              const value = d.format('YYYY-MM-DD')
              return (
                <button key={i} onClick={() => setDate(value)} className={`px-4 py-2 rounded-md border ${date === value ? 'bg-[#00E676] text-black' : 'text-white border-white'}`}>
                  {d.format('DD MMM ddd')}
                </button>
              )
            })}
          </div>

          <h2 className="text-2xl font-bold mb-4">Time</h2>
          <div className="flex gap-2 flex-wrap">
            {availableTimes.map((t, i) => {
              const isPast = !isComingSoon && dayjs(`${date} ${t}`, 'YYYY-MM-DD HH:mm').isBefore(now)
              return (
                <button key={i} disabled={isPast} onClick={() => setTime(t)} className={`px-4 py-2 rounded-md border ${time === t ? 'bg-[#00E676] text-black' : 'text-white border-white'} ${isPast ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  {t}
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex flex-col items-center">
          {movie.poster?.startsWith('http') ? (
            <img src={movie.poster} alt={movie.title} width={220} height={320} className="rounded-lg mb-4 object-cover" />
          ) : (
            <Image src={movie.poster || '/default.jpg'} alt={movie.title} width={220} height={320} className="rounded-lg mb-4 object-cover" />
          )}
          <h3 className="text-lg font-bold uppercase thai-font">{movie.title}</h3>
          <p className="text-sm mt-1">Duration <span className="ml-2 thai-font">{movie.duration}</span></p>
          <p className="text-sm">Type <span className="ml-2 thai-font">{movie.category}</span></p>
          <div className="border mt-6 rounded-xl p-4 text-center w-full max-w-sm">
            <p className="text-lg font-semibold thai-font">{theater}</p>
            <p className="text-sm mt-1">{dayjs(date).format('DD MMM YYYY')}</p>
            <p className="text-sm">{time}</p>
            <p className="text-xs text-gray-400 mt-2">*Seat selection can be done after this</p>
            <button onClick={handleProceed} className="bg-[#00E676] text-black w-full mt-4 py-2 rounded-md hover:bg-[#00c765] transition">Proceed</button>
          </div>
        </div>
      </div>

      {showTimeAlert && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 text-center max-w-sm w-full transform transition duration-300 scale-95 opacity-0 animate-zoomIn">
            <h2 className="text-xl font-semibold text-black mb-4">Please select a showtime first.</h2>
            <div className="flex justify-center">
              <button onClick={() => setShowTimeAlert(false)} className="px-4 py-2 bg-[#00E676] text-black rounded hover:bg-[#00C853]">OK</button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .bg-gradient-custom {
          background: radial-gradient(800px at bottom left, #0B3D29 0%, transparent 70%),
                      radial-gradient(1000px at top right, #04371F 0%, transparent 70%), #000;
        }
        @keyframes zoomIn {
          0% { transform: scale(0.8); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-zoomIn { animation: zoomIn 0.3s ease-out forwards; }
      `}</style>
    </div>
  )
}
