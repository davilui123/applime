import { useState, useEffect, useRef, useMemo } from 'react';

// ─── PALETA INTELME ───────────────────────────────────────────────────────────
const C = {
  bg: '#1C2132',
  surface: '#252B3B',
  surface2: '#2E3650',
  border: 'rgba(255,255,255,0.07)',
  green: '#4ADE80',
  greenDim: 'rgba(74,222,128,0.15)',
  amber: '#FBBF24',
  amberDim: 'rgba(251,191,36,0.15)',
  red: '#F87171',
  redDim: 'rgba(248,113,113,0.12)',
  blue: '#60A5FA',
  blueDim: 'rgba(96,165,250,0.12)',
  text: '#F1F5F9',
  muted: '#94A3B8',
  hint: '#475569',
};

const TRACK_COLORS = {
  astrofisica: '#3B82F6',
  mandarin: '#F472B6',
  dev: '#A78BFA',
  geo: '#34D399',
  bb: '#FBBF24',
};

const QUOTES = [
  '"Cada erro é só o rascunho do acerto!"',
  '"Dúvida é o começo de todo aprendizado!"',
  '"Você já sabe mais do que ontem!"',
  '"Consistência: um dia de cada vez."',
  '"Errar aqui é aprender com custo baixo!"',
];

// ─── STREAK: PERSISTÊNCIA E CÁLCULO POR DATA ─────────────────────────────────
// Guardado localmente por enquanto (localStorage). Estrutura pronta pra trocar
// por Supabase depois: é só substituir loadProgress/saveProgress por
// select/upsert numa tabela `intelme_progress` chaveada por usuário.
const STORAGE_KEY = 'intelme_progress_v1';
const MIN_LESSONS_PER_DAY = 2; // mínimo de aulas/dia (qualquer trilha) pra manter o streak geral

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function shiftKey(key, delta) {
  const [y, m, d] = key.split('-').map(Number);
  const dt = new Date(y, m - 1, d + delta);
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
}

// Conta dias consecutivos (terminando hoje ou ontem — dá a "graça" de não
// zerar o streak até o dia realmente virar sem cumprir a meta) dentro de um
// Set de datas ('YYYY-MM-DD') que já bateram o critério.
function computeStreak(metDatesSet) {
  const today = todayKey();
  let cursor = metDatesSet.has(today) ? today : shiftKey(today, -1);
  if (!metDatesSet.has(cursor)) return 0;
  let n = 0;
  while (metDatesSet.has(cursor)) {
    n++;
    cursor = shiftKey(cursor, -1);
  }
  return n;
}

function defaultProgress() {
  return {
    dailyCounts: {}, // '2026-07-01': 3  → nº de aulas concluídas naquele dia (qualquer trilha)
    trackDates: {}, // { astrofisica: { '2026-07-01': true } } → dias em que a trilha foi tocada
    completedModules: ['d1'], // seed compatível com o estado estático original (d1 já estava "completed")
    xp: 340,
  };
}

function loadProgress() {
  if (typeof window === 'undefined') return defaultProgress();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProgress();
    const parsed = JSON.parse(raw);
    return {
      dailyCounts: parsed.dailyCounts || {},
      trackDates: parsed.trackDates || {},
      completedModules: Array.isArray(parsed.completedModules) ? parsed.completedModules : ['d1'],
      xp: typeof parsed.xp === 'number' ? parsed.xp : 340,
    };
  } catch {
    return defaultProgress();
  }
}

function saveProgress(state) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // localStorage indisponível (modo privado, quota etc.) — falha silenciosa, não quebra a UI
  }
}

// ─── STATUS DINÂMICO DOS MÓDULOS ─────────────────────────────────────────────
// Antes o `status` de cada módulo era fixo no array TRACKS e nunca mudava.
// Agora é calculado a partir do progresso real: completo → 'completed',
// primeiro módulo não-completo → 'current' (ou 'coming_soon' se ainda não
// tem conteúdo pronto), o resto → 'locked'. Checkpoints não entram na regra
// de "sem conteúdo = em breve", pra manter o comportamento original deles.
function computeModuleStatus(modules, completedModules) {
  let currentAssigned = false;
  return modules.map((m) => {
    if (completedModules.includes(m.id)) return { ...m, status: 'completed' };
    if (!currentAssigned) {
      currentAssigned = true;
      if ((!m.steps || !m.steps.length) && m.type !== 'checkpoint') {
        return { ...m, status: 'coming_soon' };
      }
      return { ...m, status: 'current' };
    }
    return { ...m, status: 'locked' };
  });
}

