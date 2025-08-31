'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Shield, Bell, Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import toast from 'react-hot-toast';

// API'den gelen kullanıcı verisi tipi
interface UserProfile {
  id: string;
  name: string | null;
  email: string | null;
  profileImage: string | null;
}

interface GeneralSettingsProps {
    user: UserProfile;
    setUser: React.Dispatch<React.SetStateAction<UserProfile | null>>;
}

function GeneralSettings({ user, setUser }: GeneralSettingsProps) {
  const [name, setName] = useState(user.name || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    const toastId = toast.loading('Profil güncelleniyor...');
    try {
      const response = await fetch('/api/customer/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      const updatedUser = await response.json();
      if (!response.ok) {
        throw new Error(updatedUser.message || 'Bir hata oluştu.');
      }
      setUser(updatedUser);
      toast.success('Profil başarıyla güncellendi.', { id: toastId });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Bilinmeyen bir hata oluştu.', { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CardContent className="space-y-6">
      <div className="flex items-center space-x-6">
        <Avatar className="h-24 w-24">
          <AvatarImage src={user?.profileImage || undefined} alt={user?.name || ''} />
          <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
        </Avatar>
        <div className="space-y-2">
          <Button variant="outline" disabled>Resmi Değiştir (Yakında)</Button>
          <p className="text-xs text-muted-foreground">JPG, GIF veya PNG. Maks. 800KB.</p>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="name">Tam Ad</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">E-posta</Label>
        <Input id="email" type="email" value={user.email || ''} disabled />
      </div>
      <Button onClick={handleSave} disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Değişiklikleri Kaydet
      </Button>
    </CardContent>
  );
}

function SecuritySettings() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChangePassword = async () => {
    setIsLoading(true);
    const toastId = toast.loading('Şifre değiştiriliyor...');
    try {
      const response = await fetch('/api/customer/profile/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
      });
      const result = await response.json();
      if (!response.ok) {
        // Zod hatalarını birleştir
        const errorMessage = result.errors ? result.errors.map((e: { message: string }) => e.message).join(', ') : result.message;
        throw new Error(errorMessage || 'Bir hata oluştu.');
      }
      toast.success('Şifre başarıyla değiştirildi.', { id: toastId });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Bilinmeyen bir hata oluştu.', { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CardContent className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="current-password">Mevcut Şifre</Label>
        <Input id="current-password" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="new-password">Yeni Şifre</Label>
        <Input id="new-password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirm-password">Yeni Şifreyi Onayla</Label>
        <Input id="confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
      </div>
      <Button onClick={handleChangePassword} disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Şifreyi Değiştir
      </Button>
    </CardContent>
  );
}

function NotificationSettings() {
    return (
        <CardContent>
            <p className="text-muted-foreground">Bildirim ayarları çok yakında burada olacak.</p>
        </CardContent>
    )
}

export default function ProfileSettingsPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/customer/profile');
        if (!response.ok) {
          throw new Error('Profil verileri alınamadı.');
        }
        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Bilinmeyen bir hata oluştu.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  if (!user) {
    return <div className="text-center p-8">Kullanıcı bilgileri yüklenemedi.</div>;
  }

  return (
    <div className="container mx-auto max-w-4xl p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Profil Ayarları</h1>
        <p className="text-muted-foreground">Hesap ayarlarınızı yönetin ve tercihlerinizi belirleyin.</p>
      </div>
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general">
            <User className="mr-2 h-4 w-4" />
            Genel
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="mr-2 h-4 w-4" />
            Güvenlik
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="mr-2 h-4 w-4" />
            Bildirimler
          </TabsTrigger>
        </TabsList>
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Genel Ayarlar</CardTitle>
              <CardDescription>Profil bilgilerinizi güncelleyin.</CardDescription>
            </CardHeader>
            <GeneralSettings user={user} setUser={setUser} />
          </Card>
        </TabsContent>
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Güvenlik</CardTitle>
              <CardDescription>Şifrenizi değiştirin.</CardDescription>
            </CardHeader>
            <SecuritySettings />
          </Card>
        </TabsContent>
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Bildirimler</CardTitle>
              <CardDescription>Bildirim tercihlerinizi yönetin.</CardDescription>
            </CardHeader>
            <NotificationSettings />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}