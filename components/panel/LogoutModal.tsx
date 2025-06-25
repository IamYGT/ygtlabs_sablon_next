import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { LogOut, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { useLogout } from "@/lib/hooks/useAuth";
import { useTranslations } from "next-intl";

interface LogoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    logoutType: 'current' | 'all'; // 'current' = bu cihaz, 'all' = tüm cihazlar
}

export default function LogoutModal({ isOpen, onClose, logoutType }: LogoutModalProps) {
    const t = useTranslations('LogoutModal');
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
            console.error("Logout error:", error);
            toast.error(t('error'));
        }
    };

    const handleCancel = () => {
        if (logoutMutation.isPending) return;
        onClose();
    };

    if (!mounted || !isOpen) return null;

    const listItems = logoutType === 'all'
        ? t.raw('listAll') as string[]
        : t.raw('listCurrent') as string[];

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
                            {t('title')}
                        </h2>
                    </div>
                </div>

                {/* Content */}
                <div className="mb-6">
                    <p className="text-slate-600 dark:text-slate-300">
                        {logoutType === 'all'
                            ? t('descriptionAll')
                            : t('descriptionCurrent')
                        }
                    </p>

                    <ul className="mt-2 ml-4 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                        {Array.isArray(listItems) && listItems.map((item, index) => (
                            <li key={index}>• {item}</li>
                        ))}
                    </ul>
                </div>

                {/* Footer */}
                <div className="flex gap-2">
                    <button
                        onClick={handleCancel}
                        className="flex-1 px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600 rounded-md transition-colors"
                        disabled={logoutMutation.isPending}
                    >
                        {t('cancel')}
                    </button>
                    <button
                        onClick={handleConfirmLogout}
                        disabled={logoutMutation.isPending}
                        className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 text-white rounded-md transition-colors flex items-center justify-center"
                    >
                        {logoutMutation.isPending ? (
                            <>
                                <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                {t('loggingOut')}
                            </>
                        ) : (
                            <>
                                <LogOut className="h-4 w-4 mr-2" />
                                {logoutType === 'all' ? t('confirmAll') : t('confirmCurrent')}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
}