"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    User,
    Mail,
    Phone,
    MapPin,
    FileText,
    Hash,
    Building2,
    Calendar,
    MessageSquare,
    Loader2,
    ArrowRight,
    CheckCircle2,
    Leaf,
} from "lucide-react";
import { membershipService, MembershipApplicationParams } from "@/lib/services/membership";

interface PublicOrg {
    id: string;
    name: string;
}

export default function PostulacionPage() {
    const [orgs, setOrgs] = useState<PublicOrg[]>([]);
    const [loadingOrgs, setLoadingOrgs] = useState(true);
    const [organizationId, setOrganizationId] = useState("");

    const [fullName, setFullName] = useState("");
    const [documentNumber, setDocumentNumber] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [reprocanNumber, setReprocanNumber] = useState("");
    const [reprocanExpiration, setReprocanExpiration] = useState("");
    const [dailyDose, setDailyDose] = useState("");

    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        membershipService
            .getPublicOrganizations()
            .then((data) => {
                setOrgs(data);
                if (data.length === 1) setOrganizationId(data[0].id);
            })
            .catch(() => setOrgs([]))
            .finally(() => setLoadingOrgs(false));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSubmitting(true);

        try {
            const params: MembershipApplicationParams = {
                organizationId,
                fullName,
                documentNumber,
                ...(email && { email }),
                ...(phone && { phone }),
                ...(address && { address }),
                ...(reprocanNumber && { reprocanNumber }),
                ...(reprocanExpiration && { reprocanExpiration }),
                ...(dailyDose && { dailyDose: parseFloat(dailyDose) }),
            };

            await membershipService.apply(params);
            setSuccess(true);
        } catch (err: any) {
            setError(err.message || "Ocurrio un error al enviar tu postulacion.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f8faf9] relative overflow-hidden px-4 py-10">
            {/* Background */}
            <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-3xl" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-lg relative"
            >
                {/* Header */}
                <div className="text-center mb-8">
                    <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="inline-block mb-4"
                    >
                        <div className="relative w-20 h-20 mx-auto">
                            <Image
                                src="/logo.png"
                                alt="Club Cultivo Logo"
                                fill
                                className="object-contain drop-shadow-sm"
                            />
                        </div>
                    </motion.div>
                    <h1 className="text-3xl font-bold text-primary mb-2">Club Cultivo</h1>
                    <p className="text-muted-foreground">Postulate como socio de nuestra asociacion</p>
                </div>

                {/* Card */}
                <div className="glass p-8 rounded-[2rem] shadow-xl border border-white/40 relative overflow-hidden">
                    {success ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-8"
                        >
                            <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4 text-accent">
                                <CheckCircle2 size={32} />
                            </div>
                            <h2 className="text-2xl font-bold text-primary mb-2">Postulacion Enviada</h2>
                            <p className="text-muted-foreground mb-6">
                                Tu solicitud fue recibida. La comision directiva revisara tus datos y te contactaremos por email con la resolucion.
                            </p>
                            <Link
                                href="/auth/login"
                                className="inline-flex items-center justify-center w-full py-3 px-6 bg-primary text-primary-foreground rounded-xl font-medium transition-all hover:bg-primary/90 hover:shadow-lg active:scale-95"
                            >
                                Ir a Iniciar Sesion
                            </Link>
                        </motion.div>
                    ) : (
                        <>
                            <h2 className="text-xl font-semibold mb-1 flex items-center gap-2">
                                <Leaf size={20} className="text-primary" />
                                Formulario de Postulacion
                            </h2>
                            <p className="text-xs text-muted-foreground mb-6">
                                Completa tus datos para solicitar membresia. Los campos con * son obligatorios.
                            </p>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Asociacion */}
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-muted-foreground ml-1">
                                        Asociacion *
                                    </label>
                                    {loadingOrgs ? (
                                        <div className="flex items-center gap-2 py-3 px-4 text-sm text-muted-foreground">
                                            <Loader2 size={16} className="animate-spin" /> Cargando organizaciones...
                                        </div>
                                    ) : (
                                        <div className="relative group">
                                            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                                            <select
                                                required
                                                value={organizationId}
                                                onChange={(e) => setOrganizationId(e.target.value)}
                                                className="w-full bg-white/50 border border-border rounded-xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm appearance-none cursor-pointer"
                                            >
                                                <option value="">Seleccionar asociacion...</option>
                                                {orgs.map((org) => (
                                                    <option key={org.id} value={org.id}>
                                                        {org.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    )}
                                </div>

                                {/* Nombre completo */}
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-muted-foreground ml-1">
                                        Nombre Completo *
                                    </label>
                                    <div className="relative group">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                                        <input
                                            type="text"
                                            required
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            className="w-full bg-white/50 border border-border rounded-xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                                            placeholder="Ej: Juan Perez"
                                        />
                                    </div>
                                </div>

                                {/* DNI */}
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-muted-foreground ml-1">
                                        DNI / Documento *
                                    </label>
                                    <div className="relative group">
                                        <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                                        <input
                                            type="text"
                                            required
                                            value={documentNumber}
                                            onChange={(e) => setDocumentNumber(e.target.value)}
                                            className="w-full bg-white/50 border border-border rounded-xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                                            placeholder="Ej: 12345678"
                                        />
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-muted-foreground ml-1">
                                        Correo Electrónico (Opcional)
                                    </label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full bg-white/50 border border-border rounded-xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                                            placeholder="tu@email.com"
                                        />
                                    </div>
                                </div>

                                {/* Telefono */}
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-muted-foreground ml-1">
                                        Telefono
                                    </label>
                                    <div className="relative group">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                                        <input
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            className="w-full bg-white/50 border border-border rounded-xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                                            placeholder="Ej: 11-1234-5678"
                                        />
                                    </div>
                                </div>

                                {/* Direccion */}
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-muted-foreground ml-1">
                                        Direccion
                                    </label>
                                    <div className="relative group">
                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                                        <input
                                            type="text"
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                            className="w-full bg-white/50 border border-border rounded-xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                                            placeholder="Ej: Av. Corrientes 1234, CABA"
                                        />
                                    </div>
                                </div>

                                {/* REPROCANN */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-muted-foreground ml-1">
                                            N. REPROCANN
                                        </label>
                                        <div className="relative group">
                                            <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                                            <input
                                                type="text"
                                                value={reprocanNumber}
                                                onChange={(e) => setReprocanNumber(e.target.value)}
                                                className="w-full bg-white/50 border border-border rounded-xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                                                placeholder="Opcional"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-muted-foreground ml-1">
                                            Vencimiento
                                        </label>
                                        <div className="relative group">
                                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                                            <input
                                                type="date"
                                                value={reprocanExpiration}
                                                onChange={(e) => setReprocanExpiration(e.target.value)}
                                                className="w-full bg-white/50 border border-border rounded-xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Dosis Diaria */}
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-muted-foreground ml-1">
                                        Dosis Diaria Prescrita (Opcional)
                                    </label>
                                    <div className="relative group">
                                        <Leaf className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={dailyDose}
                                            onChange={(e) => setDailyDose(e.target.value)}
                                            className="w-full bg-white/50 border border-border rounded-xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                                            placeholder="Ej: 1.5 gramos"
                                        />
                                    </div>
                                </div>

                                {/* Error */}
                                {error && (
                                    <motion.p
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="text-destructive text-xs font-medium bg-destructive/5 p-3 rounded-lg border border-destructive/10"
                                    >
                                        {error}
                                    </motion.p>
                                )}

                                {/* Submit */}
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 active:scale-[0.98] disabled:opacity-70 cursor-pointer"
                                >
                                    {submitting ? (
                                        <Loader2 className="animate-spin" size={20} />
                                    ) : (
                                        <>
                                            Enviar Postulacion
                                            <ArrowRight size={18} />
                                        </>
                                    )}
                                </button>
                            </form>

                            <div className="mt-6 pt-4 border-t border-border flex flex-col items-center gap-2">
                                <p className="text-sm text-muted-foreground">
                                    ¿Ya tenes cuenta?{" "}
                                    <Link href="/auth/login" className="text-primary font-bold hover:underline">
                                        Inicia Sesion
                                    </Link>
                                </p>
                            </div>
                        </>
                    )}
                </div>

                <p className="text-center mt-8 text-xs text-muted-foreground">
                    &copy; {new Date().getFullYear()} Club Cultivo. Cultivando comunidad para un futuro mas verde.
                </p>
            </motion.div>
        </div>
    );
}