// ─── CONTEÚDO DAS TRILHAS ─────────────────────────────────────────────────────
const TRACKS = [
  {
    id: 'astrofisica', title: 'Astrofísica', emoji: '🌌',
    desc: 'Do Big Bang aos Buracos Negros com simulações interativas.',
    level: 'Curioso Cósmico', progress: 28,
    levels: ['Curioso Cósmico', 'Observador Estelar', 'Astrônomo Amador', 'Cosmólogo'],
    modules: [
      {
        id: 'a1', name: 'Mecânica Celeste e Órbitas', type: 'interativo',
        steps: [
          { type: 'concept', title: 'Como uma órbita funciona?', visual: 'orbit',
            text: 'Um planeta orbita o Sol porque a <strong>gravidade</strong> puxa continuamente para o centro, mas o planeta também se move lateralmente. Esses dois efeitos combinados criam uma trajetória elíptica — nunca cai, nunca escapa.' },
          { type: 'mc', q: 'O que acontece se a velocidade orbital de um planeta aumentar demais?',
            opts: ['Ele cai no Sol', 'Ele escapa para o espaço', 'Fica parado', 'Inverte o sentido'],
            correct: 1, explain: 'Com velocidade alta demais a gravidade não segura — o planeta escapa. Esse é o princípio da velocidade de escape (≈11,2 km/s na Terra).' },
          { type: 'fill', q: 'Pela 1ª Lei de Kepler, o Sol ocupa _____ dos focos da elipse, não o centro.',
            blanks: ['um'], words: ['um', 'dois', 'o centro', 'nenhum'],
            explain: 'Kepler descobriu que o Sol fica em um dos dois focos, não no centro geométrico. Por isso a distância Terra-Sol varia ao longo do ano.' },
          { type: 'mc', q: 'Planetas mais próximos do Sol orbitam...',
            opts: ['Mais devagar', 'Na mesma velocidade', 'Mais rápido', 'Em linha reta'],
            correct: 2, explain: 'Pela 2ª Lei de Kepler: mais perto = mais rápido. Mercúrio dá uma volta em 88 dias; Netuno leva 165 anos.' },
        ],
      },
      {
        id: 'a2', name: 'Fusão Estelar', type: 'interativo',
        steps: [
          { type: 'concept', title: 'Como o Sol gera energia?', visual: 'fusion',
            text: 'No núcleo do Sol, a temperatura chega a <strong>15 milhões °C</strong> — o suficiente para vencer a repulsão elétrica entre prótons. Na <strong>cadeia próton-próton</strong>, 4 núcleos de hidrogênio se fundem em etapas até formar 1 núcleo de hélio. A massa final é levemente menor que a soma inicial — essa diferença vira energia pura, seguindo E=mc².' },
          { type: 'mc', q: 'Por que a fusão nuclear libera tanta energia?',
            opts: ['Porque quebra átomos em pedaços menores', 'Porque uma pequena massa é convertida em energia (E=mc²)', 'Porque libera elétrons livres', 'Porque aumenta a temperatura do gás ao redor'],
            correct: 1, explain: 'A massa do núcleo de hélio formado é cerca de 0,7% menor que a soma das massas dos 4 prótons originais. Essa "massa perdida" vira energia — e como c² é gigantesco, mesmo pouca massa gera muita energia.' },
          { type: 'fill', q: 'Na cadeia próton-próton, 4 núcleos de _____ se fundem, ao final do processo, em 1 núcleo de _____.',
            blanks: ['hidrogênio', 'hélio'], words: ['hidrogênio', 'hélio', 'carbono', 'oxigênio', 'nitrogênio'],
            explain: 'É a reação que sustenta estrelas como o Sol por bilhões de anos: hidrogênio (1 próton) vira hélio (2 prótons + 2 nêutrons), liberando energia a cada fusão.' },
          { type: 'mc', q: 'Prótons se repelem eletricamente. O que permite que, mesmo assim, dois prótons se aproximem o suficiente para se fundirem no núcleo solar?',
            opts: ['A gravidade supera a repulsão elétrica', 'O efeito túnel quântico', 'Um campo magnético especial', 'A alta pressão apenas'],
            correct: 1, explain: 'Mesmo na temperatura solar, a energia térmica sozinha não bastaria para vencer a barreira elétrica clássica. É o efeito túnel quântico que permite aos prótons "atravessarem" essa barreira — com probabilidade pequena, mas suficiente dado o número gigantesco de colisões por segundo.' },
        ],
      },
      {
        id: 'a3', name: 'Buracos Negros e Horizonte de Eventos', type: 'interativo',
        steps: [
          { type: 'concept', title: 'O que é o horizonte de eventos?', visual: 'blackhole',
            text: 'O <strong>horizonte de eventos</strong> é a fronteira ao redor de um buraco negro onde a velocidade de escape ultrapassa a velocidade da luz. Dentro dele, absolutamente nada — nem luz — consegue escapar. O tamanho dessa fronteira é o <strong>raio de Schwarzschild</strong>, que depende apenas da massa do buraco negro.' },
          { type: 'mc', q: 'O que determina o tamanho do horizonte de eventos de um buraco negro?',
            opts: ['A cor da luz emitida ao redor', 'A massa do buraco negro', 'A velocidade de rotação apenas', 'A distância até a Terra'],
            correct: 1, explain: 'O raio de Schwarzschild é diretamente proporcional à massa: quanto mais massivo o buraco negro, maior seu horizonte de eventos. Um buraco negro com a massa do Sol teria raio de ~3 km.' },
          { type: 'fill', q: 'Dentro do horizonte de eventos, nem a _____ consegue escapar — porque ali a velocidade de escape ultrapassa o limite máximo do universo, previsto pela teoria da _____.',
            blanks: ['luz', 'relatividade'], words: ['luz', 'relatividade', 'gravidade', 'quântica', 'matéria'],
            explain: 'A relatividade geral de Einstein estabelece a velocidade da luz como limite universal. Como a velocidade de escape dentro do horizonte de eventos supera esse limite, nada consegue sair — nem a luz.' },
          { type: 'mc', q: 'Em 2019, cientistas divulgaram a primeira imagem real de um buraco negro. De qual objeto era essa imagem?',
            opts: ['Sagittarius A*, no centro da Via Láctea', 'M87*, no centro da galáxia M87', 'Cygnus X-1', 'TON 618'],
            correct: 1, explain: 'A imagem histórica de 2019, obtida pelo Event Horizon Telescope, mostrou a sombra do buraco negro supermassivo M87*. Sagittarius A*, o buraco negro da nossa galáxia, só teve sua imagem divulgada em 2022.' },
        ],
      },
      {
        id: 'a4', name: 'Vida e Morte das Estrelas', type: 'interativo',
        steps: [
          { type: 'concept', title: 'Como as estrelas nascem, vivem e morrem?', visual: 'starlife',
            text: 'Toda estrela nasce de uma nuvem de gás que colapsa por gravidade. Na <strong>sequência principal</strong>, ela funde hidrogênio em hélio por milhões a bilhões de anos. O que acontece depois — <strong>gigante vermelha</strong>, <strong>anã branca</strong>, <strong>supernova</strong> ou até <strong>buraco negro</strong> — depende quase inteiramente de uma coisa: a massa inicial da estrela.' },
          { type: 'mc', q: 'Qual fator determina, acima de tudo, o destino final de uma estrela?',
            opts: ['A cor da estrela', 'A distância até outras estrelas', 'A massa inicial da estrela', 'A quantidade de planetas ao redor'],
            correct: 2, explain: 'A massa define a pressão e temperatura no núcleo, o que determina quais reações de fusão são possíveis e como a estrela termina sua vida.' },
          { type: 'fill', q: 'Estrelas com massa parecida com a do Sol terminam como uma _____, após passar por uma fase de _____.',
            blanks: ['anã branca', 'gigante vermelha'], words: ['anã branca', 'gigante vermelha', 'supernova', 'buraco negro', 'estrela de nêutrons'],
            explain: 'O Sol vai inchar e virar uma gigante vermelha em ~5 bilhões de anos, depois ejetar suas camadas externas e deixar um núcleo compacto e quente: uma anã branca do tamanho da Terra.' },
          { type: 'mc', q: 'Estrelas com massa muito maior que a do Sol (acima de ~8 massas solares) tendem a terminar como:',
            opts: ['Anã branca', 'Anã marrom', 'Supernova, deixando estrela de nêutrons ou buraco negro', 'Planeta gasoso'],
            correct: 2, explain: 'Estrelas massivas fundem elementos cada vez mais pesados até o núcleo colapsar catastroficamente — uma explosão de supernova que pode deixar para trás uma estrela de nêutrons ultradensa ou, em casos extremos, um buraco negro.' },
        ],
      },
      {
        id: 'a5', name: 'Ondas Gravitacionais', type: 'interativo',
        steps: [
          { type: 'concept', title: 'O que são ondas gravitacionais?', visual: 'gravwave',
            text: '<strong>Ondas gravitacionais</strong> são ondulações no próprio tecido do espaço-tempo, geradas quando massas muito grandes aceleram — como dois buracos negros orbitando e colidindo. Einstein previu sua existência em 1916, mas achava que seriam fracas demais para detectar. Cem anos depois, em 2015, o detector <strong>LIGO</strong> captou a primeira onda gravitacional direta, vinda da fusão de dois buracos negros a 1,3 bilhão de anos-luz.' },
          { type: 'mc', q: 'O que causa uma onda gravitacional?',
            opts: ['Estrelas brilhando mais forte', 'A aceleração de massas muito grandes, como buracos negros colidindo', 'Explosões de supernova em qualquer direção', 'Radiação eletromagnética intensa'],
            correct: 1, explain: 'Assim como cargas elétricas aceleradas geram ondas eletromagnéticas, massas aceleradas geram ondas gravitacionais — mas só eventos extremos (fusões de buracos negros ou estrelas de nêutrons) produzem ondas fortes o bastante para detectar.' },
          { type: 'fill', q: 'Ondas gravitacionais são ondulações no _____, previstas por Einstein na Teoria da Relatividade _____.',
            blanks: ['espaço-tempo', 'Geral'], words: ['espaço-tempo', 'Geral', 'Restrita', 'quântica', 'universo'],
            explain: 'A Relatividade Geral (1915) descreve a gravidade como curvatura do espaço-tempo. Massas aceleradas fazem essa curvatura "ondular" — são as ondas gravitacionais, confirmadas experimentalmente só em 2015.' },
          { type: 'mc', q: 'O detector LIGO, responsável pela primeira detecção direta de ondas gravitacionais, funciona medindo:',
            opts: ['Variações minúsculas de distância com lasers em túneis a vácuo', 'Emissão de rádio de galáxias distantes', 'Temperatura da radiação cósmica de fundo', 'Brilho de estrelas variáveis'],
            correct: 0, explain: 'O LIGO usa interferômetros a laser: uma onda gravitacional passando pela Terra estica e comprime o espaço por uma fração ínfima — menor que o núcleo de um átomo! É exatamente essa distorção que os lasers detectam.' },
        ],
      },
      { id: 'a6', name: 'Exoplanetas e Zonas Habitáveis', type: 'em-breve', steps: [] },
      { id: 'a7', name: 'A Expansão Acelerada do Universo', type: 'em-breve', steps: [] },
      { id: 'a8', name: 'Matéria Escura e Energia Escura', type: 'em-breve', steps: [] },
      { id: 'a9', name: 'Viagem Interestelar: os Limites da Física', type: 'em-breve', steps: [] },
      { id: 'a10', name: 'Checkpoint: Gravidade Zero', type: 'checkpoint', steps: [] },
    ],
  },
  {
    id: 'mandarin', title: 'Mandarim', emoji: '🏮',
    desc: 'Tons, Pinyin e expressões para sobrevivência e negócios.',
    level: 'Iniciante Zero', progress: 10,
    levels: ['Iniciante Zero', 'Se Vira', 'Iniciante', 'Na Média', 'Fluente Funcional'],
    modules: [
      {
        id: 'm1', name: 'Os 4 Tons do Mandarim', type: 'áudio-quiz',
        steps: [
          { type: 'concept', title: 'Por que os tons mudam tudo?', visual: 'tones',
            text: 'No Mandarim, a mesma sílaba com tons diferentes tem <strong>significados completamente distintos</strong>. Não é entonação de emoção — é parte da própria palavra. Trocar o tom é trocar a palavra inteira.' },
          { type: 'mc', q: 'Qual tom soa como uma pergunta, com a voz subindo do grave ao agudo?',
            opts: ['1º Tom — ā (plano e alto)', '2º Tom — á (subindo)', '3º Tom — ǎ (desce e sobe)', '4º Tom — à (descendo forte)'],
            correct: 1, explain: 'O 2º Tom sobe como "ãh?" de surpresa. Em Pinyin usa acento agudo (´). É o tom de "não" em Mandarim — méi (没).' },
          { type: 'fill', q: '妈 (mā) significa _____. 马 (mǎ) significa _____.', blanks: ['mãe', 'cavalo'],
            words: ['mãe', 'cavalo', 'comprar', 'chá', 'xingar'],
            explain: 'mā (1º tom plano) = mãe. mǎ (3º tom desce-e-sobe) = cavalo. Um tom errado muda completamente a mensagem.' },
        ],
      },
      { id: 'mchk', name: 'Checkpoint: Sobrevivência', type: 'checkpoint', steps: [] },
    ],
  },
  {
    id: 'dev', title: 'Android & iOS', emoji: '📱',
    desc: 'Kotlin, Jetpack Compose, Swift e SwiftUI nativos.',
    level: 'Compilando Ideias', progress: 55,
    levels: ['Compilando Ideias', 'Primeiro Build', 'App Funcional', 'Na Loja', 'Sênior Mobile'],
    modules: [
      { id: 'd1', name: 'Ciclo de Vida da Activity', type: 'quiz', steps: [] },
      {
        id: 'd2', name: 'State Management Nativo', type: 'interativo',
        steps: [
          { type: 'concept', title: 'O que é State e por que importa?', visual: null,
            text: '<strong>State</strong> é qualquer dado que, ao mudar, faz a UI se redesenhar. No Jetpack Compose você declara com <strong>remember { mutableStateOf(...) }</strong>. No SwiftUI usa <strong>@State</strong>. O framework rastreia quem leu esse dado e redesenha só esses componentes.' },
          { type: 'mc', q: 'No Jetpack Compose, qual função garante que o estado sobreviva a recomposições?',
            opts: ['var x = 0', 'remember { mutableStateOf(0) }', 'setState(0)', '@State var x = 0'],
            correct: 1, explain: 'remember guarda o valor entre recomposições. Sem ele, toda vez que a UI redesenha o valor volta ao inicial.' },
          { type: 'mc', q: 'No SwiftUI, qual property wrapper equivale ao remember do Compose?',
            opts: ['@Binding', '@ObservedObject', '@State', '@Published'],
            correct: 2, explain: '@State no SwiftUI e remember no Compose: estado local de uma view/composable. @Binding passa estado de fora.' },
          { type: 'fill', q: 'Para estado que sobrevive à rotação de tela no Compose, use _____ em vez de remember.',
            blanks: ['rememberSaveable'], words: ['rememberSaveable', 'remember', 'mutableStateOf', 'ViewModel', 'LiveData'],
            explain: 'rememberSaveable salva no Bundle — sobrevive a rotação, troca de tema e outros eventos de configuração.' },
        ],
      },
      { id: 'dchk', name: 'Checkpoint: Primeiro App na Loja', type: 'checkpoint', steps: [] },
    ],
  },
  {
    id: 'geo', title: 'Geopolítica Moderna', emoji: '🌍',
    desc: 'Blocos econômicos, conflitos e disputas do século XXI.',
    level: 'Observador Global', progress: 20,
    levels: ['Observador Global', 'Analista', 'Estrategista', 'Especialista'],
    modules: [
      {
        id: 'g1', name: 'A Crise dos Semicondutores', type: 'quiz',
        steps: [
          { type: 'concept', title: 'Por que chips movem o mundo?', visual: null,
            text: 'Semicondutores estão em tudo: celulares, carros, mísseis, tomógrafos. <strong>Taiwan produz ~90% dos chips mais avançados</strong> do planeta pela TSMC. Isso faz de Taiwan o nó geopolítico mais sensível do século XXI.' },
          { type: 'mc', q: 'Qual empresa fabrica a maior parte dos chips avançados do mundo?',
            opts: ['Intel (EUA)', 'Samsung (Coreia do Sul)', 'TSMC (Taiwan)', 'ASML (Holanda)'],
            correct: 2, explain: 'TSMC domina nós avançados (3nm, 2nm). A ASML fabrica as máquinas de litografia EUV que a TSMC usa — outro gargalo crítico.' },
          { type: 'mc', q: 'A estratégia "China +1" significa:',
            opts: ['Incluir um sócio chinês', 'Diversificar produção para fora da China', 'Investir o dobro na China', 'Expandir para Taiwan'],
            correct: 1, explain: 'Após pandemia e tensões EUA-China, empresas passaram a diversificar para Índia, Vietnã ou México — reduzindo concentração de risco.' },
        ],
      },
    ],
  },
  {
    id: 'bb', title: 'Concurso: Banco do Brasil', emoji: '💰',
    desc: 'Foco no edital: SFN, Mercado Financeiro e Vendas.',
    level: 'Futuro Escriturário', progress: 15,
    levels: ['Futuro Escriturário', 'Candidato Preparado', 'Finalista', 'Aprovado BB'],
    modules: [
      {
        id: 'b1', name: 'Sistema Financeiro Nacional', type: 'quiz',
        steps: [
          { type: 'concept', title: 'Como o SFN é organizado?', visual: null,
            text: 'O SFN tem <strong>3 níveis</strong>: (1) <strong>Normativos</strong> — CMN, CNSP, CNPC — fazem as regras. (2) <strong>Supervisores</strong> — Banco Central, CVM, Susep — fiscalizam. (3) <strong>Operadores</strong> — bancos, corretoras, seguradoras — atuam no mercado.' },
          { type: 'mc', q: 'Quem supervisiona os bancos no Brasil?',
            opts: ['CMN — Conselho Monetário Nacional', 'Banco Central do Brasil', 'CVM — Comissão de Valores Mobiliários', 'Susep'],
            correct: 1, explain: 'O Banco Central supervisiona instituições financeiras (bancos). CVM supervisiona mercado de capitais. Susep supervisiona seguros.' },
          { type: 'fill', q: 'O CMN é um órgão _____, não operacional. Quem executa suas políticas é o _____.',
            blanks: ['normativo', 'Banco Central'],
            words: ['normativo', 'operativo', 'Banco Central', 'CVM', 'Susep', 'CMN'],
            explain: 'CMN define as regras (normativo). O Banco Central executa e fiscaliza (supervisor). Essa distinção cai muito nas provas do BB!' },
          { type: 'mc', q: 'O Banco do Brasil é classificado no SFN como:',
            opts: ['Órgão normativo', 'Supervisor do mercado', 'Banco múltiplo operador', 'Autarquia federal'],
            correct: 2, explain: 'O BB opera no nível dos "operadores" como banco múltiplo — mesmo sendo de capital misto com participação do governo federal.' },
        ],
      },
      { id: 'b2', name: 'Garantias do SFN', type: 'quiz', steps: [] },
    ],
  },
];

