import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  ArrowLeft01Icon,
  SparklesIcon,
  DropletIcon,
  Sun01Icon,
  Moon02Icon,
  Calendar01Icon,
  Share01Icon,
  CheckmarkCircle02Icon,
  CircleIcon,
  Activity01Icon,
  Settings01Icon
} from "hugeicons-react";

// ─── Supabase client ──────────────────────────────────────────────────────────
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const COLORS = {
  void: "#080B14", surface: "#0F1422", elevated: "#1A2035", border: "#232B42",
  muted: "#3A4460", textPrimary: "#F0F4FF", textSecondary: "#8B95B8",
  acidLime: "#C8FF57", neonRose: "#FF5E8A", electricViolet: "#7B7FFF",
  cyanGlow: "#00E5FF", amberWarm: "#FFB830",
};

export default function GlowUpScreen({ onBack }) {
  const [user, setUser] = useState(null);
  const [score, setScore] = useState(83);
  
  // ─── ESTADOS: Sono ──────────────────────────────────────────────────────────
  const [sonoLevel, setSonoLevel] = useState(20);
  const [sleepInput, setSleepInput] = useState({ hours: "", deep: "", efficiency: "" });
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState(null);

  // ─── ESTADOS: Água ──────────────────────────────────────────────────────────
  const [waterML, setWaterML] = useState(0);

  // ─── ESTADOS: Checklist ─────────────────────────────────────────────────────
  // O hábito da Água (ID: 4) será gerido pelo contador.
  const [checklist, setChecklist] = useState([
    { id: 1, label: "Lavar rosto (Gel de limpeza)", icon: DropletIcon, done: false },
    { id: 2, label: "Protetor Solar FPS 50", icon: Sun01Icon, done: false },
    { id: 3, label: "Perfume / Assinatura olfativa", icon: SparklesIcon, done: false },
    { id: 4, label: "Hidratação (2L atingidos)", icon: DropletIcon, done: false, isWater: true },
    { id: 5, label: "Skincare Noturno / Ácido", icon: Moon02Icon, done: false },
  ]);

  // ─── ESTADOS: Agenda Configurável ───────────────────────────────────────────
  const [showAgendaSettings, setShowAgendaSettings] = useState(false);
  const [agenda, setAgenda] = useState({
    hair: { lastDate: new Date().toISOString().split("T")[0], freq: 30 },
    beard: { lastDate: new Date().toISOString().split("T")[0], freq: 15 }
  });

  // ─── CARREGAR DADOS INICIAIS ────────────────────────────────────────────────
  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUser(user);

      // Puxar Score Estético e Atributo de Sono
      const { data: prof } = await supabase.from("treinuu_profiles").select("aesthetic_score").eq("user_id", user.id).single();
      if (prof) setScore(prof.aesthetic_score);

      const { data: mMap } = await supabase.from("treinuu_muscle_map").select("sono").eq("user_id", user.id).single();
      if (mMap && mMap.sono !== undefined) setSonoLevel(mMap.sono);

      // Carregar Checklist Diário com Reset de Meia-Noite
      const todayString = new Date().toDateString();
      const { data: savedList } = await supabase.from("treinuu_glowup_checklist").select("*").eq("user_id", user.id);
      
      let dbWaterDone = false;

      if (savedList && savedList.length > 0) {
        setChecklist(prev => prev.map(item => {
          const dbItem = savedList.find(db => db.habit_id === item.id);
          // Só conta como "feito" se foi atualizado HOJE
          const isToday = dbItem && new Date(dbItem.updated_at).toDateString() === todayString;
          const isDone = isToday ? dbItem.done : false;
          if (item.id === 4) dbWaterDone = isDone;
          return { ...item, done: isDone };
        }));
      }

      // Carregar Contador de Água Local (garante que não zera se der F5 durante o dia)
      const savedWaterDate = localStorage.getItem(`treinuu_water_date_${user.id}`);
      if (savedWaterDate === todayString) {
        setWaterML(Number(localStorage.getItem(`treinuu_water_${user.id}`)) || 0);
      } else {
        setWaterML(0);
        localStorage.setItem(`treinuu_water_${user.id}`, 0);
        localStorage.setItem(`treinuu_water_date_${user.id}`, todayString);
      }

      // Carregar Configurações de Agenda
      const savedAgenda = localStorage.getItem(`treinuu_agenda_${user.id}`);
      if (savedAgenda) setAgenda(JSON.parse(savedAgenda));
    }
    loadData();
  }, []);

  // ─── AÇÃO: TOGGLE CHECKLIST ─────────────────────────────────────────────────
  const handleToggleCheck = async (id, forceState = null) => {
    if (!user) return;
    
    const targetItem = checklist.find(item => item.id === id);
    if (targetItem.isWater && forceState === null) return; // Não deixa clicar na água diretamente, o contador é que manda!

    const newState = forceState !== null ? forceState : !targetItem.done;

    setChecklist(prev => prev.map(item => item.id === id ? { ...item, done: newState } : item));

    await supabase.from("treinuu_glowup_checklist").upsert({
      user_id: user.id,
      habit_id: id,
      done: newState,
      updated_at: new Date().toISOString()
    });
  };

  // ─── AÇÃO: ADICIONAR ÁGUA ───────────────────────────────────────────────────
  const handleAddWater = (amount) => {
    if (!user) return;
    const newWater = Math.min(2000, waterML + amount);
    setWaterML(newWater);
    
    localStorage.setItem(`treinuu_water_${user.id}`, newWater);
    localStorage.setItem(`treinuu_water_date_${user.id}`, new Date().toDateString());

    // Se bater a meta de 2L e ainda não estava marcado, envia para o Supabase!
    if (newWater >= 2000) {
      const waterItem = checklist.find(c => c.id === 4);
      if (!waterItem.done) handleToggleCheck(4, true);
    }
  };

  // ─── AÇÃO: SINCRONIZAR SONO DO RELÓGIO ──────────────────────────────────────
  const handleSyncSleep = async () => {
    const h = parseFloat(sleepInput.hours);
    const d = parseFloat(sleepInput.deep);
    const e = parseInt(sleepInput.efficiency);

    if (!h || !d || !e) {
      setSyncMessage({ type: "error", text: "Preencha todos os campos do relógio!" });
      return;
    }

    setIsSyncing(true);
    setSyncMessage(null);

    // Regra de Gamificação (RPG)
    const isPerfectRecovery = h >= 7 && d >= 1.5 && e >= 80;
    
    setTimeout(async () => {
      if (user) {
        await supabase.from("treinuu_sleep_history").insert({
          user_id: user.id, sleep_hours: h, deep_sleep_hours: d, efficiency_pct: e
        });

        if (isPerfectRecovery) {
          const newSono = Math.min(100, sonoLevel + 8);
          const newScore = Math.min(100, score + 1);
          setSonoLevel(newSono);
          setScore(newScore);
          await supabase.from("treinuu_muscle_map").update({ sono: newSono }).eq("user_id", user.id);
          await supabase.from("treinuu_profiles").update({ aesthetic_score: newScore }).eq("user_id", user.id);
          setSyncMessage({ type: "success", text: "Recuperação Perfeita! +8% Sono e +1 Score Estético." });
        } else {
          setSyncMessage({ type: "warning", text: "Recuperação registada, mas abaixo do ideal. Tente dormir mais cedo amanhã." });
        }
      }
      setIsSyncing(false);
      setSleepInput({ hours: "", deep: "", efficiency: "" }); // Limpa inputs
    }, 1500);
  };

  // ─── AÇÃO: SALVAR AGENDA ────────────────────────────────────────────────────
  const handleSaveAgenda = () => {
    localStorage.setItem(`treinuu_agenda_${user?.id}`, JSON.stringify(agenda));
    setShowAgendaSettings(false);
  };

  // Funções Utilitárias para Agenda
  const calculateDaysLeft = (lastDateStr, freq) => {
    const lastDate = new Date(lastDateStr);
    const today = new Date();
    const diffTime = Math.abs(today - lastDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const daysLeft = freq - diffDays;
    return daysLeft < 0 ? 0 : daysLeft;
  };

  const getAgendaColor = (days) => {
    if (days === 0) return COLORS.neonRose;
    if (days <= 3) return COLORS.amberWarm;
    return COLORS.cyanGlow;
  };

  const hairDays = calculateDaysLeft(agenda.hair.lastDate, agenda.hair.freq);
  const beardDays = calculateDaysLeft(agenda.beard.lastDate, agenda.beard.freq);
  const completedCount = checklist.filter(item => item.done).length;
  const progressPct = Math.round((completedCount / checklist.length) * 100);

  return (
    <div style={{ padding: "24px 20px 120px", animation: "slideUpFade 0.3s ease both" }}>
      
      {/* Topbar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <button onClick={onBack} style={{ width: 40, height: 40, borderRadius: 14, background: COLORS.surface, border: `1px solid ${COLORS.border}`, color: COLORS.textPrimary, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <ArrowLeft01Icon size={20} variant="stroke" />
          </button>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 900, color: COLORS.textPrimary, margin: 0 }}>Glow Up</h2>
            <p style={{ fontSize: 12, color: COLORS.textSecondary, margin: "2px 0 0" }}>Estética & Hábitos</p>
          </div>
        </div>
        <div style={{ padding: "6px 12px", background: `${COLORS.cyanGlow}15`, border: `1px solid ${COLORS.cyanGlow}30`, borderRadius: 99, color: COLORS.cyanGlow, fontSize: 13, fontWeight: 800 }}>
          Score {score}
        </div>
      </div>

      {/* ⌚ REGISTO DO RELÓGIO (SONO) */}
      <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.electricViolet}40`, borderRadius: 24, padding: 20, marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Moon02Icon size={18} color={COLORS.electricViolet} variant="solid" />
            <span style={{ fontSize: 14, fontWeight: 800, color: COLORS.textPrimary }}>Registo de Sono</span>
          </div>
          <span style={{ fontSize: 12, color: COLORS.electricViolet, fontWeight: 800 }}>Nível {sonoLevel}%</span>
        </div>

        <p style={{ fontSize: 13, color: COLORS.textSecondary, margin: "0 0 16px" }}>Insira os dados lidos do seu Smartwatch ao acordar:</p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 16 }}>
          <div>
            <label style={{ fontSize: 10, color: COLORS.textSecondary, fontWeight: 700, textTransform: "uppercase", marginBottom: 4, display: "block" }}>Horas</label>
            <input type="number" step="0.1" placeholder="Ex: 7.5" value={sleepInput.hours} onChange={e => setSleepInput({...sleepInput, hours: e.target.value})} style={{ width: "100%", padding: "12px", borderRadius: 12, background: COLORS.void, border: `1px solid ${COLORS.border}`, color: COLORS.textPrimary, fontSize: 14, outline: "none" }} />
          </div>
          <div>
            <label style={{ fontSize: 10, color: COLORS.textSecondary, fontWeight: 700, textTransform: "uppercase", marginBottom: 4, display: "block" }}>Profundo</label>
            <input type="number" step="0.1" placeholder="Ex: 2.1" value={sleepInput.deep} onChange={e => setSleepInput({...sleepInput, deep: e.target.value})} style={{ width: "100%", padding: "12px", borderRadius: 12, background: COLORS.void, border: `1px solid ${COLORS.border}`, color: COLORS.textPrimary, fontSize: 14, outline: "none" }} />
          </div>
          <div>
            <label style={{ fontSize: 10, color: COLORS.textSecondary, fontWeight: 700, textTransform: "uppercase", marginBottom: 4, display: "block" }}>Efic. %</label>
            <input type="number" placeholder="Ex: 88" value={sleepInput.efficiency} onChange={e => setSleepInput({...sleepInput, efficiency: e.target.value})} style={{ width: "100%", padding: "12px", borderRadius: 12, background: COLORS.void, border: `1px solid ${COLORS.border}`, color: COLORS.textPrimary, fontSize: 14, outline: "none" }} />
          </div>
        </div>

        {syncMessage && (
          <div style={{ padding: "10px 14px", borderRadius: 12, marginBottom: 16, fontSize: 12, fontWeight: 700, background: syncMessage.type === "success" ? `${COLORS.acidLime}15` : syncMessage.type === "warning" ? `${COLORS.amberWarm}15` : `${COLORS.neonRose}15`, color: syncMessage.type === "success" ? COLORS.acidLime : syncMessage.type === "warning" ? COLORS.amberWarm : COLORS.neonRose }}>
            {syncMessage.text}
          </div>
        )}

        <button disabled={isSyncing} onClick={handleSyncSleep} style={{ width: "100%", padding: "14px", borderRadius: 14, background: COLORS.electricViolet, border: "none", color: COLORS.void, fontWeight: 900, fontSize: 14, cursor: isSyncing ? "not-allowed" : "pointer" }}>
          {isSyncing ? "A validar dados fisiológicos..." : "Validar Recuperação"}
        </button>
      </div>

      {/* 💧 RASTREADOR DE ÁGUA */}
      <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 24, padding: 20, marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <DropletIcon size={18} color={COLORS.cyanGlow} variant="solid" />
            <span style={{ fontSize: 14, fontWeight: 800, color: COLORS.textPrimary }}>Hidratação Diária</span>
          </div>
          <span style={{ fontSize: 13, fontWeight: 900, color: waterML >= 2000 ? COLORS.acidLime : COLORS.cyanGlow }}>{waterML} / 2000 ml</span>
        </div>

        <div style={{ height: 8, background: COLORS.void, borderRadius: 99, overflow: "hidden", marginBottom: 16, border: `1px solid ${COLORS.border}` }}>
          <div style={{ height: "100%", background: waterML >= 2000 ? COLORS.acidLime : `linear-gradient(90deg, ${COLORS.cyanGlow}80, ${COLORS.cyanGlow})`, width: `${Math.min(100, (waterML / 2000) * 100)}%`, transition: "width 0.4s ease" }} />
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => handleAddWater(250)} style={{ flex: 1, padding: "12px", borderRadius: 12, background: `${COLORS.cyanGlow}15`, border: `1px solid ${COLORS.cyanGlow}30`, color: COLORS.cyanGlow, fontWeight: 800, fontSize: 14, cursor: "pointer" }}>+ Copo (250ml)</button>
          <button onClick={() => handleAddWater(500)} style={{ flex: 1, padding: "12px", borderRadius: 12, background: `${COLORS.cyanGlow}15`, border: `1px solid ${COLORS.cyanGlow}30`, color: COLORS.cyanGlow, fontWeight: 800, fontSize: 14, cursor: "pointer" }}>+ Garrafa (500ml)</button>
        </div>
      </div>

      {/* 📋 CHECKLIST DIÁRIO DE HÁBITOS */}
      <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 24, padding: 20, marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <SparklesIcon size={18} color={COLORS.amberWarm} variant="solid" />
            <span style={{ fontSize: 14, fontWeight: 800, color: COLORS.textPrimary }}>Checklist de Aparência</span>
          </div>
          <span style={{ fontSize: 12, fontWeight: 800, color: progressPct === 100 ? COLORS.acidLime : COLORS.textSecondary }}>{progressPct}% Concluído</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {checklist.map((item) => (
            <div 
              key={item.id} 
              onClick={() => !item.isWater && handleToggleCheck(item.id)} 
              style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px", background: item.done ? `${COLORS.acidLime}0A` : COLORS.void, border: `1px solid ${item.done ? COLORS.acidLime + "30" : COLORS.border}`, borderRadius: 16, cursor: item.isWater ? "default" : "pointer", transition: "all 0.2s", opacity: (item.isWater && !item.done) ? 0.6 : 1 }}
            >
              <div style={{ width: 32, height: 32, borderRadius: 10, background: item.done ? COLORS.acidLime : COLORS.surface, display: "flex", alignItems: "center", justifyContent: "center", color: item.done ? COLORS.void : COLORS.muted }}>
                <item.icon size={16} variant={item.done ? "solid" : "stroke"} />
              </div>
              <div style={{ flex: 1, fontSize: 13, fontWeight: 700, color: item.done ? COLORS.acidLime : COLORS.textSecondary, textDecoration: item.done ? "line-through" : "none" }}>
                {item.label}
              </div>
              {item.done ? <CheckmarkCircle02Icon size={20} color={COLORS.acidLime} variant="solid" /> : <CircleIcon size={20} color={COLORS.muted} variant="stroke" />}
            </div>
          ))}
        </div>
      </div>

      {/* 📅 AGENDA DE CUIDADOS (CONFIGURÁVEL) */}
      <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 24, padding: 20, marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Calendar01Icon size={18} color={COLORS.electricViolet} variant="solid" />
            <span style={{ fontSize: 14, fontWeight: 800, color: COLORS.textPrimary }}>Agenda de Manutenção</span>
          </div>
          <button onClick={() => setShowAgendaSettings(!showAgendaSettings)} style={{ background: "transparent", border: "none", color: COLORS.textSecondary, cursor: "pointer" }}>
            <Settings01Icon size={18} variant="solid" />
          </button>
        </div>

        {showAgendaSettings ? (
          <div style={{ animation: "slideUpFade 0.2s ease" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 16 }}>
              <div style={{ background: COLORS.void, padding: 14, borderRadius: 16, border: `1px solid ${COLORS.border}` }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: COLORS.textPrimary, marginBottom: 10 }}>✂️ Corte de Cabelo</div>
                <div style={{ display: "flex", gap: 10 }}>
                  <input type="date" value={agenda.hair.lastDate} onChange={e => setAgenda({...agenda, hair: {...agenda.hair, lastDate: e.target.value}})} style={{ flex: 1, padding: "10px", borderRadius: 8, background: COLORS.surface, border: "none", color: COLORS.textPrimary, fontSize: 13 }} />
                  <input type="number" placeholder="Dias (Ex: 30)" value={agenda.hair.freq} onChange={e => setAgenda({...agenda, hair: {...agenda.hair, freq: e.target.value}})} style={{ width: 80, padding: "10px", borderRadius: 8, background: COLORS.surface, border: "none", color: COLORS.textPrimary, fontSize: 13 }} />
                </div>
              </div>
              <div style={{ background: COLORS.void, padding: 14, borderRadius: 16, border: `1px solid ${COLORS.border}` }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: COLORS.textPrimary, marginBottom: 10 }}>🧔🏻‍♂️ Alinhamento de Barba</div>
                <div style={{ display: "flex", gap: 10 }}>
                  <input type="date" value={agenda.beard.lastDate} onChange={e => setAgenda({...agenda, beard: {...agenda.beard, lastDate: e.target.value}})} style={{ flex: 1, padding: "10px", borderRadius: 8, background: COLORS.surface, border: "none", color: COLORS.textPrimary, fontSize: 13 }} />
                  <input type="number" placeholder="Dias" value={agenda.beard.freq} onChange={e => setAgenda({...agenda, beard: {...agenda.beard, freq: e.target.value}})} style={{ width: 80, padding: "10px", borderRadius: 8, background: COLORS.surface, border: "none", color: COLORS.textPrimary, fontSize: 13 }} />
                </div>
              </div>
            </div>
            <button onClick={handleSaveAgenda} style={{ width: "100%", padding: "12px", borderRadius: 12, background: COLORS.electricViolet, border: "none", color: COLORS.void, fontWeight: 800, cursor: "pointer" }}>Salvar Configurações</button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ fontSize: 24 }}>✂️</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: getAgendaColor(hairDays), textTransform: "uppercase", marginBottom: 2 }}>{hairDays === 0 ? "Requer Atenção Hoje!" : `Em ${hairDays} dias`}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.textPrimary }}>Corte de Cabelo</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ fontSize: 24 }}>🧔🏻‍♂️</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: getAgendaColor(beardDays), textTransform: "uppercase", marginBottom: 2 }}>{beardDays === 0 ? "Requer Atenção Hoje!" : `Em ${beardDays} dias`}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.textPrimary }}>Alinhamento de Barba</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 🚀 CARD "GLOW UP SHARE" */}
      <div style={{ background: `linear-gradient(145deg, ${COLORS.void}, ${COLORS.surface})`, border: `1px solid ${COLORS.cyanGlow}40`, borderRadius: 24, padding: 24, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -50, right: -50, width: 150, height: 150, background: COLORS.cyanGlow, filter: "blur(80px)", opacity: 0.15, borderRadius: "50%" }} />
        <h3 style={{ fontSize: 22, fontWeight: 900, color: COLORS.textPrimary, margin: "0 0 4px", letterSpacing: "-0.02em" }}>Glow Up Stats</h3>
        <p style={{ fontSize: 12, color: COLORS.textSecondary, margin: "0 0 24px" }}>Resumo da sua evolução</p>
        <button style={{ width: "100%", padding: "16px", borderRadius: 16, background: COLORS.textPrimary, color: COLORS.void, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontWeight: 900, fontSize: 14, cursor: "pointer", border: "none" }}>
          <Share01Icon size={18} variant="solid" />
          Compartilhar no Instagram
        </button>
      </div>

    </div>
  );
}