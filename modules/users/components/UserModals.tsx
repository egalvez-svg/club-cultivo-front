"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, UserPlus, Edit2, User as UserIcon, FileText, Mail, Shield, Building2, CheckCircle2, Plus, Loader2, Trash2 } from "lucide-react";
import { UserWithRole, Role, Organization } from "@/lib/services/user";
import { cn } from "@/lib/utils";

interface UserModalsProps {
    isCreateModalOpen: boolean;
    setIsCreateModalOpen: (open: boolean) => void;
    isEditModalOpen: boolean;
    setIsEditModalOpen: (open: boolean) => void;
    isDeleteModalOpen: boolean;
    setIsDeleteModalOpen: (open: boolean) => void;
    selectedUser: UserWithRole | null;
    roles: Role[] | undefined;
    organizations: Organization[] | undefined;
    fullName: string;
    setFullName: (val: string) => void;
    documentNumber: string;
    setDocumentNumber: (val: string) => void;
    email: string;
    setEmail: (val: string) => void;
    password: string;
    setPassword: (val: string) => void;
    roleIds: string[];
    setRoleIds: (ids: string[]) => void;
    organizationId: string;
    setOrganizationId: (val: string) => void;
    onCreateUser: (e: React.FormEvent) => void;
    onUpdateUser: (e: React.FormEvent) => void;
    onConfirmDelete: () => void;
    isPending: boolean;
    activeMenuId: string | null;
    setActiveMenuId: (id: string | null) => void;
    menuPosition: { top: number; left: number };
    onEditClick: (user: UserWithRole) => void;
    onDeleteClick: (user: UserWithRole) => void;
}