// ─── ESTILOS INLINE ───────────────────────────────────────────────────────────
const S = {
  wrap: { maxWidth: 420, margin: '0 auto', padding: '0 18px 80px', backgroundColor: C.bg, minHeight: '100vh' },
  topbar: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 0 14px' },
  surface: { background: C.surface, borderRadius: 20, border: `1px solid ${C.border}` },
  surface2: { background: C.surface2 },
  tag: (color) => ({ fontSize: '.65rem', fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color, marginBottom: 10 }),
  pill: (bg, color, border) => ({ display: 'flex', alignItems: 'center', gap: 5, background: bg, border: `1px solid ${border}`, color, padding: '5px 11px', borderRadius: 20, fontSize: '.8rem', fontWeight: 700 }),
};

// ─── ORBIT SIMULATION ────────────────────────────────────────────────────────
function OrbitSim() {
  const p1Ref = useRef(null);
  const p2Ref = useRef(null);
  const rafRef = useRef(null);
  useEffect(() => {
    let a1 = 0, a2 = 0;
    const frame = () => {
      a1 += 0.022; a2 += 0.036;
      if (p1Ref.current) { p1Ref.current.style.top = (75 - Math.sin(a1) * 68) + 'px'; p1Ref.current.style.left = (75 - Math.cos(a1) * 68) + 'px'; }
      if (p2Ref.current) { p2Ref.current.style.top = (75 - Math.sin(a2) * 40) + 'px'; p2Ref.current.style.left = (75 - Math.cos(a2) * 40) + 'px'; }
      rafRef.current = requestAnimationFrame(frame);
    };
    rafRef.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ position: 'relative', width: 160, height: 160, margin: '0 auto' }}>
        {[150, 90].map(sz => (
          <div key={sz} style={{ position: 'absolute', top: '50%', left: '50%', width: sz, height: sz, borderRadius: '50%', border: `1.5px dashed rgba(255,255,255,0.08)`, transform: 'translate(-50%,-50%)' }} />
        ))}
        <div style={{ position: 'absolute', top: '50%', left: '50%', width: 26, height: 26, borderRadius: '50%', background: '#FBBF24', transform: 'translate(-50%,-50%)' }} />
        <div ref={p1Ref} style={{ position: 'absolute', width: 14, height: 14, borderRadius: '50%', background: '#60A5FA' }} />
        <div ref={p2Ref} style={{ position: 'absolute', width: 10, height: 10, borderRadius: '50%', background: '#A78BFA' }} />
      </div>
      <div style={{ fontSize: '.7rem', color: C.hint, marginTop: 8 }}>Planeta interno (azul) orbita mais rápido</div>
    </div>
  );
}

