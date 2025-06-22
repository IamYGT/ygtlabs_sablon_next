import AdminDashboardClient from "./AdminDashboardClient";

export default function AdminDashboardPage() {
    // AdminGuard zaten client-side auth kontrolü yapıyor
    // Server-side getCurrentUser çağrısına gerek yok
    return <AdminDashboardClient />;
} 