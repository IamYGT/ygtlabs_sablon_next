import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const searchSchema = z.object({
  query: z.string().min(1, 'Arama terimi boş olamaz.'),
});

const staticPages = [
  { id: 'profile', title: 'Profil', url: '/admin/profile' },
  { id: 'calendar', title: 'Takvim', url: '/customer/calendar' },
  { id: 'settings', title: 'Ayarlar', url: '/admin/settings' }, // Varsayılan ayarlar sayfası
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');

    const validation = searchSchema.safeParse({ query });

    if (!validation.success) {
      return NextResponse.json({ error: validation.error.flatten().fieldErrors }, { status: 400 });
    }

    const searchQuery = validation.data.query;

    const [users, blogPosts, supportTickets] = await Promise.all([
      prisma.user.findMany({
        where: {
          OR: [
            { name: { contains: searchQuery, mode: 'insensitive' } },
            { email: { contains: searchQuery, mode: 'insensitive' } },
          ],
        },
        select: { id: true, name: true, email: true },
        take: 5,
      }),
      prisma.blogPost.findMany({
        where: {
          title: {
            path: ['tr'], // Sadece Türkçe başlıkta arama yapıyoruz, genişletilebilir.
            string_contains: searchQuery,
          },
        },
        select: { id: true, title: true },
        take: 5,
      }),
      prisma.supportTicket.findMany({
        where: {
          title: { contains: searchQuery, mode: 'insensitive' },
        },
        select: { id: true, title: true, ticketNumber: true },
        take: 5,
      }),
    ]);

    const filteredPages = staticPages.filter(page =>
      page.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const results = {
      Kullanıcılar: users.map(user => ({
        id: user.id,
        title: user.name || 'İsimsiz Kullanıcı',
        url: `/admin/users/${user.id}`,
      })),
      'Blog Yazıları': blogPosts.map(post => ({
        id: post.id,
        // @ts-expect-error: Prisma's JSON type doesn't have a specific type for the title object yet.
        title: post.title?.tr || 'Başlıksız Yazı',
        url: `/admin/information/blog/${post.id}`,
      })),
      'Destek Talepleri': supportTickets.map(ticket => ({
        id: ticket.id,
        title: `${ticket.ticketNumber}: ${ticket.title}`,
        url: `/admin/support/${ticket.id}`,
      })),
      Sayfalar: filteredPages,
    };

    return NextResponse.json(results);
  } catch (error) {
    console.error('Arama sırasında bir hata oluştu:', error);
    return NextResponse.json({ error: 'Sunucu hatası.' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}