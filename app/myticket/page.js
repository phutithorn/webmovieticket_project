'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function MyTicketPage() {
  const [tickets, setTickets] = useState([])
  const router = useRouter()

  useEffect(() => {
    const fetchTickets = async () => {
      const res = await fetch('/api/mytickets')
      const data = await res.json()
      setTickets(data)
    }
    fetchTickets()
  }, [])

  return (
    
    <div className="min-h-screen bg-gradient-custom text-white px-6 py-10">
        <div className="absolute top-6 left-6">
                <button onClick={() => router.push('/home')} className="transition transform hover:scale-105 hover:brightness-125">
                  <Image src="/logo.png" alt="Logo" width={100} height={40} />
                </button>
              </div>
      <h1 className="text-3xl font-bold text-center mb-10">🎟️ My Tickets</h1>

      {tickets.length === 0 ? (
        <p className="text-center text-gray-300">You don’t have any tickets yet.</p>
      ) : (
        <div className="grid gap-6 max-w-5xl mx-auto">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              onClick={() => router.push(`/myticket/${ticket.id}`)}
              className="cursor-pointer bg-white/5 hover:bg-white/10 transition rounded-xl p-4 flex items-start gap-6 shadow-lg border border-white/10"
            >
              {/* Poster on the left */}
              {ticket.poster && (
                <img
                  src={ticket.poster}
                  alt={`${ticket.movie_title} Poster`}
                  className="w-24 h-36 object-cover rounded-md shadow-md"
                />
              )}

              {/* Info and price on the right */}
              <div className="flex flex-col md:flex-row justify-between w-full gap-4">
                <div className="flex-1">
                  <h2 className="text-2xl font-extrabold text-[#F9C66D] mb-1">
                    {ticket.movie_title}
                  </h2>
                  <p className="text-sm text-gray-300 mb-1">🎭 Theater: {ticket.theater}</p>
                  <p className="text-sm text-gray-300 mb-1">
                    📅 Date: {new Date(ticket.show_date).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </p>
                  <p className="text-sm text-gray-300 mb-1">⏰ Time: {ticket.show_time.slice(0, 5)}</p>
                  <p className="text-sm text-gray-300">🎫 Seats: {ticket.seats.map(s => s.seat_label).join(', ')}</p>
                </div>

                <div className="text-right min-w-[100px]">
                  <p className="text-sm text-gray-400">Total Price</p>
                  <p className="text-lg font-semibold text-[#00E676]">
                    ฿ {ticket.total_price.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <style jsx global>{`
        .bg-gradient-custom {
          background: radial-gradient(800px at bottom left, #0B3D29 0%, transparent 70%),
                      radial-gradient(1000px at top right, #04371F 0%, transparent 70%), #000;
        }
      `}</style>
    </div>
  )
}
