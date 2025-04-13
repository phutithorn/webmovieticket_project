'use client'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

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
  const [showLoginPopup, setShowLoginPopup] = useState(false)

  return (
    <div className="min-h-screen relative text-white px-6 py-1 bg-gradient-custom">
      <div className="absolute top-6 left-6">
        <Image src="/logo.png" alt="Logo" width={100} height={40} />
      </div>

      <div className="absolute top-6 right-6 flex gap-3">
        <Link href="/login"><button className="bg-[#00E676] text-white px-4 py-2 rounded-md font-medium hover:bg-[#00C853]">Login</button></Link>
        <Link href="/register"><button className="border border-white text-white px-4 py-2 rounded-md font-medium hover:bg-white hover:text-black">Register</button></Link>
      </div>

      <div className="max-w-6xl mx-auto">
        {Object.entries(sections).map(([title, movies]) => (
          <div key={title}>
            <h1 className="text-3xl font-bold thai-font mt-16 mb-6 text-left">{title}</h1>
            <div className="flex flex-wrap gap-8">
              {movies.map((movie, index) => (
                <MovieCard key={index} movie={movie} onBook={() => setShowLoginPopup(true)} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {showLoginPopup && <LoginPopup onClose={() => setShowLoginPopup(false)} />}

      <style jsx global>{`
        @keyframes popup {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-popup {
          animation: popup 0.25s ease-out forwards;
        }

        @keyframes spin-slow {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }

        .bg-gradient-custom {
          background: radial-gradient(800px at bottom left, #0B3D29 0%, transparent 70%),
                      radial-gradient(1000px at top right, #04371F 0%, transparent 70%), #000;
        }
      `}</style>
    </div>
  )
}

function MovieCard({ movie: { title, poster, category, duration, language, releaseDate }, onBook }) {
  return (
    <div className="text-center w-[180px]">
      <div className="relative group overflow-hidden rounded-lg">
        <Image src={poster} alt={title} width={180} height={270} className="object-cover rounded-lg" />
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-300">
          <div className="w-full h-full bg-black/80 p-3 flex flex-col justify-between">
            <div className="text-left text-xs text-white">
              <h3 className="font-semibold text-base text-center mb-2">{title}</h3>
              <p className="thai-font">ประเภท: {category}</p>
              <p className="thai-font">ความยาว: {duration}</p>
              <p className="thai-font">ภาษา: {language}</p>
            </div>
            <button onClick={onBook} className="thai-font bg-white text-black text-sm font-semibold rounded-md py-1 hover:bg-gray-200 w-full mt-3">จองเลย</button>
          </div>
        </div>
      </div>
      <p className="mt-3 text-sm font-medium" style={{ color: '#F9C66D' }}>{releaseDate}</p>
      <p className="mt-1 text-white text-sm font-medium">{title}</p>
    </div>
  )
}

function LoginPopup({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-sm w-full relative text-black animate-popup">
        <div className="relative flex justify-center mb-4">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 border-4 border-[#00C853] border-t-transparent rounded-full animate-spin-slow"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-red-500 text-2xl font-bold">×</span>
            </div>
          </div>
        </div>
        <h2 className="text-lg font-semibold mb-2 text-center">Login Required</h2>
        <p className="text-sm text-gray-700 text-center">Please log in to proceed with your booking.</p>
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl">&times;</button>
      </div>
    </div>
  )
}