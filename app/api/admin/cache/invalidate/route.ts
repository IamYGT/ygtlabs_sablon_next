import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/server-utils';
import { cacheManager } from '@/lib/cache-manager';

/**
 * Cache invalidation API - Rol ve kullanıcı değişikliklerinde tüm cache'leri temizler
 */
export async function POST(request: NextRequest) {
  try {
    // Admin kontrolü
    const currentUser = await getCurrentUser(request);
    if (!currentUser || !currentUser.permissions?.includes('admin.cache.manage')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { userId, type = 'all' } = body;

    console.log(`🔄 Cache invalidation requested by ${currentUser.email}`, { userId, type });

    switch (type) {
      case 'user':
        if (userId) {
          // Belirli kullanıcının cache'ini temizle
          cacheManager.invalidateUser(userId);
          console.log(`✅ User cache invalidated for user: ${userId}`);
        }
        break;
      
      case 'permissions':
        // Tüm permission cache'lerini temizle
        cacheManager.invalidateAll();
        console.log('✅ All permission caches invalidated');
        break;
      
      case 'all':
      default:
        // Tüm cache'leri temizle
        cacheManager.invalidateAll();
        console.log('✅ All caches invalidated');
        break;
    }

    // Cache istatistiklerini döndür
    const stats = cacheManager.getStats();

    return NextResponse.json({
      success: true,
      message: `Cache invalidation completed: ${type}`,
      stats,
      invalidatedAt: new Date().toISOString(),
    });

  } catch (error) {
    console.error('❌ Cache invalidation failed:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
