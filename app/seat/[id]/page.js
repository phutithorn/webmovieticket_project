'use client'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useParams } from 'next/navigation'
import dayjs from 'dayjs'


export default function SeatSelectionPage() {
  const { id } = useParams()
  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedSeats, setSelectedSeats] = useState([])
  const [hydrated, setHydrated] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [bookedSeats, setBookedSeats] = useState([])
  const [showtimeId, setShowtimeId] = useState(null)

  const rawDate = searchParams.get('date') || ''
  const date = dayjs(rawDate).format('YYYY-MM-DD')
  const time = searchParams.get('time') || ''
  const theater = searchParams.get('theater') || ''
  const theaterId = parseInt(searchParams.get('theater_id') || '1')
  const title = searchParams.get('title') || ''
  const poster = searchParams.get('poster') || '/default.jpg'

  // const title = movie?.title || ''
  // const poster = movie?.poster || '/default.jpg'



  const seatRows = ['J', 'H', 'G', 'F', 'E', '', 'D', 'C', 'B', 'A']
  const seatCols = 20
  const sofaLeft = ['1/2', '3/4', '5/6']
  const sofaRight = ['7/8', '9/10', '11/12']
  const seatTypes = [
    { name: 'Deluxe', color: 'bg-white', price: 320 },
    { name: 'Premium', color: 'bg-[#b9f6ca]', price: 540 },
    { name: 'Suite (Pair)', color: 'bg-yellow-300', price: 1500 }
  ]

  const fetchBookedSeats = async () => {
    try {
      const res = await fetch(
        `/api/booking-seats/check?movie_id=${id}&theater_id=${theaterId}&date=${date}&time=${time}`
      )
      console.log('Checking seat:', { id, theaterId, date, time })

      if (!res.ok) {
        console.error('Fetch failed with status:', res.status)
        return setBookedSeats([])
      }

      const data = await res.json()
      setBookedSeats(data.bookedSeats || [])
    } catch (err) {
      console.error('Error fetching booked seats:', err)
      setBookedSeats([])
    }
  }


  useEffect(() => {
    setSelectedSeats([])
    setHydrated(true)
  }, [])

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
    if (id && theaterId && date && time) {
      fetchBookedSeats()
    }
  }, [id, theaterId, date, time])

  useEffect(() => {
    const fetchShowtimeId = async () => {
      try {
        const res = await fetch(`/api/showtimes?movie_id=${id}&theater_id=${theaterId}&date=${date}&time=${time}`)
        const data = await res.json()

        console.log('🎯 Start Matching Showtime')
        console.log('🔴 Target Params:', { movieId: id, theaterId, date, time })

        data.forEach((s, index) => {
          const formattedTime = s.show_time.slice(0, 5)
          const formattedDate = dayjs(s.show_date).format('YYYY-MM-DD')

          const matches = {
            movie: s.movie_id === Number(id),
            theater: s.theater_id === theaterId,
            date: formattedDate === date,
            time: formattedTime === time
          }

          const match = Object.values(matches).every(Boolean)

          console.log(`🟡 Entry #${index + 1}`, {
            id: s.id,
            movie_id: s.movie_id,
            theater_id: s.theater_id,
            show_date: s.show_date,
            show_time: s.show_time,
            formatted_time: formattedTime,
            match,
            matches
          })

          if (match) {
            console.log(`✅ Match Found: showtime_id = ${s.id}`)
            setShowtimeId(s.id)
          }
        })

      } catch (err) {
        console.error('❌ Failed to fetch showtime_id', err)
      }
    }

    if (id && theaterId && date && time) {
      fetchShowtimeId()
    }
  }, [id, theaterId, date, time])




  const getTypeColor = (s) => {
    if (s.startsWith('AA')) return 'bg-yellow-300 text-black'
    if (['D', 'C', 'B', 'A'].some(r => s.startsWith(r))) return 'bg-[#b9f6ca] text-black'
    return 'bg-white text-black'
  }
  const getPrice = s => s.startsWith('AA') ? 1500 : ['D', 'C', 'B', 'A'].some(r => s.startsWith(r)) ? 540 : 320
  const getType = s => s.startsWith('AA') ? 'Suite (Pair)' : ['D', 'C', 'B', 'A'].some(r => s.startsWith(r)) ? 'Premium' : 'Deluxe'
  const getColor = (s, sel) => {
    const isBooked = bookedSeats.includes(s)
    if (isBooked) return 'bg-gray-400 text-white cursor-not-allowed'
    return sel ? 'bg-green-500 text-black' : getTypeColor(s)
  }

  const toggle = s => {
    if (bookedSeats.includes(s)) return
    setSelectedSeats(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s])
  }

  const total = selectedSeats.reduce((sum, s) => sum + getPrice(s), 0)

  const handleProceed = () => {
    if (!selectedSeats.length) return setShowAlert(true)
    const types = selectedSeats.map(getType)
    const query = new URLSearchParams({
      id,
      title,
      date,
      time,
      theater,
      poster,
      seats: selectedSeats.join(','),
      seatTypes: types.join(','),
      total: total.toString(),
      showtime_id: showtimeId ?? 0
    }).toString()
    router.push(`/orderdetail?${query}`)
  }


  const handleBack = () => {
    const query = new URLSearchParams({ date, time, theater, poster }).toString()
    router.push(`/booking/${id}?${query}`)
  }

  const renderRow = row => (
    <div key={row} className="flex justify-center items-center gap-6">
      <div className="flex items-center gap-1">
        <span className="w-6 text-right mr-2 font-mono">{row}</span>
        {Array.from({ length: seatCols }, (_, i) => {
          const seat = `${row}${i + 1}`
          return <button key={seat} onClick={() => toggle(seat)} className={`w-8 h-8 text-sm rounded ${getColor(seat, selectedSeats.includes(seat))} hover:bg-green-300 transition`}>{i + 1}</button>
        })}
        <span className="w-6 text-left ml-2 font-mono">{row}</span>
      </div>
    </div>
  )

  const renderSofa = () => (
    <div className="flex justify-center items-center gap-6 mt-3">
      <span className="w-6 text-right mr-2 font-mono">AA</span>
      {[...sofaLeft, '', ...sofaRight].map((s, i) => s === '' ? <div key={i} className="w-12" /> :
        <button key={s} onClick={() => toggle(`AA${s}`)} className={`px-4 h-8 text-sm rounded ${getColor(`AA${s}`, selectedSeats.includes(`AA${s}`))} hover:bg-green-300 transition`}>{s}</button>)}
      <span className="w-6 text-left ml-2 font-mono">AA</span>
    </div>
  )

  if (!hydrated) return null

  if (loading) return <p className="text-white text-center mt-20">Loading...</p>
  if (!movie) return <p className="text-white text-center mt-20">Movie not found</p>

  return (
    <div className="min-h-screen bg-gradient-custom text-white px-6 py-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-8">Select Your Seat</h1>
      <div className="w-full flex justify-center">
        <div className="border p-6 rounded-xl bg-black/10 w-fit">
          <div className="w-[850px] mx-auto relative mb-12">
            <svg width="100%" height="100" viewBox="0 0 730 100"><defs><linearGradient id="greenFade" x1="0" y1="0" x2="0" y2="1.5"><stop offset="0%" stopColor="#00e676" stopOpacity="0.2" /><stop offset="100%" stopColor="#00e676" stopOpacity="0" /></linearGradient></defs><path d="M10,80 Q365,-70 720,80" stroke="#00e676" strokeWidth="6" fill="url(#greenFade)" /></svg>
            <div className="absolute top-7 left-1/2 -translate-x-1/2 text-2xl font-bold tracking-widest">SCREEN</div>
          </div>
          <div className="max-h-[calc(100vh-220px)] overflow-y-auto pb-28 flex flex-col gap-2 items-center">
            {seatRows.map(r => r === '' ? <div key="gap" className="h-3" /> : renderRow(r))}
            {renderSofa()}
            <div className="flex justify-center gap-10 mt-6 text-sm">
              {seatTypes.map(({ name, color, price }) => (
                <div key={name} className="flex items-center gap-2">
                  <div className={`w-6 h-6 border rounded ${color}`} />
                  <div>
                    <div className="font-semibold">{name}</div>
                    <div className="text-xs text-gray-300">{price} THB</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-700 p-4 flex flex-wrap justify-between items-center text-sm px-6">
        <div><p className="text-xs">Total</p><p className="text-lg font-bold">฿ {total.toLocaleString()}</p></div>
        <div><p className="text-xs">Seat</p><p className="text-lg font-semibold">{selectedSeats.join(', ') || '-'}</p></div>
        <div className="flex gap-2 mt-2 md:mt-0">
          <button
            disabled={!hydrated}
            onClick={handleBack}
            className={`px-4 py-2 rounded ${!hydrated ? 'opacity-50 cursor-not-allowed bg-gray-300 text-gray-600' : 'bg-white text-black hover:bg-gray-300'}`}
          >
            Back
          </button>
          <button onClick={handleProceed} className="bg-[#00E676] text-black px-6 py-2 rounded hover:bg-[#00C853] font-semibold">Proceed to Pay</button>
        </div>
      </div>
      {showAlert && <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"><div className="bg-white text-black p-6 rounded-lg shadow-md text-center animate-zoomIn"><p className="text-lg font-semibold mb-4">Please select a seat first.</p><button onClick={() => setShowAlert(false)} className="bg-[#00E676] px-4 py-2 rounded hover:bg-[#00C853]">OK</button></div></div>}
      <style jsx global>{`
        .bg-gradient-custom {
          background: radial-gradient(800px at bottom left,#0B3D29 0%,transparent 70%),
                      radial-gradient(1000px at top right,#04371F 0%,transparent 70%),#000;
        }
        @keyframes zoomIn {0%{transform:scale(0.8);opacity:0}100%{transform:scale(1);opacity:1}}
        .animate-zoomIn {animation:zoomIn 0.3s ease-out forwards}
      `}</style>
    </div>
  )
}
