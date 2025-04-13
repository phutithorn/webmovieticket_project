'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const menus = ['Movies', 'Theaters', 'Users', 'Orders', 'Report']

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="w-48 border-r p-4 space-y-2 font-medium">
      {menus.map((item) => {
        const path = `/admin/admin-${item.toLowerCase()}`
        const active = pathname === path
        return (
          <Link
            key={item}
            href={path}
            className={`block p-2 rounded text-black ${
              active ? 'bg-gray-300 font-semibold' : 'hover:bg-gray-100'
            }`}
          >
            {item}
          </Link>
        )
      })}
    </div>
  )
}
