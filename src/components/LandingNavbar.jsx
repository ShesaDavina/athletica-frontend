import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar, NavbarBrand, NavbarCollapse, NavbarToggle } from "flowbite-react";
import { Dumbbell } from "lucide-react";

export default function LandingNavbar() {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    return (
        <Navbar
            fluid
            rounded
            className="fixed top-4 left-1/2 z-50 w-[90%] max-w-7xl -translate-x-1/2 rounded-2xl border border-athletica-blue-dark bg-white/80 backdrop-blur-md bg-athletica-blue-dark-transparent lg:top-6"
        >
            <NavbarBrand as={Link} to="/">
                <div className="flex items-center gap-2">
                    <div className="bg-athletica-blue-dark p-2 rounded-xl">
                        <Dumbbell className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-xl font-bold text-athletica-blue-light">
                        Athletica
                    </span>
                </div>
            </NavbarBrand>

            <div className="flex md:order-2 gap-3">
                <button
                    onClick={() => navigate("/login")}
                    className="hidden md:block px-5 py-2 rounded-xl font-semibold text-athletica-blue-dark bg-white/80 hover:bg-white border border-athletica-blue-light/50 transition-all duration-200 hover:shadow-md"
                >
                    Login
                </button>
                <NavbarToggle
                    onClick={() => setIsOpen(!isOpen)}
                    className="bg-athletica-blue-light/20 text-athletica-blue-dark"
                />
            </div>

            <NavbarCollapse className={`${isOpen ? "block" : "hidden"} navbar-collapse-custom`}>
                <a href="#" className="navbar-link-custom">
                    Home
                </a>
                <a href="#features" className="navbar-link-custom">
                    Features
                </a>
                <a href="#classes" className="navbar-link-custom">
                    Class
                </a>
                <a href="#membership" className="navbar-link-custom">
                    Membership
                </a>
                <a href="#contact" className="navbar-link-custom">
                    Contact
                </a>
            </NavbarCollapse>
        </Navbar>
    );
};
