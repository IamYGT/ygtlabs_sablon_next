"use client";

import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Key, Lock } from "lucide-react";
import { toast } from "sonner";

interface ChangePasswordModalProps {
    children: React.ReactNode;
}

export default function ChangePasswordModal({ children }: ChangePasswordModalProps) {
    const [open, setOpen] = useState(false);
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false,
    });
    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [isLoading, setIsLoading] = useState(false);

    const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
        setShowPasswords(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validasyon
        if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
            toast.error("Tüm alanları doldurun");
            return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            toast.error("Yeni şifreler eşleşmiyor");
            return;
        }

        if (formData.newPassword.length < 6) {
            toast.error("Yeni şifre en az 6 karakter olmalıdır");
            return;
        }

        if (formData.currentPassword === formData.newPassword) {
            toast.error("Yeni şifre mevcut şifreden farklı olmalıdır");
            return;
        }

        setIsLoading(true);

        try {
            // API çağrısı devre dışı - demo mode
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay

            toast.success("Şifre değiştirildi (demo mod)");
            setFormData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
            setOpen(false);
        } catch (_error) {
            toast.error("Şifre değiştirilirken hata oluştu");
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setFormData({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        });
        setShowPasswords({
            current: false,
            new: false,
            confirm: false,
        });
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Lock className="h-5 w-5" />
                        Şifre Değiştir
                    </DialogTitle>
                    <DialogDescription>
                        Güvenliğiniz için mevcut şifrenizi girin ve yeni şifrenizi belirleyin.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Mevcut Şifre */}
                    <div className="space-y-2">
                        <Label htmlFor="currentPassword">Mevcut Şifre</Label>
                        <div className="relative">
                            <Input
                                id="currentPassword"
                                type={showPasswords.current ? "text" : "password"}
                                value={formData.currentPassword}
                                onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                                placeholder="Mevcut şifrenizi girin"
                                className="pr-10"
                                disabled={isLoading}
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => togglePasswordVisibility('current')}
                                disabled={isLoading}
                            >
                                {showPasswords.current ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* Yeni Şifre */}
                    <div className="space-y-2">
                        <Label htmlFor="newPassword">Yeni Şifre</Label>
                        <div className="relative">
                            <Input
                                id="newPassword"
                                type={showPasswords.new ? "text" : "password"}
                                value={formData.newPassword}
                                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                                placeholder="Yeni şifrenizi girin"
                                className="pr-10"
                                disabled={isLoading}
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => togglePasswordVisibility('new')}
                                disabled={isLoading}
                            >
                                {showPasswords.new ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* Yeni Şifre Tekrar */}
                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Yeni Şifre (Tekrar)</Label>
                        <div className="relative">
                            <Input
                                id="confirmPassword"
                                type={showPasswords.confirm ? "text" : "password"}
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                placeholder="Yeni şifrenizi tekrar girin"
                                className="pr-10"
                                disabled={isLoading}
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => togglePasswordVisibility('confirm')}
                                disabled={isLoading}
                            >
                                {showPasswords.confirm ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* Şifre Gereksinimleri */}
                    <div className="text-xs text-gray-500 space-y-1 bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                        <p className="font-medium">Şifre gereksinimleri:</p>
                        <ul className="space-y-1">
                            <li>• En az 6 karakter uzunluğunda olmalıdır</li>
                            <li>• Mevcut şifreden farklı olmalıdır</li>
                            <li>• Güçlü bir şifre kullanmanız önerilir</li>
                        </ul>
                    </div>

                    {/* Butonlar */}
                    <div className="flex gap-2 pt-4">
                        <Button
                            type="submit"
                            className="flex-1 gap-2"
                            disabled={isLoading}
                        >
                            <Key className="h-4 w-4" />
                            {isLoading ? "Değiştiriliyor..." : "Şifreyi Değiştir"}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={isLoading}
                        >
                            İptal
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
} 