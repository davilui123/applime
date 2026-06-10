export const TRACK_COLORS = {
  astrofisica: '#3B82F6',
  mandarin: '#F472B6',
  dev: '#A78BFA',
  geo: '#34D399',
  bb: '#FBBF24',
};

export const QUOTES = [
  '"Cada erro é só o rascunho do acerto!"',
  '"Dúvida é o começo de todo aprendizado!"',
  '"Você já sabe mais do que ontem!"',
  '"O segredo? Consistência. Um dia de cada vez."',
  '"Errar não é falhar. É aprender com custo baixo!"'
];

export const TRACKS = [
  {
    id: 'astrofisica', title: 'Astrofísica', emoji: '🌌', 
    desc: 'Do Big Bang aos Buracos Negros. Conceitos abstratos com simulações interativas.',
    level: 'Curioso Cósmico', progress: 28, streak: 3,
    levels: ['Curioso Cósmico', 'Observador Estelar', 'Astrônomo Amador', 'Cosmólogo'],
    modules: [
      {
        id: 'ast-1', name: 'Mecânica Celeste e Órbitas', status: 'current', type: 'interactive',
        steps: [
          { type: 'concept', title: 'Como funciona uma órbita?',
            text: 'Um planeta orbita o Sol porque a <strong>gravidade puxa</strong> o planeta para o centro, mas o planeta também se move para o lado. Esses dois efeitos se combinam para criar uma trajetória elíptica.',
            visual: 'orbit' },
          { type: 'mc', q: 'O que acontece se a velocidade orbital de um planeta aumentar muito?',
            opts: ['Ele cai no Sol', 'Ele escapes para o espaço', 'Fica parado no lugar', 'Explode'],
            correct: 1, explain: 'Correto! Com velocidade alta demais, a gravidade não consegue mais segurar o planeta, e ele escapa — esse é o princípio da velocidade de escape.' },
          { type: 'fill', q: 'Complete: Uma órbita elíptica tem dois focos. O Sol fica em _____ dos focos.',
            blanks: ['um'], words: ['um', 'dois', 'nenhum', 'todos'],
            explain: 'Exato! Pela 1ª Lei de Kepler, o Sol ocupa um dos dois focos da elipse.' },
          { type: 'mc', q: 'A Lei de Kepler diz que planetas mais próximos do Sol se movem...',
            opts: ['Mais devagar', 'Na mesma velocidade', 'Mais rápido', 'Em linha reta'],
            correct: 2, explain: 'Certo! Quanto mais perto do Sol, maior a força gravitacional e maior a velocidade orbital — por isso Mercúrio leva só 88 dias para dar uma volta.' },
        ]
      },
      { id: 'ast-2', name: 'Fusão Estelar', status: 'locked', type: 'quiz', steps: [] },
      { id: 'ast-chk', name: 'Checkpoint: Gravidade Zero', status: 'locked', type: 'checkpoint', steps: [] }
    ]
  },
  {
    id: 'mandarin', title: 'Mandarim', emoji: '🏮',
    desc: 'Domine os tons, Pinyin e expressões para sobrevivência e negócios.',
    level: 'Iniciante Zero', progress: 10, streak: 0,
    levels: ['Iniciante Zero', 'Se Vira', 'Iniciante', 'Na Média', 'Fluente Funcional'],
    modules: [
      {
        id: 'man-1', name: 'Os 4 Tons do Mandarim', status: 'current', type: 'audio-quiz',
        steps: [
          { type: 'concept', title: 'Por que os tons importam?',
            text: 'No Mandarim, a mesma sílaba com tons diferentes tem significados <strong>completamente diferentes</strong>. "mā" significa mãe, mas "mǎ" significa cavalo. Trocar o tom é como trocar a palavra inteira.',
            visual: 'tones' },
          { type: 'mc', q: 'Qual tom tem a voz subindo do grave ao agudo (como uma pergunta)?',
            opts: ['1º Tom — ā (plano)', '2º Tom — á (subindo)', '3º Tom — ǎ (desce e sobe)', '4º Tom — à (descendo)'],
            correct: 1, explain: 'Ótimo! O 2º Tom é como quando você diz "ãh?" com a voz subindo. Em Pinyin usa acento agudo (´).' },
          { type: 'fill', q: '妈 (mā) significa _____. 马 (mǎ) significa _____.',
            blanks: ['mãe', 'cavalo'], words: ['mãe', 'cavalo', 'comida', 'chá', 'comprar'],
            explain: 'Perfeito! mā (1º tom, plano) = mãe. mǎ (3º tom, desce-e-sobe) = cavalo.' },
        ]
      },
      { id: 'man-chk', name: 'Checkpoint: Sobrevivência', status: 'locked', type: 'checkpoint', steps: [] }
    ]
  },
  {
    id: 'dev', title: 'Android Studio & Xcode', emoji: '📱',
    desc: 'Kotlin, Jetpack Compose, Swift e SwiftUI. Desenvolvimento nativo moderno.',
    level: 'Compilando Ideias', progress: 55, streak: 5,
    levels: ['Compilando Ideias', 'Primeiro Build', 'App Funcional', 'Na Loja', 'Sênior Mobile'],
    modules: [
      { id: 'dev-1', name: 'Ciclo de Vida da Activity', status: 'completed', type: 'quiz', steps: [] },
      { id: 'dev-2', name: 'State Management Nativo', status: 'current', type: 'interactive',
        steps: [
          { type: 'concept', title: 'O que é State?',
            text: '<strong>State</strong> é qualquer dado que, quando muda, faz a UI se atualizar. No Jetpack Compose, você declara state com <strong>remember { mutableStateOf(...) }</strong>. O Compose "recompõe" só os composables que leram aquele state.',
            visual: null },
          { type: 'mc', q: 'No Jetpack Compose, qual função guarda um estado entre recomposições?',
            opts: ['var x = 0', 'remember { mutableStateOf(0) }', 'setState(0)', '@State var x = 0'],
            correct: 1, explain: 'Correto! remember garante que o valor sobreviva a recomposições. Sem ele, o valor volta ao inicial toda vez que a UI redesenha.' },
          { type: 'mc', q: 'No SwiftUI, qual property wrapper equivale ao remember do Compose?',
            opts: ['@Binding', '@ObservedObject', '@State', '@Published'],
            correct: 2, explain: 'Exato! @State no SwiftUI e remember no Compose servem para o mesmo propósito: estado local de um componente/view.' },
          { type: 'fill', q: 'No Compose, para estado que precisa sobreviver a rotação de tela, use _____ em vez de remember.',
            blanks: ['rememberSaveable'], words: ['rememberSaveable', 'remember', 'mutableStateOf', 'ViewModel'],
            explain: 'Isso mesmo! rememberSaveable salva o estado no Bundle, sobrevivendo a mudanças de configuração como rotação.' },
        ]
      },
      { id: 'dev-chk', name: 'Checkpoint: Primeiro App na Loja', status: 'locked', type: 'checkpoint', steps: [] }
    ]
  },
  {
    id: 'geo', title: 'Geopolítica Moderna', emoji: '🌍',
    desc: 'Blocos econômicos, tratados internacionais e conflitos contemporâneos.',
    level: 'Observador Global', progress: 20, streak: 2,
    levels: ['Observador Global', 'Analista', 'Estrategista', 'Especialista'],
    modules: [
      {
        id: 'geo-1', name: 'A Crise dos Semicondutores', status: 'current', type: 'quiz',
        steps: [
          { type: 'concept', title: 'Por que semicondutores movem o mundo?',
            text: 'Chips semicondutores estão em tudo: celulares, carros, mísseis, geladeiras. Taiwan produz <strong>90% dos chips mais avançados do mundo</strong> pela TSMC. Isso torna Taiwan o centro geopolítico mais tenso do século XXI.',
            visual: null },
          { type: 'mc', q: 'Qual empresa produz a maior parte dos chips avançados do mundo?',
            opts: ['Intel (EUA)', 'Samsung (Coreia)', 'TSMC (Taiwan)', 'ASML (Holanda)'],
            correct: 2, explain: 'Correto! A TSMC domina a fabricação de chips de última generation. A ASML, da Holanda, fabrica as máquinas que a TSMC usa — outro gargalo crítico.' },
          { type: 'mc', q: 'O "China + 1" é uma estratégia que consiste em...',
            opts: ['Adicionar um sócio chinês', 'Diversificar fabricação fora da China', 'Expandir para Taiwan', 'Investir em um segundo parceiro americano'],
            correct: 1, explain: 'Exato! Após a pandemia e as tensões EUA-China, empresas passaram a manter parte da produção na China mas diversificar para Índia, Vietnam ou México — reduzindo risco de concentração.' },
        ]
      }
    ]
  },
  {
    id: 'bb', title: 'Concurso: Banco do Brasil', emoji: '💰',
    desc: 'Foco no edital: Conhecimentos Bancários, Mercado Financeiro e Vendas.',
    level: 'Futuro Escriturário', progress: 15, streak: 1,
    levels: ['Futuro Escriturário', 'Candidato Preparado', 'Finalista', 'Aprovado BB'],
    modules: [
      {
        id: 'bb-1', name: 'Sistema Financeiro Nacional (SFN)', status: 'current', type: 'quiz',
        steps: [
          { type: 'concept', title: 'Como o SFN é organizado?',
            text: 'O SFN tem <strong>3 níveis</strong>: (1) <strong>Órgãos normativos</strong> — CMN, CNSP, CNPC — fazem as regras. (2) <strong>Supervisores</strong> — Banco Central, CVM, Susep — fiscalizam. (3) <strong>Operadores</strong> — bancos, corretoras, seguradoras — operam no mercado.',
            visual: null },
          { type: 'mc', q: 'Quem é responsável por supervisionar os bancos no Brasil?',
            opts: ['CMN — Conselho Monetário Nacional', 'Banco Central do Brasil', 'CVM — Comissão de Valores Mobiliários', 'Susep'],
            correct: 1, explain: 'Certo! O Banco Central (BCB) supervisiona instituições financeiras como bancos. A CVM supervisiona o mercado de capitais. A Susep, seguros.' },
          { type: 'fill', q: 'O CMN é um órgão _____, não operacional. Ele define as regras que o _____ executa.',
            blanks: ['normativo', 'Banco Central'], words: ['normativo', 'operativo', 'Banco Central', 'CVM', 'CMN', 'Susep'],
            explain: 'Perfeito! CMN = normas. Banco Central = execução e fiscalização bancária. Essa distinção cai muito em prova!' },
          { type: 'mc', q: 'O Banco do Brasil é classificado no SFN como um...',
            opts: ['Órgão normativo', 'Supervisor do mercado', 'Banco múltiplo operador', 'Órgão do Governo Federal'],
            correct: 2, explain: 'Correto! O BB é um banco múltiplo — opera no nível dos "operadores" do SFN, mesmo sendo de capital misto.' },
        ]
      },
      { id: 'bb-2', name: 'Garantias do SFN', status: 'locked', type: 'quiz', steps: [] },
    ]
  }
];