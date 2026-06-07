/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { Search, Eye, ChevronLeft, ChevronRight, CreditCard, Wallet, Filter, Download, X } from "lucide-react";
import { toast } from "react-hot-toast";
import axiosInstance from "../../utils/axiosConfig";
import { DNA } from "react-loader-spinner";

export default function Payments() {
    const [payments, setPayments] = useState([]);
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        total: 0,
    });
    const [loading, setLoading] = useState(true);
    const [exporting, setExporting] = useState(false);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState("");
    const [showFilter, setShowFilter] = useState(false);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [detailModalOpen, setDetailModalOpen] = useState(false);

    const fetchPayments = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get("/admin/payments", {
                params: {
                    page: page,
                    search: search,
                    status: statusFilter,
                    start_date: startDate,
                    end_date: endDate,
                },
            });

            const data = response.data?.data;
            setPayments(data?.data || []);
            setPagination({
                current_page: data?.current_page || 1,
                last_page: data?.last_page || 1,
                total: data?.total || 0,
            });
        } catch (error) {
            console.error("Error fetching payments:", error);
            toast.error("Gagal mengambil data payment");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPayments();
    }, [page, search, statusFilter, startDate, endDate]);

    const handleSearch = (value) => {
        setSearch(value);
        setPage(1);
    };

    const handleExport = async () => {
        setExporting(true);
        try {
            const response = await axiosInstance.get("/export/payments", {
                params: {
                    status: statusFilter,
                    start_date: startDate,
                    end_date: endDate,
                },
                responseType: "blob",
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `laporan_payment_${new Date().toISOString().slice(0, 19).replace(/:/g, "-")}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

            toast.success("Export data berhasil");
        } catch (error) {
            console.error("Error exporting payments:", error);
            toast.error("Gagal mengexport data");
        } finally {
            setExporting(false);
        }
    };

    const clearFilters = () => {
        setStatusFilter("");
        setStartDate("");
        setEndDate("");
        setSearch("");
        setPage(1);
    };

    const getStatusBadge = (status) => {
        const statusMap = {
            paid: { label: "Paid", color: "bg-green-100 text-green-700" },
            pending: { label: "Pending", color: "bg-yellow-100 text-yellow-700" },
            failed: { label: "Failed", color: "bg-red-100 text-red-700" },
        };
        const s = statusMap[status] || { label: status, color: "bg-gray-100 text-gray-700" };
        return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${s.color}`}>{s.label}</span>;
    };

    const getTypeBadge = (type) => {
        if (type === "booking") {
            return <span className="px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-700">Booking Kelas</span>;
        }
        return <span className="px-2 py-0.5 rounded-full text-xs bg-purple-100 text-purple-700">Beli Membership</span>;
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
            </div>
        );
    }

    return (
        <div>
            <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-athletica-blue-dark">Manajemen Pembayaran</h1>
                    <p className="text-gray-500 text-sm">Lihat semua transaksi pembayaran (booking & membership)</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setShowFilter(!showFilter)}
                        className="flex items-center gap-2 border border-gray-200 text-athletica-blue-dark px-4 py-2 rounded-xl hover:bg-gray-50 transition"
                    >
                        <Filter size={18} />
                        Filter
                    </button>
                    <button
                        onClick={handleExport}
                        disabled={exporting}
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl transition disabled:opacity-50"
                    >
                        <Download size={18} />
                        {exporting ? "Exporting..." : "Export Excel"}
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl p-3 shadow-sm mb-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Cari berdasarkan nama user atau email..."
                        value={search}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-athletica-blue-mid focus:ring-2 focus:ring-athletica-blue-light/50"
                    />
                </div>
            </div>

            {showFilter && (
                <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="font-semibold text-athletica-blue-dark">Filter Data</h3>
                        <button
                            onClick={clearFilters}
                            className="text-sm text-athletica-blue-mid hover:text-athletica-blue-dark"
                        >
                            Clear Filters
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-athletica-blue-dark mb-1">
                                Status Pembayaran
                            </label>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:border-athletica-blue-mid"
                            >
                                <option value="">Semua</option>
                                <option value="paid">Paid</option>
                                <option value="pending">Pending</option>
                                <option value="failed">Failed</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-athletica-blue-dark mb-1">
                                Dari Tanggal
                            </label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:border-athletica-blue-mid"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-athletica-blue-dark mb-1">
                                Sampai Tanggal
                            </label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:border-athletica-blue-mid"
                            />
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-athletica-blue-light/20">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-semibold">#</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold">User</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold">Tipe</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold">Item</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold">Amount</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold">Metode</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold">Tanggal</th>
                                <th className="px-4 py-3 text-center text-sm font-semibold">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y  divide-gray-100">
                            {payments.length === 0 ? (
                                <tr>
                                    <td colSpan="9" className="text-center py-8 text-gray-400">
                                        Tidak ada data pembayaran
                                    </td>
                                </tr>
                            ) : (
                                payments.map((item, idx) => (
                                    <tr key={item.payment_id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 text-sm">
                                            {(pagination.current_page - 1) * 20 + idx + 1}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div>
                                                <p className="font-medium text-athletica-blue-dark">{item.user_name}</p>
                                                <p className="text-xs text-gray-400">{item.user_email}</p>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">{getTypeBadge(item.type)}</td>
                                        <td className="px-4 py-3 text-sm">{item.item_name || "-"}</td>
                                        <td className="px-4 py-3 text-sm font-semibold text-athletica-blue-dark">
                                            Rp {parseInt(item.amount).toLocaleString()}
                                        </td>
                                        <td className="px-4 py-3 text-sm capitalize">{item.payment_method || "-"}</td>
                                        <td className="px-4 py-3">{getStatusBadge(item.status)}</td>
                                        <td className="px-4 py-3 text-sm">
                                            {item.payment_date
                                                ? new Date(item.payment_date).toLocaleString("id-ID")
                                                : new Date(item.created_at).toLocaleString("id-ID")}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <button
                                                onClick={() => { setSelectedPayment(item); setDetailModalOpen(true); }}
                                                className="p-1 text-athletica-blue-mid hover:bg-athletica-blue-light/20 rounded transition"
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
                            className="px-3 py-1 text-sm border rounded-lg disabled:opacity-50 flex items-center gap-1"
                        >
                            <ChevronLeft size={16} />
                            Previous
                        </button>
                        <span className="text-sm">
                            Page {pagination.current_page} of {pagination.last_page} (Total: {pagination.total})
                        </span>
                        <button
                            onClick={() => setPage(p => Math.min(pagination.last_page, p + 1))}
                            disabled={pagination.current_page === pagination.last_page}
                            className="px-3 py-1 text-sm border rounded-lg disabled:opacity-50 flex items-center gap-1"
                        >
                            Next
                            <ChevronRight size={16} />
                        </button>
                    </div>
                )}
            </div>

            {detailModalOpen && selectedPayment && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center p-4 border-b">
                            <h2 className="font-bold text-athletica-blue-dark flex items-center gap-2">
                                <CreditCard size={20} />
                                Detail Pembayaran
                            </h2>
                            <button onClick={() => setDetailModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-4 space-y-3">
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <h3 className="font-semibold text-athletica-blue-dark mb-2 flex items-center gap-1">
                                    <Wallet size={16} /> Informasi User
                                </h3>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <span className="text-gray-500">Nama:</span>
                                    <span className="font-medium">{selectedPayment.user_name}</span>
                                    <span className="text-gray-500">Email:</span>
                                    <span>{selectedPayment.user_email}</span>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-3 rounded-lg">
                                <h3 className="font-semibold text-athletica-blue-dark mb-2">Informasi Transaksi</h3>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <span className="text-gray-500">Payment ID:</span>
                                    <span className="font-mono">#{selectedPayment.payment_id}</span>
                                    <span className="text-gray-500">Tipe:</span>
                                    <span>{getTypeBadge(selectedPayment.type)}</span>
                                    <span className="text-gray-500">Item:</span>
                                    <span>{selectedPayment.item_name || "-"}</span>
                                    <span className="text-gray-500">Amount:</span>
                                    <span className="font-semibold text-athletica-blue-dark">
                                        Rp {parseInt(selectedPayment.amount).toLocaleString()}
                                    </span>
                                    <span className="text-gray-500">Metode:</span>
                                    <span className="capitalize">{selectedPayment.payment_method || "-"}</span>
                                    <span className="text-gray-500">Status:</span>
                                    <span>{getStatusBadge(selectedPayment.status)}</span>
                                    <span className="text-gray-500">Tanggal:</span>
                                    <span>{new Date(selectedPayment.created_at).toLocaleString("id-ID")}</span>
                                    {selectedPayment.payment_date && (
                                        <>
                                            <span className="text-gray-500">Tanggal Bayar:</span>
                                            <span>{new Date(selectedPayment.payment_date).toLocaleString("id-ID")}</span>
                                        </>
                                    )}
                                </div>
                            </div>
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
