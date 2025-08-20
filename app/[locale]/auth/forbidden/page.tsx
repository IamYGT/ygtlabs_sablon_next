"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Home, Mail, Shield } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ForbiddenPage() {
    const [mounted, setMounted] = useState(false);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        setMounted(true);

        // Kullanıcının mevcut rolünü kontrol et
        async function checkUserRole() {
            try {
                const response = await fetch('/api/auth/current-user', {
                    credentials: 'include'
                });

                if (response.ok) {
                    const data = await response.json();
                    const user = data.user;
                    setUserRole(user?.role || null);

                    // Rol bilgisini sadece göster, yönlendirme yapma
                    console.log('User role on forbidden page:', user?.primaryRole);
                } else {
                    setUserRole(null);
                }
            } catch (error) {
                console.error('Auth check failed:', error);
                setUserRole(null);
            } finally {
                setLoading(false);
            }
        }

        checkUserRole();
    }, [router]);

    if (!mounted || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Kontrol ediliyor...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 flex items-center justify-center p-4">
            <div className="w-full max-w-lg">
                {/* Ana Kart */}
                <Card className="relative overflow-hidden border-0 shadow-2xl">
                    {/* Üst gradient arka plan */}
                    <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-orange-500/10" />

                    <CardHeader className="relative text-center pt-8 pb-6">
                        {/* Büyük uyarı simgesi */}
                        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                            <Shield className="h-10 w-10 text-red-600 dark:text-red-400" />
                        </div>

                        <CardTitle className="text-2xl font-bold text-red-600 dark:text-red-400">
                            Erişim Reddedildi
                        </CardTitle>
                        <CardDescription className="text-base mt-2 text-muted-foreground">
                            Bu sayfaya erişim yetkiniz bulunmamaktadır
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="relative space-y-6 pb-8">
                        {/* Açıklama metni */}
                        <div className="text-center space-y-3">
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Bu sayfa sadece yetkilendirilmiş kullanıcılar tarafından görüntülenebilir.
                                Eğer bu sayfaya erişmeniz gerektiğini düşünüyorsanız:
                            </p>
                            <ul className="text-sm text-muted-foreground space-y-1 text-left max-w-sm mx-auto">
                                <li className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-red-400 rounded-full flex-shrink-0 mt-1.5"></div>
                                    Doğru hesapla giriş yaptığınızdan emin olun
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-red-400 rounded-full flex-shrink-0 mt-1.5"></div>
                                    Gerekli yetkilere sahip olduğunuzu kontrol edin
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-red-400 rounded-full flex-shrink-0 mt-1.5"></div>
                                    Sistem yöneticisiyle iletişime geçin
                                </li>
                            </ul>
                        </div>

                        {/* Aksiyon butonları */}
                        <div className="space-y-3">
                            <Link href="/" className="w-full">
                                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                                    <Home className="mr-2 h-4 w-4" />
                                    Ana Sayfaya Dön
                                </Button>
                            </Link>

                            {userRole ? (
                                <Link href={userRole === 'USER' ? '/customer/dashboard' : '/'} className="w-full">
                                    <Button variant="outline" className="w-full">
                                        <ArrowLeft className="mr-2 h-4 w-4" />
                                        {userRole === 'USER' ? 'Kullanıcı Paneline Dön' : 'Ana Sayfaya Dön'}
                                    </Button>
                                </Link>
                            ) : (
                                <Link href="/auth/login" className="w-full">
                                    <Button variant="outline" className="w-full">
                                        <ArrowLeft className="mr-2 h-4 w-4" />
                                        Giriş Sayfasına Dön
                                    </Button>
                                </Link>
                            )}
                        </div>

                        {/* İletişim bilgisi */}
                        <div className="pt-4 border-t border-border/50">
                            <div className="text-center">
                                <p className="text-xs text-muted-foreground mb-2">
                                    Yardıma mı ihtiyacınız var?
                                </p>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-xs h-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/20"
                                    asChild
                                >
                                    <a href="mailto:support@ecusis.com">
                                        <Mail className="mr-1 h-3 w-3" />
                                        Destek Ekibiyle İletişime Geç
                                    </a>
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Alt bilgi */}
                <div className="text-center mt-6">
                    <p className="text-xs text-muted-foreground">
                        Hata Kodu: <span className="font-mono font-medium">403</span> |
                        Zaman: <span className="font-mono">{new Date().toLocaleString('tr-TR')}</span>
                    </p>
                </div>
            </div>
        </div>
    );
} 