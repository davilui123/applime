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
  '"Bora fechar esse edital!"',
  '"Repetição é a mãe da retenção."'
];

export const TRACKS = [
  {
    id: 'astrofisica', title: 'Astrofísica', emoji: '🌌', 
    desc: 'Do Big Bang aos Buracos Negros. Entenda o cosmos com simulações físicas.',
    level: 'Curioso Cósmico', progress: 12, streak: 3,
    levels: ['Curioso Cósmico', 'Observador Estelar', 'Astrônomo Amador', 'Astrofísico Teórico', 'Cosmólogo'],
    modules: [
      {
        id: 'ast-1', name: 'Mecânica Celeste e Órbitas', status: 'current', type: 'interactive',
        steps: [
          { type: 'concept', title: 'Como funciona uma órbita?', text: 'Um planeta orbita o Sol porque a <strong>gravidade puxa</strong> o planeta para o centro, enquanto sua velocidade o joga para frente. O equilíbrio contínuo cria a órbita.', visual: 'orbit' },
          { type: 'mc', q: 'O que acontece se a velocidade orbital de um planeta aumentar muito?', opts: ['Cai na estrela', 'Escapa da gravidade', 'Para no espaço', 'A órbita inverte'], correct: 1, explain: 'Atingindo a "velocidade de escape", a gravidade da estrela não consegue mais segurar o corpo celeste.' },
          { type: 'fill', q: 'Pela 1ª Lei de Kepler, órbitas são elípticas e o Sol ocupa _____ dos focos.', blanks: ['um'], words: ['um', 'dois', 'nenhum', 'o centro'], explain: 'Exato! O Sol não fica no centro exato, mas em um dos focos da elipse.' }
        ]
      },
      {
        id: 'ast-2', name: 'O Berçário Estelar', status: 'locked', type: 'quiz',
        steps: [
          { type: 'concept', title: 'Nebulosas', text: 'Estrelas nascem em <strong>nebulosas</strong> — gigantescas nuvens de hidrogênio e poeira cósmica que colapsam sob a própria gravidade.', visual: null },
          { type: 'mc', q: 'Qual é o combustível primordial que acende uma estrela recém-nascida?', opts: ['Oxigênio', 'Hélio', 'Hidrogênio', 'Carbono'], correct: 2, explain: 'O Hidrogênio sofre fusão nuclear, transformando-se em Hélio e liberando a luz da estrela.' }
        ]
      },
      { id: 'ast-chk1', name: 'Checkpoint: Gravidade Zero', status: 'locked', type: 'checkpoint', steps: [] },
      { id: 'ast-3', name: 'A Morte das Estrelas', status: 'locked', type: 'quiz', steps: [] },
      { id: 'ast-4', name: 'Anatomia de um Buraco Negro', status: 'locked', type: 'interactive', steps: [] },
      { id: 'ast-5', name: 'O Tecido do Espaço-Tempo', status: 'locked', type: 'quiz', steps: [] },
      { id: 'ast-chk2', name: 'Checkpoint: Horizonte de Eventos', status: 'locked', type: 'checkpoint', steps: [] }
    ]
  },
  {
    id: 'mandarin', title: 'Mandarim', emoji: '🏮',
    desc: 'Domine os tons, Pinyin e construa seu vocabulário de sobrevivência.',
    level: 'Iniciante Zero', progress: 5, streak: 0,
    levels: ['Iniciante Zero', 'Sobrevivente', 'Conversador Básico', 'Intermediário', 'Fluente Funcional'],
    modules: [
      {
        id: 'man-1', name: 'A Engenharia dos Tons', status: 'current', type: 'interactive',
        steps: [
          { type: 'concept', title: 'O idioma musical', text: 'O Mandarim é tonal. A mesma sílaba com tons diferentes altera completamente a palavra. Trocar o tom é o erro mais comum (e perigoso) de iniciantes.', visual: 'tones' },
          { type: 'mc', q: 'Qual tom é pronunciado de forma curta, descendo seco como uma afirmação forte?', opts: ['1º Tom (mā)', '2º Tom (má)', '3º Tom (mǎ)', '4º Tom (mà)'], correct: 3, explain: 'O 4º tom cai rápido e seco, como quando você diz "Não!" em português.' }
        ]
      },
      {
        id: 'man-2', name: 'Cumprimentos de Sobrevivência', status: 'locked', type: 'quiz',
        steps: [
          { type: 'concept', title: 'Olá e Obrigado', text: '你好 (Nǐ hǎo) = Olá. 谢谢 (Xièxie) = Obrigado. Dica: o "x" no pinyin soa como um "sh" sutil.', visual: null },
          { type: 'fill', q: 'Para agradecer alguém na China, você diz _____.', blanks: ['Xièxie'], words: ['Nǐ hǎo', 'Xièxie', 'Zàijiàn', 'Bù'], explain: 'Xièxie (shieh-shieh) é a forma universal de agradecer.' }
        ]
      },
      { id: 'man-chk1', name: 'Checkpoint: Turista', status: 'locked', type: 'checkpoint', steps: [] },
      { id: 'man-3', name: 'Números e Negociações', status: 'locked', type: 'quiz', steps: [] },
      { id: 'man-4', name: 'Pedindo Comida', status: 'locked', type: 'quiz', steps: [] },
      { id: 'man-5', name: 'Direções (Onde fica?)', status: 'locked', type: 'interactive', steps: [] },
      { id: 'man-chk2', name: 'Checkpoint: Expatriado', status: 'locked', type: 'checkpoint', steps: [] }
    ]
  },
  {
    id: 'bb', title: 'Concurso: Banco do Brasil', emoji: '💰',
    desc: 'Edital dissecado: Sistema Financeiro, Produtos, PLD e Vendas.',
    level: 'Futuro Escriturário', progress: 18, streak: 1,
    levels: ['Futuro Escriturário', 'Dominando o Edital', 'Gabaritador de Simulados', 'Aprovado BB'],
    modules: [
      {
        id: 'bb-1', name: 'Estrutura do SFN', status: 'current', type: 'quiz',
        steps: [
          { type: 'concept', title: 'Quem manda e quem obedece?', text: 'O SFN divide-se em <strong>Órgãos Normativos</strong> (CMN - cria a regra) e <strong>Supervisores</strong> (Bacen e CVM - fiscalizam). O Banco do Brasil é um operador.', visual: null },
          { type: 'mc', q: 'Quem é o órgão máximo normativo do Sistema Financeiro Nacional?', opts: ['Banco Central do Brasil', 'Conselho Monetário Nacional (CMN)', 'Ministério da Fazenda', 'CVM'], correct: 1, explain: 'O CMN é o chefe. Ele dita as regras e diretrizes, mas NÃO executa operações.' },
          { type: 'fill', q: 'O _____ emite papel-moeda e executa a política monetária ditada pelo _____.', blanks: ['Bacen', 'CMN'], words: ['Bacen', 'CMN', 'BB', 'CVM', 'Governo'], explain: 'Perfeito. CMN manda (normatiza), Bacen cumpre e fiscaliza.' }
        ]
      },
      {
        id: 'bb-2', name: 'Produtos Bancários I', status: 'locked', type: 'quiz',
        steps: [
          { type: 'concept', title: 'CDB vs RDB', text: 'CDB (Certificado) pode ser transferido antes do vencimento. RDB (Recibo) é intransferível. Ambos são para captar recursos para o banco.', visual: null },
          { type: 'mc', q: 'Qual título de captação bancária é caracterizado pela sua intransferibilidade?', opts: ['CDB', 'LCI', 'RDB', 'Debêntures'], correct: 2, explain: 'RDB (Recibo de Depósito Bancário) não pode ser negociado no mercado secundário.' }
        ]
      },
      { id: 'bb-chk1', name: 'Checkpoint: Mercado Básico', status: 'locked', type: 'checkpoint', steps: [] },
      { id: 'bb-3', name: 'Lavagem de Dinheiro (PLD)', status: 'locked', type: 'quiz', steps: [] },
      { id: 'bb-4', name: 'Código de Defesa do Consumidor', status: 'locked', type: 'quiz', steps: [] },
      { id: 'bb-5', name: 'Garantias Fidejussórias e Reais', status: 'locked', type: 'quiz', steps: [] },
      { id: 'bb-6', name: 'Técnicas de Vendas no Setor Bancário', status: 'locked', type: 'quiz', steps: [] },
      { id: 'bb-chk2', name: 'Checkpoint: Escriturário', status: 'locked', type: 'checkpoint', steps: [] }
    ]
  },
  {
    id: 'dev', title: 'Android Studio & Xcode', emoji: '📱',
    desc: 'Kotlin, Swift, State Management e o ciclo de vida nativo.',
    level: 'Compilando Ideias', progress: 55, streak: 5,
    levels: ['Compilando Ideias', 'Primeiro Build', 'App Funcional', 'Engenheiro Mobile'],
    modules: [
      { id: 'dev-1', name: 'O Ciclo de Vida', status: 'completed', type: 'quiz', steps: [] },
      {
        id: 'dev-2', name: 'State Management (Compose/SwiftUI)', status: 'current', type: 'interactive',
        steps: [
          { type: 'concept', title: 'Reatividade Nativa', text: 'State é a fonte da verdade. Se o dado muda, a UI é recriada. No Compose usamos <strong>remember</strong>, no SwiftUI usamos <strong>@State</strong>.', visual: null },
          { type: 'fill', q: 'No Jetpack Compose, usamos _____ para reter dados e _____ para sobreviver à rotação de tela.', blanks: ['remember', 'rememberSaveable'], words: ['remember', 'rememberSaveable', '@State', 'ViewModel'], explain: 'Isso aí! O rememberSaveable salva o estado no Bundle do Android.' }
        ]
      },
      { id: 'dev-chk1', name: 'Checkpoint: Reatividade', status: 'locked', type: 'checkpoint', steps: [] },
      { id: 'dev-3', name: 'Navegação e Rotas', status: 'locked', type: 'quiz', steps: [] },
      { id: 'dev-4', name: 'Consumo de APIs REST', status: 'locked', type: 'quiz', steps: [] },
      { id: 'dev-5', name: 'Banco de Dados Local (Room/CoreData)', status: 'locked', type: 'quiz', steps: [] },
      { id: 'dev-chk2', name: 'Checkpoint: Fullstack Mobile', status: 'locked', type: 'checkpoint', steps: [] }
    ]
  },
  {
    id: 'geo', title: 'Geopolítica Moderna', emoji: '🌍',
    desc: 'Cadeias de suprimento, conflitos e o novo xadrez global.',
    level: 'Observador Global', progress: 20, streak: 2,
    levels: ['Observador Global', 'Analista', 'Estrategista de Defesa'],
    modules: [
      {
        id: 'geo-1', name: 'O Ouro do Séc XXI: Semicondutores', status: 'completed', type: 'quiz', steps: [] },
      {
        id: 'geo-2', name: 'A Doutrina do Indo-Pacífico', status: 'current', type: 'quiz',
        steps: [
          { type: 'concept', title: 'O Estreito de Malaca', text: 'Cerca de 25% de todo o comércio mundial e grande parte do petróleo da China passa por este estreito. Quem o controla, segura a coleira da economia global.', visual: null },
          { type: 'mc', q: 'Qual aliança militar os EUA formaram para conter o avanço naval no Indo-Pacífico?', opts: ['OTAN', 'AUKUS', 'BRICS', 'Mercosul'], correct: 1, explain: 'AUKUS (Austrália, Reino Unido e EUA) foca em submarinos nucleares no Pacífico.' }
        ]
      },
      { id: 'geo-chk1', name: 'Checkpoint: Hemisfério Leste', status: 'locked', type: 'checkpoint', steps: [] },
      { id: 'geo-3', name: 'Transição Energética e Minerais Críticos', status: 'locked', type: 'quiz', steps: [] },
      { id: 'geo-4', name: 'A Expansão dos BRICS+', status: 'locked', type: 'quiz', steps: [] },
      { id: 'geo-chk2', name: 'Checkpoint: Nova Ordem Multipolar', status: 'locked', type: 'checkpoint', steps: [] }
    ]
  }
];