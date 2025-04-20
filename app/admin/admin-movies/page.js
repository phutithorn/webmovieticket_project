'use client'

import AdminSidebar from '@/components/AdminSidebar'
import AdminHeader from '@/components/AdminHeader'
import { useEffect, useState } from 'react'
import { EyeIcon, EyeSlashIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'

export default function AdminMoviesPage() {
    const [movies, setMovies] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isEditMode, setIsEditMode] = useState(false)
    const [formData, setFormData] = useState({})
    const [selectedId, setSelectedId] = useState(null)

    const fetchMovies = async () => {
        const res = await fetch('/api/movies')
        const data = await res.json()
        setMovies(data)
    }

    useEffect(() => {
        fetchMovies()
    }, [])

    const openModal = (edit = false, movie = null) => {
        setIsModalOpen(true)
        setIsEditMode(edit)
        setFormData(movie || {})
        setSelectedId(movie?.id || null)
    }

    const closeModal = () => {
        setIsModalOpen(false)
        setIsEditMode(false)
        setFormData({})
        setSelectedId(null)
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSave = async (e) => {
        e.preventDefault()
        const method = isEditMode ? 'PUT' : 'POST'
        const url = isEditMode ? `/api/movies/${selectedId}` : '/api/movies'

        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        })

        if (res.ok) {
            fetchMovies()
            closeModal()
        } else {
            console.error('Failed to save movie')
        }
    }

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this movie?')) return
        const res = await fetch(`/api/movies/${id}`, { method: 'DELETE' })
        if (res.ok) fetchMovies()
    }

    return (
        <div className="flex min-h-screen bg-white">
            <AdminSidebar />
            <div className="flex-1 p-6">
                <AdminHeader title="Admin Movie" />

                <div className="flex justify-end mb-4">
                    <button
                        onClick={() => openModal(false)}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded-md text-sm"
                    >
                        + Create new
                    </button>
                </div>

                <table className="min-w-full border border-gray-300 border-collapse text-sm text-center text-black">
                    <thead className="bg-gray-50 border-b border-gray-300">
                        <tr>
                            <th className="px-4 py-2 border">#</th>
                            <th className="px-4 py-2 border">Cover</th>
                            <th className="px-4 py-2 border">Title</th>
                            <th className="px-4 py-2 border">Status</th>
                            <th className="px-4 py-2 border">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {movies.map((movie, i) => (
                            <tr key={movie.id}>
                                <td className="border py-2">{i + 1}</td>
                                <td className="border">
                                    <img src={movie.poster} className="h-24 mx-auto" />
                                </td>
                                <td className="border">{movie.title}</td>
                                <td className="border">{movie.status}</td>
                                <td className="border space-x-2">
                                    <button
                                        onClick={() => openModal(true, movie)}
                                        className="p-2 rounded border hover:bg-gray-100"
                                    >
                                        <PencilSquareIcon className="h-5 w-5 text-gray-600" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(movie.id)}
                                        className="p-2 rounded bg-red-500 hover:bg-red-600"
                                    >
                                        <TrashIcon className="h-5 w-5 text-white" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 backdrop-blur-sm bg-white/5 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg w-full max-w-md p-6 relative overflow-y-auto max-h-[90vh]">
                        <button onClick={closeModal} className="absolute top-2 right-3 text-gray-500">✖</button>
                        <h2 className="text-lg font-semibold text-black mb-4">{isEditMode ? 'Edit Movie' : 'Add Movie'}</h2>

                        <form className="text-gray-700" onSubmit={handleSave}>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Title</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title || ''}
                                        onChange={handleChange}
                                        placeholder="Enter title"
                                        className="w-full border px-3 py-2 rounded text-black"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Category</label>
                                    <input
                                        type="text"
                                        name="category"
                                        value={formData.category || ''}
                                        onChange={handleChange}
                                        placeholder="e.g. Action"
                                        className="w-full border px-3 py-2 rounded text-black"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Duration</label>
                                    <input
                                        type="text"
                                        name="duration"
                                        value={formData.duration || ''}
                                        onChange={handleChange}
                                        placeholder="e.g. 2h 30m"
                                        className="w-full border px-3 py-2 rounded text-black"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Language</label>
                                    <input
                                        type="text"
                                        name="language"
                                        value={formData.language || ''}
                                        onChange={handleChange}
                                        placeholder="e.g. English"
                                        className="w-full border px-3 py-2 rounded text-black"
                                    />
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-sm font-medium mb-1">Poster URL</label>
                                    <input
                                        type="text"
                                        name="poster"
                                        value={formData.poster || ''}
                                        onChange={handleChange}
                                        placeholder="https://..."
                                        className="w-full border px-3 py-2 rounded text-black"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Director</label>
                                    <input
                                        type="text"
                                        name="director"
                                        value={formData.director || ''}
                                        onChange={handleChange}
                                        placeholder="Director name"
                                        className="w-full border px-3 py-2 rounded text-black"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Cast</label>
                                    <input
                                        type="text"
                                        name="cast"
                                        value={formData.cast || ''}
                                        onChange={handleChange}
                                        placeholder="Main actors"
                                        className="w-full border px-3 py-2 rounded text-black"
                                    />
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-sm font-medium mb-1">Synopsis</label>
                                    <textarea
                                        name="synopsis"
                                        rows={3}
                                        value={formData.synopsis || ''}
                                        onChange={handleChange}
                                        placeholder="Movie synopsis"
                                        className="w-full border px-3 py-2 rounded text-black"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Release Date</label>
                                    <input
                                        type="date"
                                        name="release_date"
                                        value={formData.release_date ? formData.release_date.slice(0, 10) : ''}
                                        onChange={handleChange}
                                        className="w-full border px-3 py-2 rounded text-black"
                                    />

                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">IMDb Rating</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        name="imdb_rating"
                                        value={formData.imdb_rating || ''}
                                        onChange={handleChange}
                                        placeholder="e.g. 7.8"
                                        className="w-full border px-3 py-2 rounded text-black"
                                    />
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-sm font-medium mb-1">Status</label>
                                    <select
                                        name="status"
                                        value={formData.status || ''}
                                        onChange={handleChange}
                                        className="w-full border px-3 py-2 rounded text-black"
                                    >
                                        <option value="">Select status</option>
                                        <option value="now_showing">Now Showing</option>
                                        <option value="coming_soon">Coming Soon</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-6">
                                <button type="button" onClick={closeModal} className="px-4 py-1 border rounded text-gray-600">Cancel</button>
                                <button type="submit" className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">Save</button>
                            </div>
                        </form>

                    </div>
                </div>
            )}
        </div>
    )
}
