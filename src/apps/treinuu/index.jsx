import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// IMPORTANDO OS ÍCONES DA HUGEICONS (APENAS OS TESTADOS E SEGUROS!) ──────────
import {
  Dumbbell01Icon,
  Activity01Icon,
  SparklesIcon,
  BotIcon,
  UserIcon,
  FireIcon,
  Moon02Icon,
  ArrowRight01Icon,
  Target01Icon,
  ArrowUp01Icon,
  Notification01Icon,
  Settings01Icon,
  Cancel01Icon,
  Notification02Icon,
  LockIcon
} from "hugeicons-react";

// IMPORTANDO OS MÓDULOS ────────────────────────────────────────────────────────
import ForcaScreen from "./modules/Forca";
import GlowUpScreen from "./modules/GlowUp";
import CardioScreen from "./modules/Cardio";
import AiScreen from "./modules/Ai";

// ─── Supabase client ──────────────────────────────────────────────────────────
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// ─── Design tokens ────────────────────────────────────────────────────────────
const COLORS = {
  void: "#080B14", surface: "#0F1422", elevated: "#1A2035", border: "#232B42",
  muted: "#3A4460", textPrimary: "#F0F4FF", textSecondary: "#8B95B8",
  acidLime: "#C8FF57", neonRose: "#FF5E8A", electricViolet: "#7B7FFF",
  cyanGlow: "#00E5FF", amberWarm: "#FFB830",
};

const ATTRIBUTES = [
  { key: "forca", label: "Força", icon: Dumbbell01Icon, value: 0, color: COLORS.acidLime },
  { key: "cardio", label: "Cardio", icon: Activity01Icon, value: 0, color: COLORS.neonRose },
  { key: "sono", label: "Sono", icon: Moon02Icon, value: 0, color: COLORS.electricViolet },
  { key: "aparencia", label: "Aparência", icon: SparklesIcon, value: 0, color: COLORS.cyanGlow },
  { key: "consistencia", label: "Consistência", icon: FireIcon, value: 0, color: COLORS.amberWarm },
];

const NAV_ITEMS = [
  { key: "home", label: "Perfil", icon: UserIcon },
  { key: "forca", label: "Força", icon: Dumbbell01Icon },
  { key: "cardio", label: "Cardio", icon: Activity01Icon },
  { key: "glowup", label: "Glow Up", icon: SparklesIcon },
  { key: "ai", label: "IA", icon: BotIcon },
];

const PATENTE_TIERS = [
  { label: "Iniciante", min: 0, icon: "🥉" },
  { label: "Disciplinado", min: 30, icon: "🥈" },
  { label: "Atleta", min: 50, icon: "🥇" },
  { label: "Guerreiro", min: 70, icon: "💎" },
  { label: "Mestre", min: 85, icon: "👑" },
  { label: "Elite", min: 95, icon: "🏆" },
];

function getPatente(avg) {
  return [...PATENTE_TIERS].reverse().find((t) => avg >= t.min) ?? PATENTE_TIERS[0];
}

function avgAtributos(attrs) {
  const sum = attrs.reduce((acc, a) => acc + a.value, 0);
  return attrs.length ? Math.round(sum / attrs.length) : 0;
}

