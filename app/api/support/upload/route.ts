import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/server-utils";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";

// İzin verilen dosya tipleri
const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/plain",
  "text/csv"
];

// Maksimum dosya boyutu (10MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const ticketId = formData.get("ticketId") as string;
    const messageId = formData.get("messageId") as string | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Dosya tipi kontrolü
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "File type not allowed" },
        { status: 400 }
      );
    }

    // Dosya boyutu kontrolü
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File size exceeds 10MB limit" },
        { status: 400 }
      );
    }

    // Ticket'ın varlığını ve erişim yetkisini kontrol et
    const ticket = await prisma.supportTicket.findFirst({
      where: {
        id: ticketId,
        OR: [
          { customerId: user.id },
          {
            // Admin kontrolü
            AND: user.permissions?.includes("admin.support.manage")
              ? {}
              : { customerId: user.id }
          }
        ]
      }
    });

    if (!ticket) {
      return NextResponse.json(
        { error: "Ticket not found or access denied" },
        { status: 404 }
      );
    }

    // Benzersiz dosya adı oluştur
    const fileExtension = file.name.split(".").pop();
    const uniqueFileName = `${randomUUID()}.${fileExtension}`;
    
    // Yükleme dizini
    const uploadDir = join(process.cwd(), "public", "uploads", "support", ticketId);
    
    // Dizin yoksa oluştur
    await mkdir(uploadDir, { recursive: true });
    
    // Dosya yolu
    const filePath = join(uploadDir, uniqueFileName);
    
    // Dosyayı kaydet
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);
    
    // Veritabanına kaydet
    const attachment = await prisma.supportAttachment.create({
      data: {
        ticketId,
        messageId,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        filePath: `/uploads/support/${ticketId}/${uniqueFileName}`,
        fileUrl: `/uploads/support/${ticketId}/${uniqueFileName}`,
        uploadedById: user.id
      },
      select: {
        id: true,
        fileName: true,
        fileSize: true,
        fileType: true,
        filePath: true,
        fileUrl: true,
        createdAt: true
      }
    });

    return NextResponse.json({
      success: true,
      attachment: {
        ...attachment,
        url: attachment.fileUrl || attachment.filePath
      }
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}

// Dosyaları listele
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const ticketId = searchParams.get("ticketId");
    const messageId = searchParams.get("messageId");

    if (!ticketId) {
      return NextResponse.json(
        { error: "Ticket ID is required" },
        { status: 400 }
      );
    }

    // Ticket'a erişim yetkisini kontrol et
    const ticket = await prisma.supportTicket.findFirst({
      where: {
        id: ticketId,
        OR: [
          { customerId: user.id },
          {
            AND: user.permissions?.includes("admin.support.manage")
              ? {}
              : { customerId: user.id }
          }
        ]
      }
    });

    if (!ticket) {
      return NextResponse.json(
        { error: "Ticket not found or access denied" },
        { status: 404 }
      );
    }

    interface WhereClause {
      ticketId: string;
      messageId?: string | null;
    }
    const where: WhereClause = { ticketId };
    if (messageId) {
      where.messageId = messageId;
    }

    const attachments = await prisma.supportAttachment.findMany({
      where,
      select: {
        id: true,
        fileName: true,
        fileSize: true,
        fileType: true,
        filePath: true,
        fileUrl: true,
        createdAt: true,
        uploadedBy: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({
      attachments: attachments.map(att => ({
        ...att,
        url: att.fileUrl || att.filePath
      }))
    });
  } catch (error) {
    console.error("Error fetching attachments:", error);
    return NextResponse.json(
      { error: "Failed to fetch attachments" },
      { status: 500 }
    );
  }
}

// Dosya sil
export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const attachmentId = searchParams.get("id");

    if (!attachmentId) {
      return NextResponse.json(
        { error: "Attachment ID is required" },
        { status: 400 }
      );
    }

    // Attachment'ı bul ve yetki kontrolü yap
    const attachment = await prisma.supportAttachment.findFirst({
      where: {
        id: attachmentId,
        OR: [
          { uploadedById: user.id },
          {
            ticket: {
              customerId: user.id
            }
          },
          {
            AND: user.permissions?.includes("admin.support.manage")
              ? {}
              : { uploadedById: user.id }
          }
        ]
      }
    });

    if (!attachment) {
      return NextResponse.json(
        { error: "Attachment not found or access denied" },
        { status: 404 }
      );
    }

    // Veritabanından sil (dosya sistemi temizliği opsiyonel)
    await prisma.supportAttachment.delete({
      where: { id: attachmentId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting attachment:", error);
    return NextResponse.json(
      { error: "Failed to delete attachment" },
      { status: 500 }
    );
  }
}
