"use client";

import { cn } from "@/lib/utils";

interface LotMobileTabsProps {
    columns: {
        id: string;
        title: string;
        color: string;
    }[];
    activeId: string;
    onTabChange: (id: string) => void;
    counts: Record<string, number>;
}

export function LotMobileTabs({ columns, activeId, onTabChange, counts }: LotMobileTabsProps) {
    return (
        <div className="lg:hidden w-full bg-background/95 backdrop-blur-xl z-30 border-b border-border/50 shadow-sm shrink-0">
            <div className="flex overflow-x-auto no-scrollbar gap-2 px-4 py-3">
                <div className="flex gap-2 min-w-max">
                    {columns.map((col) => {
                        const isActive = activeId === col.id;
                        const dotColor = col.color.split(" ")[0];

                        return (
                            <button
                                key={col.id}
                                onClick={() => onTabChange(col.id)}
                                className={cn(
                                    "flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-300 border shrink-0",
                                    isActive
                                        ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20 scale-105"
                                        : "bg-muted/40 text-muted-foreground border-transparent hover:bg-muted/60"
                                )}
                            >
                                <div className={cn(
                                    "w-1.5 h-1.5 rounded-full",
                                    isActive ? "bg-primary-foreground" : dotColor
                                )} />
                                <span className="text-[10px] font-black uppercase tracking-widest">{col.title}</span>
                                <span className={cn(
                                    "px-1.5 py-0.5 rounded-lg text-[9px] font-black",
                                    isActive ? "bg-primary-foreground/20 text-primary-foreground" : "bg-background/80 text-muted-foreground shadow-sm"
                                )}>
                                    {counts[col.id] || 0}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
