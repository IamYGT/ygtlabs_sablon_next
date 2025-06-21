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

interface BulkActionsDropdownProps {
    selectedCount: number;
    onBulkAction: (action: string) => void;
}

export default function BulkActionsDropdown({
    selectedCount,
    onBulkAction,
}: BulkActionsDropdownProps) {
    if (selectedCount === 0) return null;

    return (
        <div className="flex items-center gap-2">
            <Separator orientation="vertical" className="h-6" />
            <Badge variant="secondary">
                {selectedCount} seçili
            </Badge>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4 mr-1" />
                        Toplu İşlemler
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>Kullanıcı İşlemleri</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onBulkAction('activate')}>
                        <UserCheck className="h-4 w-4 mr-2" />
                        Hepsini Aktif Et
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onBulkAction('deactivate')}>
                        <UserX className="h-4 w-4 mr-2" />
                        Hepsini Devre Dışı Bırak
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onBulkAction('export')}>
                        <Download className="h-4 w-4 mr-2" />
                        CSV Olarak Dışa Aktar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onBulkAction('delete')}>
                        <Trash className="h-4 w-4 mr-2" />
                        Seçilenleri Sil
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
} 