// ─── TONES VISUAL ─────────────────────────────────────────────────────────────
function TonesSim() {
  const tones = [
    { char: '妈', pin: 'mā — 1º tom (plano)', en: 'mãe', col: '#60A5FA' },
    { char: '麻', pin: 'má — 2º tom (sobe)', en: 'cânhamo', col: '#34D399' },
    { char: '马', pin: 'mǎ — 3º tom (desce-sobe)', en: 'cavalo', col: '#FBBF24' },
    { char: '骂', pin: 'mà — 4º tom (desce)', en: 'xingar', col: '#F87171' },
  ];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
      {tones.map(t => (
        <div key={t.char} style={{ background: C.bg, borderRadius: 10, padding: 10, textAlign: 'center', border: `1px solid ${t.col}33` }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: t.col, marginBottom: 2 }}>{t.char}</div>
          <div style={{ fontSize: '.68rem', color: t.col }}>{t.pin}</div>
          <div style={{ fontSize: '.65rem', color: C.hint, marginTop: 2 }}>{t.en}</div>
        </div>
      ))}
    </div>
  );
}

// ─── FUSÃO ESTELAR — SIMULATION ───────────────────────────────────────────────
function FusionSim() {
  const pRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const flashRef = useRef(null);
  const rafRef = useRef(null);
  useEffect(() => {
    let t = 0;
    const CYCLE = 160;
    const positions = [{ x: 20, y: 20 }, { x: 118, y: 20 }, { x: 20, y: 118 }, { x: 118, y: 118 }];
    const frame = () => {
      t = (t + 1) % CYCLE;
      const progress = t / CYCLE;
      const conv = Math.min(progress / 0.7, 1);
      pRefs.forEach((ref, i) => {
        if (!ref.current) return;
        const start = positions[i];
        const cx = 69, cy = 69;
        const x = start.x + (cx - start.x) * conv;
        const y = start.y + (cy - start.y) * conv;
        ref.current.style.left = x + 'px';
        ref.current.style.top = y + 'px';
        ref.current.style.opacity = progress > 0.72 ? Math.max(0, 1 - (progress - 0.72) / 0.1) : 1;
      });
      if (flashRef.current) {
        const flashPhase = progress > 0.7 && progress < 0.95 ? (progress - 0.7) / 0.25 : 0;
        flashRef.current.style.opacity = flashPhase > 0 ? String(Math.sin(flashPhase * Math.PI)) : '0';
        flashRef.current.style.transform = `translate(-50%,-50%) scale(${0.5 + flashPhase * 2})`;
      }
      rafRef.current = requestAnimationFrame(frame);
    };
    rafRef.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ position: 'relative', width: 150, height: 150, margin: '0 auto' }}>
        <div ref={flashRef} style={{ position: 'absolute', top: '50%', left: '50%', width: 44, height: 44, borderRadius: '50%', background: 'radial-gradient(circle, #FBBF24, transparent 70%)', opacity: 0 }} />
        {pRefs.map((ref, i) => (
          <div key={i} ref={ref} style={{ position: 'absolute', width: 12, height: 12, borderRadius: '50%', background: '#F87171', boxShadow: '0 0 8px #F87171' }} />
        ))}
      </div>
      <div style={{ fontSize: '.7rem', color: C.hint, marginTop: 8 }}>4 prótons se fundem → 1 núcleo de hélio + energia</div>
    </div>
  );
}

