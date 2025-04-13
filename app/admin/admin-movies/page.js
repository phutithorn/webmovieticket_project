'use client'

import AdminSidebar from '@/components/AdminSidebar'
import AdminHeader from '@/components/AdminHeader'


import { useState } from 'react'
import { EyeIcon, EyeSlashIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline'


export default function AdminMoviesPage() {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isEditMode, setIsEditMode] = useState(false)
    const [showing, setShowing] = useState(true)

    const openModal = (edit = false) => {
        setIsModalOpen(true)
        setIsEditMode(edit)
    }

    const closeModal = () => {
        setIsModalOpen(false)
        setIsEditMode(false)
    }

    return (
        <div className="flex min-h-screen bg-white">
            {/* Sidebar */}
            <AdminSidebar />
            

            {/* Content */}
            <div className="flex-1 p-6">
                {/* Header */}
                <AdminHeader title="Admin Movie" />

                {/* Create Button */}
                <div className="flex justify-end mb-4">
                    <button
                        onClick={() => openModal(false)}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded-md text-sm"
                    >
                        + Create new
                    </button>
                </div>

                {/* Table */}
                <div className="text-black">
                    <table className="min-w-full border border-gray-300 border-collapse text-sm text-center">
                        <thead className="bg-gray-50 border-b border-gray-300 text-black">
                            <tr>
                                <th className="px-4 py-2 border border-gray-300">#</th>
                                <th className="px-4 py-2 border border-gray-300">Cover</th>
                                <th className="px-4 py-2 border border-gray-300">Title</th>
                                <th className="px-4 py-2 border border-gray-300">Status</th>
                                <th className="px-4 py-2 border border-gray-300">Action</th>
                            </tr>
                        </thead>
                        <tbody className="text-black">
                            <tr>
                                <td className="border border-gray-300 py-2">1</td>
                                <td className="border border-gray-300">
                                    <img
                                        src="https://upload.wikimedia.org/wikipedia/en/c/c1/The_Matrix_Poster.jpg"
                                        alt="poster"
                                        className="h-24 mx-auto"
                                    />
                                </td>
                                <td className="border border-gray-300">Title</td>
                                <td className="border border-gray-300">Status</td>
                                <td className="border border-gray-300 space-x-2">
                                    <button
                                        onClick={() => setShowing(!showing)}
                                        className="p-2 rounded border hover:bg-gray-100"
                                    >
                                        {showing ? (
                                            <EyeIcon className="h-5 w-5 text-gray-600" />
                                        ) : (
                                            <EyeSlashIcon className="h-5 w-5 text-gray-600" />
                                        )}
                                    </button>
                                    <button className="p-2 rounded border hover:bg-gray-100">
                                        <PencilSquareIcon className="h-5 w-5 text-gray-600" />
                                    </button>
                                    <button className="p-2 rounded bg-red-500 hover:bg-red-600">
                                        <TrashIcon className="h-5 w-5 text-white" />
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
              <div className="fixed inset-0 backdrop-blur-sm bg-white/5 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
                        <button onClick={closeModal} className="absolute top-2 right-3 text-gray-500">✖</button>

                        {/* หัวข้อดำ */}
                        <h2 className="text-lg font-semibold text-black mb-4">
                            {isEditMode ? 'Edit Movie' : 'Add Movie'}
                        </h2>

                        <form className="space-y-4 text-gray-700">
                            <div>
                                <label className="block text-sm font-medium mb-1">Movie Title</label>
                                <input
                                    type="text"
                                    placeholder="Enter title"
                                    className="w-full border px-3 py-2 rounded placeholder-gray-600 text-black"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Description</label>
                                <textarea
                                    rows="2"
                                    placeholder="Movie description"
                                    className="w-full border px-3 py-2 rounded placeholder-gray-600 text-black"
                                />
                            </div>

                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium mb-1">Duration</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. 2h 30m"
                                        className="w-full border px-3 py-2 rounded placeholder-gray-600 text-black"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm font-medium mb-1">Price</label>
                                    <div className="flex items-center border rounded">
                                        <input
                                            type="text"
                                            placeholder="e.g. 30"
                                            className="flex-1 px-3 py-2 outline-none rounded-l placeholder-gray-600 text-black"
                                        />
                                        <span className="px-2 text-sm text-gray-500 bg-gray-100 rounded-r">฿</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Showing Schedule</label>
                                <input
                                    type="date"
                                    className="w-full border px-3 py-2 rounded text-black"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">End Date</label>
                                <input
                                    type="date"
                                    className="w-full border px-3 py-2 rounded text-black"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Cover Image</label>
                                <input
                                    type="file"
                                    className="w-full border px-3 py-1.5 rounded text-black"
                                />
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
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
