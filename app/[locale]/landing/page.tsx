'use client';

import { useRouter } from "next/navigation";
import React from "react";

const LandingPage: React.FC = () => {
    const router = useRouter();

    const handleNavigate = (path: string) => {
        router.push(path);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <h1 className="text-4xl font-bold mb-8 text-black text-center">CRM Sistemi</h1>
            <p className="text-lg text-gray-600 mb-12 text-center max-w-2xl">
                ECU chiptuning ve araç yönetimi için kapsamlı çözüm
            </p>

            <div className="flex gap-8 mb-8">
                <button
                    className="px-8 py-4 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200 text-lg font-semibold"
                    onClick={() => handleNavigate("/admin")}
                    aria-label="Yönetici Paneline Git"
                    tabIndex={0}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                            handleNavigate("/admin");
                        }
                    }}
                >
                    📊 Admin Paneli
                </button>
                <button
                    className="px-8 py-4 bg-green-600 text-white rounded-lg shadow-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 transition duration-200 text-lg font-semibold"
                    onClick={() => handleNavigate("/customer")}
                    aria-label="Müşteri Paneline Git"
                    tabIndex={0}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                            handleNavigate("/customer");
                        }
                    }}
                >
                    👤 Müşteri Paneli
                </button>
            </div>

            <div className="text-center text-gray-500">
                <p>© 2024 CRM Admin. Tüm hakları saklıdır.</p>
            </div>
        </div>
    );
};

export default LandingPage;