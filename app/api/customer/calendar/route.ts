import { NextResponse, NextRequest } from 'next/server';
import { getCurrentUser } from '@/lib/server-utils';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const eventSchema = z.object({
  title: z.string().min(1, 'Başlık gereklidir.'),
  description: z.string().optional(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  allDay: z.boolean().optional(),
  color: z.string().optional(),
});

export async function GET(req: NextRequest) {
  const user = await getCurrentUser(req);

  if (!user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  if (!user.permissions.includes('customer.calendar.view')) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  if (!startDate || !endDate) {
    return NextResponse.json({ message: 'Başlangıç ve bitiş tarihleri gereklidir.' }, { status: 400 });
  }

  try {
    const events = await prisma.calendarEvent.findMany({
      where: {
        userId: user.id,
        startDate: { gte: new Date(startDate) },
        endDate: { lte: new Date(endDate) },
      },
      orderBy: {
        startDate: 'asc',
      },
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser(req);

  if (!user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  if (!user.permissions.includes('customer.calendar.create')) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const validation = eventSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ errors: validation.error.errors }, { status: 400 });
    }

    const newEvent = await prisma.calendarEvent.create({
      data: {
        ...validation.data,
        userId: user.id,
      },
    });

    return NextResponse.json(newEvent, { status: 201 });
  } catch (error) {
    console.error('Error creating calendar event:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}