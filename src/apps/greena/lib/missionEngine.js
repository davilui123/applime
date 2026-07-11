// missionEngine.js
// XP, níveis e sugestão de missões personalizadas — tudo derivado dos hábitos
// reais do usuário (transações, metas), sem IA, sem custo.

import { gastosPorCategoria } from './financeEngine';

// ---------------------------------------------------------
// XP / NÍVEL — curva progressiva (cada nível pede mais XP que o anterior)
// ---------------------------------------------------------
function xpNecessarioParaNivel(nivel) {
  return 100 + (nivel - 1) * 40;
}

export function infoDeNivel(xpTotal) {
  let nivel = 1;
  let restante = Number(xpTotal) || 0;
  let necessario = xpNecessarioParaNivel(nivel);

  while (restante >= necessario) {
    restante -= necessario;
    nivel += 1;
    necessario = xpNecessarioParaNivel(nivel);
  }

  return {
    nivel,
    xpAtual: Math.round(restante),
    xpNecessario: necessario,
    percentual: Math.min((restante / necessario) * 100, 100),
  };
}

const AVATARES = [
  { ateNivel: 2, emoji: '🌱', nome: 'Broto' },
  { ateNivel: 5, emoji: '🌿', nome: 'Muda' },
  { ateNivel: 9, emoji: '🌳', nome: 'Árvore' },
  { ateNivel: 14, emoji: '🌲', nome: 'Sequoia' },
  { ateNivel: Infinity, emoji: '🏔️', nome: 'Montanha' },
];

export function avatarDoNivel(nivel) {
  return AVATARES.find((a) => nivel <= a.ateNivel) || AVATARES[AVATARES.length - 1];
}

// ---------------------------------------------------------
// SUGESTÃO DE MISSÕES PERSONALIZADAS
// Regras simples sobre dados reais — nada genérico, nada de catálogo fixo.
// ---------------------------------------------------------
function ehFimDeSemanaNoite(transacao) {
  if (!transacao.hora) return false;
  const data = new Date(`${transacao.data}T00:00:00`);
  const diaSemana = data.getDay(); // 0 = domingo, 6 = sábado
  const hora = Number(transacao.hora.split(':')[0]);
  return (diaSemana === 0 || diaSemana === 6) && hora >= 19;
}

export function gerarSugestoesMissoes({ transacoes, categorias, metas, titulosJaAtivos = [] }) {
  const sugestoes = [];
  const despesas = transacoes.filter((t) => t.tipo === 'despesa');

  // 1. Categoria dominante do mês
  const porCategoria = gastosPorCategoria(transacoes, categorias);
  if (porCategoria[0] && porCategoria[0].percentual >= 25) {
    const cat = porCategoria[0].categoria;
    sugestoes.push({
      titulo: `3 dias sem gastar em ${cat.nome}`,
      descricao: `${cat.nome} já é ${Math.round(porCategoria[0].percentual)}% dos seus gastos este mês. Um respiro de 3 dias ajuda a reequilibrar.`,
      tipo: 'habito',
      meta_valor: 3,
      unidade: 'dias',
      xp_recompensa: 30,
      dificuldade: 'media',
      categoria_relacionada: cat.id || null,
    });
  }

  // 2. Gasto noturno de fim de semana (padrão clássico de "gasto por impulso")
  const totalDespesas = despesas.reduce((s, t) => s + Number(t.valor), 0) || 1;
  const gastoFdsNoite = despesas.filter(ehFimDeSemanaNoite).reduce((s, t) => s + Number(t.valor), 0);
  if (gastoFdsNoite / totalDespesas >= 0.15) {
    sugestoes.push({
      titulo: 'Um fim de semana sem gastos após as 19h',
      descricao: 'Seus gastos de sábado e domingo à noite pesam no orçamento. Vamos testar um fim de semana diferente?',
      tipo: 'habito',
      meta_valor: 1,
      unidade: 'vezes',
      xp_recompensa: 40,
      dificuldade: 'dificil',
    });
  }

  // 3. Constância de registro (streak de uso)
  sugestoes.push({
    titulo: 'Registre suas transações por 7 dias seguidos',
    descricao: 'Consistência é a base de qualquer controle financeiro. Abra o Greena e lance seus gastos todo dia por uma semana.',
    tipo: 'streak',
    meta_valor: 7,
    unidade: 'dias',
    xp_recompensa: 50,
    dificuldade: 'media',
  });

  // 4. Aporte pra meta ativa
  const metaAtiva = metas.find((m) => m.status === 'ativa');
  if (metaAtiva) {
    sugestoes.push({
      titulo: `Guarde algo para "${metaAtiva.nome}" essa semana`,
      descricao: 'Qualquer valor conta. O hábito de guardar é mais importante que o tamanho do aporte.',
      tipo: 'economia',
      meta_valor: 1,
      unidade: 'vezes',
      xp_recompensa: 25,
      dificuldade: 'facil',
    });
  }

  return sugestoes.filter((s) => !titulosJaAtivos.includes(s.titulo)).slice(0, 4);
}
