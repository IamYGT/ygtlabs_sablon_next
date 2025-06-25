'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Filter, ChevronDown } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function UserFilters() {
    const t = useTranslations('AdminUsers.userFilters');
    const [activeFilters, setActiveFilters] = useState<string[]>([]);

    const filterOptions = [
        { id: 'active', label: t('status.activeUsers'), category: 'status' },
        { id: 'inactive', label: t('status.inactiveUsers'), category: 'status' },
        { id: 'admin', label: t('role.admins'), category: 'role' },
        { id: 'no_role', label: t('role.noRole'), category: 'role' },
        { id: 'recent_login', label: t('activity.recentLogin'), category: 'activity' },
        { id: 'never_login', label: t('activity.neverLogin'), category: 'activity' },
    ];

    const handleFilterToggle = (filterId: string) => {
        setActiveFilters(prev =>
            prev.includes(filterId)
                ? prev.filter(id => id !== filterId)
                : [...prev, filterId]
        );
    };

    const clearAllFilters = () => {
        setActiveFilters([]);
    };

    return (
        <div className="flex items-center gap-2">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                        <Filter className="mr-2 h-4 w-4" />
                        {t('filterButton')}
                        {activeFilters.length > 0 && (
                            <Badge variant="secondary" className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
                                {activeFilters.length}
                            </Badge>
                        )}
                        <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                    <div className="p-2">
                        <p className="text-sm font-medium">{t('categories.status')}</p>
                    </div>
                    {filterOptions
                        .filter(option => option.category === 'status')
                        .map(option => (
                            <DropdownMenuCheckboxItem
                                key={option.id}
                                checked={activeFilters.includes(option.id)}
                                onCheckedChange={() => handleFilterToggle(option.id)}
                            >
                                {option.label}
                            </DropdownMenuCheckboxItem>
                        ))
                    }

                    <DropdownMenuSeparator />

                    <div className="p-2">
                        <p className="text-sm font-medium">{t('categories.role')}</p>
                    </div>
                    {filterOptions
                        .filter(option => option.category === 'role')
                        .map(option => (
                            <DropdownMenuCheckboxItem
                                key={option.id}
                                checked={activeFilters.includes(option.id)}
                                onCheckedChange={() => handleFilterToggle(option.id)}
                            >
                                {option.label}
                            </DropdownMenuCheckboxItem>
                        ))
                    }

                    <DropdownMenuSeparator />

                    <div className="p-2">
                        <p className="text-sm font-medium">{t('categories.activity')}</p>
                    </div>
                    {filterOptions
                        .filter(option => option.category === 'activity')
                        .map(option => (
                            <DropdownMenuCheckboxItem
                                key={option.id}
                                checked={activeFilters.includes(option.id)}
                                onCheckedChange={() => handleFilterToggle(option.id)}
                            >
                                {option.label}
                            </DropdownMenuCheckboxItem>
                        ))
                    }

                    {activeFilters.length > 0 && (
                        <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={clearAllFilters}>
                                {t('clearAll')}
                            </DropdownMenuItem>
                        </>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Aktif Filtreler */}
            {activeFilters.length > 0 && (
                <div className="flex items-center gap-1">
                    {activeFilters.map(filterId => {
                        const filter = filterOptions.find(f => f.id === filterId);
                        return (
                            <Badge
                                key={filterId}
                                variant="secondary"
                                className="text-xs cursor-pointer hover:bg-secondary/80"
                                onClick={() => handleFilterToggle(filterId)}
                            >
                                {filter?.label} ×
                            </Badge>
                        );
                    })}
                </div>
            )}
        </div>
    );
} 