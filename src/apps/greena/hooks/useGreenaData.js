import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../../supabaseClient';

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
