/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { Dumbbell, LayoutDashboard, Calendar, LogOut, Menu, X, ClipboardList, Download, } from "lucide-react";
import { toast } from "react-hot-toast";
import axiosInstance from "../utils/axiosConfig";

export default function TrainerLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [trainerName, setTrainerName] = useState("");
    const [trainerEmail, setTrainerEmail] = useState("");
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 1024);
            if (window.innerWidth >= 1024) {
                setSidebarOpen(true);
            } else {
                setSidebarOpen(false);
            }
        };

        checkScreenSize();
        window.addEventListener("resize", checkScreenSize);

        const user = JSON.parse(localStorage.getItem("user") || "{}");
        setTrainerName(user.name || "Trainer");
        setTrainerEmail(user.email || "trainer@athletica.com");

        return () => window.removeEventListener("resize", checkScreenSize);
    }, []);

    const handleLogout = async () => {
        try {
            await axiosInstance.post("/logout");
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            toast.success("Logout berhasil!");
            navigate("/login");
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    const menuItems = [
        { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard/trainer" },
        { name: "My Schedule", icon: Calendar, path: "/dashboard/trainer/schedules" },
        { name: "Attendance", icon: ClipboardList, path: "/dashboard/trainer/attendance" },
        { name: "Export Schedule", icon: Download, path: "/dashboard/trainer/export" },
    ];

    const isActive = (path) => location.pathname === path;

    const closeSidebar = () => {
        if (isMobile) {
            setSidebarOpen(false);
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-athletica-cream to-athletica-blue-light/20">
            {sidebarOpen && isMobile && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <aside
                className={`fixed top-0 left-0 z-50 h-screen w-64 bg-white shadow-2xl transition-transform duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    } lg:translate-x-0`}
            >
                <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between p-4 border-b border-gray-100">
                        <Link
                            to="/dashboard/trainer"
                            className="flex items-center gap-2"
                            onClick={closeSidebar}
                        >
                            <div className="bg-linear-to-br from-athletica-blue-dark to-athletica-blue-mid p-2 rounded-xl">
                                <Dumbbell className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-xl font-bold text-athletica-blue-dark">
                                Athletica
                            </span>
                        </Link>
                        {isMobile && (
                            <button
                                onClick={() => setSidebarOpen(false)}
                                className="text-athletica-blue-dark hover:text-athletica-blue-mid"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        )}
                    </div>

                    <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
                        {menuItems.map((item) => (
                            <Link
                                key={item.name}
                                to={item.path}
                                onClick={closeSidebar}
                                className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group ${isActive(item.path)
                                    ? "bg-linear-to-r from-athletica-blue-dark to-athletica-blue-mid text-white shadow-md"
                                    : "text-athletica-blue-dark hover:bg-athletica-blue-light/20"
                                    }`}
                            >
                                <item.icon className="h-5 w-5 shrink-0" />
                                <span className="font-medium">{item.name}</span>
                            </Link>
                        ))}
                    </nav>

                    <div className="p-4 border-t border-gray-100">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-athletica-blue-dark to-athletica-blue-mid flex items-center justify-center text-white font-bold">
                                {trainerName.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-athletica-blue-dark truncate">
                                    {trainerName}
                                </p>
                                <p className="text-xs text-gray-500 truncate">
                                    {trainerEmail}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-red-500 hover:bg-red-50 transition-all duration-200"
                        >
                            <LogOut className="h-5 w-5" />
                            <span className="font-medium">Logout</span>
                        </button>
                    </div>
                </div>
            </aside>

            {!sidebarOpen && isMobile && (
                <button
                    onClick={() => setSidebarOpen(true)}
                    className="fixed top-4 left-4 z-30 p-2 bg-white rounded-xl shadow-lg text-athletica-blue-dark lg:hidden"
                >
                    <Menu className="h-6 w-6" />
                </button>
            )}

            <main className={`min-h-screen transition-all duration-300 ${!isMobile ? "lg:ml-64" : ""}`}>
                <div className="p-4 md:p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};
