"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, MoreVertical, Loader2, Building2, ShieldAlert } from "lucide-react";
import { useOrganizationsList, useCreateOrganization, useUpdateOrganization, useDeleteOrganization } from "@/lib/hooks/useOrganizations";
import { OrganizationModals } from "@/modules/organizations/components/OrganizationModals";
import { Organization } from "@/lib/services/organization";
import { RoleGuard } from "@/components/auth/Guard";
import { useRouter } from "next/navigation";

export default function OrganizationsPage() {
    return (
        <RoleGuard allowedRoles={["SUPER_ADMIN"]}>
            <OrganizationsContent />
        </RoleGuard>
    );
}

function OrganizationsContent() {
    const router = useRouter();
    const { data: organizations, isLoading } = useOrganizationsList();
    const createOrg = useCreateOrganization();
    const updateOrg = useUpdateOrganization();
    const deleteOrg = useDeleteOrganization();

    // Modal states
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null);

    // Context Menu State
    const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

    // Form states
    const [name, setName] = useState("");
    const [active, setActive] = useState(true);

    const resetForm = () => {
        setName("");
        setActive(true);
        setSelectedOrganization(null);
    };

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        createOrg.mutate(
            { name, active },
            {
                onSuccess: () => {
                    setIsCreateModalOpen(false);
                    resetForm();
                }
            }
        );
    };

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedOrganization) return;
        updateOrg.mutate(
            { id: selectedOrganization.id, params: { name, active } },
            {
                onSuccess: () => {
                    setIsEditModalOpen(false);
                    resetForm();
                }
            }
        );
    };

    const handleDelete = () => {
        if (!selectedOrganization) return;
        deleteOrg.mutate(selectedOrganization.id, {
            onSuccess: () => {
                setIsDeleteModalOpen(false);
                setSelectedOrganization(null);
            }
        });
    };

    const openEditModal = (org: Organization) => {
        setSelectedOrganization(org);
        setName(org.name);
        setActive(org.active);
        setIsEditModalOpen(true);
        setActiveMenuId(null);
    };

    const openDeleteModal = (org: Organization) => {
        setSelectedOrganization(org);
        setIsDeleteModalOpen(true);
        setActiveMenuId(null);
    };

    const isPending = createOrg.isPending || updateOrg.isPending || deleteOrg.isPending;

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8" onClick={() => setActiveMenuId(null)}>
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                            <Building2 size={24} />
                        </div>
                        Organizaciones
                    </h1>
                    <p className="text-muted-foreground mt-2 font-medium">
                        Administra los clubes y agrupaciones del sistema.
                    </p>
                </div>
                <button
                    onClick={(e) => { e.stopPropagation(); resetForm(); setIsCreateModalOpen(true); }}
                    className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3.5 rounded-2xl font-black text-sm uppercase tracking-widest hover:opacity-90 transition-opacity whitespace-nowrap shadow-xl shadow-primary/20"
                >
                    <Plus size={20} />
                    Crear Organización
                </button>
            </div>

            {/* Content List/Grid */}
            {isLoading ? (
                <div className="flex justify-center py-20">
                    <Loader2 size={40} className="animate-spin text-muted-foreground" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {organizations?.map((org) => (
                        <div key={org.id} className="bg-card border border-border flex flex-col items-center text-center rounded-2xl p-6 shadow-sm card-hover relative group transition-all">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const rect = e.currentTarget.getBoundingClientRect();
                                    setMenuPosition({ top: rect.bottom + 8, left: rect.left - 180 });
                                    if (activeMenuId === org.id) {
                                        setActiveMenuId(null);
                                    } else {
                                        setSelectedOrganization(org);
                                        setActiveMenuId(org.id);
                                    }
                                }}
                                className="absolute top-4 right-4 text-muted-foreground hover:text-primary transition-colors p-2 rounded-xl hover:bg-white z-10"
                            >
                                <MoreVertical size={20} />
                            </button>

                            <div className={`w-16 h-16 rounded-[1.25rem] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${org.active ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                                <Building2 size={32} />
                            </div>

                            <h3 className="text-xl font-bold mb-1">{org.name}</h3>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${org.active ? 'bg-green-100 text-green-700' : 'bg-rose-100 text-rose-700'}`}>
                                {org.active ? "Activa" : "Inactiva"}
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
                        <h4 className="font-bold text-lg">Nueva Organización</h4>
                        <p className="text-xs text-muted-foreground mt-1 px-4">Agregar al sistema global.</p>
                    </div>
                </div>
            )}

            <OrganizationModals
                isCreateModalOpen={isCreateModalOpen}
                setIsCreateModalOpen={setIsCreateModalOpen}
                isEditModalOpen={isEditModalOpen}
                setIsEditModalOpen={setIsEditModalOpen}
                isDeleteModalOpen={isDeleteModalOpen}
                setIsDeleteModalOpen={setIsDeleteModalOpen}
                selectedOrganization={selectedOrganization}
                name={name}
                setName={setName}
                active={active}
                setActive={setActive}
                onCreateOrganization={handleCreate}
                onUpdateOrganization={handleUpdate}
                onConfirmDelete={handleDelete}
                isPending={isPending}
                activeMenuId={activeMenuId}
                setActiveMenuId={setActiveMenuId}
                menuPosition={menuPosition}
                onEditClick={openEditModal}
                onDeleteClick={openDeleteModal}
                onRolesClick={(id) => router.push(`/organizations/${id}/roles`)}
            />
        </div>
    );
}

