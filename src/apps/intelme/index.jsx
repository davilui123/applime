import { useState, useEffect, useRef } from 'react';
<<<<<<< HEAD
import { ArrowLeft, Flame, Zap, Award, Check, Lock, X, Play, RotateCcw } from 'lucide-react';
// Importando nossa estrutura de dados isolada e as cores
import { TRACKS, TRACK_COLORS, QUOTES } from './tracksData';
import './styles.css'; // Carrega os estilos escuros dedicados

=======

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

// ─── CONTEÚDO DAS TRILHAS ─────────────────────────────────────────────────────
const TRACKS = [
  {
    id: 'astrofisica', title: 'Astrofísica', emoji: '🌌',
    desc: 'Do Big Bang aos Buracos Negros com simulações interativas.',
    level: 'Curioso Cósmico', progress: 28, streak: 3,
    levels: ['Curioso Cósmico', 'Observador Estelar', 'Astrônomo Amador', 'Cosmólogo'],
    modules: [
      {
        id: 'a1', name: 'Mecânica Celeste e Órbitas', status: 'current', type: 'interativo',
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
      { id: 'a2', name: 'Fusão Estelar', status: 'locked', type: 'quiz', steps: [] },
      { id: 'achk', name: 'Checkpoint: Gravidade Zero', status: 'locked', type: 'checkpoint', steps: [] },
    ],
  },
  {
    id: 'mandarin', title: 'Mandarim', emoji: '🏮',
    desc: 'Tons, Pinyin e expressões para sobrevivência e negócios.',
    level: 'Iniciante Zero', progress: 10, streak: 0,
    levels: ['Iniciante Zero', 'Se Vira', 'Iniciante', 'Na Média', 'Fluente Funcional'],
    modules: [
      {
        id: 'm1', name: 'Os 4 Tons do Mandarim', status: 'current', type: 'áudio-quiz',
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
      { id: 'mchk', name: 'Checkpoint: Sobrevivência', status: 'locked', type: 'checkpoint', steps: [] },
    ],
  },
  {
    id: 'dev', title: 'Android & iOS', emoji: '📱',
    desc: 'Kotlin, Jetpack Compose, Swift e SwiftUI nativos.',
    level: 'Compilando Ideias', progress: 55, streak: 5,
    levels: ['Compilando Ideias', 'Primeiro Build', 'App Funcional', 'Na Loja', 'Sênior Mobile'],
    modules: [
      { id: 'd1', name: 'Ciclo de Vida da Activity', status: 'completed', type: 'quiz', steps: [] },
      {
        id: 'd2', name: 'State Management Nativo', status: 'current', type: 'interativo',
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
      { id: 'dchk', name: 'Checkpoint: Primeiro App na Loja', status: 'locked', type: 'checkpoint', steps: [] },
    ],
  },
  {
    id: 'geo', title: 'Geopolítica Moderna', emoji: '🌍',
    desc: 'Blocos econômicos, conflitos e disputas do século XXI.',
    level: 'Observador Global', progress: 20, streak: 2,
    levels: ['Observador Global', 'Analista', 'Estrategista', 'Especialista'],
    modules: [
      {
        id: 'g1', name: 'A Crise dos Semicondutores', status: 'current', type: 'quiz',
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
    level: 'Futuro Escriturário', progress: 15, streak: 1,
    levels: ['Futuro Escriturário', 'Candidato Preparado', 'Finalista', 'Aprovado BB'],
    modules: [
      {
        id: 'b1', name: 'Sistema Financeiro Nacional', status: 'current', type: 'quiz',
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
      { id: 'b2', name: 'Garantias do SFN', status: 'locked', type: 'quiz', steps: [] },
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
    if (step + 1 >= mod.steps.length) { setDone(true); onComplete(xpGained, track.id); return; }
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
function ModuleScreen({ track, onBack, onStartLesson }) {
  const col = TRACK_COLORS[track.id] || C.green;
  const offsets = ['translateX(-42px)', 'translateX(42px)', 'translateX(0)', 'translateX(-42px)', 'translateX(42px)'];
  const typeLabel = { quiz: 'Quiz', interativo: 'Interativo', 'áudio-quiz': 'Áudio', checkpoint: 'Checkpoint' };

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
        {track.modules.map((m, i) => {
          const isCheckpoint = m.type === 'checkpoint';
          let icon = isCheckpoint ? '🏆' : m.status === 'completed' ? '✓' : m.status === 'locked' ? '🔒' : `${i + 1}`;
          let bg = m.status === 'current' ? col : m.status === 'completed' ? `${col}33` : C.surface2;
          let textCol = m.status === 'current' ? '#0d1a0d' : m.status === 'completed' ? col : C.hint;
          let boxShadow = m.status === 'current' ? `0 0 0 5px ${col}22` : 'none';
          let border = m.status === 'locked' ? `2px solid ${C.border}` : 'none';
          const size = isCheckpoint ? 76 : 68;
          const radius = isCheckpoint ? 22 : '50%';

          return (
            <div key={m.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {i > 0 && <div style={{ width: 2.5, height: 28, background: C.surface2, borderRadius: 2 }} />}
              <div style={{ transform: offsets[i % 2 === 0 ? 0 : 1], display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                <button disabled={m.status === 'locked'} onClick={() => m.status !== 'locked' && onStartLesson(track.id, m.id)}
                  style={{ width: size, height: size, borderRadius: radius, border, background: bg, color: textCol, fontSize: isCheckpoint ? '1.5rem' : '1.3rem', fontWeight: 800, cursor: m.status === 'locked' ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow, transition: 'transform .15s' }}>
                  {icon}
                </button>
                <div style={{ fontSize: '.72rem', fontWeight: 600, color: C.text, textAlign: 'center', maxWidth: 140, lineHeight: 1.3 }}>{m.name}</div>
                <div style={{ fontSize: '.62rem', color: C.hint, textAlign: 'center' }}>{typeLabel[m.type] || ''}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── INTELME MAIN ─────────────────────────────────────────────────────────────
>>>>>>> 171790be0b89805a8dff1b56448522f737801a43
export default function IntelMe({ onBack }) {
  const [view, setView] = useState('home'); // home | module | lesson
  const [activeTrack, setActiveTrack] = useState(null);
  const [activeModule, setActiveModule] = useState(null);
<<<<<<< HEAD
  const [currentTab, setCurrentTab] = useState('trilhas'); // trilhas | curriculo
  
  const [quote, setQuote] = useState('');
  const [xp, setXp] = useState(340);
  const [streaks, setStreaks] = useState({
    general: 5,
    tracks: { astrofisica: 3, mandarin: 0, dev: 5, geo: 2, bb: 1 }
  });

  // Escolhe uma frase aleatória do Intel ao montar o componente
  useEffect(() => {
    const randomQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
    setQuote(randomQuote);
  }, [view]); // Atualiza a frase sempre que o usuário volta para a home
=======
  const [tab, setTab] = useState('trilhas');
  const [quote] = useState(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
  const [streaks, setStreaks] = useState({ general: 5, tracks: { astrofisica: 3, mandarin: 0, dev: 5, geo: 2, bb: 1 } });
  const [xp, setXp] = useState(340);
>>>>>>> 171790be0b89805a8dff1b56448522f737801a43

  const handleStartLesson = (trackId, moduleId) => {
    const track = TRACKS.find(t => t.id === trackId);
    const mod = track.modules.find(m => m.id === moduleId);
<<<<<<< HEAD
    
    if (!mod.steps || mod.steps.length === 0) {
      alert('Módulo em desenvolvimento! Conteúdo em breve.');
      return;
    }
    
=======
    if (!mod.steps || !mod.steps.length) { alert('Em breve!'); return; }
>>>>>>> 171790be0b89805a8dff1b56448522f737801a43
    setActiveTrack(track);
    setActiveModule(mod);
    setView('lesson');
  };

<<<<<<< HEAD
  const handleCompleteLesson = (gainedXp, trackId) => {
    setXp(prev => prev + gainedXp);
    setStreaks(prev => {
      const currentTrackStreak = prev.tracks[trackId] || 0;
      const newTrackStreak = currentTrackStreak + 1;
      return {
        general: newTrackStreak > prev.general ? newTrackStreak : prev.general,
        tracks: { ...prev.tracks, [trackId]: newTrackStreak }
      };
    });
  };

  const handleStartRecap = () => {
    const allSteps = [];
    TRACKS.forEach(t => t.modules.forEach(m => {
      if (m.steps && m.steps.length > 0 && m.status !== 'locked') {
        m.steps.filter(s => s.type === 'mc').forEach(s => allSteps.push({ ...s, _track: t }));
      }
    }));

    if (!allSteps.length) {
      alert('Complete as lições iniciais de Astrofísica ou Mandarim primeiro!');
      return;
    }

    const pickedSteps = allSteps.sort(() => Math.random() - 0.5).slice(0, 4);
    setActiveTrack(pickedSteps[0]._track);
    setActiveModule({ id: 'recap', name: 'Recapitulando', steps: pickedSteps });
    setView('lesson');
  };

  // ─── RENDERS DE TELAS DIRETAS ──────────────────────────────────────────────
  if (view === 'lesson' && activeTrack && activeModule) {
    return (
      <LessonScreen 
        track={activeTrack} 
        module={activeModule} 
        onBack={() => setView('module')} 
        onComplete={handleCompleteLesson} 
      />
    );
  }

  if (view === 'module' && activeTrack) {
    return (
      <ModuleScreen 
        track={activeTrack} 
        onBack={() => setView('home')} 
        onStartLesson={handleStartLesson} 
      />
    );
  }

  return (
    <div className="intelme-container">
      <div className="intelme-content">
        
        {/* Topbar do App */}
        <div className="back-bar" style={{ justifyContent: 'space-between', paddingBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }} onClick={onBack}>
            <ArrowLeft size={16} />
            <span>applimestore</span>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <div className="streak-pill">
              <Flame size={14} fill="#FBBF24" />
              <span>{streaks.general}d</span>
            </div>
            <div className="streak-pill" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#60A5FA' }}>
              <Zap size={14} fill="#60A5FA" />
              <span>{xp} XP</span>
            </div>
          </div>
        </div>

        {/* Mascote Banner */}
        <div className="intel-header">
          <div className="intel-mascot">
            <div className="intel-mini">🐕</div>
            <div className="mascot-bubble">{quote}</div>
          </div>
        </div>

        <div>
          <h2 className="intel-title">🧠 IntelMe</h2>
          <p className="intel-sub">Microlições por descoberta e maestria.</p>
        </div>

        {/* Abas Superiores Alternáveis */}
        <div className="intel-tabs">
          <button 
            className={`intel-tab ${currentTab === 'trilhas' ? 'active' : ''}`}
            onClick={() => setCurrentTab('trilhas')}
          >
            Trilhas
          </button>
          <button 
            className={`intel-tab ${currentTab === 'curriculo' ? 'active' : ''}`}
            onClick={() => setCurrentTab('curriculo')}
          >
            Currículo
          </button>
        </div>

        {/* CONTEÚDO DA ABA TRILHAS */}
        {currentTab === 'trilhas' && (
          <div>
            <button className="recap-btn" onClick={handleStartRecap}>
              <RotateCcw size={16} />
              <span>Recapitulando — Revisão rápida</span>
            </button>

            {TRACKS.map(track => {
              const trackColor = TRACK_COLORS[track.id] || '#4ADE80';
              return (
                <div key={track.id} className="track-card" onClick={() => { setActiveTrack(track); setView('module'); }}>
                  <div className="track-header">
                    <div className="track-title-row">
                      <span className="track-emoji">{track.emoji}</span>
                      <span className="track-name">{track.title}</span>
                    </div>
                    <div className="track-streakpill">🔥 {streaks.tracks[track.id]}d</div>
                  </div>
                  <p className="track-desc">{track.desc}</p>
                  <div className="level-badge">
                    <Award size={12} />
                    <span>{track.level}</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${track.progress}%`, background: trackColor }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* CONTEÚDO DA ABA CURRÍCULO */}
        {currentTab === 'curriculo' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {TRACKS.map(track => {
              const lvlIdx = track.levels.indexOf(track.level);
              return (
                <div key={track.id} className="track-card" style={{ display: 'flex', alignItems: 'center', gap: '14px', cursor: 'default' }}>
                  <span style={{ fontSize: '1.6rem' }}>{track.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#F1F5F9' }}>{track.title}</h4>
                    <span style={{ fontSize: '0.75rem', color: TRACK_COLORS[track.id], fontWeight: '600' }}>{track.level}</span>
                    {lvlIdx < track.levels.length - 1 && (
                      <div style={{ fontSize: '0.68rem', color: '#94A3B8', marginTop: '2px' }}>Próximo: {track.levels[lvlIdx + 1]}</div>
                    )}
                  </div>
                  <span style={{ fontSize: '0.68rem', fontWeight: '700', padding: '4px 10px', borderRadius: '12px', backgroundColor: track.progress > 40 ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.05)', color: track.progress > 40 ? '#4ADE80' : '#94A3B8' }}>
                    {track.progress > 40 ? '✓ Dominado' : 'Em curso'}
                  </span>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}

// ─── COMPONENTE SUB-TELA: MAPA DA ÁRVORE DE MÓDULOS ──────────────────────────
function ModuleScreen({ track, onBack, onStartLesson }) {
  const col = TRACK_COLORS[track.id] || '#4ADE80';
  const offsets = ['translateX(-35px)', 'translateX(35px)', 'translateX(0)'];

  return (
    <div className="intelme-container">
      <div className="intelme-content">
        <div className="back-bar" onClick={onBack}>
          <ArrowLeft size={16} />
          <span>{track.title}</span>
        </div>

        <div className="track-card" style={{ cursor: 'default', marginTop: '12px', padding: '20px' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '2rem' }}>{track.emoji}</span>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#F1F5F9' }}>{track.title}</h3>
              <span style={{ fontSize: '0.72rem', color: col, fontWeight: '700' }}>🏆 {track.level}</span>
            </div>
          </div>
          <p className="track-desc" style={{ fontSize: '0.8rem' }}>{track.desc}</p>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${track.progress}%`, background: col }}></div>
          </div>
        </div>

        {/* Árvore de Módulos Estilo Grade / Caminho de Conquistas */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px' }}>
          {track.modules.map((m, i) => {
            const isCheck = m.type === 'checkpoint';
            const off = offsets[i % 3];
            
            let icon = i + 1;
            if (isCheck) icon = <Award size={20} />;
            if (m.status === 'completed') icon = <Check size={20} strokeWidth={3} />;
            if (m.status === 'locked') icon = <Lock size={16} />;

            let btnBg = '#2E3650';
            if (m.status === 'current') btnBg = col;
            if (m.status === 'completed') btnBg = 'rgba(61, 123, 128, 0.25)';
            if (m.status === 'locked') btnBg = '#1C2132';

            return (
              <div key={m.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                {i > 0 && <div style={{ width: '2px', height: '24px', background: 'rgba(255,255,255,0.1)', margin: '4px 0' }} />}
                <div style={{ transform: off, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                  <button 
                    disabled={m.status === 'locked'}
                    onClick={() => onStartLesson(track.id, m.id)}
                    style={{
                      width: '60px', height: '60px', borderRadius: isCheck ? '16px' : '50%',
                      background: btnBg, border: m.status === 'completed' ? `2px solid ${col}` : m.status === 'locked' ? '2px solid rgba(255,255,255,0.05)' : 'none',
                      color: m.status === 'current' ? '#1C2132' : m.status === 'locked' ? '#475569' : '#FFF',
                      fontSize: '1.1rem', fontWeight: '800', cursor: m.status === 'locked' ? 'not-allowed' : 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: m.status === 'current' ? `0 0 0 6px rgba(96, 165, 250, 0.15)` : 'none'
                    }}
                  >
                    {icon}
                  </button>
                  <span style={{ fontSize: '0.72rem', fontWeight: '600', color: '#F1F5F9', textAlign: 'center', maxWidth: '140px', lineHeight: '1.2' }}>{m.name}</span>
=======
  const handleLessonComplete = (gained, trackId) => {
    setXp(x => x + gained);
    setStreaks(s => ({ general: Math.max(s.general, (s.tracks[trackId] || 0) + 1), tracks: { ...s.tracks, [trackId]: (s.tracks[trackId] || 0) + 1 } }));
  };

  const handleRecap = () => {
    const pool = [];
    TRACKS.forEach(t => t.modules.forEach(m => {
      if (m.steps && m.status !== 'locked') m.steps.filter(s => s.type === 'mc').forEach(s => pool.push({ ...s, _t: t }));
    }));
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
    return <ModuleScreen track={activeTrack} onBack={() => setView('home')} onStartLesson={handleStartLesson} />;
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
        <div style={S.pill(C.amberDim, C.amber, 'rgba(251,191,36,.25)')}>⚡ {xp} XP</div>
      </div>

      {/* Streak bar */}
      <div style={{ ...S.surface, padding: '14px 16px', marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 38, height: 38, borderRadius: '50%', background: C.greenDim, border: `2px solid rgba(74,222,128,.3)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>🐕</div>
          <div style={{ background: C.surface2, borderRadius: 12, padding: '7px 11px', fontSize: '.72rem', color: C.muted, maxWidth: 180, lineHeight: 1.4, border: `1px solid ${C.border}` }}>{quote}</div>
        </div>
        <div style={{ display: 'flex', gap: 18 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: C.amber }}>{streaks.general}</div>
            <div style={{ fontSize: '.65rem', color: C.muted, textTransform: 'uppercase', letterSpacing: .5 }}>Geral</div>
          </div>
          <div style={{ width: 1, height: 32, background: C.border }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: C.green }}>✓</div>
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
                  <div style={S.pill(C.amberDim, C.amber, 'rgba(251,191,36,.2)')}>🔥 {streaks.tracks[t.id]}d</div>
                </div>
                <div style={{ fontSize: '.75rem', color: C.muted, lineHeight: 1.5, marginBottom: 12 }}>{t.desc}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ flex: 1, height: 6, background: C.surface2, borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', borderRadius: 3, background: col, width: `${t.progress}%` }} />
                  </div>
                  <div style={{ fontSize: '.7rem', fontWeight: 700, color: col }}>{t.progress}%</div>
>>>>>>> 171790be0b89805a8dff1b56448522f737801a43
                </div>
              </div>
            );
          })}
<<<<<<< HEAD
        </div>

      </div>
    </div>
  );
}

// ─── COMPONENTE SUB-TELA: MOTOR DE LIÇÃO COMPLETO ─────────────────────────────
function LessonScreen({ track, module: mod, onBack, onComplete }) {
  const [step, setStep] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [lives, setLives] = useState(5);
  const [done, setDone] = useState(false);

  // Estados para o preenchimento de lacunas (Word Bank)
  const [fillAnswers, setFillAnswers] = useState([]);
  const [shuffledWords, setShuffledWords] = useState([]);
  const [usedChips, setUsedChips] = useState([]);

  const currentStep = mod.steps[step];
  const trackColor = TRACK_COLORS[track.id] || '#4ADE80';

  useEffect(() => {
    setAnswered(false);
    setSelectedOpt(null);
    setFeedback(null);
    setUsedChips([]);

    if (currentStep?.type === 'fill') {
      setFillAnswers(currentStep.blanks.map(() => null));
      setShuffledWords([...currentStep.words].sort(() => Math.random() - 0.5));
    }
  }, [step, currentStep]);

  const handleAnswerMC = (idx) => {
    if (answered) return;
    setAnswered(true);
    setSelectedOpt(idx);
    const isCorrect = idx === currentStep.correct;
    
    setFeedback({
      ok: isCorrect,
      explain: currentStep.explain
    });
    
    if (!isCorrect) setLives(l => Math.max(0, l - 1));
  };

  const handleSelectChip = (word, chipIdx) => {
    const nextEmptySlot = fillAnswers.indexOf(null);
    if (nextEmptySlot === -1) return;

    const updatedAnswers = [...fillAnswers];
    updatedAnswers[nextEmptySlot] = word;
    setFillAnswers(updatedAnswers);
    setUsedChips([...usedChips, chipIdx]);

    if (!updatedAnswers.includes(null)) {
      setAnswered(true);
      const isCorrect = updatedAnswers.every((ans, i) => ans === currentStep.blanks[i]);
      setFeedback({ ok: isCorrect, explain: currentStep.explain });
      if (!isCorrect) setLives(l => Math.max(0, l - 1));
    }
  };

  const handleClearSlot = (idx) => {
    if (!fillAnswers[idx] || answered) return;
    const removedWord = fillAnswers[idx];
    
    const updatedAnswers = [...fillAnswers];
    updatedAnswers[idx] = null;
    setFillAnswers(updatedAnswers);

    const originalChipIdx = shuffledWords.indexOf(removedWord);
    setUsedChips(usedChips.filter(c => c !== originalChipIdx));
  };

  const handleNextStep = () => {
    if (step + 1 >= mod.steps.length) {
      setDone(true);
      onComplete(20, track.id);
      return;
    }
    setStep(prev => prev + 1);
  };

  if (done) {
    return (
      <div className="intelme-container">
        <div className="intelme-content" style={{ textAlign: 'center', paddingTop: '40px' }}>
          <span style={{ fontSize: '4rem', display: 'block', marginBottom: '10px' }}>🏆</span>
          <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#FFF' }}>Lição Concluída!</h3>
          <p style={{ fontSize: '0.82rem', color: '#94A3B8', marginBottom: '20px' }}>{mod.name}</p>
          
          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
            <div style={{ flex: 1, background: '#252B3B', padding: '14px', borderRadius: '14px' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: '800', color: trackColor }}>+20 XP</div>
              <span style={{ fontSize: '0.65rem', color: '#94A3B8' }}>Recompensa</span>
            </div>
            <div style={{ flex: 1, background: '#252B3B', padding: '14px', borderRadius: '14px' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#F87171' }}>❤️ {lives}</div>
              <span style={{ fontSize: '0.65rem', color: '#94A3B8' }}>Vidas Restantes</span>
            </div>
          </div>

          <button onClick={onBack} className="btn-primary" style={{ background: trackColor, borderRadius: '24px' }}>
            Continuar Jornada
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="intelme-container">
      <div className="intelme-content">
        
        {/* Barra de Progresso em Segmentos */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 0 10px' }}>
          <button onClick={onBack} style={{ border: 'none', background: 'rgba(255,255,255,0.05)', color: '#94A3B8', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={16} /></button>
          <div style={{ display: 'flex', gap: '4px', flex: 1 }}>
            {mod.steps.map((_, i) => (
              <div key={i} style={{ flex: 1, height: '5px', background: '#252B3B', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ height: '100%', background: trackColor, width: i < step ? '100%' : (i === step && answered) ? '100%' : '0%', transition: 'width 0.3s ease' }}></div>
              </div>
            ))}
          </div>
          <div style={{ color: '#F87171', fontSize: '0.85rem', fontWeight: '700' }}>❤️ {lives}</div>
        </div>

        {/* Card do Exercício */}
        <div style={{ background: '#252B3B', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '20px', padding: '22px', margin: '14px 0', minHeight: '220px' }}>
          {currentStep.type === 'concept' && (
            <div>
              <span style={{ fontSize: '0.65rem', color: '#60A5FA', fontWeight: '700', letterSpacing: '0.8px', display: 'block', marginBottom: '6px' }}>DESCOBERTA</span>
              <h4 style={{ fontSize: '1.05rem', fontWeight: '800', marginBottom: '12px' }}>{currentStep.title}</h4>
              <p style={{ fontSize: '0.85rem', color: '#94A3B8', lineHeight: '1.5' }} dangerouslySetInnerHTML={{ __html: currentStep.text }}></p>
              
              {/* Renders de Simulações Embutidas */}
              {currentStep.visual === 'orbit' && <OrbitSimulation />}
              {currentStep.visual === 'tones' && <TonesSimulation />}
            </div>
          )}

          {currentStep.type === 'mc' && (
            <div>
              <span style={{ fontSize: '0.65rem', color: '#4ADE80', fontWeight: '700', letterSpacing: '0.8px', display: 'block', marginBottom: '6px' }}>PRÁTICA IMEDIATA</span>
              <h4 style={{ fontSize: '1.05rem', fontWeight: '800', marginBottom: '16px', lineHeight: '1.4' }}>{currentStep.q}</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
                {currentStep.opts.map((opt, i) => {
                  let btnBorder = '1px solid rgba(255,255,255,0.08)', btnBg = '#1C2132', btnColor = '#F1F5F9';
                  if (answered) {
                    if (i === currentStep.correct) { btnBorder = '1px solid #4ADE80'; btnBg = 'rgba(74,222,128,0.1)'; btnColor = '#4ADE80'; }
                    else if (i === selectedOpt) { btnBorder = '1px solid #F87171'; btnBg = 'rgba(248,113,113,0.08)'; btnColor = '#F87171'; }
                  }
                  return (
                    <button key={i} disabled={answered} onClick={() => handleAnswerMC(i)} style={{ padding: '13px 16px', borderRadius: '12px', border: btnBorder, background: btnBg, color: btnColor, fontSize: '0.85rem', fontWeight: '500', textAlign: 'left', cursor: 'pointer' }}>
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {currentStep.type === 'fill' && (
            <div>
              <span style={{ fontSize: '0.65rem', color: '#FBBF24', fontWeight: '700', letterSpacing: '0.8px', display: 'block', marginBottom: '6px' }}>COMPLEMENTO</span>
              <h4 style={{ fontSize: '0.92rem', fontWeight: '600', lineHeight: '1.9', marginBottom: '14px' }}>
                {currentStep.q.split('_____').map((part, i, arr) => (
                  <span key={i}>
                    {part}
                    {i < arr.length - 1 && (
                      <span onClick={() => handleClearSlot(i)} style={{ display: 'inline-block', minWidth: '75px', borderBottom: `2px solid ${fillAnswers[i] ? '#4ADE80' : '#3B82F6'}`, padding: '0 6px', color: '#4ADE80', fontWeight: '700', textAlign: 'center', cursor: 'pointer', backgroundColor: fillAnswers[i] ? 'rgba(74,222,128,0.08)' : 'transparent' }}>
                        {fillAnswers[i] || '\u00a0\u00a0\u00a0\u00a0\u00a0'}
                      </span>
                    )}
                  </span>
                ))}
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '16px' }}>
                {shuffledWords.map((word, idx) => (
                  <button key={idx} disabled={usedChips.includes(idx) || answered} onClick={() => handleSelectChip(word, idx)} style={{ padding: '7px 14px', borderRadius: '20px', background: '#1C2132', border: '1px solid rgba(255,255,255,0.08)', fontSize: '0.8rem', color: '#F1F5F9', cursor: 'pointer', opacity: usedChips.includes(idx) ? 0.25 : 1, transition: 'opacity 0.15s' }}>
                    {word}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Barra Dinâmica de Feedback da Ofensiva */}
        {feedback && (
          <div style={{ padding: '14px 16px', borderRadius: '14px', marginBottom: '14px', display: 'flex', gap: '12px', background: feedback.ok ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.06)', border: `1px solid ${feedback.ok ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.15)'}` }}>
            <span style={{ fontSize: '1.3rem' }}>🐕</span>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: '800', color: feedback.ok ? '#4ADE80' : '#F87171', marginBottom: '2px' }}>{feedback.ok ? 'Mandou bem!' : 'O Intel revisou a regra:'}</div>
              <p style={{ fontSize: '0.78rem', color: '#94A3B8', margin: 0, lineHeight: '1.4' }}>{feedback.explain}</p>
            </div>
          </div>
        )}

        <button 
          disabled={!answered && currentStep.type !== 'concept'} 
          onClick={handleNextStep} 
          className="btn-primary" 
          style={{ background: (answered || currentStep.type === 'concept') ? trackColor : '#2E3650', color: (answered || currentStep.type === 'concept') ? '#1C2132' : '#475569', borderRadius: '24px', fontWeight: '700' }}
        >
          {currentStep.type === 'concept' ? 'Entendi, vamos praticar!' : 'Continuar'}
        </button>

      </div>
    </div>
  );
}

// ─── SIMULADOR FÍSICO COM TIMING EM REACT (Mecânica Órbita) ──────────────────
function OrbitSimulation() {
  const p1Ref = useRef(null);
  const p2Ref = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    let a1 = 0, a2 = 0;
    const updatePhysics = () => {
      a1 += 0.016;
      a2 += 0.026;
      if (p1Ref.current) { p1Ref.current.style.top = (75 - Math.sin(a1) * 65) + 'px'; p1Ref.current.style.left = (75 - Math.cos(a1) * 65) + 'px'; }
      if (p2Ref.current) { p2Ref.current.style.top = (75 - Math.sin(a2) * 40) + 'px'; p2Ref.current.style.left = (75 - Math.cos(a2) * 40) + 'px'; }
      rafRef.current = requestAnimationFrame(updatePhysics);
    };
    rafRef.current = requestAnimationFrame(updatePhysics);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', marginTop: '12px' }}>
      <div style={{ position: 'relative', width: '160px', height: '160px', background: '#1C2132', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.02)' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', width: '130px', height: '130px', borderRadius: '50%', border: '1.5px dashed rgba(255,255,255,0.08)', transform: 'translate(-50%,-50%)' }} />
        <div style={{ position: 'absolute', top: '50%', left: '50%', width: '80px', height: '80px', borderRadius: '50%', border: '1.5px dashed rgba(255,255,255,0.08)', transform: 'translate(-50%,-50%)' }} />
        <div style={{ position: 'absolute', top: '50%', left: '50%', width: '24px', height: '24px', borderRadius: '50%', background: '#FBBF24', transform: 'translate(-50%,-50%)', boxShadow: '0 0 10px #FBBF24' }} />
        <div ref={p1Ref} style={{ position: 'absolute', width: '12px', height: '12px', borderRadius: '50%', background: '#3B82F6' }} />
        <div ref={p2Ref} style={{ position: 'absolute', width: '9px', height: '9px', borderRadius: '50%', background: '#A78BFA' }} />
      </div>
      <span style={{ fontSize: '0.65rem', color: '#94A3B8' }}>Simulação: planetas internos orbitam mais rápido</span>
    </div>
  );
}

// ─── SIMULADOR INTERATIVO (Mecânica Tons Mandarim) ───────────────────────────
function TonesSimulation() {
  const tones = [
    { char: '妈', pin: 'mā (1º tom plano)', en: 'mãe', c: '#3B82F6' },
    { char: '麻', pin: 'má (2º tom sobe)', en: 'cânhamo', c: '#34D399' },
    { char: '马', pin: 'mǎ (3º tom curva)', en: 'cavalo', c: '#FBBF24' },
    { char: '骂', pin: 'mà (4º tom cai)', en: 'xingar', c: '#F87171' },
  ];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '12px' }}>
      {tones.map(t => (
        <div key={t.char} style={{ background: '#1C2132', borderRadius: '12px', padding: '10px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.04)' }}>
          <div style={{ fontSize: '1.4rem', fontWeight: '800', color: t.c }}>{t.char}</div>
          <div style={{ fontSize: '0.7rem', fontWeight: '600', color: '#F1F5F9' }}>{t.pin}</div>
          <div style={{ fontSize: '0.65rem', color: '#475569', marginTop: '1px' }}>{t.en}</div>
        </div>
      ))}
    </div>
  );
}
=======
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
>>>>>>> 171790be0b89805a8dff1b56448522f737801a43
