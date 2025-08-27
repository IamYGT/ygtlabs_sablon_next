'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

/**
 * Customer ana sayfası - doğrudan dashboard'a yönlendirir
 * /customer -> /customer/dashboard
 */
export default function CustomerPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string || 'en';

  useEffect(() => {
    // Doğrudan customer dashboard'a yönlendir
    router.replace(`/${locale}/customer/dashboard`);
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
