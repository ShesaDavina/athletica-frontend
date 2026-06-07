import { useState } from "react";
import { Download, Calendar, Users, FileText, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import axiosInstance from "../../utils/axiosConfig";

export default function TrainerExport() {
    const [exportingSchedule, setExportingSchedule] = useState(false);
    const [exportingAttendance, setExportingAttendance] = useState(false);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const handleExportSchedule = async () => {
        setExportingSchedule(true);
        try {
            const response = await axiosInstance.get("/trainer/export/schedules", {
                params: {
                    start_date: startDate,
                    end_date: endDate,
                },
                responseType: "blob",
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute(
                "download",
                `jadwal_trainer_${new Date().toISOString().slice(0, 19).replace(/:/g, "-")}.xlsx`
            );
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

            toast.success("Export jadwal berhasil");
        } catch (error) {
            console.error("Error exporting schedule:", error);
            toast.error("Gagal mengexport jadwal");
        } finally {
            setExportingSchedule(false);
        }
    };

    const handleExportAttendance = async () => {
        setExportingAttendance(true);
        try {
            const response = await axiosInstance.get("/trainer/export/attendances", {
                params: {
                    start_date: startDate,
                    end_date: endDate,
                },
                responseType: "blob",
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute(
                "download",
                `kehadiran_trainer_${new Date().toISOString().slice(0, 19).replace(/:/g, "-")}.xlsx`
            );
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

            toast.success("Export kehadiran berhasil");
        } catch (error) {
            console.error("Error exporting attendance:", error);
            toast.error("Gagal mengexport kehadiran");
        } finally {
            setExportingAttendance(false);
        }
    };

    const resetDateFilter = () => {
        setStartDate("");
        setEndDate("");
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-athletica-blue-dark">Export Data</h1>
                <p className="text-gray-500 mt-1">Export jadwal dan kehadiran dalam format Excel</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Card Export Jadwal */}
                <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-athletica-blue-light/20 rounded-xl">
                                <Calendar className="h-6 w-6 text-athletica-blue-dark" />
                            </div>
                            <h2 className="text-xl font-bold text-athletica-blue-dark">Export Jadwal</h2>
                        </div>
                        <p className="text-gray-500 text-sm mt-1">
                            Export data jadwal kelas yang Anda ajar dalam rentang tanggal tertentu.
                        </p>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-athletica-blue-dark mb-1">
                                    Dari Tanggal
                                </label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-athletica-blue-mid"
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
                                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-athletica-blue-mid"
                                />
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={resetDateFilter}
                                className="px-4 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition"
                            >
                                Reset Tanggal
                            </button>
                            <button
                                onClick={handleExportSchedule}
                                disabled={exportingSchedule}
                                className="flex-1 flex items-center justify-center gap-2 bg-athletica-blue-dark hover:bg-athletica-blue-mid text-white font-semibold px-4 py-2 rounded-xl transition disabled:opacity-50"
                            >
                                {exportingSchedule ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    <Download className="h-5 w-5" />
                                )}
                                {exportingSchedule ? "Exporting..." : "Export Jadwal"}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-athletica-blue-light/20 rounded-xl">
                                <Users className="h-6 w-6 text-athletica-blue-dark" />
                            </div>
                            <h2 className="text-xl font-bold text-athletica-blue-dark">Export Kehadiran</h2>
                        </div>
                        <p className="text-gray-500 text-sm mt-1">
                            Export data kehadiran peserta dari jadwal yang Anda ajar.
                        </p>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-athletica-blue-dark mb-1">
                                    Dari Tanggal (Opsional)
                                </label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-athletica-blue-mid"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-athletica-blue-dark mb-1">
                                    Sampai Tanggal (Opsional)
                                </label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-athletica-blue-mid"
                                />
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={resetDateFilter}
                                className="px-4 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition"
                            >
                                Reset Tanggal
                            </button>
                            <button
                                onClick={handleExportAttendance}
                                disabled={exportingAttendance}
                                className="flex-1 flex items-center justify-center gap-2 bg-athletica-blue-dark hover:bg-athletica-blue-mid text-white font-semibold px-4 py-2 rounded-xl transition disabled:opacity-50"
                            >
                                {exportingAttendance ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    <FileText className="h-5 w-5" />
                                )}
                                {exportingAttendance ? "Exporting..." : "Export Kehadiran"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 bg-athletica-blue-light/10 rounded-2xl p-4">
                <p className="text-sm text-athletica-blue-dark">
                    ⚡ <span className="font-semibold">Catatan:</span> Export akan menghasilkan file Excel (.xlsx). Data yang diexport akan menyesuaikan dengan rentang tanggal yang dipilih (jika diisi).
                </p>
            </div>
        </div>
    );
};
