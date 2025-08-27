import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/server-utils';
import { cacheManager } from '@/lib/cache-manager';

/**
 * Emergency cache clear API - Admin manuel cache temizleme
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

    const startTime = Date.now();
    
    console.log(`🚨 Emergency cache clear requested by admin: ${currentUser.email}`);

    // Tüm cache'leri acil temizle
    cacheManager.invalidateAll();
    
    const endTime = Date.now();
    const duration = endTime - startTime;

    console.log(`✅ Emergency cache clear completed in ${duration}ms`);

    // Temizlik sonrası istatistikler
    const stats = cacheManager.getStats();

    return NextResponse.json({
      success: true,
      message: 'Emergency cache clear completed successfully',
      clearedAt: new Date().toISOString(),
      duration: `${duration}ms`,
      stats,
      recommendation: 'Users should refresh their browsers for latest data',
    });

  } catch (error) {
    console.error('❌ Emergency cache clear failed:', error);
    return NextResponse.json(
      { success: false, error: 'Emergency cache clear failed' },
      { status: 500 }
    );
  }
}

/**
 * Cache status endpoint - Cache durumunu kontrol et
 */
export async function GET(request: NextRequest) {
  try {
    // Admin kontrolü
    const currentUser = await getCurrentUser(request);
    if (!currentUser || !currentUser.permissions?.includes('admin.cache.manage')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    const stats = cacheManager.getStats();

    return NextResponse.json({
      success: true,
      cacheStats: stats,
      timestamp: new Date().toISOString(),
      cachePolicy: {
        sessionTTL: '30 seconds',
        permissionTTL: '1 minute',
        queryStaleTime: '0 seconds (no cache)',
        queryGcTime: '30 seconds',
      },
    });

  } catch (error) {
    console.error('❌ Cache stats failed:', error);
    return NextResponse.json(
      { success: false, error: 'Cache stats failed' },
      { status: 500 }
    );
  }
}
