
// Esta é uma Supabase Edge Function
// Ela deve ser deployada usando: supabase functions deploy solara-agent

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.0.0"
import { authenticateRequest, authorizeRoles, corsHeaders, type AllowedRole } from "../_shared/auth.ts"

// Fix: Add declaration for Deno to avoid TypeScript errors in non-Deno environments.
declare const Deno: any;

const allowedRoles: AllowedRole[] = ['admin', 'business', 'consumer']

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const authResult = await authenticateRequest(req)
    if (!authResult.user) return authResult.response

    const roleCheck = authorizeRoles(authResult.user, allowedRoles)
    if (!('role' in roleCheck)) return roleCheck.response

    const { message, lead_id, context } = await req.json()

    // 1. Configurar Cliente Supabase (Service Role para acesso total ao BD)
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // 2. Salvar mensagem do usuário no BD
    if (lead_id) {
        await supabaseClient.from('chat_logs').insert({
            lead_id,
            role: 'user',
            content: message
        })
    }

    // 3. Lógica da Agente "Solara"
    // Aqui conectamos com a OpenAI ou Google Gemini via API Key segura (Backend)
    // Simulação da lógica da Solara para o exemplo:
    
    let solaraResponseText = "";
    
    // NOTA: Em produção, faça a chamada fetch('https://api.openai.com/v1/chat/completions'...) aqui
    // usando Deno.env.get('OPENAI_API_KEY')
    
    // Placeholder de lógica simples para demonstração sem chave externa configurada nesta function
    if (message.toLowerCase().includes('preço') || message.toLowerCase().includes('custo')) {
        solaraResponseText = "Para estimar o preço exato, eu precisaria saber o valor médio da sua conta de luz em Reais (R$). Poderia me informar?";
    } else if (message.toLowerCase().includes('telhado')) {
        solaraResponseText = "Entendi. O tipo de telhado influencia na instalação. O seu é de telha de barro, fibrocimento ou laje?";
    } else {
        solaraResponseText = "Olá! Sou a Solara. Estou analisando seu perfil de consumo. Me conte, qual é o valor aproximado da sua conta de energia hoje?";
    }

    // 4. Salvar resposta da IA no BD
    if (lead_id) {
        await supabaseClient.from('chat_logs').insert({
            lead_id,
            role: 'assistant',
            content: solaraResponseText
        })
    }

    return new Response(
      JSON.stringify({ reply: solaraResponseText }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
