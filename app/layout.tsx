import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "CRM Sistem",
    description: "CRM Yönetim Sistemi",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
