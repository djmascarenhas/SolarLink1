-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES (Users)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    email TEXT,
    role TEXT CHECK (role IN ('admin', 'company', 'consumer')) DEFAULT 'consumer',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. COMPANIES (Integrators)
CREATE TABLE public.companies (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    document TEXT, -- CNPJ/CPF
    city TEXT,
    uf TEXT,
    credits INTEGER DEFAULT 0,
    status TEXT CHECK (status IN ('pending', 'active', 'suspended')) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. LEADS (Consumers/Opportunities)
CREATE TABLE public.leads (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    consumer_profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL, -- Optional, if logged in
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    whatsapp TEXT,
    city TEXT,
    uf TEXT,
    bill_value NUMERIC, -- Average energy bill
    roof_type TEXT,
    consumption_kwh NUMERIC,
    status TEXT CHECK (status IN ('new', 'qualified', 'distributed', 'closed', 'lost')) DEFAULT 'new',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. LEAD DISTRIBUTIONS (Which company got which lead)
CREATE TABLE public.lead_distributions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    status TEXT CHECK (status IN ('offered', 'purchased', 'rejected', 'expired')) DEFAULT 'offered',
    cost_credits INTEGER DEFAULT 0,
    purchased_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(lead_id, company_id) -- Prevent duplicate distribution
);

-- 5. TRANSACTIONS (Financial & Credits)
CREATE TABLE public.transactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL,
    type TEXT CHECK (type IN ('credit_purchase', 'lead_purchase', 'bonus', 'refund')),
    amount_brl NUMERIC DEFAULT 0, -- Monetary value
    credits_amount INTEGER NOT NULL, -- Credits added (+) or removed (-)
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS POLICIES (Security)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_distributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Profiles: Users see their own. Admins see all.
CREATE POLICY "Users view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Users update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Companies: Company owner sees own. Admins see all. Consumers see none (or public info if needed).
CREATE POLICY "Companies view own" ON public.companies
    FOR SELECT USING (profile_id = auth.uid() OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

-- Leads: Admins see all. Companies see purchased leads.
CREATE POLICY "Admins view all leads" ON public.leads
    FOR ALL USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Companies view purchased leads" ON public.leads
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.lead_distributions
            WHERE lead_id = public.leads.id
            AND company_id IN (SELECT id FROM public.companies WHERE profile_id = auth.uid())
            AND status = 'purchased'
        )
    );

-- Functions
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.email, 'consumer');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE handle_new_user();

-- Function to purchase lead
CREATE OR REPLACE FUNCTION purchase_lead(lead_uuid UUID, company_uuid UUID)
RETURNS JSONB AS $$
DECLARE
    company_credits INT;
    lead_cost INT := 10; -- Example fixed cost
BEGIN
    -- Check credits
    SELECT credits INTO company_credits FROM public.companies WHERE id = company_uuid;

    IF company_credits < lead_cost THEN
        RETURN jsonb_build_object('success', false, 'message', 'Insufficient credits');
    END IF;

    -- Deduct credits
    UPDATE public.companies SET credits = credits - lead_cost WHERE id = company_uuid;

    -- Record Transaction
    INSERT INTO public.transactions (company_id, type, credits_amount, description)
    VALUES (company_uuid, 'lead_purchase', -lead_cost, 'Purchase of lead ' || lead_uuid);

    -- Create/Update Distribution
    INSERT INTO public.lead_distributions (lead_id, company_id, status, cost_credits, purchased_at)
    VALUES (lead_uuid, company_uuid, 'purchased', lead_cost, NOW())
    ON CONFLICT (lead_id, company_id) DO UPDATE
    SET status = 'purchased', purchased_at = NOW();

    RETURN jsonb_build_object('success', true, 'message', 'Lead purchased successfully');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
