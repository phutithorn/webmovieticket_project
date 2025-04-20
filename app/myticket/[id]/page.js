'use client'
import { useEffect, useState, useRef } from 'react'
import { useParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import html2canvas from 'html2canvas'
import { useRouter } from 'next/navigation'

const QRCode = dynamic(() => import('qrcode.react').then(m => m.QRCodeCanvas), { ssr: false });

export default function TicketDetailPage() {
    const { id } = useParams()
    const [ticket, setTicket] = useState(null)
    const ticketRef = useRef(null)
    const router = useRouter();

    useEffect(() => {
        const fetchTicket = async () => {
            const res = await fetch(`/api/mytickets/${id}`)
            const data = await res.json()
            setTicket(data)
        }
        if (id) fetchTicket()
    }, [id])

    const handleDownload = () => {
        if (!ticketRef.current) return;

        const clone = ticketRef.current.cloneNode(true);

        // Remove poster
        const poster = clone.querySelector('img');
        if (poster) poster.remove();

        // Remove the Save button from the clone
        const saveButton = clone.querySelector('#download-btn');
        if (saveButton) saveButton.remove();

        const backButton = clone.querySelector('#back-btn');
        if (backButton) backButton.remove();

        // Replace QR canvas with <img>
        const originalCanvas = ticketRef.current.querySelector('canvas');
        if (originalCanvas) {
            const dataURL = originalCanvas.toDataURL();
            const img = document.createElement('img');
            img.src = dataURL;
            img.style.width = originalCanvas.style.width;
            img.style.height = originalCanvas.style.height;

            const wrapper = clone.querySelector('canvas')?.parentElement;
            if (wrapper) {
                wrapper.innerHTML = '';
                wrapper.appendChild(img);
            }
        }

        // Clean styles
        clone.classList.remove('bg-white/5', 'text-gray-300', 'text-gray-400', 'border-white/10');
        clone.style.backgroundColor = '#111';
        clone.style.color = '#eee';
        clone.style.border = '1px solid #333';
        clone.style.fontFamily = 'sans-serif';
        clone.style.padding = '24px';
        clone.style.borderRadius = '12px';
        clone.style.width = `${ticketRef.current.offsetWidth}px`;

        clone.querySelectorAll('*').forEach(el => {
            el.style.backgroundImage = 'none';
            el.style.backgroundColor = 'transparent';
            el.style.color = '#eee';
            el.style.borderColor = '#333';
        });

        clone.style.position = 'fixed';
        clone.style.top = '-9999px';
        document.body.appendChild(clone);

        html2canvas(clone, {
            useCORS: true,
            backgroundColor: '#111',
            scale: 2,
        })
            .then((canvas) => {
                const link = document.createElement('a');
                link.download = `ticket_${ticket.id}.png`;
                link.href = canvas.toDataURL('image/png');
                link.click();
                document.body.removeChild(clone);
            })
            .catch((err) => {
                console.error('Failed to save ticket:', err);
                document.body.removeChild(clone);
            });
    };






    if (!ticket) return <div className="text-white p-10">Loading...</div>

    function toBinary(n, bits) {
        return n.toString(2).padStart(bits, '0')
    }

    const showTimeNumber = parseInt(ticket.show_time.replace(':', '')) || 0
    const showDateNumber = parseInt(ticket.show_date.replace(/-/g, '')) || 0

    const qrBinary =
        toBinary(ticket.id, 8) +
        toBinary(ticket.movie_id, 8) +
        toBinary(ticket.user_id || 1, 8) +
        toBinary(ticket.total_price, 12) +
        toBinary(ticket.seats.length, 5) +
        toBinary(showTimeNumber, 16) +
        toBinary(showDateNumber, 32)

    return (
        <div className="min-h-screen bg-[#000000] text-white flex justify-center px-6 py-10">
            <div
                className="bg-white/5 p-6 rounded-xl shadow-lg w-full max-w-2xl text-center border border-white/10"
                ref={ticketRef}
            >
                <button
                    id="back-btn"
                    onClick={() => router.push('/myticket')}
                    className="text-sm text-white bg-transparent border border-white px-3 py-1 rounded hover:bg-white hover:text-black transition mb-4"
                >
                    ← Back to My Tickets
                </button>

                <h1 className="text-3xl font-bold text-[#F9C66D] mb-4">{ticket.movie_title}</h1>

                {/* Poster shown, but not included in download */}
                <img
                    src={ticket.poster}
                    alt="Poster"
                    className="w-48 h-72 mx-auto object-cover rounded-lg shadow mb-4"
                />

                <p className="text-sm text-gray-300">Theater: {ticket.theater}</p>
                <p className="text-sm text-gray-300 pt-2">Date: {new Date(ticket.show_date).toLocaleDateString('en-GB')}</p>
                <p className="text-sm text-gray-300 pt-2">Time: {ticket.show_time.slice(0, 5)}</p>
                <p className="text-sm text-gray-300 pt-2">Seats: {ticket.seats.map(s => s.seat_label).join(', ')}</p>
                <p className="text-sm text-gray-400 mt-4">
                    Booking ID: <span className="text-white font-semibold">{ticket.id}</span>
                </p>

                <div className="mt-2 flex flex-col items-center">
                    <div className="bg-white p-2 rounded">
                        <QRCode value={qrBinary} size={180} bgColor="#fff" fgColor="#000" />
                    </div>
                    <p className="text-xs text-gray-400 mt-4">Scan this at the theater</p>
                </div>

                <div className="item-center">
                    <button
                        id="download-btn"
                        onClick={handleDownload}
                        className="mt-6 bg-[#00E676] hover:bg-[#00C853] text-black font-semibold px-4 py-2 rounded-md transition"
                    >
                        Save to Gallery
                    </button>
                </div>
            </div>

            <style jsx global>{`
        .bg-gradient-custom {
          background: radial-gradient(800px at bottom left, #0B3D29 0%, transparent 70%),
                      radial-gradient(1000px at top right, #04371F 0%, transparent 70%), #000;
        }
      `}</style>
        </div>
    )
}
