import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Dumbbell, Eye, EyeOff, Lock, Mail, ArrowRight } from "lucide-react";
import { toast } from "react-hot-toast";
import axiosInstance from "../utils/axiosConfig";

const LoginPage = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        remember: false,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axiosInstance.post("/login", {
                email: formData.email,
                password: formData.password,
            });

            if (response.data.success) {
                localStorage.setItem("token", response.data.data.token);
                localStorage.setItem("user", JSON.stringify(response.data.data.user));

                toast.success("Login berhasil!");

                const role = response.data.data.user.role;
                if (role === "admin") {
                    navigate("/dashboard/admin");
                } else if (role === "trainer") {
                    navigate("/dashboard/trainer");
                } else {
                    navigate("/user");
                }
            }
        } catch (error) {
            const message = error.response?.data?.message || "Login gagal, coba lagi";
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-athletica-cream flex items-center justify-center px-4">
            <div className="absolute top-0 right-0 w-96 h-96 bg-athletica-blue-light rounded-full blur-3xl opacity-30" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-athletica-blue-mid rounded-full blur-3xl opacity-20" />

            <div className="relative z-10 w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <div className="bg-athletica-blue-dark p-3 rounded-2xl">
                            <Dumbbell className="h-8 w-8 text-white" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-athletica-blue-dark">Welcome Back</h1>
                    <p className="text-gray-500 mt-2">Please enter your details</p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-5">
                            <label className="block text-sm font-medium text-athletica-blue-dark mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <Mail className="h-5 w-5 text-athletica-blue-mid" />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-athletica-blue-mid focus:ring-2 focus:ring-athletica-blue-light/50 transition-all"
                                    placeholder="Enter your email"
                                />
                            </div>
                        </div>

                        <div className="mb-5">
                            <label className="block text-sm font-medium text-athletica-blue-dark mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <Lock className="h-5 w-5 text-athletica-blue-mid" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-athletica-blue-mid focus:ring-2 focus:ring-athletica-blue-light/50 transition-all"
                                    placeholder="Enter your password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-athletica-blue-mid" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-gray-400 hover:text-athletica-blue-mid" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between mb-6">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="remember"
                                    checked={formData.remember}
                                    onChange={handleChange}
                                    className="w-4 h-4 rounded border-gray-300 text-athletica-blue-dark focus:ring-athletica-blue-light"
                                />
                                <span className="text-sm text-gray-600">Remember me</span>
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-athletica-blue-dark hover:bg-athletica-blue-mid text-white font-semibold py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Logging in..." : "Login"}
                            {!loading && <ArrowRight className="h-4 w-4" />}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-gray-500">
                            Don't have an account?{" "}
                            <Link
                                to="/register"
                                className="text-athletica-blue-mid hover:text-athletica-blue-dark font-semibold transition-colors"
                            >
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;