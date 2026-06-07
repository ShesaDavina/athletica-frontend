/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { Calendar, Users, CheckCircle, Clock, Dumbbell, ArrowRight, Award } from "lucide-react";
import { toast } from "react-hot-toast";
import axiosInstance from "../../utils/axiosConfig";
import { DNA } from "react-loader-spinner";

export default function TrainerDashboard() {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchDashboardData = async () => {
        try {
            const response = await axiosInstance.get("/dashboard/trainer");
            setDashboardData(response.data.data);
        } catch (error) {
            console.error("Error fetching dashboard:", error);
            toast.error("Gagal mengambil data dashboard");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

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

    const stats = [
        {
            title: "Total Jadwal",
            value: dashboardData?.total_schedules || 0,
            icon: Calendar,
            bgGradient: "from-blue-500 to-blue-600",
        },
        {
            title: "Total Peserta",
            value: dashboardData?.total_participants || 0,
            icon: Users,
            bgGradient: "from-green-500 to-green-600",
        },
        {
            title: "Kehadiran",
            value: `${dashboardData?.attendance_rate || 0}%`,
            icon: CheckCircle,
            bgGradient: "from-purple-500 to-purple-600",
        },
        {
            title: "Kelas Diajar",
            value: dashboardData?.total_classes || 0,
            icon: Dumbbell,
            bgGradient: "from-orange-500 to-orange-600",
        },
    ];

    const upcomingSchedules = dashboardData?.upcoming_schedules || [];

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-athletica-blue-dark">Dashboard Trainer</h1>
                <p className="text-gray-500 mt-1">Selamat datang kembali! Berikut ringkasan aktivitas mengajar Anda.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`bg-linear-to-br ${stat.bgGradient} p-3 rounded-xl`}>
                                <stat.icon className="h-6 w-6 text-white" />
                            </div>
                        </div>
                        <p className="text-gray-500 text-sm">{stat.title}</p>
                        <p className="text-2xl font-bold text-athletica-blue-dark mt-1">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-8">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-athletica-blue-dark" />
                        <h2 className="text-lg font-semibold text-athletica-blue-dark">Jadwal Mendatang</h2>
                    </div>
                    <button className="text-athletica-blue-mid text-sm hover:text-athletica-blue-dark transition">
                        Lihat Semua
                    </button>
                </div>
                <div className="divide-y divide-gray-100">
                    {upcomingSchedules.length === 0 ? (
                        <div className="px-6 py-8 text-center text-gray-400">
                            Tidak ada jadwal mendatang
                        </div>
                    ) : (
                        upcomingSchedules.map((schedule) => (
                            <div key={schedule.schedule_id} className="px-6 py-4 hover:bg-gray-50 transition">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-athletica-blue-light/20 rounded-xl flex items-center justify-center">
                                            <Dumbbell className="h-6 w-6 text-athletica-blue-dark" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-athletica-blue-dark">{schedule.class?.class_name}</h3>
                                            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                                <Calendar className="h-3 w-3" />
                                                <span>{new Date(schedule.schedule_date).toLocaleDateString("id-ID", {
                                                    weekday: "long",
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric",
                                                })}</span>
                                                <Clock className="h-3 w-3 ml-2" />
                                                <span>{schedule.start_time} - {schedule.end_time}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                            {schedule.bookings_count || 0} / {schedule.class?.capacity} peserta
                                        </span>
                                        <button className="text-athletica-blue-mid hover:text-athletica-blue-dark transition">
                                            <ArrowRight className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-linear-to-br from-athletica-blue-dark to-athletica-blue-mid rounded-2xl p-6 text-white">
                    <div className="flex items-center gap-3 mb-4">
                        <Award className="h-8 w-8" />
                        <h3 className="text-xl font-semibold">Pencapaian Anda</h3>
                    </div>
                    <p className="text-white/80 mb-4">
                        Anda telah mengajar {dashboardData?.total_schedules || 0} jadwal dengan total
                        {dashboardData?.total_participants || 0} peserta.
                    </p>
                    <div className="flex items-center gap-2">
                        <div className="flex-1 bg-white/20 rounded-full h-2">
                            <div
                                className="bg-athletica-cream h-2 rounded-full"
                                style={{ width: `${Math.min(dashboardData?.attendance_rate || 0, 100)}%` }}
                            />
                        </div>
                        <span className="text-sm font-medium">{dashboardData?.attendance_rate || 0}% Kehadiran</span>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-md">
                    <div className="flex items-center gap-3 mb-4">
                        <Clock className="h-6 w-6 text-athletica-blue-dark" />
                        <h3 className="text-lg font-semibold text-athletica-blue-dark">Tips Mengajar</h3>
                    </div>
                    <ul className="space-y-3 text-gray-600 text-sm">
                        <li className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                            <span>Datang 15 menit sebelum kelas dimulai</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                            <span>Pastikan perlengkapan kelas sudah siap</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                            <span>Lakukan absensi peserta tepat waktu</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                            <span>Beri motivasi kepada peserta sebelum kelas dimulai</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};
