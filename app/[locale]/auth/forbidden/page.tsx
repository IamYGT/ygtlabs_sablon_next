"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Home, Lock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ForbiddenPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-800/20 flex items-center justify-center p-4">
            <Card className="w-full max-w-md text-center shadow-xl border-0">
                <CardHeader className="pt-8 pb-4">
                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                        <Lock className="h-10 w-10 text-primary" />
                    </div>
                    <CardTitle className="text-3xl font-bold">
                        Erişim Engellendi
                    </CardTitle>
                    <CardDescription className="text-lg mt-2 text-muted-foreground">
                        Bu sayfaya erişim yetkiniz bulunmamaktadır.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pb-8">
                    <p className="text-muted-foreground">
                        Gerekli yetkilere sahip olmadığınız için bu sayfayı görüntüleyemezsiniz. Lütfen sistem yöneticinizle iletişime geçin.
                    </p>
                    <div className="flex w-full flex-col sm:flex-row gap-3">
                        <Button
                            onClick={() => router.back()}
                            variant="outline"
                            className="w-full"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Geri Dön
                        </Button>
                        <Link href="/admin/dashboard" className="w-full">
                            <Button className="w-full">
                                <Home className="mr-2 h-4 w-4" />
                                Ana Panele Dön
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}