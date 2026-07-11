// financeEngine.js
// Todo cálculo financeiro do Greena mora aqui, 100% client-side (sem custo, sem IA).
// O "Detetive Financeiro" e a "Linha do Tempo do Futuro" (fases seguintes) vão
// consumir essas mesmas funções como base.

export function saldoDaConta(conta, transacoes) {
  const doConta = transacoes.filter((t) => t.conta_id === conta.id);
  const receitas = doConta.filter((t) => t.tipo === 'receita').reduce((s, t) => s + Number(t.valor), 0);
  const despesas = doConta.filter((t) => t.tipo === 'despesa').reduce((s, t) => s + Number(t.valor), 0);
  return Number(conta.saldo_inicial) + receitas - despesas;
}

export function saldoConsolidado(contas, transacoes) {
  return contas
    .filter((c) => c.ativa)
    .reduce((soma, c) => soma + saldoDaConta(c, transacoes), 0);
}

export function patrimonioLiquido(contas, transacoes, dividas) {
  const ativos = saldoConsolidado(contas, transacoes);
  const passivos = dividas
    .filter((d) => d.status === 'ativa')
    .reduce((s, d) => s + (Number(d.valor_total) - Number(d.valor_pago)), 0);
  return ativos - passivos;
}

export function fluxoDoMes(transacoes, referencia = new Date()) {
  const mes = referencia.getMonth();
  const ano = referencia.getFullYear();
  const doMes = transacoes.filter((t) => {
    const d = new Date(`${t.data}T00:00:00`);
    return d.getMonth() === mes && d.getFullYear() === ano;
  });
  const receitas = doMes.filter((t) => t.tipo === 'receita').reduce((s, t) => s + Number(t.valor), 0);
  const despesas = doMes.filter((t) => t.tipo === 'despesa').reduce((s, t) => s + Number(t.valor), 0);
  return { receitas, despesas, saldo: receitas - despesas, transacoes: doMes };
}

export function gastosPorCategoria(transacoes, categorias, referencia = new Date()) {
  const { transacoes: doMes } = fluxoDoMes(transacoes, referencia);
  const despesas = doMes.filter((t) => t.tipo === 'despesa');
  const total = despesas.reduce((s, t) => s + Number(t.valor), 0) || 1;

  const mapa = {};
  despesas.forEach((t) => {
    const cat = categorias.find((c) => c.id === t.categoria_id);
    const chave = cat ? cat.id : 'sem_categoria';
    if (!mapa[chave]) {
      mapa[chave] = {
        categoria: cat || { nome: 'Sem categoria', cor: '#999', icone: '❔' },
        valor: 0,
      };
    }
    mapa[chave].valor += Number(t.valor);
  });

  return Object.values(mapa)
    .map((item) => ({ ...item, percentual: (item.valor / total) * 100 }))
    .sort((a, b) => b.valor - a.valor);
}

// ---------------------------------------------------------
// RADAR FINANCEIRO — 5 eixos, 0 a 100
// ---------------------------------------------------------
export function calcularRadar({ contas, transacoes, dividas, metas }) {
  const { receitas, despesas } = fluxoDoMes(transacoes);
  const saldoAtual = saldoConsolidado(contas, transacoes);
  const dividasAtivas = dividas.filter((d) => d.status === 'ativa');
  const totalDividas = dividasAtivas.reduce((s, d) => s + (Number(d.valor_total) - Number(d.valor_pago)), 0);
  const parcelasMes = dividasAtivas.reduce((s, d) => s + Number(d.valor_parcela || 0), 0);

  // Saúde: receitas cobrindo despesas com folga
  const margem = receitas > 0 ? (receitas - despesas) / receitas : despesas > 0 ? -1 : 0;
  const saude = clamp(50 + margem * 100, 0, 100);

  // Risco: comprometimento de renda com dívidas + parcelas
  const comprometimento = receitas > 0 ? parcelasMes / receitas : totalDividas > 0 ? 1 : 0;
  const risco = clamp(comprometimento * 140, 0, 100);

  // Liquidez: quantos meses de despesa o saldo atual cobre
  const mesesDeColchao = despesas > 0 ? saldoAtual / despesas : saldoAtual > 0 ? 6 : 0;
  const liquidez = clamp((mesesDeColchao / 6) * 100, 0, 100);

  // Liberdade financeira: patrimônio líquido positivo + metas avançando
  const patrimonio = patrimonioLiquido(contas, transacoes, dividas);
  const metasAtivas = metas.filter((m) => m.status === 'ativa');
  const progressoMedioMetas = metasAtivas.length
    ? metasAtivas.reduce((s, m) => s + Math.min(Number(m.valor_atual) / Math.max(Number(m.valor_alvo), 1), 1), 0) / metasAtivas.length
    : 0;
  const liberdade = clamp((patrimonio > 0 ? 40 : 10) + progressoMedioMetas * 60, 0, 100);

  // Estresse: espelha risco + baixa liquidez + despesas subindo mais que receita
  const estresse = clamp(risco * 0.6 + (100 - liquidez) * 0.4, 0, 100);

  return {
    saude: round1(saude),
    risco: round1(risco),
    liquidez: round1(liquidez),
    liberdade: round1(liberdade),
    estresse: round1(estresse),
  };
}

