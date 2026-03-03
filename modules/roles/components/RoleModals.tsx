"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ShieldAlert, Edit2, Trash2, CheckCircle2, Plus, Loader2, AlertTriangle, Fingerprint } from "lucide-react";
import { Role } from "@/lib/services/role";

interface RoleModalsProps {
    isCreateModalOpen: boolean;
    setIsCreateModalOpen: (open: boolean) => void;
    isEditModalOpen: boolean;
    setIsEditModalOpen: (open: boolean) => void;
    isDeleteModalOpen: boolean;
    setIsDeleteModalOpen: (open: boolean) => void;
    selectedRole: Role | null;

    // Form state
    name: string;
    setName: (name: string) => void;

    // Actions
    onCreateRole: (e: React.FormEvent) => void;
    onUpdateRole: (e: React.FormEvent) => void;
    onConfirmDelete: () => void;
    isPending: boolean;

    // Context Menu
    activeMenuId: string | null;
    setActiveMenuId: (id: string | null) => void;
    menuPosition: { top: number; left: number };
    onEditClick: (role: Role) => void;
    onDeleteClick: (role: Role) => void;
}

export function RoleModals({
    isCreateModalOpen,
    setIsCreateModalOpen,
    isEditModalOpen,
    setIsEditModalOpen,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    selectedRole,
    name,
    setName,
    onCreateRole,
    onUpdateRole,
    onConfirmDelete,
    isPending,
    activeMenuId,
    setActiveMenuId,
    menuPosition,
    onEditClick,
    onDeleteClick
}: RoleModalsProps) {

    return (
        <>
            {/* Context Menu overlay */}
            <AnimatePresence>
                {activeMenuId && selectedRole && (
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
                                position: "fixed",
                                top: menuPosition.top,
                                left: menuPosition.left,
                                width: "180px",
                            }}
                            className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/50 z-[70] overflow-hidden"
                        >
                            <button
                                onClick={() => onEditClick(selectedRole)}
                                className="w-full px-4 py-3 text-left text-sm font-bold flex items-center gap-3 hover:bg-primary/5 transition-colors border-b border-muted/20"
                            >
                                <Edit2 size={14} className="text-primary" /> Editar
                            </button>
                            <button
                                onClick={() => onDeleteClick(selectedRole)}
                                className="w-full px-4 py-3 text-left text-sm font-bold flex items-center gap-3 hover:bg-amber-50 text-amber-600 transition-colors"
                            >
                                <Trash2 size={14} /> Eliminar
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
                                setIsCreateModalOpen(false);
                                setIsEditModalOpen(false);
                            }}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-sm glass bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            <div className="p-6 border-b border-muted/30 flex justify-between items-center bg-muted/10 shrink-0">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                                        <Fingerprint size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-black text-foreground">
                                            {isEditModalOpen ? "Editar Rol" : "Nuevo Rol"}
                                        </h2>
                                        <p className="text-xs font-medium text-muted-foreground">
                                            {isEditModalOpen ? "Modificar atributos" : "Añadir a la organización"}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        setIsCreateModalOpen(false);
                                        setIsEditModalOpen(false);
                                    }}
                                    className="p-2 bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground rounded-full transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="p-8 overflow-y-auto">
                                <form onSubmit={isEditModalOpen ? onUpdateRole : onCreateRole} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">Identificador del Rol</label>
                                        <div className="relative group/input">
                                            <ShieldAlert className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within/input:text-primary transition-colors" size={18} />
                                            <input
                                                type="text"
                                                required
                                                autoFocus
                                                value={name}
                                                onChange={(e) => setName(e.target.value.toUpperCase())}
                                                className="w-full pl-12 pr-4 py-3.5 bg-muted/30 border-2 border-transparent rounded-[1.25rem] outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/20 transition-all font-medium text-[15px] text-slate-800"
                                                placeholder="Ej: VENDEDOR"
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-4 flex gap-4">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsCreateModalOpen(false);
                                                setIsEditModalOpen(false);
                                            }}
                                            className="flex-1 py-4 rounded-2xl font-black text-sm uppercase tracking-widest text-muted-foreground hover:bg-muted transition-all"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isPending}
                                            className="flex-[2] py-4 bg-primary text-primary-foreground rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-primary/30 hover:shadow-2xl hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-70"
                                        >
                                            {isPending ? (
                                                <Loader2 size={20} className="animate-spin" />
                                            ) : (
                                                <>
                                                    {isEditModalOpen ? <CheckCircle2 size={20} /> : <Plus size={20} />}
                                                    {isEditModalOpen ? "Guardar" : "Crear"}
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {isDeleteModalOpen && selectedRole && (
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
                            className="relative w-full max-w-sm glass bg-white rounded-[2rem] shadow-2xl border border-white/50 p-8 text-center"
                        >
                            <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-600 mx-auto mb-6">
                                <AlertTriangle size={32} />
                            </div>
                            <h3 className="text-xl font-black mb-2">¿Eliminar Rol?</h3>
                            <p className="text-muted-foreground text-sm font-medium mb-8">
                                Estás a punto de eliminar el rol <span className="text-foreground font-bold">{selectedRole.translatedName || selectedRole.name}</span>. Esta acción no se puede deshacer de forma fácil.
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
                                    className="flex-1 py-4 bg-amber-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-amber-500/20 hover:shadow-2xl hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2"
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
