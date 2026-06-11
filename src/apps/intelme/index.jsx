import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Flame, Zap, Award, Check, Lock, X, Home, Compass, BarChart3, User as UserIcon, BookOpen, Target, Star, Clock } from 'lucide-react';
import { TRACKS, TRACK_COLORS, QUOTES } from './tracksData';
import './styles.css';

export default function IntelMe({ onBack }) {
  const [view, setView] = useState('home'); 
  const [activeTrack, setActiveTrack] = useState(null);
  const [activeModule, setActiveModule] = useState(null);
  const [currentTab, setCurrentTab] = useState('trilhas');
  const [activeNav, setActiveNav] = useState('inicio'); 
  
  const [quote, setQuote] = useState('');
  const [xp, setXp] = useState(340);
  const [streaks, setStreaks] = useState({ general: 5, tracks: { astrofisica: 3, mandarin: 0, bb: 1, dev: 5, geo: 2 } });
  
  // 🧠 ESTADO GLOBAL DAS TRILHAS: Permite progressão real e desbloqueio
  const [tracksState, setTracksState] = useState(TRACKS);

  useEffect(() => {
    setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
  }, [view, activeNav]);

  const handleStartLesson = (trackId, moduleId) => {
    const track = tracksState.find(t => t.id === trackId);
    const mod = track.modules.find(m => m.id === moduleId);
    
    if (!mod.steps || mod.steps.length === 0) {
      alert('Módulo em desenvolvimento estrutural! Em breve.'); return;
    }
    setActiveTrack(track); setActiveModule(mod); setView('lesson');
  };

  const handleCompleteLesson = (gainedXp, trackId, moduleId) => {
    setXp(prev => prev + gainedXp);
    
    setStreaks(prev => {
      const trackCurrent = prev.tracks[trackId] || 0;
      return { general: Math.max(prev.general, trackCurrent + 1), tracks: { ...prev.tracks, [trackId]: trackCurrent + 1 } };
    });

    // 🚀 Lógica de Desbloqueio e Progressão Dinâmica
    setTracksState(prevTracks => prevTracks.map(t => {
      if (t.id === trackId) {
        const newMods = [...t.modules];
        const modIdx = newMods.findIndex(m => m.id === moduleId);
        
        newMods[modIdx] = { ...newMods[modIdx], status: 'completed' };
        
        // Destranca o próximo módulo (se existir e estiver trancado)
        if (newMods[modIdx + 1] && newMods[modIdx + 1].status === 'locked') {
          newMods[modIdx + 1] = { ...newMods[modIdx + 1], status: 'current' };
        }
        
        const completedCount = newMods.filter(m => m.status === 'completed').length;
        const newProgress = Math.round((completedCount / newMods.length) * 100);
        
        const updatedTrack = { ...t, modules: newMods, progress: newProgress };
        if (activeTrack && activeTrack.id === trackId) setActiveTrack(updatedTrack);
        return updatedTrack;
      }
      return t;
    }));
  };

  // ─── ROTAS INTERNAS ──────────────────────────────────────────────
  if (view === 'lesson' && activeTrack && activeModule) {
    return <LessonScreen track={activeTrack} module={activeModule} onBack={() => setView('module')} onComplete={handleCompleteLesson} />;
  }

  if (view === 'module' && activeTrack) {
    return <ModuleScreen track={activeTrack} onBack={() => setView('home')} onStartLesson={handleStartLesson} />;
  }

  return (
    <div className="intelme-container">
      <div className="intelme-content">
        
        {/* TOPBAR */}
        <div className="back-bar" style={{ justifyContent: 'space-between', paddingBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }} onClick={onBack}>
            <ArrowLeft size={16} /><span>applimestore</span>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <div className="streak-pill"><Flame size={14} fill="#FBBF24" /><span>{streaks.general}d</span></div>
            <div className="streak-pill" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#60A5FA' }}><Zap size={14} fill="#60A5FA" /><span>{xp} XP</span></div>
          </div>
        </div>

        {/* 📱 NAVEGAÇÃO CONDICIONAL DO MENU INFERIOR */}
        
        {activeNav === 'inicio' && (
          <div style={{ animation: 'fadeIn 0.2s ease' }}>
            <div className="intel-header">
              <div className="intel-mini">🐕</div>
              <div className="mascot-bubble">{quote}</div>
            </div>
            <div>
              <h2 className="intel-title">🧠 IntelMe</h2>
              <p className="intel-sub">Microlições por descoberta e maestria.</p>
            </div>
            <div className="intel-tabs">
              <button className={`intel-tab ${currentTab === 'trilhas' ? 'active' : ''}`} onClick={() => setCurrentTab('trilhas')}>Trilhas</button>
              <button className={`intel-tab ${currentTab === 'curriculo' ? 'active' : ''}`} onClick={() => setCurrentTab('curriculo')}>Currículo</button>
            </div>

            {currentTab === 'trilhas' && tracksState.map(track => {
              const trackColor = TRACK_COLORS[track.id] || '#4ADE80';
              return (
                <div key={track.id} className={`track-card ${track.id}`} onClick={() => { setActiveTrack(track); setView('module'); }}>
                  <div className="track-header">
                    <div className="track-title-row"><span className="track-emoji">{track.emoji}</span><span className="track-name">{track.title}</span></div>
                    <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#FBBF24' }}>🔥 {streaks.tracks[track.id] || 0}d</div>
                  </div>
                  <p className="track-desc">{track.desc}</p>
                  <div className="level-badge"><Award size={12} /><span>{track.level}</span></div>
                  <div className="progress-bar" style={{ backgroundColor: '#151A26', marginTop: '14px' }}>
                    <div className="progress-fill" style={{ width: `${track.progress}%`, background: trackColor }}></div>
                  </div>
                  <div className="progress-info-row"><span>{track.progress}% concluído</span></div>
                </div>
              );
            })}

            {currentTab === 'curriculo' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {tracksState.map(track => (
                  <div key={track.id} className={`track-card ${track.id}`} style={{ display: 'flex', alignItems: 'center', gap: '14px', cursor: 'default' }}>
                    <span style={{ fontSize: '1.8rem' }}>{track.emoji}</span>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#FFF' }}>{track.title}</h4>
                      <span style={{ fontSize: '0.75rem', color: TRACK_COLORS[track.id], fontWeight: '700' }}>{track.level}</span>
                    </div>
                    <span style={{ fontSize: '0.7rem', fontWeight: '700', padding: '4px 10px', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.04)', color: '#64748B' }}>Em curso</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeNav === 'trilhas' && (
           <div style={{ paddingTop: '40px', textAlign: 'center', animation: 'fadeIn 0.2s ease' }}>
             <Compass size={56} color="#0D685E" style={{ margin: '0 auto 16px' }} />
             <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#FFF' }}>Explorar Trilhas</h3>
             <p style={{ fontSize: '0.88rem', color: '#64748B', marginTop: '8px', lineHeight: '1.5' }}>Selecione um curso na tela de Início para visualizar a árvore de módulos e conquistas.</p>
             <button onClick={() => setActiveNav('inicio')} style={{ marginTop: '24px', padding: '14px 28px', borderRadius: '24px', background: '#0D685E', color: '#FFF', border: 'none', fontWeight: '800', cursor: 'pointer' }}>Voltar ao Início</button>
           </div>
        )}

        {activeNav === 'progresso' && (
          <div style={{ paddingTop: '20px', animation: 'fadeIn 0.2s ease' }}>
            <h2 className="intel-title" style={{ marginBottom: '20px' }}>Seu Progresso</h2>
            <div className="stats-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="stat-box" style={{ flexDirection: 'column', alignItems: 'flex-start', padding: '20px' }}>
                <Flame size={28} color="#FBBF24" style={{ marginBottom: '8px' }} />
                <span className="stat-val" style={{ fontSize: '1.8rem' }}>{streaks.general}</span>
                <span className="stat-lbl">Dias de Ofensiva</span>
              </div>
              <div className="stat-box" style={{ flexDirection: 'column', alignItems: 'flex-start', padding: '20px' }}>
                <Zap size={28} color="#60A5FA" style={{ marginBottom: '8px' }} />
                <span className="stat-val" style={{ fontSize: '1.8rem' }}>{xp}</span>
                <span className="stat-lbl">XP Total Adquirido</span>
              </div>
            </div>
          </div>
        )}

        {activeNav === 'perfil' && (
          <div style={{ paddingTop: '20px', animation: 'fadeIn 0.2s ease' }}>
            <h2 className="intel-title" style={{ marginBottom: '20px' }}>Sua Conta</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', background: '#151A26', padding: '24px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#0D685E', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: '900', color: '#FFF' }}>DS</div>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#FFF' }}>David Luiz da Silva</h3>
                <p style={{ fontSize: '0.8rem', color: '#94A3B8' }}>david.silva02@cps.sp.gov.br</p>
                <div style={{ marginTop: '10px', display: 'inline-block', padding: '6px 12px', background: 'rgba(59, 130, 246, 0.1)', color: '#60A5FA', borderRadius: '12px', fontSize: '0.72rem', fontWeight: '800' }}>Agente Técnico Administrativo</div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* NAVBAR INFERIOR (COMPLETAMENTE FUNCIONAL) */}
      <div className="bottom-nav">
        <button className={`nav-item ${activeNav === 'inicio' ? 'active' : ''}`} onClick={() => { setActiveNav('inicio'); setView('home'); }}><Home size={22} strokeWidth={activeNav === 'inicio' ? 2.5 : 2} /><span>Início</span></button>
        <button className={`nav-item ${activeNav === 'trilhas' ? 'active' : ''}`} onClick={() => setActiveNav('trilhas')}><Compass size={22} strokeWidth={activeNav === 'trilhas' ? 2.5 : 2} /><span>Trilhas</span></button>
        <button className={`nav-item ${activeNav === 'progresso' ? 'active' : ''}`} onClick={() => setActiveNav('progresso')}><BarChart3 size={22} strokeWidth={activeNav === 'progresso' ? 2.5 : 2} /><span>Progresso</span></button>
        <button className={`nav-item ${activeNav === 'perfil' ? 'active' : ''}`} onClick={() => setActiveNav('perfil')}><UserIcon size={22} strokeWidth={activeNav === 'perfil' ? 2.5 : 2} /><span>Perfil</span></button>
      </div>
    </div>
  );
}

// ─── COMPONENTE: MAPA DA ÁRVORE DE MÓDULOS EXPANDIDA ──────────────────────────
function ModuleScreen({ track, onBack, onStartLesson }) {
  const col = TRACK_COLORS[track.id] || '#4ADE80';
  const offsets = ['0px', '-45px', '45px', '0px', '-45px', '45px'];

  return (
    <div className="intelme-container">
      <div className="intelme-content">
        <div className="back-bar" onClick={onBack}><ArrowLeft size={16} /><span>{track.title}</span></div>

        {/* Card do Cabeçalho - Mantém as imagens via ID */}
        <div className={`track-card ${track.id}`} style={{ cursor: 'default', marginTop: '12px' }}>
          <div style={{ display: 'flex', gap: '14px', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '2.4rem' }}>{track.emoji}</span>
            <div><h3 style={{ fontSize: '1.4rem', fontWeight: '900', color: '#FFFFFF', letterSpacing: '-0.5px' }}>{track.title}</h3><span style={{ fontSize: '0.8rem', color: col, fontWeight: '800' }}>🏆 {track.level}</span></div>
          </div>
          <p className="track-desc" style={{ fontSize: '0.85rem' }}>{track.desc}</p>
          <div className="progress-bar" style={{ backgroundColor: '#151A26', height: '6px' }}>
            <div className="progress-fill" style={{ width: `${track.progress}%`, background: col }}></div>
          </div>
        </div>

        {/* Grid de Stats estilo Duolingo Premium */}
        <div className="stats-grid">
          <div className="stat-box"><div className="stat-icon-wrapper" style={{ background: 'rgba(16,185,129,0.12)', color: '#10B981' }}><BookOpen size={16} /></div><div className="stat-info"><span className="stat-val">{track.modules.length}</span><span className="stat-lbl">Módulos</span></div></div>
          <div className="stat-box"><div className="stat-icon-wrapper" style={{ background: 'rgba(139,92,246,0.12)', color: '#8B5CF6' }}><Target size={16} /></div><div className="stat-info"><span className="stat-val">{track.progress}%</span><span className="stat-lbl">Concluído</span></div></div>
          <div className="stat-box"><div className="stat-icon-wrapper" style={{ background: 'rgba(245,158,11,0.12)', color: '#F59E0B' }}><Star size={16} /></div><div className="stat-info"><span className="stat-val">{track.modules.filter(m => m.status === 'completed').length}</span><span className="stat-lbl">Dominados</span></div></div>
        </div>

        {/* 🌳 Árvore Vertical Pontilhada Dinâmica */}
        <div className="tree-container">
          <div className="tree-line"></div>
          {track.modules.map((m, i) => {
            const isCheck = m.type === 'checkpoint';
            const horizontalShift = offsets[i % offsets.length];
            
            let icon = i + 1;
            if (isCheck) icon = <Award size={22} />;
            if (m.status === 'completed') icon = <Check size={22} strokeWidth={3} />;
            if (m.status === 'locked') icon = <Lock size={18} />;
            
            let nodeBg = '#1E2538';
            if (m.status === 'current') nodeBg = col; 
            if (m.status === 'completed') nodeBg = 'rgba(13, 104, 94, 0.2)';

            return (
              <div key={m.id} className="tree-node" style={{ transform: `translateX(${horizontalShift})` }}>
                <button 
                  disabled={m.status === 'locked'} 
                  onClick={() => onStartLesson(track.id, m.id)}
                  style={{
                    width: isCheck ? '70px' : '64px', height: isCheck ? '70px' : '64px', 
                    borderRadius: isCheck ? '18px' : '50%',
                    background: nodeBg, 
                    border: m.status === 'completed' ? `2px solid ${col}` : m.status === 'current' ? '3px solid #FFF' : '2px solid rgba(255,255,255,0.05)',
                    color: m.status === 'locked' ? '#475569' : '#FFF', 
                    fontSize: '1.2rem', fontWeight: '900', 
                    cursor: m.status === 'locked' ? 'not-allowed' : 'pointer',
                    boxShadow: m.status === 'current' ? `0 0 24px ${col}` : 'none', 
                    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}
                >{icon}</button>
                <span style={{ fontSize: '0.8rem', fontWeight: '700', color: m.status === 'locked' ? '#475569' : '#F1F5F9', marginTop: '8px', textAlign: 'center', maxWidth: '140px', lineHeight: '1.3' }}>{m.name}</span>
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
  
  const [fillAnswers, setFillAnswers] = useState([]);
  const [shuffledWords, setShuffledWords] = useState([]);
  const [usedChips, setUsedChips] = useState([]);

  const currentStep = mod.steps[step];
  const trackColor = TRACK_COLORS[track.id] || '#4ADE80';

  useEffect(() => {
    setAnswered(false); setSelectedOpt(null); setFeedback(null); setUsedChips([]);
    if (currentStep?.type === 'fill') {
      setFillAnswers(currentStep.blanks.map(() => null));
      setShuffledWords([...currentStep.words].sort(() => Math.random() - 0.5));
    }
  }, [step, currentStep]);

  const handleAnswerMC = (idx) => {
    if (answered) return;
    setAnswered(true); setSelectedOpt(idx);
    const isCorrect = idx === currentStep.correct;
    setFeedback({ ok: isCorrect, explain: currentStep.explain });
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
      // 🔥 O pulo do gato: envia o ID do módulo atual para a função mãe destrancar o próximo
      onComplete(20, track.id, mod.id);
      return;
    }
    setStep(prev => prev + 1);
  };

  if (done || lives <= 0) {
    return (
      <div className="intelme-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="intelme-content" style={{ textAlign: 'center', width: '100%' }}>
          <span style={{ fontSize: '5rem', display: 'block', marginBottom: '16px' }}>{lives > 0 ? '🏆' : '💀'}</span>
          <h3 style={{ fontSize: '1.8rem', fontWeight: '900', color: '#FFF' }}>{lives > 0 ? 'Lição Concluída!' : 'Fim de Jogo!'}</h3>
          <p style={{ fontSize: '0.95rem', color: '#94A3B8', marginBottom: '32px' }}>{mod.name}</p>
          <button onClick={onBack} className="btn-primary" style={{ background: trackColor, color: '#0B0E17', padding: '16px 40px', borderRadius: '30px', fontWeight: '900', fontSize: '1.1rem', border: 'none', cursor: 'pointer', boxShadow: `0 8px 24px rgba(0,0,0,0.3)` }}>Voltar ao Mapa</button>
        </div>
      </div>
    );
  }

  return (
    <div className="intelme-container">
      <div className="intelme-content">
        
        {/* Progress Bar do Exercício */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '16px 0 10px' }}>
          <button onClick={onBack} style={{ border: 'none', background: 'rgba(255,255,255,0.05)', color: '#94A3B8', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={18} /></button>
          <div style={{ display: 'flex', gap: '6px', flex: 1 }}>
            {mod.steps.map((_, i) => (
              <div key={i} style={{ flex: 1, height: '8px', background: '#151A26', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ height: '100%', background: trackColor, width: i < step ? '100%' : (i === step && answered) ? '100%' : '0%', transition: 'width 0.4s ease' }}></div>
              </div>
            ))}
          </div>
          <div style={{ color: '#F87171', fontSize: '0.9rem', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '4px' }}><Flame size={18} fill="#F87171" />{lives}</div>
        </div>

        <div style={{ background: '#151A26', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '24px', padding: '28px', margin: '16px 0', minHeight: '280px' }}>
          {currentStep.type === 'concept' && (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              <span style={{ fontSize: '0.7rem', color: '#60A5FA', fontWeight: '900', letterSpacing: '1px', display: 'block', marginBottom: '10px' }}>DESCOBERTA</span>
              <h4 style={{ fontSize: '1.3rem', fontWeight: '900', marginBottom: '14px', color: '#FFF', lineHeight: '1.3' }}>{currentStep.title}</h4>
              <p style={{ fontSize: '0.95rem', color: '#94A3B8', lineHeight: '1.6' }} dangerouslySetInnerHTML={{ __html: currentStep.text }}></p>
              {currentStep.visual === 'orbit' && <OrbitSimulation />}
              {currentStep.visual === 'tones' && <TonesSimulation />}
            </div>
          )}

          {currentStep.type === 'mc' && (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              <span style={{ fontSize: '0.7rem', color: '#4ADE80', fontWeight: '900', letterSpacing: '1px', display: 'block', marginBottom: '10px' }}>PRÁTICA IMEDIATA</span>
              <h4 style={{ fontSize: '1.15rem', fontWeight: '900', marginBottom: '20px', lineHeight: '1.4', color: '#FFF' }}>{currentStep.q}</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {currentStep.opts.map((opt, i) => {
                  let btnBorder = '2px solid rgba(255,255,255,0.05)', btnBg = '#0B0E17', btnColor = '#F1F5F9';
                  if (answered) {
                    if (i === currentStep.correct) { btnBorder = '2px solid #4ADE80'; btnBg = 'rgba(74,222,128,0.1)'; btnColor = '#4ADE80'; }
                    else if (i === selectedOpt) { btnBorder = '2px solid #F87171'; btnBg = 'rgba(248,113,113,0.08)'; btnColor = '#F87171'; }
                  }
                  return (
                    <button key={i} disabled={answered} onClick={() => handleAnswerMC(i)} style={{ padding: '18px 20px', borderRadius: '16px', border: btnBorder, background: btnBg, color: btnColor, fontSize: '0.95rem', fontWeight: '700', textAlign: 'left', cursor: answered ? 'default' : 'pointer', transition: 'all 0.2s' }}>{opt}</button>
                  );
                })}
              </div>
            </div>
          )}

          {currentStep.type === 'fill' && (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              <span style={{ fontSize: '0.7rem', color: '#FBBF24', fontWeight: '900', letterSpacing: '1px', display: 'block', marginBottom: '10px' }}>COMPLEMENTO</span>
              <h4 style={{ fontSize: '1.1rem', fontWeight: '700', lineHeight: '2.2', marginBottom: '24px', color: '#FFF' }}>
                {currentStep.q.split('_____').map((part, i, arr) => (
                  <span key={i}>
                    {part}
                    {i < arr.length - 1 && (
                      <span onClick={() => handleClearSlot(i)} style={{ display: 'inline-block', minWidth: '90px', borderBottom: `3px solid ${fillAnswers[i] ? '#4ADE80' : '#3B82F6'}`, padding: '0 10px', color: '#4ADE80', fontWeight: '900', textAlign: 'center', cursor: 'pointer', backgroundColor: fillAnswers[i] ? 'rgba(74,222,128,0.1)' : 'transparent', borderRadius: '4px 4px 0 0' }}>
                        {fillAnswers[i] || '\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0'}
                      </span>
                    )}
                  </span>
                ))}
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                {shuffledWords.map((word, idx) => (
                  <button key={idx} disabled={usedChips.includes(idx) || answered} onClick={() => handleSelectChip(word, idx)} style={{ padding: '12px 20px', borderRadius: '24px', background: '#0B0E17', border: '2px solid rgba(255,255,255,0.08)', fontSize: '0.9rem', fontWeight: '800', color: '#F1F5F9', cursor: 'pointer', opacity: usedChips.includes(idx) ? 0.2 : 1, transition: 'all 0.2s', boxShadow: usedChips.includes(idx) ? 'none' : '0 4px 12px rgba(0,0,0,0.2)' }}>{word}</button>
                ))}
              </div>
            </div>
          )}
        </div>

        {feedback && (
          <div style={{ padding: '18px', borderRadius: '18px', marginBottom: '18px', display: 'flex', gap: '14px', background: feedback.ok ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.08)', border: `2px solid ${feedback.ok ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.2)'}`, animation: 'fadeIn 0.3s ease' }}>
            <span style={{ fontSize: '1.6rem' }}>🐕</span>
            <div>
              <div style={{ fontSize: '0.95rem', fontWeight: '900', color: feedback.ok ? '#4ADE80' : '#F87171', marginBottom: '6px' }}>{feedback.ok ? 'Mandou bem!' : 'O Intel revisou a regra:'}</div>
              <p style={{ fontSize: '0.85rem', color: '#94A3B8', margin: 0, lineHeight: '1.5' }}>{feedback.explain}</p>
            </div>
          </div>
        )}

        <button 
          disabled={!answered && currentStep.type !== 'concept'} 
          onClick={handleNextStep} 
          style={{ width: '100%', padding: '18px', background: (answered || currentStep.type === 'concept') ? trackColor : '#1E2538', color: (answered || currentStep.type === 'concept') ? '#0B0E17' : '#475569', borderRadius: '24px', fontWeight: '900', fontSize: '1.05rem', border: 'none', cursor: (answered || currentStep.type === 'concept') ? 'pointer' : 'not-allowed', transition: 'all 0.2s' }}
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
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', marginTop: '20px' }}>
      <div style={{ position: 'relative', width: '170px', height: '170px', background: '#0B0E17', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.05)', boxShadow: 'inset 0 0 40px rgba(0,0,0,0.5)' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', width: '130px', height: '130px', borderRadius: '50%', border: '1.5px dashed rgba(255,255,255,0.1)', transform: 'translate(-50%,-50%)' }} />
        <div style={{ position: 'absolute', top: '50%', left: '50%', width: '80px', height: '80px', borderRadius: '50%', border: '1.5px dashed rgba(255,255,255,0.1)', transform: 'translate(-50%,-50%)' }} />
        <div style={{ position: 'absolute', top: '50%', left: '50%', width: '32px', height: '32px', borderRadius: '50%', background: '#FBBF24', transform: 'translate(-50%,-50%)', boxShadow: '0 0 20px rgba(251, 191, 36, 0.6)' }} />
        <div ref={p1Ref} style={{ position: 'absolute', width: '16px', height: '16px', borderRadius: '50%', background: '#3B82F6', boxShadow: '0 0 12px #3B82F6' }} />
        <div ref={p2Ref} style={{ position: 'absolute', width: '12px', height: '12px', borderRadius: '50%', background: '#A78BFA', boxShadow: '0 0 10px #A78BFA' }} />
      </div>
      <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: '700' }}>Simulação: planetas internos orbitam mais rápido</span>
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
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '20px' }}>
      {tones.map(t => (
        <div key={t.char} style={{ background: '#0B0E17', borderRadius: '16px', padding: '16px', textAlign: 'center', border: '2px solid rgba(255,255,255,0.05)', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
          <div style={{ fontSize: '1.8rem', fontWeight: '900', color: t.c, marginBottom: '6px' }}>{t.char}</div>
          <div style={{ fontSize: '0.85rem', fontWeight: '800', color: '#F1F5F9' }}>{t.pin}</div>
          <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '4px', fontWeight: '600' }}>{t.en}</div>
        </div>
      ))}
    </div>
  );
}