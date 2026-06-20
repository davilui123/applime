import { useState, useEffect } from "react";
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Cancel01Icon,
  Activity01Icon,
  Location01Icon,
  ArrowUp01Icon,
  MapsIcon,
  PlayIcon,
  StopIcon,
  PauseIcon,
  ArrowUpRight01Icon,
  Share01Icon,
  Target01Icon
} from "hugeicons-react";

// ─── Design tokens ────────────────────────────────────────────────────────────
const COLORS = {
  void: "#080B14",
  surface: "#0F1422",
  elevated: "#1A2035",
  border: "#232B42",
  muted: "#3A4460",
  textPrimary: "#F0F4FF",
  textSecondary: "#8B95B8",
  acidLime: "#C8FF57",
  neonRose: "#FF5E8A",
  electricViolet: "#7B7FFF",
  cyanGlow: "#00E5FF",
  amberWarm: "#FFB830",
};

const GOALS = [
  { id: "3k", label: "3 KM", type: "Tiro Rápido", desc: "6x 400m com 1min de descanso" },
  { id: "5k", label: "5 KM", type: "Corrida Leve", desc: "Ritmo constante (Z2) para base aeróbica" },
  { id: "10k", label: "10 KM", type: "Intervalado", desc: "Alternando Pace 5:30 e 6:30" },
  { id: "21k", label: "21 KM", type: "Meia Maratona", desc: "Treino de endurance e resistência mental" },
  { id: "42k", label: "42 KM", type: "Longão", desc: "Simulação de prova. Pace alvo: 6:00/km" },
];

