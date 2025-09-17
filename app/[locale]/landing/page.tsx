'use client';

import { useRouter } from "next/navigation";
import React from "react";

const LandingPage: React.FC = () => {
    const router = useRouter();

    const handleNavigate = (path: string) => {
        router.push(path);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-3xl font-bold mb-8 text-black">Hoşgeldiniz!</h1>
            <div className="flex gap-6">
                <button
                    className="px-6 py-3 bg-blue-600 text-black rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    onClick={() => handleNavigate("/admin")}
                    aria-label="Yönetici Paneline Git"
                    tabIndex={0}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                            handleNavigate("/admin");
                        }
                    }}
                >
                    Admin Paneli
                </button>
                <button
                    className="px-6 py-3 bg-green-600 text-black rounded-lg shadow hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400"
                    onClick={() => handleNavigate("/customer")}
                    aria-label="Müşteri Paneline Git"
                    tabIndex={0}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                            handleNavigate("/customer");
                        }
                    }}
                >
                    Müşteri Paneli
                </button>
            </div>
        </div>
    );
};

export default LandingPage;