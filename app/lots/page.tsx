"use client";

import { useState, useEffect } from "react";
import { FlaskConical, Loader2 } from "lucide-react";
import { sileo } from "sileo";
import { useLotsList, useCreateLot, useUpdateLot, useDeleteLot } from "@/lib/hooks/useLots";
import { useStrainsList } from "@/lib/hooks/useStrains";
import { Lot } from "@/lib/services/lot";

// Components
import { LotHeader } from "@/modules/lots/components/LotHeader";
import { LotColumn } from "@/modules/lots/components/LotColumn";
import { LotModals } from "@/modules/lots/components/LotModals";

const KANBAN_COLUMNS = [
    { id: "CREATED", title: "Cargado", color: "bg-muted text-muted-foreground", border: "border-muted" },
    { id: "TESTING", title: "En Análisis", color: "bg-amber-100 text-amber-700", border: "border-amber-500/20" },
    { id: "RELEASED", title: "Liberado", color: "bg-emerald-500/10 text-emerald-600", border: "border-emerald-500/20" },
    { id: "BLOCKED", title: "Bloqueado", color: "bg-destructive/10 text-destructive", border: "border-destructive/20" },
    { id: "DEPLETED", title: "Agotado", color: "bg-orange-100 text-orange-700", border: "border-orange-500/20" },
];

