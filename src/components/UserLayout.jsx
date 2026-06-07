/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useRef, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Calendar, ChevronDown, Crown, Dumbbell, History, LogOut, Menu, X } from "lucide-react";
import axiosInstance from "../utils/axiosConfig";
import toast from "react-hot-toast";

const UserLayout = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [userName, setUserName] = useState("");
    const dropdownRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        setUserName(user.name || "User");
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
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

    const navItems = [
        { name: "Schedule", path: "/user", icon: Calendar },
        { name: "Membership", path: "/user/memberships", icon: Crown },
        { name: "History", path: "/user/bookings", icon: History },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <div className="min-h-screen bg-athletica-cream">
            {/* Navbar Float */}
            <nav className="fixed top-4 left-1/2 z-50 w-[90%] max-w-7xl -translate-x-1/2 rounded-2xl border border-athletica-blue-dark bg-white/80 backdrop-blur-md bg-athletica-blue-dark-transparent lg:top-6">
                <div className="flex items-center justify-between px-4 py-2 md:px-6">
                    {/* Logo */}
                    <Link to="/user" className="flex items-center gap-2 shrink-0">
                        <div className="bg-athletica-blue-dark p-2 rounded-xl">
                            <Dumbbell className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-xl font-bold text-athletica-blue-light">Athletica</span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 ${isActive(item.path)
                                    ? "bg-white text-athletica-blue-dark shadow-md"
                                    : "text-white hover:bg-athletica-blue-light/20"
                                    }`}
                            >
                                <item.icon className="h-4 w-4" />
                                <span>{item.name}</span>
                            </Link>
                        ))}
                    </div>

                    {/* Right Section: Profile Dropdown + Mobile Toggle */}
                    <div className="flex items-center gap-3">
                        {/* Profile Dropdown */}
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-athletica-blue-light/20 transition-all"
                            >
                                <div className="w-8 h-8 rounded-full bg-athletica-blue-dark flex items-center justify-center text-white font-bold">
                                    {userName.charAt(0).toUpperCase()}
                                </div>
                                <span className="hidden md:block text-sm font-medium text-white">{userName}</span>
                                <ChevronDown className={`h-4 w-4 text-white transition-transform ${isProfileOpen ? "rotate-180" : ""}`} />
                            </button>

                            {isProfileOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                                    <div className="px-4 py-2 border-b border-gray-100">
                                        <p className="text-sm font-semibold text-athletica-blue-dark">{userName}</p>
                                        <p className="text-xs text-gray-500 truncate">{JSON.parse(localStorage.getItem("user") || "{}").email}</p>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-all"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Mobile Toggle Button (hanya di mobile) - putih terang */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-2 rounded-lg bg-white/90 border border-athletica-blue-light/40 text-athletica-blue-dark hover:bg-white transition-all focus:outline-none"
                        >
                            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Dropdown */}
                {isMobileMenuOpen && (
                    <div className="md:hidden border-t border-athletica-blue-light/30 p-4 space-y-2">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive(item.path)
                                    ? "bg-athletica-blue-dark text-white"
                                    : "text-white hover:bg-athletica-blue-light/20"
                                    }`}
                            >
                                <item.icon className="h-5 w-5" />
                                <span>{item.name}</span>
                            </Link>
                        ))}
                        <button
                            onClick={() => {
                                handleLogout();
                                setIsMobileMenuOpen(false);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all mt-2"
                        >
                            <LogOut className="h-5 w-5" />
                            <span>Logout</span>
                        </button>
                    </div>
                )}
            </nav>

            {/* Main Content */}
            <main className="pt-28 pb-12 px-4 md:px-8">
                <div className="max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default UserLayout;