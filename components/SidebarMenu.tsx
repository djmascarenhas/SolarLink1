import React from 'react';

const menuItems = [
    'Fabricantes',
    'Distribuidoras/Importadores',
    'Tecnológia',
    'CRM',
    'Gestão',
    'Ferramentas',
    'Backend',
];

const SidebarMenu: React.FC = () => {
    return (
        <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-28 space-y-4 rounded-2xl border border-slate-800/80 bg-slate-900/70 p-4 shadow-2xl shadow-black/40 backdrop-blur-xl">
                <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-amber-300/90">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]"></span>
                    Menu
                </div>
                <nav className="space-y-2" aria-label="Menu principal da plataforma">
                    {menuItems.map((label) => (
                        <button
                            key={label}
                            type="button"
                            className="flex w-full items-center justify-between rounded-xl border border-slate-800/70 bg-slate-800/50 px-3 py-2 text-left text-sm font-medium text-slate-100 transition hover:-translate-y-0.5 hover:border-amber-400/70 hover:bg-slate-800/80 hover:text-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-400/70 focus:ring-offset-2 focus:ring-offset-slate-900"
                        >
                            <span>{label}</span>
                            <span className="text-xs text-amber-200/80">→</span>
                        </button>
                    ))}
                </nav>
            </div>
        </aside>
    );
};

export default SidebarMenu;
