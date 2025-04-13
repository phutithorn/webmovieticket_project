'use client'
import { useRouter, useSearchParams } from 'next/navigation'

export default function OrderDetailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const title = searchParams.get('title') || 'Unknown Movie'
  const date = searchParams.get('date') || 'N/A'
  const time = searchParams.get('time') || '--:--'
  const seats = searchParams.get('seats') || ''
  const types = searchParams.get('seatTypes') || ''
  const total = parseFloat(searchParams.get('total') || '0')
  const seatList = seats.split(',').map(s => s.trim()).filter(Boolean)
  const typeList = types.split(',').map(t => t.trim()).filter(Boolean)
  const grouped = typeList.reduce((a, t) => (a[t] = (a[t] || 0) + 1, a), {})
  const getPrice = t => t === 'Suite (Pair)' ? 1500 : t === 'Premium' ? 540 : 320

  return (
    <div className="min-h-screen bg-gradient-custom text-white flex items-center justify-center px-4 py-8">
      <div className="bg-white/5 rounded-xl p-8 w-full max-w-md shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Booking Detail</h1>
        <p className="text-sm text-gray-300 mb-2">Schedule</p>
        <div className="mb-6">
          <p className="text-base font-semibold">Movie Title</p>
          <p className="mb-2 text-lg">{title}</p>
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
        <div className="mt-6 flex flex-col gap-2">
          <button onClick={() => router.back()} className="bg-white text-black py-2 rounded hover:bg-gray-300">Back</button>
          <button className="bg-[#00E676] text-black py-2 rounded hover:bg-[#00C853] font-semibold">Checkout Ticket</button>
        </div>
      </div>
      <style jsx global>{`
        .bg-gradient-custom {
          background: radial-gradient(800px at bottom left,#0B3D29 0%,transparent 70%),
                      radial-gradient(1000px at top right,#04371F 0%,transparent 70%),#000;
        }
      `}</style>
    </div>
  )
}
