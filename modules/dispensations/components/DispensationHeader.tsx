"use client";

import { HandCoins, Search, User, X } from "lucide-react";
import { Patient } from "@/lib/services/patient";

interface DispensationHeaderProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    patients: Patient[] | undefined;
    selectedPatient: Patient | null;
    onSelectPatient: (patient: Patient | null) => void;
}

export function DispensationHeader({
    searchQuery,
    onSearchChange,
    patients,
    selectedPatient,
    onSelectPatient
}: DispensationHeaderProps) {
    const filteredPatients = patients?.filter(p =>
        (p.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.documentNumber?.includes(searchQuery)) &&
        p.roles?.includes("PATIENT")
    );

    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
            <div>
                <h1 className="text-2xl md:text-3xl font-black text-foreground tracking-tight flex items-center gap-3">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0">
                        <HandCoins size={24} className="md:w-7 md:h-7" />
                    </div>
                    Nueva Dispensación
                </h1>
                <p className="text-muted-foreground font-medium mt-1 text-sm md:text-base">
                    Registra la entrega de productos a un socio reprocanneado.
                </p>
            </div>

            <div className="flex-1 max-w-xl relative">
                {!selectedPatient ? (
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Buscar socio por nombre o DNI..."
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="w-full h-16 pl-12 pr-4 bg-white border-2 border-slate-100 focus:border-primary/20 rounded-[1.5rem] outline-none transition-all shadow-sm font-bold text-lg"
                        />
                        {searchQuery && filteredPatients && filteredPatients.length > 0 && (
                            <div className="absolute top-[calc(100%+8px)] left-0 right-0 bg-white border border-slate-100 rounded-[1.5rem] shadow-2xl z-50 overflow-hidden py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                {filteredPatients.slice(0, 5).map(p => (
                                    <button
                                        key={p.id}
                                        onClick={() => {
                                            onSelectPatient(p);
                                            onSearchChange("");
                                        }}
                                        className="w-full px-6 py-4 hover:bg-slate-50 flex items-center gap-4 transition-colors border-b border-slate-50 last:border-0"
                                    >
                                        <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
                                            <User size={20} />
                                        </div>
                                        <div className="text-left">
                                            <p className="font-black text-slate-800 uppercase tracking-wide text-sm">{p.fullName}</p>
                                            <p className="text-xs font-bold text-muted-foreground">DNI: {p.documentNumber} • Reprocann: {p.reprocanExpiration ? "Activo" : "No tiene"}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="h-16 flex items-center justify-between px-6 bg-primary/5 border-2 border-primary/20 rounded-[1.5rem] animate-in zoom-in-95 duration-200">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
                                <User size={20} />
                            </div>
                            <div>
                                <p className="font-black text-primary uppercase tracking-widest text-sm">{selectedPatient.fullName}</p>
                                <p className="text-[10px] font-black text-primary/60 uppercase">DNI: {selectedPatient.documentNumber}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => onSelectPatient(null)}
                            className="p-2 hover:bg-primary/10 rounded-lg text-primary transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
