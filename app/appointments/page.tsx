"use client";

import { useState, useEffect } from "react";
import { Edit2, CheckCircle2, XCircle } from "lucide-react";
import {
    useAppointmentsList,
    useCreateAppointment,
    useUpdateAppointment,
    useCancelAppointment,
} from "@/lib/hooks/useAppointments";
import { usePatientsList } from "@/lib/hooks/usePatients";
import { Appointment } from "@/lib/services/appointment";
import { sileo } from "sileo";
import { motion, AnimatePresence } from "framer-motion";

import { AppointmentHeader } from "@/modules/appointments/components/AppointmentHeader";
import { AppointmentStats } from "@/modules/appointments/components/AppointmentStats";
import { AppointmentTable } from "@/modules/appointments/components/AppointmentTable";
import { AppointmentModals } from "@/modules/appointments/components/AppointmentModals";

export default function AppointmentsPage() {
    const { data: appointments, isLoading } = useAppointmentsList();
    const { data: patients } = usePatientsList();

    const createMutation = useCreateAppointment();
    const updateMutation = useUpdateAppointment();
    const cancelMutation = useCancelAppointment();

    const [searchTerm, setSearchTerm] = useState("");
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
    const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

    // Form state
    const [isPatient, setIsPatient] = useState(true);
    const [patientId, setPatientId] = useState("");
    const [guestName, setGuestName] = useState("");
    const [guestPhone, setGuestPhone] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [reason, setReason] = useState("");

    useEffect(() => {
        const handleScroll = () => setActiveMenuId(null);
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const resetForm = () => {
        setIsPatient(true);
        setPatientId("");
        setGuestName("");
        setGuestPhone("");
        setDate("");
        setTime("");
        setReason("");
        setSelectedAppointment(null);
    };

    const handleCreateAppointment = (e: React.FormEvent) => {
        e.preventDefault();
        const dateTime = `${date}T${time}:00.000Z`;

        createMutation.mutate(
            isPatient
                ? { patientId, date: dateTime, reason }
                : { guestName, guestPhone: guestPhone || undefined, date: dateTime, reason },
            {
                onSuccess: () => {
                    setIsCreateModalOpen(false);
                    resetForm();
                    sileo.success({ title: "Turno agendado", description: "El turno fue creado exitosamente" });
                },
                onError: (error) => {
                    sileo.error({ title: "Error", description: error.message || "No se pudo agendar el turno" });
                },
            }
        );
    };

    const handleEditClick = (appointment: Appointment) => {
        setSelectedAppointment(appointment);
        const d = new Date(appointment.date);
        setDate(d.toISOString().split("T")[0]);
        setTime(d.toTimeString().slice(0, 5));
        setReason(appointment.reason);
        setIsPatient(!!appointment.patientId);
        setPatientId(appointment.patientId || "");
        setGuestName(appointment.guestName || "");
        setGuestPhone(appointment.guestPhone || "");
        setIsEditModalOpen(true);
        setActiveMenuId(null);
    };

    const handleUpdateAppointment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedAppointment) return;
        const dateTime = `${date}T${time}:00.000Z`;

        updateMutation.mutate(
            {
                id: selectedAppointment.id,
                params: {
                    date: dateTime,
                    reason,
                    patientId: patientId || undefined,
                },
            },
            {
                onSuccess: () => {
                    setIsEditModalOpen(false);
                    resetForm();
                    sileo.success({ title: "Turno actualizado", description: "Los cambios fueron guardados" });
                },
                onError: (error) => {
                    sileo.error({ title: "Error", description: error.message || "No se pudo actualizar el turno" });
                },
            }
        );
    };

    const handleCompleteClick = (appointment: Appointment) => {
        setActiveMenuId(null);
        updateMutation.mutate(
            { id: appointment.id, params: { status: "COMPLETED" } },
            {
                onSuccess: () => {
                    sileo.success({ title: "Turno completado", description: "El turno fue marcado como completado" });
                },
                onError: (error) => {
                    sileo.error({ title: "Error", description: error.message || "No se pudo completar el turno" });
                },
            }
        );
    };

    const handleCancelClick = (appointment: Appointment) => {
        setSelectedAppointment(appointment);
        setIsCancelModalOpen(true);
        setActiveMenuId(null);
    };

    const confirmCancel = () => {
        if (!selectedAppointment) return;
        cancelMutation.mutate(selectedAppointment.id, {
            onSuccess: () => {
                setIsCancelModalOpen(false);
                setSelectedAppointment(null);
                sileo.success({ title: "Turno cancelado", description: "El turno fue cancelado correctamente" });
            },
            onError: (error) => {
                sileo.error({ title: "Error", description: error.message || "No se pudo cancelar el turno" });
            },
        });
    };

    const handleFormChange = (field: string, value: any) => {
        switch (field) {
            case "isPatient": setIsPatient(value); break;
            case "patientId": setPatientId(value); break;
            case "guestName": setGuestName(value); break;
            case "guestPhone": setGuestPhone(value); break;
            case "date": setDate(value); break;
            case "time": setTime(value); break;
            case "reason": setReason(value); break;
        }
    };

    const getDisplayName = (a: Appointment): string => {
        return a.patient?.fullName ?? a.guestName ?? "Sin nombre";
    };

    const pendingCount = appointments?.filter((a) => a.status === "PENDING").length || 0;
    const completedCount = appointments?.filter((a) => a.status === "COMPLETED").length || 0;
    const cancelledCount = appointments?.filter((a) => a.status === "CANCELLED").length || 0;

    return (
        <div className="space-y-8 pb-10">
            <AppointmentHeader onNewAppointment={() => { resetForm(); setIsCreateModalOpen(true); }} />

            <AppointmentStats
                total={appointments?.length || 0}
                pending={pendingCount}
                completed={completedCount}
                cancelled={cancelledCount}
            />

            <AppointmentTable
                appointments={appointments}
                isLoading={isLoading}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onActionClick={(a, rect) => {
                    setMenuPosition({ top: rect.bottom + 8, left: rect.left - 180 });
                    if (activeMenuId === a.id) {
                        setActiveMenuId(null);
                    } else {
                        setSelectedAppointment(a);
                        setActiveMenuId(a.id);
                    }
                }}
                activeMenuId={activeMenuId}
            />

            <AppointmentModals
                isCreateModalOpen={isCreateModalOpen}
                isEditModalOpen={isEditModalOpen}
                isCancelModalOpen={isCancelModalOpen}
                onCloseCreate={() => { setIsCreateModalOpen(false); resetForm(); }}
                onCloseEdit={() => { setIsEditModalOpen(false); resetForm(); }}
                onCloseCancel={() => setIsCancelModalOpen(false)}
                selectedAppointmentName={selectedAppointment ? getDisplayName(selectedAppointment) : ""}
                patients={patients}
                formState={{ isPatient, patientId, guestName, guestPhone, date, time, reason }}
                onFormChange={handleFormChange}
                onCreateSubmit={handleCreateAppointment}
                onUpdateSubmit={handleUpdateAppointment}
                onCancelConfirm={confirmCancel}
                isPending={createMutation.isPending || updateMutation.isPending || cancelMutation.isPending}
            />

            {/* Actions Context Menu */}
            <AnimatePresence>
                {activeMenuId && selectedAppointment && (
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
                                onClick={() => handleEditClick(selectedAppointment)}
                                className="w-full px-4 py-3.5 text-left text-sm font-bold flex items-center gap-3 hover:bg-primary/5 transition-colors border-b border-muted/20"
                            >
                                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                    <Edit2 size={14} />
                                </div>
                                Editar Turno
                            </button>
                            {selectedAppointment.status === "PENDING" && (
                                <>
                                    <button
                                        onClick={() => handleCompleteClick(selectedAppointment)}
                                        className="w-full px-4 py-3.5 text-left text-sm font-bold flex items-center gap-3 hover:bg-emerald-500/5 text-emerald-600 transition-colors border-b border-muted/20"
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                                            <CheckCircle2 size={14} />
                                        </div>
                                        Completar
                                    </button>
                                    <button
                                        onClick={() => handleCancelClick(selectedAppointment)}
                                        className="w-full px-4 py-3.5 text-left text-sm font-bold flex items-center gap-3 hover:bg-red-500/5 text-red-600 transition-colors"
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-600">
                                            <XCircle size={14} />
                                        </div>
                                        Cancelar
                                    </button>
                                </>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
