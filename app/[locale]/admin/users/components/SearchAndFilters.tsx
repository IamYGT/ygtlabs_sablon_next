'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Filter } from 'lucide-react';
import BulkActionsDropdown from './BulkActionsDropdown';
import { useTranslations } from 'next-intl';

interface SearchAndFiltersProps {
    searchTerm: string;
    onSearchChange: (term: string) => void;
    selectedUsers: string[];
    onBulkAction: (action: string) => void;
}

export default function SearchAndFilters({
    searchTerm,
    onSearchChange,
    selectedUsers,
    onBulkAction,
}: SearchAndFiltersProps) {
    const t = useTranslations('AdminUsers');

    return (
        <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
            <CardContent className="p-4">
                {/* Seçili kullanıcı göstergesi - üstte */}
                {selectedUsers.length > 0 && (
                    <div className="flex items-center justify-between mb-4 p-3 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800 rounded-lg">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                            <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                                {t('search.usersSelected', { count: selectedUsers.length })}
                            </span>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onBulkAction('clear')}
                            className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/20"
                        >
                            {t('search.clearSelection')}
                        </Button>
                    </div>
                )}

                {/* Ana işlem alanı */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    {/* Sol taraf - Arama ve Filtre */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-1">
                        <div className="relative flex-1 max-w-lg">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <Search className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                            </div>
                            <Input
                                placeholder={t('search.placeholder')}
                                value={searchTerm}
                                onChange={(e) => onSearchChange(e.target.value)}
                                className="pl-10 pr-4 py-2.5 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200 text-base"
                            />
                        </div>

                        <Button
                            variant="outline"
                            className="shadow h-8 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs px-4"
                        >
                            <Filter className="h-4 w-4 mr-2" />
                            {t('search.filters')}
                        </Button>
                    </div>

                    {/* Sağ taraf - Bulk Actions */}
                    <div className="flex justify-center sm:justify-end">
                        <BulkActionsDropdown
                            selectedCount={selectedUsers.length}
                            onBulkAction={onBulkAction}
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
} 