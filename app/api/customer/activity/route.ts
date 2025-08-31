import { NextResponse, NextRequest } from 'next/server';
import { getCurrentUser } from '@/lib/server-utils';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const user = await getCurrentUser(req);

  if (!user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  if (!user.permissions.includes('customer.activity.view')) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);
  const skip = (page - 1) * limit;

  try {
    const userId = user.id;

    // Kullanıcının hem aktivite loglarını hem de giriş geçmişini al
    const activityLogs = await prisma.userActivityLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: skip,
    });

    const loginHistory = await prisma.loginHistory.findMany({
      where: { userId },
      orderBy: { loggedInAt: 'desc' },
      take: limit,
      skip: skip,
    });

    // İki listeyi birleştirip, tarihe göre yeniden sırala
    const combinedActivities = [
      ...activityLogs.map(log => ({ ...log, type: 'activity', date: log.createdAt })),
      ...loginHistory.map(log => ({ ...log, type: 'login', date: log.loggedInAt })),
    ].sort((a, b) => b.date.getTime() - a.date.getTime());

    // Toplam kayıt sayısını al (sayfalama için)
    const totalRecords = await prisma.userActivityLog.count({ where: { userId } }) + await prisma.loginHistory.count({ where: { userId } });

    return NextResponse.json({
      data: combinedActivities.slice(0, limit), // Birleştirilmiş listeyi limitle
      totalPages: Math.ceil(totalRecords / limit),
      currentPage: page,
    });

  } catch (error) {
    console.error('Error fetching user activity:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}