import { httpClient, setAuthToken, clearAuthToken } from './httpClient';

export interface ApiCompany {
  id: string;
  name: string;
  credits?: number;
}

export interface ApiUser {
  id: string;
  fullName: string;
  email: string;
  role?: string;
  company?: ApiCompany;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterCompanyPayload {
  name: string;
  document: string;
  documentType: string;
  address: Record<string, unknown>;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
  whatsapp?: string;
  company: RegisterCompanyPayload;
}

export interface AuthResponse {
  token: string;
  user: ApiUser;
}

export interface LeadPayload {
  name: string;
  whatsapp: string;
  city: string;
  uf: string;
}

export interface LeadResponse {
  id: string;
}

export interface MessagePayload {
  content: string;
  role: 'user' | 'assistant';
}

export interface NewUserPayload {
  fullName: string;
  email: string;
  whatsapp: string;
  role: string;
  password: string;
}

const mapUserToSession = (user: ApiUser) => ({
  id: user.id,
  name: user.fullName,
  type: 'business' as const,
  details: user.company
    ? {
        companyName: user.company.name,
        credits: user.company.credits ?? 0,
        companyId: user.company.id,
        role: user.role,
      }
    : undefined,
});

export const authApi = {
  async login(payload: LoginPayload) {
    const response = await httpClient.post<AuthResponse>('/auth/login', payload, { skipAuth: true });
    setAuthToken(response.token);
    return mapUserToSession(response.user);
  },
  async register(payload: RegisterPayload) {
    const response = await httpClient.post<AuthResponse>('/auth/register', payload, { skipAuth: true });
    setAuthToken(response.token);
    return mapUserToSession(response.user);
  },
  async getSession() {
    const response = await httpClient.get<AuthResponse>('/auth/me');
    return mapUserToSession(response.user);
  },
  async logout() {
    try {
      await httpClient.post('/auth/logout');
    } catch (error) {
      console.warn('Falha ao finalizar sessão no backend', error);
    } finally {
      clearAuthToken();
    }
  },
};

export const leadsApi = {
  createLead(payload: LeadPayload) {
    return httpClient.post<LeadResponse>('/leads', payload, { skipAuth: true });
  },
  appendMessage(leadId: string, message: MessagePayload) {
    return httpClient.post(`/leads/${leadId}/messages`, message, { skipAuth: true });
  },
};

export const usersApi = {
  createForCompany(companyId: string, payload: NewUserPayload) {
    return httpClient.post(`/companies/${companyId}/users`, payload);
  },
};