// ─── BURACO NEGRO — SIMULATION ────────────────────────────────────────────────
function BlackHoleSim() {
  const diskRef = useRef(null);
  const rafRef = useRef(null);
  useEffect(() => {
    let a = 0;
    const frame = () => {
      a += 0.6;
      if (diskRef.current) diskRef.current.style.transform = `translate(-50%,-50%) rotate(${a}deg)`;
      rafRef.current = requestAnimationFrame(frame);
    };
    rafRef.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ position: 'relative', width: 160, height: 160, margin: '0 auto' }}>
        <div ref={diskRef} style={{ position: 'absolute', top: '50%', left: '50%', width: 150, height: 58, borderRadius: '50%', border: '4px solid transparent', borderTopColor: '#FBBF24', borderRightColor: '#F87171', borderBottomColor: 'rgba(255,255,255,0.05)', borderLeftColor: '#60A5FA' }} />
        <div style={{ position: 'absolute', top: '50%', left: '50%', width: 46, height: 46, borderRadius: '50%', background: '#000', transform: 'translate(-50%,-50%)', boxShadow: '0 0 22px 6px rgba(0,0,0,0.9)' }} />
      </div>
      <div style={{ fontSize: '.7rem', color: C.hint, marginTop: 8 }}>Disco de acreção girando ao redor do horizonte de eventos</div>
    </div>
  );
}

// ─── VIDA ESTELAR — SIMULATION ─────────────────────────────────────────────────
function StarLifeSim() {
  const dotRef = useRef(null);
  const labelRef = useRef(null);
  const rafRef = useRef(null);
  const stages = useRef([
    { x: 12, y: 108, label: 'Protoestrela', color: '#F87171', size: 10 },
    { x: 55, y: 55, label: 'Sequência Principal', color: '#FBBF24', size: 14 },
    { x: 102, y: 22, label: 'Gigante Vermelha', color: '#F87171', size: 28 },
    { x: 142, y: 90, label: 'Anã Branca', color: '#60A5FA', size: 8 },
  ]).current;
  useEffect(() => {
    let t = 0;
    const frame = () => {
      t += 0.006;
      const idx = Math.floor(t) % stages.length;
      const nextIdx = (idx + 1) % stages.length;
      const localT = t % 1;
      const a = stages[idx], b = stages[nextIdx];
      const x = a.x + (b.x - a.x) * localT;
      const y = a.y + (b.y - a.y) * localT;
      const size = a.size + (b.size - a.size) * localT;
      if (dotRef.current) {
        dotRef.current.style.left = x + 'px';
        dotRef.current.style.top = y + 'px';
        dotRef.current.style.width = size + 'px';
        dotRef.current.style.height = size + 'px';
        dotRef.current.style.background = localT < 0.5 ? a.color : b.color;
        dotRef.current.style.boxShadow = `0 0 ${size}px ${localT < 0.5 ? a.color : b.color}`;
      }
      if (labelRef.current) labelRef.current.textContent = localT < 0.5 ? a.label : b.label;
      rafRef.current = requestAnimationFrame(frame);
    };
    rafRef.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafRef.current);
  }, [stages]);
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ position: 'relative', width: 160, height: 130, margin: '0 auto', borderLeft: `2px solid ${C.hint}`, borderBottom: `2px solid ${C.hint}` }}>
        <div ref={dotRef} style={{ position: 'absolute', borderRadius: '50%' }} />
      </div>
      <div ref={labelRef} style={{ fontSize: '.72rem', color: C.amber, fontWeight: 700, marginTop: 8 }}>Protoestrela</div>
      <div style={{ fontSize: '.65rem', color: C.hint, marginTop: 2 }}>Ciclo de vida estelar (simplificado)</div>
    </div>
  );
}

// ─── ONDAS GRAVITACIONAIS — SIMULATION ────────────────────────────────────────
function GravWaveSim() {
  const p1Ref = useRef(null);
  const p2Ref = useRef(null);
  const rafRef = useRef(null);
  useEffect(() => {
    let a = 0;
    const frame = () => {
      a += 0.05;
      if (p1Ref.current) { p1Ref.current.style.top = (75 - Math.sin(a) * 22) + 'px'; p1Ref.current.style.left = (75 - Math.cos(a) * 22) + 'px'; }
      if (p2Ref.current) { p2Ref.current.style.top = (75 + Math.sin(a) * 22) + 'px'; p2Ref.current.style.left = (75 + Math.cos(a) * 22) + 'px'; }
      rafRef.current = requestAnimationFrame(frame);
    };
    rafRef.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);
  return (
    <div style={{ textAlign: 'center' }}>
      <style>{`@keyframes gwRipple { 0% { transform: translate(-50%,-50%) scale(0.3); opacity: .55; } 100% { transform: translate(-50%,-50%) scale(2.6); opacity: 0; } }`}</style>
      <div style={{ position: 'relative', width: 150, height: 150, margin: '0 auto', overflow: 'hidden' }}>
        {[0, 0.66, 1.32].map(delay => (
          <div key={delay} style={{ position: 'absolute', top: '50%', left: '50%', width: 60, height: 60, borderRadius: '50%', border: '1.5px solid rgba(96,165,250,0.5)', animation: 'gwRipple 2s linear infinite', animationDelay: `${delay}s` }} />
        ))}
        <div ref={p1Ref} style={{ position: 'absolute', width: 10, height: 10, borderRadius: '50%', background: '#A78BFA' }} />
        <div ref={p2Ref} style={{ position: 'absolute', width: 10, height: 10, borderRadius: '50%', background: '#60A5FA' }} />
      </div>
      <div style={{ fontSize: '.7rem', color: C.hint, marginTop: 8 }}>Binária compacta emitindo ondas gravitacionais</div>
    </div>
  );
}

// ─── PROGRESS SEGMENTS ───────────────────────────────────────────────────────
function LessonProgress({ total, current }) {
  return (
    <div style={{ display: 'flex', gap: 5, flex: 1 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{ flex: 1, height: 7, borderRadius: 4, background: C.surface2, overflow: 'hidden' }}>
          <div style={{ height: '100%', borderRadius: 4, background: C.green, width: i < current ? '100%' : '0%', transition: 'width .35s ease' }} />
        </div>
      ))}
    </div>
  );
}

