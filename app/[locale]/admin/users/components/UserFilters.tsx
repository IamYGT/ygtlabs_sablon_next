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

export function UserFilters() {
    const [activeFilters, setActiveFilters] = useState<string[]>([]);

    const filterOptions = [
        { id: 'active', label: 'Aktif Kullanıcılar', category: 'status' },
        { id: 'inactive', label: 'Pasif Kullanıcılar', category: 'status' },
        { id: 'admin', label: 'Yöneticiler', category: 'role' },
        { id: 'no_role', label: 'Rolsüz', category: 'role' },
        { id: 'recent_login', label: 'Son 7 Günde Giriş', category: 'activity' },
        { id: 'never_login', label: 'Hiç Giriş Yapmayan', category: 'activity' },
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
                        Filtrele
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
                        <p className="text-sm font-medium">Durum</p>
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
                        <p className="text-sm font-medium">Rol</p>
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
                        <p className="text-sm font-medium">Aktivite</p>
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
                                Tüm Filtreleri Temizle
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