// ─── TELA DE AUTENTICAÇÃO (LOGIN / REGISTO) ───────────────────────────────────
function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
      }
    } catch (error) {
      setErrorMsg(error.message || "Ocorreu um erro. Verifique as suas credenciais.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: COLORS.void, padding: "40px 24px", justifyContent: "center", animation: "slideUpFade 0.4s ease both" }}>
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <div style={{ width: 64, height: 64, borderRadius: 20, background: `linear-gradient(135deg, ${COLORS.acidLime}, ${COLORS.cyanGlow})`, margin: "0 auto 24px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 8px 32px ${COLORS.acidLime}40` }}>
          <Dumbbell01Icon size={32} color={COLORS.void} variant="solid" />
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 900, color: COLORS.textPrimary, margin: "0 0 8px", letterSpacing: "-0.03em" }}>Treinuu</h1>
        <p style={{ fontSize: 14, color: COLORS.textSecondary, margin: 0 }}>O seu RPG de evolução pessoal.</p>
      </div>

      <form onSubmit={handleAuth} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {errorMsg && (
          <div style={{ background: `${COLORS.neonRose}15`, border: `1px solid ${COLORS.neonRose}40`, padding: 16, borderRadius: 12, display: "flex", alignItems: "flex-start", gap: 10 }}>
            <Notification02Icon size={18} color={COLORS.neonRose} variant="solid" style={{ flexShrink: 0, marginTop: 2 }} />
            <span style={{ color: COLORS.neonRose, fontSize: 13, fontWeight: 700 }}>{errorMsg}</span>
          </div>
        )}

        <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: "4px 16px", display: "flex", alignItems: "center", gap: 12, transition: "border 0.2s" }}>
          <UserIcon size={20} color={COLORS.muted} variant="stroke" />
          <input type="email" placeholder="O seu email" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" style={{ flex: 1, background: "transparent", border: "none", padding: "14px 0", color: COLORS.textPrimary, fontSize: 15, outline: "none" }} />
        </div>

        <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: "4px 16px", display: "flex", alignItems: "center", gap: 12, transition: "border 0.2s" }}>
          <LockIcon size={20} color={COLORS.muted} variant="stroke" />
          <input type="password" placeholder="Palavra-passe (min 6 carateres)" value={password} onChange={e => setPassword(e.target.value)} required autoComplete={isLogin ? "current-password" : "new-password"} style={{ flex: 1, background: "transparent", border: "none", padding: "14px 0", color: COLORS.textPrimary, fontSize: 15, outline: "none" }} />
        </div>

        <button type="submit" disabled={loading} style={{ background: COLORS.textPrimary, color: COLORS.void, padding: 18, borderRadius: 16, border: "none", fontSize: 15, fontWeight: 900, cursor: loading ? "not-allowed" : "pointer", marginTop: 8, transition: "transform 0.1s" }}>
          {loading ? "A processar..." : (isLogin ? "Entrar na Arena" : "Forjar Perfil")}
        </button>
      </form>

      <div style={{ textAlign: "center", marginTop: 32 }}>
        <button type="button" onClick={() => setIsLogin(!isLogin)} style={{ background: "transparent", border: "none", color: COLORS.textSecondary, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
          {isLogin ? "Novo por aqui? " : "Já tem um perfil? "}
          <span style={{ color: COLORS.acidLime }}>{isLogin ? "Criar conta" : "Fazer login"}</span>
        </button>
      </div>
    </div>
  );
}

