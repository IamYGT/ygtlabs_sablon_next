import { NextRequest, NextResponse } from "next/server";
import { verifyAdminAuth } from "@/lib";

export async function GET(request: NextRequest) {
  try {
    // Admin yetkisi kontrolü
    const admin = await verifyAdminAuth(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Örnek bildirimler - gerçek uygulamada veritabanından gelecek
    const notifications = [
      {
        id: "1",
        title: "Sistem Güncellemesi",
        message: "Yeni güvenlik güncellemesi mevcut",
        type: "info",
        createdAt: new Date().toISOString(),
        read: false,
      },
      {
        id: "2",
        title: "Yeni Kullanıcı",
        message: "Sisteme yeni bir kullanıcı kaydoldu",
        type: "success",
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        read: false,
      },
      {
        id: "3",
        title: "Güvenlik Uyarısı",
        message: "Şüpheli giriş denemesi tespit edildi",
        type: "warning",
        createdAt: new Date(Date.now() - 7200000).toISOString(),
        read: true,
      },
    ];

    return NextResponse.json({
      notifications,
      unreadCount: notifications.filter((n) => !n.read).length,
    });
  } catch (error) {
    console.error("Notifications API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Admin yetkisi kontrolü
    const admin = await verifyAdminAuth(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { action, notificationId } = await request.json();

    if (action === "markRead" && notificationId) {
      // Bildirim okundu olarak işaretle
      // Gerçek uygulamada veritabanını güncelleyecek
      return NextResponse.json({ success: true });
    }

    if (action === "markAllRead") {
      // Tüm bildirimleri okundu olarak işaretle
      // Gerçek uygulamada veritabanını güncelleyecek
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Notifications POST API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
