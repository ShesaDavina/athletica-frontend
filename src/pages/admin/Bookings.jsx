/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { Search, Eye, Calendar, User, Dumbbell, CreditCard, Download } from "lucide-react";
import { toast } from "react-hot-toast";
import axiosInstance from "../../utils/axiosConfig";
import { DNA } from "react-loader-spinner";

const Bookings = () => {
    const [bookings, setBookings] = useState([]);
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        total: 0,
    });
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const [exporting, setExporting] = useState(false);

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(`/admin/bookings`, {
                params: {
                    page: page,
                    search: search,
                },
            });

            const data = response.data?.data;
            setBookings(data?.data || []);
            setPagination({
                current_page: data?.current_page || 1,
                last_page: data?.last_page || 1,
                total: data?.total || 0,
            });
        } catch (error) {
            console.error("Error fetching bookings:", error);
            toast.error("Gagal mengambil data booking");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, [page, search]);

    const handleSearch = (value) => {
        setSearch(value);
        setPage(1);
    };

    const handleExport = async () => {
        setExporting(true);
        try {
            const response = await axiosInstance.get("/export/bookings", {
                params: {
                    search: search,
                },
                responseType: "blob",
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `laporan_booking_${new Date().toISOString().slice(0, 19).replace(/:/g, "-")}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

            toast.success("Export data berhasil");
        } catch (error) {
            console.error("Error exporting bookings:", error);
            toast.error("Gagal mengexport data");
        } finally {
            setExporting(false);
        }
    };

    const getStatusBadge = (status) => {
        const statusMap = {
            booked: { label: "Booked", color: "bg-blue-100 text-blue-700" },
            attended: { label: "Attended", color: "bg-green-100 text-green-700" },
            canceled: { label: "Canceled", color: "bg-red-100 text-red-700" },
        };
        const s = statusMap[status] || { label: status, color: "bg-gray-100 text-gray-700" };
        return <span className={`px-2 py-0.5 rounded-full text-xs ${s.color}`}>{s.label}</span>;
    };

    const getPaymentStatusBadge = (status) => {
        const statusMap = {
            paid: { label: "Paid", color: "bg-green-100 text-green-700" },
            pending: { label: "Pending", color: "bg-yellow-100 text-yellow-700" },
            failed: { label: "Failed", color: "bg-red-100 text-red-700" },
        };
        const s = statusMap[status] || { label: "-", color: "bg-gray-100 text-gray-700" };
        return <span className={`px-2 py-0.5 rounded-full text-xs ${s.color}`}>{s.label}</span>;
    };

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
            </div>);
    }

    return (
        <div>
            <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-athletica-blue-dark">Manajemen Booking</h1>
                    <p className="text-gray-500 text-sm">Lihat semua booking kelas dari semua user</p>
                </div>
                <button
                    onClick={handleExport}
                    disabled={exporting}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl transition disabled:opacity-50"
                >
                    <Download size={18} />
                    {exporting ? "Exporting..." : "Export Excel"}
                </button>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-md mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Cari booking berdasarkan nama user, kelas, atau trainer..."
                        value={search}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-athletica-blue-mid focus:ring-2 focus:ring-athletica-blue-light/50"
                    />
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-athletica-blue-light/20">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-athletica-blue-dark">#</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-athletica-blue-dark">User</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-athletica-blue-dark">Kelas</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-athletica-blue-dark">Trainer</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-athletica-blue-dark">Jadwal</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-athletica-blue-dark">Tipe</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-athletica-blue-dark">Status Booking</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-athletica-blue-dark">Status Payment</th>
                                <th className="px-4 py-3 text-center text-sm font-semibold text-athletica-blue-dark">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {bookings.length === 0 ? (
                                <tr>
                                    <td colSpan="9" className="text-center py-8 text-gray-400">
                                        Tidak ada data booking
                                    </td>
                                </tr>
                            ) : (
                                bookings.map((item, idx) => (
                                    <tr key={item.booking_id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 text-sm">
                                            {(pagination.current_page - 1) * 20 + idx + 1}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div>
                                                <p className="font-medium text-athletica-blue-dark">{item.user?.name}</p>
                                                <p className="text-xs text-gray-400">{item.user?.email}</p>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-sm">{item.schedule?.class?.class_name || "-"}</td>
                                        <td className="px-4 py-3 text-sm">{item.schedule?.trainer?.name || "-"}</td>
                                        <td className="px-4 py-3 text-sm">
                                            <div className="flex flex-col">
                                                <span>{new Date(item.schedule?.schedule_date).toLocaleDateString("id-ID")}</span>
                                                <span className="text-xs text-gray-400">{item.schedule?.start_time} - {item.schedule?.end_time}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-0.5 rounded-full text-xs ${item.booking_type === "membership"
                                                ? "bg-purple-100 text-purple-700"
                                                : "bg-orange-100 text-orange-700"
                                                }`}>
                                                {item.booking_type === "membership" ? "Membership" : "Regular"}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">{getStatusBadge(item.status)}</td>
                                        <td className="px-4 py-3">{getPaymentStatusBadge(item.payment?.status)}</td>
                                        <td className="px-4 py-3 text-center">
                                            <button
                                                onClick={() => { setSelectedBooking(item); setDetailModalOpen(true); }}
                                                className="p-1 text-athletica-blue-mid hover:bg-athletica-blue-light/20 rounded"
                                            >
                                                <Eye size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {pagination.last_page > 1 && (
                    <div className="flex justify-between items-center px-4 py-3 border-t">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={pagination.current_page === 1}
                            className="px-3 py-1 text-sm border rounded-lg disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <span className="text-sm">
                            Page {pagination.current_page} of {pagination.last_page} (Total: {pagination.total})
                        </span>
                        <button
                            onClick={() => setPage(p => Math.min(pagination.last_page, p + 1))}
                            disabled={pagination.current_page === pagination.last_page}
                            className="px-3 py-1 text-sm border rounded-lg disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>

            {detailModalOpen && selectedBooking && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center p-4 border-b">
                            <h2 className="font-bold text-athletica-blue-dark">Detail Booking</h2>
                            <button onClick={() => setDetailModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="p-4 space-y-3">
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <h3 className="font-semibold text-athletica-blue-dark mb-2 flex items-center gap-1">
                                    <User size={16} /> Informasi User
                                </h3>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <span className="text-gray-500">Nama:</span>
                                    <span className="font-medium">{selectedBooking.user?.name}</span>
                                    <span className="text-gray-500">Email:</span>
                                    <span>{selectedBooking.user?.email}</span>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-3 rounded-lg">
                                <h3 className="font-semibold text-athletica-blue-dark mb-2 flex items-center gap-1">
                                    <Dumbbell size={16} /> Informasi Kelas
                                </h3>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <span className="text-gray-500">Kelas:</span>
                                    <span className="font-medium">{selectedBooking.schedule?.class?.class_name}</span>
                                    <span className="text-gray-500">Trainer:</span>
                                    <span>{selectedBooking.schedule?.trainer?.name}</span>
                                    <span className="text-gray-500">Tanggal:</span>
                                    <span>{new Date(selectedBooking.schedule?.schedule_date).toLocaleDateString("id-ID")}</span>
                                    <span className="text-gray-500">Waktu:</span>
                                    <span>{selectedBooking.schedule?.start_time} - {selectedBooking.schedule?.end_time}</span>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-3 rounded-lg">
                                <h3 className="font-semibold text-athletica-blue-dark mb-2 flex items-center gap-1">
                                    <Calendar size={16} /> Informasi Booking
                                </h3>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <span className="text-gray-500">Tipe Booking:</span>
                                    <span className={selectedBooking.booking_type === "membership" ? "text-purple-600" : "text-orange-600"}>
                                        {selectedBooking.booking_type === "membership" ? "Membership" : "Regular"}
                                    </span>
                                    <span className="text-gray-500">Status Booking:</span>
                                    <span>{getStatusBadge(selectedBooking.status)}</span>
                                    <span className="text-gray-500">Tanggal Booking:</span>
                                    <span>{new Date(selectedBooking.created_at).toLocaleString("id-ID")}</span>
                                </div>
                            </div>

                            {selectedBooking.booking_type === "regular" && selectedBooking.payment && (
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <h3 className="font-semibold text-athletica-blue-dark mb-2 flex items-center gap-1">
                                        <CreditCard size={16} /> Informasi Pembayaran
                                    </h3>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <span className="text-gray-500">Total:</span>
                                        <span className="font-semibold">Rp {parseInt(selectedBooking.payment.amount || 0).toLocaleString()}</span>
                                        <span className="text-gray-500">Metode:</span>
                                        <span>{selectedBooking.payment.payment_method || "-"}</span>
                                        <span className="text-gray-500">Status:</span>
                                        <span>{getPaymentStatusBadge(selectedBooking.payment.status)}</span>
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
                        <div className="p-4 border-t">
                            <button
                                onClick={() => setDetailModalOpen(false)}
                                className="w-full p-2 bg-athletica-blue-dark text-white rounded-lg hover:bg-athletica-blue-mid"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Bookings;