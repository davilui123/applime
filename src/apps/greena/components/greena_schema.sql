-- =========================================================
-- GREENA — Schema Supabase
-- Todas as tabelas usam RLS: cada usuário só vê/edita o que é seu.
-- Rode isso inteiro no SQL Editor do Supabase.
-- =========================================================

-- Extensão pra gen_random_uuid() (já vem ativa na maioria dos projetos Supabase)
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------
-- 1. PERFIL (extra, não estava na sua lista, mas é necessário
--    pra guardar XP total / nível / avatar do Modo Missão)
-- ---------------------------------------------------------
create table if not exists greena_perfil (
  user_id uuid primary key references auth.users(id) on delete cascade,
  xp_total int not null default 0,
  nivel int not null default 1,
  avatar_id text not null default 'sprout',
  meta_zero_dividas date default '2026-12-31',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------
-- 2. CONTAS (manuais hoje, prontas pra receber origem Pluggy/Belvo depois)
-- ---------------------------------------------------------
create table if not exists greena_contas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  nome text not null,
  tipo text not null check (tipo in ('corrente','poupanca','carteira','investimento','cartao_credito')),
  instituicao text,
  saldo_inicial numeric(14,2) not null default 0,
  cor text default '#1F6F54',
  icone text default '🏦',
  origem text not null default 'manual' check (origem in ('manual','pluggy','belvo')),
  pluggy_item_id text,
  ativa boolean not null default true,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------
-- 3. CATEGORIAS
-- ---------------------------------------------------------
create table if not exists greena_categorias (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  nome text not null,
  tipo text not null check (tipo in ('receita','despesa')),
  cor text default '#1F6F54',
  icone text default '💸',
  is_padrao boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------
-- 4. TRANSAÇÕES
-- ---------------------------------------------------------
create table if not exists greena_transacoes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  conta_id uuid references greena_contas(id) on delete set null,
  categoria_id uuid references greena_categorias(id) on delete set null,
  tipo text not null check (tipo in ('receita','despesa')),
  valor numeric(14,2) not null check (valor > 0),
  descricao text,
  data date not null default current_date,
  hora time,
  recorrente boolean not null default false,
  metodo_pagamento text,
  tags text[] default '{}',
  created_at timestamptz not null default now()
);
create index if not exists idx_greena_transacoes_user_data on greena_transacoes(user_id, data desc);

-- ---------------------------------------------------------
-- 5. LIMITES POR CATEGORIA
-- ---------------------------------------------------------
create table if not exists greena_limites_categoria (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  categoria_id uuid not null references greena_categorias(id) on delete cascade,
  valor_limite numeric(14,2) not null,
  alerta_percentual int not null default 80,
  created_at timestamptz not null default now(),
  unique (user_id, categoria_id)
);

-- ---------------------------------------------------------
-- 6. METAS
-- ---------------------------------------------------------
create table if not exists greena_metas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  nome text not null,
  tipo text not null default 'outro' check (tipo in ('viagem','carro','reserva_emergencia','casa','educacao','outro')),
  valor_alvo numeric(14,2) not null,
  valor_atual numeric(14,2) not null default 0,
  data_alvo date,
  cor text default '#1F6F54',
  icone text default '🎯',
  status text not null default 'ativa' check (status in ('ativa','concluida','pausada')),
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------
-- 7. ASSINATURAS
-- ---------------------------------------------------------
create table if not exists greena_assinaturas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  nome text not null,
  valor numeric(14,2) not null,
  categoria_id uuid references greena_categorias(id) on delete set null,
  dia_vencimento int not null check (dia_vencimento between 1 and 31),
  frequencia text not null default 'mensal' check (frequencia in ('semanal','mensal','anual')),
  ativa boolean not null default true,
  lembrete_dias_antes int not null default 3,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------
-- 8. DÍVIDAS (o core da Estratégia Inteligente de Quitação)
-- ---------------------------------------------------------
create table if not exists greena_dividas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  nome text not null,
  tipo text not null default 'outro' check (tipo in ('cartao_credito','emprestimo','financiamento','cheque_especial','outro')),
  valor_total numeric(14,2) not null,
  valor_pago numeric(14,2) not null default 0,
  taxa_juros_mensal numeric(6,3) not null default 0,
  valor_parcela numeric(14,2),
  data_vencimento date,
  status text not null default 'ativa' check (status in ('ativa','quitada')),
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------
-- 9. MISSÕES (catálogo — templates globais OU geradas pro usuário)
-- ---------------------------------------------------------
create table if not exists greena_missoes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade, -- null = template global
  titulo text not null,
  descricao text,
  tipo text not null default 'habito' check (tipo in ('habito','economia','educacao','streak')),
  categoria_relacionada uuid references greena_categorias(id) on delete set null,
  meta_valor numeric(14,2) not null default 1,
  unidade text not null default 'dias',
  xp_recompensa int not null default 10,
  dificuldade text not null default 'facil' check (dificuldade in ('facil','media','dificil')),
  ativa boolean not null default true,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------
-- 10. MISSÕES DO USUÁRIO (instância aceita + progresso)
-- ---------------------------------------------------------
create table if not exists greena_missoes_usuario (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  missao_id uuid not null references greena_missoes(id) on delete cascade,
  data_inicio date not null default current_date,
  data_fim date,
  progresso_atual numeric(14,2) not null default 0,
  status text not null default 'em_andamento' check (status in ('em_andamento','concluida','falhada','abandonada')),
  xp_ganho int not null default 0,
  concluida_em timestamptz,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------
-- 11. STREAKS (múltiplos tipos por usuário)
-- ---------------------------------------------------------
create table if not exists greena_streaks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  tipo text not null default 'abertura_diaria',
  streak_atual int not null default 0,
  streak_recorde int not null default 0,
  ultima_data date,
  created_at timestamptz not null default now(),
  unique (user_id, tipo)
);

-- ---------------------------------------------------------
-- 12. SCORE HISTÓRICO (evolução mensal do Radar + Score de Organização)
-- ---------------------------------------------------------
create table if not exists greena_score_historico (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  mes_referencia date not null, -- sempre dia 1 do mês
  score_organizacao numeric(6,1),  -- escala 0-1000, estilo Serasa
  saude numeric(5,1),              -- 0-100
  risco numeric(5,1),              -- 0-100
  liquidez numeric(5,1),           -- 0-100
  liberdade_financeira numeric(5,1), -- 0-100
  estresse numeric(5,1),           -- 0-100
  patrimonio_liquido numeric(14,2),
  created_at timestamptz not null default now(),
  unique (user_id, mes_referencia)
);

-- =========================================================
-- RLS — cada usuário só acessa suas próprias linhas
-- =========================================================
alter table greena_perfil enable row level security;
alter table greena_contas enable row level security;
alter table greena_categorias enable row level security;
alter table greena_transacoes enable row level security;
alter table greena_limites_categoria enable row level security;
alter table greena_metas enable row level security;
alter table greena_assinaturas enable row level security;
alter table greena_dividas enable row level security;
alter table greena_missoes enable row level security;
alter table greena_missoes_usuario enable row level security;
alter table greena_streaks enable row level security;
alter table greena_score_historico enable row level security;

-- Perfil
create policy "perfil_select" on greena_perfil for select using (auth.uid() = user_id);
create policy "perfil_insert" on greena_perfil for insert with check (auth.uid() = user_id);
create policy "perfil_update" on greena_perfil for update using (auth.uid() = user_id);

-- Padrão repetido pras tabelas 100% pessoais
do $$
declare
  t text;
begin
  foreach t in array array[
    'greena_contas','greena_categorias','greena_transacoes','greena_limites_categoria',
    'greena_metas','greena_assinaturas','greena_dividas','greena_missoes_usuario',
    'greena_streaks','greena_score_historico'
  ]
  loop
    execute format('create policy "%1$s_select" on %1$s for select using (auth.uid() = user_id)', t);
    execute format('create policy "%1$s_insert" on %1$s for insert with check (auth.uid() = user_id)', t);
    execute format('create policy "%1$s_update" on %1$s for update using (auth.uid() = user_id)', t);
    execute format('create policy "%1$s_delete" on %1$s for delete using (auth.uid() = user_id)', t);
  end loop;
end $$;

-- Missões: select também libera templates globais (user_id is null)
create policy "missoes_select" on greena_missoes for select using (auth.uid() = user_id or user_id is null);
create policy "missoes_insert" on greena_missoes for insert with check (auth.uid() = user_id);
create policy "missoes_update" on greena_missoes for update using (auth.uid() = user_id);
create policy "missoes_delete" on greena_missoes for delete using (auth.uid() = user_id);
