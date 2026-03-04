"use client";

import { useState, useEffect } from "react";
import { Shield, Loader2 } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import {
    useUsersList,
    useRoles,
    useCreateUser,
    useOrganizations,
    useUpdateUser,
    useDeleteUser
} from "@/lib/hooks/useUsers";
import { UserWithRole } from "@/lib/services/user";
import { sileo } from "sileo";
import { RoleGuard } from "@/components/auth/Guard";

// Components
import { UserHeader } from "@/modules/users/components/UserHeader";
import { UserTable } from "@/modules/users/components/UserTable";
import { UserModals } from "@/modules/users/components/UserModals";

export default function UsersPage() {
    return (
        <RoleGuard allowedRoles={["ADMIN", "SUPER_ADMIN"]}>
            <UsersContent />
        </RoleGuard>
    );
}

function UsersContent() {
    const { user: currentUser } = useAuth();
    const { data: users, isLoading: isLoadingUsers } = useUsersList();
    const { data: roles } = useRoles();
    const { data: organizations } = useOrganizations(currentUser?.activeRole === "SUPER_ADMIN");

    const createUserMutation = useCreateUser();
    const updateUserMutation = useUpdateUser();
    const deleteUserMutation = useDeleteUser();

    const [searchTerm, setSearchTerm] = useState("");
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserWithRole | null>(null);
    const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

    // Form state
    const [fullName, setFullName] = useState("");
    const [documentNumber, setDocumentNumber] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [roleIds, setRoleIds] = useState<string[]>([]);
    const [organizationId, setOrganizationId] = useState("");

    // Cierra el menú al hacer scroll
    useEffect(() => {
        const handleScroll = () => setActiveMenuId(null);
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const resetForm = () => {
        setFullName("");
        setDocumentNumber("");
        setEmail("");
        setPassword("");
        setRoleIds([]);
        setOrganizationId("");
        setSelectedUser(null);
    };

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        createUserMutation.mutate(
            {
                fullName,
                documentNumber,
                email,
                password,
                roleIds, // Send multiple role IDs
                organizationId: organizationId || undefined
            },
            {
                onSuccess: () => {
                    setIsCreateModalOpen(false);
                    resetForm();
                    sileo.success({ title: "¡Listo!", description: "Usuario creado exitosamente" });
                },
                onError: (error) => {
                    sileo.error({ title: "Error", description: error.message || "No se pudo crear el usuario" });
                }
            }
        );
    };

    const handleEditClick = (user: UserWithRole) => {
        setSelectedUser(user);
        setFullName(user.fullName);
        setDocumentNumber(user.documentNumber);
        setEmail(user.email);
        // Map current roles to IDs
        const currentRoleIds = (user.roles || []).map(r => r.id);
        if (currentRoleIds.length === 0 && user.role) {
            currentRoleIds.push(user.role.id);
        }
        setRoleIds(currentRoleIds);
        setOrganizationId(user.organizationId);
        setIsEditModalOpen(true);
        setActiveMenuId(null);
    };

    const handleUpdateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUser) return;

        updateUserMutation.mutate(
            {
                id: selectedUser.id,
                params: {
                    fullName,
                    documentNumber,
                    email,
                    roleIds, // Send multiple role IDs
                    organizationId: organizationId || undefined
                }
            },
            {
                onSuccess: () => {
                    setIsEditModalOpen(false);
                    resetForm();
                    sileo.success({ title: "¡Actualizado!", description: "Los datos se guardaron correctamente" });
                },
                onError: (error) => {
                    sileo.error({ title: "Error", description: error.message || "No se pudo actualizar el usuario" });
                }
            }
        );
    };

    const handleDeleteClick = (user: UserWithRole) => {
        setSelectedUser(user);
        setIsDeleteModalOpen(true);
        setActiveMenuId(null);
    };

    const confirmDelete = () => {
        if (!selectedUser) return;
        deleteUserMutation.mutate(selectedUser.id, {
            onSuccess: () => {
                setIsDeleteModalOpen(false);
                setSelectedUser(null);
                sileo.success({ title: "Desactivado", description: "El usuario fue desactivado del sistema" });
            },
            onError: (error) => {
                sileo.error({ title: "Error", description: error.message || "No se pudo eliminar el usuario" });
            }
        });
    };

    const handleActionClick = (user: UserWithRole, rect: DOMRect) => {
        setMenuPosition({
            top: rect.bottom + 8,
            left: rect.left - 180
        });
        if (activeMenuId === user.id) {
            setActiveMenuId(null);
        } else {
            setSelectedUser(user);
            setActiveMenuId(user.id);
        }
    };

    if (isLoadingUsers) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] gap-4 text-muted-foreground">
                <Loader2 className="animate-spin text-primary" size={40} />
                <span className="font-bold uppercase tracking-widest text-xs">Cargando personal...</span>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-10">
            <UserHeader onAddUser={() => { resetForm(); setIsCreateModalOpen(true); }} />

            <UserTable
                users={users}
                organizations={organizations}
                isLoading={isLoadingUsers}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onActionClick={handleActionClick}
                activeMenuId={activeMenuId}
            />

            <UserModals
                isCreateModalOpen={isCreateModalOpen}
                setIsCreateModalOpen={setIsCreateModalOpen}
                isEditModalOpen={isEditModalOpen}
                setIsEditModalOpen={setIsEditModalOpen}
                isDeleteModalOpen={isDeleteModalOpen}
                setIsDeleteModalOpen={setIsDeleteModalOpen}
                selectedUser={selectedUser}
                roles={roles}
                organizations={organizations}
                fullName={fullName}
                setFullName={setFullName}
                documentNumber={documentNumber}
                setDocumentNumber={setDocumentNumber}
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                roleIds={roleIds}
                setRoleIds={setRoleIds}
                organizationId={organizationId}
                setOrganizationId={setOrganizationId}
                onCreateUser={handleCreateUser}
                onUpdateUser={handleUpdateUser}
                onConfirmDelete={confirmDelete}
                isPending={createUserMutation.isPending || updateUserMutation.isPending || deleteUserMutation.isPending}
                activeMenuId={activeMenuId}
                setActiveMenuId={setActiveMenuId}
                menuPosition={menuPosition}
                onEditClick={handleEditClick}
                onDeleteClick={handleDeleteClick}
            />
        </div>
    );
}

