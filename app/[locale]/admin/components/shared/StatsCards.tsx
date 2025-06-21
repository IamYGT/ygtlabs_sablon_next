'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LucideIcon, Users, Shield, Key, BarChart3 } from 'lucide-react';
import { AdminStats } from './types';

interface StatCard {
    title: string;
    value: string | number;
    description?: string;
    icon: LucideIcon;
    iconColor: string;
    badges?: Array<{
        label: string;
        value: string | number;
        variant?: 'default' | 'secondary' | 'destructive' | 'outline';
    }>;
    onClick?: () => void;
}

interface StatsCardsProps {
    cards: StatCard[];
}

export function StatsCards({ cards }: StatsCardsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {cards.map((card, index) => (
                <Card
                    key={index}
                    className={card.onClick ? "cursor-pointer hover:shadow-lg transition-shadow" : ""}
                    onClick={card.onClick}
                >
                    <CardContent className="p-6">
                        <div className="flex items-center">
                            <card.icon className={`h-8 w-8 ${card.iconColor}`} />
                            <div className="ml-4 flex-1">
                                <p className="text-sm font-medium text-muted-foreground">{card.title}</p>
                                <p className="text-2xl font-bold">{card.value}</p>
                                {card.description && (
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {card.description}
                                    </p>
                                )}
                                {card.badges && (
                                    <div className="flex flex-wrap gap-1 mt-2">
                                        {card.badges.map((badge, badgeIndex) => (
                                            <Badge
                                                key={badgeIndex}
                                                variant={badge.variant || 'secondary'}
                                                className="text-xs"
                                            >
                                                {badge.label}: {badge.value}
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

// Standart admin stats için hazır fonksiyon
export function createAdminStatsCards(
    stats: AdminStats,
    onCardClick?: (cardType: string) => void
): StatCard[] {
    return [
        {
            title: 'Toplam Kullanıcı',
            value: stats.users.total,
            description: 'Sistemdeki kullanıcı sayısı',
            icon: Users,
            iconColor: 'text-blue-600',
            badges: [
                { label: 'Aktif', value: stats.users.active, variant: 'default' as const },
                { label: 'Pasif', value: stats.users.inactive, variant: 'secondary' as const }
            ],
            onClick: onCardClick ? () => onCardClick('users') : undefined
        },
        {
            title: 'Sistem Rolleri',
            value: stats.roles.total,
            description: 'Tanımlanmış rol sayısı',
            icon: Shield,
            iconColor: 'text-green-600',
            badges: [
                { label: 'Aktif', value: stats.roles.active, variant: 'default' as const },
                { label: 'Sistem', value: stats.roles.system, variant: 'outline' as const }
            ],
            onClick: onCardClick ? () => onCardClick('roles') : undefined
        },
        ...(stats.permissions ? [{
            title: 'Sistem Yetkileri',
            value: stats.permissions.total,
            description: 'Mevcut yetki sayısı',
            icon: Key,
            iconColor: 'text-purple-600',
            badges: [
                { label: 'Sistem', value: stats.permissions.system, variant: 'outline' as const },
                { label: 'Kategori', value: stats.permissions.categories, variant: 'secondary' as const }
            ],
            onClick: onCardClick ? () => onCardClick('permissions') : undefined
        }] : []),
        {
            title: 'Ortalama Yetki',
            value: stats.roles.total > 0 ? Math.round((stats.permissions?.total || 0) / stats.roles.total) : 0,
            description: 'Rol başına ortalama yetki',
            icon: BarChart3,
            iconColor: 'text-orange-600',
            onClick: onCardClick ? () => onCardClick('analytics') : undefined
        }
    ];
} 