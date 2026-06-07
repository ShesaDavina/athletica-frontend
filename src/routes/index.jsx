import { createBrowserRouter } from "react-router-dom";
import RegisterPage from "../pages/RegisterPage";
import LoginPage from "../pages/LoginPage";
import LandingPage from "../pages/LandingPages";
import AdminLayout from "../components/AdminLayout";
import Dashboard from "../pages/admin/Dashboard";
import Classes from "../pages/admin/Classes";
import Trainers from "../pages/admin/Trainer";
import Memberships from "../pages/admin/Memberships";
import Schedules from "../pages/admin/Schedules";
import Bookings from "../pages/admin/Bookings";
import Payments from "../pages/admin/Payments";
import TrainerLayout from "../components/TrainerLayout";
import TrainerDashboard from "../pages/trainer/Dashboard";
import TrainerSchedules from "../pages/trainer/Schedules";
import TrainerAttendance from "../pages/trainer/Attendance";
import TrainerExport from "../pages/trainer/Export";
import UserLayout from "../components/UserLayout";
import UserSchedules from "../pages/user/Schedules";
import UserMemberships from "../pages/user/Memberships";
import UserBookings from "../pages/user/Bookings";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <LandingPage />,
    },
    {
        path: "/register",
        element: <RegisterPage />,
    },
    {
        path: "/login",
        element: <LoginPage />,
    },
    {
        path: "/dashboard/admin",
        element: <AdminLayout />,
        children: [
            {
                index: true,
                element: <Dashboard />,
            },
            {
                path: "classes",
                element: <Classes />,
            },
            {
                path: "memberships",
                element: <Memberships />
            },
            {
                path: "trainers",
                element: <Trainers />
            },
            {
                path: "schedules",
                element: <Schedules />
            },
            {
                path: "bookings",
                element: <Bookings />
            },
            {
                path: "payments",
                element: <Payments />
            },
        ],
    },
    {
        path: "/dashboard/trainer",
        element: <TrainerLayout />,
        children: [
            {
                index: true,
                element: <TrainerDashboard />
            },
            {
                path: "schedules",
                element: <TrainerSchedules />
            },
            {
                path: "attendance",
                element: <TrainerAttendance />
            },
            {
                path: "export",
                element: <TrainerExport />
            },
        ]
    },
    {
        path: "/user",
        element: <UserLayout />,
        children: [
            {
                path: "/user",
                element: <UserSchedules />
            },
            {
                path: "/user/memberships",
                element: <UserMemberships />
            },
            {
                path: "/user/bookings",
                element: <UserBookings />
            },
        ]
    }
]);