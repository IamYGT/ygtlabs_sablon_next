'use client';

import React, { useState, useEffect } from "react";
import "@/app/[locale]/globals.css";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Copy, Eye, EyeOff, Lock, Unlock, BookOpen, Terminal, AlertTriangle, Moon, Sun } from "lucide-react";

const DocumentPage: React.FC = () => {
    const _router = useRouter();
    const { theme: _theme, setTheme, resolvedTheme } = useTheme();
    const [password, setPassword] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [copiedCode, setCopiedCode] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);

    // Basit şifre - production'da environment'dan alınmalı
    const correctPassword = process.env.DOCUMENT_PASSWORD || 'crm2024';

    // Sayfa yüklendiğinde dark tema yap
    useEffect(() => {
        setMounted(true);
        setTheme('dark');
    }, [setTheme]);

    const handleLogin = () => {
        if (password === correctPassword) {
            setIsAuthenticated(true);
        } else {
            alert('Hatalı şifre!');
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleLogin();
        }
    };

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedCode(text);
            setTimeout(() => setCopiedCode(null), 2000);
        } catch (err) {
            console.error('Kopyalama başarısız:', err);
        }
    };

    const apiExamples = [
        {
            method: 'GET',
            endpoint: '/api/public/customers',
            description: 'Tüm müşterileri listele',
            icon: '📋',
            code: `fetch('https://fdggfh-73pn1zxc9-storytels-projects.vercel.app/api/public/customers?x-vercel-set-bypass-cookie=true&x-vercel-protection-bypass=HGyEfnPvfMTdOrZbuYpdVEgGcVtJYeVr', {
  headers: {
    'Authorization': 'Bearer crm-api-token-2025'
  }
})
  .then(response => response.json())
  .then(data => console.log(data));`
        },
        {
            method: 'POST',
            endpoint: '/api/public/customers',
            description: 'Yeni müşteri ekle',
            icon: '➕',
            code: `fetch('https://fdggfh-73pn1zxc9-storytels-projects.vercel.app/api/public/customers?x-vercel-set-bypass-cookie=true&x-vercel-protection-bypass=HGyEfnPvfMTdOrZbuYpdVEgGcVtJYeVr', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer crm-api-token-2025'
  },
  body: JSON.stringify({
    name: 'Ahmet Yılmaz',
    email: 'ahmet@example.com',
    phone: '+905551234567',
    company: 'Test Şirketi'
  })
})
.then(response => response.json())
.then(data => console.log(data));`
        },
        {
            method: 'PUT',
            endpoint: '/api/public/customers/[id]',
            description: 'Müşteri güncelle',
            icon: '✏️',
            code: `fetch('https://fdggfh-73pn1zxc9-storytels-projects.vercel.app/api/public/customers/clx2b3c4d5e6f7g8h9i0?x-vercel-set-bypass-cookie=true&x-vercel-protection-bypass=HGyEfnPvfMTdOrZbuYpdVEgGcVtJYeVr', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer crm-api-token-2025'
  },
  body: JSON.stringify({
    name: 'Güncellenmiş İsim',
    phone: '+905559876543'
  })
})
.then(response => response.json())
.then(data => console.log(data));`
        },
        {
            method: 'DELETE',
            endpoint: '/api/public/customers/[id]',
            description: 'Müşteri sil',
            icon: '🗑️',
            code: `fetch('https://fdggfh-73pn1zxc9-storytels-projects.vercel.app/api/public/customers/clx2b3c4d5e6f7g8h9i0?x-vercel-set-bypass-cookie=true&x-vercel-protection-bypass=HGyEfnPvfMTdOrZbuYpdVEgGcVtJYeVr', {
  method: 'DELETE',
  headers: {
    'Authorization': 'Bearer crm-api-token-2025'
  }
})
.then(response => response.json())
.then(data => console.log(data));`
        }
    ];

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
                <Card className="w-full max-w-md shadow-2xl border-0">
                    <CardHeader className="text-center space-y-2">
                        <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <BookOpen className="w-8 h-8 text-white" />
                        </div>
                        <CardTitle className="text-2xl font-bold">API Dokümantasyonu</CardTitle>
                        <CardDescription>
                            CRM sistemine erişmek için lütfen şifrenizi girin
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="password">Şifre</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Şifreyi girin..."
                                    className="pr-10"
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </Button>
                            </div>
                        </div>
                        <Button
                            onClick={handleLogin}
                            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                        >
                            <Lock className="w-4 h-4 mr-2" />
                            Giriş Yap
                        </Button>
                    </CardContent>
                </Card>

                {/* Tema Geçiş Butonu - Şifre Ekranı */}
                {mounted && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
                        className="fixed top-4 right-4 z-50 bg-background/80 backdrop-blur-sm border border-border/50 hover:bg-background/90"
                    >
                        {resolvedTheme === 'dark' ? (
                            <Sun className="h-4 w-4" />
                        ) : (
                            <Moon className="h-4 w-4" />
                        )}
                    </Button>
                )}
            </div>
        );
    }

    return (
        <>
            {/* Tema Geçiş Butonu - Ana Sayfa */}
            {mounted && (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
                    className="fixed top-4 right-4 z-50 bg-background/80 backdrop-blur-sm border border-border/50 hover:bg-background/90"
                >
                    {resolvedTheme === 'dark' ? (
                        <Sun className="h-4 w-4" />
                    ) : (
                        <Moon className="h-4 w-4" />
                    )}
                </Button>
            )}

            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
                <div className="container mx-auto p-6 space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            🚀 CRM API Dokümantasyonu
                        </h1>
                        <p className="text-muted-foreground">
                            Müşteri yönetimi API&apos;si için kapsamlı dokümantasyon
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        onClick={() => setIsAuthenticated(false)}
                        className="flex items-center gap-2"
                    >
                        <Unlock className="w-4 h-4" />
                        Çıkış Yap
                    </Button>
                </div>

                <Tabs defaultValue="overview" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-4 lg:w-auto">
                        <TabsTrigger value="overview">Genel Bakış</TabsTrigger>
                        <TabsTrigger value="endpoints">Endpoint&apos;ler</TabsTrigger>
                        <TabsTrigger value="examples">Örnekler</TabsTrigger>
                        <TabsTrigger value="test">Test</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                                            🔗
                                        </div>
                                        API Bilgileri
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-sm font-medium">Base URL:</span>
                                        <code className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-sm">/api/public/customers</code>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm font-medium">Format:</span>
                                        <Badge variant="secondary">REST API</Badge>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm font-medium">Authentication:</span>
                                        <Badge variant="outline">Bearer Token</Badge>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium">Access Token:</span>
                                        <div className="flex items-center gap-2">
                                            <code className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-sm">crm-api-token-2025</code>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => copyToClipboard('crm-api-token-2025')}
                                            >
                                                <Copy className="w-3 h-3" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                                            ✅
                                        </div>
                                        Supported Methods
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 gap-2">
                                        <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50">GET</Badge>
                                        <Badge variant="default" className="bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50">POST</Badge>
                                        <Badge variant="default" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:hover:bg-yellow-900/50">PUT</Badge>
                                        <Badge variant="default" className="bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50">DELETE</Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                                    Önemli Notlar
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 text-sm">
                                    <li className="flex items-start gap-2">
                                        <span className="text-amber-500 mt-0.5">•</span>
                                        Bu API sadece yetkili kullanıcılar tarafından kullanılabilir
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-amber-500 mt-0.5">•</span>
                                        Access token&apos;ı güvende tutun ve asla paylaşmayın
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-amber-500 mt-0.5">•</span>
                                        Production ortamında token&apos;ı environment variable&apos;dan alın
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-amber-500 mt-0.5">•</span>
                                        Tüm istekler HTTPS üzerinden yapılmalıdır
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="endpoints" className="space-y-6">
                        <div className="grid gap-4">
                            {apiExamples.map((example, index) => (
                                <Card key={index}>
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center gap-3">
                                                <div className="text-2xl">{example.icon}</div>
                                                <div>
                                                    <CardTitle className="text-lg">{example.description}</CardTitle>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <Badge variant={
                                                            example.method === 'GET' ? 'default' :
                                                            example.method === 'POST' ? 'secondary' :
                                                            example.method === 'PUT' ? 'outline' : 'destructive'
                                                        }>
                                                            {example.method}
                                                        </Badge>
                                                        <code className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-sm">{example.endpoint}</code>
                                                    </div>
                                                </div>
                                            </div>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => copyToClipboard(example.code)}
                                                className="flex items-center gap-1"
                                            >
                                                <Copy className="w-3 h-3" />
                                                {copiedCode === example.code ? 'Kopyalandı!' : 'Kopyala'}
                                            </Button>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
                                            <code>{example.code}</code>
                                        </pre>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="examples" className="space-y-6">
                        <div className="grid gap-6 lg:grid-cols-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Terminal className="w-5 h-5" />
                                        cURL Örnekleri
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ScrollArea className="h-64">
                                        <div className="space-y-4 text-sm">
                                            <div>
                                                <p className="font-medium mb-2">Müşteri Listele:</p>
                                                <pre className="bg-slate-900 text-slate-100 p-3 rounded text-xs">
{`curl -H "Authorization: Bearer crm-api-token-2025" \\
  "https://fdggfh-73pn1zxc9-storytels-projects.vercel.app/api/public/customers?x-vercel-set-bypass-cookie=true&x-vercel-protection-bypass=HGyEfnPvfMTdOrZbuYpdVEgGcVtJYeVr"`}
                                                </pre>
                                            </div>
                                            <Separator />
                                            <div>
                                                <p className="font-medium mb-2">Yeni Müşteri Ekle:</p>
                                                <pre className="bg-slate-900 text-slate-100 p-3 rounded text-xs">
{`curl -X POST "https://fdggfh-73pn1zxc9-storytels-projects.vercel.app/api/public/customers?x-vercel-set-bypass-cookie=true&x-vercel-protection-bypass=HGyEfnPvfMTdOrZbuYpdVEgGcVtJYeVr" \\
  -H "Authorization: Bearer crm-api-token-2025" \\
  -H "Content-Type: application/json" \\
  -d '{"name":"Test Müşteri"}'`}
                                                </pre>
                                            </div>
                                        </div>
                                    </ScrollArea>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <BookOpen className="w-5 h-5" />
                                        Dokümantasyon Dosyaları
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex items-center justify-between p-3 border rounded-lg">
                                        <div>
                                            <p className="font-medium">API_DOCUMENTATION.md</p>
                                            <p className="text-sm text-muted-foreground">Detaylı API dokümantasyonu</p>
                                        </div>
                                        <Button size="sm" variant="outline">
                                            <a href="/API_DOCUMENTATION.md" target="_blank">Görüntüle</a>
                                        </Button>
                                    </div>
                                    <div className="flex items-center justify-between p-3 border rounded-lg">
                                        <div>
                                            <p className="font-medium">README_API.md</p>
                                            <p className="text-sm text-muted-foreground">Hızlı başlangıç kılavuzu</p>
                                        </div>
                                        <Button size="sm" variant="outline">
                                            <a href="/README_API.md" target="_blank">Görüntüle</a>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="test" className="space-y-6">
                        <Alert>
                            <Terminal className="h-4 w-4" />
                            <AlertTitle>Hızlı Test</AlertTitle>
                            <AlertDescription>
                                Aşağıdaki komutları terminalde çalıştırarak API&apos;yi test edebilirsiniz.
                            </AlertDescription>
                        </Alert>

                        <Card>
                            <CardHeader>
                                <CardTitle>Test Komutları</CardTitle>
                                <CardDescription>
                                    Her komutu sırayla çalıştırarak API fonksiyonlarını test edin
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ScrollArea className="h-96">
                                    <div className="space-y-4">
                                        <div>
                                            <Badge className="mb-2">1. Müşteri Listele</Badge>
                                            <pre className="bg-slate-900 text-slate-100 p-4 rounded text-sm">
{`curl -H "Authorization: Bearer crm-api-token-2025" \\
  "https://fdggfh-73pn1zxc9-storytels-projects.vercel.app/api/public/customers?x-vercel-set-bypass-cookie=true&x-vercel-protection-bypass=HGyEfnPvfMTdOrZbuYpdVEgGcVtJYeVr"`}
                                            </pre>
                                        </div>
                                        <Separator />
                                        <div>
                                            <Badge className="mb-2">2. Yeni Müşteri Oluştur</Badge>
                                            <pre className="bg-slate-900 text-slate-100 p-4 rounded text-sm">
{`curl -X POST "https://fdggfh-73pn1zxc9-storytels-projects.vercel.app/api/public/customers?x-vercel-set-bypass-cookie=true&x-vercel-protection-bypass=HGyEfnPvfMTdOrZbuYpdVEgGcVtJYeVr" \\
  -H "Authorization: Bearer crm-api-token-2025" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Test Müşteri",
    "email": "test@example.com",
    "phone": "+905551234567"
  }'`}
                                            </pre>
                                        </div>
                                        <Separator />
                                        <div>
                                            <Badge className="mb-2">3. Müşteri Güncelle</Badge>
                                            <pre className="bg-slate-900 text-slate-100 p-4 rounded text-sm">
{`curl -X PUT "https://fdggfh-73pn1zxc9-storytels-projects.vercel.app/api/public/customers/clx2b3c4d5e6f7g8h9i0?x-vercel-set-bypass-cookie=true&x-vercel-protection-bypass=HGyEfnPvfMTdOrZbuYpdVEgGcVtJYeVr" \\
  -H "Authorization: Bearer crm-api-token-2025" \\
  -H "Content-Type: application/json" \\
  -d '{"name": "Güncellenmiş İsim"}'`}
                                            </pre>
                                        </div>
                                    </div>
                                </ScrollArea>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
        </>
    );
};

export default DocumentPage;