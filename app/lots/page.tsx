"use client";

import { useState, useEffect } from "react";
import { FlaskConical, Loader2, Plus } from "lucide-react";
import { sileo } from "sileo";
import { cn } from "@/lib/utils";
import { useLotsList, useCreateLot, useUpdateLot, useDeleteLot } from "@/lib/hooks/useLots";
import { useStrainsList } from "@/lib/hooks/useStrains";
import { Lot } from "@/lib/services/lot";
import { LotHeader } from "@/modules/lots/components/LotHeader";
import { LotColumn } from "@/modules/lots/components/LotColumn";
import { LotModals } from "@/modules/lots/components/LotModals";
import { LotMobileTabs } from "@/modules/lots/components/LotMobileTabs";

const KANBAN_COLUMNS = [
    { id: "CREATED", title: "Cargado", color: "bg-muted text-muted-foreground", border: "border-muted" },
    { id: "IN_ANALYSIS", title: "En Análisis", color: "bg-amber-500/10 text-amber-600", border: "border-amber-500/20" },
    { id: "RELEASED", title: "Liberado", color: "bg-emerald-500/10 text-emerald-600", border: "border-emerald-500/20" },
    { id: "BLOCKED", title: "Bloqueado", color: "bg-rose-500/10 text-rose-600", border: "border-rose-500/20" },
    { id: "EXHAUSTED", title: "Agotado", color: "bg-slate-500/10 text-slate-600", border: "border-slate-500/20" },
];

