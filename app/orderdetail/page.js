'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import promptpay from 'promptpay-qr'


export default function OrderDetailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const title = searchParams.get('title') || 'Unknown Movie'
  const date = searchParams.get('date') || 'N/A'
  const time = searchParams.get('time') || '--:--'
  const seats = searchParams.get('seats') || ''
  const types = searchParams.get('seatTypes') || ''
  const total = parseFloat(searchParams.get('total') || '0')
  const theaterId = searchParams.get('theater')?.replace('Theater ', '') || '1'
  const showtimeId = searchParams.get('showtime_id')
  console.log('Showtime ID:', showtimeId)

  const seatList = seats.split(',').map(s => s.trim()).filter(Boolean)
  const typeList = types.split(',').map(t => t.trim()).filter(Boolean)
  const grouped = typeList.reduce((a, t) => (a[t] = (a[t] || 0) + 1, a), {})
  const getPrice = t => t === 'Suite (Pair)' ? 1500 : t === 'Premium' ? 540 : 320

  const [qrUrl, setQrUrl] = useState('')
  const [fetchedTitle, setFetchedTitle] = useState('')
  const finalTitle = title !== 'Unknown Movie' ? title : fetchedTitle || ''
  const [paymentStarted, setPaymentStarted] = useState(false)
  const [showPopup, setShowPopup] = useState(false)


  const handleProceedPayment = () => {
    setPaymentStarted(true)
  }


  useEffect(() => {
    const fetchMovie = async () => {
      const res = await fetch(`/api/movies/${id}`)
      const data = await res.json()
      if (data?.title) {
        setFetchedTitle(data.title)
      }
    }

    if (id && (!title || title === 'Unknown Movie')) {
      fetchMovie()
    }
  }, [id, title])

  useEffect(() => {
    const receiver = '0962899742'  // ✅ your phone number here
    const amount = total

    const payload = promptpay(receiver, { amount })
    const encoded = encodeURIComponent(payload)
    const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encoded}&size=200x200`

    setQrUrl(qrImageUrl)
  }, [total])

  return (
    <div className="min-h-screen bg-gradient-custom text-white flex items-center justify-center px-4 py-8">
      <div className="bg-white/5 rounded-xl p-8 w-full max-w-md shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Booking Detail</h1>
        <p className="text-sm text-gray-300 mb-2">Schedule</p>
        <div className="mb-6">
          <p className="text-base font-semibold">Movie Title</p>
          <p className="mb-2 text-lg">{finalTitle}</p>
          <div className="flex justify-between">
            <div><p className="text-sm text-gray-300">Date</p><p className="text-base">{date}</p></div>
            <div className="text-right"><p className="text-sm text-gray-300">Time</p><p className="text-base">{time}</p></div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-300">Ticket ({seatList.length})</p>
            <p className="text-base">{seatList.join(', ')}</p>
          </div>
        </div>
        <p className="text-sm text-gray-300 mb-2">Transaction Detail</p>
        <div className="mb-4">
          {Object.entries(grouped).map(([type, count]) => (
            <div key={type} className="flex justify-between mb-1">
              <p>{type}</p><p>฿ {(getPrice(type) * count).toLocaleString()} × {count}</p>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-700 my-4" />
        <div className="flex justify-between font-bold text-lg">
          <p>Total payment</p><p>฿ {total.toLocaleString()}</p>
        </div>
        <p className="text-xs text-gray-400 mt-2">*Purchased ticket cannot be canceled</p>
        {paymentStarted && qrUrl && (
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-400 mb-2">Scan this PromptPay QR Code</p>
            <img src={qrUrl} alt="PromptPay QR Code" className="mx-auto rounded" />
          </div>
        )}

        <div className="mt-6 flex flex-col gap-2">
          <button onClick={() => router.back()} className="bg-white text-black py-2 rounded hover:bg-gray-300">Back</button>
          {!paymentStarted ? (
            <button
              onClick={handleProceedPayment}
              className="bg-[#00E676] text-black py-2 rounded hover:bg-[#00C853] font-semibold"
            >
              Proceed Payment
            </button>
          ) : (
            <button
              onClick={async () => {
                const res = await fetch('/api/booking/confirm', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    movieId: id,
                    date,
                    time,
                    seatList,
                    typeList,
                    total,
                    theaterId,
                    showtimeId   
                  })
                })
                const result = await res.json()
                if (res.ok) {
                  setShowPopup(true)
                } else {
                  alert(result.message || 'Booking failed!')
                }
              }}
              className="bg-red-500 text-white py-2 rounded hover:bg-red-600 font-semibold"
            >
              Confirm Payment
            </button>
          )}
        </div>
        {showPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-white p-6 rounded-lg text-black shadow-lg text-center animate-popup">
              <h2 className="text-xl font-bold text-[#00E676] mb-2">Payment Confirmed</h2>
              <p className="text-sm mb-4">Your booking has been successfully completed.</p>
              <button onClick={() => router.push('/myticket')} className="bg-[#00E676] text-black px-4 py-2 rounded hover:bg-[#00C853]">
                Go to My Ticket
              </button>
            </div>
          </div>
        )}

      </div>
      <style jsx global>{`
        .bg-gradient-custom {
          background: radial-gradient(800px at bottom left,#0B3D29 0%,transparent 70%),
                      radial-gradient(1000px at top right,#04371F 0%,transparent 70%),#000;
        }
        @keyframes popup {
          0% { transform: scale(0.9); opacity: 0 }
          100% { transform: scale(1); opacity: 1 }
        }
        .animate-popup {
          animation: popup 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  )
}
