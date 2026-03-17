import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Heart, Leaf, BarChart3, Users, LayoutDashboard } from "lucide-react";

export default function Home() {
  return (
    <div className="fixed inset-0 bg-[#081410] text-white font-sans overflow-hidden selection:bg-primary selection:text-[#081410]">
      {/* Background Decor */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:32px_32px]" />
      <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 h-full flex flex-col pt-12">
        {/* Navigation */}
        <nav className="flex items-center justify-between px-12 xl:px-20 mb-20 lg:mb-32">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center p-2 shadow-lg shadow-primary/20">
              <Image src="/logo.png" alt="Logo" width={32} height={32} className="object-contain brightness-0" />
            </div>
            <span className="text-xl font-black tracking-tighter">CLUB CULTIVO</span>
          </div>
          <Link
            href="/auth/login"
            className="group flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-all border-b-2 border-b-primary/50"
          >
            Acceder al Panel
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </nav>

        {/* Hero Content */}
        <main className="flex-1 flex flex-col items-center justify-center text-center px-6 -mt-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.3em] mb-8">
            <ShieldCheck size={14} />
            Ecosistema de Gestión Profesional
          </div>

          <h1 className="text-6xl lg:text-8xl xl:text-9xl font-black leading-[0.9] tracking-tighter mb-8 max-w-5xl">
            LA REVOLUCIÓN DEL <span className="text-primary italic">CULTIVO</span> INTELIGENTE
          </h1>

          <p className="text-white/40 text-lg lg:text-xl font-medium max-w-2xl leading-relaxed mb-12">
            Plataforma integral para trazabilidad, dispensación y administración de asociaciones. Control total, cumplimiento real.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-20">
            <Link
              href="/postulacion"
              className="px-10 py-5 bg-primary text-[#081410] rounded-2xl font-black uppercase tracking-widest text-sm hover:scale-[1.02] transition-all active:scale-[0.98] shadow-xl shadow-primary/20"
            >
              Solicitar Ingreso
            </Link>
          </div>

          {/* Module Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 w-full max-w-5xl">
            {[
              { icon: Users, label: "SOCIOS" },
              { icon: Leaf, label: "TRAZABILIDAD" },
              { icon: Heart, label: "DISPENSARIO" },
              { icon: LayoutDashboard, label: "INVENTARIO" },
              { icon: BarChart3, label: "REPORTES" },
              { icon: ShieldCheck, label: "ADMIN" },
            ].map((m, i) => (
              <div key={m.label} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col items-center gap-3 group hover:bg-white/[0.05] hover:border-white/10 transition-all">
                <m.icon size={20} className="text-white/20 group-hover:text-primary transition-colors" />
                <span className="text-[9px] font-black uppercase tracking-widest text-white/30 group-hover:text-white/60 transition-colors">
                  {m.label}
                </span>
              </div>
            ))}
          </div>
        </main>

        {/* Footer */}
        <footer className="py-12 border-t border-white/5 flex items-center justify-between px-12 xl:px-20">
          <div className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em]">
            © {new Date().getFullYear()} CULTIVO INTELIGENTE S.A.
          </div>
          <div className="flex gap-8">
            <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">PRO ECOSYSTEM v2.0</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
