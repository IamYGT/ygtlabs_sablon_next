"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

// Hata mesajını işleyen ve gösteren Client Component
function ErrorMessageDisplay() {
    const searchParams = useSearchParams();
    const error = searchParams.get("error");
    const [errorMessage, setErrorMessage] = useState("Bir kimlik doğrulama hatası oluştu."); // Varsayılan mesaj

    useEffect(() => {
        // Hata koduna göre mesajı ayarla
        switch (error) {
            case "CredentialsSignin":
                setErrorMessage("Giriş bilgileri hatalı. Lütfen tekrar deneyin.");
                break;
            case "AccessDenied":
                setErrorMessage("Bu sayfaya erişim izniniz yok.");
                break;
            case "unauthorized":
                setErrorMessage("Yalnızca admin kullanıcıları giriş yapabilir.");
                break;
            case "Verification":
                setErrorMessage("Doğrulama bağlantısı geçersiz veya süresi dolmuş.");
                break;
            case "OAuthCallback":
                setErrorMessage("OAuth sağlayıcısından hatalı yanıt. Lütfen tekrar deneyin.");
                break;
            // Diğer potansiyel NextAuth hataları...
            default:
                // Eğer error varsa ama bilinen bir kod değilse, onu gösterelim
                if (error) {
                    setErrorMessage(`Hata Kodu: ${error}`);
                } // Yoksa varsayılan mesaj kalır
                break;
        }
    }, [error]);

    return (
        <p className="text-red-500 font-medium">{errorMessage}</p>
    );
}

// Ana sayfa bileşeni (Server Component olabilir)
export default function AuthErrorPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-8 h-8 text-red-600"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                        />
                    </svg>
                </div>
                <h1 className="text-2xl font-bold text-gray-800">Kimlik Doğrulama Hatası</h1>

                {/* Suspense ile sarmalanmış hata mesajı */}
                <Suspense fallback={<p className="text-gray-500">Hata mesajı yükleniyor...</p>}>
                    <ErrorMessageDisplay />
                </Suspense>

                <div className="flex flex-col space-y-3 pt-4">
                    <Link
                        href="/auth/login"
                        className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Giriş Sayfasına Dön
                    </Link>
                    <Link
                        href="/"
                        className="w-full py-2 px-4 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    >
                        Ana Sayfaya Dön
                    </Link>
                </div>
            </div>
        </div>
    );
} 