'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

/**
 * Admin ana sayfası - doğrudan dashboard'a yönlendirir
 * /admin -> /admin/dashboard
 */
export default function AdminPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string || 'en';

  useEffect(() => {
    // Doğrudan admin dashboard'a yönlendir
    router.replace(`/${locale}/admin/dashboard`);
  }, [router, locale]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Yönlendiriliyor...</p>
      </div>
    </div>
  );
}
