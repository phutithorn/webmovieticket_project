'use client'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const sections = {
  'กำลังฉาย': [
    { title: 'Black Mirror', poster: '/posters/blackmirror.png', category: 'ไซไฟ / ระทึกขวัญ', duration: '1 ชม. 30 นาที', language: 'ENG / SUBTITLE', releaseDate: '28 MAR 2025' },
    { title: 'Minecraft', poster: '/posters/minecraft.png', category: 'แอ็คชัน / ผจญภัย / แฟนตาซี', duration: '01 ชม. 41 นาที', language: 'ENG / SUBTITLE', releaseDate: '04 APR 2025' },
    { title: 'Mickey 17', poster: '/posters/mickey17.png', category: 'ไซไฟ / ลึกลับ', duration: '2 ชม. 2 นาที', language: 'KOR / SUBTITLE', releaseDate: '10 APR 2025' },
    { title: 'The Amateur', poster: '/posters/amateur.png', category: 'แอ็คชัน / ดราม่า', duration: '1 ชม. 50 นาที', language: 'ENG / SUBTITLE', releaseDate: '12 APR 2025' },
    { title: 'A Working Man', poster: '/posters/aworkman.png', category: 'ดราม่า / อาชญากรรม', duration: '1 ชม. 45 นาที', language: 'ENG / SUBTITLE', releaseDate: '18 APR 2025' },
  ],
  'โปรแกรมหน้า': [
    { title: 'G20', poster: '/posters/G20.png', category: 'แอ็คชัน / ระทึกขวัญ', duration: '2 ชม. 10 นาที', language: 'ENG / SUBTITLE', releaseDate: '20 APR 2025' },
    { title: 'Novocaine', poster: '/posters/novocaine.png', category: 'แอนิเมชัน / ตลก / ระทึกขวัญ', duration: '1 ชม. 40 นาที', language: 'TH / SUBTITLE', releaseDate: '30 APR 2025' },
    { title: 'Thunderbolts', poster: '/posters/thunderbolts.png', category: 'แอ็กชัน / ซูเปอร์ฮีโร่', duration: '2 ชม.', language: 'TH / SUBTITLE', releaseDate: '15 APR 2025' },
    { title: 'Snow White', poster: '/posters/snowwhite.png', category: 'แฟนตาซี / ไลฟ์แอ็กชัน / มิวสิคัล', duration: '109 นาที', language: 'TH / SUBTITLE', releaseDate: '20 APR 2025' },
  ]
}

export default function HomePage() {
  const router = useRouter()
  const [showModal, setShowModal] = useState(false)
  const confirmLogout = () => router.push('/login')

  return (
    <div className="min-h-screen relative text-white px-6 py-1" style={{ background: `radial-gradient(800px at bottom left, #0B3D29 0%, transparent 70%), radial-gradient(1000px at top right, #04371F 0%, transparent 70%), #000` }}>
      <div className="absolute top-6 left-6"><Image src="/logo.png" alt="Logo" width={100} height={40} /></div>
      <div className="absolute top-6 right-6 flex gap-3">
        <Link href="/myticket"><button className="text-white px-2 py-2 font-medium relative group">
          My Ticket
          <span className="absolute left-0 -bottom-0 w-full h-[3px] bg-[#00E676] scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
        </button></Link>
        <button onClick={() => setShowModal(true)} className="bg-red-600 text-white px-4 py-2 rounded-md font-medium hover:bg-red-700 transition">Logout</button>
      </div>
      <div className="max-w-6xl mx-auto">
        {Object.entries(sections).map(([title, movies]) => (
          <div key={title}>
            <h1 className="text-3xl font-bold thai-font mt-16 mb-6 text-left">{title}</h1>
            <div className="flex flex-wrap gap-8">
              {movies.map((movie, i) => <MovieCard key={i} movie={movie} section={title} />)}
            </div>
          </div>
        ))}
      </div>
      {showModal && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 text-center max-w-sm w-full transform transition duration-300 scale-95 opacity-0 animate-zoomIn">
            <h2 className="text-xl font-semibold text-black mb-4">Are you sure you want to logout?</h2>
            <div className="flex justify-center gap-4">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 border border-gray-400 rounded hover:bg-gray-100 text-black">Cancel</button>
              <button onClick={confirmLogout} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Logout</button>
            </div>
          </div>
        </div>
      )}
      <style jsx global>{`
        @keyframes zoomIn {
          0% { transform: scale(0.8); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-zoomIn { animation: zoomIn 0.3s ease-out forwards; }
      `}</style>
    </div>
  )
}

function MovieCard({ movie, section }) {
  const router = useRouter()
  const isComingSoon = section === 'โปรแกรมหน้า'

  const handleBooking = () => {
    const query = new URLSearchParams({
      title: movie.title,
      poster: movie.poster,
      duration: movie.duration,
      type: movie.category,
      releaseDate: movie.releaseDate,
      mode: isComingSoon ? 'future' : 'now'
    }).toString()
    router.push(`/booking?${query}`)
  }

  return (
    <div className="text-center w-[180px]">
      <div className="relative group overflow-hidden rounded-lg">
        <Image src={movie.poster} alt={movie.title} width={180} height={270} className="object-cover rounded-lg" />
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-300">
          <div className="w-full h-full bg-black/80 p-3 flex flex-col justify-between">
            <div className="text-left text-xs text-white">
              <h3 className="font-semibold text-base text-center mb-2">{movie.title}</h3>
              <p className="thai-font">ประเภท: {movie.category}</p>
              <p className="thai-font">ความยาว: {movie.duration}</p>
              <p className="thai-font">ภาษา: {movie.language}</p>
            </div>
            <button onClick={handleBooking} className="thai-font bg-white text-black text-sm font-semibold rounded-md py-1 hover:bg-gray-200 w-full mt-3">จองเลย</button>
          </div>
        </div>
      </div>
      <p className="mt-3 text-sm font-medium" style={{ color: '#F9C66D' }}>{movie.releaseDate}</p>
      <p className="mt-1 text-white text-sm font-medium">{movie.title}</p>
    </div>
  )
}