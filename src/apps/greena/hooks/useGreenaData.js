import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../../lib/supabaseClient';

const CATEGORIAS_PADRAO = [
  { nome: 'Alimentação', tipo: 'despesa', cor: '#C0533E', icone: '🍽️' },
  { nome: 'Transporte', tipo: 'despesa', cor: '#3E5C76', icone: '🚗' },
  { nome: 'Lazer', tipo: 'despesa', cor: '#C9A227', icone: '🎮' },
  { nome: 'Moradia', tipo: 'despesa', cor: '#8B4A6B', icone: '🏠' },
  { nome: 'Saúde', tipo: 'despesa', cor: '#1F6F54', icone: '💊' },
  { nome: 'Educação', tipo: 'despesa', cor: '#3E5C76', icone: '📚' },
  { nome: 'Assinaturas', tipo: 'despesa', cor: '#8B4A6B', icone: '📱' },
  { nome: 'Outros', tipo: 'despesa', cor: '#999999', icone: '❔' },
  { nome: 'Salário', tipo: 'receita', cor: '#1F6F54', icone: '💼' },
  { nome: 'Freelance', tipo: 'receita', cor: '#1F6F54', icone: '💻' },
  { nome: 'Outros', tipo: 'receita', cor: '#1F6F54', icone: '➕' },
];

async function getUserId() {
  const { data } = await supabase.auth.getUser();
  return data?.user?.id || null;
}

