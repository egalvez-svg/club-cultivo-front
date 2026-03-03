"use client";

import React from "react";
import { useAuth } from "@/context/auth-context";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, AlertTriangle, RefreshCw, LogOut } from "lucide-react";

export function SessionWarning() {
    const { showSessionWarning, timeLeft, extendSession, logout } = useAuth();

    if (!showSessionWarning) return null;

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const timeFormatted = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="w-full max-w-md bg-white rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.3)] border border-white/50 overflow-hidden"
                >
                    <div className="p-8 text-center">
                        <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6 text-amber-600">
                            <Clock size={40} className="animate-pulse" />
                        </div>

                        <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Tu sesión está por expirar!</h2>
                        <p className="text-gray-500 font-medium mb-8">
                            Por seguridad, tu sesión se cerrará automáticamente en:
                            <span className="block text-3xl font-black text-amber-600 mt-2 font-mono tracking-tighter">
                                {timeFormatted}
                            </span>
                        </p>

                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => extendSession()}
                                className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-bold flex items-center justify-center gap-3 shadow-xl shadow-primary/20 transition-all hover:bg-primary/95 hover:shadow-2xl hover:-translate-y-0.5 active:scale-[0.97]"
                            >
                                <RefreshCw size={20} />
                                Mantener sesión iniciada
                            </button>

                            <button
                                onClick={() => logout()}
                                className="w-full py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all hover:bg-gray-200 active:scale-[0.97]"
                            >
                                <LogOut size={20} />
                                Cerrar sesión ahora
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
