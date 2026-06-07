import { Link } from "react-router-dom";
import LandingNavbar from "../components/LandingNavbar";
import {
    Dumbbell,
    ArrowRight,
    CheckCircle,
    Crown,
    Sparkles
} from "lucide-react";
import FeatureCards from "../components/FeatureCards";

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-athletica-cream">
            <LandingNavbar />
            <section className="relative pt-32 pb-20 px-4 overflow-hidden" id="/">
                <div className="absolute top-20 right-0 w-96 h-96 bg-athletica-blue-light rounded-full blur-3xl opacity-30" />
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-athletica-blue-mid rounded-full blur-3xl opacity-20" />

                <div className="container mx-auto max-w-6xl relative z-10">
                    <div className="text-center">
                        <div className="inline-flex items-center gap-2 bg-athletica-blue-light/20 px-4 py-2 rounded-full mb-6">
                            <Sparkles className="h-4 w-4 text-athletica-blue-dark" />
                            <span className="text-athletica-blue-dark font-medium text-sm">Fitness Booking Platform</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-bold text-athletica-blue-dark mb-6">
                            Booking Kelas Fitness
                            <span className="block text-athletica-blue-mid">Lebih Mudah & Cepat</span>
                        </h1>

                        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10">
                            Kelola jadwal fitness, booking kelas, dan beli membership dengan mudah.
                            Tersedia untuk user, trainer, dan admin dalam satu platform terintegrasi.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                to="/register"
                                className="bg-athletica-blue-dark hover:bg-athletica-blue-mid text-white font-semibold px-8 py-3 rounded-xl transition-all duration-200 inline-flex items-center gap-2"
                            >
                                Mulai Sekarang
                                <ArrowRight className="h-5 w-5" />
                            </Link>
                            <a
                                href="#features"
                                className="border-2 border-athletica-blue-mid text-athletica-blue-dark font-semibold px-8 py-3 rounded-xl hover:bg-athletica-blue-light/20 transition-all duration-200"
                            >
                                Lihat Fitur
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            <section id="features" className="py-20 px-4 bg-white">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 bg-athletica-blue-light/20 px-4 py-2 rounded-full mb-4">
                            <Sparkles className="h-4 w-4 text-athletica-blue-dark" />
                            <span className="text-athletica-blue-dark font-medium text-sm">Why Choose Us</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-athletica-blue-dark mb-4">
                            Fitur Unggulan
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Kemudahan akses fitness dengan berbagai fitur yang kami sediakan
                        </p>
                    </div>
                    <FeatureCards />
                </div>
            </section>

            <section id="classes" className="py-20 px-4 bg-athletica-cream">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-athletica-blue-dark mb-4">
                            Kelas Populer
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Pilih kelas fitness favoritmu dan mulai perjalanan sehatmu
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {classes.map((classItem, index) => (
                            <div key={index} className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
                                <div className="h-48 bg-athletica-blue-mid/20 flex items-center justify-center">
                                    <Dumbbell className="h-16 w-16 text-athletica-blue-mid" />
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-athletica-blue-dark mb-2">
                                        {classItem.name}
                                    </h3>
                                    <p className="text-gray-600 text-sm mb-4">
                                        {classItem.description}
                                    </p>
                                    <div className="flex justify-between items-center">
                                        <span className="text-athletica-blue-dark font-bold">
                                            Rp {classItem.price.toLocaleString()}
                                        </span>
                                        <span className="text-sm text-gray-500">
                                            Kapasitas: {classItem.capacity} org
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section id="membership" className="py-20 px-4 bg-white">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-athletica-blue-dark mb-4">
                            Pilih Membership
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Dapatkan akses unlimited dengan paket membership terbaik
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {memberships.map((membership, index) => (
                            <div
                                key={index}
                                className={`rounded-2xl p-6 text-center transition-all duration-300 ${membership.popular
                                    ? "bg-athletica-blue-dark text-white shadow-xl scale-105"
                                    : "bg-athletica-cream text-athletica-blue-dark"
                                    }`}
                            >
                                {membership.popular && (
                                    <div className="inline-flex items-center gap-1 bg-white/20 rounded-full px-3 py-1 text-sm mb-4">
                                        <Crown className="h-3 w-3" />
                                        Most Popular
                                    </div>
                                )}
                                <h3 className="text-2xl font-bold mb-2">{membership.name}</h3>
                                <div className="text-4xl font-bold mb-4">
                                    Rp {membership.price.toLocaleString()}
                                </div>
                                <p className="text-sm opacity-80 mb-6">{membership.duration}</p>
                                <ul className="text-left space-y-3 mb-8">
                                    {membership.benefits.map((benefit, i) => (
                                        <li key={i} className="flex items-center gap-2 text-sm">
                                            <CheckCircle className="h-4 w-4 flex-shrink-0" />
                                            {benefit}
                                        </li>
                                    ))}
                                </ul>
                                <button className="w-full py-2 rounded-xl font-semibold transition-all duration-200 bg-white text-athletica-blue-dark hover:bg-gray-100">
                                    Pilih Paket
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-20 px-4 bg-athletica-blue-dark">
                <div className="container mx-auto max-w-4xl text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Siap Memulai Perjalanan Fitnesmu?
                    </h2>
                    <p className="text-athletica-blue-light mb-8">
                        Daftar sekarang dan nikmati kemudahan booking kelas fitness
                    </p>
                    <Link
                        to="/register"
                        className="inline-flex items-center gap-2 bg-white text-athletica-blue-dark font-semibold px-8 py-3 rounded-xl hover:bg-gray-100 transition-all duration-200"
                    >
                        Daftar Sekarang
                        <ArrowRight className="h-5 w-5" />
                    </Link>
                </div>
            </section>

            <footer className="py-10 px-4 bg-athletica-cream border-t border-athletica-blue-mid/20">
                <div className="container mx-auto max-w-6xl text-center">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <Dumbbell className="h-6 w-6 text-athletica-blue-dark" />
                        <span className="text-xl font-bold text-athletica-blue-dark">Athletica</span>
                    </div>
                    <p className="text-gray-500 text-sm">
                        &copy; 2026 Athletica Fitness. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
};

const classes = [
    {
        name: "Yoga",
        description: "Relaksasi tubuh dan pikiran dengan gerakan yoga",
        price: 100000,
        capacity: 15
    },
    {
        name: "Zumba",
        description: "Senam aerobik energik dengan musik latin",
        price: 120000,
        capacity: 20
    },
    {
        name: "Weight Training",
        description: "Latihan beban untuk membentuk otot",
        price: 150000,
        capacity: 10
    }
];

const memberships = [
    {
        name: "Basic",
        price: 350000,
        duration: "30 hari",
        benefits: ["4x kelas per bulan", "Akses semua kelas", "Diskon merchandise 10%"],
        popular: false
    },
    {
        name: "Premium",
        price: 750000,
        duration: "30 hari",
        benefits: ["Unlimited kelas", "Akses semua kelas", "Diskon merchandise 20%", "Free konsultasi trainer"],
        popular: true
    },
    {
        name: "Platinum",
        price: 1500000,
        duration: "90 hari",
        benefits: ["Unlimited kelas", "Akses semua kelas", "Diskon merchandise 30%", "Free konsultasi trainer", "Free merch eksklusif"],
        popular: false
    }
];

export default LandingPage;