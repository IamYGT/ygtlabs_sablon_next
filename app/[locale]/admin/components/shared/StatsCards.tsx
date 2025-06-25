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

// Standart admin stats için hazır fonksiyon - translations parametresi alır
export function createAdminStatsCards(
    stats: AdminStats,
    translations: {
        totalUsers: string;
        totalUsersDesc: string;
        systemRoles: string;
        systemRolesDesc: string;
        systemPermissions: string;
        systemPermissionsDesc: string;
        avgPermissions: string;
        avgPermissionsDesc: string;
        active: string;
        inactive: string;
        system: string;
        category: string;
    },
    onCardClick?: (cardType: string) => void
): StatCard[] {
    return [
        {
            title: translations.totalUsers,
            value: stats.users.total,
            description: translations.totalUsersDesc,
            icon: Users,
            iconColor: 'text-blue-600',
            badges: [
                { label: translations.active, value: stats.users.active, variant: 'default' as const },
                { label: translations.inactive, value: stats.users.inactive, variant: 'secondary' as const }
            ],
            onClick: onCardClick ? () => onCardClick('users') : undefined
        },
        {
            title: translations.systemRoles,
            value: stats.roles.total,
            description: translations.systemRolesDesc,
            icon: Shield,
            iconColor: 'text-green-600',
            badges: [
                { label: translations.active, value: stats.roles.active, variant: 'default' as const },
                { label: translations.system, value: stats.roles.system, variant: 'outline' as const }
            ],
            onClick: onCardClick ? () => onCardClick('roles') : undefined
        },
        ...(stats.permissions ? [{
            title: translations.systemPermissions,
            value: stats.permissions.total,
            description: translations.systemPermissionsDesc,
            icon: Key,
            iconColor: 'text-purple-600',
            badges: [
                { label: translations.system, value: stats.permissions.system, variant: 'outline' as const },
                { label: translations.category, value: stats.permissions.categories, variant: 'secondary' as const }
            ],
            onClick: onCardClick ? () => onCardClick('permissions') : undefined
        }] : []),
        {
            title: translations.avgPermissions,
            value: stats.roles.total > 0 ? Math.round((stats.permissions?.total || 0) / stats.roles.total) : 0,
            description: translations.avgPermissionsDesc,
            icon: BarChart3,
            iconColor: 'text-orange-600',
            onClick: onCardClick ? () => onCardClick('analytics') : undefined
        }
    ];
} 