'use client';

// This file now re-exports from the optimized provider
// to maintain backward compatibility and prevent multiple API calls
export { usePermissions } from '@/lib/providers/permissions-provider';
