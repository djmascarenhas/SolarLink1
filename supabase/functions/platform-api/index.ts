import { serve } from "https://deno.land/std@0.223.0/http/server.ts";
import { createClient, SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";
import { z } from "https://esm.sh/zod@3.23.8";

type RouteHandler = (ctx: { req: Request; supabase: SupabaseClient }) => Promise<Response>;

type ApiErrorOptions = {
  status?: number;
  code?: string;
  details?: unknown;
};

class ApiError extends Error {
  status: number;
  code: string;
  details?: unknown;

  constructor(message: string, { status = 400, code = "bad_request", details }: ApiErrorOptions = {}) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
};

const jsonResponse = (payload: unknown, status = 200) =>
  new Response(JSON.stringify(payload, null, 2), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const handleApiError = (error: unknown): Response => {
  if (error instanceof ApiError) {
    return jsonResponse(
      {
        error: {
          code: error.code,
          message: error.message,
          details: error.details,
        },
      },
      error.status
    );
  }

  console.error("Unexpected error", error);
  return jsonResponse({ error: { code: "internal_error", message: "Ocorreu um erro inesperado." } }, 500);
};

const parseBody = async <T>(req: Request, schema: z.ZodSchema<T>): Promise<T> => {
  const body = await req.json();
  const result = schema.safeParse(body);

  if (!result.success) {
    throw new ApiError("Payload inválido.", {
      status: 422,
      code: "validation_error",
      details: result.error.flatten(),
    });
  }

  return result.data;
};

const requireUuid = (value: string | null, paramName: string): string => {
  const schema = z.string().uuid({ message: `${paramName} deve ser um UUID válido.` });
  const parsed = schema.safeParse(value);
  if (!parsed.success) {
    throw new ApiError(parsed.error.issues[0]?.message ?? `${paramName} inválido`, {
      status: 422,
      code: "validation_error",
    });
  }
  return parsed.data;
};

const profileUpdateSchema = z.object({
  full_name: z.string().min(3, "Nome precisa de ao menos 3 caracteres."),
  email: z.string().email("E-mail inválido."),
  phone: z.string().min(8, "Telefone deve conter ao menos 8 dígitos.").optional(),
  company: z.object({
    name: z.string().min(2, "Nome da empresa deve ter ao menos 2 caracteres."),
    segment: z.string().max(120).optional(),
    website: z.string().url("URL inválida.").optional(),
    size: z.string().optional(),
  }),
});

const opportunityBaseSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  value: z.number().nonnegative(),
  status: z.enum(["open", "in_progress", "won", "lost"]),
  company_id: z.string().uuid(),
  owner_id: z.string().uuid().optional(),
});

const opportunityCreateSchema = opportunityBaseSchema;
const opportunityUpdateSchema = opportunityBaseSchema.partial();

const creditPurchaseSchema = z.object({
  profile_id: z.string().uuid(),
  amount: z.number().positive("O valor deve ser maior que zero."),
  payment_method: z.enum(["pix", "credit_card", "boleto"]),
  reference: z.string().max(120).optional(),
});

