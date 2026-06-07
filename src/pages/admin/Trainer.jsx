import { useEffect, useState } from "react";
import {
    Plus,
    Search,
    Edit,
    Trash2,
    ChevronLeft,
    ChevronRight,
    Users,
    X,
    Mail,
    Lock,
    User,
} from "lucide-react";
import { toast } from "react-hot-toast";
import axiosInstance from "../../utils/axiosConfig";
import { DNA } from "react-loader-spinner";

const Trainers = () => {
    const [trainers, setTrainers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedTrainer, setSelectedTrainer] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const itemsPerPage = 10;

    useEffect(() => {
        let isMounted = true;

        const fetchTrainers = async () => {
            try {
                const response = await axiosInstance.get("/trainers");
                if (isMounted) {
                    setTrainers(response.data.data);
                    setLoading(false);
                }
            } catch (error) {
                console.error("Error fetching trainers:", error);
                if (isMounted) {
                    toast.error("Gagal mengambil data trainer");
                    setLoading(false);
                }
            }
        };

        fetchTrainers();

        return () => {
            isMounted = false;
        };
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const refreshData = async () => {
        try {
            const response = await axiosInstance.get("/trainers");
            setTrainers(response.data.data);
        } catch (error) {
            console.error("Error refreshing trainers:", error);
        }
    };

    const openModal = (trainer = null) => {
        if (trainer) {
            setSelectedTrainer(trainer);
            setFormData({
                name: trainer.name,
                email: trainer.email,
                password: "",
                password_confirmation: "",
            });
        } else {
            setSelectedTrainer(null);
            setFormData({
                name: "",
                email: "",
                password: "",
                password_confirmation: "",
            });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedTrainer(null);
        setFormData({
            name: "",
            email: "",
            password: "",
            password_confirmation: "",
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedTrainer && formData.password !== formData.password_confirmation) {
            toast.error("Password tidak cocok!");
            return;
        }

        if (!selectedTrainer && formData.password.length < 6) {
            toast.error("Password minimal 6 karakter!");
            return;
        }

        // untuk update, jika password diisi tapi tidak cocok
        if (selectedTrainer && formData.password && formData.password !== formData.password_confirmation) {
            toast.error("Password tidak cocok!");
            return;
        }

        try {
            if (selectedTrainer) {
                // update trainer
                const updateData = {
                    name: formData.name,
                    email: formData.email,
                };
                if (formData.password) {
                    updateData.password = formData.password;
                }
                await axiosInstance.put(`/trainers/${selectedTrainer.user_id}`, updateData);
                toast.success("Trainer berhasil diupdate");
            } else {
                // create trainer
                await axiosInstance.post("/trainers", {
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                });
                toast.success("Trainer berhasil ditambahkan");
            }
            await refreshData();
            closeModal();
        } catch (error) {
            console.error("Error saving trainer:", error);
            console.error("Response:", error.response?.data);
            const errorMsg = error.response?.data?.message || error.response?.data?.errors || "Gagal menyimpan trainer";
            toast.error(typeof errorMsg === 'object' ? JSON.stringify(errorMsg) : errorMsg);
        }
    };

    const openDeleteModal = (trainer) => {
        setSelectedTrainer(trainer);
        setIsDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        try {
            await axiosInstance.delete(`/trainers/${selectedTrainer.user_id}`);
            toast.success("Trainer berhasil dihapus");
            await refreshData();
            setIsDeleteModalOpen(false);
            setSelectedTrainer(null);
        } catch (error) {
            console.error("Error deleting trainer:", error);
            toast.error(error.response?.data?.message || "Gagal menghapus trainer");
        }
    };

    // search
    const filteredTrainers = trainers.filter(
        (item) =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // pagination
    const totalPages = Math.ceil(filteredTrainers.length / itemsPerPage);
    const paginatedTrainers = filteredTrainers.slice(
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
                    <h1 className="text-3xl font-bold text-athletica-blue-dark">Manajemen Trainer</h1>
                    <p className="text-gray-500 mt-1">Kelola data trainer fitness</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="flex items-center gap-2 bg-athletica-blue-dark hover:bg-athletica-blue-mid text-white font-semibold px-4 py-2 rounded-xl transition-all duration-200"
                >
                    <Plus className="h-5 w-5" />
                    Tambah Trainer
                </button>
            </div>

            {/* Search Bar */}
            <div className="bg-white rounded-2xl p-4 shadow-md mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Cari trainer berdasarkan nama atau email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-athletica-blue-mid focus:ring-2 focus:ring-athletica-blue-light/50"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-athletica-blue-light/20">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-athletica-blue-dark">#</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-athletica-blue-dark">Trainer</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-athletica-blue-dark">Email</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-athletica-blue-dark">Bergabung Sejak</th>
                                <th className="px-6 py-4 text-center text-sm font-semibold text-athletica-blue-dark">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {paginatedTrainers.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                        Tidak ada data trainer
                                    </td>
                                </tr>
                            ) : (
                                paginatedTrainers.map((item, index) => (
                                    <tr key={item.user_id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {(currentPage - 1) * itemsPerPage + index + 1}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-athletica-blue-dark to-athletica-blue-mid flex items-center justify-center">
                                                    <Users className="h-5 w-5 text-white" />
                                                </div>
                                                <span className="font-medium text-athletica-blue-dark">
                                                    {item.name}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {item.email}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(item.created_at).toLocaleDateString("id-ID")}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => openModal(item)}
                                                    className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => openDeleteModal(item)}
                                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
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

            {/* Modal Form */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <h2 className="text-xl font-bold text-athletica-blue-dark">
                                {selectedTrainer ? "Edit Trainer" : "Tambah Trainer Baru"}
                            </h2>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-athletica-blue-dark mb-1">
                                    Nama Lengkap *
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-athletica-blue-mid"
                                        placeholder="Contoh: John Doe"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-athletica-blue-dark mb-1">
                                    Email *
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-athletica-blue-mid"
                                        placeholder="trainer@example.com"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-athletica-blue-dark mb-1">
                                    {selectedTrainer ? "Password (kosongkan jika tidak diubah)" : "Password *"}
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        required={!selectedTrainer}
                                        className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-athletica-blue-mid"
                                        placeholder="Minimal 6 karakter"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-athletica-blue-dark mb-1">
                                    {selectedTrainer ? "Konfirmasi Password" : "Konfirmasi Password *"}
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input
                                        type="password"
                                        name="password_confirmation"
                                        value={formData.password_confirmation}
                                        onChange={handleInputChange}
                                        required={!selectedTrainer}
                                        className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-athletica-blue-mid"
                                        placeholder="Ulangi password"
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
                                    {selectedTrainer ? "Update" : "Simpan"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md">
                        <div className="p-6 text-center">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Trash2 className="h-8 w-8 text-red-500" />
                            </div>
                            <h2 className="text-xl font-bold text-athletica-blue-dark mb-2">
                                Hapus Trainer
                            </h2>
                            <p className="text-gray-500 mb-6">
                                Apakah Anda yakin ingin menghapus trainer "{selectedTrainer?.name}"?
                                Tindakan ini tidak dapat dibatalkan.
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
        </div>
    );
};

export default Trainers;