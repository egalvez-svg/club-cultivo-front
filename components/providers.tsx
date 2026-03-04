"use client";

import { QueryClient, QueryClientProvider, MutationCache, QueryCache } from "@tanstack/react-query";
import { useState } from "react";

import { UIProvider } from "@/context/ui-context";
import { sileo } from "sileo";

export default function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 60 * 1000,
                retry: (failureCount, error: any) => {
                    // Don't retry on 403
                    if (error?.status === 403 || error?.message?.includes("403")) return false;
                    return failureCount < 1;
                },
            },
        },
        mutationCache: new MutationCache({
            onError: (error: any) => {
                if (error?.status === 403 || error?.message?.includes("403")) {
                    sileo.error({
                        title: "Permiso Denegado",
                        description: "No tienes permisos suficientes para realizar esta acción."
                    });
                }
            }
        }),
        queryCache: new QueryCache({
            onError: (error: any) => {
                if (error?.status === 403 || error?.message?.includes("403")) {
                    sileo.error({
                        title: "Acceso Restringido",
                        description: "Tu rol actual no permite ver esta información."
                    });
                }
            }
        })
    }));

    return (
        <QueryClientProvider client={queryClient}>
            <UIProvider>
                {children}
            </UIProvider>
        </QueryClientProvider>
    );
}
