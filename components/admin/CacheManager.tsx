'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCacheInvalidation } from '@/lib/cache-invalidation';
import { AlertTriangle, Trash2, RefreshCw, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CacheStats {
  sessions: number;
  permissions: number;
  total: number;
}

interface CacheStatus {
  success: boolean;
  cacheStats: CacheStats;
  timestamp: string;
  cachePolicy: {
    sessionTTL: string;
    permissionTTL: string;
    queryStaleTime: string;
    queryGcTime: string;
  };
}

export function CacheManager() {
  const [isLoading, setIsLoading] = useState(false);
  const [cacheStats, setCacheStats] = useState<CacheStatus | null>(null);
  const { invalidateAllCache, triggerServerCacheInvalidation } = useCacheInvalidation();
  const { toast } = useToast();

  const fetchCacheStats = async () => {
    try {
      const response = await fetch('/api/admin/cache/clear', {
        method: 'GET',
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        setCacheStats(data);
      }
    } catch (_error) {
      console.error('Cache stats fetch failed:', _error);
    }
  };

  const clearAllCaches = async () => {
    setIsLoading(true);
    try {
      // 1. Client-side cache temizleme
      await invalidateAllCache();
      
      // 2. Server-side cache temizleme
      await triggerServerCacheInvalidation('all');
      
      // 3. Emergency cache clear API'si
      const response = await fetch('/api/admin/cache/clear', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        const result = await response.json();
        toast({
          title: "✅ Cache Temizlendi",
          description: `Tüm cache&apos;ler başarıyla temizlendi. Süre: ${result.duration}`,
          duration: 5000,
        });
        
        // Stats'leri güncelle
        await fetchCacheStats();
      } else {
        throw new Error('Server cache clear failed');
      }
    } catch (_error) {
      console.error('Cache clear failed:', _error);
      toast({
        title: "❌ Cache Temizleme Hatası",
        description: "Cache temizleme sırasında bir hata oluştu",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const invalidateUserCaches = async () => {
    setIsLoading(true);
    try {
      await triggerServerCacheInvalidation('user');
      toast({
        title: "✅ Kullanıcı Cache&apos;leri Temizlendi", 
        description: "Kullanıcı ile ilgili tüm cache&apos;ler temizlendi",
      });
      await fetchCacheStats();
    } catch (_error) {
      toast({
        title: "❌ Hata",
        description: "Cache temizleme başarısız",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const invalidatePermissionCaches = async () => {
    setIsLoading(true);
    try {
      await triggerServerCacheInvalidation('permissions');
      toast({
        title: "✅ Permission Cache&apos;leri Temizlendi",
        description: "Yetki ile ilgili tüm cache&apos;ler temizlendi", 
      });
      await fetchCacheStats();
    } catch (_error) {
      toast({
        title: "❌ Hata",
        description: "Cache temizleme başarısız",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Component mount'ta stats'leri getir
  useState(() => {
    fetchCacheStats();
  });

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RefreshCw className="h-5 w-5" />
          Cache Yönetimi
        </CardTitle>
        <CardDescription>
          Sistem cache&apos;lerini görüntüle ve yönet. Cache değişiklikleri anlık olarak tüm kullanıcıları etkiler.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Cache İstatistikleri */}
        {cacheStats && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-700">Aktif Cache&apos;ler</h4>
              <div className="flex gap-2">
                <Badge variant="outline">
                  Sessions: {cacheStats.cacheStats.sessions}
                </Badge>
                <Badge variant="outline">
                  Permissions: {cacheStats.cacheStats.permissions}
                </Badge>
                <Badge variant="secondary">
                  Total: {cacheStats.cacheStats.total}
                </Badge>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-700">Cache Politikası</h4>
              <div className="text-xs text-gray-600 space-y-1">
                <div>Session TTL: {cacheStats.cachePolicy.sessionTTL}</div>
                <div>Permission TTL: {cacheStats.cachePolicy.permissionTTL}</div>
                <div>Query Cache: {cacheStats.cachePolicy.queryStaleTime}</div>
              </div>
            </div>
          </div>
        )}

        {/* Uyarı Mesajı */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
            <div className="text-sm text-amber-800">
              <p className="font-medium mb-1">Cache Temizleme Uyarısı</p>
              <p>Cache temizleme işlemi tüm kullanıcıları etkiler ve performans düşüşüne neden olabilir. Sadece gerektiğinde kullanın.</p>
            </div>
          </div>
        </div>

        {/* Cache Temizleme Butonları */}
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Button
              variant="outline"
              onClick={invalidateUserCaches}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Kullanıcı Cache&apos;leri
            </Button>
            
            <Button
              variant="outline"
              onClick={invalidatePermissionCaches}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Permission Cache&apos;leri
            </Button>
            
            <Button
              variant="destructive"
              onClick={clearAllCaches}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              {isLoading ? "Temizleniyor..." : "Tüm Cache'leri Temizle"}
            </Button>
          </div>
        </div>

        {/* Bilgi */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Otomatik Cache Temizleme</p>
              <p>Rol ve yetki değişiklikleri otomatik olarak ilgili cache&apos;leri temizler. Manuel temizleme sadece acil durumlarda gereklidir.</p>
            </div>
          </div>
        </div>
        
        <Button 
          variant="ghost" 
          size="sm"
          onClick={fetchCacheStats}
          className="w-full"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Stats&apos;leri Yenile
        </Button>
      </CardContent>
    </Card>
  );
}