const openApiDocument = {
  openapi: "3.1.0",
  info: {
    title: "SolarLink Platform API",
    version: "1.0.0",
    description: "API para perfis, empresas, oportunidades, créditos e dashboards",
  },
  components: {
    schemas: {
      ProfileUpdate: {
        type: "object",
        required: ["full_name", "email", "company"],
        properties: {
          full_name: { type: "string", minLength: 3 },
          email: { type: "string", format: "email" },
          phone: { type: "string" },
          company: {
            type: "object",
            required: ["name"],
            properties: {
              name: { type: "string", minLength: 2 },
              segment: { type: "string" },
              website: { type: "string", format: "uri" },
              size: { type: "string" },
            },
          },
        },
      },
      OpportunityCreate: {
        type: "object",
        required: ["title", "description", "value", "status", "company_id"],
        properties: {
          title: { type: "string" },
          description: { type: "string" },
          value: { type: "number", minimum: 0 },
          status: { type: "string", enum: ["open", "in_progress", "won", "lost"] },
          company_id: { type: "string", format: "uuid" },
          owner_id: { type: "string", format: "uuid" },
        },
      },
      OpportunityUpdate: {
        allOf: [{ $ref: "#/components/schemas/OpportunityCreate" }],
      },
      CreditPurchase: {
        type: "object",
        required: ["profile_id", "amount", "payment_method"],
        properties: {
          profile_id: { type: "string", format: "uuid" },
          amount: { type: "number", minimum: 0 },
          payment_method: { type: "string", enum: ["pix", "credit_card", "boleto"] },
          reference: { type: "string" },
        },
      },
    },
  },
  paths: {
    "/docs": {
      get: {
        summary: "Documento OpenAPI",
        responses: {
          200: { description: "Documento OpenAPI em JSON" },
        },
      },
    },
    "/docs/swagger": {
      get: {
        summary: "Swagger UI hospedado pela função",
        responses: {
          200: { description: "Interface Swagger" },
        },
      },
    },
    "/profiles/{id}": {
      get: {
        summary: "Buscar perfil e empresa",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } },
        ],
        responses: {
          200: { description: "Perfil encontrado" },
          404: { description: "Não encontrado" },
        },
      },
      put: {
        summary: "Atualizar perfil e empresa",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ProfileUpdate" },
              examples: {
                exemplo: {
                  summary: "Atualização de perfil",
                  value: {
                    full_name: "Ana Cliente",
                    email: "ana@empresa.com",
                    phone: "+55 11 99999-9999",
                    company: {
                      name: "Empresa Solar",
                      segment: "Energia",
                      website: "https://empresasolar.com",
                      size: "51-200",
                    },
                  },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Perfil atualizado" },
          422: { description: "Erro de validação" },
        },
      },
    },
    "/opportunities": {
      get: {
        summary: "Listar oportunidades",
        parameters: [
          { name: "companyId", in: "query", required: false, schema: { type: "string", format: "uuid" } },
        ],
        responses: {
          200: { description: "Lista retornada" },
        },
      },
      post: {
        summary: "Criar oportunidade",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/OpportunityCreate" },
              examples: {
                exemplo: {
                  summary: "Nova oportunidade",
                  value: {
                    title: "Projeto usina 500kWp",
                    description: "Cliente busca usina solar para condomínio.",
                    value: 1200000,
                    status: "open",
                    company_id: "00000000-0000-0000-0000-000000000000",
                    owner_id: "00000000-0000-0000-0000-000000000001",
                  },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "Criado" },
          422: { description: "Erro de validação" },
        },
      },
    },
    "/opportunities/{id}": {
      get: { summary: "Buscar oportunidade" },
      put: {
        summary: "Atualizar oportunidade",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/OpportunityUpdate" },
            },
          },
        },
      },
      delete: { summary: "Excluir oportunidade" },
    },
    "/credits/purchase": {
      post: {
        summary: "Registrar compra de créditos",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreditPurchase" },
              examples: {
                exemplo: {
                  summary: "Compra via PIX",
                  value: {
                    profile_id: "00000000-0000-0000-0000-000000000010",
                    amount: 500,
                    payment_method: "pix",
                    reference: "PEDIDO-123",
                  },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "Compra registrada" },
        },
      },
    },
    "/credits/history": {
      get: {
        summary: "Histórico de créditos",
        parameters: [
          { name: "profileId", in: "query", required: true, schema: { type: "string", format: "uuid" } },
        ],
        responses: {
          200: { description: "Histórico retornado" },
        },
      },
    },
    "/dashboards/summary": {
      get: { summary: "Dados consolidados para dashboards" },
    },
  },
};

const swaggerUi = `<!doctype html>
<html>
  <head>
    <title>SolarLink API Docs</title>
    <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
  </head>
  <body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
    <script>
      window.onload = () => {
        SwaggerUIBundle({
          url: './docs',
          dom_id: '#swagger-ui'
        });
      }
    </script>
  </body>
</html>`;

const getProfile: RouteHandler = async ({ supabase, req }) => {
  const pathParts = new URL(req.url).pathname.split("/").filter(Boolean);
  const profileId = requireUuid(pathParts[pathParts.length - 1] ?? null, "id");

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, full_name, email, phone")
    .eq("id", profileId)
    .single();

  if (profileError) {
    throw new ApiError("Perfil não encontrado.", { status: 404, code: "profile_not_found", details: profileError.message });
  }

  const { data: company, error: companyError } = await supabase
    .from("companies")
    .select("id, name, segment, website, size")
    .eq("profile_id", profileId)
    .maybeSingle();

  if (companyError) {
    throw new ApiError("Erro ao buscar empresa.", { status: 500, code: "company_lookup_failed", details: companyError.message });
  }

  return jsonResponse({ profile, company });
};

