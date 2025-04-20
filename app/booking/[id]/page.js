'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)

export default function BookingPage() {
  const router = useRouter()
  const { id } = useParams()

  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showtimes, setShowtimes] = useState([])
  const [theater, setTheater] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [showTimeAlert, setShowTimeAlert] = useState(false)

  useEffect(() => {
    const fetchAll = async () => {
      const [movieRes, showtimeRes] = await Promise.all([
        fetch(`/api/movies/${id}`),
        fetch(`/api/showtimes`)
      ])

      const movieData = await movieRes.json()
      const allShowtimes = await showtimeRes.json()

      console.log('[DEBUG ALL SHOWTIMES]', allShowtimes) // ⬅️ ADD THIS LINE

      const relevantShowtimes = allShowtimes.filter(s => s.movie_id === Number(id))
      setMovie(movieData)
      setShowtimes(relevantShowtimes)

      if (relevantShowtimes.length > 0) {
        setTheater(relevantShowtimes[0].theater_id.toString())
        setDate(dayjs(relevantShowtimes[0].show_date).format('YYYY-MM-DD'))
      }

      setLoading(false)
    }

    if (id) fetchAll()
  }, [id])


  const availableTheaters = [...new Set(showtimes.map(s => s.theater_id))]
  const availableDates = [...new Set(showtimes.filter(s => s.theater_id.toString() === theater).map(s => s.show_date))]
  const availableTimes = [...new Set(showtimes.filter(s => s.theater_id.toString() === theater && s.show_date === date).map(s => s.show_time.slice(0, 5)))]

  const handleProceed = () => {
    if (!time || !theater) {
      setShowTimeAlert(true)
      return
    }
  
    router.push(
      `/seat/${id}?movie_id=${id}&date=${date}&time=${time}&theater_id=${theater}&title=${movie.title}&poster=${movie.poster}`
    )
  }
  
  




  if (loading) return <p className="text-white text-center mt-20">Loading...</p>
  if (!movie) return <p className="text-white text-center mt-20">Movie not found</p>


  const now = dayjs()
  const releaseDate = dayjs(movie.release_date)
  const isComingSoon = releaseDate.isAfter(now)
  const baseDate = isComingSoon ? releaseDate : now

  return (
    <div className="min-h-screen relative text-white px-6 py-1 bg-gradient-custom">
      <div className="absolute top-6 left-6">
        <button onClick={() => router.push('/home')} className="transition transform hover:scale-105 hover:brightness-125">
          <Image src="/logo.png" alt="Logo" width={100} height={40} />
        </button>
      </div>

      <div className="max-w-6xl mx-auto pt-28 grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          {availableTheaters.length === 0 ? (
            <>
              <h2 className="text-2xl font-bold mb-4">Theater</h2>
              <p className="text-red-400 mb-6">No theater available for this movie</p>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold mb-4">Theater</h2>
              <div className="flex gap-2 mb-6 flex-wrap">
                {availableTheaters.map(tid => (
                  <button
                    key={tid}
                    onClick={() => setTheater(tid.toString())}
                    className={`px-4 py-2 rounded-full border ${theater === tid.toString() ? 'bg-[#00E676] text-black' : 'text-white border-white'}`}
                  >
                    Theater {tid}
                  </button>
                ))}
              </div>

              {availableDates.length > 0 && (
                <>
                  <h2 className="text-2xl font-bold mb-4">Date</h2>
                  <div className="flex gap-2 mb-6 flex-wrap">
                    {availableDates.map((d, i) => (
                      <button key={i} onClick={() => setDate(d)} className={`px-4 py-2 rounded-md border ${date === d ? 'bg-[#00E676] text-black' : 'text-white border-white'}`}>
                        {dayjs(d).format('DD MMM ddd')}
                      </button>
                    ))}
                  </div>
                </>
              )}

              {availableTimes.length > 0 && (
                <>
                  <h2 className="text-2xl font-bold mb-4">Time</h2>
                  <div className="flex gap-2 flex-wrap">
                    {availableTimes.map((t, i) => {
                      const matched = showtimes.find(
                        s =>
                          s.movie_id === Number(id) &&
                          s.theater_id.toString() === theater &&
                          dayjs(s.show_date).format('YYYY-MM-DD') === date &&
                          dayjs(s.show_time, ['HH:mm:ss']).format('HH:mm') === time
                      )

                      const isPast = !isComingSoon && dayjs(`${matched?.show_date} ${t}`, 'YYYY-MM-DD HH:mm').isBefore(now)

                      return (
                        <button
                          key={i}
                          disabled={isPast}
                          onClick={() => {
                            setTime(t)
                            if (matched) setDate(matched.show_date) // 💥 fix here
                          }}
                          className={`px-4 py-2 rounded-md border ${time === t ? 'bg-[#00E676] text-black' : 'text-white border-white'} ${isPast ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          {t}
                        </button>
                      )
                    })}

                  </div>
                </>
              )}
            </>
          )}

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
            <p className="text-lg font-semibold thai-font">
              {availableTheaters.length > 0 ? `Theater ${theater}` : '-'}
            </p>
            {availableTheaters.length > 0 ? (
              <>
                <p className="text-sm mt-1">{dayjs(date).format('DD MMM YYYY')}</p>
                <p className="text-sm">{time}</p>
                <p className="text-xs text-gray-400 mt-2">*Seat selection can be done after this</p>
                <button onClick={handleProceed} className="bg-[#00E676] text-black w-full mt-4 py-2 rounded-md hover:bg-[#00c765] transition">Proceed</button>
              </>
            ) : (
              <>
                <p className="text-sm mt-2 text-red-400 italic">*Cannot select seat</p>
                <button
                  onClick={() => router.push('/home')}
                  className="bg-white text-black w-full mt-4 py-2 rounded-md hover:bg-gray-300 transition"
                >
                  Back to Home
                </button>
              </>
            )}
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
