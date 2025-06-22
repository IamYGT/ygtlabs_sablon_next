import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "ECU Sistem",
    description: "ECU Yönetim Sistemi",
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