// ─── Sub-componentes do Dashboard ───────────────────────────────────────────
function CharacterRings({ attributes }) {
  const size = 230; const cx = size / 2; const cy = size / 2; const strokeWidth = 7; const gap = 8; 
  return (
    <div style={{ position: "relative", width: size, height: size, margin: "0 auto" }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: "block" }}>
        {attributes.map((attr, i) => {
          const ringIndex = attributes.length - 1 - i; 
          const radius = cx - strokeWidth / 2 - ringIndex * (strokeWidth + gap);
          const circumference = 2 * Math.PI * radius;
          const fill = (attr.value / 100) * circumference;
          return (
            <g key={attr.key}>
              <circle cx={cx} cy={cy} r={radius} fill="none" stroke={COLORS.border} strokeWidth={strokeWidth} strokeLinecap="round" />
              <circle cx={cx} cy={cy} r={radius} fill="none" stroke={attr.color} strokeWidth={strokeWidth} strokeLinecap="round" strokeDasharray={`${fill} ${circumference - fill}`} strokeDashoffset={circumference * 0.25} style={{ transition: "stroke-dasharray 1.2s cubic-bezier(0.4,0,0.2,1)", transformOrigin: "center", transform: "rotate(-90deg)" }} />
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function RingsLegend({ attributes }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "10px 18px", padding: "0 16px" }}>
      {attributes.map((attr) => {
        const Icon = attr.icon;
        return (
          <div key={attr.key} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Icon size={14} color={attr.color} variant="solid" />
            <span style={{ fontSize: 12, color: attr.color, fontWeight: 800 }}>{attr.label}</span>
            <span style={{ fontSize: 12, color: COLORS.textSecondary, fontWeight: 600 }}>{attr.value}%</span>
          </div>
        );
      })}
    </div>
  );
}

function AttributeBar({ attr, delay = 0 }) {
  const Icon = attr.icon;
  const [animated, setAnimated] = useState(false);
  useEffect(() => { const t = setTimeout(() => setAnimated(true), delay + 200); return () => clearTimeout(t); }, [delay]);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", justifycontent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: `${attr.color}15`, border: `1px solid ${attr.color}30`, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon size={18} color={attr.color} variant="solid" /></div>
          <span style={{ fontSize: 14, fontWeight: 700, color: COLORS.textPrimary }}>{attr.label}</span>
        </div>
        <span style={{ fontSize: 14, fontWeight: 800, color: attr.color }}>{attr.value}</span>
      </div>
      <div style={{ height: 6, borderRadius: 99, background: COLORS.border, overflow: "hidden" }}>
        <div style={{ height: "100%", borderRadius: 99, background: `linear-gradient(90deg, ${attr.color}80, ${attr.color})`, width: animated ? `${attr.value}%` : "0%", transition: `width 1.1s cubic-bezier(0.4,0,0.2,1) ${delay}ms` }} />
      </div>
    </div>
  );
}

function ModuleCard({ icon: Icon, label, subtitle, color, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{ background: hovered ? COLORS.elevated : COLORS.surface, border: `1px solid ${hovered ? color + "50" : COLORS.border}`, borderRadius: 18, padding: "18px", display: "flex", alignItems: "center", gap: 16, width: "100%", cursor: "pointer", transition: "all 0.2s ease", textAlign: "left" }}>
      <div style={{ width: 48, height: 48, borderRadius: 14, background: `${color}15`, border: `1px solid ${color}30`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Icon size={24} color={color} variant="solid" /></div>
      <div style={{ flex: 1 }}><div style={{ fontSize: 15, fontWeight: 800, color: COLORS.textPrimary }}>{label}</div><div style={{ fontSize: 12, color: COLORS.textSecondary, marginTop: 4, lineHeight: 1.4 }}>{subtitle}</div></div>
      <ArrowRight01Icon size={18} color={COLORS.muted} variant="stroke" />
    </button>
  );
}

function MissionCard({ icon, label, target, done, onClick }) {
  return (
    <div onClick={onClick} style={{ background: done ? `${COLORS.acidLime}0A` : COLORS.surface, border: `1px solid ${done ? COLORS.acidLime + "30" : COLORS.border}`, borderRadius: 14, padding: "14px 16px", display: "flex", alignItems: "center", gap: 14, cursor: "pointer", transition: "all 0.2s" }}>
      <span style={{ fontSize: 20 }}>{icon}</span>
      <div style={{ flex: 1 }}><div style={{ fontSize: 13, fontWeight: 700, color: done ? COLORS.acidLime : COLORS.textPrimary, transition: "color 0.2s" }}>{label}</div><div style={{ fontSize: 12, color: COLORS.textSecondary, marginTop: 2 }}>{target}</div></div>
      <div style={{ width: 22, height: 22, borderRadius: "50%", background: done ? COLORS.acidLime : COLORS.border, border: `1px solid ${done ? COLORS.acidLime : COLORS.muted}`, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}>{done && <span style={{ fontSize: 12, color: COLORS.void, fontWeight: 900 }}>✓</span>}</div>
    </div>
  );
}

function SettingsScreen({ onBack }) {
  const handleLogout = async () => { await supabase.auth.signOut(); };
  return (
    <div style={{ padding: "24px 20px", animation: "slideUpFade 0.2s ease both" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
        <h2 style={{ fontSize: 24, fontWeight: 900, color: COLORS.textPrimary, margin: 0 }}>Configurações</h2>
        <button onClick={onBack} style={{ width: 40, height: 40, borderRadius: "50%", background: COLORS.surface, border: "none", color: COLORS.textSecondary, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><Cancel01Icon size={20} variant="stroke" /></button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ padding: "18px", background: COLORS.surface, borderRadius: 16, fontSize: 15, fontWeight: 700, color: COLORS.textPrimary, border: `1px solid ${COLORS.border}`, cursor: "pointer" }}>Conta</div>
        <div style={{ padding: "18px", background: COLORS.surface, borderRadius: 16, fontSize: 15, fontWeight: 700, color: COLORS.textPrimary, border: `1px solid ${COLORS.border}`, cursor: "pointer" }}>Preferências de Treino</div>
        <div onClick={handleLogout} style={{ padding: "18px", background: COLORS.surface, borderRadius: 16, fontSize: 15, fontWeight: 700, color: COLORS.neonRose, border: `1px solid ${COLORS.border}`, cursor: "pointer" }}>Sair (Logout)</div>
      </div>
    </div>
  );
}

function NotificationsScreen({ onBack }) {
  return (
    <div style={{ padding: "24px 20px", animation: "slideUpFade 0.2s ease both" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
        <h2 style={{ fontSize: 24, fontWeight: 900, color: COLORS.textPrimary, margin: 0 }}>Notificações</h2>
        <button onClick={onBack} style={{ width: 40, height: 40, borderRadius: "50%", background: COLORS.surface, border: "none", color: COLORS.textSecondary, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><Cancel01Icon size={20} variant="stroke" /></button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, marginTop: 60, opacity: 0.5 }}>
        <Notification02Icon size={48} color={COLORS.muted} variant="stroke" />
        <p style={{ fontSize: 14, color: COLORS.textSecondary }}>Nenhuma notificação nova.</p>
      </div>
    </div>
  );
}

// ─── TELA HOME / DASHBOARD ────────────────────────────────────────────────────
function HomeScreen({ user, onNavigate }) {
  const [profile, setProfile] = useState({ name: "Carregando...", aestheticScore: 83, streak: 0 });
  const [attributes, setAttributes] = useState(ATTRIBUTES);
  
  const [missions, setMissions] = useState([
    { id: 1, icon: "🏃", label: "Corrida leve", target: "2 km hoje", done: false },
    { id: 2, icon: "💧", label: "Hidratação", target: "2L de água", done: false },
    { id: 3, icon: "😴", label: "Sono reparador", target: "8h de sono", done: false },
  ]);

  useEffect(() => {
    async function loadDashboardData() {
      if (!user) return;
      
      // 1. Carrega os dados do Perfil real
      let { data: prof } = await supabase.from("treinuu_profiles").select("*").eq("user_id", user.id).single();
      if (!prof) {
        const defaultName = user.email.split('@')[0];
        const newProf = { user_id: user.id, name: defaultName, aesthetic_score: 83, streak: 0 };
        await supabase.from("treinuu_profiles").insert(newProf);
        prof = newProf;
      }
      setProfile({ name: prof.name, aestheticScore: prof.aesthetic_score, streak: prof.streak });

      // 2. Carrega o Mapa Muscular & Sono e calcula os anéis dinamicamente
      let { data: mMap } = await supabase.from("treinuu_muscle_map").select("*").eq("user_id", user.id).single();
      if (mMap) {
        setAttributes(prev => prev.map(attr => {
          if (attr.key === "sono") {
            return { ...attr, value: mMap.sono ?? 20 };
          }
          if (attr.key === "forca") {
            // Média real dos músculos da árvore de calistenia
            const mediaForca = Math.round(((mMap.peito || 0) + (mMap.costas || 0) + (mMap.core || 0) + (mMap.ombros || 0) + (mMap.bracos || 0)) / 5);
            return { ...attr, value: mediaForca || 15 };
          }
          if (attr.key === "aparencia") {
            return { ...attr, value: prof.aesthetic_score ?? 83 };
          }
          if (attr.key === "consistencia") {
            return { ...attr, value: Math.min(100, (prof.streak || 0) * 5) };
          }
          return { ...attr, value: mMap[attr.key] !== undefined ? mMap[attr.key] : 15 }; 
        }));
      }
    }
    loadDashboardData();
  }, [user]);

  const avg = avgAtributos(attributes);
  const patente = getPatente(avg);
  const completedMissions = missions.filter(m => m.done).length;

  const toggleMission = (id) => {
    setMissions(prev => prev.map(m => m.id === id ? { ...m, done: !m.done } : m));
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0, animation: "slideUpFade 0.3s ease both" }}>
      <div style={{ padding: "24px 20px 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <p style={{ fontSize: 11, color: COLORS.textSecondary, margin: 0, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700 }}>Bom dia</p>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: COLORS.textPrimary, margin: "2px 0 0", letterSpacing: "-0.02em" }}>{profile.name}</h1>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => onNavigate("notifications")} style={{ width: 42, height: 42, borderRadius: 14, background: COLORS.surface, border: `1px solid ${COLORS.border}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><Notification01Icon size={20} color={COLORS.textSecondary} variant="solid" /></button>
          <button onClick={() => onNavigate("settings")} style={{ width: 42, height: 42, borderRadius: 14, background: COLORS.surface, border: `1px solid ${COLORS.border}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><Settings01Icon size={20} color={COLORS.textSecondary} variant="solid" /></button>
        </div>
      </div>

      <div style={{ padding: "16px 20px 16px" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: `${COLORS.amberWarm}15`, border: `1px solid ${COLORS.amberWarm}30`, borderRadius: 99, padding: "6px 14px" }}>
          <span style={{ fontSize: 16 }}>{patente.icon}</span><span style={{ fontSize: 13, fontWeight: 800, color: COLORS.amberWarm, letterSpacing: "0.04em" }}>{patente.label}</span><span style={{ fontSize: 12, color: COLORS.textSecondary, fontWeight: 600 }}>· Nível {avg}</span>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 24, margin: "10px 20px 24px" }}>
        <div style={{ textAlign: "center" }}>
          <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase", color: COLORS.cyanGlow, display: "block", marginBottom: 6 }}>Score Estético</span>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 2 }}>
            <span style={{ fontSize: 56, fontWeight: 900, lineHeight: 1, color: COLORS.textPrimary }}>{profile.aestheticScore}</span><span style={{ fontSize: 16, color: COLORS.textSecondary, fontWeight: 800 }}>/100</span>
          </div>
        </div>
        <div style={{ paddingBottom: 6 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,184,48,0.12)", borderRadius: 99, padding: "6px 14px", border: `1px solid rgba(255,184,48,0.2)` }}><FireIcon size={16} color={COLORS.amberWarm} variant="solid" /><span style={{ fontSize: 13, fontWeight: 800, color: COLORS.amberWarm }}>{profile.streak} dias</span></div>
        </div>
      </div>

      <div style={{ padding: "0px 20px 16px" }}><CharacterRings attributes={attributes} /></div>
      <div style={{ padding: "0 20px 32px" }}><RingsLegend attributes={attributes} /></div>

      <div style={{ margin: "0 20px", background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 24, padding: 24, display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}><span style={{ fontSize: 14, fontWeight: 800, color: COLORS.textPrimary }}>Atributos</span><span style={{ fontSize: 12, fontWeight: 700, color: COLORS.textSecondary, background: COLORS.elevated, padding: "4px 10px", borderRadius: 8 }}>Média {avg}</span></div>
        {attributes.map((attr, i) => <AttributeBar key={attr.key} attr={attr} delay={i * 100} />)}
      </div>

      <div style={{ padding: "32px 20px 0" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}><span style={{ fontSize: 14, fontWeight: 800, color: COLORS.textPrimary }}>Módulos de Evolução</span></div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <ModuleCard icon={Dumbbell01Icon} label="Força & Progressão" subtitle="Calistenia · Árvore de Progressão" color={COLORS.acidLime} onClick={() => onNavigate("forca")} />
          <ModuleCard icon={Activity01Icon} label="Cardio & GPS" subtitle="Corrida · Intervalado" color={COLORS.neonRose} onClick={() => onNavigate("cardio")} />
          <ModuleCard icon={SparklesIcon} label="Glow Up & Estética" subtitle="Checklist · Fotos de Evolução" color={COLORS.cyanGlow} onClick={() => onNavigate("glowup")} />
          <ModuleCard icon={BotIcon} label="IA Personal Trainer" subtitle="Chat adaptativo" color={COLORS.electricViolet} onClick={() => onNavigate("ai")} />
        </div>
      </div>

      <div style={{ padding: "32px 20px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}><Target01Icon size={18} color={COLORS.acidLime} variant="solid" /><span style={{ fontSize: 14, fontWeight: 800, color: COLORS.textPrimary }}>Missões do dia</span></div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {missions.map((m) => <MissionCard key={m.id} {...m} onClick={() => toggleMission(m.id)} />)}
        </div>
      </div>
      <div style={{ height: 110 }} />
    </div>
  );
}

// ─── APLICAÇÃO PRINCIPAL (APP WRAPPER) ────────────────────────────────────────
function MainApp({ session }) {
  const [activeTab, setActiveTab] = useState("home");
  const user = session.user;

  function navigate(tab) { setActiveTab(tab); }

  function renderContent() {
    switch (activeTab) {
      case "home": return <HomeScreen user={user} onNavigate={navigate} />;
      case "forca": return <ForcaScreen onBack={() => navigate("home")} />;
      case "cardio": return <CardioScreen onBack={() => navigate("home")} />;
      case "glowup": return <GlowUpScreen onBack={() => navigate("home")} />;
      case "ai": return <AiScreen onBack={() => navigate("home")} />;
      case "notifications": return <NotificationsScreen onBack={() => navigate("home")} />;
      case "settings": return <SettingsScreen onBack={() => navigate("home")} />;
      default: return null;
    }
  }

  const isNavTab = NAV_ITEMS.some(item => item.key === activeTab);

  return (
    <>
      <style>{`@keyframes slideUpFade { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } } * { box-sizing: border-box; } button { appearance: none; } ::-webkit-scrollbar { width: 0; }`}</style>
      <div style={{ position: "fixed", inset: 0, background: COLORS.void, fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', sans-serif", color: COLORS.textPrimary, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div key={activeTab} style={{ flex: 1, overflowY: "auto", overflowX: "hidden", WebkitOverflowScrolling: "touch" }}>
          {renderContent()}
        </div>

        {isNavTab && (
          <nav style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: `${COLORS.surface}E6`, backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderTop: `1px solid ${COLORS.border}`, display: "flex", alignItems: "center", justifyContent: "space-around", padding: "12px 0 max(12px, env(safe-area-inset-bottom))", zIndex: 100 }}>
            {NAV_ITEMS.map(({ key, label, icon: Icon }) => {
              const active = activeTab === key;
              const accentMap = { home: COLORS.textPrimary, forca: COLORS.acidLime, cardio: COLORS.neonRose, glowup: COLORS.cyanGlow, ai: COLORS.electricViolet };
              const accent = accentMap[key];

              return (
                <button key={key} onClick={() => navigate(key)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "4px 14px", background: "transparent", border: "none", cursor: "pointer" }}>
                  <Icon size={24} color={active ? accent : COLORS.muted} variant={active ? "solid" : "stroke"} />
                  <span style={{ fontSize: 11, fontWeight: active ? 800 : 600, color: active ? accent : COLORS.muted }}>{label}</span>
                </button>
              );
            })}
          </nav>
        )}
      </div>
    </>
  );
}

// ─── RAÍZ DE AUTENTICAÇÃO (O EXPORT DEFAULT) ──────────────────────────────────
export default function Treinuu() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return <div style={{ height: "100vh", background: COLORS.void, display: "flex", alignItems: "center", justifyContent: "center", color: COLORS.textSecondary }}>A carregar...</div>;

  if (!session) {
    return (
      <>
        <style>{`@keyframes slideUpFade { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } } * { box-sizing: border-box; }`}</style>
        <AuthScreen />
      </>
    );
  }

  return <MainApp key={session.user.id} session={session} />;
}