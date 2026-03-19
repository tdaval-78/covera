-- Covera: Initial database schema
-- Profiles (user accounts)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insurance contracts
CREATE TABLE IF NOT EXISTS public.contracts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('vehicle', 'phone', 'home', 'health', 'person', 'animal', 'other')),
  file_name TEXT,
  file_type TEXT CHECK (file_type IN ('pdf', 'image', 'text')),
  file_url TEXT,
  raw_text TEXT,
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contract analysis (AI-extracted data)
CREATE TABLE IF NOT EXISTS public.contract_analysis (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  contract_id UUID REFERENCES public.contracts(id) ON DELETE CASCADE NOT NULL UNIQUE,
  insurer TEXT,
  policy_number TEXT,
  product_name TEXT,
  start_date DATE,
  end_date DATE,
  premium NUMERIC(10,2),
  currency TEXT DEFAULT 'EUR',
  franchise NUMERIC(10,2),
  covered_risks JSONB DEFAULT '[]',
  excluded_risks JSONB DEFAULT '[]',
  plafonds JSONB DEFAULT '[]',
  conditions TEXT,
  confidence NUMERIC(3,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Coverage items (individual insured objects)
CREATE TABLE IF NOT EXISTS public.coverage_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  contract_id UUID REFERENCES public.contracts(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('vehicle', 'phone', 'home', 'health', 'person', 'animal', 'other')),
  icon TEXT,
  insurer TEXT,
  policy_number TEXT,
  start_date DATE,
  end_date DATE,
  premium NUMERIC(10,2),
  franchise NUMERIC(10,2),
  coverage_status TEXT DEFAULT 'unknown' CHECK (coverage_status IN ('covered', 'partial', 'excluded', 'unknown')),
  covered_risks JSONB DEFAULT '[]',
  excluded_risks JSONB DEFAULT '[]',
  plafonds JSONB DEFAULT '[]',
  conditions TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contract_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coverage_items ENABLE ROW LEVEL SECURITY;

-- Profiles: users can only see/edit their own profile
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Contracts: users can only see/edit their own contracts
CREATE POLICY "Users can view own contracts" ON public.contracts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own contracts" ON public.contracts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own contracts" ON public.contracts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own contracts" ON public.contracts FOR DELETE USING (auth.uid() = user_id);

-- Contract analysis: follows contract access
CREATE POLICY "Users can view own contract analysis" ON public.contract_analysis FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.contracts WHERE contracts.id = contract_analysis.contract_id AND contracts.user_id = auth.uid())
);
CREATE POLICY "Users can insert own contract analysis" ON public.contract_analysis FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.contracts WHERE contracts.id = contract_analysis.contract_id AND contracts.user_id = auth.uid())
);
CREATE POLICY "Users can update own contract analysis" ON public.contract_analysis FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.contracts WHERE contracts.id = contract_analysis.contract_id AND contracts.user_id = auth.uid())
);

-- Coverage items: follows contract access
CREATE POLICY "Users can view own coverage items" ON public.coverage_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.contracts WHERE contracts.id = coverage_items.contract_id AND contracts.user_id = auth.uid())
);
CREATE POLICY "Users can insert own coverage items" ON public.coverage_items FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.contracts WHERE contracts.id = coverage_items.contract_id AND contracts.user_id = auth.uid())
);
CREATE POLICY "Users can update own coverage items" ON public.coverage_items FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.contracts WHERE contracts.id = coverage_items.contract_id AND contracts.user_id = auth.uid())
);
CREATE POLICY "Users can delete own coverage items" ON public.coverage_items FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.contracts WHERE contracts.id = coverage_items.contract_id AND contracts.user_id = auth.uid())
);

-- Storage: bucket for contract files
INSERT INTO storage.buckets (id, name, public) VALUES ('contracts', 'contracts', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Users can upload own contract files" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'contracts' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view own contract files" ON storage.objects FOR SELECT
  USING (bucket_id = 'contracts' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own contract files" ON storage.objects FOR DELETE
  USING (bucket_id = 'contracts' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
