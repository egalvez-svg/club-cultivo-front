"use client";

import { useState, useEffect } from "react";
import {
    Leaf,
    FlaskConical,
    Plus,
    Dna,
    MoreVertical,
    Beaker,
    Thermometer,
    Edit2,
    Trash2,
    X,
    AlertTriangle,
    Loader2,
    CheckCircle2,
    Activity,
    Hash,
    ChevronDown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useStrainsList, useCreateStrain, useUpdateStrain, useDeleteStrain } from "@/lib/hooks/useStrains";
import { Strain } from "@/lib/services/strain";
import { sileo } from "sileo";

export default function StrainsPage() {
    const { data: strains, isLoading } = useStrainsList();

    const createMutation = useCreateStrain();
    const updateMutation = useUpdateStrain();
    const deleteMutation = useDeleteStrain();

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedStrain, setSelectedStrain] = useState<Strain | null>(null);
    const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

    // Form state
    const [name, setName] = useState("");
    const [genetics, setGenetics] = useState("");
    const [type, setType] = useState<"INDICA" | "SATIVA" | "HYBRID" | "OTHER" | "">("");
    const [thcPercentage, setThcPercentage] = useState("");
    const [cbdPercentage, setCbdPercentage] = useState("");

    useEffect(() => {
        const handleScroll = () => setActiveMenuId(null);
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const resetForm = () => {
        setName("");
        setGenetics("");
        setType("");
        setThcPercentage("");
        setCbdPercentage("");
        setSelectedStrain(null);
    };

    const handleCreateStrain = (e: React.FormEvent) => {
        e.preventDefault();
        createMutation.mutate(
            {
                name,
                genetics: genetics || undefined,
                type: (type as any) || undefined,
                thcPercentage: thcPercentage ? parseFloat(thcPercentage) : undefined,
                cbdPercentage: cbdPercentage ? parseFloat(cbdPercentage) : undefined,
            },
            {
                onSuccess: () => {
                    setIsCreateModalOpen(false);
                    resetForm();
                    sileo.success({ title: "¡Registrada!", description: "Cepa creada exitosamente" });
                },
                onError: (error) => {
                    sileo.error({ title: "Error", description: error.message || "No se pudo crear la cepa" });
                },
            }
        );
    };

    const handleEditClick = (strain: Strain) => {
        setSelectedStrain(strain);
        setName(strain.name);
        setGenetics(strain.genetics || "");
        setType(strain.type || "");
        setThcPercentage(strain.thcPercentage !== null ? strain.thcPercentage.toString() : "");
        setCbdPercentage(strain.cbdPercentage !== null ? strain.cbdPercentage.toString() : "");
        setIsEditModalOpen(true);
        setActiveMenuId(null);
    };

    const handleUpdateStrain = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedStrain) return;

        updateMutation.mutate(
            {
                id: selectedStrain.id,
                params: {
                    name,
                    genetics: genetics || undefined,
                    type: (type as any) || undefined,
                    thcPercentage: thcPercentage ? parseFloat(thcPercentage) : undefined,
                    cbdPercentage: cbdPercentage ? parseFloat(cbdPercentage) : undefined,
                },
            },
            {
                onSuccess: () => {
                    setIsEditModalOpen(false);
                    resetForm();
                    sileo.success({ title: "¡Actualizada!", description: "La cepa fue actualizada" });
                },
                onError: (error) => {
                    sileo.error({ title: "Error", description: error.message || "No se pudo actualizar" });
                },
            }
        );
    };

    const handleDeleteClick = (strain: Strain) => {
        setSelectedStrain(strain);
        setIsDeleteModalOpen(true);
        setActiveMenuId(null);
    };

    const confirmDelete = () => {
        if (!selectedStrain) return;
        deleteMutation.mutate(selectedStrain.id, {
            onSuccess: () => {
                setIsDeleteModalOpen(false);
                setSelectedStrain(null);
                sileo.success({ title: "¡Suspendida!", description: "La cepa fue dada de baja" });
            },
            onError: (error) => {
                sileo.error({ title: "Error", description: error.message || "No se pudo suspender" });
            },
        });
    };

    // Helper para formatear UI del tipo
    const getTypeColor = (t: string | null) => {
        switch (t) {
            case "SATIVA": return "text-amber-500";
            case "INDICA": return "text-indigo-500";
            case "HYBRID": return "text-emerald-500";
            default: return "text-primary";
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold font-display">Genéticas (Cepas)</h2>
                    <p className="text-muted-foreground text-sm">Control de variedades, perfiles cannabinoides y herencia genética.</p>
                </div>
                <button
                    onClick={() => { resetForm(); setIsCreateModalOpen(true); }}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 w-full sm:w-auto"
                >
                    <Plus size={18} />
                    Registrar Cepa
                </button>
            </div>

            {/* Grid of Strains */}
            {isLoading ? (
                <div className="flex justify-center py-20">
                    <Loader2 size={40} className="animate-spin text-muted-foreground" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {strains?.map((strain) => (
                        <div key={strain.id} className="bg-card border border-border rounded-2xl p-6 shadow-sm card-hover flex flex-col relative overflow-hidden group">
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-12 h-12 bg-secondary/50 rounded-xl flex items-center justify-center text-primary">
                                    <Leaf size={24} />
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        const rect = e.currentTarget.getBoundingClientRect();
                                        setMenuPosition({
                                            top: rect.bottom + 8,
                                            left: rect.left - 180,
                                        });
                                        if (activeMenuId === strain.id) {
                                            setActiveMenuId(null);
                                        } else {
                                            setSelectedStrain(strain);
                                            setActiveMenuId(strain.id);
                                        }
                                    }}
                                    className="text-muted-foreground hover:text-primary transition-colors p-2 rounded-xl hover:bg-white z-10 relative"
                                >
                                    <MoreVertical size={20} />
                                </button>
                            </div>

                            <h3 className="text-xl font-bold mb-1">{strain.name}</h3>
                            <p className={`text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-1.5 ${getTypeColor(strain.type)}`}>
                                <Dna size={12} />
                                {strain.type || "Desconocido"} {strain.genetics ? `• ${strain.genetics}` : ""}
                            </p>

                            <div className="grid grid-cols-2 gap-4 mt-auto">
                                <div className="bg-muted/30 p-3 rounded-xl border border-border/50">
                                    <div className="flex items-center gap-2 mb-1 text-muted-foreground">
                                        <Beaker size={14} />
                                        <span className="text-[10px] font-bold uppercase tracking-tighter">THC</span>
                                    </div>
                                    <p className="text-lg font-bold">{strain.thcPercentage !== null ? `${strain.thcPercentage}%` : "—"}</p>
                                </div>
                                <div className="bg-muted/30 p-3 rounded-xl border border-border/50">
                                    <div className="flex items-center gap-2 mb-1 text-muted-foreground">
                                        <FlaskConical size={14} />
                                        <span className="text-[10px] font-bold uppercase tracking-tighter">CBD</span>
                                    </div>
                                    <p className="text-lg font-bold">{strain.cbdPercentage !== null ? `${strain.cbdPercentage}%` : "—"}</p>
                                </div>
                            </div>

                            <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <Activity size={14} className="text-accent" />
                                    <span>{strain._count?.lots || 0} Lotes vinculados</span>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Action Card */}
                    <div
                        onClick={() => { resetForm(); setIsCreateModalOpen(true); }}
                        className="bg-secondary/20 border border-primary/10 rounded-2xl p-6 flex flex-col justify-center items-center text-center group cursor-pointer hover:bg-secondary/30 transition-all border-dashed"
                    >
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-primary shadow-sm mb-4 group-hover:scale-110 transition-transform">
                            <Plus size={32} />
                        </div>
                        <h4 className="font-bold text-lg">Nueva Variedad</h4>
                        <p className="text-xs text-muted-foreground mt-1 px-4">Agrega nuevas genéticas para iniciar ciclos de cultivo.</p>
                    </div>
                </div>
            )}

            {/* Lab Context Box */}
            <div className="bg-card border border-border rounded-2xl p-8 flex flex-col md:flex-row gap-8 items-center bg-gradient-to-br from-card to-secondary/10">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0">
                    <Thermometer size={32} />
                </div>
                <div className="space-y-2 flex-1 text-center md:text-left">
                    <h3 className="text-lg font-bold">Estabilidad Genética</h3>
                    <p className="text-sm text-muted-foreground">
                        El sistema de trazabilidad de <b>OmniGrow</b> permite monitorear la degradación de perfiles cannabinoides a través de múltiples generaciones de madres y clones.
                    </p>
                </div>
                <button className="px-6 py-3 bg-primary text-primary-foreground rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all shrink-0">
                    Análisis de Estabilidad
                </button>
            </div>

            {/* Global Actions Menu */}
            <AnimatePresence>
                {activeMenuId && selectedStrain && (
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
                                onClick={() => handleEditClick(selectedStrain)}
                                className="w-full px-4 py-3.5 text-left text-sm font-bold flex items-center gap-3 hover:bg-primary/5 transition-colors border-b border-muted/20"
                            >
                                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                    <Edit2 size={14} />
                                </div>
                                Editar
                            </button>
                            <button
                                onClick={() => handleDeleteClick(selectedStrain)}
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
                                resetForm();
                            }}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-lg bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            <div className="p-6 border-b border-muted/30 flex justify-between items-center bg-muted/10 shrink-0">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                                        <Leaf size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-black text-foreground">
                                            {isEditModalOpen ? "Editar Cepa" : "Nueva Cepa"}
                                        </h2>
                                        <p className="text-sm font-medium text-muted-foreground">
                                            {isEditModalOpen ? "Modifica los datos genéticos." : "Ingresá los datos de la nueva genética."}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        setIsCreateModalOpen(false);
                                        setIsEditModalOpen(false);
                                        resetForm();
                                    }}
                                    className="p-2 bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground rounded-full transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="p-8 overflow-y-auto">
                                <form onSubmit={isEditModalOpen ? handleUpdateStrain : handleCreateStrain} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">Nombre de Cepa</label>
                                        <div className="relative group/input">
                                            <Leaf className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within/input:text-primary transition-colors" size={18} />
                                            <input
                                                type="text"
                                                required
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="w-full pl-12 pr-4 py-3.5 bg-muted/30 border-2 border-transparent rounded-[1.25rem] outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/20 transition-all font-medium text-[15px] text-slate-800"
                                                placeholder="Ej: Gorilla Glue"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">Genética (Cruce) <span className="opacity-50">(Opcional)</span></label>
                                            <div className="relative group/input">
                                                <Dna className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within/input:text-primary transition-colors" size={18} />
                                                <input
                                                    type="text"
                                                    value={genetics}
                                                    onChange={(e) => setGenetics(e.target.value)}
                                                    className="w-full pl-12 pr-4 py-3.5 bg-muted/30 border-2 border-transparent rounded-[1.25rem] outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/20 transition-all font-medium text-[15px] text-slate-800"
                                                    placeholder="Ej: Sour Dubb x Chem Sis"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">Tipo <span className="opacity-50">(Opcional)</span></label>
                                            <div className="relative group/input">
                                                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within/input:text-primary transition-colors" size={18} />
                                                <select
                                                    value={type}
                                                    onChange={(e) => setType(e.target.value as any)}
                                                    className="w-full pl-12 pr-10 py-3.5 bg-muted/30 border-2 border-transparent rounded-[1.25rem] outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/20 transition-all font-medium text-[15px] cursor-pointer appearance-none text-slate-800"
                                                >
                                                    <option value="">Seleccionar...</option>
                                                    <option value="SATIVA">Sativa</option>
                                                    <option value="INDICA">Indica</option>
                                                    <option value="HYBRID">Híbrida</option>
                                                    <option value="OTHER">Otro</option>
                                                </select>
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                                    <ChevronDown size={18} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">% THC <span className="opacity-50">(Opcional)</span></label>
                                            <div className="relative group/input">
                                                <Beaker className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within/input:text-primary transition-colors" size={18} />
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    value={thcPercentage}
                                                    onChange={(e) => setThcPercentage(e.target.value)}
                                                    className="w-full pl-12 pr-4 py-3.5 bg-muted/30 border-2 border-transparent rounded-[1.25rem] outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/20 transition-all font-medium text-[15px] text-slate-800"
                                                    placeholder="Ej: 22.5"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">% CBD <span className="opacity-50">(Opcional)</span></label>
                                            <div className="relative group/input">
                                                <FlaskConical className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within/input:text-primary transition-colors" size={18} />
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    value={cbdPercentage}
                                                    onChange={(e) => setCbdPercentage(e.target.value)}
                                                    className="w-full pl-12 pr-4 py-3.5 bg-muted/30 border-2 border-transparent rounded-[1.25rem] outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/20 transition-all font-medium text-[15px] text-slate-800"
                                                    placeholder="Ej: 0.1"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-4 flex gap-4">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsCreateModalOpen(false);
                                                setIsEditModalOpen(false);
                                                resetForm();
                                            }}
                                            className="flex-1 py-4.5 rounded-2xl font-black text-sm uppercase tracking-widest text-muted-foreground hover:bg-muted transition-all"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={createMutation.isPending || updateMutation.isPending}
                                            className="flex-[2] py-4.5 bg-primary text-primary-foreground rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-primary/30 hover:shadow-2xl hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-70"
                                        >
                                            {(createMutation.isPending || updateMutation.isPending) ? (
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
                {isDeleteModalOpen && selectedStrain && (
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
                            <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-600 mx-auto mb-6">
                                <AlertTriangle size={32} />
                            </div>
                            <h3 className="text-xl font-black mb-2">¿Suspender genética?</h3>
                            <p className="text-muted-foreground text-sm font-medium mb-8">
                                Estás a punto de suspender a <span className="text-foreground font-bold">{selectedStrain.name}</span>.
                                Los lotes asociados no se perderán, pero ya no podrás elegir esta cepa.
                            </p>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => setIsDeleteModalOpen(false)}
                                    className="flex-1 py-4 rounded-2xl font-black text-sm uppercase tracking-widest text-muted-foreground hover:bg-muted transition-all"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    disabled={deleteMutation.isPending}
                                    className="flex-1 py-4 bg-amber-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-amber-500/20 hover:shadow-2xl hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2"
                                >
                                    {deleteMutation.isPending ? (
                                        <Loader2 size={18} className="animate-spin" />
                                    ) : (
                                        "Suspender"
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
