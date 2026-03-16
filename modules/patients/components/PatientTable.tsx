"use client";

import { motion } from "framer-motion";
import {
    Search,
    Users,
    FileText,
    Hash,
    XCircle,
    AlertTriangle,
    CheckCircle2,
    MoreVertical,
    Clock,
    Building2
} from "lucide-react";
import { Patient } from "@/lib/services/patient";

interface PatientTableProps {
    patients: Patient[] | undefined;
    isLoading: boolean;
    searchTerm: string;
    onSearchChange: (value: string) => void;
    onActionClick: (patient: Patient, rect: DOMRect) => void;
    activeMenuId: string | null;
}

export function PatientTable({
    patients,
    isLoading,
    searchTerm,
    onSearchChange,
    onActionClick,
    activeMenuId
}: PatientTableProps) {
    const isReprocannExpired = (date: string | null): boolean => {
        if (!date) return false;
        return new Date(date) < new Date();
    };

    const isReprocannExpiringSoon = (date: string | null): boolean => {
        if (!date) return false;
        const expDate = new Date(date);
        const now = new Date();
        const diffDays = (expDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
        return diffDays > 0 && diffDays <= 30;
    };

    const formatDate = (date: string | null): string => {
        if (!date) return "—";
        return new Date(date).toLocaleDateString("es-AR", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const filteredPatients = patients?.filter((p) =>
        p.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.documentNumber.includes(searchTerm) ||
        (p.reprocanNumber && p.reprocanNumber.includes(searchTerm))
    );

    return (
        <div className="glass rounded-[2rem] border border-white/50 shadow-xl bg-white/40 backdrop-blur-md">
            <div className="p-6 border-b border-white/40 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="relative w-full sm:max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <input
                        type="text"
                        placeholder="Buscar por nombre, DNI o REPROCANN..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full pl-12 pr-4 py-2.5 bg-white/60 border-2 border-transparent rounded-2xl outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/20 transition-all text-sm font-medium"
                    />
                </div>
            </div>

            <div className="lg:hidden p-4 space-y-4">
                {isLoading ? (
                    Array(3).fill(0).map((_, i) => (
                        <div key={i} className="animate-pulse bg-white/60 rounded-2xl p-4 border border-white/40 space-y-3">
                            <div className="flex gap-3">
                                <div className="h-10 w-10 bg-muted rounded-xl" />
                                <div className="space-y-2 flex-1">
                                    <div className="h-4 w-2/3 bg-muted rounded" />
                                    <div className="h-3 w-1/3 bg-muted rounded" />
                                </div>
                            </div>
                        </div>
                    ))
                ) : filteredPatients?.length === 0 ? (
                    <div className="text-center py-10 text-muted-foreground">
                        <Users size={40} className="mx-auto mb-4 opacity-30" />
                        <p className="font-bold">Sin resultados</p>
                    </div>
                ) : (
                    filteredPatients?.map((p, index) => (
                        <motion.div
                            key={p.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/40 space-y-4"
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">
                                        {p.fullName.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm leading-none">{p.fullName}</p>
                                        <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
                                            <FileText size={10} /> {p.documentNumber}
                                        </p>
                                        <div className="mt-2 flex flex-wrap gap-1">
                                            {p.membershipStatus === "PENDING" && (
                                                <span className="px-2 py-0.5 bg-amber-50 text-[9px] font-bold text-amber-600 rounded-full border border-amber-100 uppercase tracking-tighter">Pendiente</span>
                                            )}
                                            {(p.reprocanStatus === "PENDING_VALIDATION" || p.roles?.includes("APPLICANT")) && (
                                                <span className="px-2 py-0.5 bg-amber-500/10 text-[9px] font-bold text-amber-600 rounded-full border border-amber-500/20 uppercase tracking-tighter">
                                                    Postulante
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={(e) => {
                                        const rect = e.currentTarget.getBoundingClientRect();
                                        onActionClick(p, rect);
                                    }}
                                    className="p-2 rounded-lg hover:bg-white transition-colors"
                                >
                                    <MoreVertical size={18} className="text-muted-foreground" />
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-3 text-[11px]">
                                <div className="space-y-1">
                                    <p className="text-muted-foreground font-bold uppercase tracking-tighter">REPROCANN</p>
                                    {p.reprocanNumber ? (
                                        <span className="text-blue-600 font-bold">{p.reprocanNumber}</span>
                                    ) : (
                                        <span className="text-muted-foreground/50">—</span>
                                    )}
                                </div>
                                <div className="space-y-1">
                                    <p className="text-muted-foreground font-bold uppercase tracking-tighter">Vencimiento</p>
                                    {p.reprocanExpiration ? (
                                        <span className={isReprocannExpired(p.reprocanExpiration) ? "text-destructive font-bold" : "font-medium"}>
                                            {formatDate(p.reprocanExpiration)}
                                        </span>
                                    ) : (
                                        <span className="text-muted-foreground/50">—</span>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2 pt-2 border-t border-white/40">
                                <div className="flex justify-between items-center text-[10px] font-bold">
                                    <span className="text-muted-foreground uppercase tracking-wider">Membresía</span>
                                    {p.memberNumber ? (
                                        <span className="text-emerald-600">Socio {p.memberNumber}</span>
                                    ) : (
                                        <span className="text-slate-400">Sin Nº de Socio</span>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>

            <div className="hidden lg:block overflow-x-auto">
                <table className="w-full border-separate border-spacing-y-0 text-sm">
                    <thead>
                        <tr className="bg-muted/10 text-left border-b border-white/20">
                            <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest rounded-tl-3xl">Paciente</th>
                            <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">DNI</th>
                            <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">REPROCANN</th>
                            <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Vencimiento</th>
                            <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Nº Socio</th>
                            <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-center">Estado</th>
                            <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-right rounded-tr-3xl">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {isLoading ? (
                            Array(3).fill(0).map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    <td className="px-6 py-5"><div className="h-10 w-48 bg-muted rounded-xl" /></td>
                                    <td className="px-6 py-5"><div className="h-6 w-24 bg-muted rounded-lg" /></td>
                                    <td className="px-6 py-5"><div className="h-6 w-20 bg-muted rounded-lg" /></td>
                                    <td className="px-6 py-5"><div className="h-6 w-24 bg-muted rounded-lg" /></td>
                                    <td className="px-6 py-5"><div className="h-6 w-28 bg-muted rounded-lg" /></td>
                                    <td className="px-6 py-5"><div className="h-6 w-16 bg-muted rounded-full mx-auto" /></td>
                                    <td className="px-6 py-5"><div className="h-8 w-8 bg-muted rounded-lg ml-auto" /></td>
                                </tr>
                            ))
                        ) : filteredPatients?.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="px-6 py-20 text-center text-muted-foreground">
                                    <Users size={40} className="mx-auto mb-4 opacity-30" />
                                    <p className="font-bold">Sin resultados</p>
                                    <p className="text-sm mt-1">No se encontraron pacientes para tu búsqueda.</p>
                                </td>
                            </tr>
                        ) : (
                            filteredPatients?.map((p, index) => (
                                <motion.tr
                                    key={p.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="hover:bg-white/40 transition-colors group relative"
                                >
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                                                {p.fullName.charAt(0)}
                                            </div>
                                            <div className="flex flex-col">
                                                <p className="font-bold text-sm text-foreground leading-tight">{p.fullName}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                            <FileText size={14} className="opacity-50" />
                                            {p.documentNumber}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        {p.reprocanNumber ? (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-500/10 text-blue-600 font-bold text-[11px]">
                                                <Hash size={10} />
                                                {p.reprocanNumber}
                                            </span>
                                        ) : (
                                            <span className="text-xs text-muted-foreground/50 font-medium">Sin registro</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-5">
                                        {p.reprocanExpiration ? (
                                            <div className="flex items-center gap-2">
                                                {isReprocannExpired(p.reprocanExpiration) ? (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-destructive/10 text-destructive font-bold text-[10px] border border-destructive/20">
                                                        <XCircle size={10} /> Vencido
                                                    </span>
                                                ) : isReprocannExpiringSoon(p.reprocanExpiration) ? (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 font-bold text-[10px] border border-amber-500/20">
                                                        <AlertTriangle size={10} /> {formatDate(p.reprocanExpiration)}
                                                    </span>
                                                ) : (
                                                    <span className="text-sm font-medium text-muted-foreground">
                                                        {formatDate(p.reprocanExpiration)}
                                                    </span>
                                                )}
                                            </div>
                                        ) : (
                                            <span className="text-xs text-muted-foreground/50 font-medium">—</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-5">
                                        {p.memberNumber ? (
                                            <span className="font-bold text-sm text-slate-700">
                                                {p.memberNumber}
                                            </span>
                                        ) : (
                                            <span className="text-xs text-muted-foreground/50 font-medium">No es socio</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col gap-2">
                                            {p.status === "ACTIVE" ? (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-bold text-[10px] border border-emerald-500/20 w-fit">
                                                    <CheckCircle2 size={10} /> Activo
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 font-bold text-[10px] border border-amber-500/20 w-fit">
                                                    <AlertTriangle size={10} /> Suspendido
                                                </span>
                                            )}

                                            {p.membershipStatus === "APPROVED" ? (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 font-bold text-[10px] border border-blue-500/20 w-fit">
                                                    <Building2 size={10} /> Socio Aprobado
                                                </span>
                                            ) : p.membershipStatus === "PENDING" ? (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 font-bold text-[10px] border border-amber-500/20 w-fit">
                                                    <Clock size={10} /> Socio Pendiente
                                                </span>
                                            ) : p.membershipStatus === "REJECTED" ? (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 font-bold text-[10px] border border-rose-500/20 w-fit">
                                                    <XCircle size={10} /> Socio Rechazado
                                                </span>
                                            ) : null}

                                            {(p.reprocanStatus === "PENDING_VALIDATION" || p.roles?.includes("APPLICANT")) && (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 font-bold text-[10px] border border-amber-500/20 w-fit">
                                                    <AlertTriangle size={10} /> Pendiente de Validación
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-right relative">
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                const rect = e.currentTarget.getBoundingClientRect();
                                                onActionClick(p, rect);
                                            }}
                                            className="p-2 rounded-xl text-muted-foreground hover:bg-white transition-all group-hover:opacity-100 relative z-30"
                                        >
                                            <MoreVertical size={16} />
                                        </button>
                                    </td>
                                </motion.tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
