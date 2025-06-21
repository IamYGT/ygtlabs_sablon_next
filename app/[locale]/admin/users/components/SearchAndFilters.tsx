'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import BulkActionsDropdown from './BulkActionsDropdown';

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
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Kullanıcı ara..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pl-9 w-[300px]"
                    />
                </div>

                <BulkActionsDropdown
                    selectedCount={selectedUsers.length}
                    onBulkAction={onBulkAction}
                />
            </div>
        </div>
    );
} 