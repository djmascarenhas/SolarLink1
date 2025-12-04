import { createClient, type User } from "https://esm.sh/@supabase/supabase-js@2.48.0";

export type AllowedRole = 'admin' | 'business' | 'consumer';

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const getEnv = (key: string) => Deno.env.get(key) ?? '';

const supabaseUrl = getEnv('SUPABASE_URL');
const supabaseAnonKey = getEnv('SUPABASE_ANON_KEY');

const getTokenFromHeader = (req: Request) => {
  const authHeader = req.headers.get('authorization') ?? '';
  if (!authHeader.toLowerCase().startsWith('bearer ')) return null;
  const token = authHeader.split(' ')[1];
  return token?.trim() || null;
};

export const jsonError = (message: string, status = 401) =>
  new Response(
    JSON.stringify({ error: message }),
    {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    },
  );

export const authenticateRequest = async (req: Request) => {
  const token = getTokenFromHeader(req);
  if (!token) return { response: jsonError('Token ausente ou inválido'), user: null } as const;

  const client = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  });

  const { data, error } = await client.auth.getUser();
  if (error || !data?.user) {
    return { response: jsonError('Token inválido'), user: null } as const;
  }

  return { user: data.user, token } as const;
};

const extractRole = (user: User): AllowedRole | undefined => {
  const rawRole = (user.app_metadata?.role || user.user_metadata?.role) as AllowedRole | undefined;
  return rawRole;
};

export const authorizeRoles = (user: User, allowedRoles: AllowedRole[]) => {
  const role = extractRole(user);
  if (!role) return { response: jsonError('Usuário sem papel atribuído', 403), role: null } as const;
  if (!allowedRoles.includes(role)) return { response: jsonError('Acesso negado para este papel', 403), role: null } as const;
  return { role } as const;
};
