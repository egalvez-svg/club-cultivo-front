"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CalendarClock, Plus, User } from "lucide-react";
import { useMyAppointments, useCancelAppointment } from "@/lib/hooks/useAppointments";
import { PatientAppointmentTable } from "@/modules/patient/components/PatientAppointmentTable";
import { BookingStepperModal } from "@/modules/patient/components/BookingStepperModal";
import { sileo } from "sileo";

export default function PatientAppointmentsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const { data: appointments, isLoading } = useMyAppointments(searchTerm || undefined);

    const cancelMutation = useCancelAppointment();

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleCancel = (id: string) => {
        cancelMutation.mutate(id, {
            onSuccess: () => {
                sileo.success({ title: "Turno cancelado", description: "Tu turno fue cancelado correctamente" });
            },
            onError: (error) => {
                sileo.error({ title: "Error", description: error.message || "No se pudo cancelar el turno" });
            },
        });
    };

    return (
        <div className="space-y-10 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                            <CalendarClock size={16} />
                        </div>
                        <span className="text-[10px] font-black text-primary uppercase tracking-widest">Gestion de Turnos</span>
                    </div>
                    <h1 className="text-4xl font-black text-slate-800 tracking-tight">
                        Mis <span className="text-primary">Turnos</span>
                    </h1>
                    <p className="text-slate-400 font-bold mt-1 text-sm">
                        Consulta y gestiona tus proximas citas medicas y seguimientos.
                    </p>
                </motion.div>

                <motion.button
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-3 px-8 py-4 bg-primary text-white font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/20 hover:bg-primary-dark transition-all"
                >
                    <Plus size={20} />
                    Solicitar Turno
                </motion.button>
            </div>

            {/* Appointment Table Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <PatientAppointmentTable
                    appointments={appointments}
                    isLoading={isLoading}
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    onCancel={handleCancel}
                    isCancelling={cancelMutation.isPending}
                />
            </motion.div>

            {/* Info Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="p-8 bg-slate-800 rounded-[2.5rem] text-white relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full -mr-32 -mt-32 blur-3xl" />

                <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                    <div className="w-20 h-20 rounded-3xl bg-white/10 backdrop-blur-md flex items-center justify-center text-primary">
                        <User size={40} />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <h3 className="text-xl font-black mb-2">Necesitas ayuda con tus turnos?</h3>
                        <p className="text-slate-400 font-medium">
                            Si tienes algun inconveniente para asistir o necesitas reprogramar una cita de forma urgente,
                            por favor contacta directamente con la administracion de tu club.
                        </p>
                    </div>
                    <button className="px-8 py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl font-black uppercase tracking-widest text-xs transition-colors">
                        Contactar Soporte
                    </button>
                </div>
            </motion.div>

            {/* Booking Stepper Modal */}
            <BookingStepperModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
}
