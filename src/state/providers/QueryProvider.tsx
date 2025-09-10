/**
 * React Query Provider Configuration
 *
 * Centralizes server state management configuration for the application.
 * Handles caching, background refetching, and error boundaries.
 */

"use client";

import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

/**
 * Global Query Client Configuration
 *
 * Optimized for portfolio application with mostly static data
 * that occasionally updates.
 */
const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        // Cache for 5 minutes (same as our repository cache)
        staleTime: 1000 * 60 * 5,
        // Background refetch after 10 minutes
        gcTime: 1000 * 60 * 10,
        // Retry failed requests up to 3 times
        retry: 3,
        // Don't refetch on window focus for portfolio data
        refetchOnWindowFocus: false,
        // Don't refetch on reconnect for static data
        refetchOnReconnect: false,
        // Refetch on mount only if data is stale
        refetchOnMount: true,
      },
      mutations: {
        // Retry mutations once (for payment operations)
        retry: 1,
      },
    },
  });

/**
 * Query Client Provider Component
 *
 * Wraps the application with React Query state management.
 */
interface QueryProviderProps {
  children: React.ReactNode;
}

let queryClientInstance: QueryClient | undefined;

function getQueryClient() {
  if (typeof window === "undefined") {
    // Server side: always create a new client
    return createQueryClient();
  } else {
    // Client side: create the client once and reuse it
    if (!queryClientInstance) {
      queryClientInstance = createQueryClient();
    }
    return queryClientInstance;
  }
}

export function QueryProvider({ children }: QueryProviderProps) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === "development" && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}

/**
 * Hook to access the Query Client
 */
export { useQueryClient } from "@tanstack/react-query";

/**
 * Query Keys Factory
 *
 * Centralized query key management for type safety and consistency.
 */
export const queryKeys = {
  // Project-related queries
  projects: {
    all: ["projects"] as const,
    lists: () => [...queryKeys.projects.all, "list"] as const,
    list: (filters: string) => [...queryKeys.projects.lists(), { filters }] as const,
    details: () => [...queryKeys.projects.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.projects.details(), id] as const,
    featured: () => [...queryKeys.projects.all, "featured"] as const,
    search: (query: string) => [...queryKeys.projects.all, "search", query] as const,
    category: (category: string) => [...queryKeys.projects.all, "category", category] as const,
    technology: (tech: string) => [...queryKeys.projects.all, "technology", tech] as const,
    stats: () => [...queryKeys.projects.all, "stats"] as const,
  },

  // Freelance project queries
  freelance: {
    all: ["freelance"] as const,
    lists: () => [...queryKeys.freelance.all, "list"] as const,
    details: () => [...queryKeys.freelance.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.freelance.details(), id] as const,
    featured: () => [...queryKeys.freelance.all, "featured"] as const,
    client: (client: string) => [...queryKeys.freelance.all, "client", client] as const,
    stats: () => [...queryKeys.freelance.all, "stats"] as const,
  },

  // Payment-related queries
  payments: {
    all: ["payments"] as const,
    orders: () => [...queryKeys.payments.all, "orders"] as const,
    order: (orderId: string) => [...queryKeys.payments.orders(), orderId] as const,
    status: (paymentId: string) => [...queryKeys.payments.all, "status", paymentId] as const,
  },
} as const;

export type QueryKeys = typeof queryKeys;