// Hook genérico de CRUD por tabela, escopado ao usuário logado
function useGreenaTable(tabela, orderBy = 'created_at', ascending = false) {
  const [dados, setDados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  const carregar = useCallback(async () => {
    setLoading(true);
    const userId = await getUserId();
    if (!userId) {
      setDados([]);
      setLoading(false);
      return;
    }
    const { data, error } = await supabase
      .from(tabela)
      .select('*')
      .eq('user_id', userId)
      .order(orderBy, { ascending });
    if (error) setErro(error);
    else setDados(data || []);
    setLoading(false);
  }, [tabela, orderBy, ascending]);

  useEffect(() => { carregar(); }, [carregar]);

  const inserir = useCallback(async (registro) => {
    const userId = await getUserId();
    if (!userId) return { error: 'Sem usuário logado' };
    const { data, error } = await supabase
      .from(tabela)
      .insert([{ ...registro, user_id: userId }])
      .select()
      .single();
    if (!error) setDados((prev) => [data, ...prev]);
    return { data, error };
  }, [tabela]);

  const atualizar = useCallback(async (id, patch) => {
    const { data, error } = await supabase
      .from(tabela)
      .update(patch)
      .eq('id', id)
      .select()
      .single();
    if (!error) setDados((prev) => prev.map((r) => (r.id === id ? data : r)));
    return { data, error };
  }, [tabela]);

  const remover = useCallback(async (id) => {
    const { error } = await supabase.from(tabela).delete().eq('id', id);
    if (!error) setDados((prev) => prev.filter((r) => r.id !== id));
    return { error };
  }, [tabela]);

  return { dados, loading, erro, recarregar: carregar, inserir, atualizar, remover };
}

export function useContas() {
  return useGreenaTable('greena_contas', 'created_at', true);
}

export function useCategorias() {
  const tabela = useGreenaTable('greena_categorias', 'nome', true);

  // Garante categorias padrão na primeira vez que o usuário abre o Greena
  useEffect(() => {
    if (tabela.loading) return;
    if (tabela.dados.length > 0) return;
    (async () => {
      const userId = await getUserId();
      if (!userId) return;
      const paraInserir = CATEGORIAS_PADRAO.map((c) => ({ ...c, is_padrao: true, user_id: userId }));
      const { error } = await supabase.from('greena_categorias').insert(paraInserir);
      if (!error) tabela.recarregar();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabela.loading, tabela.dados.length]);

  return tabela;
}

export function useTransacoes() {
  return useGreenaTable('greena_transacoes', 'data', false);
}

export function useMetas() {
  return useGreenaTable('greena_metas', 'created_at', false);
}

export function useDividas() {
  return useGreenaTable('greena_dividas', 'created_at', false);
}

export function useAssinaturas() {
  return useGreenaTable('greena_assinaturas', 'dia_vencimento', true);
}

// ---------------------------------------------------------
// PERFIL — XP total e nível (uma linha por usuário)
// ---------------------------------------------------------
export function usePerfil() {
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);

  const carregar = useCallback(async () => {
    setLoading(true);
    const userId = await getUserId();
    if (!userId) {
      setPerfil(null);
      setLoading(false);
      return;
    }
    let { data } = await supabase.from('greena_perfil').select('*').eq('user_id', userId).maybeSingle();
    if (!data) {
      const { data: criado } = await supabase
        .from('greena_perfil')
        .insert([{ user_id: userId }])
        .select()
        .single();
      data = criado;
    }
    setPerfil(data);
    setLoading(false);
  }, []);

  useEffect(() => { carregar(); }, [carregar]);

  const adicionarXP = useCallback(async (quantidade, novoNivel) => {
    if (!perfil) return;
    const xpTotal = perfil.xp_total + quantidade;
    const { data, error } = await supabase
      .from('greena_perfil')
      .update({ xp_total: xpTotal, nivel: novoNivel, updated_at: new Date().toISOString() })
      .eq('user_id', perfil.user_id)
      .select()
      .single();
    if (!error) setPerfil(data);
    return { data, error };
  }, [perfil]);

  return { perfil, loading, adicionarXP, recarregar: carregar };
}

// ---------------------------------------------------------
// STREAKS — múltiplos tipos por usuário (ex: 'abertura_diaria')
// ---------------------------------------------------------
export function useStreak(tipo) {
  const [streak, setStreak] = useState(null);
  const [loading, setLoading] = useState(true);

  const carregar = useCallback(async () => {
    setLoading(true);
    const userId = await getUserId();
    if (!userId) {
      setStreak(null);
      setLoading(false);
      return;
    }
    let { data } = await supabase
      .from('greena_streaks')
      .select('*')
      .eq('user_id', userId)
      .eq('tipo', tipo)
      .maybeSingle();
    if (!data) {
      const { data: criado } = await supabase
        .from('greena_streaks')
        .insert([{ user_id: userId, tipo }])
        .select()
        .single();
      data = criado;
    }
    setStreak(data);
    setLoading(false);
  }, [tipo]);

  useEffect(() => { carregar(); }, [carregar]);

  const registrarHoje = useCallback(async () => {
    const userId = await getUserId();
    if (!userId) return;
    const hoje = new Date().toISOString().slice(0, 10);

    // relê o valor mais recente pra evitar corrida entre abas/telas
    const { data: atual } = await supabase
      .from('greena_streaks')
      .select('*')
      .eq('user_id', userId)
      .eq('tipo', tipo)
      .maybeSingle();
    if (!atual || atual.ultima_data === hoje) {
      if (atual) setStreak(atual);
      return atual;
    }

    const ontem = new Date();
    ontem.setDate(ontem.getDate() - 1);
    const ontemStr = ontem.toISOString().slice(0, 10);

    const novoAtual = atual.ultima_data === ontemStr ? atual.streak_atual + 1 : 1;
    const novoRecorde = Math.max(novoAtual, atual.streak_recorde);

    const { data, error } = await supabase
      .from('greena_streaks')
      .update({ streak_atual: novoAtual, streak_recorde: novoRecorde, ultima_data: hoje })
      .eq('id', atual.id)
      .select()
      .single();
    if (!error) setStreak(data);
    return data;
  }, [tipo]);

  return { streak, loading, registrarHoje, recarregar: carregar };
}

// ---------------------------------------------------------
// MISSÕES — catálogo (templates globais + personalizadas do usuário)
// ---------------------------------------------------------
export function useMissoes() {
  const [dados, setDados] = useState([]);
  const [loading, setLoading] = useState(true);

  const carregar = useCallback(async () => {
    setLoading(true);
    const userId = await getUserId();
    if (!userId) {
      setDados([]);
      setLoading(false);
      return;
    }
    const { data, error } = await supabase
      .from('greena_missoes')
      .select('*')
      .or(`user_id.eq.${userId},user_id.is.null`)
      .eq('ativa', true)
      .order('created_at', { ascending: false });
    if (!error) setDados(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { carregar(); }, [carregar]);

  const criarMissaoPersonalizada = useCallback(async (missao) => {
    const userId = await getUserId();
    if (!userId) return { error: 'Sem usuário logado' };
    const { data, error } = await supabase
      .from('greena_missoes')
      .insert([{ ...missao, user_id: userId }])
      .select()
      .single();
    if (!error) setDados((prev) => [data, ...prev]);
    return { data, error };
  }, []);

  return { dados, loading, criarMissaoPersonalizada, recarregar: carregar };
}

// ---------------------------------------------------------
// MISSÕES DO USUÁRIO — instâncias aceitas, com progresso
// ---------------------------------------------------------
export function useMissoesUsuario() {
  const tabela = useGreenaTable('greena_missoes_usuario', 'created_at', false);

  const aceitarMissao = useCallback(async (missaoId) => {
    return tabela.inserir({ missao_id: missaoId, status: 'em_andamento', progresso_atual: 0 });
  }, [tabela]);

  const registrarProgresso = useCallback(async (missaoUsuarioId, progressoAtual, metaValor, xpRecompensa, onConcluir) => {
    const concluida = progressoAtual >= metaValor;
    const patch = {
      progresso_atual: Math.min(progressoAtual, metaValor),
      status: concluida ? 'concluida' : 'em_andamento',
    };
    if (concluida) {
      patch.xp_ganho = xpRecompensa;
      patch.concluida_em = new Date().toISOString();
    }
    const resultado = await tabela.atualizar(missaoUsuarioId, patch);
    if (concluida && onConcluir) onConcluir(xpRecompensa);
    return resultado;
  }, [tabela]);

  const abandonarMissao = useCallback(async (missaoUsuarioId) => {
    return tabela.atualizar(missaoUsuarioId, { status: 'abandonada' });
  }, [tabela]);

  return { ...tabela, aceitarMissao, registrarProgresso, abandonarMissao };
}
