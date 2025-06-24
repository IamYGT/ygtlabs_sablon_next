import { Metadata } from "next";
import { PermissionsPageClient } from "./components/PermissionsPageClient";

export const metadata: Metadata = {
    title: "Yetki Yönetimi",
    description: "Sistem yetkilerini yönetin",
};

export default function PermissionsPage() {
    return <PermissionsPageClient />;
} 