"use client";

import { motion } from "framer-motion";
import { Building2, Users, Package, ArrowRight, ShieldCheck, BadgeCheck } from "lucide-react";
import { OrganizationSummary } from "@/lib/services/dashboard";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface OrganizationListProps {
    organizations: OrganizationSummary[];
}

export function OrganizationList({ organizations }: OrganizationListProps) {

    const router = useRouter();

    return (
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm h-full flex flex-col">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-xl font-black text-slate-800 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                            <Building2 size={20} />
                        </div>
                        Organizaciones Vinculadas
                    </h3>
                    <p className="text-sm font-bold text-slate-400 mt-1">Control de clubes activos en la plataforma</p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4">
                {(organizations || []).map((org, index) => (
                    <motion.div
                        key={org.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="group relative p-5 rounded-2xl bg-slate-50 border border-transparent hover:bg-white hover:border-primary/20 hover:shadow-md transition-all duration-300"
                    >
                        <div className="flex items-center justify-between gap-6">
                            <div className="flex items-center gap-4 flex-1">
                                <div className={cn(
                                    "w-12 h-12 rounded-xl flex items-center justify-center text-xl font-black shadow-sm",
                                    (org.status === 'ACTIVE' || !org.status) ? "bg-emerald-500 text-white" : "bg-slate-300 text-slate-500"
                                )}>
                                    {org.name.charAt(0)}
                                </div>
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <h4 className="font-black text-slate-800 truncate">{org.name}</h4>
                                        {org.status === 'ACTIVE' && <BadgeCheck size={16} className="text-emerald-500 shrink-0" />}
                                    </div>
                                    <div className="flex items-center gap-3 text-xs font-bold text-slate-400">
                                        <span className="flex items-center gap-1.5"><ShieldCheck size={12} className="text-primary" /> {org.plan}</span>
                                        <span className="w-1 h-1 rounded-full bg-slate-200" />
                                        <span>ID: {org.id.slice(0, 8)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="hidden md:flex items-center gap-8 shrink-0 px-6 border-x border-slate-200/50">
                                <div className="text-center">
                                    <div className="text-sm font-black text-slate-700">{org.staffCount}</div>
                                    <div className="text-[10px] uppercase tracking-widest font-black text-slate-400 flex items-center gap-1 justify-center">
                                        <Users size={10} /> Staff
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="text-sm font-black text-slate-700">{org.patientCount}</div>
                                    <div className="text-[10px] uppercase tracking-widest font-black text-slate-400 flex items-center gap-1 justify-center">
                                        <Users size={10} /> Pacientes
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="text-sm font-black text-slate-700">{org.lotCount}</div>
                                    <div className="text-[10px] uppercase tracking-widest font-black text-slate-400 flex items-center gap-1 justify-center">
                                        <Package size={10} /> Lotes
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => router.push(`/dashboard?organizationId=${org.id}`)}
                                className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white hover:border-primary transition-all group-hover:shadow-lg"
                            >
                                <ArrowRight size={18} />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