export function UserModals({
    isCreateModalOpen,
    setIsCreateModalOpen,
    isEditModalOpen,
    setIsEditModalOpen,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    selectedUser,
    roles,
    organizations,
    fullName,
    setFullName,
    documentNumber,
    setDocumentNumber,
    email,
    setEmail,
    password,
    setPassword,
    roleIds,
    setRoleIds,
    organizationId,
    setOrganizationId,
    onCreateUser,
    onUpdateUser,
    onConfirmDelete,
    isPending,
    activeMenuId,
    setActiveMenuId,
    menuPosition,
    onEditClick,
    onDeleteClick
}: UserModalsProps) {

    const toggleRole = (roleId: string) => {
        if (roleIds.includes(roleId)) {
            setRoleIds(roleIds.filter(id => id !== roleId));
        } else {
            setRoleIds([...roleIds, roleId]);
        }
    };

    return (
        <>
            {/* Context Menu */}
            <AnimatePresence>
                {activeMenuId && selectedUser && (
                    <>
                        <div
                            className="fixed inset-0 z-[60]"
                            onClick={() => setActiveMenuId(null)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                            style={{
                                position: 'fixed',
                                top: menuPosition.top,
                                left: menuPosition.left,
                                width: '200px'
                            }}
                            className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/50 z-[70] overflow-hidden"
                        >
                            <button
                                onClick={() => onEditClick(selectedUser)}
                                className="w-full px-4 py-3.5 text-left text-sm font-bold flex items-center gap-3 hover:bg-primary/5 transition-colors border-b border-muted/20"
                            >
                                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                    <Edit2 size={14} />
                                </div>
                                Editar Perfil
                            </button>
                            <button
                                onClick={() => onDeleteClick(selectedUser)}
                                className="w-full px-4 py-3.5 text-left text-sm font-bold flex items-center gap-3 hover:bg-destructive/5 text-destructive transition-colors"
                            >
                                <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center text-destructive">
                                    <Trash2 size={14} />
                                </div>
                                Eliminar Acceso
                            </button>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Create/Edit Modal */}
            <AnimatePresence>
                {(isCreateModalOpen || isEditModalOpen) && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => {
                                if (isPending) return;
                                setIsCreateModalOpen(false);
                                setIsEditModalOpen(false);
                            }}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-2xl glass bg-white rounded-[2.5rem] shadow-2xl border border-white/50 p-8 max-h-[90vh] overflow-y-auto custom-scrollbar"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                        {isEditModalOpen ? <Edit2 size={24} /> : <UserPlus size={24} />}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black">{isEditModalOpen ? "Editar Integrante" : "Nuevo Operario"}</h3>
                                        <p className="text-xs font-bold text-muted-foreground opacity-70">
                                            {isEditModalOpen ? "Actualiza los datos del usuario en el sistema" : "Define los accesos del nuevo integrante"}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        setIsCreateModalOpen(false);
                                        setIsEditModalOpen(false);
                                    }}
                                    className="p-2 rounded-full hover:bg-muted transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={isEditModalOpen ? onUpdateUser : onCreateUser} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">Nombre Completo</label>
                                        <div className="relative group/input">
                                            <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within/input:text-primary transition-colors" size={18} />
                                            <input
                                                type="text"
                                                required
                                                value={fullName}
                                                onChange={(e) => setFullName(e.target.value)}
                                                className="w-full pl-12 pr-4 py-3.5 bg-muted/30 border-2 border-transparent rounded-[1.25rem] outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/20 transition-all font-medium text-[15px]"
                                                placeholder="Ej: Juan Pérez"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">Documento (DNI)</label>
                                        <div className="relative group/input">
                                            <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within/input:text-primary transition-colors" size={18} />
                                            <input
                                                type="text"
                                                required
                                                value={documentNumber}
                                                onChange={(e) => setDocumentNumber(e.target.value)}
                                                className="w-full pl-12 pr-4 py-3.5 bg-muted/30 border-2 border-transparent rounded-[1.25rem] outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/20 transition-all font-medium text-[15px]"
                                                placeholder="Ej: 12345678"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">Correo Electrónico</label>
                                    <div className="relative group/input">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within/input:text-primary transition-colors" size={18} />
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full pl-12 pr-4 py-3.5 bg-muted/30 border-2 border-transparent rounded-[1.25rem] outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/20 transition-all font-medium text-[15px]"
                                            placeholder="operario@ejemplo.com"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1 block">Roles Asignados</label>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                        {roles?.map((r) => (
                                            <button
                                                key={r.id}
                                                type="button"
                                                onClick={() => toggleRole(r.id)}
                                                className={cn(
                                                    "flex items-center gap-3 p-3 rounded-2xl border-2 transition-all text-left group",
                                                    roleIds.includes(r.id)
                                                        ? "bg-primary/5 border-primary text-primary shadow-md shadow-primary/10"
                                                        : "bg-white border-slate-100 text-slate-400 hover:border-slate-200"
                                                )}
                                            >
                                                <div className={cn(
                                                    "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                                                    roleIds.includes(r.id) ? "bg-primary text-white" : "bg-slate-100 text-slate-400 group-hover:bg-slate-200"
                                                )}>
                                                    <Shield size={16} />
                                                </div>
                                                <span className="text-xs font-bold uppercase tracking-tight truncate">{r.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                    {roleIds.length === 0 && (
                                        <p className="text-[10px] text-destructive font-bold uppercase tracking-widest ml-2 flex items-center gap-1.5 animate-pulse">
                                            <X size={12} /> Selecciona al menos un rol
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">Organización</label>
                                    <div className="relative group/input">
                                        <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within/input:text-primary transition-colors" size={18} />
                                        <select
                                            value={organizationId}
                                            onChange={(e) => setOrganizationId(e.target.value)}
                                            className="w-full pl-12 pr-4 py-3.5 bg-muted/30 border-2 border-transparent rounded-[1.25rem] outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/20 transition-all font-medium text-[15px] appearance-none"
                                        >
                                            <option value="">Org. Por Defecto (Admin)</option>
                                            {organizations?.map((o) => (
                                                <option key={o.id} value={o.id}>{o.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {isCreateModalOpen && (
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">Contraseña Temp.</label>
                                        <input
                                            type="password"
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full px-4 py-3.5 bg-muted/30 border-2 border-transparent rounded-[1.25rem] outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/20 transition-all font-medium text-[15px]"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                )}

                                <div className="pt-4 flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsCreateModalOpen(false);
                                            setIsEditModalOpen(false);
                                        }}
                                        className="flex-1 py-4.5 rounded-2xl font-black text-sm uppercase tracking-widest text-muted-foreground hover:bg-muted transition-all"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isPending || roleIds.length === 0}
                                        className="flex-[2] py-4.5 bg-primary text-primary-foreground rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-primary/30 hover:shadow-2xl hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-70"
                                    >
                                        {isPending ? (
                                            <Loader2 size={20} className="animate-spin" />
                                        ) : (
                                            <>
                                                {isEditModalOpen ? <CheckCircle2 size={20} /> : <Plus size={20} />}
                                                {isEditModalOpen ? "Guardar Cambios" : "Crear Usuario"}
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {isDeleteModalOpen && selectedUser && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsDeleteModalOpen(false)}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-md glass bg-white rounded-[2rem] shadow-2xl border border-white/50 p-8 text-center"
                        >
                            <div className="w-16 h-16 bg-destructive/10 rounded-2xl flex items-center justify-center text-destructive mx-auto mb-6">
                                <Trash2 size={32} />
                            </div>
                            <h3 className="text-xl font-black mb-2">¿Eliminar integrante?</h3>
                            <p className="text-muted-foreground text-sm font-medium mb-8">
                                Estás a punto de desactivar a <span className="text-foreground font-bold">{selectedUser.fullName}</span>.
                                No aparecerá en los listados activos pero sus datos se mantendrán para integridad histórica.
                            </p>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => setIsDeleteModalOpen(false)}
                                    className="flex-1 py-4 rounded-2xl font-black text-sm uppercase tracking-widest text-muted-foreground hover:bg-muted transition-all"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={onConfirmDelete}
                                    disabled={isPending}
                                    className="flex-1 py-4 bg-destructive text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-destructive/20 hover:shadow-2xl hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2"
                                >
                                    {isPending ? (
                                        <Loader2 size={18} className="animate-spin" />
                                    ) : (
                                        "Eliminar"
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
