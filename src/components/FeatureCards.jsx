import { Calendar, CreditCard, Users, Shield, ChevronRight } from "lucide-react";

export default function FeatureCardsSimple() {
    const items = [
        {
            title: "Booking Kelas Online",
            description: "Booking kelas fitness kapan saja dan dimana saja dengan mudah",
            icon: Calendar,
        },
        {
            title: "Pembayaran Digital",
            description: "Bayar mudah dengan berbagai metode pembayaran via Midtrans",
            icon: CreditCard,
        },
        {
            title: "Manajemen Trainer",
            description: "Trainer dapat mengatur jadwal dan melihat daftar peserta",
            icon: Users,
        },
        {
            title: "Sistem Membership",
            description: "Nikmati benefit unlimited dengan paket membership terbaik",
            icon: Shield,
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8 md:mt-12 lg:mt-20">
            {items.map((item, index) => (
                <div
                    key={index}
                    className="rounded-2xl p-6 transition-all duration-300 hover:shadow-athletica bg-athletica-card"
                >
                    <div className="bg-athletica-card-icon w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                        <item.icon className="h-7 w-7 text-athletica-card-title" />
                    </div>
                    <h3 className="text-lg md:text-xl font-bold mb-2 text-athletica-card-title">
                        {item.title}
                    </h3>
                    <p className="text-sm mb-4 text-athletica-card-desc">
                        {item.description}
                    </p>
                    <a
                        href="#"
                        className="inline-flex items-center gap-1 font-medium text-sm mt-2 hover:gap-2 transition-all text-athletica-card-link"
                    >
                        Selengkapnya
                        <ChevronRight className="h-3 w-3" />
                    </a>
                </div>
            ))}
        </div>
    );
};
