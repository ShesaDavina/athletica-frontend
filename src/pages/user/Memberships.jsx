/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { Crown, CheckCircle, Infinity as InfinityIcon, CreditCard, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import axiosInstance from "../../utils/axiosConfig";
import { DNA } from "react-loader-spinner";

export default function UserMemberships() {
    const [memberships, setMemberships] = useState([]);
    const [activeMembership, setActiveMembership] = useState(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(null);

    const fetchData = async () => {
        try {
            const [membershipRes, activeRes] = await Promise.all([
                axiosInstance.get("/memberships"),
                axiosInstance.get("/user/membership"),
            ]);
            setMemberships(membershipRes.data.data);
            setActiveMembership(activeRes.data.data);
        } catch (error) {
            console.error(error);
            if (error.response?.status === 404) {
                setActiveMembership(null);
            } else {
                toast.error("Gagal mengambil data membership");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleBuy = async (membershipId) => {
        setProcessing(membershipId);
        try {
            const response = await axiosInstance.post("/memberships/buy", { membership_id: membershipId });
            if (response.data.success && response.data.data?.payment_url) {
                window.open(response.data.data.payment_url, "_blank");
                toast.success("Silakan selesaikan pembayaran");
            } else {
                toast.error(response.data.message || "Gagal memproses pembelian");
            }
        } catch (error) {
            const msg = error.response?.data?.message || "Terjadi kesalahan";
            toast.error(msg);
        } finally {
            setProcessing(null);
        }
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
        <div className="max-w-6xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-athletica-blue-dark">Membership</h1>
                <p className="text-gray-500 mt-1">Dapatkan akses unlimited dengan paket membership terbaik</p>
            </div>

            {activeMembership && (
                <div className="bg-linear-to-r from-athletica-blue-dark to-athletica-blue-mid rounded-2xl p-6 text-white shadow-lg">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div>
                            <p className="text-white/80 text-sm">Membership Aktif</p>
                            <h2 className="text-2xl font-bold mt-1">{activeMembership.membership?.name}</h2>
                            <div className="flex gap-4 mt-3 text-sm">
                                <div>
                                    <span className="text-white/70">Berlaku hingga</span>
                                    <p className="font-semibold">{new Date(activeMembership.end_date).toLocaleDateString("id-ID")}</p>
                                </div>
                                <div>
                                    <span className="text-white/70">Sisa kelas</span>
                                    <p className="font-semibold">
                                        {activeMembership.remaining_class === null ? "Unlimited" : activeMembership.remaining_class}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white/20 p-3 rounded-xl">
                            <Crown className="h-12 w-12" />
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {memberships.map((pkg) => {
                    const isActive = activeMembership?.membership_id === pkg.membership_id;
                    return (
                        <div
                            key={pkg.membership_id}
                            className={`rounded-2xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl ${isActive ? "ring-2 ring-athletica-blue-mid" : ""
                                }`}
                        >
                            <div className="p-6 border-b border-gray-300 bg-white">
                                <h3 className="text-2xl font-bold text-athletica-blue-dark">{pkg.name}</h3>
                                <p className="text-3xl font-bold mt-2 text-athletica-blue-dark">
                                    Rp {parseInt(pkg.price).toLocaleString()}
                                </p>
                                <p className="text-gray-500 text-sm">{pkg.duration_days} hari</p>
                            </div>
                            <div className="p-6 bg-white space-y-3">
                                <ul className="space-y-2 text-sm">
                                    {pkg.class_limit === null ? (
                                        <li className="flex items-center gap-2">
                                            <InfinityIcon className="h-4 w-4 text-green-500" />
                                            <span>Unlimited kelas</span>
                                        </li>
                                    ) : (
                                        <li className="flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4 text-green-500" />
                                            <span>{pkg.class_limit} kelas per bulan</span>
                                        </li>
                                    )}
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                        <span>Akses semua kelas</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                        <span>Diskon merchandise 10%</span>
                                    </li>
                                </ul>
                                <button
                                    onClick={() => handleBuy(pkg.membership_id)}
                                    disabled={processing === pkg.membership_id || isActive}
                                    className={`w-full py-2.5 rounded-xl font-semibold transition-all mt-4 flex items-center justify-center gap-2 ${isActive
                                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                        : "bg-athletica-blue-dark text-white hover:bg-athletica-blue-mid"
                                        }`}
                                >
                                    {processing === pkg.membership_id ? (
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                    ) : isActive ? (
                                        "Aktif"
                                    ) : (
                                        <>
                                            <CreditCard className="h-4 w-4" />
                                            Beli Sekarang
                                        </>
                                    )}
                                </button>
                                {isActive && (
                                    <p className="text-center text-xs text-green-600 mt-2">Membership sedang aktif</p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
