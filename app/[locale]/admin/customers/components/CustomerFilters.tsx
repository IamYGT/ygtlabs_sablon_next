"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Filter } from "lucide-react";
import { useTranslations } from "next-intl";

interface CustomerFiltersProps {
  activeFilters: string[];
  onFiltersChange: (filters: string[]) => void;
}

export function CustomerFilters({ activeFilters, onFiltersChange }: CustomerFiltersProps) {
  const t = useTranslations("Customers.filters");

  const filterOptions = [
    { id: "active", label: t("status.active"), category: "status" },
    { id: "inactive", label: t("status.inactive"), category: "status" },
    { id: "premium", label: t("type.premium"), category: "type" },
    { id: "regular", label: t("type.regular"), category: "type" },
    { id: "new", label: t("type.new"), category: "type" },
    {
      id: "recent",
      label: t("activity.recent"),
      category: "activity",
    },
    {
      id: "inactive_long",
      label: t("activity.inactive_long"),
      category: "activity",
    },
  ];

  const handleFilterToggle = (filterId: string) => {
    const newFilters = activeFilters.includes(filterId)
      ? activeFilters.filter((id) => id !== filterId)
      : [...activeFilters, filterId];
    onFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    onFiltersChange([]);
  };

  return (
    <div className="flex items-center gap-2" data-scope="admin.customers.filters.container">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="sm"
            className="h-8 rounded-lg bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs px-4 border border-gray-300 dark:border-gray-600 transition-all duration-200 shadow-sm"
            data-scope="admin.customers.filters.trigger"
          >
            <Filter className="mr-2 h-4 w-4" />
            {t("filterButton")}
            {activeFilters.length > 0 && (
              <Badge
                variant="secondary"
                className="ml-2 h-5 w-5 rounded-full p-0 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300"
                data-scope="admin.customers.filters.activeCount"
              >
                {activeFilters.length}
              </Badge>
            )}
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="end" 
          className="w-64 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 shadow-lg rounded-lg overflow-hidden" 
          data-scope="admin.customers.filters.dropdown"
        >
          {/* Status Filters */}
          <div className="p-3 border-b border-gray-100 dark:border-gray-800" data-scope="admin.customers.filters.category.status">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              {t("categories.status")}
            </h4>
            <div className="space-y-1" data-scope="admin.customers.filters.statusOptions">
              {filterOptions
                .filter((option) => option.category === "status")
                .map((option) => (
                  <DropdownMenuCheckboxItem
                    key={option.id}
                    checked={activeFilters.includes(option.id)}
                    onCheckedChange={() => handleFilterToggle(option.id)}
                    className="py-2 px-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors cursor-pointer"
                    data-scope="admin.customers.filters.option"
                    data-filter-id={option.id}
                    data-filter-category="status"
                  >
                    <span className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        option.id === 'active' ? 'bg-emerald-500' : 'bg-red-500'
                      }`}></div>
                      {option.label}
                    </span>
                  </DropdownMenuCheckboxItem>
                ))}
            </div>
          </div>

          {/* Type Filters */}
          <div className="p-3 border-b border-gray-100 dark:border-gray-800" data-scope="admin.customers.filters.category.type">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              {t("categories.type")}
            </h4>
            <div className="space-y-1" data-scope="admin.customers.filters.typeOptions">
              {filterOptions
                .filter((option) => option.category === "type")
                .map((option) => (
                  <DropdownMenuCheckboxItem
                    key={option.id}
                    checked={activeFilters.includes(option.id)}
                    onCheckedChange={() => handleFilterToggle(option.id)}
                    className="py-2 px-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors cursor-pointer"
                    data-scope="admin.customers.filters.option"
                    data-filter-id={option.id}
                    data-filter-category="type"
                  >
                    <span className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        option.id === 'premium' ? 'bg-purple-500' : 
                        option.id === 'new' ? 'bg-yellow-500' : 'bg-gray-400'
                      }`}></div>
                      {option.label}
                    </span>
                  </DropdownMenuCheckboxItem>
                ))}
            </div>
          </div>

          {/* Activity Filters */}
          <div className="p-3" data-scope="admin.customers.filters.category.activity">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              {t("categories.activity")}
            </h4>
            <div className="space-y-1" data-scope="admin.customers.filters.activityOptions">
              {filterOptions
                .filter((option) => option.category === "activity")
                .map((option) => (
                  <DropdownMenuCheckboxItem
                    key={option.id}
                    checked={activeFilters.includes(option.id)}
                    onCheckedChange={() => handleFilterToggle(option.id)}
                    className="py-2 px-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors cursor-pointer"
                    data-scope="admin.customers.filters.option"
                    data-filter-id={option.id}
                    data-filter-category="activity"
                  >
                    <span className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        option.id === 'recent' ? 'bg-green-500' : 'bg-gray-500'
                      }`}></div>
                      {option.label}
                    </span>
                  </DropdownMenuCheckboxItem>
                ))}
            </div>
          </div>

          {activeFilters.length > 0 && (
            <>
              <DropdownMenuSeparator className="mx-3 bg-gray-200 dark:bg-gray-700" />
              <div className="p-3" data-scope="admin.customers.filters.actions">
                <DropdownMenuItem 
                  onClick={clearAllFilters}
                  className="w-full justify-center text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 font-medium transition-colors rounded-md"
                  data-scope="admin.customers.filters.clearAll"
                >
                  <span className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    {t("clearAll")}
                  </span>
                </DropdownMenuItem>
              </div>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Aktif Filtreler */}
      {activeFilters.length > 0 && (
        <div className="flex items-center gap-1 flex-wrap" data-scope="admin.customers.filters.activeBadges">
          {activeFilters.map((filterId) => {
            const filter = filterOptions.find((f) => f.id === filterId);
            const categoryColor = filter?.category === 'status' ? 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-300' :
                               filter?.category === 'type' ? 'bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/20 dark:text-blue-300' :
                               'bg-orange-100 text-orange-800 hover:bg-orange-200 dark:bg-orange-900/20 dark:text-orange-300';
            
            return (
              <Badge
                key={filterId}
                variant="secondary"
                className={`text-xs cursor-pointer transition-colors duration-150 px-2 py-1 rounded-full ${categoryColor}`}
                onClick={() => handleFilterToggle(filterId)}
                data-scope="admin.customers.filters.activeBadge"
                data-filter-id={filterId}
                data-filter-category={filter?.category}
              >
                <span className="flex items-center gap-1">
                  <div className={`w-1.5 h-1.5 rounded-full ${
                    filter?.category === 'status' ? 'bg-green-500' :
                    filter?.category === 'type' ? 'bg-blue-500' : 'bg-orange-500'
                  }`}></div>
                  {filter?.label}
                  <span className="ml-1 font-medium">×</span>
                </span>
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
}
