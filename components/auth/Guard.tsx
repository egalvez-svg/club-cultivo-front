"use client";

import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

interface RoleGuardProps {
    children: React.ReactNode;
    allowedRoles: string[];
}

export function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
    const { user, isLoading, activeRole } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && (!user || !allowedRoles.includes(activeRole || ""))) {
            router.push("/dashboard");
        }
    }, [user, isLoading, activeRole, allowedRoles, router]);

    if (isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center min-h-[60vh]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!user || !allowedRoles.includes(activeRole || "")) {
        return null;
    }

    return <>{children}</>;
}
