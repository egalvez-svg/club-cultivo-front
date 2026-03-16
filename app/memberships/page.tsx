"use client";

import { useState } from "react";
import {
    Users,
    Clock,
    Search,
    FileText,
    ChevronRight,
    Loader2,
    Building2,
    UserX
} from "lucide-react";
import { usePendingMemberships } from "@/lib/hooks/useMemberships";
import { MembershipRequest, membershipService } from "@/lib/services/membership";
import { motion, AnimatePresence } from "framer-motion";
import { ApprovalModal } from "@/modules/membership/components/ApprovalModal";
import { useAuth } from "@/context/auth-context";
import { sileo } from "sileo";
import { cn } from "@/lib/utils";

export default function MembershipsPage() {
    const { token } = useAuth();
    const { data: requests, isLoading } = usePendingMemberships();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedRequest, setSelectedRequest] = useState<MembershipRequest | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [isDownloadingBook, setIsDownloadingBook] = useState(false);

    const filtered = requests?.filter(p =>
    (p.user?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.user?.documentNumber?.includes(searchTerm))
    );

    const handleOpenModal = (request: MembershipRequest) => {
        setSelectedRequest(request);
        setIsModalOpen(true);
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] gap-4 text-muted-foreground">
                <Loader2 className="animate-spin text-primary" size={40} />
                <span className="font-bold uppercase tracking-widest text-xs">Cargando solicitudes...</span>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                        <Users size={28} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Comisión Directiva</h1>
                        <p className="text-slate-500 font-medium flex items-center gap-2">
                            <Users size={16} />
                            Gestión de Membresías
                        </p>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-4">
                    <button
                        onClick={async () => {
                            if (isDownloadingBook) return;
                            setIsDownloadingBook(true);
                            try {
                                await membershipService.downloadRegisterBook(token || "");
                            } catch (error) {
                                sileo.error({ title: "Error", description: "No se pudo exportar el libro de socios." });
                            } finally {
                                setIsDownloadingBook(false);
                            }
                        }}
                        disabled={isDownloadingBook}
                        className="w-full md:w-auto px-6 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl flex items-center justify-center gap-2 font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all active:scale-[0.98] disabled:opacity-50"
                    >
                        {isDownloadingBook ? <Loader2 size={20} className="animate-spin" /> : <FileText size={20} />}
                        Exportar Libro de Socios
                    </button>

                    <div className="relative group w-full md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Buscar por nombre o DNI..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-medium text-slate-900 shadow-sm"
                        />
                    </div>
                </div>
            </div>

            {/* List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                    {filtered?.map((request, index) => (
                        <motion.div
                            key={request.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-white rounded-3xl border border-slate-200 p-6 hover:shadow-xl hover:border-primary/20 transition-all group relative overflow-hidden"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className={cn(
                                    "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
                                    request.estado === "RECHAZADO" 
                                        ? "bg-rose-50 text-rose-500" 
                                        : "bg-slate-100 text-slate-500 group-hover:bg-primary/10 group-hover:text-primary"
                                )}>
                                    {request.estado === "RECHAZADO" ? <UserX size={24} /> : <FileText size={24} />}
                                </div>
                                <div className={cn(
                                    "px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full",
                                    request.estado === "RECHAZADO" ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-700"
                                )}>
                                    {request.estado}
                                </div>
                            </div>

                            <div className="space-y-1 mb-6">
                                <h3 className="font-bold text-lg text-slate-900 leading-tight group-hover:text-primary transition-colors text-ellipsis overflow-hidden whitespace-nowrap">
                                    {request.user.fullName}
                                </h3>
                                <div className="space-y-0.5">
                                    <p className="text-slate-500 text-sm font-medium">DNI: {request.user.documentNumber}</p>
                                    <p className="text-slate-400 text-xs font-medium text-ellipsis overflow-hidden whitespace-nowrap">{request.user.email}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 text-slate-400 text-xs font-bold mb-6">
                                <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 rounded-lg">
                                    <Clock size={14} />
                                    {new Date(request.applicationDate).toLocaleDateString()}
                                </div>
                                <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 rounded-lg">
                                    <Building2 size={14} />
                                    ONG
                                </div>
                            </div>

                            <button
                                onClick={() => handleOpenModal(request)}
                                className="w-full py-4 bg-slate-50 hover:bg-primary hover:text-white rounded-2xl flex items-center justify-center gap-2 text-slate-600 font-bold text-sm transition-all group/btn"
                            >
                                Gestionar Solicitud
                                <ChevronRight size={18} className="transition-transform group-hover/btn:translate-x-1" />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {filtered?.length === 0 && (
                    <div className="col-span-full py-20 bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400">
                        <Users size={40} className="mb-4 opacity-20" />
                        <p className="font-bold uppercase tracking-widest text-xs">No hay solicitudes para mostrar</p>
                    </div>
                )}
            </div>

            <ApprovalModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                request={selectedRequest}
            />
        </div>
    );
}
