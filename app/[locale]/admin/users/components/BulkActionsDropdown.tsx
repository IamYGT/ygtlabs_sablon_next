"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronDown,
  Download,
  Settings,
  Trash,
  UserCheck,
  UserX,
} from "lucide-react";
import { useTranslations } from "next-intl";

interface BulkActionsDropdownProps {
  selectedCount: number;
  onBulkAction: (action: string) => void;
}

export default function BulkActionsDropdown({
  selectedCount,
  onBulkAction,
}: BulkActionsDropdownProps) {
  const t = useTranslations("AdminUsers.bulkActions");

  // UI data scope - panel ile uyumlu
  const ui = {
    dropdown: {
      content:
        "w-56 bg-blue-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 shadow-lg",
      label: "text-gray-700 dark:text-gray-300 font-medium",
      separator: "bg-gray-200 dark:bg-gray-700",
    },
  };

  if (selectedCount === 0) return null;

  return (
    <div className="flex items-center gap-3">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className="shadow h-8 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs px-4"
            size="sm"
          >
            <Settings className="h-4 w-4 mr-2" />
            {t("title")}
            <ChevronDown className="h-3 w-3 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className={ui.dropdown.content}>
          <DropdownMenuLabel className={ui.dropdown.label}>
            {t("userActions")}
          </DropdownMenuLabel>
          <DropdownMenuSeparator className={ui.dropdown.separator} />

          <DropdownMenuItem
            onClick={() => onBulkAction("activate")}
            className="hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors duration-150"
          >
            <div className="flex items-center">
              <div className="p-1.5 bg-emerald-100 dark:bg-emerald-900/30 rounded mr-3">
                <UserCheck className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
              </div>
              <span className="text-gray-700 dark:text-gray-300">
                {t("activateAll")}
              </span>
            </div>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => onBulkAction("deactivate")}
            className="hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors duration-150"
          >
            <div className="flex items-center">
              <div className="p-1.5 bg-orange-100 dark:bg-orange-900/30 rounded mr-3">
                <UserX className="h-3 w-3 text-orange-600 dark:text-orange-400" />
              </div>
              <span className="text-gray-700 dark:text-gray-300">
                {t("deactivateAll")}
              </span>
            </div>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => onBulkAction("export")}
            className="hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-150"
          >
            <div className="flex items-center">
              <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded mr-3">
                <Download className="h-3 w-3 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-gray-700 dark:text-gray-300">
                {t("exportCsv")}
              </span>
            </div>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />

          <DropdownMenuItem
            onClick={() => onBulkAction("delete")}
            className="hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-150"
          >
            <div className="flex items-center">
              <div className="p-1.5 bg-red-100 dark:bg-red-900/30 rounded mr-3">
                <Trash className="h-3 w-3 text-red-600 dark:text-red-400" />
              </div>
              <span className="text-red-600 dark:text-red-400 font-medium">
                {t("deleteSelected")}
              </span>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
