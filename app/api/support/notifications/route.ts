import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/lib/session-utils";
import { z } from "zod";

// Bildirim güncelleme şeması
const updateNotificationSchema = z.object({
  isRead: z.boolean(),
});

// Bildirimleri getir
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(request);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");
    const unreadOnly = searchParams.get("unreadOnly") === "true";

    const where: {
      userId: string;
      isRead?: boolean;
    } = {
      userId: session.user.id,
    };

    if (unreadOnly) {
      where.isRead = false;
    }

    const [notifications, total, unreadCount] = await Promise.all([
      prisma.ticketNotification.findMany({
        where,
        select: {
          id: true,
          ticketId: true,
          type: true,
          title: true,
          content: true,
          isRead: true,
          createdAt: true,
          ticket: {
            select: {
              ticketNumber: true,
              title: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: offset,
      }),
      prisma.ticketNotification.count({ where }),
      prisma.ticketNotification.count({
        where: {
          userId: session.user.id,
          isRead: false,
        },
      }),
    ]);

    return NextResponse.json({
      notifications,
      total,
      unreadCount,
      hasMore: offset + limit < total,
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Bildirim okundu olarak işaretle
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(request);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const notificationId = searchParams.get("id");
    const markAllRead = searchParams.get("markAllRead") === "true";

    if (markAllRead) {
      // Tüm bildirimleri okundu olarak işaretle
      await prisma.ticketNotification.updateMany({
        where: {
          userId: session.user.id,
          isRead: false,
        },
        data: {
          isRead: true,
          readAt: new Date(),
        },
      });

      return NextResponse.json({ success: true, message: "All notifications marked as read" });
    }

    if (!notificationId) {
      return NextResponse.json(
        { error: "Notification ID is required" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validatedData = updateNotificationSchema.parse(body);

    // Bildirimin kullanıcıya ait olduğunu kontrol et
    const notification = await prisma.ticketNotification.findFirst({
      where: {
        id: notificationId,
        userId: session.user.id,
      },
    });

    if (!notification) {
      return NextResponse.json(
        { error: "Notification not found" },
        { status: 404 }
      );
    }

    const updated = await prisma.ticketNotification.update({
      where: { id: notificationId },
      data: {
        isRead: validatedData.isRead,
        readAt: validatedData.isRead ? new Date() : null,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Error updating notification:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Bildirim sil
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(request);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const notificationId = searchParams.get("id");
    const deleteAll = searchParams.get("deleteAll") === "true";

    if (deleteAll) {
      // Tüm bildirimleri sil
      await prisma.ticketNotification.deleteMany({
        where: {
          userId: session.user.id,
        },
      });

      return NextResponse.json({ success: true, message: "All notifications deleted" });
    }

    if (!notificationId) {
      return NextResponse.json(
        { error: "Notification ID is required" },
        { status: 400 }
      );
    }

    // Bildirimin kullanıcıya ait olduğunu kontrol et
    const notification = await prisma.ticketNotification.findFirst({
      where: {
        id: notificationId,
        userId: session.user.id,
      },
    });

    if (!notification) {
      return NextResponse.json(
        { error: "Notification not found" },
        { status: 404 }
      );
    }

    await prisma.ticketNotification.delete({
      where: { id: notificationId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting notification:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Bildirim tercihleri
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(request);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { preferences } = body;

    // Kullanıcı tercihlerini güncelle
    // Not: User modelinde metadata field'ı yok, bu özellik için ayrı bir tablo veya 
    // localStorage kullanılabilir

    return NextResponse.json({ success: true, preferences });
  } catch (error) {
    console.error("Error updating preferences:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