const updateProfile: RouteHandler = async ({ supabase, req }) => {
  const pathParts = new URL(req.url).pathname.split("/").filter(Boolean);
  const profileId = requireUuid(pathParts[pathParts.length - 1] ?? null, "id");
  const payload = await parseBody(req, profileUpdateSchema);

  const { full_name, email, phone, company } = payload;

  const { error: profileError } = await supabase
    .from("profiles")
    .update({ full_name, email, phone })
    .eq("id", profileId);

  if (profileError) {
    throw new ApiError("Não foi possível atualizar o perfil.", {
      status: 500,
      code: "profile_update_failed",
      details: profileError.message,
    });
  }

  const { error: companyError, data: companyData } = await supabase
    .from("companies")
    .upsert({ ...company, profile_id: profileId })
    .select()
    .maybeSingle();

  if (companyError) {
    throw new ApiError("Não foi possível atualizar a empresa.", {
      status: 500,
      code: "company_update_failed",
      details: companyError.message,
    });
  }

  return jsonResponse({ profile_id: profileId, company: companyData ?? company }, 200);
};

const listOpportunities: RouteHandler = async ({ supabase, req }) => {
  const url = new URL(req.url);
  const companyId = url.searchParams.get("companyId");
  if (companyId) {
    requireUuid(companyId, "companyId");
  }

  const query = supabase.from("opportunities").select("id, title, description, value, status, company_id, owner_id, created_at").order("created_at", { ascending: false });

  if (companyId) {
    query.eq("company_id", companyId);
  }

  const { data, error } = await query;

  if (error) {
    throw new ApiError("Erro ao listar oportunidades.", {
      status: 500,
      code: "opportunity_list_failed",
      details: error.message,
    });
  }

  return jsonResponse({ items: data ?? [] });
};

const createOpportunity: RouteHandler = async ({ supabase, req }) => {
  const payload = await parseBody(req, opportunityCreateSchema);

  const { data, error } = await supabase
    .from("opportunities")
    .insert(payload)
    .select()
    .single();

  if (error) {
    throw new ApiError("Não foi possível criar a oportunidade.", {
      status: 500,
      code: "opportunity_create_failed",
      details: error.message,
    });
  }

  return jsonResponse({ opportunity: data }, 201);
};

const getOpportunity: RouteHandler = async ({ supabase, req }) => {
  const pathParts = new URL(req.url).pathname.split("/").filter(Boolean);
  const opportunityId = requireUuid(pathParts[pathParts.length - 1] ?? null, "id");

  const { data, error } = await supabase
    .from("opportunities")
    .select("id, title, description, value, status, company_id, owner_id, created_at")
    .eq("id", opportunityId)
    .single();

  if (error) {
    throw new ApiError("Oportunidade não encontrada.", { status: 404, code: "opportunity_not_found", details: error.message });
  }

  return jsonResponse({ opportunity: data });
};

const updateOpportunity: RouteHandler = async ({ supabase, req }) => {
  const pathParts = new URL(req.url).pathname.split("/").filter(Boolean);
  const opportunityId = requireUuid(pathParts[pathParts.length - 1] ?? null, "id");
  const payload = await parseBody(req, opportunityUpdateSchema);

  const { data, error } = await supabase
    .from("opportunities")
    .update(payload)
    .eq("id", opportunityId)
    .select()
    .single();

  if (error) {
    throw new ApiError("Não foi possível atualizar a oportunidade.", {
      status: 500,
      code: "opportunity_update_failed",
      details: error.message,
    });
  }

  return jsonResponse({ opportunity: data });
};

const deleteOpportunity: RouteHandler = async ({ supabase, req }) => {
  const pathParts = new URL(req.url).pathname.split("/").filter(Boolean);
  const opportunityId = requireUuid(pathParts[pathParts.length - 1] ?? null, "id");

  const { error } = await supabase.from("opportunities").delete().eq("id", opportunityId);

  if (error) {
    throw new ApiError("Não foi possível remover a oportunidade.", {
      status: 500,
      code: "opportunity_delete_failed",
      details: error.message,
    });
  }

  return jsonResponse({ removed: true });
};

const purchaseCredits: RouteHandler = async ({ supabase, req }) => {
  const payload = await parseBody(req, creditPurchaseSchema);
  const { profile_id, amount, payment_method, reference } = payload;

  const { data, error } = await supabase
    .from("credit_transactions")
    .insert({ profile_id, amount, payment_method, reference, type: "purchase" })
    .select()
    .single();

  if (error) {
    throw new ApiError("Não foi possível registrar a compra.", {
      status: 500,
      code: "credit_purchase_failed",
      details: error.message,
    });
  }

  const { data: balanceRow, error: balanceError } = await supabase
    .from("credit_balances")
    .upsert({ profile_id, balance: amount }, { onConflict: "profile_id" })
    .select()
    .maybeSingle();

  if (balanceError) {
    throw new ApiError("Compra registrada, mas falha ao atualizar saldo.", {
      status: 500,
      code: "balance_update_failed",
      details: balanceError.message,
    });
  }

  return jsonResponse({ transaction: data, balance: balanceRow?.balance ?? amount }, 201);
};

