"use client";

import { useState, useEffect, useRef } from "react";
import {
    Edit2,
    FileText,
    Trash2,
} from "lucide-react";
import {
    usePatientsList,
    useCreatePatient,
    useUpdatePatient,
    useDeletePatient,
} from "@/lib/hooks/usePatients";
import { ReprocannHistoryModal } from "@/modules/patients/components/reprocann-history-modal";
import { motion, AnimatePresence } from "framer-motion";
import { Patient, patientService } from "@/lib/services/patient";
import { sileo } from "sileo";
import { useAuth } from "@/context/auth-context";

// New Components
import { PatientHeader } from "@/modules/patients/components/PatientHeader";
import { PatientStats } from "@/modules/patients/components/PatientStats";
import { PatientTable } from "@/modules/patients/components/PatientTable";
import { PatientModals } from "@/modules/patients/components/PatientModals";

export default function PatientsPage() {
    const { token } = useAuth();
    const { data: patients, isLoading } = usePatientsList();

    const createMutation = useCreatePatient();
    const updateMutation = useUpdatePatient();
    const deleteMutation = useDeletePatient();

    const [searchTerm, setSearchTerm] = useState("");
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isReprocannModalOpen, setIsReprocannModalOpen] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

    // Form state
    const [fullName, setFullName] = useState("");
    const [documentNumber, setDocumentNumber] = useState("");
    const [email, setEmail] = useState("");
    const [reprocanNumber, setReprocanNumber] = useState("");
    const [reprocanExpiration, setreprocanExpiration] = useState("");
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [minutesBookEntry, setMinutesBookEntry] = useState("");
    const [memberNumber, setMemberNumber] = useState("");

    // Document check state
    const [docCheckStatus, setDocCheckStatus] = useState<"idle" | "checking" | "available" | "exists_can_add" | "already_patient">("idle");
    const [docCheckInfo, setDocCheckInfo] = useState<{ fullName?: string; email?: string; roles?: string[] }>({});
    const docCheckTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Cerrar menú al hacer scroll
    useEffect(() => {
        const handleScroll = () => setActiveMenuId(null);
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Debounced document check
    useEffect(() => {
        if (!documentNumber || documentNumber.length < 6 || isEditModalOpen) {
            setDocCheckStatus("idle");
            setDocCheckInfo({});
            return;
        }

        setDocCheckStatus("checking");

        if (docCheckTimer.current) clearTimeout(docCheckTimer.current);
        docCheckTimer.current = setTimeout(async () => {
            try {
                const result = await patientService.checkDocumentNumber(documentNumber, token || "");
                if (!result.exists) {
                    setDocCheckStatus("available");
                    setDocCheckInfo({});
                } else {
                    const roles = result.roles || [];
                    setDocCheckInfo({ fullName: result.fullName, email: result.email, roles });
                    if (roles.includes("PATIENT")) {
                        setDocCheckStatus("already_patient");
                    } else {
                        setDocCheckStatus("exists_can_add");
                        if (result.fullName && !fullName) setFullName(result.fullName);
                        if (result.email && !email) setEmail(result.email);
                        if (result.reprocanNumber && !reprocanNumber) setReprocanNumber(result.reprocanNumber);
                        if (result.reprocanExpiration && !reprocanExpiration) setreprocanExpiration(result.reprocanExpiration.split("T")[0]);
                    }
                }
            } catch {
                setDocCheckStatus("idle");
            }
        }, 500);

        return () => {
            if (docCheckTimer.current) clearTimeout(docCheckTimer.current);
        };
    }, [documentNumber, token, isEditModalOpen]);

    const resetForm = () => {
        setFullName("");
        setDocumentNumber("");
        setEmail("");
        setReprocanNumber("");
        setreprocanExpiration("");
        setAddress("");
        setPhone("");
        setMinutesBookEntry("");
        setMemberNumber("");
        setDocCheckStatus("idle");
        setDocCheckInfo({});
        setSelectedPatient(null);
    };

    const handleCreatePatient = (e: React.FormEvent) => {
        e.preventDefault();
        if (docCheckStatus === "already_patient") {
            sileo.warning({ title: "Ya es paciente", description: "Este usuario ya tiene el rol de paciente" });
            return;
        }
        createMutation.mutate(
            {
                fullName,
                documentNumber,
                email: email || undefined,
                phone: phone || undefined,
                address: address || undefined,
                reprocanNumber: reprocanNumber || undefined,
                reprocanExpiration: reprocanExpiration || undefined,
            },
            {
                onSuccess: () => {
                    setIsCreateModalOpen(false);
                    resetForm();
                    sileo.success({ title: "¡Registrado!", description: "Paciente creado exitosamente" });
                },
                onError: (error) => {
                    sileo.error({ title: "Error", description: error.message || "No se pudo crear el paciente" });
                },
            }
        );
    };

    const handleEditClick = (patient: Patient) => {
        setSelectedPatient(patient);
        setFullName(patient.fullName);
        setDocumentNumber(patient.documentNumber);
        setEmail(patient.email || "");
        setAddress(patient.address || "");
        setPhone(patient.phone || "");
        setReprocanNumber(patient.reprocanNumber || "");
        setreprocanExpiration(patient.reprocanExpiration ? patient.reprocanExpiration.split("T")[0] : "");
        setMinutesBookEntry(patient.minutesBookEntry || "");
        setMemberNumber(patient.memberNumber || "");
        setIsEditModalOpen(true);
        setActiveMenuId(null);
    };

    const handleUpdatePatient = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedPatient) return;

        updateMutation.mutate(
            {
                id: selectedPatient.id,
                params: {
                    fullName,
                    documentNumber,
                    email: email || undefined,
                    phone: phone || undefined,
                    address: address || undefined,
                    reprocanNumber: reprocanNumber || undefined,
                    reprocanExpiration: reprocanExpiration || undefined,
                },
            },
            {
                onSuccess: () => {
                    setIsEditModalOpen(false);
                    resetForm();
                    sileo.success({ title: "¡Actualizado!", description: "Datos del paciente guardados correctamente" });
                },
                onError: (error) => {
                    sileo.error({ title: "Error", description: error.message || "No se pudo actualizar el paciente" });
                },
            }
        );
    };

    const handleDeleteClick = (patient: Patient) => {
        setSelectedPatient(patient);
        setIsDeleteModalOpen(true);
        setActiveMenuId(null);
    };

    const confirmDelete = () => {
        if (!selectedPatient) return;
        deleteMutation.mutate(selectedPatient.id, {
            onSuccess: () => {
                setIsDeleteModalOpen(false);
                setSelectedPatient(null);
                sileo.success({ title: "Suspendido", description: "El paciente fue suspendido del sistema" });
            },
            onError: (error) => {
                sileo.error({ title: "Error", description: error.message || "No se pudo suspender el paciente" });
            },
        });
    };

    const handleFormChange = (field: string, value: any) => {
        switch (field) {
            case "fullName": setFullName(value); break;
            case "documentNumber": setDocumentNumber(value); break;
            case "email": setEmail(value); break;
            case "reprocanNumber": setReprocanNumber(value); break;
            case "reprocanExpiration": setreprocanExpiration(value); break;
            case "address": setAddress(value); break;
            case "phone": setPhone(value); break;
            case "minutesBookEntry": setMinutesBookEntry(value); break;
            case "memberNumber": setMemberNumber(value); break;
        }
    };

    const activeCount = patients?.filter((p) => p.status === "ACTIVE").length || 0;
    const suspendedCount = patients?.filter((p) => p.status === "SUSPENDED").length || 0;

    return (
        <div className="space-y-8 pb-10">
            <PatientHeader onNewPatient={() => { resetForm(); setIsCreateModalOpen(true); }} />

            <PatientStats
                total={patients?.length || 0}
                active={activeCount}
                suspended={suspendedCount}
            />

            <PatientTable
                patients={patients}
                isLoading={isLoading}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onActionClick={(p, rect) => {
                    setMenuPosition({ top: rect.bottom + 8, left: rect.left - 180 });
                    if (activeMenuId === p.id) {
                        setActiveMenuId(null);
                    } else {
                        setSelectedPatient(p);
                        setActiveMenuId(p.id);
                    }
                }}
                activeMenuId={activeMenuId}
            />

            <PatientModals
                isCreateModalOpen={isCreateModalOpen}
                isEditModalOpen={isEditModalOpen}
                isDeleteModalOpen={isDeleteModalOpen}
                onCloseCreate={() => { setIsCreateModalOpen(false); resetForm(); }}
                onCloseEdit={() => { setIsEditModalOpen(false); resetForm(); }}
                onCloseDelete={() => setIsDeleteModalOpen(false)}
                selectedPatient={selectedPatient}
                formState={{ fullName, documentNumber, email, address, phone, reprocanNumber, reprocanExpiration, minutesBookEntry, memberNumber, docCheckStatus, docCheckInfo }}
                onFormChange={handleFormChange}
                onCreateSubmit={handleCreatePatient}
                onUpdateSubmit={handleUpdatePatient}
                onDeleteConfirm={confirmDelete}
                isPending={createMutation.isPending || updateMutation.isPending || deleteMutation.isPending}
            />

            {/* Global Actions Menu (Fixed Position) */}
            <AnimatePresence>
                {activeMenuId && selectedPatient && (
                    <>
                        <div className="fixed inset-0 z-[60]" onClick={() => setActiveMenuId(null)} />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                            style={{ position: "fixed", top: menuPosition.top, left: menuPosition.left, width: "200px" }}
                            className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/50 z-[70] overflow-hidden"
                        >
                            <button
                                onClick={() => handleEditClick(selectedPatient)}
                                className="w-full px-4 py-3.5 text-left text-sm font-bold flex items-center gap-3 hover:bg-primary/5 transition-colors border-b border-muted/20"
                            >
                                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                    <Edit2 size={14} />
                                </div>
                                Editar Datos
                            </button>
                            <button
                                onClick={() => { setIsReprocannModalOpen(true); setActiveMenuId(null); }}
                                className="w-full px-4 py-3.5 text-left text-sm font-bold flex items-center gap-3 hover:bg-emerald-500/5 text-emerald-600 transition-colors border-b border-muted/20"
                            >
                                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                                    <FileText size={14} />
                                </div>
                                Historial REPROCANN
                            </button>
                            <button
                                onClick={() => handleDeleteClick(selectedPatient)}
                                className="w-full px-4 py-3.5 text-left text-sm font-bold flex items-center gap-3 hover:bg-amber-500/5 text-amber-600 transition-colors"
                            >
                                <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-600">
                                    <Trash2 size={14} />
                                </div>
                                Suspender
                            </button>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Reprocann History Modal */}
            <AnimatePresence>
                {isReprocannModalOpen && (
                    <ReprocannHistoryModal
                        isOpen={isReprocannModalOpen}
                        onClose={() => setIsReprocannModalOpen(false)}
                        patient={selectedPatient}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