// Score de organização, escala 0-1000 (estilo Serasa), derivado do radar
export function calcularScoreOrganizacao(radar) {
  const positivo = (radar.saude + radar.liquidez + radar.liberdade) / 3;
  const negativo = (radar.risco + radar.estresse) / 2;
  const base = clamp(positivo - negativo * 0.5, 0, 100);
  return Math.round(base * 10); // 0-1000
}

// ---------------------------------------------------------
// ESTRATÉGIA DE QUITAÇÃO DE DÍVIDAS
// metodo: 'avalanche' (maior juros primeiro, menos juros pago no total)
//         'snowball'  (menor valor primeiro, motivação rápida)
// ---------------------------------------------------------
export function ordenarDividasPorEstrategia(dividas, metodo = 'avalanche') {
  const ativas = dividas.filter((d) => d.status === 'ativa');
  const copia = [...ativas];
  if (metodo === 'avalanche') {
    copia.sort((a, b) => Number(b.taxa_juros_mensal) - Number(a.taxa_juros_mensal));
  } else {
    copia.sort((a, b) => (Number(a.valor_total) - Number(a.valor_pago)) - (Number(b.valor_total) - Number(b.valor_pago)));
  }
  return copia.map((d, i) => ({ ...d, prioridade: i + 1 }));
}

// Simula quitação mês a mês: valorMensalDisponivel é redirecionado sempre
// pra dívida de maior prioridade (bola de neve entre as dívidas).
export function simularQuitacao(dividas, valorMensalDisponivel, metodo = 'avalanche') {
  const ordenadas = ordenarDividasPorEstrategia(dividas, metodo).map((d) => ({
    id: d.id,
    nome: d.nome,
    saldo: Number(d.valor_total) - Number(d.valor_pago),
    juros: Number(d.taxa_juros_mensal) / 100,
    parcelaMinima: Number(d.valor_parcela) || 0,
  }));

  if (ordenadas.length === 0 || valorMensalDisponivel <= 0) {
    return { meses: 0, totalJurosPago: 0, dataQuitacaoTotal: null, timeline: [] };
  }

  let mes = 0;
  let totalJurosPago = 0;
  const timeline = [];
  const maxMeses = 600; // trava de segurança (50 anos)

  while (ordenadas.some((d) => d.saldo > 0.005) && mes < maxMeses) {
    mes += 1;
    let sobra = valorMensalDisponivel;

    // juros do mês em todas as dívidas ativas
    ordenadas.forEach((d) => {
      if (d.saldo > 0) {
        const juros = d.saldo * d.juros;
        d.saldo += juros;
        totalJurosPago += juros;
      }
    });

    // paga parcela mínima de todas primeiro
    ordenadas.forEach((d) => {
      if (d.saldo > 0) {
        const pago = Math.min(d.parcelaMinima, d.saldo, sobra);
        d.saldo -= pago;
        sobra -= pago;
      }
    });

    // resto vai pra dívida de maior prioridade que ainda tem saldo
    for (const d of ordenadas) {
      if (sobra <= 0) break;
      if (d.saldo > 0) {
        const pago = Math.min(sobra, d.saldo);
        d.saldo -= pago;
        sobra -= pago;
      }
    }

    timeline.push({
      mes,
      saldoRestante: round2(ordenadas.reduce((s, d) => s + Math.max(d.saldo, 0), 0)),
      quitadasNoMes: ordenadas.filter((d) => d.saldo <= 0.005 && !d.__marcada).map((d) => {
        d.__marcada = true;
        return d.nome;
      }),
    });
  }

  const hoje = new Date();
  const dataQuitacaoTotal = new Date(hoje.getFullYear(), hoje.getMonth() + mes, hoje.getDate());

  return {
    meses: mes,
    totalJurosPago: round2(totalJurosPago),
    dataQuitacaoTotal,
    timeline,
  };
}

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}
function round1(n) {
  return Math.round(n * 10) / 10;
}
function round2(n) {
  return Math.round(n * 100) / 100;
}
