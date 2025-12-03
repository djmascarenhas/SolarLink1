import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Logo } from '../Logo';
import { useAuth } from '../../contexts/AuthContext';

interface AdminLayoutProps {
    children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { logout } = useAuth();

    const menuItems = [
        { label: 'Visão Geral', path: '/admin' },
        { label: 'Leads', path: '/admin/leads' },
        { label: 'Empresas', path: '/admin/companies' },
        { label: 'Financeiro', path: '/admin/finance' },
    ];

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-slate-900 flex text-gray-200 font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col fixed h-full z-10">
                <div className="p-6 border-b border-slate-700">
                    <Logo className="h-8 w-auto" />
                    <span className="text-xs text-slate-400 mt-2 block uppercase tracking-wider">Painel Administrativo</span>
                </div>

                <nav className="flex-grow p-4 space-y-2">
                    {menuItems.map((item) => (
                        <button
                            key={item.path}
                            onClick={() => navigate(item.path)}
                            className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                                location.pathname === item.path
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50'
                                : 'text-gray-400 hover:bg-slate-700 hover:text-white'
                            }`}
                        >
                            {item.label}
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-700">
                    <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 text-sm text-red-400 hover:bg-red-900/20 rounded-lg transition-colors flex items-center gap-2 justify-center"
                    >
                        Sair do Sistema
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-grow ml-64 p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    );
};

export default AdminLayout;
