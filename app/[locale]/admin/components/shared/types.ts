// Ortak Admin Panel Tip Tanımları

export interface BaseUser {
  id: string;
  name: string | null;
  email: string | null;
  profileImage: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface UserRole {
  id: string;
  name: string;
  displayName: string;
  color: string | null;
}

export interface User extends BaseUser {
  roleId?: string | null;
  currentRole?: UserRole | null;
}

export interface Permission {
  id: string;
  name: string;
  displayName: string;
  category: string;
  description?: string | null;
}

export interface Role {
  id: string;
  name: string;
  displayName: string;
  description: string | null;
  color: string | null;
  layoutType?: string;
  isActive: boolean;
  isSystemDefault: boolean;
  permissions: Array<{
    permission: Permission;
  }>;
  users?: User[];
  _count?: {
    users: number;
  };
}

export interface AdminStats {
  users: {
    total: number;
    active: number;
    inactive: number;
  };
  roles: {
    total: number;
    active: number;
    system: number;
  };
  permissions?: {
    total: number;
    system: number;
    categories: number;
  };
}

export interface TableAction<T> {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  onClick: (item: T) => void;
  variant?: "default" | "destructive";
  disabled?: boolean;
}

export interface BulkAction {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
  variant?: "default" | "destructive";
}

export interface SearchFilterProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  placeholder?: string;
  filters?: Array<{
    label: string;
    value: string;
    options: Array<{ label: string; value: string }>;
    onChange: (value: string) => void;
  }>;
}
