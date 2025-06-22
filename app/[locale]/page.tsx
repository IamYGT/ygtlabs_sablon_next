import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import LandingPageContent from './landing/page';

export default async function HomePage() {
    // Check if user is authenticated
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');

    if (sessionCookie) {
        // User is authenticated, redirect to their dashboard
        // You can add more logic here to determine user role and redirect accordingly
        redirect('/admin/dashboard');
    }

    // User is not authenticated, show landing page content
    return <LandingPageContent />;
}