// ─── FEEDBACK BAR ────────────────────────────────────────────────────────────
function Feedback({ ok, explain }) {
  return (
    <div style={{ borderRadius: 14, padding: '14px 16px', marginBottom: 14, display: 'flex', gap: 12, alignItems: 'flex-start', background: ok ? C.greenDim : C.redDim, border: `1.5px solid ${ok ? 'rgba(74,222,128,.3)' : 'rgba(248,113,113,.25)'}` }}>
      <span style={{ fontSize: '1.4rem' }}>🐕</span>
      <div>
        <div style={{ fontSize: '.88rem', fontWeight: 800, color: ok ? C.green : C.red, marginBottom: 3 }}>{ok ? 'Isso aí!' : 'Quase! Vamos revisar:'}</div>
        <div style={{ fontSize: '.78rem', color: C.muted, lineHeight: 1.45 }}>{explain}</div>
      </div>
    </div>
  );
}

// ─── LESSON ENGINE ────────────────────────────────────────────────────────────
function LessonScreen({ track, module: mod, onBack, onComplete }) {
  const [step, setStep] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [fillAnswers, setFillAnswers] = useState([]);
  const [usedChips, setUsedChips] = useState([]);
  const [lives, setLives] = useState(5);
  const [done, setDone] = useState(false);
  const [xpGained] = useState(mod.steps.length * 20);

  const current = mod.steps[step];
  const col = TRACK_COLORS[track.id] || C.green;
  const shuffledWords = useRef(current?.words ? [...current.words].sort(() => Math.random() - .5) : []);

  useEffect(() => {
    setAnswered(false); setSelected(null); setFeedback(null);
    setFillAnswers(current?.blanks ? current.blanks.map(() => null) : []);
    setUsedChips([]);
    if (current?.words) shuffledWords.current = [...current.words].sort(() => Math.random() - .5);
  }, [step]);

  const handleMC = (i) => {
    if (answered) return;
    const ok = i === current.correct;
    setSelected(i); setAnswered(true);
    setFeedback({ ok, explain: current.explain });
    if (!ok) setLives(l => Math.max(0, l - 1));
  };

  const handlePickWord = (word, chipIdx) => {
    const si = fillAnswers.indexOf(null);
    if (si === -1) return;
    const next = [...fillAnswers]; next[si] = word;
    setFillAnswers(next);
    setUsedChips(u => [...u, chipIdx]);
    if (!next.includes(null)) {
      const ok = next.every((a, i) => a === current.blanks[i]);
      setAnswered(true);
      setFeedback({ ok, explain: current.explain });
      if (!ok) setLives(l => Math.max(0, l - 1));
    }
  };

  const handleClearSlot = (i) => {
    if (!fillAnswers[i]) return;
    const word = fillAnswers[i];
    const next = [...fillAnswers]; next[i] = null;
    setFillAnswers(next);
    const chipIdx = shuffledWords.current.indexOf(word);
    setUsedChips(u => u.filter(c => c !== chipIdx));
    setAnswered(false); setFeedback(null);
  };

  const handleNext = () => {
    if (step + 1 >= mod.steps.length) { setDone(true); onComplete(xpGained, track.id, mod.id); return; }
    setStep(s => s + 1);
  };

  const btnEnabled = answered || current?.type === 'concept';

  if (done) {
    return (
      <div style={{ ...S.wrap, display: 'flex', flexDirection: 'column' }}>
        <div style={{ textAlign: 'center', padding: '30px 10px' }}>
          <span style={{ fontSize: '3.8rem', display: 'block', marginBottom: 14 }}>🏆</span>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: C.text, marginBottom: 6 }}>Lição concluída!</div>
          <div style={{ fontSize: '.85rem', color: C.muted, marginBottom: 22 }}>{mod.name}</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 22 }}>
            {[{ val: `+${xpGained}`, lbl: 'XP conquistados', c: col }, { val: lives, lbl: 'Vidas restantes', c: C.red }].map(s => (
              <div key={s.lbl} style={{ background: C.surface, borderRadius: 14, padding: 14, border: `1px solid ${C.border}` }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: s.c }}>{s.val}</div>
                <div style={{ fontSize: '.68rem', color: C.muted, marginTop: 2, textTransform: 'uppercase', letterSpacing: .5 }}>{s.lbl}</div>
              </div>
            ))}
          </div>
          <button onClick={onBack} style={{ width: '100%', padding: 15, borderRadius: 14, border: 'none', background: C.green, color: '#0d1a0d', fontSize: '.95rem', fontWeight: 800, cursor: 'pointer' }}>
            Voltar às trilhas
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={S.wrap}>
      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 0 14px' }}>
        <button onClick={onBack} style={{ width: 36, height: 36, borderRadius: '50%', border: `1.5px solid ${C.border}`, background: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: C.muted, fontSize: 18, flexShrink: 0 }}>✕</button>
        <LessonProgress total={mod.steps.length} current={step} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '.8rem', fontWeight: 700, color: C.red }}>❤️ {lives}</div>
      </div>

      {/* Card */}
      <div style={{ background: C.surface, borderRadius: 26, padding: '22px 20px', marginBottom: 14, border: `1px solid ${C.border}` }}>
        {current.type === 'concept' && (
          <>
            <div style={S.tag(C.blue)}>Conceito</div>
            <div style={{ fontSize: '1.05rem', fontWeight: 700, color: C.text, lineHeight: 1.45, marginBottom: 16 }}>{current.title}</div>
            <div style={{ fontSize: '.88rem', color: C.muted, lineHeight: 1.7 }} dangerouslySetInnerHTML={{ __html: current.text }} />
            {current.visual && (
              <div style={{ background: C.surface2, borderRadius: 14, padding: 16, marginTop: 14, border: `1px solid ${C.border}` }}>
                <div style={{ fontSize: '.62rem', fontWeight: 700, letterSpacing: .8, color: C.hint, textTransform: 'uppercase', marginBottom: 10 }}>Visual interativo</div>
                {current.visual === 'orbit' && <OrbitSim />}
                {current.visual === 'tones' && <TonesSim />}
                {current.visual === 'fusion' && <FusionSim />}
                {current.visual === 'blackhole' && <BlackHoleSim />}
                {current.visual === 'starlife' && <StarLifeSim />}
                {current.visual === 'gravwave' && <GravWaveSim />}
              </div>
            )}
          </>
        )}

        {current.type === 'mc' && (
          <>
            <div style={S.tag(C.green)}>Múltipla escolha</div>
            <div style={{ fontSize: '1.05rem', fontWeight: 700, color: C.text, lineHeight: 1.45, marginBottom: 16 }}>{current.q}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {current.opts.map((o, i) => {
                let borderColor = C.border, bg = C.surface2, color = C.text;
                if (answered) {
                  if (i === current.correct) { borderColor = C.green; bg = C.greenDim; color = C.green; }
                  else if (i === selected) { borderColor = C.red; bg = C.redDim; color = C.red; }
                }
                return (
                  <button key={i} disabled={answered} onClick={() => handleMC(i)}
                    style={{ padding: '14px 16px', borderRadius: 14, border: `2px solid ${borderColor}`, background: bg, color, fontSize: '.9rem', fontWeight: 600, cursor: answered ? 'default' : 'pointer', textAlign: 'left', lineHeight: 1.3, transition: 'all .15s' }}>
                    {o}
                  </button>
                );
              })}
            </div>
          </>
        )}

        {current.type === 'fill' && (
          <>
            <div style={S.tag(C.amber)}>Preencha a lacuna</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 4, lineHeight: 2.4, fontSize: '.95rem', fontWeight: 600, color: C.text, marginBottom: 14 }}>
              {current.q.split('_____').map((part, i, arr) => (
                <span key={i}>
                  {part}
                  {i < arr.length - 1 && (
                    <span onClick={() => handleClearSlot(i)} style={{ display: 'inline-block', minWidth: 90, borderBottom: `2.5px solid ${fillAnswers[i] ? C.green : C.amber}`, padding: '1px 8px', color: C.green, fontWeight: 700, textAlign: 'center', cursor: 'pointer', background: fillAnswers[i] ? 'rgba(74,222,128,.1)' : 'transparent', marginLeft: 2, marginRight: 2 }}>
                      {fillAnswers[i] || '\u00a0\u00a0\u00a0\u00a0\u00a0'}
                    </span>
                  )}
                </span>
              ))}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
              {shuffledWords.current.map((w, i) => (
                <button key={i} disabled={usedChips.includes(i)} onClick={() => handlePickWord(w, i)}
                  style={{ padding: '8px 14px', borderRadius: 20, background: usedChips.includes(i) ? C.surface2 : C.surface2, border: `1.5px solid ${usedChips.includes(i) ? C.border : C.border}`, fontSize: '.82rem', fontWeight: 600, color: usedChips.includes(i) ? C.hint : C.text, cursor: usedChips.includes(i) ? 'default' : 'pointer', opacity: usedChips.includes(i) ? .3 : 1 }}>
                  {w}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {feedback && <Feedback ok={feedback.ok} explain={feedback.explain} />}

      <button disabled={!btnEnabled} onClick={handleNext}
        style={{ width: '100%', padding: 15, borderRadius: 14, border: 'none', background: btnEnabled ? C.green : C.surface2, color: btnEnabled ? '#0d1a0d' : C.hint, fontSize: '.95rem', fontWeight: 800, cursor: btnEnabled ? 'pointer' : 'not-allowed', transition: 'all .15s' }}>
        {current.type === 'concept' ? 'Entendi, vamos praticar!' : 'Continuar'}
      </button>
    </div>
  );
}

// ─── MODULE TREE ─────────────────────────────────────────────────────────────
function ModuleScreen({ track, completedModules, onBack, onStartLesson }) {
  const col = TRACK_COLORS[track.id] || C.green;
  const offsets = ['translateX(-42px)', 'translateX(42px)', 'translateX(0)', 'translateX(-42px)', 'translateX(42px)'];
  const typeLabel = { quiz: 'Quiz', interativo: 'Interativo', 'áudio-quiz': 'Áudio', checkpoint: 'Checkpoint' };
  const modules = useMemo(() => computeModuleStatus(track.modules, completedModules), [track.modules, completedModules]);

  return (
    <div style={S.wrap}>
      <div style={S.topbar}>
        <button onClick={onBack} style={{ width: 36, height: 36, borderRadius: '50%', border: `1.5px solid ${C.border}`, background: C.surface, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: C.muted, fontSize: 18 }}>←</button>
        <div style={{ fontSize: '.85rem', fontWeight: 700, color: C.muted, letterSpacing: .5, textTransform: 'uppercase' }}>{track.title}</div>
        <div style={{ width: 36 }} />
      </div>

      <div style={{ fontSize: '1.5rem', fontWeight: 800, color: C.text }}>{track.emoji} {track.title}</div>
      <div style={{ fontSize: '.78rem', color: C.muted, marginTop: 3, marginBottom: 16 }}>{track.desc}</div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
        <div style={{ flex: 1, height: 6, background: C.surface2, borderRadius: 3, overflow: 'hidden' }}>
          <div style={{ height: '100%', borderRadius: 3, background: col, width: `${track.progress}%`, transition: 'width .6s' }} />
        </div>
        <div style={{ fontSize: '.72rem', fontWeight: 700, color: col }}>{track.progress}%</div>
      </div>
      <div style={{ fontSize: '.72rem', color: C.muted, marginBottom: 24 }}>🏆 {track.level}</div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {modules.map((m, i) => {
          const isCheckpoint = m.type === 'checkpoint';
          const isComingSoon = m.status === 'coming_soon';
          let icon = isCheckpoint ? '🏆' : m.status === 'completed' ? '✓' : m.status === 'locked' ? '🔒' : isComingSoon ? '🔜' : `${i + 1}`;
          let bg = m.status === 'current' ? col : m.status === 'completed' ? `${col}33` : C.surface2;
          let textCol = m.status === 'current' ? '#0d1a0d' : m.status === 'completed' ? col : C.hint;
          let boxShadow = m.status === 'current' ? `0 0 0 5px ${col}22` : 'none';
          let border = (m.status === 'locked' || isComingSoon) ? `2px ${isComingSoon ? 'dashed' : 'solid'} ${C.border}` : 'none';
          const size = isCheckpoint ? 76 : 68;
          const radius = isCheckpoint ? 22 : '50%';
          const disabled = m.status === 'locked' || isComingSoon;

          return (
            <div key={m.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {i > 0 && <div style={{ width: 2.5, height: 28, background: C.surface2, borderRadius: 2 }} />}
              <div style={{ transform: offsets[i % 2 === 0 ? 0 : 1], display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                <button disabled={disabled} onClick={() => !disabled && onStartLesson(track.id, m.id)}
                  style={{ width: size, height: size, borderRadius: radius, border, background: bg, color: textCol, fontSize: isCheckpoint ? '1.5rem' : '1.3rem', fontWeight: 800, cursor: disabled ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow, transition: 'transform .15s', opacity: isComingSoon ? .6 : 1 }}>
                  {icon}
                </button>
                <div style={{ fontSize: '.72rem', fontWeight: 600, color: C.text, textAlign: 'center', maxWidth: 140, lineHeight: 1.3 }}>{m.name}</div>
                <div style={{ fontSize: '.62rem', color: C.hint, textAlign: 'center' }}>{isComingSoon ? 'Em breve' : (typeLabel[m.type] || '')}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── INTELME MAIN ─────────────────────────────────────────────────────────────
export default function IntelMe({ onBack }) {
  const [view, setView] = useState('home'); // home | module | lesson
  const [activeTrack, setActiveTrack] = useState(null);
  const [activeModule, setActiveModule] = useState(null);
  const [tab, setTab] = useState('trilhas');
  const [quote] = useState(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
  const [progress, setProgress] = useState(loadProgress);

  useEffect(() => { saveProgress(progress); }, [progress]);

  const today = todayKey();
  const todayCount = progress.dailyCounts[today] || 0;

  const generalStreak = useMemo(() => {
    const met = new Set(Object.keys(progress.dailyCounts).filter(d => progress.dailyCounts[d] >= MIN_LESSONS_PER_DAY));
    return computeStreak(met);
  }, [progress.dailyCounts]);

  const trackStreaks = useMemo(() => {
    const out = {};
    TRACKS.forEach(t => {
      const dates = progress.trackDates[t.id] || {};
      out[t.id] = computeStreak(new Set(Object.keys(dates)));
    });
    return out;
  }, [progress.trackDates]);

  const handleStartLesson = (trackId, moduleId) => {
    const track = TRACKS.find(t => t.id === trackId);
    const modules = computeModuleStatus(track.modules, progress.completedModules);
    const mod = modules.find(m => m.id === moduleId);
    if (!mod.steps || !mod.steps.length) { alert('Em breve! Essa fase ainda está sendo preparada.'); return; }
    setActiveTrack(track);
    setActiveModule(mod);
    setView('lesson');
  };

  const handleLessonComplete = (gained, trackId, moduleId) => {
    setProgress(p => {
      const t = todayKey();
      const dailyCounts = { ...p.dailyCounts, [t]: (p.dailyCounts[t] || 0) + 1 };
      const trackDates = { ...p.trackDates, [trackId]: { ...(p.trackDates[trackId] || {}), [t]: true } };
      const completedModules = (moduleId && moduleId !== 'recap' && !p.completedModules.includes(moduleId))
        ? [...p.completedModules, moduleId]
        : p.completedModules;
      return { ...p, dailyCounts, trackDates, completedModules, xp: p.xp + gained };
    });
  };

  const handleRecap = () => {
    const pool = [];
    TRACKS.forEach(t => {
      const modules = computeModuleStatus(t.modules, progress.completedModules);
      modules.forEach(m => {
        if (m.steps && m.steps.length && (m.status === 'completed' || m.status === 'current')) {
          m.steps.filter(s => s.type === 'mc').forEach(s => pool.push({ ...s, _t: t }));
        }
      });
    });
    if (!pool.length) { alert('Complete algumas lições primeiro!'); return; }
    const picked = pool.sort(() => Math.random() - .5).slice(0, 4);
    setActiveTrack(picked[0]._t);
    setActiveModule({ id: 'recap', name: 'Recapitulando', steps: picked });
    setView('lesson');
  };

  if (view === 'lesson' && activeTrack && activeModule) {
    return <LessonScreen track={activeTrack} module={activeModule} onBack={() => setView('module')} onComplete={handleLessonComplete} />;
  }

  if (view === 'module' && activeTrack) {
    return <ModuleScreen track={activeTrack} completedModules={progress.completedModules} onBack={() => setView('home')} onStartLesson={handleStartLesson} />;
  }

  // ── HOME ──
  return (
    <div style={{ ...S.wrap, backgroundColor: C.bg, minHeight: '100vh' }}>
      {/* Topbar */}
      <div style={S.topbar}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: C.greenDim, border: `1.5px solid rgba(74,222,128,.3)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>🐕</div>
          <span style={{ fontSize: '1.05rem', fontWeight: 800, color: C.text }}>IntelMe</span>
        </div>
        {onBack && (
          <button onClick={onBack} style={{ fontSize: '.75rem', color: C.muted, background: 'none', border: `1px solid ${C.border}`, borderRadius: 20, padding: '4px 12px', cursor: 'pointer' }}>← Hub</button>
        )}
        <div style={S.pill(C.amberDim, C.amber, 'rgba(251,191,36,.25)')}>⚡ {progress.xp} XP</div>
      </div>

      {/* Streak bar */}
      <div style={{ ...S.surface, padding: '14px 16px', marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 38, height: 38, borderRadius: '50%', background: C.greenDim, border: `2px solid rgba(74,222,128,.3)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>🐕</div>
          <div style={{ background: C.surface2, borderRadius: 12, padding: '7px 11px', fontSize: '.72rem', color: C.muted, maxWidth: 180, lineHeight: 1.4, border: `1px solid ${C.border}` }}>{quote}</div>
        </div>
        <div style={{ display: 'flex', gap: 18 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: C.amber }}>{generalStreak}</div>
            <div style={{ fontSize: '.65rem', color: C.muted, textTransform: 'uppercase', letterSpacing: .5 }}>Geral</div>
          </div>
          <div style={{ width: 1, height: 32, background: C.border }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: todayCount >= MIN_LESSONS_PER_DAY ? C.green : C.amber }}>
              {todayCount >= MIN_LESSONS_PER_DAY ? '✓' : `${todayCount}/${MIN_LESSONS_PER_DAY}`}
            </div>
            <div style={{ fontSize: '.65rem', color: C.muted, textTransform: 'uppercase', letterSpacing: .5 }}>Hoje</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 3, background: C.surface, borderRadius: 14, padding: 4, marginBottom: 20, border: `1px solid ${C.border}` }}>
        {['trilhas', 'curriculo'].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: '8px 0', borderRadius: 10, border: 'none', background: tab === t ? C.green : 'none', color: tab === t ? '#0f1a0f' : C.hint, fontSize: '.78rem', fontWeight: 700, cursor: 'pointer', transition: 'all .18s' }}>
            {t === 'trilhas' ? 'Trilhas' : 'Currículo'}
          </button>
        ))}
      </div>

      {tab === 'trilhas' && (
        <>
          <button onClick={handleRecap} style={{ width: '100%', padding: 13, borderRadius: 14, border: `1.5px dashed rgba(74,222,128,.35)`, background: C.greenDim, color: C.green, fontWeight: 700, fontSize: '.88rem', cursor: 'pointer', marginBottom: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            ⚡ Recapitulando — revisão rápida
          </button>
          {TRACKS.map(t => {
            const col = TRACK_COLORS[t.id] || C.green;
            return (
              <div key={t.id} onClick={() => { setActiveTrack(t); setView('module'); }} style={{ background: C.surface, borderRadius: 20, padding: 18, marginBottom: 12, border: `1px solid ${C.border}`, cursor: 'pointer' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                    <div style={{ width: 46, height: 46, borderRadius: 14, background: `${col}22`, border: `1.5px solid ${col}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>{t.emoji}</div>
                    <div>
                      <div style={{ fontSize: '1rem', fontWeight: 800, color: C.text }}>{t.title}</div>
                      <div style={{ fontSize: '.7rem', color: C.muted, marginTop: 1, display: 'flex', alignItems: 'center', gap: 4 }}>🏆 {t.level}</div>
                    </div>
                  </div>
                  <div style={S.pill(C.amberDim, C.amber, 'rgba(251,191,36,.2)')}>🔥 {trackStreaks[t.id]}d</div>
                </div>
                <div style={{ fontSize: '.75rem', color: C.muted, lineHeight: 1.5, marginBottom: 12 }}>{t.desc}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ flex: 1, height: 6, background: C.surface2, borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', borderRadius: 3, background: col, width: `${t.progress}%` }} />
                  </div>
                  <div style={{ fontSize: '.7rem', fontWeight: 700, color: col }}>{t.progress}%</div>
                </div>
              </div>
            );
          })}
        </>
      )}

      {tab === 'curriculo' && TRACKS.map(t => {
        const col = TRACK_COLORS[t.id] || C.green;
        const li = t.levels.indexOf(t.level);
        return (
          <div key={t.id} style={{ background: C.surface, borderRadius: 14, padding: '14px 16px', marginBottom: 10, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: `${col}1A`, border: `1.5px solid ${col}2A`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>{t.emoji}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '.9rem', fontWeight: 700, color: C.text }}>{t.title}</div>
              <div style={{ fontSize: '.72rem', color: col, fontWeight: 600, marginTop: 2 }}>{t.level}</div>
              {li < t.levels.length - 1 && <div style={{ fontSize: '.65rem', color: C.hint, marginTop: 1 }}>Próximo: {t.levels[li + 1]}</div>}
            </div>
            <span style={{ fontSize: '.65rem', fontWeight: 700, padding: '3px 8px', borderRadius: 20, background: t.progress > 40 ? C.greenDim : C.blueDim, color: t.progress > 40 ? C.green : C.blue }}>{t.progress > 40 ? 'Dominando' : 'Em curso'}</span>
          </div>
        );
      })}
    </div>
  );
}
