import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/server-utils";
import { z } from "zod";

// Ticket atama şeması
const assignTicketSchema = z.object({
  ticketId: z.string(),
  assigneeId: z.string().nullable(),
  note: z.string().optional()
});

// Toplu güncelleme şeması
const bulkUpdateSchema = z.object({
  ticketIds: z.array(z.string()).min(1),
  updates: z.object({
    status: z.enum(["open", "pending", "in_progress", "resolved", "closed"]).optional(),
    priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
    categoryId: z.string().optional(),
    assigneeId: z.string().nullable().optional()
  })
});

// Toplu silme şeması
const bulkDeleteSchema = z.object({
  ticketIds: z.array(z.string()).min(1)
});

// Ticket atama
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isAdmin = user.permissions?.includes("admin.support.manage");
    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const action = body.action;

    switch (action) {
      case "assign": {
        const validatedData = assignTicketSchema.parse(body);
        
        // Transaction ile atama işlemi
        const result = await prisma.$transaction(async (tx) => {
          // Mevcut atamayı güncelle veya yeni oluştur
          if (validatedData.assigneeId) {
            // Yeni atama yap
            const assignment = await tx.ticketAssignment.create({
              data: {
                ticketId: validatedData.ticketId,
                assignedToId: validatedData.assigneeId,
                assignedById: user.id
              }
            });

            // Önceki atamaları kaldır (sadece son atama geçerli olacak)
            // Not: TicketAssignment modelinde isActive field'ı yok, geçmiş kaydı olarak tutulur

            // Ticket'ı güncelle
            await tx.supportTicket.update({
              where: { id: validatedData.ticketId },
              data: {
                status: "in_progress",
                updatedAt: new Date()
              }
            });

            // Bildirim oluştur
            if (validatedData.assigneeId) {
              await tx.ticketNotification.create({
                data: {
                  ticketId: validatedData.ticketId,
                  userId: validatedData.assigneeId,
                  type: "ticket_assigned",
                  title: "Yeni Ticket Atandı",
                  content: `Ticket #${validatedData.ticketId.slice(-6)} size atandı`
                }
              });
            }

            return assignment;
          } else {
            // Atamayı kaldır - yeni bir NULL assignment kaydı ekle
            await tx.ticketAssignment.create({
              data: {
                ticketId: validatedData.ticketId,
                assignedToId: null,
                assignedById: user.id,
                reason: "Unassigned"
              }
            });

            await tx.supportTicket.update({
              where: { id: validatedData.ticketId },
              data: {
                status: "open",
                updatedAt: new Date()
              }
            });

            return { success: true };
          }
        });

        return NextResponse.json(result);
      }

      case "bulkUpdate": {
        const validatedData = bulkUpdateSchema.parse(body);
        
        const results = await prisma.$transaction(async (tx) => {
          const updates: Record<string, unknown> = { updatedAt: new Date() };
          
          if (validatedData.updates.status) {
            updates.status = validatedData.updates.status;
            if (validatedData.updates.status === "resolved") {
              updates.resolvedAt = new Date();
            } else if (validatedData.updates.status === "closed") {
              updates.closedAt = new Date();
            }
          }
          
          if (validatedData.updates.priority) {
            updates.priority = validatedData.updates.priority;
          }
          
          if (validatedData.updates.categoryId !== undefined) {
            updates.categoryId = validatedData.updates.categoryId;
          }

          // Ticket'ları güncelle
          const updatedTickets = await tx.supportTicket.updateMany({
            where: {
              id: { in: validatedData.ticketIds }
            },
            data: updates
          });

          // Atama güncellemesi varsa
          if (validatedData.updates.assigneeId !== undefined) {
            for (const ticketId of validatedData.ticketIds) {
              await tx.ticketAssignment.create({
                data: {
                  ticketId,
                  assignedToId: validatedData.updates.assigneeId,
                  assignedById: user.id,
                  reason: "Bulk assignment"
                }
              });
              
              // Ticket'ın assignedToId field'ını güncelle
              await tx.supportTicket.update({
                where: { id: ticketId },
                data: {
                  assignedToId: validatedData.updates.assigneeId
                }
              });
            }
          }

          return updatedTickets;
        });

        return NextResponse.json({
          success: true,
          updated: results.count
        });
      }

      case "bulkDelete": {
        const validatedData = bulkDeleteSchema.parse(body);
        
        // Hard delete yapalım (SupportTicket modelinde deletedAt field'ı yok)
        const result = await prisma.supportTicket.deleteMany({
          where: {
            id: { in: validatedData.ticketIds }
          }
        });

        return NextResponse.json({
          success: true,
          deleted: result.count
        });
      }

      default:
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 }
        );
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Error in admin action:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Admin için gelişmiş filtreleme ve arama
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isAdmin = user.permissions?.includes("admin.support.manage");
    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    switch (type) {
      case "agents": {
        // Destek ajanlarını getir - permissions array olduğu için has kullanıyoruz
        const agents = await prisma.user.findMany({
          select: {
            id: true,
            name: true,
            email: true,
            profileImage: true,
            _count: {
              select: {
                assignedTickets: {
                  where: {
                    status: {
                      notIn: ["resolved", "closed"]
                    }
                  }
                }
              }
            }
          }
        });

        return NextResponse.json(agents);
      }

      case "templates": {
        // Yanıt şablonlarını getir (örnek)
        const templates = [
          {
            id: "1",
            name: "Hoş geldiniz",
            content: "Merhaba, destek talebiniz alındı. En kısa sürede size dönüş yapacağız.",
            category: "greeting"
          },
          {
            id: "2",
            name: "Daha fazla bilgi",
            content: "Sorununuzu daha iyi anlayabilmemiz için lütfen aşağıdaki bilgileri paylaşır mısınız:",
            category: "info_request"
          },
          {
            id: "3",
            name: "Çözüm onayı",
            content: "Sorununuz çözüldü mü? Başka yardımcı olabileceğimiz bir konu var mı?",
            category: "resolution"
          }
        ];

        return NextResponse.json(templates);
      }

      case "reports": {
        // Raporlama verileri
        const startDate = searchParams.get("startDate");
        const endDate = searchParams.get("endDate");

        interface WhereClause {
          createdAt?: {
            gte?: Date;
            lte?: Date;
          };
        }
        const where: WhereClause = {};
        if (startDate || endDate) {
          where.createdAt = {};
          if (startDate) {
            where.createdAt.gte = new Date(startDate);
          }
          if (endDate) {
            where.createdAt.lte = new Date(endDate);
          }
        }

        const [byStatus, byPriority, byCategory, byAgent] = await Promise.all([
          // Duruma göre
          prisma.supportTicket.groupBy({
            by: ["status"],
            where,
            _count: true
          }),
          // Önceliğe göre
          prisma.supportTicket.groupBy({
            by: ["priority"],
            where,
            _count: true
          }),
          // Kategoriye göre
          prisma.supportTicket.groupBy({
            by: ["categoryId"],
            where,
            _count: true
          }),
          // Ajana göre - assignedToId kullan
          prisma.ticketAssignment.groupBy({
            by: ["assignedToId"],
            _count: true
          })
        ]);

        return NextResponse.json({
          byStatus,
          byPriority,
          byCategory,
          byAgent
        });
      }

      default:
        return NextResponse.json(
          { error: "Invalid type parameter" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Error in admin GET:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
