"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { authService, AuthResponse, User } from "@/lib/services/auth";

interface AuthContextType {
    user: User | null;
    token: string | null;
    activeRole: string | null;
    login: (authData: AuthResponse) => void;
    logout: () => void;
    setActiveRole: (role: string) => void;
    isLoading: boolean;
    showSessionWarning: boolean;
    timeLeft: number;
    extendSession: () => Promise<void>;
    refreshProfile: () => Promise<void>;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showSessionWarning, setShowSessionWarning] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);
    const router = useRouter();

    // Referencias para los temporizadores
    const warningTimerRef = React.useRef<NodeJS.Timeout | null>(null);
    const countdownIntervalRef = React.useRef<NodeJS.Timeout | null>(null);

    const clearTimers = () => {
        if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
        if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    };

    const startSessionTimer = (expiresInSeconds?: number) => {
        clearTimers();
        // Fallback a 15 min (900 seg) si no viene del back
        const durationMs = (expiresInSeconds || 15 * 60) * 1000;
        // Mostramos el aviso 2 minutos antes
        const warningTime = Math.max(0, durationMs - (2 * 60 * 1000));

        warningTimerRef.current = setTimeout(() => {
            setShowSessionWarning(true);
            let secondsLeft = 120; // 2 minutos de cuenta regresiva
            setTimeLeft(secondsLeft);

            countdownIntervalRef.current = setInterval(() => {
                secondsLeft -= 1;
                setTimeLeft(secondsLeft);
                if (secondsLeft <= 0) {
                    clearTimers();
                    logout();
                }
            }, 1000);
        }, warningTime);
    };

    useEffect(() => {
        const checkAuth = async () => {
            const accessToken = Cookies.get("auth_token");
            const refreshToken = Cookies.get("refresh_token");

            // Intento de recuperación inmediata desde storage para evitar UI vacía si isLoading falla
            const savedUser = localStorage.getItem("auth_user");
            if (savedUser && !user) {
                try {
                    setUser(JSON.parse(savedUser));
                } catch (e) {
                    localStorage.removeItem("auth_user");
                }
            }

            if (!accessToken && !refreshToken) {
                console.log("AuthContext: No hay sesión activa.");
                setIsLoading(false);
                return;
            }

            try {
                if (accessToken) {
                    try {
                        const response = await authService.getMe(accessToken);
                        if (response.user) {
                            setToken(accessToken);
                            setUser(response.user);
                            startSessionTimer(response.expires_in);
                            console.log("AuthContext: Sesión verificada vía /me");
                            setIsLoading(false);
                            return;
                        }
                    } catch (error) {
                        console.log("AuthContext: Access token inválido o expirado, intentando refresh...");
                    }
                }

                if (refreshToken) {
                    const id = savedUser ? JSON.parse(savedUser).id : null;
                    if (id) {
                        try {
                            const response = await authService.refreshToken({ refreshToken, id });
                            if (response.access_token) {
                                handleAuthData(response);

                                // Asegurar perfil tras refresh
                                if (!response.user) {
                                    const userRes = await authService.getMe(response.access_token);
                                    if (userRes.user) {
                                        setUser(userRes.user);
                                        localStorage.setItem("auth_user", JSON.stringify(userRes.user));
                                    }
                                }

                                console.log("AuthContext: Sesión refrescada e inicializada con éxito");
                                setIsLoading(false);
                                return;
                            }
                        } catch (refreshError) {
                            console.log("AuthContext: Refresh token inválido o fallido");
                        }
                    }
                }

                // Si llegamos aquí y había tokens, es que fallaron todas las verificaciones
                console.warn("AuthContext: Tokens presentes pero inválidos o error de red. Cerrando sesión...");
                logout();
            } catch (error) {
                console.error("AuthContext: Error crítico al verificar sesión", error);
                logout();
            }

            setIsLoading(false);
        };

        checkAuth();
        return () => clearTimers();
    }, []);

    // Helper para guardar tokens y usuario
    const handleAuthData = (data: AuthResponse) => {
        const { access_token, refresh_token, user: userData, expires_in, refresh_expires_in } = data;

        if (access_token) {
            setToken(access_token);
            // Si no viene expires_in, usamos 15 min por defecto (1/96 de día)
            const expires = expires_in ? expires_in / (24 * 60 * 60) : 1 / 96;

            Cookies.set("auth_token", access_token, {
                expires: expires,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/"
            });
            setShowSessionWarning(false);
            startSessionTimer(expires_in); // Reiniciar temporizador
        }

        if (refresh_token) {
            // Si no viene refresh_expires_in, usamos 7 días por defecto
            const expires = refresh_expires_in ? refresh_expires_in / (24 * 60 * 60) : 7;

            Cookies.set("refresh_token", refresh_token, {
                expires: expires,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/"
            });
        }

        if (userData) {
            setUser(userData);
            localStorage.setItem("auth_user", JSON.stringify(userData));
        }
    };

    const extendSession = async () => {
        const refreshToken = Cookies.get("refresh_token");
        const savedUser = localStorage.getItem("auth_user");
        const id = savedUser ? JSON.parse(savedUser).id : null;
        if (refreshToken && id) {
            try {
                const response = await authService.refreshToken({ refreshToken, id });
                handleAuthData(response);
                console.log("AuthContext: Sesión extendida manualmente");
            } catch (error) {
                console.error("AuthContext: Error al extender sesión", error);
                logout();
            }
        } else {
            logout();
        }
    };

    const refreshProfile = async () => {
        if (!token) return;
        try {
            const response = await authService.getMe(token);
            if (response.user) {
                setUser(response.user);
                localStorage.setItem("auth_user", JSON.stringify(response.user));
                console.log("AuthContext: Perfil refrescado con éxito");
            }
        } catch (error) {
            console.error("AuthContext: Falló refresco de perfil", error);
        }
    };

    const setActiveRole = (role: string) => {
        if (user) {
            const updated = { ...user, activeRole: role };
            setUser(updated);
            localStorage.setItem("auth_user", JSON.stringify(updated));
            localStorage.setItem("active_role", role);
        }
    };

    const login = (authData: AuthResponse) => {
        console.log("AuthContext: Procesando login...");
        handleAuthData(authData);

        // If backend provides activeRole, persist it
        if (authData.user?.activeRole) {
            localStorage.setItem("active_role", authData.user.activeRole);
        }
        console.log("AuthContext: Login completado.");
    };


    const logout = () => {
        clearTimers();
        setToken(null);
        setUser(null);
        setShowSessionWarning(false);
        Cookies.remove("auth_token");
        Cookies.remove("refresh_token");
        localStorage.removeItem("auth_user");
        localStorage.removeItem("active_role");
        router.push("/auth/login");
    };


    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    <p className="text-sm font-medium text-muted-foreground animate-pulse">Verificando sesión...</p>
                </div>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={{
            user,
            token,
            activeRole: user?.activeRole || null,
            login,
            logout,
            setActiveRole,
            isLoading,
            showSessionWarning,
            timeLeft,
            extendSession,
            refreshProfile
        }}>

            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