const creditHistory: RouteHandler = async ({ supabase, req }) => {
  const url = new URL(req.url);
  const profileId = requireUuid(url.searchParams.get("profileId"), "profileId");

  const { data, error } = await supabase
    .from("credit_transactions")
    .select("id, amount, payment_method, reference, type, created_at")
    .eq("profile_id", profileId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new ApiError("Erro ao consultar histórico de créditos.", {
      status: 500,
      code: "credit_history_failed",
      details: error.message,
    });
  }

  return jsonResponse({ items: data ?? [] });
};

const dashboardSummary: RouteHandler = async ({ supabase }) => {
  const { data: opportunities, error: oppError } = await supabase
    .from("opportunities")
    .select("status, value");

  if (oppError) {
    throw new ApiError("Erro ao consolidar oportunidades.", {
      status: 500,
      code: "dashboard_opportunities_failed",
      details: oppError.message,
    });
  }

  const statusCount = (opportunities ?? []).reduce<Record<string, number>>((acc, item) => {
    acc[item.status] = (acc[item.status] ?? 0) + 1;
    return acc;
  }, {});

  const totalPipeline = (opportunities ?? []).reduce((sum, item) => sum + (item.value ?? 0), 0);

  const { data: credits, error: creditsError } = await supabase
    .from("credit_transactions")
    .select("type, amount");

  if (creditsError) {
    throw new ApiError("Erro ao consolidar créditos.", {
      status: 500,
      code: "dashboard_credits_failed",
      details: creditsError.message,
    });
  }

  const creditSummary = (credits ?? []).reduce(
    (acc, transaction) => {
      if (transaction.type === "purchase") acc.purchased += transaction.amount;
      if (transaction.type === "spend") acc.spent += transaction.amount;
      return acc;
    },
    { purchased: 0, spent: 0 }
  );

  return jsonResponse({
    opportunities: {
      total: opportunities?.length ?? 0,
      by_status: statusCount,
      total_pipeline: totalPipeline,
    },
    credits: creditSummary,
  });
};

const routeMap: Record<string, Record<string, RouteHandler>> = {
  profiles: { GET: getProfile, PUT: updateProfile },
  opportunities: { GET: listOpportunities, POST: createOpportunity, PUT: updateOpportunity, DELETE: deleteOpportunity },
  credits: { POST: purchaseCredits },
  dashboards: { GET: dashboardSummary },
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  const supabase = createClient(supabaseUrl, supabaseKey, {
    global: { headers: { "x-application-name": "platform-api" } },
  });

  const url = new URL(req.url);
  const segments = url.pathname.split("/").filter(Boolean);

  if (url.pathname.endsWith("/docs")) {
    return jsonResponse(openApiDocument);
  }

  if (url.pathname.endsWith("/docs/swagger")) {
    return new Response(swaggerUi, {
      headers: { ...corsHeaders, "Content-Type": "text/html; charset=utf-8" },
    });
  }

  if (url.pathname.startsWith("/credits/")) {
    if (req.method === "GET" && url.pathname.endsWith("/history")) {
      try {
        return await creditHistory({ req, supabase });
      } catch (error) {
        return handleApiError(error);
      }
    }
    if (req.method === "POST" && url.pathname.endsWith("/purchase")) {
      try {
        return await purchaseCredits({ req, supabase });
      } catch (error) {
        return handleApiError(error);
      }
    }
  }

  if (url.pathname.startsWith("/dashboards/summary")) {
    try {
      return await dashboardSummary({ req, supabase });
    } catch (error) {
      return handleApiError(error);
    }
  }

  const [resource] = segments;
  const method = req.method.toUpperCase();
  const handler = routeMap[resource]?.[method];

  if (!handler) {
    return jsonResponse({ error: { code: "not_found", message: "Rota não encontrada." } }, 404);
  }

  try {
    if (resource === "opportunities" && segments.length === 1 && method === "GET") {
      return await listOpportunities({ req, supabase });
    }

    if (resource === "opportunities" && segments.length === 1 && method === "POST") {
      return await createOpportunity({ req, supabase });
    }

    if (resource === "opportunities" && segments.length === 2) {
      if (method === "GET") return await getOpportunity({ req, supabase });
      if (method === "PUT") return await updateOpportunity({ req, supabase });
      if (method === "DELETE") return await deleteOpportunity({ req, supabase });
    }

    if (resource === "profiles" && segments.length === 2) {
      if (method === "GET") return await getProfile({ req, supabase });
      if (method === "PUT") return await updateProfile({ req, supabase });
    }

    return jsonResponse({ error: { code: "not_found", message: "Rota não encontrada." } }, 404);
  } catch (error) {
    return handleApiError(error);
  }
});
