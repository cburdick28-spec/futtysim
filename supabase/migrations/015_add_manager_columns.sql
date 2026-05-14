ALTER TABLE public.managers ADD COLUMN IF NOT EXISTS salary BIGINT DEFAULT 500000;
ALTER TABLE public.managers ADD COLUMN IF NOT EXISTS contract_length INT DEFAULT 3;
ALTER TABLE public.managers ADD COLUMN IF NOT EXISTS team_type TEXT DEFAULT 'club' CHECK (team_type IN ('club','national'));
ALTER TABLE public.managers ADD COLUMN IF NOT EXISTS team_id UUID;
