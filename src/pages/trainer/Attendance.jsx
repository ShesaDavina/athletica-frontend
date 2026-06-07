/* eslint-disable react-hooks/immutability */
/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import {
    Search,
    ChevronLeft,
    ChevronRight,
    Calendar,
    Clock,
    User,
    CheckCircle,
    XCircle,
    Filter,
} from "lucide-react";
import { toast } from "react-hot-toast";
import axiosInstance from "../../utils/axiosConfig";
import { DNA } from "react-loader-spinner";

const TrainerAttendance = () => {
    const [attendances, setAttendances] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [showFilter, setShowFilter] = useState(false);
    const [statusFilter, setStatusFilter] = useState("");
    const [scheduleFilter, setScheduleFilter] = useState("");
    const [schedules, setSchedules] = useState([]);

    const limit = 10;

    // Fetch all booking dari jadwal trainer
    const fetchAttendances = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get("/trainer/attendances", {
                params: {
                    page,
                    search,
                    status: statusFilter,
                    schedule_id: scheduleFilter,
                },
            });
            const data = response.data.data;
            setAttendances(data.data || []);
            setPagination({
                current_page: data.current_page,
                last_page: data.last_page,
                total: data.total,
            });
        } catch (error) {
            console.error("Error fetching attendances:", error);
            toast.error("Gagal mengambil data kehadiran");
        } finally {
            setLoading(false);
        }
    };

    // Fetch daftar jadwal trainer untuk filter
    const fetchSchedules = async () => {
        try {
            const response = await axiosInstance.get("/trainer/schedules?page=1&limit=100");
            const data = response.data.data;
            const schedulesList = data.data || [];
            setSchedules(schedulesList);
        } catch (error) {
            console.error("Error fetching schedules:", error);
        }
    };

    useEffect(() => {
        fetchSchedules();
    }, []);

    useEffect(() => {
        fetchAttendances();
    }, [page, search, statusFilter, scheduleFilter]);

    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        total: 0,
    });

    const handleSearch = (value) => {
        setSearch(value);
        setPage(1);
    };

    const resetFilters = () => {
        setStatusFilter("");
        setScheduleFilter("");
        setSearch("");
        setPage(1);
        setShowFilter(false);
    };

    const updateAttendance = async (bookingId, newStatus) => {
        try {
            await axiosInstance.put(`/trainer/attendance/${bookingId}`, { status: newStatus });
            toast.success(`Status kehadiran berhasil diubah menjadi ${newStatus === "attended" ? "Hadir" : "Batal"}`);
            fetchAttendances(); // refresh
        } catch (error) {
            console.error("Error updating attendance:", error);
            toast.error("Gagal mengubah status kehadiran");
        }
    };

    const getStatusBadge = (status) => {
        const statusMap = {
            booked: { label: "Booked", color: "bg-yellow-100 text-yellow-700" },
            attended: { label: "Attended", color: "bg-green-100 text-green-700" },
            canceled: { label: "Canceled", color: "bg-red-100 text-red-700" },
        };
        const s = statusMap[status] || { label: status, color: "bg-gray-100" };
        return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${s.color}`}>{s.label}</span>;
    };

    const getBookingTypeBadge = (type) => {
        if (type === "membership") {
            return <span className="px-2 py-0.5 rounded-full text-xs bg-purple-100 text-purple-700">Membership</span>;
        }
        return <span className="px-2 py-0.5 rounded-full text-xs bg-orange-100 text-orange-700">Regular</span>;
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
            {/* Header */}
            <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-athletica-blue-dark">Manajemen Kehadiran</h1>
                    <p className="text-gray-500 mt-1">Kelola kehadiran peserta untuk jadwal yang Anda ajar</p>
                </div>
                <button
                    onClick={() => setShowFilter(!showFilter)}
                    className="flex items-center gap-2 border border-gray-200 text-athletica-blue-dark px-4 py-2 rounded-xl hover:bg-gray-50 transition"
                >
                    <Filter className="h-5 w-5" />
                    Filter
                </button>
            </div>

            {/* Search Bar */}
            <div className="bg-white rounded-2xl p-4 shadow-md mb-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Cari berdasarkan nama peserta atau email..."
                        value={search}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-athletica-blue-mid"
                    />
                </div>
            </div>

            {/* Filter Panel */}
            {showFilter && (
                <div className="bg-white rounded-2xl p-4 shadow-md mb-6">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="font-semibold text-athletica-blue-dark">Filter Kehadiran</h3>
                        <button onClick={resetFilters} className="text-sm text-red-500 hover:text-red-600">
                            Reset Filter
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-athletica-blue-dark mb-1">Status Kehadiran</label>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-athletica-blue-mid"
                            >
                                <option value="">Semua</option>
                                <option value="booked">Booked (Belum Absen)</option>
                                <option value="attended">Hadir</option>
                                <option value="canceled">Batal</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-athletica-blue-dark mb-1">Pilih Jadwal</label>
                            <select
                                value={scheduleFilter}
                                onChange={(e) => setScheduleFilter(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-athletica-blue-mid"
                            >
                                <option value="">Semua Jadwal</option>
                                {schedules.map((schedule) => (
                                    <option key={schedule.schedule_id} value={schedule.schedule_id}>
                                        {schedule.class?.class_name} - {new Date(schedule.schedule_date).toLocaleDateString("id-ID")} ({schedule.start_time})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-athletica-blue-light/20">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-athletica-blue-dark">#</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-athletica-blue-dark">Peserta</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-athletica-blue-dark">Kelas & Jadwal</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-athletica-blue-dark">Tipe Booking</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-athletica-blue-dark">Status</th>
                                <th className="px-6 py-4 text-center text-sm font-semibold text-athletica-blue-dark">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {attendances.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                                        Tidak ada data kehadiran
                                    </td>
                                </tr>
                            ) : (
                                attendances.map((item, idx) => (
                                    <tr key={item.booking_id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {(pagination.current_page - 1) * limit + idx + 1}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-athletica-blue-light/20 flex items-center justify-center">
                                                    <User className="h-5 w-5 text-athletica-blue-dark" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-athletica-blue-dark">{item.user_name}</p>
                                                    <p className="text-xs text-gray-400">{item.user_email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-medium text-athletica-blue-dark">{item.class_name}</p>
                                                <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                                    <Calendar className="h-3 w-3" />
                                                    <span>{new Date(item.schedule_date).toLocaleDateString("id-ID")}</span>
                                                    <Clock className="h-3 w-3 ml-1" />
                                                    <span>{item.start_time} - {item.end_time}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {getBookingTypeBadge(item.booking_type)}
                                        </td>
                                        <td className="px-6 py-4">
                                            {getStatusBadge(item.status)}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                {item.status === "booked" && (
                                                    <>
                                                        <button
                                                            onClick={() => updateAttendance(item.booking_id, "attended")}
                                                            className="p-2 text-green-500 hover:bg-green-50 rounded-lg transition-colors"
                                                            title="Tandai Hadir"
                                                        >
                                                            <CheckCircle className="h-5 w-5" />
                                                        </button>
                                                        <button
                                                            onClick={() => updateAttendance(item.booking_id, "canceled")}
                                                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                            title="Batalkan"
                                                        >
                                                            <XCircle className="h-5 w-5" />
                                                        </button>
                                                    </>
                                                )}
                                                {item.status === "attended" && (
                                                    <span className="text-xs text-green-600">Sudah Hadir</span>
                                                )}
                                                {item.status === "canceled" && (
                                                    <span className="text-xs text-red-600">Dibatalkan</span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {pagination.last_page > 1 && (
                    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
                        <button
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={pagination.current_page === 1}
                            className="flex items-center gap-1 px-3 py-1 rounded-lg text-gray-500 disabled:opacity-50 hover:bg-gray-100"
                        >
                            <ChevronLeft className="h-4 w-4" />
                            Previous
                        </button>
                        <span className="text-sm text-gray-500">
                            Page {pagination.current_page} of {pagination.last_page} (Total: {pagination.total})
                        </span>
                        <button
                            onClick={() => setPage((p) => Math.min(pagination.last_page, p + 1))}
                            disabled={pagination.current_page === pagination.last_page}
                            className="flex items-center gap-1 px-3 py-1 rounded-lg text-gray-500 disabled:opacity-50 hover:bg-gray-100"
                        >
                            Next
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TrainerAttendance;