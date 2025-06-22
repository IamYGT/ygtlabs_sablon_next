import { ArrowLeft, LogIn } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function UnauthorizedPage() {
    return (
        <div className="container mx-auto flex items-center justify-center min-h-screen">
            <Card className="w-full max-w-md">
                <CardHeader className="bg-amber-50 dark:bg-amber-900/20">
                    <CardTitle className="text-amber-600 dark:text-amber-400 flex items-center gap-2">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-6 w-6"
                        >
                            <path d="M12 9v4" />
                            <path d="M12 17h.01" />
                            <path d="m9 2 9 3 3 9-3 9-9 3-9-3-3-9 3-9Z" />
                        </svg>
                        Giriş Gerekli
                    </CardTitle>
                    <CardDescription>
                        Bu sayfaya erişmek için giriş yapmanız gerekmektedir.
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                    <p className="text-sm text-muted-foreground">
                        İstediğiniz sayfaya erişebilmek için lütfen hesabınıza giriş yapın. Hesabınız yoksa veya yardıma ihtiyacınız varsa, lütfen sistem yöneticisiyle iletişime geçin.
                    </p>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Link
                        href="/"
                        className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Ana Sayfaya Dön
                    </Link>
                    <Button asChild>
                        <Link href="/auth/login">
                            <LogIn className="mr-2 h-4 w-4" />
                            Giriş Yap
                        </Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
} 