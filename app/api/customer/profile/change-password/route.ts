import { NextResponse, NextRequest } from 'next/server';
import { getCurrentUser } from '@/lib/server-utils';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { hashPassword, verifyPassword } from '@/lib/crypto';

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Mevcut şifre gereklidir.'),
  newPassword: z.string().min(8, 'Yeni şifre en az 8 karakter olmalıdır.'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Yeni şifreler eşleşmiyor.',
  path: ['confirmPassword'],
});

export async function POST(req: NextRequest) {
  const currentUser = await getCurrentUser(req);

  if (!currentUser?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  if (!currentUser.permissions.includes('customer.profile.changePassword')) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const validation = changePasswordSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ errors: validation.error.errors }, { status: 400 });
    }

    const { currentPassword, newPassword } = validation.data;

    const user = await prisma.user.findUnique({
      where: { id: currentUser.id },
    });

    if (!user || !user.password) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const isPasswordValid = await verifyPassword(currentPassword, user.password);

    if (!isPasswordValid) {
      return NextResponse.json({ message: 'Mevcut şifre yanlış.' }, { status: 400 });
    }

    const hashedPassword = await hashPassword.hash(newPassword);

    await prisma.user.update({
      where: { id: currentUser.id },
      data: {
        password: hashedPassword,
        tokenVersion: {
          increment: 1,
        },
      },
    });

    return NextResponse.json({ message: 'Şifre başarıyla güncellendi.' });
  } catch (error) {
    console.error('Error changing password:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}