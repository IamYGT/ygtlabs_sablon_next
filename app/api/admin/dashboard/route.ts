import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withPermission } from "@/lib/permissions/helpers";

export const GET = withPermission("admin.dashboard.view", async (_req: NextRequest) => {
  try {
    // Paralel veri çekme işlemleri
    const [
      userStats,
      customerStats,
      ticketStats,
      roleStats,
      permissionStats,
      contentStats,
      recentActivities,
      systemHealth,
      calendarEvents,
      loginHistory
    ] = await Promise.all([
      // Kullanıcı istatistikleri
      prisma.user.aggregate({
        _count: { id: true },
        where: { isActive: true }
      }),

      // Müşteri istatistikleri
      prisma.customer.aggregate({
        _count: { id: true },
        where: { isActive: true }
      }),

      // Destek talebi istatistikleri
      prisma.supportTicket.groupBy({
        by: ['status'],
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } }
      }),

      // Rol istatistikleri
      prisma.authRole.aggregate({
        _count: { id: true },
        where: { isActive: true }
      }),

      // Yetki istatistikleri
      prisma.permission.aggregate({
        _count: { id: true },
        where: { isActive: true }
      }),

      // İçerik istatistikleri
      Promise.all([
        prisma.blogPost.count({ where: { isActive: true } }),
        prisma.faqItem.count({ where: { isActive: true } }),
        prisma.infoArticle.count({ where: { isActive: true } }),
        prisma.heroSlider.count({ where: { isActive: true } }),
      ]),

      // Son aktiviteler
      Promise.all([
        // Son destek talepleri
        prisma.supportTicket.findMany({
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: {
            customer: { select: { name: true, email: true } },
            assignedTo: { select: { name: true } }
          }
        }),
        // Son kullanıcı kayıtları
        prisma.user.findMany({
          take: 5,
          orderBy: { createdAt: 'desc' },
          select: { name: true, email: true, createdAt: true }
        }),
        // Son müşteri kayıtları
        prisma.customer.findMany({
          take: 5,
          orderBy: { createdAt: 'desc' },
          select: { name: true, email: true, createdAt: true }
        })
      ]),

      // Sistem sağlığı - aktif oturum sayısı
      prisma.session.count({
        where: {
          isActive: true,
          expires: { gt: new Date() }
        }
      }),

      // Yaklaşan takvim etkinlikleri
      prisma.calendarEvent.findMany({
        take: 5,
        where: {
          startDate: { gte: new Date() }
        },
        orderBy: { startDate: 'asc' },
        include: {
          user: { select: { name: true } }
        }
      }),

      // Son giriş geçmişi
      prisma.loginHistory.findMany({
        take: 10,
        orderBy: { loggedInAt: 'desc' },
        include: {
          user: { select: { name: true, email: true } }
        }
      })
    ]);

    // Verileri düzenle
    const [blogCount, faqCount, articleCount, sliderCount] = contentStats;
    const [recentTickets, recentUsers, recentCustomers] = recentActivities;

    // Destek talebi durum dağılımı
    const ticketStatusDistribution = ticketStats.reduce((acc, stat) => {
      acc[stat.status] = stat._count.id;
      return acc;
    }, {} as Record<string, number>);

    // Son aktiviteler listesi
    const activities = [
      ...recentTickets.map(ticket => ({
        id: `ticket-${ticket.id}`,
        type: 'ticket_created' as const,
        title: `Yeni destek talebi: ${ticket.title}`,
        description: `${ticket.customer.name} tarafından oluşturuldu`,
        time: ticket.createdAt.toISOString(),
        status: ticket.status,
        priority: ticket.priority
      })),
      ...recentUsers.map(user => ({
        id: `user-${user.email}`,
        type: 'user_registered' as const,
        title: 'Yeni kullanıcı kayıt oldu',
        description: `${user.name || user.email} sisteme katıldı`,
        time: user.createdAt.toISOString()
      })),
      ...recentCustomers.map(customer => ({
        id: `customer-${customer.email}`,
        type: 'customer_added' as const,
        title: 'Yeni müşteri eklendi',
        description: `${customer.name} müşteri veritabanına eklendi`,
        time: customer.createdAt.toISOString()
      }))
    ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 10);

    // Sistem metrikleri
    const totalUsers = userStats._count.id;
    const totalCustomers = customerStats._count.id;
    const totalTickets = ticketStats.reduce((sum, stat) => sum + stat._count.id, 0);
    const openTickets = ticketStatusDistribution.open || 0;
    const resolvedTickets = (ticketStatusDistribution.resolved || 0) + (ticketStatusDistribution.closed || 0);

    // CRM performans metrikleri
    const ticketResolutionRate = totalTickets > 0 ? (resolvedTickets / totalTickets) * 100 : 0;
    const customerGrowthRate = 8.5; // Bu hesaplanabilir yapılabilir
    const avgTicketsPerUser = totalUsers > 0 ? totalTickets / totalUsers : 0;

    const dashboardData = {
      // Genel istatistikler
      overview: {
        totalUsers,
        totalCustomers,
        totalTickets,
        totalRoles: roleStats._count.id,
        totalPermissions: permissionStats._count.id,
        activeSessions: systemHealth
      },

      // CRM metrikleri
      crmMetrics: {
        totalRevenue: 2847500, // Bu hesaplanabilir yapılabilir
        monthlyGrowth: 12.5,
        activeCustomers: totalCustomers,
        customerGrowth: customerGrowthRate,
        totalLeads: totalCustomers, // Yaklaşık olarak müşteri sayısı
        leadConversion: ticketResolutionRate,
        openOpportunities: openTickets,
        opportunityValue: 1250000, // Bu hesaplanabilir yapılabilir
        activeCampaigns: sliderCount,
        campaignROI: 324.7,
        teamPerformance: 87.3,
        avgDealSize: 45200,
      },

      // Destek sistemi
      supportSystem: {
        totalTickets,
        openTickets,
        resolvedTickets,
        ticketResolutionRate: Math.round(ticketResolutionRate),
        ticketStatusDistribution,
        avgTicketsPerUser: Math.round(avgTicketsPerUser * 100) / 100
      },

      // İçerik yönetimi
      contentManagement: {
        blogPosts: blogCount,
        faqItems: faqCount,
        infoArticles: articleCount,
        heroSliders: sliderCount
      },

      // Son aktiviteler
      recentActivities: activities,

      // Takvim etkinlikleri
      upcomingEvents: calendarEvents.map(event => ({
        id: event.id,
        title: event.title,
        startDate: event.startDate,
        endDate: event.endDate,
        user: event.user.name
      })),

      // Giriş geçmişi
      recentLogins: loginHistory.map(login => ({
        id: login.id,
        user: login.user.name || login.user.email,
        loginTime: login.loggedInAt,
        successful: login.isSuccessful,
        ipAddress: login.ipAddress,
        userAgent: login.userAgent
      }))
    };

    return NextResponse.json({
      success: true,
      data: dashboardData
    });

  } catch (error) {
    console.error("Dashboard data fetch error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Dashboard verileri alınırken bir hata oluştu"
      },
      { status: 500 }
    );
  }
});
