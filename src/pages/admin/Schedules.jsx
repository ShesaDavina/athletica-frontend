/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import {
    Search,
    ChevronLeft,
    ChevronRight,
    Calendar,
    Clock,
    User,
    Dumbbell,
} from "lucide-react";
import { toast } from "react-hot-toast";
import axiosInstance from "../../utils/axiosConfig";
import { DNA } from "react-loader-spinner";

const Schedules = () => {
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 10;

    const fetchData = async () => {
        try {
            const [schedulesRes] = await Promise.all([
                axiosInstance.get("/schedules"),
                axiosInstance.get("/trainers"),
            ]);
            setSchedules(schedulesRes.data.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching schedules:", error);
            toast.error("Gagal mengambil data jadwal");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filteredSchedules = schedules.filter((item) => {
        if (!searchTerm) return true;

        const searchLower = searchTerm.toLowerCase();
        return (
            item.class?.class_name?.toLowerCase().includes(searchLower) ||
            item.trainer?.name?.toLowerCase().includes(searchLower)
        );
    });

    const sortedSchedules = [...filteredSchedules].sort((a, b) =>
        new Date(b.schedule_date) - new Date(a.schedule_date)
    );

    const totalPages = Math.ceil(sortedSchedules.length / itemsPerPage);
    const paginatedSchedules = sortedSchedules.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

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
            <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-athletica-blue-dark">Manajemen Jadwal</h1>
                    <p className="text-gray-500 mt-1">Lihat semua jadwal kelas dari semua trainer</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-md mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Cari jadwal berdasarkan nama kelas atau trainer..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-athletica-blue-mid focus:ring-2 focus:ring-athletica-blue-light/50"
                    />
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-athletica-blue-light/20">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-athletica-blue-dark">#</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-athletica-blue-dark">Tanggal & Waktu</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-athletica-blue-dark">Kelas</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-athletica-blue-dark">Trainer</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-athletica-blue-dark">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {paginatedSchedules.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                        Tidak ada data jadwal
                                    </td>
                                </tr>
                            ) : (
                                paginatedSchedules.map((item, index) => {
                                    const isUpcoming = new Date(item.schedule_date) > new Date();
                                    return (
                                        <tr key={item.schedule_id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {(currentPage - 1) * itemsPerPage + index + 1}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div>
                                                    <div className="flex items-center gap-2 text-athletica-blue-dark">
                                                        <Calendar className="h-4 w-4" />
                                                        <span className="font-medium">
                                                            {new Date(item.schedule_date).toLocaleDateString("id-ID", {
                                                                weekday: "long",
                                                                year: "numeric",
                                                                month: "long",
                                                                day: "numeric",
                                                            })}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                                                        <Clock className="h-3 w-3" />
                                                        <span>{item.start_time} - {item.end_time}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <Dumbbell className="h-4 w-4 text-athletica-blue-mid" />
                                                    <span className="text-athletica-blue-dark">{item.class?.class_name || "-"}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <User className="h-4 w-4 text-athletica-blue-mid" />
                                                    <span>{item.trainer?.name || "-"}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${isUpcoming
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-gray-100 text-gray-500"
                                                    }`}>
                                                    {isUpcoming ? "Akan Datang" : "Selesai"}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
                        <button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="flex items-center gap-1 px-3 py-1 rounded-lg text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                        >
                            <ChevronLeft className="h-4 w-4" />
                            Previous
                        </button>
                        <span className="text-sm text-gray-500">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="flex items-center gap-1 px-3 py-1 rounded-lg text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
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

export default Schedules;