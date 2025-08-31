import { NextResponse, NextRequest } from 'next/server';
import { getCurrentUser } from '@/lib/server-utils';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const eventSchema = z.object({
  title: z.string().min(1, 'Başlık gereklidir.').optional(),
  description: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  allDay: z.boolean().optional(),
  color: z.string().optional(),
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function PUT(req: NextRequest, { params }: any) {
  const user = await getCurrentUser(req);

  if (!user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  if (!user.permissions.includes('customer.calendar.update')) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const validation = eventSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ errors: validation.error.errors }, { status: 400 });
    }

    const event = await prisma.calendarEvent.findUnique({
      where: { id: params.eventId },
    });

    if (!event || event.userId !== user.id) {
      return NextResponse.json({ message: 'Event not found or access denied' }, { status: 404 });
    }

    const updatedEvent = await prisma.calendarEvent.update({
      where: { id: params.eventId },
      data: validation.data,
    });

    return NextResponse.json(updatedEvent);
  } catch (error) {
    console.error('Error updating calendar event:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function DELETE(req: NextRequest, { params }: any) {
  const user = await getCurrentUser(req);

  if (!user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  if (!user.permissions.includes('customer.calendar.delete')) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  try {
    const event = await prisma.calendarEvent.findUnique({
      where: { id: params.eventId },
    });

    if (!event || event.userId !== user.id) {
      return NextResponse.json({ message: 'Event not found or access denied' }, { status: 404 });
    }

    await prisma.calendarEvent.delete({
      where: { id: params.eventId },
    });

    return NextResponse.json({ message: 'Event deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting calendar event:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}