export default function LotsPage() {
    const { data: lots, isLoading } = useLotsList();
    const { data: strains } = useStrainsList();
    const createLot = useCreateLot();
    const updateLot = useUpdateLot();
    const deleteLot = useDeleteLot();

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedLot, setSelectedLot] = useState<Lot | null>(null);
    const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
    const [activeTab, setActiveTab] = useState(KANBAN_COLUMNS[0].id);

    // Form states
    const [strainId, setStrainId] = useState("");
    const [lotCode, setLotCode] = useState("");
    const [lotType, setLotType] = useState<"CULTIVATION" | "PACKAGING">("CULTIVATION");
    const [status, setStatus] = useState<Lot["status"]>("CREATED");
    const [totalOutputEquivalentGrams, setTotalOutputEquivalentGrams] = useState<number | "">("");
    const [availableEquivalentGrams, setAvailableEquivalentGrams] = useState<number | "">("");
    const [totalProductionCost, setTotalProductionCost] = useState<number | "">("");

    const [draggedLotId, setDraggedLotId] = useState<string | null>(null);

    const resetForm = () => {
        setStrainId("");
        setLotCode("");
        setLotType("CULTIVATION");
        setStatus("CREATED");
        setTotalOutputEquivalentGrams("");
        setAvailableEquivalentGrams("");
        setTotalProductionCost("");
        setSelectedLot(null);
    };

    useEffect(() => {
        if (selectedLot) {
            setStrainId(selectedLot.strainId || "");
            setLotCode(selectedLot.lotCode || "");
            setLotType(selectedLot.lotType);
            setStatus(selectedLot.status);
            setTotalOutputEquivalentGrams(selectedLot.totalOutputEquivalentGrams ?? "");
            setAvailableEquivalentGrams(selectedLot.availableEquivalentGrams ?? "");
            setTotalProductionCost(selectedLot.totalProductionCost ?? "");
        }
    }, [selectedLot]);

    const handleActionClick = (lot: Lot, rect: DOMRect) => {
        setSelectedLot(lot);
        setActiveMenuId(lot.id);
        setMenuPosition({
            top: rect.bottom + window.scrollY,
            left: rect.right - 180
        });
    };

    const handleDragStart = (e: React.DragEvent, id: string) => {
        setDraggedLotId(id);
        e.dataTransfer.setData("lotId", id);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent, newStatus: string) => {
        const lotId = e.dataTransfer.getData("lotId");
        setDraggedLotId(null);

        const lot = lots?.find(l => l.id === lotId);
        if (lot && lot.status !== newStatus) {
            updateLot.mutate({
                id: lotId,
                data: { status: newStatus as any }
            });
        }
    };

    return (
        <div className="h-[calc(100vh-6rem)] flex flex-col overflow-hidden">
            <div className="px-4 py-2 shrink-0">
                <LotHeader onAddLot={() => { resetForm(); setIsCreateModalOpen(true); }} />
            </div>

            {isLoading ? (
                <div className="flex-1 flex justify-center items-center">
                    <Loader2 size={40} className="animate-spin text-muted-foreground" />
                </div>
            ) : (
                <div className="flex flex-col flex-1 min-h-0">
                    {/* Fixed Mobile Tabs Navigation */}
                    <LotMobileTabs
                        columns={KANBAN_COLUMNS}
                        activeId={activeTab}
                        onTabChange={setActiveTab}
                        counts={KANBAN_COLUMNS.reduce((acc, col) => ({
                            ...acc,
                            [col.id]: lots?.filter(l => l.status === col.id).length || 0
                        }), {})}
                    />

                    {/* Scrollable Container */}
                    <div className="flex-1 overflow-hidden">
                        <div className="flex h-full gap-4 md:gap-6 overflow-x-auto lg:overflow-x-auto pb-4 items-stretch px-4 lg:px-0 custom-scrollbar lg:flex">
                            {KANBAN_COLUMNS.map((col) => (
                                <div
                                    key={col.id}
                                    className={cn(
                                        "h-full min-h-0",
                                        activeTab === col.id ? "flex-1 block" : "hidden lg:block lg:flex-1"
                                    )}
                                >
                                    <LotColumn
                                        status={col}
                                        lots={lots?.filter(l => l.status === col.id) || []}
                                        draggedLotId={draggedLotId}
                                        onDragOver={handleDragOver}
                                        onDrop={handleDrop}
                                        onDragStart={handleDragStart}
                                        onActionClick={handleActionClick}
                                        activeMenuId={activeMenuId}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Floating context menu simulation for actions */}
            {activeMenuId && (
                <div
                    className="fixed inset-0 z-40 bg-transparent"
                    onClick={() => setActiveMenuId(null)}
                >
                    <div
                        className="absolute bg-card border border-border/50 rounded-2xl shadow-2xl p-2 min-w-[180px] z-50 animate-in fade-in zoom-in duration-200"
                        style={{ top: menuPosition.top, left: menuPosition.left }}
                    >
                        <button
                            onClick={() => { setIsEditModalOpen(true); setActiveMenuId(null); }}
                            className="w-full text-left px-4 py-2.5 hover:bg-muted rounded-xl transition-colors text-sm font-bold flex items-center gap-2"
                        >
                            Editar Lote
                        </button>
                        <button
                            onClick={() => { setIsDeleteModalOpen(true); setActiveMenuId(null); }}
                            className="w-full text-left px-4 py-2.5 hover:bg-rose-500/10 text-rose-500 rounded-xl transition-colors text-sm font-bold flex items-center gap-2"
                        >
                            Eliminar Lote
                        </button>
                    </div>
                </div>
            )}

            <LotModals
                isCreateModalOpen={isCreateModalOpen}
                setIsCreateModalOpen={setIsCreateModalOpen}
                isEditModalOpen={isEditModalOpen}
                setIsEditModalOpen={setIsEditModalOpen}
                isDeleteModalOpen={isDeleteModalOpen}
                setIsDeleteModalOpen={setIsDeleteModalOpen}
                selectedLot={selectedLot}
                strains={strains || []}
                formState={{
                    strainId, setStrainId,
                    lotCode, setLotCode,
                    lotType, setLotType,
                    status, setStatus,
                    totalOutputEquivalentGrams, setTotalOutputEquivalentGrams,
                    availableEquivalentGrams, setAvailableEquivalentGrams,
                    totalProductionCost, setTotalProductionCost
                }}
                onCreateSubmit={() => {
                    createLot.mutate({
                        strainId,
                        lotCode,
                        lotType,
                        status,
                        totalOutputEquivalentGrams: totalOutputEquivalentGrams === "" ? undefined : totalOutputEquivalentGrams,
                        availableEquivalentGrams: availableEquivalentGrams === "" ? undefined : availableEquivalentGrams,
                        totalProductionCost: totalProductionCost === "" ? undefined : totalProductionCost
                    }, {
                        onSuccess: () => {
                            setIsCreateModalOpen(false);
                            resetForm();
                        }
                    });
                }}
                onEditSubmit={() => {
                    if (selectedLot) {
                        updateLot.mutate({
                            id: selectedLot.id,
                            data: {
                                strainId,
                                lotCode,
                                lotType,
                                status,
                                totalOutputEquivalentGrams: totalOutputEquivalentGrams === "" ? null : totalOutputEquivalentGrams,
                                availableEquivalentGrams: availableEquivalentGrams === "" ? null : availableEquivalentGrams,
                                totalProductionCost: totalProductionCost === "" ? null : totalProductionCost
                            }
                        }, {
                            onSuccess: () => {
                                setIsEditModalOpen(false);
                                resetForm();
                            }
                        });
                    }
                }}
                onDeleteConfirm={() => {
                    if (selectedLot) {
                        deleteLot.mutate(selectedLot.id, {
                            onSuccess: () => {
                                setIsDeleteModalOpen(false);
                                resetForm();
                            }
                        });
                    }
                }}
            />
        </div>
    );
}
