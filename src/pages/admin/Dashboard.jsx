import { useEffect, useState } from "react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, } from "recharts";
import { Users, Dumbbell, Calendar, TrendingUp, Award, MoreVertical, Activity, DollarSign } from "lucide-react";
import axiosInstance from "../../utils/axiosConfig";
import { DNA } from "react-loader-spinner";

const Dashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        const fetchDashboardData = async () => {
            try {
                const response = await axiosInstance.get("/dashboard/admin");
                if (isMounted) {
                    setDashboardData(response.data.data);
                    setLoading(false);
                }
            } catch (error) {
                console.error("Error fetching dashboard:", error);
                if (isMounted) setLoading(false);
            }
        };
        fetchDashboardData();
        return () => {
            isMounted = false;
        };
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

    if (!dashboardData) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-athletica-blue-dark">No data available</div>
            </div>
        );
    }

    const { monthly_bookings, popular_classes, monthly_revenue, membership_stats, totals } = dashboardData;

    const statsCards = [
        {
            title: "Total Balance",
            value: `Rp ${(totals?.total_revenue || 0).toLocaleString()}`,
            icon: DollarSign,
            bgGradient: "bg-athletica-blue-dark",
        },
        {
            title: "Total Users",
            value: totals?.total_users || 0,
            icon: Users,
            bgGradient: "bg-emerald-500",
        },
        {
            title: "Total Bookings",
            value: totals?.total_bookings || 0,
            icon: Calendar,
            bgGradient: "bg-amber-500",
        },
        {
            title: "Active Memberships",
            value: totals?.active_memberships || 0,
            icon: Award,
            bgGradient: "bg-rose-500",
        },
    ];

    const COLORS = ["#355872", "#7AAACE", "#9CD5FF", "#F7F8F0"];

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-athletica-blue-dark">Dashboard</h1>
                <p className="text-gray-500 mt-1">Welcome back! Here's what's happening with your gym today.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statsCards.map((card, idx) => (
                    <div
                        key={idx}
                        className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`bg-linear-to-br ${card.bgGradient} p-3 rounded-xl`}>
                                <card.icon className="h-6 w-6 text-white" />
                            </div>
                        </div>
                        <h3 className="text-gray-500 text-sm">{card.title}</h3>
                        <p className="text-2xl font-bold text-athletica-blue-dark mt-1">{card.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Activity className="h-5 w-5 text-athletica-blue-dark" />
                            <h2 className="text-lg font-semibold text-athletica-blue-dark">Booking Activity</h2>
                        </div>
                        <button className="text-gray-400 hover:text-athletica-blue-dark">
                            <MoreVertical className="h-5 w-5" />
                        </button>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={monthly_bookings || []}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="total"
                                stroke="#355872"
                                strokeWidth={2}
                                dot={{ fill: "#7AAACE", strokeWidth: 2, r: 4 }}
                                activeDot={{ r: 6 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-athletica-blue-dark" />
                            <h2 className="text-lg font-semibold text-athletica-blue-dark">Revenue Overview</h2>
                        </div>
                        <button className="text-gray-400 hover:text-athletica-blue-dark">
                            <MoreVertical className="h-5 w-5" />
                        </button>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={monthly_revenue || []}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip formatter={(value) => `Rp ${value?.toLocaleString() || 0}`} />
                            <Legend />
                            <Bar dataKey="total" fill="#7AAACE" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-2xl p-6 shadow-lg lg:col-span-1">
                    <div className="flex items-center gap-2 mb-4">
                        <Dumbbell className="h-5 w-5 text-athletica-blue-dark" />
                        <h2 className="text-lg font-semibold text-athletica-blue-dark">Popular Classes</h2>
                    </div>
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart
                            data={popular_classes || []}
                            layout="vertical"
                            margin={{ left: 80 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" />
                            <YAxis type="category" dataKey="class_name" width={80} />
                            <Tooltip />
                            <Bar dataKey="total_bookings" fill="#9CD5FF" radius={[0, 8, 8, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg lg:col-span-1">
                    <div className="flex items-center gap-2 mb-4">
                        <Award className="h-5 w-5 text-athletica-blue-dark" />
                        <h2 className="text-lg font-semibold text-athletica-blue-dark">Membership Status</h2>
                    </div>
                    <ResponsiveContainer width="100%" height={280}>
                        <PieChart>
                            <Pie
                                data={[
                                    { name: "Active", value: membership_stats?.active || 0 },
                                    { name: "Expired", value: membership_stats?.expired || 0 },
                                ]}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                                outerRadius={100}
                                dataKey="value"
                            >
                                {[
                                    { name: "Active", value: membership_stats?.active || 0 },
                                    { name: "Expired", value: membership_stats?.expired || 0 },
                                ].map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;