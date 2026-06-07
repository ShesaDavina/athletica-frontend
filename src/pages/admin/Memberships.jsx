/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { Plus, Search, Edit, Trash2, Crown, X, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "react-hot-toast";
import axiosInstance from "../../utils/axiosConfig";
import { DNA } from "react-loader-spinner";

const Memberships = () => {
    const [memberships, setMemberships] = useState([]);
    const [userMemberships, setUserMemberships] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [tab, setTab] = useState("packages");
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const [selected, setSelected] = useState(null);
    const [form, setForm] = useState({
        name: "",
        price: "",
        duration_days: "",
        class_limit: "",
    });

    const limit = 10;

    const fetchData = async () => {
        try {
            const [packRes, userRes] = await Promise.all([
                axiosInstance.get("/memberships"),
                axiosInstance.get("/admin/user-memberships"),
            ]);
            setMemberships(packRes.data.data);
            setUserMemberships(userRes.data.data);
        } catch (error) {
            console.error("Error fetching memberships:", error);
            toast.error("Gagal mengambil data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const openModal = (item = null) => {
        if (item) {
            setSelected(item);
            setForm({
                name: item.name,
                price: item.price,
                duration_days: item.duration_days,
                class_limit: item.class_limit === null ? "" : item.class_limit,
            });
        } else {
            setSelected(null);
            setForm({ name: "", price: "", duration_days: "", class_limit: "" });
        }
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelected(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = {
            name: form.name,
            price: parseInt(form.price),
            duration_days: parseInt(form.duration_days),
            class_limit: form.class_limit === "" ? null : parseInt(form.class_limit),
        };

        try {
            if (selected) {
                await axiosInstance.put(`/memberships/${selected.membership_id}`, data);
                toast.success("Paket berhasil diupdate");
            } else {
                await axiosInstance.post("/memberships", data);
                toast.success("Paket berhasil ditambahkan");
            }
            await fetchData();
            closeModal();
        } catch (error) {
            console.error("Error saving data:", error);
            toast.error("Gagal menyimpan");
        }
    };

    const handleDelete = async () => {
        try {
            await axiosInstance.delete(`/memberships/${selected.membership_id}`);
            toast.success("Paket berhasil dihapus");
            await fetchData();
            setDeleteModalOpen(false);
        } catch (error) {
            console.error("Error delete data:", error);
            toast.error("Gagal menghapus");
        }
    };

    const filterPackages = memberships.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
    );

    const filterUsers = userMemberships.filter(
        (item) =>
            item.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
            item.membership?.name?.toLowerCase().includes(search.toLowerCase())
    );

    const currentData = tab === "packages" ? filterPackages : filterUsers;
    const totalPages = Math.ceil(currentData.length / limit);
    const paginatedData = currentData.slice((page - 1) * limit, page * limit);

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
            <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-athletica-blue-dark">Manajemen Membership</h1>
                    <p className="text-gray-500 text-sm">Kelola paket membership dan lihat pembelian user</p>
                </div>
                {tab === "packages" && (
                    <button
                        onClick={() => openModal()}
                        className="flex items-center gap-2 bg-athletica-blue-dark text-white px-4 py-2 rounded-xl hover:bg-athletica-blue-mid transition"
                    >
                        <Plus size={18} />
                        Tambah Paket
                    </button>
                )}
            </div>

            <div className="flex gap-4 border-b mb-6">
                <button
                    onClick={() => { setTab("packages"); setPage(1); setSearch(""); }}
                    className={`pb-2 px-2 font-medium transition ${tab === "packages" ? "border-b-2 border-athletica-blue-dark text-athletica-blue-dark" : "text-gray-400"}`}
                >
                    Paket Membership
                </button>
                <button
                    onClick={() => { setTab("user-memberships"); setPage(1); setSearch(""); }}
                    className={`pb-2 px-2 font-medium transition ${tab === "user-memberships" ? "border-b-2 border-athletica-blue-dark text-athletica-blue-dark" : "text-gray-400"}`}
                >
                    Membership User
                </button>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-md mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder={tab === "packages" ? "Cari paket..." : "Cari user atau paket..."}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-athletica-blue-mid focus:ring-2 focus:ring-athletica-blue-light/50"
                    />
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-athletica-blue-light/20">
                            <tr>
                                {tab === "packages" ? (
                                    <>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-athletica-blue-dark">#</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-athletica-blue-dark">Paket</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-athletica-blue-dark">Harga</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-athletica-blue-dark">Durasi</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-athletica-blue-dark">Limit</th>
                                        <th className="px-4 py-3 text-center text-sm font-semibold text-athletica-blue-dark">Aksi</th>
                                    </>
                                ) : (
                                    <>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-athletica-blue-dark">#</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-athletica-blue-dark">User</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-athletica-blue-dark">Paket</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-athletica-blue-dark">Masa Aktif</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-athletica-blue-dark">Sisa Kelas</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-athletica-blue-dark">Status</th>
                                        <th className="px-4 py-3 text-center text-sm font-semibold text-athletica-blue-dark">Aksi</th>
                                    </>
                                )}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {paginatedData.length === 0 ? (
                                <tr>
                                    <td colSpan={tab === "packages" ? 6 : 7} className="text-center py-8 text-gray-400">
                                        Tidak ada data membership
                                    </td>
                                </tr>
                            ) : (
                                paginatedData.map((item, idx) => {
                                    if (tab === "packages") {
                                        return (
                                            <tr key={item.membership_id} className="hover:bg-gray-50">
                                                <td className="px-4 py-3 text-sm">{(page - 1) * limit + idx + 1}</td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-8 h-8 bg-athletica-blue-light/20 rounded-lg flex items-center justify-center">
                                                            <Crown size={16} className="text-athletica-blue-dark" />
                                                        </div>
                                                        <span className="font-medium">{item.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-sm">Rp {parseInt(item.price).toLocaleString()}</td>
                                                <td className="px-4 py-3 text-sm">{item.duration_days} hari</td>
                                                <td className="px-4 py-3 text-sm">
                                                    {item.class_limit === null ? "Unlimited" : `${item.class_limit} kelas`}
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <div className="flex justify-center gap-2">
                                                        <button onClick={() => openModal(item)} className="p-1 text-blue-500 hover:bg-blue-50 rounded">
                                                            <Edit size={16} />
                                                        </button>
                                                        <button onClick={() => { setSelected(item); setDeleteModalOpen(true); }} className="p-1 text-red-500 hover:bg-red-50 rounded">
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    } else {
                                        const isExpired = new Date(item.end_date) < new Date();
                                        const status = item.status === "active" && !isExpired ? "active" : "expired";
                                        return (
                                            <tr key={item.user_membership_id} className="hover:bg-gray-50">
                                                <td className="px-4 py-3 text-sm">{(page - 1) * limit + idx + 1}</td>
                                                <td className="px-4 py-3">
                                                    <div>
                                                        <p className="font-medium">{item.user?.name}</p>
                                                        <p className="text-xs text-gray-400">{item.user?.email}</p>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-sm">{item.membership?.name}</td>
                                                <td className="px-4 py-3 text-sm">
                                                    {new Date(item.start_date).toLocaleDateString()} <br />
                                                    <span className="text-xs text-gray-400">sd {new Date(item.end_date).toLocaleDateString()}</span>
                                                </td>
                                                <td className="px-4 py-3 text-sm">
                                                    {item.remaining_class === null ? "Unlimited" : `${item.remaining_class} kelas`}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className={`px-2 py-0.5 rounded-full text-xs ${status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                                        {status === "active" ? "Aktif" : "Expired"}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <button onClick={() => { setSelected(item); setDetailModalOpen(true); }} className="p-1 text-athletica-blue-mid hover:bg-athletica-blue-light/20 rounded">
                                                        <Eye size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    }
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
                        <button
                            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                            disabled={page === 1}
                            className="flex items-center gap-1 px-3 py-1 rounded-lg text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                        >
                            <ChevronLeft className="h-4 w-4" />
                            Previous
                        </button>
                        <span className="text-sm text-gray-500">
                            Page {page} of {totalPages}
                        </span>
                        <button
                            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={page === totalPages}
                            className="flex items-center gap-1 px-3 py-1 rounded-lg text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                        >
                            Next
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                )}
            </div>

            {modalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl w-full max-w-md">
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <h2 className="text-xl font-bold text-athletica-blue-dark">
                                {selected ? "Edit Membership" : "Tambah Membership Baru"}
                            </h2>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-4 space-y-3">
                            <input type="text" name="name" placeholder="Nama Paket" value={form.name} onChange={handleChange} required className="w-full p-2 border rounded-lg"
                                className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-athletica-blue-mid" />
                            <input type="number" name="price" placeholder="Harga" value={form.price} onChange={handleChange} required className="w-full p-2 border rounded-lg"
                                className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-athletica-blue-mid" />
                            <input type="number" name="duration_days" placeholder="Durasi (hari)" value={form.duration_days} onChange={handleChange} required className="w-full p-2 border rounded-lg"
                                className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-athletica-blue-mid" />
                            <input type="number" name="class_limit" placeholder="Limit Kelas (kosongkan untuk unlimited)" value={form.class_limit} onChange={handleChange} className="w-full p-2 border rounded-lg"
                                className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-athletica-blue-mid" />
                            <div className="flex gap-2 pt-2">
                                <button type="button" onClick={closeModal} className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50">Batal</button>
                                <button type="submit" className="flex-1 px-4 py-2 bg-athletica-blue-dark text-white rounded-xl hover:bg-athletica-blue-mid">Simpan</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {deleteModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl w-full max-w-sm text-center p-6">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Trash2 className="text-red-500" size={24} />
                        </div>
                        <h3 className="font-bold mb-2">Hapus Paket?</h3>
                        <p className="text-gray-500 text-sm mb-4">Yakin hapus "{selected?.name}"?</p>
                        <div className="flex gap-2">
                            <button onClick={() => setDeleteModalOpen(false)} className="flex-1 p-2 border rounded-lg">Batal</button>
                            <button onClick={handleDelete} className="flex-1 p-2 bg-red-500 text-white rounded-lg">Hapus</button>
                        </div>
                    </div>
                </div>
            )}

            {detailModalOpen && selected && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl w-full max-w-md">
                        <div className="flex justify-between items-center p-4 border-b">
                            <h2 className="font-bold text-athletica-blue-dark">Detail Membership</h2>
                            <button onClick={() => setDetailModalOpen(false)} className="text-gray-400"><X size={20} /></button>
                        </div>
                        <div className="p-4 space-y-3">
                            <div className="flex justify-between"><span className="text-gray-500">User</span><span className="font-medium">{selected.user?.name}</span></div>
                            <div className="flex justify-between"><span className="text-gray-500">Email</span><span>{selected.user?.email}</span></div>
                            <div className="flex justify-between"><span className="text-gray-500">Paket</span><span>{selected.membership?.name}</span></div>
                            <div className="flex justify-between"><span className="text-gray-500">Harga</span><span>Rp {parseInt(selected.membership?.price || 0).toLocaleString()}</span></div>
                            <div className="flex justify-between"><span className="text-gray-500">Masa Aktif</span><span>{new Date(selected.start_date).toLocaleDateString()} - {new Date(selected.end_date).toLocaleDateString()}</span></div>
                            <div className="flex justify-between"><span className="text-gray-500">Sisa Kelas</span><span>{selected.remaining_class === null ? "Unlimited" : `${selected.remaining_class} kelas`}</span></div>
                            <div className="flex justify-between"><span className="text-gray-500">Status</span><span className={`px-2 py-0.5 rounded-full text-xs ${selected.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{selected.status === "active" ? "Aktif" : "Expired"}</span></div>
                        </div>
                        <div className="p-4 border-t">
                            <button onClick={() => setDetailModalOpen(false)} className="w-full p-2 bg-athletica-blue-dark text-white rounded-lg">Tutup</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Memberships;