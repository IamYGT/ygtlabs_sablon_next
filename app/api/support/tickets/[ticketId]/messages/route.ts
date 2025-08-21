import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/lib/session-utils";
import { z } from "zod";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import crypto from "crypto";

// Mesaj gönderme şeması
const sendMessageSchema = z.object({
  content: z.string().min(1).max(5000),
  messageType: z.enum(["customer_message", "admin_message", "system_message"]).optional(),
});

interface RouteParams {
  params: Promise<{ ticketId: string }>;
}

// POST: Yeni mesaj gönder
export async function POST(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { ticketId } = await params;
    const session = await getServerSession(request);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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

    // Kapalı ticket'a mesaj gönderilemez
    if (ticket.status === "closed") {
      return NextResponse.json(
        { error: "Cannot send message to closed ticket" },
        { status: 400 }
      );
    }

    // Form data'yı parse et
    const formData = await request.formData();
    const content = formData.get("content") as string;
    const messageTypeParam = formData.get("messageType") as string | null;
    
    // Mesaj tipini belirle
    let messageType: "customer_message" | "admin_message" | "system_message";
    if (messageTypeParam) {
      messageType = messageTypeParam as "customer_message" | "admin_message" | "system_message";
    } else {
      messageType = isAdmin ? "admin_message" : "customer_message";
    }

    // Validasyon
    const validatedData = sendMessageSchema.parse({
      content,
      messageType,
    });

    // Dosya eklentilerini işle
    const attachments = formData.getAll("attachments") as File[];
    const uploadedAttachments: {
      fileName: string;
      fileType: string;
      fileSize: number;
      filePath: string;
      fileUrl: string;
      uploadedById: string;
    }[] = [];

    if (attachments.length > 0) {
      // Upload dizini oluştur
      const uploadDir = join(process.cwd(), "public", "uploads", "support", ticketId);
      await mkdir(uploadDir, { recursive: true });

      for (const file of attachments) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Benzersiz dosya adı oluştur
        const uniqueId = crypto.randomUUID();
        const extension = file.name.split(".").pop();
        const fileName = `${uniqueId}.${extension}`;
        const filePath = join(uploadDir, fileName);

        // Dosyayı kaydet
        await writeFile(filePath, buffer);

        uploadedAttachments.push({
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          filePath: `/uploads/support/${ticketId}/${fileName}`,
          fileUrl: `/uploads/support/${ticketId}/${fileName}`,
          uploadedById: session.user.id,
        });
      }
    }

    // Transaction ile mesaj ve eklentileri oluştur
    const message = await prisma.$transaction(async (tx) => {
      // Mesajı oluştur
      const newMessage = await tx.supportMessage.create({
        data: {
          ticketId,
          senderId: session.user.id,
          content: validatedData.content,
          messageType: validatedData.messageType || messageType,
          attachments: {
            create: uploadedAttachments,
          },
        },
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
      });

      // Ticket'ı güncelle
      const updateData: {
        lastMessageAt: Date;
        messageCount: { increment: number };
        attachmentCount: { increment: number };
        firstResponseAt?: Date;
        status?: "in_progress";
      } = {
        lastMessageAt: new Date(),
        messageCount: { increment: 1 },
        attachmentCount: { increment: uploadedAttachments.length },
      };

      // İlk admin yanıtı ise firstResponseAt'i güncelle
      if (isAdmin && !ticket.firstResponseAt) {
        updateData.firstResponseAt = new Date();
      }

      // Eğer admin yanıt verdiyse status'u in_progress yap
      if (isAdmin && ticket.status === "open") {
        updateData.status = "in_progress";
      }

      await tx.supportTicket.update({
        where: { id: ticketId },
        data: updateData,
      });

      // Bildirim oluştur
      const notificationTargetId = isAdmin ? ticket.customerId : ticket.assignedToId;
      if (notificationTargetId) {
        await tx.ticketNotification.create({
          data: {
            ticketId,
            userId: notificationTargetId,
            type: "new_message",
            title: isAdmin ? "Admin replied to your ticket" : "Customer replied to ticket",
            content: validatedData.content.substring(0, 100),
          },
        });
      }

      return newMessage;
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error sending message:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET: Mesaj listesi
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

    // Mesajları getir
    const messages = await prisma.supportMessage.findMany({
      where: { 
        ticketId,
        // Customer'lar system_message'ları göremez
        ...(isAdmin ? {} : { messageType: { not: "system_message" } })
      },
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
    });

    // Okunmamış mesajları okundu olarak işaretle
    if (messages.length > 0) {
      const unreadMessageIds = messages
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

    return NextResponse.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
