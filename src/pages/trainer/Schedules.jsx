/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import {
    Plus,
    Search,
    Edit,
    Trash2,
    ChevronLeft,
    ChevronRight,
    Calendar,
    Users,
    X,
    Eye,
} from "lucide-react";
import { toast } from "react-hot-toast";
import axiosInstance from "../../utils/axiosConfig";
import { DNA } from "react-loader-spinner";

const TrainerSchedules = () => {
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isParticipantsModalOpen, setIsParticipantsModalOpen] = useState(false);
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [participants, setParticipants] = useState([]);
    const [classesList, setClassesList] = useState([]);
    const [formData, setFormData] = useState({
        class_id: "",
        schedule_date: "",
        start_time: "",
        end_time: "",
    });

    const itemsPerPage = 10;

    // Fetch schedules
    const fetchSchedules = async () => {
        try {
            const response = await axiosInstance.get("/trainer/schedules");
            // Response mungkin berbentuk { data: { data: [...] } } atau langsung { data: [...] }
            const schedulesData = response.data.data.data || response.data.data || [];
            setSchedules(schedulesData);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching schedules:", error);
            toast.error("Gagal mengambil data jadwal");
            setLoading(false);
        }
    };

    // Fetch classes for dropdown
    const fetchClasses = async () => {
        try {
            const response = await axiosInstance.get("/classes");
            setClassesList(response.data.data);
        } catch (error) {
            console.error("Error fetching classes:", error);
        }
    };

    useEffect(() => {
        fetchSchedules();
        fetchClasses();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const refreshData = async () => {
        await fetchSchedules();
    };

    const openModal = (schedule = null) => {
        if (schedule) {
            setSelectedSchedule(schedule);
            setFormData({
                class_id: schedule.class_id,
                schedule_date: schedule.schedule_date,
                start_time: schedule.start_time,
                end_time: schedule.end_time,
            });
        } else {
            setSelectedSchedule(null);
            setFormData({
                class_id: "",
                schedule_date: "",
                start_time: "",
                end_time: "",
            });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedSchedule(null);
        setFormData({
            class_id: "",
            schedule_date: "",
            start_time: "",
            end_time: "",
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (selectedSchedule) {
                await axiosInstance.put(`/trainer/schedules/${selectedSchedule.schedule_id}`, formData);
                toast.success("Jadwal berhasil diupdate");
            } else {
                await axiosInstance.post("/trainer/schedules", formData);
                toast.success("Jadwal berhasil ditambahkan");
            }
            await refreshData();
            closeModal();
        } catch (error) {
            console.error("Error saving schedule:", error);
            toast.error(error.response?.data?.message || "Gagal menyimpan jadwal");
        }
    };

    const openDeleteModal = (schedule) => {
        setSelectedSchedule(schedule);
        setIsDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        try {
            await axiosInstance.delete(`/trainer/schedules/${selectedSchedule.schedule_id}`);
            toast.success("Jadwal berhasil dihapus");
            await refreshData();
            setIsDeleteModalOpen(false);
            setSelectedSchedule(null);
        } catch (error) {
            console.error("Error deleting schedule:", error);
            toast.error(error.response?.data?.message || "Gagal menghapus jadwal");
        }
    };

    const openParticipantsModal = async (schedule) => {
        setSelectedSchedule(schedule);
        try {
            const response = await axiosInstance.get(`/trainer/schedules/${schedule.schedule_id}/participants`);
            setParticipants(response.data.data.participants || []);
            setIsParticipantsModalOpen(true);
        } catch (error) {
            console.error("Error fetching participants:", error);
            toast.error("Gagal mengambil data peserta");
        }
    };

    // Filter schedules
    const filteredSchedules = schedules.filter((item) =>
        item.class?.class_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredSchedules.length / itemsPerPage);
    const paginatedSchedules = filteredSchedules.slice(
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
            {/* Header */}
            <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-athletica-blue-dark">Jadwal Saya</h1>
                    <p className="text-gray-500 mt-1">Kelola jadwal kelas yang Anda ajar</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="flex items-center gap-2 bg-athletica-blue-dark hover:bg-athletica-blue-mid text-white font-semibold px-4 py-2 rounded-xl transition-all duration-200"
                >
                    <Plus className="h-5 w-5" />
                    Tambah Jadwal
                </button>
            </div>

            {/* Search */}
            <div className="bg-white rounded-2xl p-4 shadow-md mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Cari jadwal berdasarkan nama kelas..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-athletica-blue-mid focus:ring-2 focus:ring-athletica-blue-light/50"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-athletica-blue-light/20">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-athletica-blue-dark">#</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-athletica-blue-dark">Kelas</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-athletica-blue-dark">Tanggal</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-athletica-blue-dark">Jam</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-athletica-blue-dark">Peserta</th>
                                <th className="px-6 py-4 text-center text-sm font-semibold text-athletica-blue-dark">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {paginatedSchedules.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                                        Tidak ada data jadwal
                                    </td>
                                </tr>
                            ) : (
                                paginatedSchedules.map((item, index) => (
                                    <tr key={item.schedule_id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {(currentPage - 1) * itemsPerPage + index + 1}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-athletica-blue-light/20 flex items-center justify-center">
                                                    <Calendar className="h-5 w-5 text-athletica-blue-dark" />
                                                </div>
                                                <span className="font-medium text-athletica-blue-dark">
                                                    {item.class?.class_name || "-"}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(item.schedule_date).toLocaleDateString("id-ID", {
                                                day: "numeric",
                                                month: "long",
                                                year: "numeric",
                                            })}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {item.start_time} - {item.end_time}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <div className="flex items-center gap-1">
                                                <Users className="h-4 w-4 text-athletica-blue-mid" />
                                                <span className="font-medium text-athletica-blue-dark">
                                                    {item.bookings_count || 0} / {item.class?.capacity}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => openParticipantsModal(item)}
                                                    className="p-2 text-green-500 hover:bg-green-50 rounded-lg transition-colors"
                                                    title="Lihat Peserta"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => openModal(item)}
                                                    className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => openDeleteModal(item)}
                                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Hapus"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
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

            {/* Modal Form Tambah/Edit Jadwal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <h2 className="text-xl font-bold text-athletica-blue-dark">
                                {selectedSchedule ? "Edit Jadwal" : "Tambah Jadwal Baru"}
                            </h2>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-athletica-blue-dark mb-1">
                                    Pilih Kelas *
                                </label>
                                <select
                                    name="class_id"
                                    value={formData.class_id}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-athletica-blue-mid"
                                >
                                    <option value="">-- Pilih Kelas --</option>
                                    {classesList.map((cls) => (
                                        <option key={cls.class_id} value={cls.class_id}>
                                            {cls.class_name} (Kapasitas: {cls.capacity})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-athletica-blue-dark mb-1">
                                    Tanggal *
                                </label>
                                <input
                                    type="date"
                                    name="schedule_date"
                                    value={formData.schedule_date}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-athletica-blue-mid"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-athletica-blue-dark mb-1">
                                        Jam Mulai *
                                    </label>
                                    <input
                                        type="time"
                                        name="start_time"
                                        value={formData.start_time}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-athletica-blue-mid"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-athletica-blue-dark mb-1">
                                        Jam Selesai *
                                    </label>
                                    <input
                                        type="time"
                                        name="end_time"
                                        value={formData.end_time}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-athletica-blue-mid"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-athletica-blue-dark text-white rounded-xl hover:bg-athletica-blue-mid"
                                >
                                    {selectedSchedule ? "Update" : "Simpan"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Delete Confirmation */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md">
                        <div className="p-6 text-center">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Trash2 className="h-8 w-8 text-red-500" />
                            </div>
                            <h2 className="text-xl font-bold text-athletica-blue-dark mb-2">
                                Hapus Jadwal
                            </h2>
                            <p className="text-gray-500 mb-6">
                                Apakah Anda yakin ingin menghapus jadwal untuk kelas "{selectedSchedule?.class?.class_name}" pada tanggal{" "}
                                {selectedSchedule && new Date(selectedSchedule.schedule_date).toLocaleDateString("id-ID")}?
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setIsDeleteModalOpen(false)}
                                    className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="flex-1 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600"
                                >
                                    Hapus
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Peserta */}
            {isParticipantsModalOpen && selectedSchedule && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <h2 className="text-xl font-bold text-athletica-blue-dark">
                                Daftar Peserta - {selectedSchedule.class?.class_name}
                            </h2>
                            <button
                                onClick={() => setIsParticipantsModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="mb-4 flex justify-between items-center">
                                <div className="text-sm text-gray-500">
                                    Tanggal: {new Date(selectedSchedule.schedule_date).toLocaleDateString("id-ID")} | Jam: {selectedSchedule.start_time} - {selectedSchedule.end_time}
                                </div>
                                <div className="text-sm font-medium text-athletica-blue-dark">
                                    Total Peserta: {participants.length} / {selectedSchedule.class?.capacity}
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-athletica-blue-light/20">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-athletica-blue-dark">#</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-athletica-blue-dark">Nama</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-athletica-blue-dark">Email</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-athletica-blue-dark">Tipe Booking</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-athletica-blue-dark">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {participants.length === 0 ? (
                                            <tr>
                                                <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                                                    Belum ada peserta yang booking
                                                </td>
                                            </tr>
                                        ) : (
                                            participants.map((participant, idx) => (
                                                <tr key={participant.booking_id} className="hover:bg-gray-50">
                                                    <td className="px-4 py-3 text-sm text-gray-500">{idx + 1}</td>
                                                    <td className="px-4 py-3 font-medium text-athletica-blue-dark">
                                                        {participant.user_name}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-gray-500">{participant.user_email}</td>
                                                    <td className="px-4 py-3">
                                                        <span className={`px-2 py-0.5 rounded-full text-xs ${participant.booking_type === "membership"
                                                            ? "bg-purple-100 text-purple-700"
                                                            : "bg-orange-100 text-orange-700"
                                                            }`}>
                                                            {participant.booking_type === "membership" ? "Membership" : "Regular"}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <span className={`px-2 py-0.5 rounded-full text-xs ${participant.status === "attended"
                                                            ? "bg-green-100 text-green-700"
                                                            : participant.status === "canceled"
                                                                ? "bg-red-100 text-red-700"
                                                                : "bg-yellow-100 text-yellow-700"
                                                            }`}>
                                                            {participant.status === "attended"
                                                                ? "Attended"
                                                                : participant.status === "canceled"
                                                                    ? "Batal"
                                                                    : "Booked"}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="p-6 border-t border-gray-100">
                            <button
                                onClick={() => setIsParticipantsModalOpen(false)}
                                className="w-full px-4 py-2 bg-athletica-blue-dark text-white rounded-xl hover:bg-athletica-blue-mid"
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

export default TrainerSchedules;