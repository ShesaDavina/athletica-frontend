/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { Eye, Download, CreditCard, Calendar, Dumbbell, Clock, XCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "react-hot-toast";
import axiosInstance from "../../utils/axiosConfig";
import { DNA } from "react-loader-spinner";

const UserBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [downloading, setDownloading] = useState(null);
    const itemsPerPage = 6; // card per page

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get("/bookings");
            const bookingsData = response.data.data;
            if (Array.isArray(bookingsData)) {
                setBookings(bookingsData);
            } else {
                setBookings([]);
            }
        } catch (error) {
            console.error(error);
            toast.error("Gagal mengambil riwayat booking");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const viewDetail = (booking) => {
        setSelectedBooking(booking);
        setModalOpen(true);
    };

    const downloadTicket = async (bookingId) => {
        setDownloading(bookingId);
        try {
            const response = await axiosInstance.get(`/export/ticket/${bookingId}`, {
                responseType: "blob",
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `tiket_booking_${bookingId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            toast.success("Tiket berhasil diunduh");
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Gagal mengunduh tiket");
        } finally {
            setDownloading(null);
        }
    };

    const retryPayment = (paymentUrl) => {
        if (paymentUrl) window.open(paymentUrl, "_blank");
        else toast.error("Link pembayaran tidak tersedia");
    };

    const getStatusBadge = (status, bookingType, paymentStatus) => {
        if (bookingType === "regular") {
            if (paymentStatus === "paid")
                return { label: "Lunas", color: "bg-green-100 text-green-700" };
            if (paymentStatus === "pending")
                return { label: "Menunggu Bayar", color: "bg-yellow-100 text-yellow-700" };
            if (paymentStatus === "failed")
                return { label: "Gagal", color: "bg-red-100 text-red-700" };
        } else {
            if (status === "booked")
                return { label: "Terbooking", color: "bg-blue-100 text-blue-700" };
            if (status === "attended")
                return { label: "Hadir", color: "bg-green-100 text-green-700" };
            if (status === "canceled")
                return { label: "Dibatalkan", color: "bg-red-100 text-red-700" };
        }
        return { label: status, color: "bg-gray-100 text-gray-700" };
    };

    // Pagination
    const totalPages = Math.ceil(bookings.length / itemsPerPage);
    const paginatedBookings = bookings.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <DNA
                    visible={true}
                    height="80"
                    width="80"
                    dnaColorOne="#7aaace"
                    dnaColorTwo="#9cd5ff"
                />
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-athletica-blue-dark">Riwayat Booking</h1>
                <p className="text-gray-500 mt-1">Lihat semua kelas yang pernah Anda booking</p>
            </div>

            {bookings.length === 0 ? (
                <div className="bg-white rounded-xl p-8 text-center text-gray-400">
                    Belum ada booking. Yuk booking kelas pertama Anda!
                </div>
            ) : (
                <>
                    {/* Grid Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {paginatedBookings.map((item) => {
                            const statusData = getStatusBadge(item.status, item.booking_type, item.payment?.status);
                            const isReguler = item.booking_type === "regular";
                            const canDownload = (isReguler && item.payment?.status === "paid") || (!isReguler && item.status === "booked");
                            const canPay = isReguler && item.payment?.status === "pending" && item.payment?.payment_url;

                            return (
                                <div key={item.booking_id} className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all overflow-hidden group">
                                    {/* Card header - warna background sesuai status */}
                                    <div className={`px-5 py-3 border-b border-gray-300 ${statusData.color.split(' ')[0]}`}>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-semibold">{statusData.label}</span>
                                            <span className="text-xs text-gray-500">#{item.booking_id}</span>
                                        </div>
                                    </div>
                                    {/* Card body */}
                                    <div className="p-5 space-y-3">
                                        <div className="flex items-start gap-3">
                                            <div className="bg-athletica-blue-light/20 p-2 rounded-xl">
                                                <Dumbbell className="h-6 w-6 text-athletica-blue-dark" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-athletica-blue-dark text-lg">{item.schedule?.class?.class_name}</h3>
                                                <p className="text-sm text-gray-500">Trainer: {item.schedule?.trainer?.name}</p>
                                            </div>
                                        </div>

                                        <div className="space-y-1 text-sm text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4" />
                                                <span>{new Date(item.schedule?.schedule_date).toLocaleDateString("id-ID", {
                                                    weekday: "long", day: "numeric", month: "long", year: "numeric"
                                                })}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Clock className="h-4 w-4" />
                                                <span>{item.schedule?.start_time} - {item.schedule?.end_time}</span>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center pt-2">
                                            <span className={`text-xs px-2 py-1 rounded-full ${statusData.color}`}>
                                                {isReguler ? (item.payment?.status === "paid" ? "Lunas" : item.payment?.status) : item.status}
                                            </span>
                                            {isReguler && item.payment?.amount && (
                                                <span className="font-bold text-athletica-blue-dark">
                                                    Rp {parseInt(item.payment.amount).toLocaleString()}
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex gap-2 pt-3">
                                            <button
                                                onClick={() => viewDetail(item)}
                                                className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl border border-gray-200 text-athletica-blue-dark hover:bg-gray-50 transition"
                                            >
                                                <Eye size={16} /> Detail
                                            </button>
                                            {canDownload && (
                                                <button
                                                    onClick={() => downloadTicket(item.booking_id)}
                                                    disabled={downloading === item.booking_id}
                                                    className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl bg-athletica-blue-dark text-white hover:bg-athletica-blue-mid transition disabled:opacity-50"
                                                >
                                                    <Download size={16} /> Tiket
                                                </button>
                                            )}
                                            {canPay && (
                                                <button
                                                    onClick={() => retryPayment(item.payment.payment_url)}
                                                    className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl bg-yellow-500 text-white hover:bg-yellow-600 transition"
                                                >
                                                    <CreditCard size={16} /> Bayar
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-3 mt-8">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 hover:bg-gray-100"
                            >
                                <ChevronLeft size={18} />
                            </button>
                            <span className="text-sm">Halaman {currentPage} dari {totalPages}</span>
                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 hover:bg-gray-100"
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    )}
                </>
            )}

            {/* Modal Detail (sama seperti sebelumnya) */}
            {modalOpen && selectedBooking && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-300 px-5 py-4 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-athletica-blue-dark">Detail Booking</h2>
                            <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <XCircle className="h-6 w-6" />
                            </button>
                        </div>
                        <div className="p-5 space-y-4">
                            {/* Konten modal sama seperti sebelumnya */}
                            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                                <h3 className="font-semibold text-athletica-blue-dark flex items-center gap-2"><Dumbbell size={18} /> Kelas</h3>
                                <p className="text-lg font-medium">{selectedBooking.schedule?.class?.class_name}</p>
                                <p className="text-sm text-gray-500">Trainer: {selectedBooking.schedule?.trainer?.name}</p>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                                <h3 className="font-semibold text-athletica-blue-dark flex items-center gap-2"><Calendar size={18} /> Jadwal</h3>
                                <p>{new Date(selectedBooking.schedule?.schedule_date).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p>
                                <p>{selectedBooking.schedule?.start_time} - {selectedBooking.schedule?.end_time}</p>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                                <h3 className="font-semibold text-athletica-blue-dark">Informasi Booking</h3>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <span className="text-gray-500">Tipe:</span>
                                    <span>{selectedBooking.booking_type === "membership" ? "Membership" : "Reguler"}</span>
                                    <span className="text-gray-500">Status:</span>
                                    <span>{getStatusBadge(selectedBooking.status, selectedBooking.booking_type, selectedBooking.payment?.status).label}</span>
                                    <span className="text-gray-500">Booking ID:</span>
                                    <span>#{selectedBooking.booking_id}</span>
                                    <span className="text-gray-500">Tanggal Booking:</span>
                                    <span>{new Date(selectedBooking.created_at).toLocaleString("id-ID")}</span>
                                </div>
                            </div>
                            {selectedBooking.booking_type === "regular" && selectedBooking.payment && (
                                <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                                    <h3 className="font-semibold text-athletica-blue-dark">Pembayaran</h3>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <span className="text-gray-500">Total:</span>
                                        <span className="font-bold">Rp {parseInt(selectedBooking.payment.amount || 0).toLocaleString()}</span>
                                        <span className="text-gray-500">Status:</span>
                                        <span>{selectedBooking.payment.status === "paid" ? "Lunas" : selectedBooking.payment.status === "pending" ? "Menunggu" : "Gagal"}</span>
                                        <span className="text-gray-500">Metode:</span>
                                        <span className="capitalize">{selectedBooking.payment.payment_method || "-"}</span>
                                        {selectedBooking.payment.payment_date && (
                                            <>
                                                <span className="text-gray-500">Tanggal Bayar:</span>
                                                <span>{new Date(selectedBooking.payment.payment_date).toLocaleString("id-ID")}</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="p-5 border-t border-gray-300">
                            {selectedBooking.booking_type === "regular" && selectedBooking.payment?.status === "pending" && selectedBooking.payment?.payment_url && (
                                <button onClick={() => retryPayment(selectedBooking.payment.payment_url)} className="w-full py-2 bg-yellow-500 text-white rounded-xl font-semibold hover:bg-yellow-600">Lanjutkan Pembayaran</button>
                            )}
                            {((selectedBooking.booking_type === "regular" && selectedBooking.payment?.status === "paid") ||
                                (selectedBooking.booking_type === "membership" && selectedBooking.status === "booked")) && (
                                    <button onClick={() => downloadTicket(selectedBooking.booking_id)} className="w-full py-2 bg-athletica-blue-dark text-white rounded-xl font-semibold hover:bg-athletica-blue-mid flex items-center justify-center gap-2"><Download size={16} /> Unduh Tiket PDF</button>
                                )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserBookings;