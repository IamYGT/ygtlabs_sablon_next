// ============================================================================
// ENHANCED TANSTACK QUERY PROVIDER - Optimized for Production
// ============================================================================

'use client';

import React from 'react';
import { QueryClient, QueryClientProvider, MutationCache, QueryCache } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { CACHE_CONFIG, ERROR_MESSAGES } from '../constants';
import { useUIStore } from '../stores/ui-store';

// ============================================================================
// ENHANCED QUERY CLIENT CONFIGURATION
// ============================================================================

const createQueryClient = () => {
    return new QueryClient({
        defaultOptions: {
            queries: {
                // Enhanced cache configuration
                staleTime: CACHE_CONFIG.DEFAULT_STALE_TIME,
                gcTime: CACHE_CONFIG.DEFAULT_CACHE_TIME,

                // Enhanced error handling
                retry: (failureCount, error) => {
                    // Don't retry on 4xx errors (client errors)
                    if (error && typeof error === 'object' && 'statusCode' in error) {
                        const statusCode = (error as { statusCode: number }).statusCode;
                        if (statusCode >= 400 && statusCode < 500) {
                            return false;
                        }
                    }

                    // Retry up to 3 times for other errors with exponential backoff
                    return failureCount < 3;
                },

                retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

                // Enhanced refetch configuration
                refetchOnWindowFocus: false,
                refetchOnReconnect: true,
                refetchOnMount: true,
                refetchInterval: false,

                // Network mode for offline support
                networkMode: 'online',

                // Error handling function
                throwOnError: false,
            },
            mutations: {
                // Enhanced mutation configuration
                retry: (failureCount, error) => {
                    // Don't retry mutations on client errors
                    if (error && typeof error === 'object' && 'statusCode' in error) {
                        const statusCode = (error as { statusCode: number }).statusCode;
                        if (statusCode >= 400 && statusCode < 500) {
                            return false;
                        }
                    }

                    // Retry once for server errors
                    return failureCount < 1;
                },

                retryDelay: 1000,
                throwOnError: false,
                networkMode: 'online',
            },
        },
        queryCache: new QueryCache({
            onError: (error, query) => {
                // 401 hatalarını konsola yazmayalım - bu standart bir durum
                if (error && typeof error === 'object' && 'statusCode' in error) {
                    const statusCode = (error as { statusCode: number }).statusCode;
                    if (statusCode !== 401) {
                        console.error('❌ Query Error:', error, 'Query Key:', query.queryKey);
                    }
                } else {
                    console.error('❌ Query Error:', error, 'Query Key:', query.queryKey);
                }

                // Global error handling for queries
                if (error && typeof error === 'object' && 'statusCode' in error) {
                    const statusCode = (error as { statusCode: number }).statusCode;

                    if (statusCode === 401) {
                        // Handle authentication errors globally (sessizce)
                        // console.warn('🔒 Authentication error detected - clearing auth state');

                        // Import auth store and clear auth state
                        const { useAuthStore } = require('../stores/auth-store');
                        const authActions = useAuthStore.getState();

                        // Clear auth state
                        authActions.logout();

                        // Clear all queries
                        const currentClient = getQueryClient();
                        currentClient.removeQueries({ queryKey: ['auth'] });
                        currentClient.removeQueries({ queryKey: ['users'] });

                        // Don't redirect here - let middleware handle it to prevent infinite loops
                    } else if (statusCode >= 500) {
                        // Handle server errors globally
                        const { showError } = useUIStore.getState();
                        showError('Sunucu hatası oluştu', 'Lütfen daha sonra tekrar deneyin');
                    }
                }
            },
        
        }),
        mutationCache: new MutationCache({
            onError: (error, variables, _context, _mutation) => {
                // 401 hatalarını konsola yazmayalım - bu standart bir durum
                if (error && typeof error === 'object' && 'statusCode' in error) {
                    const statusCode = (error as { statusCode: number }).statusCode;
                    if (statusCode !== 401) {
                        console.error('❌ Mutation Error:', error, 'Variables:', variables);
                    }
                } else {
                    console.error('❌ Mutation Error:', error, 'Variables:', variables);
                }

                // Global error handling for mutations
                if (error && typeof error === 'object' && 'statusCode' in error) {
                    const statusCode = (error as { statusCode: number }).statusCode;

                    if (statusCode === 401) {
                        // Authentication error in mutation (sessizce işle)
                        // console.warn('🔒 Authentication error in mutation - clearing auth state');

                        // Import auth store and clear auth state
                        const { useAuthStore } = require('../stores/auth-store');
                        const authActions = useAuthStore.getState();

                        // Clear auth state
                        authActions.logout();

                        // Clear all queries
                        const currentClient = getQueryClient();
                        currentClient.removeQueries({ queryKey: ['auth'] });
                        currentClient.removeQueries({ queryKey: ['users'] });

                        // Don't redirect here - let middleware handle it to prevent infinite loops
                    } else if (statusCode >= 500) {
                        const { showError } = useUIStore.getState();
                        showError('İşlem başarısız', 'Sunucu hatası nedeniyle işlem tamamlanamadı');
                    }
                }
            },
         
        }),
    });
};

// ============================================================================
// SINGLETON QUERY CLIENT MANAGEMENT
// ============================================================================

let queryClient: QueryClient | undefined;

const getQueryClient = () => {
    if (typeof window === 'undefined') {
        // Server-side: always create a new query client
        return createQueryClient();
    } else {
        // Client-side: create query client if it doesn't exist
        if (!queryClient) {
            queryClient = createQueryClient();
        }
        return queryClient;
    }
};

// ============================================================================
// ENHANCED PROVIDER COMPONENT
// ============================================================================

interface QueryProviderProps {
    children: React.ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
    const [client] = React.useState(() => getQueryClient());

    // Cleanup on unmount
    React.useEffect(() => {
        return () => {
            if (typeof window !== 'undefined' && queryClient) {
                queryClient.clear();
            }
        };
    }, []);

    return (
        <QueryClientProvider client={client}>
            {children}
            {process.env.NODE_ENV === 'development' && (
                <ReactQueryDevtools
                    initialIsOpen={false}
                />
            )}
        </QueryClientProvider>
    );
}

// ============================================================================
// ENHANCED UTILITY FUNCTIONS
// ============================================================================

// Enhanced query invalidation with error handling
export const invalidateQueries = async (queryKey: unknown[]) => {
    try {
        const client = getQueryClient();
        await client.invalidateQueries({ queryKey });

    } catch (error) {
        console.error('❌ Failed to invalidate queries:', error);
    }
};

// Enhanced prefetch with error handling and options
export const prefetchQuery = async <T,>(
    queryKey: unknown[],
    queryFn: () => Promise<T>,
    options?: {
        staleTime?: number;
        gcTime?: number;
        force?: boolean;
    }
) => {
    try {
        const client = getQueryClient();
        await client.prefetchQuery({
            queryKey,
            queryFn,
            staleTime: options?.staleTime || CACHE_CONFIG.DEFAULT_STALE_TIME,
            gcTime: options?.gcTime || CACHE_CONFIG.DEFAULT_CACHE_TIME,
        });

    } catch (error) {
        console.error('❌ Failed to prefetch query:', error);
    }
};

// Enhanced data setting with validation
export const setQueryData = <T,>(queryKey: unknown[], data: T) => {
    try {
        const client = getQueryClient();
        client.setQueryData(queryKey, data);

    } catch (error) {
        console.error('❌ Failed to set query data:', error);
    }
};

// Safe data getting with error handling
export const getQueryData = <T,>(queryKey: unknown[]): T | undefined => {
    try {
        const client = getQueryClient();
        return client.getQueryData(queryKey);
    } catch (error) {
        console.error('❌ Failed to get query data:', error);
        return undefined;
    }
};

