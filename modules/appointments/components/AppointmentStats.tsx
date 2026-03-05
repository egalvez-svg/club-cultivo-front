"use client";

interface AppointmentStatsProps {
    total: number;
    pending: number;
    completed: number;
    cancelled: number;
}

export function AppointmentStats({ total, pending, completed, cancelled }: AppointmentStatsProps) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="glass p-6 rounded-3xl border border-white/50 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-500" />
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Total</p>
                <h3 className="text-4xl font-black text-primary">{total}</h3>
            </div>
            <div className="glass p-6 rounded-3xl border border-white/50 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-500" />
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Pendientes</p>
                <h3 className="text-4xl font-black text-amber-500">{pending}</h3>
            </div>
            <div className="glass p-6 rounded-3xl border border-white/50 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-500" />
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Completados</p>
                <h3 className="text-4xl font-black text-emerald-500">{completed}</h3>
            </div>
            <div className="glass p-6 rounded-3xl border border-white/50 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-500" />
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Cancelados</p>
                <h3 className="text-4xl font-black text-red-500">{cancelled}</h3>
            </div>
        </div>
    );
}
