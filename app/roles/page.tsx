"use client";

import { useState, useEffect } from "react";
import { ShieldAlert, Plus, MoreVertical, Loader2, Fingerprint } from "lucide-react";
import { useRolesList, useCreateRole, useUpdateRole, useDeleteRole } from "@/lib/hooks/useRoles";
import { Role } from "@/lib/services/role";
import { RoleModals } from "@/modules/roles/components/RoleModals";
import { sileo } from "sileo";

export default function RolesPage() {
    const { data: roles, isLoading } = useRolesList();
    const createMutation = useCreateRole();
    const updateMutation = useUpdateRole();
    const deleteMutation = useDeleteRole();

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);

    // Form State
    const [name, setName] = useState("");

    // Context Menu State
    const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

    useEffect(() => {
        const handleScroll = () => setActiveMenuId(null);
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const resetForm = () => {
        setName("");
        setSelectedRole(null);
    };

    const handleCreateRole = (e: React.FormEvent) => {
        e.preventDefault();
        createMutation.mutate(
            { name },
            {
                onSuccess: () => {
                    setIsCreateModalOpen(false);
                    resetForm();
                    sileo.success({ title: "¡Rol Creado!", description: "El rol fue añadido exitosamente." });
                },
                onError: (error) => {
                    sileo.error({ title: "Error", description: error.message || "No se pudo crear el rol." });
                },
            }
        );
    };

    const handleEditClick = (role: Role) => {
        setSelectedRole(role);
        setName(role.name);
        setIsEditModalOpen(true);
        setActiveMenuId(null);
    };

    const handleUpdateRole = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedRole) return;

        updateMutation.mutate(
            { id: selectedRole.id, params: { name } },
            {
                onSuccess: () => {
                    setIsEditModalOpen(false);
                    resetForm();
                    sileo.success({ title: "¡Rol Actualizado!", description: "El rol fue modificado exitosamente." });
                },
                onError: (error) => {
                    sileo.error({ title: "Error", description: error.message || "No se pudo actualizar el rol." });
                },
            }
        );
    };

    const handleDeleteClick = (role: Role) => {
        setSelectedRole(role);
        setIsDeleteModalOpen(true);
        setActiveMenuId(null);
    };

    const confirmDelete = () => {
        if (!selectedRole) return;
        deleteMutation.mutate(selectedRole.id, {
            onSuccess: () => {
                setIsDeleteModalOpen(false);
                setSelectedRole(null);
                sileo.success({ title: "¡Rol Eliminado!", description: "El rol fue removido permanentemente." });
            },
            onError: (error) => {
                sileo.error({ title: "Error", description: error.message || "No se pudo eliminar el rol." });
            },
        });
    };

    const isPending = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold font-display">Roles y Permisos</h2>
                    <p className="text-muted-foreground text-sm">Administra los roles de tu organización.</p>
                </div>
                <button
                    onClick={() => { resetForm(); setIsCreateModalOpen(true); }}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 w-full sm:w-auto"
                >
                    <Plus size={18} />
                    Crear Rol
                </button>
            </div>

            {/* Content List/Grid */}
            {isLoading ? (
                <div className="flex justify-center py-20">
                    <Loader2 size={40} className="animate-spin text-muted-foreground" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {roles?.map((role) => (
                        <div key={role.id} className="bg-card border border-border flex flex-col items-center text-center rounded-2xl p-6 shadow-sm card-hover relative group transition-all">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const rect = e.currentTarget.getBoundingClientRect();
                                    setMenuPosition({ top: rect.bottom + 8, left: rect.left - 180 });
                                    if (activeMenuId === role.id) {
                                        setActiveMenuId(null);
                                    } else {
                                        setSelectedRole(role);
                                        setActiveMenuId(role.id);
                                    }
                                }}
                                className="absolute top-4 right-4 text-muted-foreground hover:text-primary transition-colors p-2 rounded-xl hover:bg-white z-10"
                            >
                                <MoreVertical size={20} />
                            </button>

                            <div className="w-16 h-16 bg-primary/10 rounded-[1.25rem] flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                                <Fingerprint size={32} />
                            </div>

                            <h3 className="text-xl font-bold mb-1">{role.translatedName || role.name}</h3>
                            <span className="bg-muted px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                {role.name}
                            </span>
                        </div>
                    ))}

                    <div
                        onClick={() => { resetForm(); setIsCreateModalOpen(true); }}
                        className="bg-secondary/20 border border-primary/10 rounded-2xl p-6 flex flex-col justify-center items-center text-center group cursor-pointer hover:bg-secondary/30 transition-all border-dashed"
                    >
                        <div className="w-16 h-16 bg-white rounded-[1.25rem] flex items-center justify-center text-primary shadow-sm mb-4 group-hover:scale-110 transition-transform">
                            <Plus size={32} />
                        </div>
                        <h4 className="font-bold text-lg">Nuevo Rol</h4>
                        <p className="text-xs text-muted-foreground mt-1 px-4">Agregar a la organización.</p>
                    </div>
                </div>
            )}

            <RoleModals
                isCreateModalOpen={isCreateModalOpen}
                setIsCreateModalOpen={setIsCreateModalOpen}
                isEditModalOpen={isEditModalOpen}
                setIsEditModalOpen={setIsEditModalOpen}
                isDeleteModalOpen={isDeleteModalOpen}
                setIsDeleteModalOpen={setIsDeleteModalOpen}
                selectedRole={selectedRole}
                name={name}
                setName={setName}
                onCreateRole={handleCreateRole}
                onUpdateRole={handleUpdateRole}
                onConfirmDelete={confirmDelete}
                isPending={isPending}
                activeMenuId={activeMenuId}
                setActiveMenuId={setActiveMenuId}
                menuPosition={menuPosition}
                onEditClick={handleEditClick}
                onDeleteClick={handleDeleteClick}
            />
        </div>
    );
}
