"use client";

interface PatientStatsProps {
    total: number;
    active: number;
    suspended: number;
}

export function PatientStats({ total, active, suspended }: PatientStatsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass p-6 rounded-3xl border border-white/50 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-500" />
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Total Pacientes</p>
                <h3 className="text-4xl font-black text-primary">{total}</h3>
            </div>
            <div className="glass p-6 rounded-3xl border border-white/50 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-500" />
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Activos</p>
                <h3 className="text-4xl font-black text-emerald-500">{active}</h3>
            </div>
            <div className="glass p-6 rounded-3xl border border-white/50 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-500" />
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Suspendidos</p>
                <h3 className="text-4xl font-black text-amber-500">{suspended}</h3>
            </div>
        </div>
    );
}
