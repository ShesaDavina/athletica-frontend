/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import {
    Plus,
    Search,
    Edit,
    Trash2,
    ChevronLeft,
    ChevronRight,
    Dumbbell,
    X,
    Upload,
} from "lucide-react";
import { toast } from "react-hot-toast";
import axiosInstance from "../../utils/axiosConfig";
import { DNA } from "react-loader-spinner";

const Classes = () => {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedClass, setSelectedClass] = useState(null);
    const [formData, setFormData] = useState({
        class_name: "",
        description: "",
        price: "",
        capacity: "",
        image: null,
    });
    const [imagePreview, setImagePreview] = useState(null);

    const itemsPerPage = 10;

    const fetchClasses = async () => {
        try {
            const response = await axiosInstance.get("/classes");
            setClasses(response.data.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching classes:", error);
            toast.error("Gagal mengambil data kelas");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClasses();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml', 'image/webp'];
            if (!allowedTypes.includes(file.type)) {
                toast.error("Format file harus JPG, JPEG, PNG, SVG, atau WebP");
                return;
            }

            if (file.size > 2 * 1024 * 1024) {
                toast.error("Ukuran file maksimal 2MB");
                return;
            }

            setFormData({ ...formData, image: file });
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const refreshData = async () => {
        try {
            const response = await axiosInstance.get("/classes");
            setClasses(response.data.data);
        } catch (error) {
            console.error("Error refreshing classes:", error);
        }
    };

    const openModal = (classItem = null) => {
        if (classItem) {
            setSelectedClass(classItem);
            setFormData({
                class_name: classItem.class_name,
                description: classItem.description || "",
                price: classItem.price,
                capacity: classItem.capacity,
                image: null,
            });
            setImagePreview(classItem.image ? `http://localhost:8000/storage/${classItem.image}` : null);
        } else {
            setSelectedClass(null);
            setFormData({
                class_name: "",
                description: "",
                price: "",
                capacity: "",
                image: null,
            });
            setImagePreview(null);
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedClass(null);
        setFormData({
            class_name: "",
            description: "",
            price: "",
            capacity: "",
            image: null,
        });
        setImagePreview(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const submitData = new FormData();
            submitData.append("class_name", formData.class_name);
            submitData.append("description", formData.description || "");
            submitData.append("price", formData.price);
            submitData.append("capacity", formData.capacity);

            if (formData.image) {
                submitData.append("image", formData.image);
            }

            if (selectedClass) {
                submitData.append("_method", "PUT");
                await axiosInstance.post(`/classes/${selectedClass.class_id}`, submitData, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
                toast.success("Kelas berhasil diupdate");
            } else {
                await axiosInstance.post("/classes", submitData, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
                toast.success("Kelas berhasil ditambahkan");
            }

            await refreshData();
            closeModal();
        } catch (error) {
            console.error("Error saving class:", error);
            toast.error(error.response?.data?.message || "Gagal menyimpan kelas");
        }
    };

    const openDeleteModal = (classItem) => {
        setSelectedClass(classItem);
        setIsDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        try {
            await axiosInstance.delete(`/classes/${selectedClass.class_id}`);
            toast.success("Kelas berhasil dihapus");
            await refreshData();
            setIsDeleteModalOpen(false);
            setSelectedClass(null);
        } catch (error) {
            console.error("Error deleting class:", error);
            toast.error(error.response?.data?.message || "Gagal menghapus kelas");
        }
    };

    const filteredClasses = classes.filter(
        (item) =>
            item.class_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const totalPages = Math.ceil(filteredClasses.length / itemsPerPage);
    const paginatedClasses = filteredClasses.slice(
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
                    <h1 className="text-3xl font-bold text-athletica-blue-dark">Manajemen Kelas</h1>
                    <p className="text-gray-500 mt-1">Kelola data kelas fitness yang tersedia</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="flex items-center gap-2 bg-athletica-blue-dark hover:bg-athletica-blue-mid text-white font-semibold px-4 py-2 rounded-xl transition-all duration-200"
                >
                    <Plus className="h-5 w-5" />
                    Tambah Kelas
                </button>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-md mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Cari kelas..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-athletica-blue-mid focus:ring-2 focus:ring-athletica-blue-light/50"
                    />
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-athletica-blue-light/20">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-athletica-blue-dark">#</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-athletica-blue-dark">Kelas</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-athletica-blue-dark">Deskripsi</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-athletica-blue-dark">Harga</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-athletica-blue-dark">Kapasitas</th>
                                <th className="px-6 py-4 text-center text-sm font-semibold text-athletica-blue-dark">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {paginatedClasses.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                                        Tidak ada data kelas
                                    </td>
                                </tr>
                            ) : (
                                paginatedClasses.map((item, index) => (
                                    <tr key={item.class_id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {(currentPage - 1) * itemsPerPage + index + 1}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {item.image_url ? (
                                                    <img
                                                        src={item.image_url}
                                                        alt={item.class_name}
                                                        className="w-10 h-10 rounded-xl object-cover"
                                                        onError={(e) => {
                                                            e.target.style.display = 'none';
                                                            const iconDiv = e.target.parentElement.querySelector('.class-icon');
                                                            if (iconDiv) iconDiv.style.display = 'flex';
                                                        }}
                                                    />
                                                ) : null}
                                                <div className={`class-icon w-10 h-10 rounded-xl bg-athletica-blue-light/20 flex items-center justify-center ${item.image_url ? 'hidden' : ''}`}>
                                                    <Dumbbell className="h-5 w-5 text-athletica-blue-dark" />
                                                </div>
                                                <span className="font-medium text-athletica-blue-dark">
                                                    {item.class_name}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                                            {item.description || "-"}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-semibold text-athletica-blue-dark">
                                            Rp {parseInt(item.price).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {item.capacity} orang
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

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <h2 className="text-xl font-bold text-athletica-blue-dark">
                                {selectedClass ? "Edit Kelas" : "Tambah Kelas Baru"}
                            </h2>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-athletica-blue-dark mb-1">
                                    Nama Kelas *
                                </label>
                                <input
                                    type="text"
                                    name="class_name"
                                    value={formData.class_name}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-athletica-blue-mid"
                                    placeholder="Contoh: Yoga, Zumba, dll"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-athletica-blue-dark mb-1">
                                    Deskripsi
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows="3"
                                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-athletica-blue-mid"
                                    placeholder="Deskripsi kelas..."
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-athletica-blue-dark mb-1">
                                        Harga (Rp) *
                                    </label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-athletica-blue-mid"
                                        placeholder="100000"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-athletica-blue-dark mb-1">
                                        Kapasitas *
                                    </label>
                                    <input
                                        type="number"
                                        name="capacity"
                                        value={formData.capacity}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-athletica-blue-mid"
                                        placeholder="20"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-athletica-blue-dark mb-1">
                                    Gambar Kelas
                                </label>
                                <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                        id="image-upload"
                                    />
                                    {imagePreview ? (
                                        <div className="relative inline-block">
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                className="max-h-32 rounded-lg"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setImagePreview(null);
                                                    setFormData({ ...formData, image: null });
                                                }}
                                                className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <label
                                            htmlFor="image-upload"
                                            className="cursor-pointer flex flex-col items-center gap-2 py-4"
                                        >
                                            <Upload className="h-8 w-8 text-gray-400" />
                                            <span className="text-sm text-gray-500">Klik untuk upload gambar</span>
                                            <span className="text-xs text-gray-400">Format: JPG, PNG, WebP (Max 2MB)</span>
                                        </label>
                                    )}
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
                                    {selectedClass ? "Update" : "Simpan"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isDeleteModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md">
                        <div className="p-6 text-center">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Trash2 className="h-8 w-8 text-red-500" />
                            </div>
                            <h2 className="text-xl font-bold text-athletica-blue-dark mb-2">
                                Hapus Kelas
                            </h2>
                            <p className="text-gray-500 mb-6">
                                Apakah Anda yakin ingin menghapus kelas "{selectedClass?.class_name}"?
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

export default Classes;