// Enhanced query removal
export const removeQueries = async (queryKey: unknown[]) => {
    try {
        const client = getQueryClient();
        await client.removeQueries({ queryKey });
    } catch (error) {
        console.error('❌ Failed to remove queries:', error);
    }
};

// Enhanced cache clearing
export const clearQueryCache = async () => {
    try {
        const client = getQueryClient();
        await client.clear();
    } catch (error) {
        console.error('❌ Failed to clear query cache:', error);
    }
};

// ============================================================================
// DOMAIN-SPECIFIC CACHE MANAGEMENT
// ============================================================================

// Enhanced user cache management
export const invalidateUserQueries = async () => {
    await invalidateQueries(['users']);
};

// Enhanced auth cache management
export const invalidateAuthQueries = async () => {
    await invalidateQueries(['auth']);
};

// Enhanced role cache management
export const invalidateRoleQueries = async () => {
    await invalidateQueries(['roles']);
};

// Enhanced permission cache management
export const invalidatePermissionQueries = async () => {
    await invalidateQueries(['permissions']);
};

// Enhanced all queries invalidation
export const invalidateAllQueries = async () => {
    try {
        const client = getQueryClient();
        await client.invalidateQueries();
    } catch (error) {
        console.error('❌ Failed to invalidate all queries:', error);
    }
};

// ============================================================================
// ENHANCED ERROR HANDLING HELPERS
// ============================================================================

// Enhanced error message extraction
export const getQueryErrorMessage = (error: unknown): string => {
    if (error && typeof error === 'object') {
        if ('message' in error && typeof error.message === 'string') {
            return error.message;
        }
        if ('error' in error && typeof error.error === 'string') {
            return error.error;
        }
        if ('statusCode' in error && typeof error.statusCode === 'number') {
            const statusCode = error.statusCode;
            switch (statusCode) {
                case 400: return 'Geçersiz istek';
                case 401: return 'Yetkisiz erişim';
                case 403: return 'Erişim reddedildi';
                case 404: return 'Veri bulunamadı';
                case 500: return 'Sunucu hatası';
                default: return `HTTP ${statusCode} hatası`;
            }
        }
    }

    if (typeof error === 'string') {
        return error;
    }

    return ERROR_MESSAGES.SOMETHING_WENT_WRONG;
};

// Enhanced auth error checking
export const isAuthError = (error: unknown): boolean => {
    if (error && typeof error === 'object' && 'statusCode' in error) {
        const statusCode = (error as { statusCode: number }).statusCode;
        return statusCode === 401 || statusCode === 403;
    }
    return false;
};

// Enhanced network error checking
export const isNetworkError = (error: unknown): boolean => {
    if (error && typeof error === 'object') {
        if ('name' in error && error.name === 'NetworkError') return true;
        if ('message' in error && typeof error.message === 'string') {
            return error.message.toLowerCase().includes('network');
        }
    }
    return false;
};

// ============================================================================
// CACHE WARMING UTILITIES
// ============================================================================

// Warm up essential caches
export const warmUpCache = async () => {
    try {
        const client = getQueryClient();

        // Prefetch current user if not already cached
        const currentUserData = client.getQueryData(['auth', 'currentUser']);
        if (!currentUserData) {
            // This would be called from the auth hook
        }

    } catch (error) {
        console.error('❌ Failed to warm up cache:', error);
    }
};

// Export the query client for direct access if needed
export { getQueryClient };

// ============================================================================
// LOGOUT SPECIFIC CACHE CLEARING
// ============================================================================

export const clearAllCacheOnLogout = async () => {
    try {
        const client = getQueryClient();

        // Clear all queries and mutations
        client.clear();

        // Reset query client to fresh state
        client.invalidateQueries();

    } catch (error) {
        console.error('❌ Error clearing cache on logout:', error);
    }
};