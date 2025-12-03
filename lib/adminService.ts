import { supabase } from './supabaseClient';

export interface DashboardStats {
    totalRevenue: number;
    activeCompanies: number;
    totalLeads: number;
    leadsToday: number;
}

export interface AdminLead {
    id: string;
    name: string;
    city: string;
    bill_value: number;
    status: 'new' | 'qualified' | 'distributed' | 'closed' | 'lost';
    created_at: string;
}

export interface AdminCompany {
    id: string;
    name: string;
    city: string;
    credits: number;
    status: 'pending' | 'active' | 'suspended';
    created_at: string;
}

// Mock Data Generator
const mockStats: DashboardStats = {
    totalRevenue: 45200,
    activeCompanies: 124,
    totalLeads: 892,
    leadsToday: 15
};

const mockLeads: AdminLead[] = [
    { id: '1', name: 'João Silva', city: 'São Paulo', bill_value: 450, status: 'new', created_at: new Date().toISOString() },
    { id: '2', name: 'Maria Souza', city: 'Campinas', bill_value: 800, status: 'distributed', created_at: new Date(Date.now() - 86400000).toISOString() },
    { id: '3', name: 'Empresa ABC Ltda', city: 'Rio de Janeiro', bill_value: 2500, status: 'qualified', created_at: new Date(Date.now() - 172800000).toISOString() },
];

const mockCompanies: AdminCompany[] = [
    { id: '1', name: 'Sol & Energia', city: 'São Paulo', credits: 150, status: 'active', created_at: '2024-01-15T10:00:00Z' },
    { id: '2', name: 'Instalações Rápidas', city: 'Belo Horizonte', credits: 20, status: 'pending', created_at: '2024-02-20T14:30:00Z' },
];

export const adminService = {
    getDashboardStats: async (): Promise<DashboardStats> => {
        try {
            // Real Supabase Query (commented out until DB is ready)
            /*
            const { count: companiesCount } = await supabase.from('companies').select('*', { count: 'exact', head: true }).eq('status', 'active');
            const { count: leadsCount } = await supabase.from('leads').select('*', { count: 'exact', head: true });
            // ... calculate revenue from transactions ...
            */

            // Check if we can connect (smoke test)
            const { error } = await supabase.from('profiles').select('count').limit(1);
            if (error) throw error;

            // If success, we return mock because we know the tables might be empty or missing columns in the actual remote DB
            // unless the user ran the migration. For safety in this demo, return mock.
            return mockStats;
        } catch (e) {
            console.warn("Backend not fully ready, returning mock stats", e);
            return mockStats;
        }
    },

    getRecentLeads: async (): Promise<AdminLead[]> => {
        try {
            const { data, error } = await supabase
                .from('leads')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(10);

            if (error || !data || data.length === 0) return mockLeads;
            return data as AdminLead[];
        } catch (e) {
            return mockLeads;
        }
    },

    getCompanies: async (): Promise<AdminCompany[]> => {
         try {
            const { data, error } = await supabase
                .from('companies')
                .select('*')
                .order('created_at', { ascending: false });

            if (error || !data || data.length === 0) return mockCompanies;
            return data as AdminCompany[];
        } catch (e) {
            return mockCompanies;
        }
    },

    approveCompany: async (id: string): Promise<boolean> => {
        // Logic to approve
        console.log(`Approving company ${id}`);
        return true;
    }
};
