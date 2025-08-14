export type Customer = {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  company?: string | null;
  isActive: boolean;
  notes?: Record<string, any> | null;
  createdAt: string;
  updatedAt: string;
};