export default function LotsPage() {
    const { data: lots, isLoading } = useLotsList();
    const { data: strains } = useStrainsList();

    const createMutation = useCreateLot();
    const updateMutation = useUpdateLot();
    const deleteMutation = useDeleteLot();

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedLot, setSelectedLot] = useState<Lot | null>(null);
    const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

    // Form states
    const [strainId, setStrainId] = useState("");
    const [lotType, setLotType] = useState<"CULTIVATION" | "PACKAGING" | "">("");
    const [lotCode, setLotCode] = useState("");
    const [totalGrams, setTotalGrams] = useState("");
    const [totalCost, setTotalCost] = useState("");

    // DND emulation state
    const [draggedLotId, setDraggedLotId] = useState<string | null>(null);

    useEffect(() => {
        const handleScroll = () => setActiveMenuId(null);
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const resetForm = () => {
        setStrainId("");
        setLotType("");
        setLotCode("");
        setTotalGrams("");
        setTotalCost("");
        setSelectedLot(null);
    };

    const handleCreateLot = (e: React.FormEvent) => {
        e.preventDefault();
        createMutation.mutate(
            {
                strainId,
                lotType: lotType as any,
                lotCode: lotCode || undefined,
                totalOutputEquivalentGrams: totalGrams ? parseFloat(totalGrams) : undefined,
                totalProductionCost: totalCost ? parseFloat(totalCost) : undefined,
            },
            {
                onSuccess: () => {
                    setIsCreateModalOpen(false);
                    resetForm();
                    sileo.success({ title: "¡Lote Registrado!", description: "El lote ha sido ingresado al sistema." });
                },
                onError: (error) => {
                    sileo.error({ title: "Error", description: error.message || "No se pudo registrar." });
                }
            }
        );
    };

    const handleUpdateLot = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedLot) return;
        updateMutation.mutate(
            {
                id: selectedLot.id,
                params: {
                    lotCode: lotCode || undefined,
                    lotType: lotType as any,
                    totalOutputEquivalentGrams: totalGrams ? parseFloat(totalGrams) : undefined,
                    totalProductionCost: totalCost ? parseFloat(totalCost) : undefined,
                }
            },
            {
                onSuccess: () => {
                    setIsEditModalOpen(false);
                    resetForm();
                    sileo.success({ title: "Actualizado", description: "Datos del lote actualizados exitosamente." });
                },
                onError: (error) => {
                    sileo.error({ title: "Error al actualizar", description: error.message });
                }
            }
        );
    };

    const confirmDelete = () => {
        if (!selectedLot) return;
        deleteMutation.mutate(selectedLot.id, {
            onSuccess: () => {
                setIsDeleteModalOpen(false);
                setSelectedLot(null);
                sileo.success({ title: "Eliminado", description: "Lote eliminado correctamente." });
            },
            onError: (error) => {
                sileo.error({ title: "Cancelado", description: error.message });
            }
        });
    };

    const handleStatusChange = (lotId: string, newStatus: string) => {
        updateMutation.mutate(
            { id: lotId, params: { status: newStatus } },
            {
                onSuccess: () => {
                    sileo.success({ title: "Avanzado", description: `El lote ahora está en ${newStatus}.` });
                    setActiveMenuId(null);
                },
                onError: (err) => {
                    sileo.error({ title: "Error", description: err.message });
                }
            }
        );
    };

    const handleDragStart = (e: React.DragEvent, id: string) => {
        setDraggedLotId(id);
        e.dataTransfer.setData("lotId", id);
    };

    const handleDrop = (e: React.DragEvent, statusId: string) => {
        e.preventDefault();
        const lotId = e.dataTransfer.getData("lotId");
        if (lotId) {
            handleStatusChange(lotId, statusId);
        }
        setDraggedLotId(null);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleActionClick = (lot: Lot, rect: DOMRect) => {
        setMenuPosition({
            top: rect.bottom + 8,
            left: rect.left - 160,
        });
        if (activeMenuId === lot.id) {
            setActiveMenuId(null);
        } else {
            setSelectedLot(lot);
            setActiveMenuId(lot.id);
        }
    };

    return (
        <div className="space-y-6 h-[calc(100vh-8rem)] flex flex-col">
            <LotHeader onAddLot={() => { resetForm(); setIsCreateModalOpen(true); }} />

            {isLoading ? (
                <div className="flex-1 flex justify-center items-center">
                    <Loader2 size={40} className="animate-spin text-muted-foreground" />
                </div>
            ) : (
                <div className="flex gap-4 md:gap-6 overflow-x-auto overflow-y-hidden pb-4 flex-1 items-stretch min-h-0 custom-scrollbar">
                    {KANBAN_COLUMNS.map((col) => (
                        <LotColumn
                            key={col.id}
                            status={col}
                            lots={lots?.filter(l => l.status === col.id) || []}
                            draggedLotId={draggedLotId}
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                            onDragStart={handleDragStart}
                            onActionClick={handleActionClick}
                            activeMenuId={activeMenuId}
                        />
                    ))}
                </div>
            )}

            <div className="bg-muted/10 border border-border/40 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between shrink-0">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                            <FlaskConical size={20} />
                        </div>
                        <h3 className="text-lg font-black text-foreground">Laboratorio y Conformidad</h3>
                    </div>
                    <p className="text-sm font-medium text-muted-foreground ml-[52px] max-w-xl">
                        Todos los lotes en estado de <strong className="text-foreground">EN ANÁLISIS</strong> requieren la carga de resultados de laboratorio antes de ser liberados al inventario de dispensación.
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <button className="px-6 py-3.5 bg-background border border-border/50 text-foreground rounded-2xl text-[13px] font-black uppercase tracking-widest hover:bg-muted shadow-sm transition-all focus:ring-4 focus:ring-primary/10">
                        Ver Protocolos
                    </button>
                    <button className="px-6 py-3.5 bg-primary text-primary-foreground rounded-2xl text-[13px] font-black uppercase tracking-widest hover:shadow-lg hover:-translate-y-0.5 transition-all shadow-xl shadow-primary/20 focus:ring-4 focus:ring-primary/20">
                        Cargar Análisis
                    </button>
                </div>
            </div>

            <LotModals
                isCreateModalOpen={isCreateModalOpen}
                setIsCreateModalOpen={setIsCreateModalOpen}
                isEditModalOpen={isEditModalOpen}
                setIsEditModalOpen={setIsEditModalOpen}
                isDeleteModalOpen={isDeleteModalOpen}
                setIsDeleteModalOpen={setIsDeleteModalOpen}
                selectedLot={selectedLot}
                strains={strains}
                strainId={strainId}
                setStrainId={setStrainId}
                lotType={lotType as any}
                setLotType={setLotType as any}
                lotCode={lotCode}
                setLotCode={setLotCode}
                totalGrams={totalGrams}
                setTotalGrams={setTotalGrams}
                totalCost={totalCost}
                setTotalCost={setTotalCost}
                onCreateLot={handleCreateLot}
                onUpdateLot={handleUpdateLot}
                onConfirmDelete={confirmDelete}
                onStatusChange={handleStatusChange}
                isPending={createMutation.isPending || updateMutation.isPending || deleteMutation.isPending}
                activeMenuId={activeMenuId}
                setActiveMenuId={setActiveMenuId}
                menuPosition={menuPosition}
                onEditClick={() => {
                    if (selectedLot) {
                        setLotCode(selectedLot.lotCode);
                        setLotType(selectedLot.lotType);
                        setStrainId(selectedLot.strainId);
                        setTotalGrams(selectedLot.totalOutputEquivalentGrams?.toString() || "");
                        setTotalCost(selectedLot.totalProductionCost?.toString() || "");
                        setIsEditModalOpen(true);
                        setActiveMenuId(null);
                    }
                }}
                onDeleteClick={() => {
                    setIsDeleteModalOpen(true);
                    setActiveMenuId(null);
                }}
                KANBAN_COLUMNS={KANBAN_COLUMNS}
            />
        </div>
    );
}
