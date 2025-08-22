import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/server-utils";
import { z } from "zod";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import crypto from "crypto";

// Ticket oluşturma şeması
const createTicketSchema = z.object({
  title: z.string().min(5).max(200),
  description: z.string().min(20).max(5000),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  categoryId: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

// Ticket numarası oluştur
async function generateTicketNumber(): Promise<string> {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  
  // Son ticket numarasını bul
  const lastTicket = await prisma.supportTicket.findFirst({
    where: {
      ticketNumber: {
        startsWith: `TKT-${year}${month}-`,
      },
    },
    orderBy: {
      ticketNumber: "desc",
    },
  });

  let nextNumber = 1;
  if (lastTicket) {
    const lastNumber = parseInt(lastTicket.ticketNumber.split("-")[2]);
    nextNumber = lastNumber + 1;
  }

  return `TKT-${year}${month}-${String(nextNumber).padStart(3, "0")}`;
}

// GET: Ticket listesi
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status");
    const priority = searchParams.get("priority");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    // Admin mi kontrol et
    const isAdmin = user.permissions?.includes("admin.support.manage");

    // Filtreler
    const where: {
      customerId?: string;
      status?: "open" | "pending" | "in_progress" | "resolved" | "closed";
      priority?: "low" | "medium" | "high" | "urgent";
    } = {};
    
    // Customer sadece kendi ticketlarını görebilir
    if (!isAdmin) {
      where.customerId = user.id;
    }

    if (status && status !== "all") {
      where.status = status as "open" | "pending" | "in_progress" | "resolved" | "closed";
    }

    if (priority && priority !== "all") {
      where.priority = priority as "low" | "medium" | "high" | "urgent";
    }

    // Ticketları getir
    const [tickets, total] = await Promise.all([
      prisma.supportTicket.findMany({
        where,
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
          _count: {
            select: {
              messages: true,
              attachments: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.supportTicket.count({ where }),
    ]);

    return NextResponse.json({
      tickets,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching tickets:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST: Yeni ticket oluştur
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Form data'yı parse et
    const formData = await request.formData();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const priority = formData.get("priority") as string;
    const categoryId = formData.get("categoryId") as string | null;
    const tagsString = formData.get("tags") as string | null;
    const tags = tagsString ? JSON.parse(tagsString) : [];

    // Validasyon
    const validatedData = createTicketSchema.parse({
      title,
      description,
      priority,
      categoryId: categoryId || undefined,
      tags,
    });

    // Dosya eklentilerini işle
    const attachments = formData.getAll("attachments") as File[];
    const uploadedAttachments = [];

    if (attachments.length > 0) {
      // Upload dizini oluştur
      const uploadDir = join(process.cwd(), "public", "uploads", "support");
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
          filePath: `/uploads/support/${fileName}`,
          fileUrl: `/uploads/support/${fileName}`,
        });
      }
    }

    // Ticket numarası oluştur
    const ticketNumber = await generateTicketNumber();

    // Ticket'ı oluştur
    const ticket = await prisma.supportTicket.create({
      data: {
        ticketNumber,
        title: validatedData.title,
        description: validatedData.description,
        priority: validatedData.priority,
        categoryId: validatedData.categoryId,
        customerId: user.id,
        tags: validatedData.tags || [],
        attachments: {
          create: uploadedAttachments.map((attachment) => ({
            ...attachment,
            uploadedById: user.id,
          })),
        },
      },
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
        attachments: true,
      },
    });

    // Admin'lere bildirim gönder (ileride implement edilecek)
    // await sendNotificationToAdmins(ticket);

    return NextResponse.json(ticket, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error creating ticket:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
