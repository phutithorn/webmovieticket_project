'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e) => {
        e.preventDefault()

        const res = await fetch('/api/admin-login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        })

        const result = await res.json()
        if (res.ok) {
            router.push('/admin/admin-movies') 
        } else {
            alert(result.message)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold text-black mb-6">Admin Login</h2>

                <form onSubmit={handleSubmit}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 placeholder-gray-500 text-black"
                    />

                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <div className="relative mb-6">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 placeholder-gray-500 text-black"
                        />
                        <span
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-2.5 cursor-pointer text-gray-400 hover:text-gray-600"
                        >
                            {showPassword ? (
                                <EyeSlashIcon className="h-5 w-5" />
                            ) : (
                                <EyeIcon className="h-5 w-5" />
                            )}
                        </span>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 rounded-md transition"
                    >
                        Login now
                    </button>
                </form>
            </div>
        </div>
    )
}