export default function CardioScreen({ onBack }) {
  const [activeGoal, setActiveGoal] = useState(GOALS[1]); // Default 5K
  const [runState, setRunState] = useState("idle"); // idle, running, paused, finished
  const [runTime, setRunTime] = useState(0); // em segundos
  const [runDistance, setRunDistance] = useState(0); // em KM

  // ─── MOTOR DO CRONÔMETRO DE CORRIDA ─────────────────────────────────────────
  useEffect(() => {
    let interval;
    if (runState === "running") {
      interval = setInterval(() => {
        setRunTime(prev => prev + 1);
        // Simula uma corrida a um pace aproximado de 5:30/km a 6:00/km
        // Incrementa a distância de forma fluida a cada segundo (aprox 2.8 a 3.1 metros/s)
        setRunDistance(prev => prev + 0.0029 + (Math.random() * 0.0002));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [runState]);

  // Formatação de Tempo (MM:SS)
  const formatTime = (totalSeconds) => {
    const m = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
    const s = (totalSeconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // Cálculo Dinâmico de Ritmo (Pace)
  const currentPace = runDistance > 0.05 
    ? formatTime(Math.floor(runTime / runDistance)) 
    : "0:00";

  // ─── TELA DE CORRIDA ATIVA (OVERLAY) ────────────────────────────────────────
  if (runState !== "idle" && runState !== "finished") {
    return (
      <div style={{ position: "fixed", inset: 0, background: COLORS.void, zIndex: 1000, display: "flex", flexDirection: "column", animation: "slideUpFade 0.3s ease both" }}>
        
        {/* Mapa Dinâmico Rodando no Fundo */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "60vh", opacity: 0.4, overflow: "hidden" }}>
           <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: "100%", height: "100%" }}>
              <defs>
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke={COLORS.border} strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#grid)" />
              {/* Rota sendo desenhada */}
              <polyline points="10,90 30,70 45,75 60,40 85,30 50,10" fill="none" stroke={COLORS.neonRose} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
           </svg>
        </div>

        {/* Header da Corrida */}
        <div style={{ position: "relative", zIndex: 10, padding: "40px 20px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: `${COLORS.neonRose}15`, padding: "8px 16px", borderRadius: 99, border: `1px solid ${COLORS.neonRose}30` }}>
            <Activity01Icon size={16} color={COLORS.neonRose} variant="solid" />
            <span style={{ color: COLORS.neonRose, fontWeight: 800, fontSize: 13 }}>ZONA 3 · Aeróbico</span>
          </div>
          <span style={{ color: COLORS.textSecondary, fontWeight: 800, fontSize: 13, letterSpacing: "1px" }}>
            GPS Ativo <ArrowUpRight01Icon size={12} color={COLORS.cyanGlow} variant="solid" style={{ marginLeft: 4 }}/>
          </span>
        </div>

        {/* Dados da Corrida em Tempo Real */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", position: "relative", zIndex: 10, marginTop: "10vh" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <span style={{ fontSize: 14, color: COLORS.textSecondary, fontWeight: 800, letterSpacing: "2px", textTransform: "uppercase" }}>Distância</span>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center" }}>
              <span style={{ fontSize: 96, fontWeight: 900, color: COLORS.textPrimary, letterSpacing: "-0.04em", lineHeight: 1 }}>{runDistance.toFixed(2)}</span>
              <span style={{ fontSize: 24, fontWeight: 800, color: COLORS.textSecondary, marginLeft: 8 }}>km</span>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, width: "100%", padding: "0 40px" }}>
            <div style={{ textAlign: "center" }}>
              <span style={{ fontSize: 12, color: COLORS.textSecondary, fontWeight: 800, letterSpacing: "1px", textTransform: "uppercase" }}>Ritmo Atual</span>
              <div style={{ fontSize: 32, fontWeight: 900, color: COLORS.textPrimary }}>{currentPace}<span style={{ fontSize: 14, color: COLORS.textSecondary }}>/km</span></div>
            </div>
            <div style={{ textAlign: "center" }}>
              <span style={{ fontSize: 12, color: COLORS.textSecondary, fontWeight: 800, letterSpacing: "1px", textTransform: "uppercase" }}>Tempo</span>
              <div style={{ fontSize: 32, fontWeight: 900, color: COLORS.textPrimary }}>{formatTime(runTime)}</div>
            </div>
          </div>
        </div>

        {/* Controles (Pausar/Parar) */}
        <div style={{ padding: "40px 20px 60px", display: "flex", justifyContent: "center", gap: 24, position: "relative", zIndex: 10, background: `linear-gradient(to top, ${COLORS.void} 80%, transparent)` }}>
          {runState === "running" ? (
            <button onClick={() => setRunState("paused")} style={{ width: 80, height: 80, borderRadius: "50%", background: COLORS.amberWarm, border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: `0 0 30px ${COLORS.amberWarm}40` }}>
              <PauseIcon size={32} color={COLORS.void} variant="solid" />
            </button>
          ) : (
            <>
              <button onClick={() => setRunState("finished")} style={{ width: 64, height: 64, borderRadius: "50%", background: COLORS.surface, border: `2px solid ${COLORS.neonRose}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <StopIcon size={24} color={COLORS.neonRose} variant="solid" />
              </button>
              <button onClick={() => setRunState("running")} style={{ width: 80, height: 80, borderRadius: "50%", background: COLORS.acidLime, border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: `0 0 30px ${COLORS.acidLime}40` }}>
                <PlayIcon size={32} color={COLORS.void} variant="solid" />
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  // ─── TELA DE SÍNTESE FINAL (PÓS CORRIDA) ────────────────────────────────────
  if (runState === "finished") {
    return (
      <div style={{ padding: "24px 20px 120px", animation: "slideUpFade 0.3s ease both" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
          <button onClick={() => { setRunState("idle"); setRunTime(0); setRunDistance(0); }} style={{ width: 40, height: 40, borderRadius: "50%", background: COLORS.surface, border: "none", color: COLORS.textSecondary, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <Cancel01Icon size={20} variant="stroke" />
          </button>
          <span style={{ fontSize: 14, fontWeight: 800, color: COLORS.neonRose }}>Treino Concluído</span>
          <div style={{ width: 40 }} />
        </div>

        {/* Card do Mapa Estilizado (Resultado) */}
        <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 24, overflow: "hidden", marginBottom: 24, position: "relative" }}>
          <div style={{ height: 200, background: COLORS.void, position: "relative" }}>
             <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: "100%", height: "100%" }}>
                <defs>
                  <pattern id="grid2" width="8" height="8" patternUnits="userSpaceOnUse">
                    <path d="M 8 0 L 0 0 0 8" fill="none" stroke={COLORS.border} strokeWidth="0.5"/>
                  </pattern>
                </defs>
                <rect width="100" height="100" fill="url(#grid2)" />
                <polyline points="10,90 30,70 45,75 60,40 85,30 50,10" fill="none" stroke={COLORS.neonRose} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="50" cy="10" r="3" fill={COLORS.textPrimary} stroke={COLORS.neonRose} strokeWidth="1.5" />
                <circle cx="10" cy="90" r="2" fill={COLORS.textSecondary} />
             </svg>
             <div style={{ position: "absolute", bottom: 12, left: 16, background: `${COLORS.void}CC`, padding: "4px 10px", borderRadius: 8, backdropFilter: "blur(4px)", fontSize: 10, fontWeight: 800, color: COLORS.textSecondary, display: "flex", gap: 4, alignItems: "center" }}>
               <Location01Icon size={12} variant="solid" color={COLORS.neonRose}/> São Paulo, SP
             </div>
          </div>
          
          <div style={{ padding: "20px" }}>
            <h3 style={{ fontSize: 24, fontWeight: 900, color: COLORS.textPrimary, margin: "0 0 4px" }}>Corrida Matinal</h3>
            <p style={{ fontSize: 13, color: COLORS.textSecondary, margin: "0 0 20px" }}>{new Date().toLocaleDateString('pt-BR')} · {activeGoal.type}</p>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
              <div><div style={{ fontSize: 11, color: COLORS.textSecondary, fontWeight: 700, textTransform: "uppercase", marginBottom: 4 }}>Distância</div><div style={{ fontSize: 18, color: COLORS.textPrimary, fontWeight: 900 }}>{runDistance.toFixed(2)}<span style={{fontSize:12, fontWeight:700, color:COLORS.textSecondary}}>km</span></div></div>
              <div><div style={{ fontSize: 11, color: COLORS.textSecondary, fontWeight: 700, textTransform: "uppercase", marginBottom: 4 }}>Pace Médio</div><div style={{ fontSize: 18, color: COLORS.textPrimary, fontWeight: 900 }}>{currentPace}</div></div>
              <div><div style={{ fontSize: 11, color: COLORS.textSecondary, fontWeight: 700, textTransform: "uppercase", marginBottom: 4 }}>Tempo</div><div style={{ fontSize: 18, color: COLORS.textPrimary, fontWeight: 900 }}>{formatTime(runTime)}</div></div>
            </div>
          </div>
        </div>

        <button style={{ width: "100%", padding: "16px", borderRadius: 16, background: COLORS.neonRose, color: COLORS.void, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontWeight: 900, fontSize: 14, cursor: "pointer", border: "none" }}>
          <Share01Icon size={18} variant="solid" />
          Compartilhar no Instagram
        </button>
      </div>
    );
  }

  // ─── TELA PRINCIPAL DO MÓDULO (SETUP) ───────────────────────────────────────
  return (
    <div style={{ padding: "24px 20px 120px", animation: "slideUpFade 0.3s ease both" }}>
      
      {/* Topbar */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
        <button onClick={onBack} style={{ width: 40, height: 40, borderRadius: 14, background: COLORS.surface, border: `1px solid ${COLORS.border}`, color: COLORS.textPrimary, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <ArrowLeft01Icon size={20} variant="stroke" />
        </button>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 900, color: COLORS.textPrimary, margin: 0 }}>Cardio & GPS</h2>
          <p style={{ fontSize: 12, color: COLORS.textSecondary, margin: "2px 0 0" }}>Motor de Prescrição de Corrida</p>
        </div>
      </div>

      {/* METAS / DISTÂNCIAS (SCROLL HORIZONTAL) */}
      <div style={{ marginBottom: 24 }}>
        <span style={{ fontSize: 12, fontWeight: 800, color: COLORS.textSecondary, textTransform: "uppercase", letterSpacing: "1px", marginLeft: 4 }}>Selecione o Alvo</span>
        <div style={{ display: "flex", gap: 12, overflowX: "auto", padding: "12px 4px", scrollbarWidth: "none" }}>
          {GOALS.map((goal) => {
            const isActive = activeGoal.id === goal.id;
            return (
              <div 
                key={goal.id} 
                onClick={() => setActiveGoal(goal)}
                style={{ minWidth: 80, padding: "16px 0", borderRadius: 20, border: `1px solid ${isActive ? COLORS.neonRose : COLORS.border}`, background: isActive ? `${COLORS.neonRose}10` : COLORS.surface, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, cursor: "pointer", transition: "all 0.2s" }}
              >
                <Target01Icon size={24} color={isActive ? COLORS.neonRose : COLORS.muted} variant={isActive ? "solid" : "stroke"} />
                <span style={{ fontSize: 14, fontWeight: 900, color: isActive ? COLORS.neonRose : COLORS.textPrimary }}>{goal.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* PRESCRIÇÃO DINÂMICA DA IA (O Treinuu Monta) */}
      <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 24, padding: 24, marginBottom: 24, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -20, right: -20, opacity: 0.05 }}><MapsIcon size={150} variant="solid" color={COLORS.neonRose}/></div>
        
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <ArrowUp01Icon size={18} color={COLORS.neonRose} variant="solid" />
          <span style={{ fontSize: 12, fontWeight: 800, color: COLORS.neonRose, textTransform: "uppercase", letterSpacing: "1px" }}>Plano Recomendado</span>
        </div>
        
        <h3 style={{ fontSize: 24, fontWeight: 900, color: COLORS.textPrimary, margin: "0 0 8px", position: "relative", zIndex: 1 }}>{activeGoal.type}</h3>
        <p style={{ fontSize: 14, color: COLORS.textSecondary, margin: "0 0 20px", lineHeight: 1.5, position: "relative", zIndex: 1 }}>{activeGoal.desc}</p>
        
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, position: "relative", zIndex: 1 }}>
          <div style={{ background: COLORS.void, padding: "12px", borderRadius: 12, border: `1px solid ${COLORS.border}` }}>
            <span style={{ fontSize: 11, color: COLORS.textSecondary, fontWeight: 700, display: "block", marginBottom: 2 }}>Terreno Ideal</span>
            <span style={{ fontSize: 13, color: COLORS.textPrimary, fontWeight: 800 }}>Asfalto plano</span>
          </div>
          <div style={{ background: COLORS.void, padding: "12px", borderRadius: 12, border: `1px solid ${COLORS.border}` }}>
            <span style={{ fontSize: 11, color: COLORS.textSecondary, fontWeight: 700, display: "block", marginBottom: 2 }}>Tênis Sugerido</span>
            <span style={{ fontSize: 13, color: COLORS.textPrimary, fontWeight: 800 }}>Amortecimento</span>
          </div>
        </div>
      </div>

      {/* HISTÓRICO RECENTE (Placeholder estilizado) */}
      <div style={{ marginBottom: 32 }}>
        <span style={{ fontSize: 12, fontWeight: 800, color: COLORS.textSecondary, textTransform: "uppercase", letterSpacing: "1px", marginLeft: 4, display: "block", marginBottom: 12 }}>Última Atividade</span>
        <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px", background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 16 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: `${COLORS.neonRose}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Location01Icon size={24} color={COLORS.neonRose} variant="solid" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: COLORS.textPrimary }}>Corrida Noturna</div>
            <div style={{ fontSize: 12, color: COLORS.textSecondary, marginTop: 4 }}>4.2 km · 28 min · 6:40/km</div>
          </div>
          <ArrowRight01Icon size={16} color={COLORS.muted} variant="stroke" />
        </div>
      </div>

      {/* BOTÃO START */}
      <button 
        onClick={() => setRunState("running")}
        style={{ width: "100%", padding: "18px", borderRadius: 99, background: COLORS.neonRose, border: "none", color: COLORS.void, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, fontSize: 16, fontWeight: 900, cursor: "pointer", boxShadow: `0 8px 30px ${COLORS.neonRose}40`, transition: "all 0.2s" }}
      >
        <PlayIcon size={20} variant="solid" />
        Iniciar {activeGoal.label}
      </button>

    </div>
  );
}