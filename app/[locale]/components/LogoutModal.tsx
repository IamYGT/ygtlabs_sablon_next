import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { LogOut, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { useLogout } from "@/lib/hooks/useAuth";

interface LogoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    logoutType: 'current' | 'all'; // 'current' = bu cihaz, 'all' = tüm cihazlar
}

export default function LogoutModal({ isOpen, onClose, logoutType }: LogoutModalProps) {
    const [mounted, setMounted] = useState(false);
    const logoutMutation = useLogout();

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    const handleConfirmLogout = async () => {
        if (logoutMutation.isPending) return;

        try {
            await logoutMutation.mutateAsync(logoutType === 'all');
            onClose();
        } catch (error) {
            console.error("Çıkış hatası:", error);
            toast.error("Çıkış yapılırken bir hata oluştu");
        }
    };

    const handleCancel = () => {
        if (logoutMutation.isPending) return;
        onClose();
    };

    if (!mounted || !isOpen) return null;

    const modalContent = (
        <div
            className="fixed inset-0 z-[999999] flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    onClose();
                }
            }}
        >
            <div
                className="bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 w-full max-w-md p-6"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-full bg-red-50 dark:bg-red-950 flex items-center justify-center">
                        <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                            Çıkış Yapmak İstediğinizden Emin misiniz?
                        </h2>
                    </div>
                </div>

                {/* Content */}
                <div className="mb-6">
                    <p className="text-slate-600 dark:text-slate-300">
                        {logoutType === 'all' ? (
                            <>
                                <strong className="text-slate-800 dark:text-slate-200">Tüm cihazlardan</strong> çıkış yapacaksınız. Bu işlem sonrasında:
                            </>
                        ) : (
                            <>
                                <strong className="text-slate-800 dark:text-slate-200">Bu cihazdan</strong> çıkış yapacaksınız. Bu işlem sonrasında:
                            </>
                        )}
                    </p>

                    <ul className="mt-2 ml-4 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                        {logoutType === 'all' ? (
                            <>
                                <li>• Tüm aktif oturumlarınız sonlandırılacak</li>
                                <li>• Diğer cihazlardaki erişimleriniz kesilecek</li>
                                <li>• Tekrar giriş yapmanız gerekecek</li>
                            </>
                        ) : (
                            <>
                                <li>• Mevcut oturumunuz sonlandırılacak</li>
                                <li>• Diğer cihazlardaki oturumlarınız devam edecek</li>
                                <li>• Tekrar giriş yapmanız gerekecek</li>
                            </>
                        )}
                    </ul>
                </div>

                {/* Footer */}
                <div className="flex gap-2">
                    <button
                        onClick={handleCancel}
                        className="flex-1 px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600 rounded-md transition-colors"
                        disabled={logoutMutation.isPending}
                    >
                        İptal
                    </button>
                    <button
                        onClick={handleConfirmLogout}
                        disabled={logoutMutation.isPending}
                        className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 text-white rounded-md transition-colors flex items-center justify-center"
                    >
                        {logoutMutation.isPending ? (
                            <>
                                <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                Çıkış yapılıyor...
                            </>
                        ) : (
                            <>
                                <LogOut className="h-4 w-4 mr-2" />
                                {logoutType === 'all' ? "Tüm Cihazlardan Çık" : "Bu Cihazdan Çık"}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
} 