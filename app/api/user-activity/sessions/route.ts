import { NextRequest, NextResponse } from "next/server";
import {
  getCurrentUser,
  getSession,
  getAllUserSessions,
  revokeSession,
  revokeAllUserSessions,
  cleanupExpiredSessions,
  detectSuspiciousActivity,
} from "@/lib";
import { prisma } from "@/lib/prisma";

// Kullanıcının kendi session'larını listeleme
export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser(request);
    if (!currentUser) {
      return NextResponse.json(
        { error: "Oturum açmanız gerekiyor" },
        { status: 401 }
      );
    }

    // Mevcut session'ı al
    const sessionToken = request.cookies.get("ecu_session")?.value;
    const currentSession = sessionToken ? await getSession(sessionToken) : null;
    const currentSessionToken = currentSession?.sessionToken;

    // Kullanıcının tüm aktif session'larını getir
    const sessions = await getAllUserSessions(currentUser.id);

    // Güvenlik analizi yap
    const isSuspicious = await detectSuspiciousActivity(currentUser.id);

    // Süresi dolmuş session'ları temizle
    const cleanedSessions = await cleanupExpiredSessions();

    return NextResponse.json({
      sessions,
      security: {
        isSuspicious,
        cleanedSessions,
      },
      currentSessionToken: currentSessionToken?.slice(-8) || null,
    });
  } catch (error) {
    console.error("Session listeleme hatası:", error);
    return NextResponse.json({ error: "İç sunucu hatası" }, { status: 500 });
  }
}

// Session yönetimi (sonlandırma, temizleme vb.)
export async function DELETE(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser(request);
    if (!currentUser) {
      return NextResponse.json(
        { error: "Oturum açmanız gerekiyor" },
        { status: 401 }
      );
    }

    const url = new URL(request.url);
    const action = url.searchParams.get("action");
    const sessionId = url.searchParams.get("sessionId");

    const sessionToken = request.cookies.get("ecu_session")?.value;
    const currentSession = sessionToken ? await getSession(sessionToken) : null;
    const currentSessionToken = currentSession?.sessionToken;

    let result;
    let message;

    switch (action) {
      case "single":
        // Belirli bir session'ı sonlandır
        if (!sessionId) {
          return NextResponse.json(
            { error: "Session ID gerekli" },
            { status: 400 }
          );
        }

        result = await revokeSession(sessionId);
        if (!result) {
          return NextResponse.json(
            { error: "Session bulunamadı veya sonlandırılamadı" },
            { status: 404 }
          );
        }

        message = "Session başarıyla sonlandırıldı";
        break;

      case "others": {
        // Mevcut session hariç diğer tüm session'ları sonlandır
        if (!currentSessionToken) {
          return NextResponse.json(
            { error: "Mevcut session bulunamadı" },
            { status: 400 }
          );
        }

        const othersCount = await revokeAllUserSessions(currentUser.id);

        message = `${othersCount} diğer cihaz session'ı sonlandırıldı`;
        break;
      }

      case "all": {
        // Tüm session'ları sonlandır (mevcut dahil)
        const allCount = await revokeAllUserSessions(currentUser.id);

        message = `Tüm ${allCount} session sonlandırıldı`;
        break;
      }

      default:
        return NextResponse.json(
          { error: "Geçersiz action parametresi" },
          { status: 400 }
        );
    }

    // Activity log
    await prisma.userActivityLog.create({
      data: {
        userId: currentUser.id,
        action: `session_${action}`,
        details: {
          action,
          sessionId: sessionId || null,
          terminatedBy: "user",
        },
      },
    });

    return NextResponse.json({
      success: true,
      message,
      action,
    });
  } catch (error) {
    console.error("Session yönetimi hatası:", error);
    return NextResponse.json({ error: "İç sunucu hatası" }, { status: 500 });
  }
}

// Güvenlik işlemleri (temizleme, analiz vb.)
export async function PUT(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser(request);
    if (!currentUser) {
      return NextResponse.json(
        { error: "Oturum açmanız gerekiyor" },
        { status: 401 }
      );
    }

    const { action } = await request.json();

    let result;
    let message;

    switch (action) {
      case "cleanup_expired":
        // Süresi dolmuş session'ları temizle
        result = await cleanupExpiredSessions();
        message = `${result} süresi dolmuş session temizlendi`;
        break;

      case "security_analysis":
        // Güvenlik analizi yap
        result = await detectSuspiciousActivity(currentUser.id);
        message = "Güvenlik analizi tamamlandı";
        break;

      default:
        return NextResponse.json(
          { error: "Geçersiz action parametresi" },
          { status: 400 }
        );
    }

    // Activity log
    await prisma.userActivityLog.create({
      data: {
        userId: currentUser.id,
        action: `security_${action}`,
        details: {
          action,
          result,
          triggeredBy: "user",
        },
      },
    });

    return NextResponse.json({
      success: true,
      message,
      result,
    });
  } catch (error) {
    console.error("Güvenlik işlemi hatası:", error);
    return NextResponse.json({ error: "İç sunucu hatası" }, { status: 500 });
  }
}
