import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/lib/session-utils";
import { z } from "zod";

// Ticket güncelleme şeması
const updateTicketSchema = z.object({
  status: z.enum(["open", "pending", "in_progress", "resolved", "closed"]).optional(),
  priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
  assignedToId: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

interface RouteParams {
  params: Promise<{ ticketId: string }>;
}

// GET: Ticket detayı
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { ticketId } = await params;
    const session = await getServerSession(request);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Ticket'ı getir
    const ticket = await prisma.supportTicket.findUnique({
      where: { id: ticketId },
      include: {
        category: true,
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImage: true,
          },
        },
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImage: true,
          },
        },
        messages: {
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                email: true,
                profileImage: true,
              },
            },
            attachments: true,
          },
          orderBy: {
            createdAt: "asc",
          },
        },
        attachments: true,
        assignments: {
          include: {
            assignedBy: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            assignedTo: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    // Yetki kontrolü - Customer sadece kendi ticketlarını görebilir
    const isAdmin = session.user.permissions?.includes("admin.support.manage");
    if (!isAdmin && ticket.customerId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // View count'u artır
    await prisma.supportTicket.update({
      where: { id: ticketId },
      data: { viewCount: { increment: 1 } },
    });

    // Okunmamış mesajları okundu olarak işaretle
    if (ticket.messages.length > 0) {
      const unreadMessageIds = ticket.messages
        .filter(msg => !msg.isRead && msg.senderId !== session.user.id)
        .map(msg => msg.id);

      if (unreadMessageIds.length > 0) {
        await prisma.supportMessage.updateMany({
          where: {
            id: { in: unreadMessageIds },
          },
          data: {
            isRead: true,
            readAt: new Date(),
          },
        });
      }
    }

    return NextResponse.json(ticket);
  } catch (error) {
    console.error("Error fetching ticket:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH: Ticket güncelle
export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { ticketId } = await params;
    const session = await getServerSession(request);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = updateTicketSchema.parse(body);

    // Ticket'ı kontrol et
    const ticket = await prisma.supportTicket.findUnique({
      where: { id: ticketId },
    });

    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    // Yetki kontrolü
    const isAdmin = session.user.permissions?.includes("admin.support.manage");
    if (!isAdmin && ticket.customerId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Customer sadece status'u "closed" yapabilir
    if (!isAdmin) {
      if (validatedData.status && validatedData.status !== "closed") {
        return NextResponse.json(
          { error: "You can only close your own tickets" },
          { status: 403 }
        );
      }
      // Customer diğer alanları güncelleyemez
      delete validatedData.priority;
      delete validatedData.assignedToId;
      delete validatedData.tags;
    }

    // Güncelleme verilerini hazırla
    const updateData: {
      status?: "open" | "pending" | "in_progress" | "resolved" | "closed";
      priority?: "low" | "medium" | "high" | "urgent";
      tags?: string[];
      updatedAt: Date;
      resolvedAt?: Date | null;
      closedAt?: Date | null;
    } = {
      updatedAt: new Date(),
    };

    if (validatedData.status) {
      updateData.status = validatedData.status;
    }
    if (validatedData.priority) {
      updateData.priority = validatedData.priority;
    }
    if (validatedData.tags) {
      updateData.tags = validatedData.tags;
    }

    // Status değişikliği varsa timestamp'leri güncelle
    if (validatedData.status) {
      if (validatedData.status === "resolved") {
        updateData.resolvedAt = new Date();
      } else if (validatedData.status === "closed") {
        updateData.closedAt = new Date();
      }
    }

    // Assignment değişikliği varsa log ekle ve ticket'ı güncelle
    if (validatedData.assignedToId !== undefined && isAdmin) {
      await prisma.ticketAssignment.create({
        data: {
          ticketId,
          assignedToId: validatedData.assignedToId,
          assignedById: session.user.id,
        },
      });
      
      // assignedToId'yi ayrı olarak güncelle
      await prisma.supportTicket.update({
        where: { id: ticketId },
        data: { assignedToId: validatedData.assignedToId },
      });
    }

    // Ticket'ı güncelle (assignedToId hariç)
    const updatedTicket = await prisma.supportTicket.update({
      where: { id: ticketId },
      data: updateData,
      include: {
        category: true,
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImage: true,
          },
        },
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImage: true,
          },
        },
      },
    });

    // Bildirim gönder (ileride implement edilecek)
    // await sendTicketUpdateNotification(updatedTicket);

    return NextResponse.json(updatedTicket);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error updating ticket:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE: Ticket sil (sadece admin)
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { ticketId } = await params;
    const session = await getServerSession(request);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Sadece admin silebilir
    const isAdmin = session.user.permissions?.includes("admin.support.manage");
    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Ticket'ı kontrol et
    const ticket = await prisma.supportTicket.findUnique({
      where: { id: ticketId },
    });

    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    // Ticket'ı sil (cascade ile ilişkili veriler de silinir)
    await prisma.supportTicket.delete({
      where: { id: ticketId },
    });

    return NextResponse.json({ message: "Ticket deleted successfully" });
  } catch (error) {
    console.error("Error deleting ticket:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
