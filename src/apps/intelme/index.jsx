import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Flame, Zap, Award, Check, Lock, X, Play, RotateCcw } from 'lucide-react';
// Importando nossa estrutura de dados isolada e as cores
import { TRACKS, TRACK_COLORS, QUOTES } from './tracksData';
import './styles.css'; // Carrega os estilos escuros dedicados

export default function IntelMe({ onBack }) {
  const [view, setView] = useState('home'); // home | module | lesson
  const [activeTrack, setActiveTrack] = useState(null);
  const [activeModule, setActiveModule] = useState(null);
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

  const handleStartLesson = (trackId, moduleId) => {
    const track = TRACKS.find(t => t.id === trackId);
    const mod = track.modules.find(m => m.id === moduleId);
    
    if (!mod.steps || mod.steps.length === 0) {
      alert('Módulo em desenvolvimento! Conteúdo em breve.');
      return;
    }
    
    setActiveTrack(track);
    setActiveModule(mod);
    setView('lesson');
  };

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
                </div>
              </div>
            );
          })}
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