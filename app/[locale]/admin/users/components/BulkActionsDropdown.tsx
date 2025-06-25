'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Settings,
    UserCheck,
    UserX,
    Download,
    Trash,
} from 'lucide-react';
import { useTranslations } from 'next-intl';

interface BulkActionsDropdownProps {
    selectedCount: number;
    onBulkAction: (action: string) => void;
}

export default function BulkActionsDropdown({
    selectedCount,
    onBulkAction,
}: BulkActionsDropdownProps) {
    const t = useTranslations('AdminUsers.bulkActions');
    if (selectedCount === 0) return null;

    return (
        <div className="flex items-center gap-2">
            <Separator orientation="vertical" className="h-6" />
            <Badge variant="secondary">
                {t('selected', { count: selectedCount })}
            </Badge>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4 mr-1" />
                        {t('title')}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>{t('userActions')}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onBulkAction('activate')}>
                        <UserCheck className="h-4 w-4 mr-2" />
                        {t('activateAll')}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onBulkAction('deactivate')}>
                        <UserX className="h-4 w-4 mr-2" />
                        {t('deactivateAll')}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onBulkAction('export')}>
                        <Download className="h-4 w-4 mr-2" />
                        {t('exportCsv')}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onBulkAction('delete')}>
                        <Trash className="h-4 w-4 mr-2" />
                        {t('deleteSelected')}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
} 