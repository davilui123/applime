import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const TIPO_CONTA_PLUGGY = {
  BANK: 'corrente',
  CREDIT: 'cartao_credito',
};

async function pluggyApiKey() {
  const clientId = Deno.env.get('PLUGGY_CLIENT_ID');
  const clientSecret = Deno.env.get('PLUGGY_CLIENT_SECRET');
  const res = await fetch('https://api.pluggy.ai/auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ clientId, clientSecret }),
  });
  if (!res.ok) throw new Error('Falha ao autenticar na Pluggy');
  const { apiKey } = await res.json();
  return apiKey;
}

async function buscarTodasTransacoes(accountId, apiKey) {
  const transacoes = [];
  let page = 1;
  const pageSize = 500;
  while (true) {
    const res = await fetch(
      `https://api.pluggy.ai/transactions?accountId=${accountId}&page=${page}&pageSize=${pageSize}`,
      { headers: { 'X-API-KEY': apiKey } }
    );
    if (!res.ok) throw new Error('Falha ao buscar transações');
    const json = await res.json();
    transacoes.push(...json.results);
    if (page >= json.totalPages) break;
    page += 1;
  }
  return transacoes;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) throw new Error('Sem cabeçalho de autorização');

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Não autenticado' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { itemId } = await req.json();
    if (!itemId) throw new Error('itemId é obrigatório');

    const apiKey = await pluggyApiKey();

    const contasRes = await fetch(`https://api.pluggy.ai/accounts?itemId=${itemId}`, {
      headers: { 'X-API-KEY': apiKey },
    });
    if (!contasRes.ok) throw new Error('Falha ao buscar contas na Pluggy');
    const { results: contasPluggy } = await contasRes.json();

    const resumo = { contas: 0, transacoesNovas: 0 };

    for (const contaPluggy of contasPluggy) {
      const { data: conta, error: contaError } = await supabase
        .from('greena_contas')
        .upsert(
          {
            user_id: user.id,
            nome: contaPluggy.name,
            tipo: TIPO_CONTA_PLUGGY[contaPluggy.type] || 'corrente',
            instituicao: contaPluggy.marketingName || null,
            saldo_inicial: 0,
            icone: '🏦',
            origem: 'pluggy',
            pluggy_item_id: itemId,
            pluggy_account_id: contaPluggy.id,
            ativa: true,
          },
          { onConflict: 'user_id,pluggy_account_id' }
        )
        .select()
        .single();
      if (contaError) throw contaError;
      resumo.contas += 1;

      const transacoesPluggy = await buscarTodasTransacoes(contaPluggy.id, apiKey);

      const linhas = transacoesPluggy.map((t) => ({
        user_id: user.id,
        conta_id: conta.id,
        categoria_id: null,
        tipo: t.amount >= 0 ? 'receita' : 'despesa',
        valor: Math.abs(t.amount),
        descricao: t.description || null,
        data: t.date.slice(0, 10),
        recorrente: false,
        metodo_pagamento: 'pluggy',
        pluggy_transacao_id: t.id,
      }));

      if (linhas.length > 0) {
        const { error: txError, count } = await supabase
          .from('greena_transacoes')
          .upsert(linhas, { onConflict: 'user_id,pluggy_transacao_id', ignoreDuplicates: true, count: 'exact' });
        if (txError) throw txError;
        resumo.transacoesNovas += count || 0;
      }

      const liquidoImportado = transacoesPluggy.reduce((s, t) => s + t.amount, 0);
      const saldoReal = contaPluggy.balance ?? 0;
      await supabase
        .from('greena_contas')
        .update({ saldo_inicial: saldoReal - liquidoImportado })
        .eq('id', conta.id);
    }

    return new Response(JSON.stringify({ ok: true, resumo }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
