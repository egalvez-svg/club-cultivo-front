"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { sileo } from "sileo";
import {
    useActiveRegister,
    useOpenRegister,
    useCreateMovement,
    useCloseRegister
} from "@/lib/hooks/useCashRegister";
import { MovementType } from "@/lib/services/cash-register";

// Components
import { FinanceHeader } from "@/modules/finance/components/FinanceHeader";
import { FinanceStats } from "@/modules/finance/components/FinanceStats";
import { FinanceTable } from "@/modules/finance/components/FinanceTable";
import { FinanceInfo } from "@/modules/finance/components/FinanceInfo";
import { FinanceModals } from "@/modules/finance/components/FinanceModals";
import { FinanceEmptyState } from "@/modules/finance/components/FinanceEmptyState";

export default function FinancePage() {
    const { data: activeRegister, isLoading: isLoadingRegister } = useActiveRegister();
    const openRegisterMutation = useOpenRegister();
    const createMovementMutation = useCreateMovement();
    const closeRegisterMutation = useCloseRegister();

    // Modals state
    const [isMovementModalOpen, setIsMovementModalOpen] = useState(false);
    const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);
    const [isOpeningModalOpen, setIsOpeningModalOpen] = useState(false);

    // Form states
    const [openingAmount, setOpeningAmount] = useState<number>(0);
    const [movementAmount, setMovementAmount] = useState<number>(0);
    const [movementDescription, setMovementDescription] = useState("");
    const [movementType, setMovementType] = useState<MovementType>("INCOME");
    const [closingAmount, setClosingAmount] = useState<number>(0);

    const handleOpenRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await sileo.promise(
                openRegisterMutation.mutateAsync({ openingBalance: openingAmount }),
                {
                    loading: { title: "Abriendo caja...", description: "Iniciando turno" },
                    success: { title: "Caja abierta", description: "El turno ha comenzado" },
                    error: { title: "Error", description: "No se pudo abrir la caja" }
                }
            );
            setIsOpeningModalOpen(false);
            setOpeningAmount(0);
        } catch (error) {
            console.error(error);
        }
    };

    const handleCreateMovement = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await sileo.promise(
                createMovementMutation.mutateAsync({
                    movementType: movementType,
                    amount: movementAmount,
                    notes: movementDescription,
                    referenceType: "MANUAL"
                }),
                {
                    loading: { title: "Registrando movimiento...", description: "Guardando datos" },
                    success: { title: "Movimiento registrado", description: "Balance actualizado" },
                    error: { title: "Error", description: "No se pudo registrar el movimiento" }
                }
            );
            setIsMovementModalOpen(false);
            setMovementAmount(0);
            setMovementDescription("");
        } catch (error) {
            console.error(error);
        }
    };

    const handleCloseRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await sileo.promise(
                closeRegisterMutation.mutateAsync({ closingBalance: closingAmount }),
                {
                    loading: { title: "Cerrando caja...", description: "Finalizando turno" },
                    success: { title: "Caja cerrada", description: "Arqueo guardado correctamente" },
                    error: { title: "Error", description: "No se pudo cerrar la caja" }
                }
            );
            setIsCloseModalOpen(false);
            setClosingAmount(0);
        } catch (error) {
            console.error(error);
        }
    };

    if (isLoadingRegister) {
        return (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] gap-4 text-muted-foreground">
                <Loader2 className="animate-spin text-primary" size={40} />
                <span className="font-bold uppercase tracking-widest text-xs">Cargando estado de caja...</span>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8 p-1">
            <FinanceHeader
                activeRegister={activeRegister}
                onOpenOpeningModal={() => setIsOpeningModalOpen(true)}
                onOpenCloseModal={() => setIsCloseModalOpen(true)}
            />

            {!activeRegister || activeRegister.status !== "OPEN" ? (
                <FinanceEmptyState onOpenOpeningModal={() => setIsOpeningModalOpen(true)} />
            ) : (
                <div className="grid grid-cols-12 gap-8">
                    <div className="col-span-12 lg:col-span-8 space-y-8">
                        <FinanceStats activeRegister={activeRegister} />
                        <FinanceTable
                            movements={activeRegister.movements}
                            onOpenMovementModal={() => setIsMovementModalOpen(true)}
                        />
                    </div>
                    <FinanceInfo />
                </div>
            )}

            <FinanceModals
                isOpeningModalOpen={isOpeningModalOpen}
                setIsOpeningModalOpen={setIsOpeningModalOpen}
                isMovementModalOpen={isMovementModalOpen}
                setIsMovementModalOpen={setIsMovementModalOpen}
                isCloseModalOpen={isCloseModalOpen}
                setIsCloseModalOpen={setIsCloseModalOpen}
                openingAmount={openingAmount}
                setOpeningAmount={setOpeningAmount}
                movementAmount={movementAmount}
                setMovementAmount={setMovementAmount}
                movementDescription={movementDescription}
                setMovementDescription={setMovementDescription}
                movementType={movementType}
                setMovementType={setMovementType}
                closingAmount={closingAmount}
                setClosingAmount={setClosingAmount}
                onOpenRegister={handleOpenRegister}
                onCreateMovement={handleCreateMovement}
                onCloseRegister={handleCloseRegister}
                activeRegister={activeRegister}
                isPendingOpening={openRegisterMutation.isPending}
                isPendingMovement={createMovementMutation.isPending}
                isPendingClosing={closeRegisterMutation.isPending}
            />
        </div>
    );
}
