'use client'

export default function AdminHeader({ title }) {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-lg font-semibold text-black">{title}</h1>
      <div className="flex items-center gap-3">
        <div className="bg-black text-white font-bold rounded-full w-8 h-8 flex items-center justify-center">
          a
        </div>
        <span className="text-gray-800 font-medium">administrator</span>
      </div>
    </div>
  )
}
