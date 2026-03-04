"use client";

import { Search, Shield, FileText, CheckCircle2, XCircle, MoreVertical, Loader2, Building2 } from "lucide-react";
import { motion } from "framer-motion";
import { UserWithRole, Organization } from "@/lib/services/user";

interface UserTableProps {
    users: UserWithRole[] | undefined;
    organizations: Organization[] | undefined;
    isLoading: boolean;
    searchTerm: string;
    onSearchChange: (term: string) => void;
    onActionClick: (user: UserWithRole, rect: DOMRect) => void;
    activeMenuId: string | null;
}

export function UserTable({
    users,
    organizations,
    isLoading,
    searchTerm,
    onSearchChange,
    onActionClick,
    activeMenuId
}: UserTableProps) {
    const filteredUsers = users?.filter(u =>
        u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.documentNumber.includes(searchTerm)
    );

    return (
        <div className="space-y-8">
            {/* Stats/Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass p-6 rounded-3xl border border-white/50 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-500" />
                    <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Total Personal</p>
                    <h3 className="text-4xl font-black text-primary">{users?.length || 0}</h3>
                </div>
                <div className="glass p-6 rounded-3xl border border-white/50 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-500" />
                    <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Activos</p>
                    <h3 className="text-4xl font-black text-accent">{users?.filter(u => u.active).length || 0}</h3>
                </div>
                {organizations !== undefined && (
                    <div className="glass p-6 rounded-3xl border border-white/50 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-500" />
                        <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Organizaciones</p>
                        <h3 className="text-4xl font-black text-blue-500">{organizations?.length || 0}</h3>
                    </div>
                )}
            </div>

            {/* Table/List Filter */}
            <div className="glass rounded-[2rem] border border-white/50 shadow-xl bg-white/40 backdrop-blur-md">
                <div className="p-6 border-b border-white/40 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="relative w-full sm:max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar por nombre, email o DNI..."
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
                    ) : filteredUsers?.length === 0 ? (
                        <div className="text-center py-10 text-muted-foreground">
                            No se encontraron usuarios.
                        </div>
                    ) : (
                        filteredUsers?.map((u, index) => (
                            <motion.div
                                key={u.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/40 space-y-4"
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">
                                            {u.fullName.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm leading-none">{u.fullName}</p>
                                            <p className="text-[10px] text-muted-foreground mt-1 truncate max-w-[150px]">
                                                {u.email}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            const rect = e.currentTarget.getBoundingClientRect();
                                            onActionClick(u, rect);
                                        }}
                                        className="p-2 rounded-lg hover:bg-white transition-colors"
                                    >
                                        <MoreVertical size={18} className="text-muted-foreground" />
                                    </button>
                                </div>

                                <div className="flex flex-wrap gap-2 pt-2 border-t border-white/40">
                                    <div className="flex-1 space-y-1">
                                        <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Documento</p>
                                        <p className="text-xs font-bold text-slate-700">{u.documentNumber}</p>
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Organización</p>
                                        <p className="text-xs font-bold text-blue-600 truncate max-w-[100px]">
                                            {u.organization?.name || u.orgName || "-"}
                                        </p>
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Estado</p>
                                        {u.active ? (
                                            <span className="inline-flex items-center gap-1 text-emerald-600 font-bold text-[10px]">
                                                <CheckCircle2 size={10} /> Activo
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 text-destructive font-bold text-[10px]">
                                                <XCircle size={10} /> Inactivo
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Roles</p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {(u.roles && u.roles.length > 0 ? u.roles : u.role ? [{ id: u.role.id, name: u.role.name }] : []).map((r) => (
                                            <span
                                                key={`role-mobile-${u.id}-${r.id}`}
                                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-100 text-slate-600 font-black text-[9px] uppercase"
                                            >
                                                <Shield size={8} />
                                                {r.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>

                <div className="overflow-x-auto hidden lg:block">
                    <table className="w-full border-separate border-spacing-y-0">
                        <thead>
                            <tr className="bg-muted/10 text-left border-b border-white/20">
                                <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest rounded-tl-3xl">Integrante</th>
                                <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Documento</th>
                                <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Organización</th>
                                <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Rol</th>
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
                                        <td className="px-6 py-5"><div className="h-6 w-24 bg-muted rounded-lg" /></td>
                                        <td className="px-6 py-5"><div className="h-6 w-16 bg-muted rounded-full mx-auto" /></td>
                                        <td className="px-6 py-5"><div className="h-8 w-8 bg-muted rounded-lg ml-auto" /></td>
                                    </tr>
                                ))
                            ) : filteredUsers?.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-20 text-center text-muted-foreground">
                                        No se encontraron resultados para tu búsqueda.
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers?.map((u, index) => (
                                    <motion.tr
                                        key={u.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="hover:bg-white/40 transition-colors group relative"
                                    >
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                                                    {u.fullName.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-sm text-foreground">{u.fullName}</p>
                                                    <p className="text-[11px] font-medium text-muted-foreground">{u.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                                <FileText size={14} className="opacity-50" />
                                                {u.documentNumber}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                                                <Building2 size={14} className="text-blue-500 opacity-70" />
                                                {u.organization?.name || u.orgName || "-"}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex flex-wrap gap-1.5">
                                                {(u.roles && u.roles.length > 0 ? u.roles : u.role ? [{ id: u.role.id, name: u.role.name }] : []).map((r) => (
                                                    <span
                                                        key={`role-${u.id}-${r.id}`}
                                                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg font-black text-[10px] uppercase tracking-wider ${r.name === "ADMIN"
                                                            ? "bg-primary/10 text-primary"
                                                            : r.name === "PATIENT"
                                                                ? "bg-rose-500/10 text-rose-500"
                                                                : "bg-blue-500/10 text-blue-600"
                                                            }`}
                                                    >
                                                        <Shield size={9} />
                                                        {r.name}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex justify-center">
                                                {u.active ? (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-bold text-[10px] border border-emerald-500/20">
                                                        <CheckCircle2 size={10} /> Activo
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-destructive/10 text-destructive font-bold text-[10px] border border-destructive/20">
                                                        <XCircle size={10} /> Inactivo
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
                                                    onActionClick(u, rect);
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
        </div>
    );
}
