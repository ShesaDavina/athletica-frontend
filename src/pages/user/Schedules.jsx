/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import {
    Calendar,
    Clock,
    Dumbbell,
    User,
    CreditCard,
    X,
    Search,
    Users,
    ChevronRight,
    Crown,
    CheckCircle,
} from "lucide-react";
import { toast } from "react-hot-toast";
import axiosInstance from "../../utils/axiosConfig";
import { DNA } from "react-loader-spinner";

const UserSchedules = () => {
    const [classes, setClasses] = useState([]);
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selectedClass, setSelectedClass] = useState(null);
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
    const [bookingType, setBookingType] = useState("regular");
    const [userMembership, setUserMembership] = useState(null);
    const [processing, setProcessing] = useState(false);

    const fetchData = async () => {
        try {
            const [schedulesRes, classesRes] = await Promise.all([
                axiosInstance.get("/schedules"),
                axiosInstance.get("/classes"),
            ]);
            setSchedules(schedulesRes.data.data);
            setClasses(classesRes.data.data);
        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error("Gagal mengambil data");
        } finally {
            setLoading(false);
        }
    };

    const fetchUserMembership = async () => {
        try {
            const res = await axiosInstance.get("/user/membership");
            setUserMembership(res.data.data);
        } catch (error) {
            console.error("Error fetching memberships:", error);
            toast.error("Gagal mengambil data");
        }
    };

    useEffect(() => {
        fetchData();
        fetchUserMembership();
    }, []);

    const handleBooking = async () => {
        if (!selectedSchedule) return;
        setProcessing(true);
        try {
            const res = await axiosInstance.post("/bookings", {
                schedule_id: selectedSchedule.schedule_id,
                booking_type: bookingType,
            });
            if (res.data.success) {
                toast.success(res.data.message);
                if (res.data.data?.payment_url) window.open(res.data.data.payment_url, "_blank");
                setModalOpen(false);
                setScheduleModalOpen(false);
                setSelectedClass(null);
                setSelectedSchedule(null);
                fetchData();
                fetchUserMembership();
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Gagal booking");
        } finally {
            setProcessing(false);
        }
    };

    const openClassSchedules = (cls) => {
        setSelectedClass(cls);
        setScheduleModalOpen(true);
    };

    const openBookingModal = (schedule) => {
        setSelectedSchedule(schedule);
        setBookingType("regular");
        setModalOpen(true);
        setScheduleModalOpen(false);
    };

    const filteredClasses = classes.filter((c) =>
        c.class_name.toLowerCase().includes(search.toLowerCase())
    );
    const classSchedules = schedules.filter(
        (s) => s.class_id === selectedClass?.class_id
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
        <div className="space-y-8">
            {/* Header */}
            <div className="relative">
                <div className="absolute inset-0 bg-linear-to-r from-athletica-blue-dark/5 to-athletica-blue-light/10 rounded-2xl blur-xl -z-10" />
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-athletica-blue-dark to-athletica-blue-mid bg-clip-text text-transparent">
                            Pilih Kelas Favorit
                        </h1>
                        <p className="text-gray-500 mt-1">Temukan kelas yang sesuai dengan gaya hidupmu</p>
                    </div>
                    {userMembership && (
                        <div className="flex items-center gap-2 bg-linear-to-r from-amber-50 to-amber-100/50 rounded-xl px-4 py-2 border border-amber-200">
                            <Crown className="h-5 w-5 text-amber-600" />
                            <span className="text-sm font-medium text-amber-800">
                                Membership {userMembership.membership?.name} aktif
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-athletica-blue-mid h-5 w-5" />
                <input
                    type="text"
                    placeholder="Cari kelas..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-athletica-blue-light transition"
                />
            </div>

            {/* Grid Kelas dengan Gambar */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
                {filteredClasses.map((cls) => (
                    <div
                        key={cls.class_id}
                        onClick={() => openClassSchedules(cls)}
                        className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                    >
                        <div className="h-48 overflow-hidden bg-linear-to-br from-athletica-blue-light/30 to-athletica-blue-mid/20 relative">
                            {cls.image_url ? (
                                <img
                                    src={cls.image_url}
                                    alt={cls.class_name}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        const iconDiv = e.target.nextElementSibling;
                                        if (iconDiv) iconDiv.style.display = 'flex';
                                    }}
                                />
                            ) : null}
                            <div className={`absolute inset-0 flex items-center justify-center ${cls.image_url ? 'hidden' : ''}`}>
                                <Dumbbell className="h-16 w-16 text-athletica-blue-dark/30" />
                            </div>
                        </div>
                        <div className="p-5">
                            <h3 className="text-xl font-bold text-athletica-blue-dark mb-2 group-hover:text-athletica-blue-mid">
                                {cls.class_name}
                            </h3>
                            <p className="text-gray-500 text-sm mb-3 line-clamp-2">{cls.description || "Tidak ada deskripsi"}</p>
                            <div className="flex justify-between items-center mt-4">
                                <div>
                                    <span className="text-xs text-gray-400">Mulai dari</span>
                                    <p className="text-lg font-bold text-athletica-blue-dark">
                                        Rp {parseInt(cls.price).toLocaleString()}
                                    </p>
                                </div>
                                <button className="flex items-center gap-1 text-athletica-blue-mid font-medium text-sm group-hover:gap-2 transition-all">
                                    Lihat Jadwal <ChevronRight className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal Daftar Jadwal */}
            {scheduleModalOpen && selectedClass && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                    onClick={() => setScheduleModalOpen(false)}
                >
                    <div
                        className="bg-white rounded-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-300 p-5 flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-bold text-athletica-blue-dark">{selectedClass.class_name}</h2>
                                <p className="text-gray-500 text-sm">Pilih jadwal yang tersedia</p>
                            </div>
                            <button
                                onClick={() => setScheduleModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        <div className="p-6 space-y-4 overflow-y-auto max-h-[calc(85vh-90px)]">
                            {classSchedules.length === 0 ? (
                                <div className="text-center py-12 text-gray-400">
                                    <Calendar className="h-12 w-12 mx-auto mb-3 opacity-30" />
                                    <p>Belum ada jadwal untuk kelas ini</p>
                                </div>
                            ) : (
                                classSchedules.map((schedule) => {
                                    const bookedCount = schedule.bookings_count || 0;
                                    const capacity = selectedClass.capacity;
                                    const isFull = bookedCount >= capacity;
                                    return (
                                        <div
                                            key={schedule.schedule_id}
                                            className={`border border-gray-300 rounded-xl p-5 transition-all hover:shadow-md ${isFull ? "opacity-70 bg-gray-50" : "hover:border-athletica-blue-light"
                                                }`}
                                        >
                                            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-3 text-gray-600">
                                                        <Calendar size={18} className="text-athletica-blue-mid" />
                                                        <span className="font-medium">
                                                            {new Date(schedule.schedule_date).toLocaleDateString("id-ID", {
                                                                weekday: "long",
                                                                day: "numeric",
                                                                month: "long",
                                                                year: "numeric",
                                                            })}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-3 text-gray-600">
                                                        <Clock size={18} className="text-athletica-blue-mid" />
                                                        <span>
                                                            {schedule.start_time} - {schedule.end_time}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-3 text-gray-600">
                                                        <User size={18} className="text-athletica-blue-mid" />
                                                        <span>Trainer: {schedule.trainer?.name}</span>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <Users size={18} className="text-athletica-blue-mid" />
                                                        <div className="flex-1">
                                                            <div className="flex justify-between text-sm mb-1">
                                                                <span className={isFull ? "text-red-500 font-semibold" : "text-green-600"}>
                                                                    {bookedCount} / {capacity} terisi
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => openBookingModal(schedule)}
                                                    disabled={isFull}
                                                    className={`px-6 py-2.5 rounded-xl font-semibold transition-all ${isFull
                                                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                                        : "bg-linear-to-r from-athletica-blue-dark to-athletica-blue-mid text-white hover:shadow-md hover:-translate-y-0.5"
                                                        }`}
                                                >
                                                    {isFull ? "Kelas Penuh" : "Booking Sekarang"}
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Booking - Desain Modern */}
            {modalOpen && selectedSchedule && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                    onClick={() => setModalOpen(false)}
                >
                    <div
                        className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="bg-linear-to-r from-athletica-blue-dark to-athletica-blue-mid px-6 py-4 text-white">
                            <h2 className="text-xl font-bold">Booking Kelas</h2>
                            <p className="text-white/80 text-sm">{selectedSchedule.class?.class_name}</p>
                        </div>
                        <div className="p-6 space-y-5">
                            {/* Detail */}
                            <div className="bg-athletica-blue-light/10 rounded-xl p-4 space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Tanggal</span>
                                    <span className="font-medium">
                                        {new Date(selectedSchedule.schedule_date).toLocaleDateString("id-ID", {
                                            weekday: "long",
                                            day: "numeric",
                                            month: "long",
                                        })}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Waktu</span>
                                    <span className="font-medium">
                                        {selectedSchedule.start_time} - {selectedSchedule.end_time}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Trainer</span>
                                    <span className="font-medium">{selectedSchedule.trainer?.name}</span>
                                </div>
                                <div className="border-t border-athletica-blue-light/30 my-2" />
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Harga Reguler</span>
                                    <span className="font-bold text-athletica-blue-dark">
                                        Rp {parseInt(selectedSchedule.class?.price).toLocaleString()}
                                    </span>
                                </div>
                            </div>

                            {/* Pilihan Metode */}
                            <div>
                                <label className="block text-sm font-semibold mb-2 text-athletica-blue-dark">Pilih Metode</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => setBookingType("regular")}
                                        className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all ${bookingType === "regular"
                                            ? "border-athletica-blue-dark bg-athletica-blue-light/10 shadow-md"
                                            : "border-gray-200 hover:border-athletica-blue-light"
                                            }`}
                                    >
                                        <CreditCard className={`h-5 w-5 ${bookingType === "regular" ? "text-athletica-blue-dark" : "text-gray-400"}`} />
                                        <span className={`text-sm font-medium ${bookingType === "regular" ? "text-athletica-blue-dark" : "text-gray-600"}`}>
                                            Reguler
                                        </span>
                                        <span className="text-xs text-gray-400">Bayar per kelas</span>
                                    </button>
                                    <button
                                        onClick={() => setBookingType("membership")}
                                        disabled={!userMembership || (userMembership.remaining_class !== null && userMembership.remaining_class <= 0)}
                                        className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all ${bookingType === "membership"
                                            ? "border-purple-500 bg-purple-50 shadow-md"
                                            : "border-gray-200 hover:border-purple-200"
                                            } ${!userMembership || (userMembership.remaining_class !== null && userMembership.remaining_class <= 0)
                                                ? "opacity-50 cursor-not-allowed"
                                                : ""
                                            }`}
                                    >
                                        <Crown className={`h-5 w-5 ${bookingType === "membership" ? "text-purple-600" : "text-gray-400"}`} />
                                        <span className={`text-sm font-medium ${bookingType === "membership" ? "text-purple-700" : "text-gray-600"}`}>
                                            Membership
                                        </span>
                                        <span className="text-xs text-gray-400">
                                            {userMembership && userMembership.remaining_class !== null
                                                ? `Sisa ${userMembership.remaining_class} kelas`
                                                : userMembership
                                                    ? "Unlimited"
                                                    : "Tidak aktif"}
                                        </span>
                                    </button>
                                </div>
                            </div>

                            {/* Info */}
                            {bookingType === "membership" && userMembership && (
                                <div className="bg-purple-50 rounded-lg p-3 flex items-start gap-2 text-sm text-purple-800">
                                    <CheckCircle className="h-4 w-4 mt-0.5" />
                                    <span>Booking menggunakan membership: tidak ada biaya tambahan.</span>
                                </div>
                            )}
                            {bookingType === "regular" && (
                                <div className="bg-blue-50 rounded-lg p-3 flex items-start gap-2 text-sm text-blue-800">
                                    <CreditCard className="h-4 w-4 mt-0.5" />
                                    <span>Anda akan diarahkan ke halaman pembayaran Midtrans.</span>
                                </div>
                            )}

                            <button
                                onClick={handleBooking}
                                disabled={processing || (bookingType === "membership" && (!userMembership || (userMembership.remaining_class !== null && userMembership.remaining_class <= 0)))}
                                className="w-full py-3 rounded-xl bg-linear-to-r from-athletica-blue-dark to-athletica-blue-mid text-white font-semibold hover:shadow-md transition-all disabled:opacity-50"
                            >
                                {processing ? "Memproses..." : "Konfirmasi Booking"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserSchedules;