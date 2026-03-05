"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, Search, Sparkles } from "lucide-react";
import { useCatalog } from "@/lib/hooks/useProducts";
import { PatientProductGrid } from "@/modules/patient/components/PatientProductGrid";

export default function PatientCatalogPage() {
    const { data: groups, isLoading } = useCatalog();
    const [searchQuery, setSearchQuery] = useState("");

    const filteredGroups = groups?.map(group => {
        const matchesStrain = group.strain.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            group.strain.genetics.toLowerCase().includes(searchQuery.toLowerCase());

        const filteredProducts = group.products.filter(p =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

        if (matchesStrain) return group;
        if (filteredProducts.length > 0) return { ...group, products: filteredProducts };
        return null;
    }).filter((g): g is NonNullable<typeof g> => g !== null);

    return (
        <div className="space-y-10 pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                            <ShoppingBag size={16} />
                        </div>
                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.25em]">Catálogo de Dispensa</span>
                    </div>
                    <h1 className="text-4xl font-black text-slate-800 tracking-tight">
                        Nuestro <span className="text-primary">Menú</span>
                    </h1>
                    <p className="text-slate-400 font-bold mt-1 text-sm max-w-lg">
                        Explorá las genéticas y extracciones disponibles en tu club. Stock en tiempo real y precios vigentes.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="relative w-full md:max-w-md group"
                >
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                        <Search size={20} />
                    </div>
                    <input
                        type="text"
                        placeholder="Buscar por nombre o genética..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-14 pr-6 py-4.5 bg-white/60 backdrop-blur-md border border-white/50 rounded-[1.5rem] outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/20 transition-all text-sm font-bold text-slate-700 shadow-sm"
                    />
                </motion.div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <PatientProductGrid
                    groups={filteredGroups}
                    isLoading={isLoading}
                    searchQuery={searchQuery}
                />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="relative p-10 bg-gradient-to-br from-slate-900 to-slate-800 rounded-[3rem] text-white overflow-hidden shadow-2xl"
            >
                <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl -mr-40 -mt-40" />
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl -ml-40 -mb-40" />

                <div className="relative z-10 flex flex-col lg:flex-row items-center gap-10">
                    <div className="w-20 h-20 rounded-[2rem] bg-white/10 backdrop-blur-xl flex items-center justify-center text-primary shadow-lg border border-white/10 shrink-0">
                        <Sparkles size={40} />
                    </div>
                    <div className="flex-1 text-center lg:text-left space-y-2">
                        <h3 className="text-2xl font-black">Información de Dispensación</h3>
                        <p className="text-slate-400 font-medium leading-relaxed">
                            Recordá que el stock visualizado es referencial y puede variar ligeramente.
                            La disponibilidad real se confirma al momento de la dispensa presencial en el club,
                            sujeta a los límites de tu cupo mensual REPROCANN.
                        </p>
                    </div>
                    <div className="shrink-0 flex gap-4">
                        <div className="px-6 py-3 bg-white text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl">
                            Consultar Cupo
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
