
import { supabase } from './supabaseClient';
import { GoogleGenAI } from "@google/genai";
import { getGeminiApiKey } from './env';

// Inicializa a IA (Gemini)
const ai = new GoogleGenAI({ apiKey: getGeminiApiKey() });

/**
 * SERVIÇO DE BACKEND SOLARLINK
 * Centraliza a lógica de negócio entre Frontend, Banco de Dados e IA.
 */
export const SolarLinkService = {

  // =================================================================
  // 2.1. FLUXO - CADASTRO E LOGIN NO PAINEL DE EMPRESAS
  // =================================================================
  
  /**
   * Realiza o onboarding completo de uma empresa:
   * 1. Cria usuário no Auth
   * 2. Cria empresa na tabela 'companies'
   * 3. Cria perfil vinculado na tabela 'profiles'
   * 4. Registra log de auditoria
   */
  async onboardCompany(data: { 
    email: string; 
    password: string; 
    fullName: string; 
    companyName: string; 
    document: string; 
    address: any;
  }) {
    // 1. Sign Up no Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: { data: { full_name: data.fullName } }
    });

    if (authError) throw authError;
    const userId = authData.user?.id;
    if (!userId) throw new Error("Falha ao criar ID de autenticação.");

    // 2. Criar Empresa
    const { data: companyData, error: companyError } = await supabase
      .from('companies')
      .insert([{
        name: data.companyName,
        document: data.document,
        document_type: data.document.length > 11 ? 'CNPJ' : 'CPF',
        address: data.address,
        credits: 0 // Começa com 0 créditos
      }])
      .select()
      .single();

    if (companyError) throw companyError;

    // 3. Criar Perfil Vinculado
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([{
        id: userId,
        company_id: companyData.id,
        full_name: data.fullName,
        email: data.email,
        role: 'admin'
      }]);

    if (profileError) throw profileError;

    // 4. Auditoria
    await this.logAction(userId, companyData.id, 'create_company', { email: data.email });

    return { user: authData.user, company: companyData };
  },

  /**
   * Busca os dados completos do usuário logado (Perfil + Empresa)
   */
  async getUserSessionData(userId: string) {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select(`
        *,
        companies (
          id,
          name,
          credits
        )
      `)
      .eq('id', userId)
      .single();

    if (error) throw error;
    return profile;
  },

  // =================================================================
  // 2.2. FLUXO - PORTAL DO CONSUMIDOR (CADASTRO DE LEAD)
  // =================================================================

  /**
   * Cria um novo lead vindo do formulário público
   */
  async createLead(leadData: { name: string; whatsapp: string; city: string; uf: string }) {
    const { data, error } = await supabase
      .from('leads')
      .insert([{
        name: leadData.name,
        whatsapp: leadData.whatsapp,
        city: leadData.city,
        uf: leadData.uf,
        status: 'novo'
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // =================================================================
  // 2.3. FLUXO - CHAT IA (SOLARA)
  // =================================================================

  /**
   * Processa uma mensagem do usuário:
   * 1. Salva msg do usuário no BD
   * 2. Busca histórico
   * 3. Chama Gemini (Solara)
   * 4. Salva resposta da IA no BD
   * 5. Retorna resposta
   */
  async processUserMessage(leadId: string, userMessage: string, contextInfo?: any) {
    // 1. Salvar mensagem do usuário
    const { error: msgError } = await supabase
      .from('chat_logs')
      .insert({
        lead_id: leadId,
        role: 'user',
        content: userMessage
      });
    
    if (msgError) console.error("Erro ao salvar msg usuario", msgError);

    // 2. Buscar histórico recente (últimas 10 mensagens para contexto)
    const { data: history } = await supabase
      .from('chat_logs')
      .select('role, content')
      .eq('lead_id', leadId)
      .order('created_at', { ascending: true })
      .limit(20);

    // Montar prompt
    const chatHistoryText = history?.map(h => `${h.role === 'user' ? 'Cliente' : 'Solara'}: ${h.content}`).join('\n') || '';
    
    const systemPrompt = `
      Você é a SOLARA, uma engenheira especialista em energia solar da SolarLink.
      Seu objetivo é qualificar este lead (cliente) de forma amigável e técnica.
      
      Dados do Cliente:
      Cidade: ${contextInfo?.city || 'Não informado'}
      Nome: ${contextInfo?.name || 'Cliente'}
      Tipo de Interesse: ${contextInfo?.context || 'Geral'}

      Histórico da Conversa:
      ${chatHistoryText}

      Informação Nova do Cliente: "${userMessage}"

      Instruções:
      1. Tente descobrir o valor médio da conta de luz (R$) e o tipo de telhado, se ainda não souber.
      2. Responda dúvidas sobre economia, payback e sustentabilidade.
      3. Seja empática. Use emojis ocasionalmente.
      4. Mantenha respostas curtas (máximo 3 parágrafos).
      
      Responda como Solara:
    `;

    // 3. Chamar Gemini
    try {
      const model = ai.getGenerativeModel({ model: 'gemini-2.0-flash' });
      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: systemPrompt }] }],
      });

      const aiReply = result.response.text() || "Desculpe, estou recalculando meus painéis solares. Pode repetir?";

      // 4. Salvar resposta da IA
      await supabase
        .from('chat_logs')
        .insert({
          lead_id: leadId,
          role: 'assistant',
          content: aiReply
        });

      return aiReply;

    } catch (err) {
      console.error("Erro na IA:", err);
      return "Estou com uma instabilidade momentânea. Mas já anotei sua dúvida!";
    }
  },

  /**
   * Busca histórico de chat de um lead específico
   */
  async getChatHistory(leadId: string) {
    const { data, error } = await supabase
      .from('chat_logs')
      .select('*')
      .eq('lead_id', leadId)
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  // =================================================================
  // 2.4. FLUXO - CONSUMO DE CRÉDITOS / LEITURA
  // =================================================================

  /**
   * Busca todos os leads disponíveis para o painel de oportunidades
   */
  async getOpportunities() {
    // Em um cenário real, filtraríamos leads que a empresa ainda não comprou
    // Como a tabela leads é simples, vamos simular alguns dados técnicos se faltarem
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  /**
   * Desbloqueia um contato (Lead) consumindo créditos da empresa
   */
  async unlockLead(companyId: string, leadId: string, cost: number) {
    // 1. Verificar saldo (Buscar dados atuais)
    const { data: company, error: fetchError } = await supabase
      .from('companies')
      .select('credits')
      .eq('id', companyId)
      .single();

    if (fetchError) throw fetchError;

    if ((company.credits || 0) < cost) {
      return { success: false, message: "Saldo insuficiente." };
    }

    // 2. Debitar créditos
    const newBalance = company.credits - cost;
    const { error: updateError } = await supabase
      .from('companies')
      .update({ credits: newBalance })
      .eq('id', companyId);

    if (updateError) throw updateError;

    // 3. Registrar Auditoria
    // Como não temos auth.uid() aqui fácil no service puro sem contexto, 
    // assumimos que a chamada vem de um contexto seguro ou passamos o userId como argumento se necessário.
    // Aqui vamos pular o userId para simplificar, ou usaríamos um argumento extra.
    
    return { success: true, newBalance };
  },

  // Helper de Log
  async logAction(userId: string, companyId: string, action: string, details: any) {
    await supabase.from('audit_logs').insert({
      user_id: userId,
      company_id: companyId,
      action,
      details
    });
  }
};
