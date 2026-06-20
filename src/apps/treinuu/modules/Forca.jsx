import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  ArrowLeft01Icon,
  ArrowUp01Icon,
  UserIcon,
  CheckmarkCircle02Icon,
  LockIcon,
  ArrowRight01Icon,
  Cancel01Icon,
  BookOpen01Icon,
  Target01Icon,
  Alert01Icon,
  PlayIcon,
  FireIcon,
  Clock01Icon,
  Activity01Icon
} from "hugeicons-react";

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

// ─── O GRANDE BANCO DE DADOS DE CALISTENIA (20 Exercícios) ──────────────────
const EXERCISES_DB = [
  // RAMO: EMPURRAR
  { id: 1, type: "push", defaultStatus: "current", name: "Flexão Inclinada", dbName: "incline push-up", info: "Mãos elevadas. Foco escapular.", technique: "Apoie as mãos num banco. Corpo reto. Desça controladamente.", goal: "3x15", sets: 3, reps: 15, met: 3.5, muscleGains: { peito: 8, bracos: 4 } },
  { id: 2, type: "push", defaultStatus: "locked", name: "Flexão de Joelhos", dbName: "knee push-up", info: "Reduz a carga no core.", technique: "Apoie os joelhos. Desça até o peito quase tocar o chão.", goal: "3x12", sets: 3, reps: 12, met: 4.0, muscleGains: { peito: 10, bracos: 5 } },
  { id: 3, type: "push", defaultStatus: "locked", name: "Flexão Tradicional", dbName: "push-up", info: "O clássico atemporal.", technique: "Corpo reto como uma tábua, amplitude total. Estenda os braços no topo.", goal: "4x10", sets: 4, reps: 10, met: 6.0, muscleGains: { peito: 15, bracos: 8, core: 5 } },
  { id: 4, type: "push", defaultStatus: "locked", name: "Flexão Fechada", dbName: "close grip push-up", info: "Mãos na largura dos ombros.", technique: "Cotovelos raspando nas costelas. Destrói o tríceps.", goal: "3x10", sets: 3, reps: 10, met: 6.5, muscleGains: { peito: 5, bracos: 15 } },
  { id: 5, type: "push", defaultStatus: "locked", name: "Flexão Diamante", dbName: "diamond push-up", info: "Tensão extrema no centro.", technique: "Polegares e indicadores formam um triângulo no centro do peito.", goal: "4x8", sets: 4, reps: 8, met: 7.0, muscleGains: { peito: 5, bracos: 20 } },
  { id: 6, type: "push", defaultStatus: "locked", name: "Pike Push-up", dbName: "pike push up", info: "Foco total em ombros.", technique: "Corpo em V invertido. Desça o topo da cabeça até o chão.", goal: "3x8", sets: 3, reps: 8, met: 7.5, muscleGains: { ombros: 20, bracos: 5 } },
  { id: 7, type: "push", defaultStatus: "locked", name: "Archer Push-up", dbName: "archer push up", info: "Transição para um braço.", technique: "Desça para um lado mantendo o outro braço esticado como apoio.", goal: "3x6", sets: 3, reps: 6, met: 8.5, muscleGains: { peito: 25, ombros: 10 } },
  
  // RAMO: PUXAR
  { id: 8, type: "pull", defaultStatus: "current", name: "Puxada Australiana", dbName: "inverted row", info: "Base para puxadas.", technique: "Embaixo de uma barra baixa, puxe o peito até tocar a barra.", goal: "4x10", sets: 4, reps: 10, met: 5.0, muscleGains: { costas: 15, bracos: 10 } },
  { id: 9, type: "pull", defaultStatus: "locked", name: "Barra Supinada (Chin-up)", dbName: "chin-up", info: "Foco extra em bíceps.", technique: "Mãos viradas para você, puxe até o queixo passar da barra.", goal: "3x8", sets: 3, reps: 8, met: 8.0, muscleGains: { costas: 15, bracos: 20 } },
  { id: 10, type: "pull", defaultStatus: "locked", name: "Barra Pronada (Pull-up)", dbName: "pull-up", info: "Construtor de dorsais largas.", technique: "Mãos viradas para frente. Deprima as escápulas e puxe.", goal: "4x6", sets: 4, reps: 6, met: 8.0, muscleGains: { costas: 25, bracos: 5 } },
  { id: 11, type: "pull", defaultStatus: "locked", name: "Commando Pull-up", dbName: "commando pull-up", info: "Pegada neutra alternada.", technique: "Uma mão de frente para a outra, puxe a cabeça para os lados alternados.", goal: "3x8", sets: 3, reps: 8, met: 8.5, muscleGains: { costas: 20, bracos: 15 } },
  { id: 12, type: "pull", defaultStatus: "locked", name: "Wide Grip Pull-up", dbName: "wide pull-up", info: "Expansão máxima de dorsais.", technique: "Pegada bem mais larga que a linha dos ombros.", goal: "3x5", sets: 3, reps: 5, met: 8.5, muscleGains: { costas: 30 } },
  
  // RAMO: CORE
  { id: 13, type: "core", defaultStatus: "current", name: "Prancha Alta", dbName: "high plank", info: "Base de isometria.", technique: "Posição inicial de flexão. Segure firme e não deixe o quadril cair.", goal: "3x 45s", sets: 3, reps: 45, met: 3.5, muscleGains: { core: 10, ombros: 5 } },
  { id: 14, type: "core", defaultStatus: "locked", name: "Abdominal Crunch", dbName: "crunch", info: "Contração direta.", technique: "Joelhos dobrados, levante apenas os ombros do chão, esmagando o abdômen.", goal: "4x20", sets: 4, reps: 20, met: 4.0, muscleGains: { core: 15 } },
  { id: 15, type: "core", defaultStatus: "locked", name: "Prancha Baixa", dbName: "plank", info: "Isometria nos cotovelos.", technique: "Apoio nos antebraços. Corpo reto feito tábua.", goal: "3x 60s", sets: 3, reps: 60, met: 4.0, muscleGains: { core: 20 } },
  { id: 16, type: "core", defaultStatus: "locked", name: "Elevação de Pernas", dbName: "lying leg raise", info: "Foco no infra-abdominal.", technique: "Deitado, pernas retas, suba até 90 graus e desça devagar.", goal: "3x15", sets: 3, reps: 15, met: 5.0, muscleGains: { core: 25, pernas: 5 } },
  { id: 17, type: "core", defaultStatus: "locked", name: "Hollow Body Hold", dbName: "hollow hold", info: "Tensão ginástica extrema.", technique: "Lombar colada no chão, braços e pernas elevados.", goal: "4x 30s", sets: 4, reps: 30, met: 6.0, muscleGains: { core: 30 } },
  { id: 18, type: "core", defaultStatus: "locked", name: "Hanging Leg Raise", dbName: "hanging leg raise", info: "O mestre do core.", technique: "Pendurado na barra, levante as pernas retas até a linha do quadril.", goal: "3x10", sets: 3, reps: 10, met: 7.0, muscleGains: { core: 40, costas: 5 } }
];

export default function ForcaScreen({ onBack }) {
  const [user, setUser] = useState(null);
  const [view, setView] = useState("map"); 
  
  const [muscleMap, setMuscleMap] = useState([
    { id: "peito", name: "Peito", pct: 15, color: COLORS.acidLime },
    { id: "core", name: "Abdômen/Core", pct: 20, color: COLORS.cyanGlow },
    { id: "ombros", name: "Ombros", pct: 10, color: COLORS.amberWarm },
    { id: "costas", name: "Costas", pct: 12, color: COLORS.neonRose },
    { id: "bracos", name: "Tríceps/Bíceps", pct: 15, color: COLORS.electricViolet },
    { id: "pernas", name: "Pernas", pct: 10, color: COLORS.textSecondary },
  ]);
  const [exChain, setExChain] = useState(EXERCISES_DB);
  const [selectedEx, setSelectedEx] = useState(null);
  
  const [isFetchingData, setIsFetchingData] = useState(false);
  const [exerciseImages, setExerciseImages] = useState([]);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  const [currentSet, setCurrentSet] = useState(1);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [restTimeLeft, setRestTimeLeft] = useState(0);
  const [caloriesBurned, setCaloriesBurned] = useState(0);
  const timerRef = useRef(null);
  const restTimerRef = useRef(null);

  useEffect(() => {
    async function initData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUser(user);

      try {
        let { data: mMap } = await supabase.from("treinuu_muscle_map").select("*").eq("user_id", user.id).single();
        if (!mMap) {
          const defaultMap = { user_id: user.id, peito: 15, core: 20, ombros: 10, costas: 12, bracos: 15, pernas: 10 };
          await supabase.from("treinuu_muscle_map").insert(defaultMap);
          mMap = defaultMap;
        }
        setMuscleMap([
          { id: "peito", name: "Peito", pct: mMap.peito, color: COLORS.acidLime },
          { id: "core", name: "Abdômen/Core", pct: mMap.core, color: COLORS.cyanGlow },
          { id: "ombros", name: "Ombros", pct: mMap.ombros, color: COLORS.amberWarm },
          { id: "costas", name: "Costas", pct: mMap.costas, color: COLORS.neonRose },
          { id: "bracos", name: "Tríceps/Bíceps", pct: mMap.bracos, color: COLORS.electricViolet },
          { id: "pernas", name: "Pernas", pct: mMap.pernas, color: COLORS.textSecondary },
        ]);

        const { data: progress } = await supabase.from("treinuu_exercises_progress").select("*").eq("user_id", user.id);
        const progressDict = (progress || []).reduce((acc, curr) => {
          acc[curr.exercise_db_name] = curr.status;
          return acc;
        }, {});

        const mergedChain = EXERCISES_DB.map(ex => ({
          ...ex,
          status: progressDict[ex.dbName] || ex.defaultStatus
        }));
        setExChain(mergedChain);
      } catch (err) {
        console.error("Erro ao buscar dados do Supabase:", err);
      }
    }
    initData();
  }, []);

  useEffect(() => {
    let interval;
    if (exerciseImages.length > 1) {
      interval = setInterval(() => setCurrentImgIndex(prev => (prev === 0 ? 1 : 0)), 1200); 
    }
    return () => clearInterval(interval);
  }, [exerciseImages]);

  const handleOpenExercise = async (ex) => {
    setSelectedEx(ex);
    setIsFetchingData(true);
    setExerciseImages([]);
    try {
      const response = await fetch(`https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json`);
      const data = await response.json();
      const foundExercise = data.find(e => e.name.toLowerCase().includes(ex.dbName.toLowerCase()));
      if (foundExercise && foundExercise.images && foundExercise.images.length > 0) {
        setExerciseImages(foundExercise.images.map(img => `https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/${img}`));
      }
    } catch (_) {} 
    finally { setIsFetchingData(false); }
  };

  const startWorkout = () => {
    setView("workout");
    setElapsedTime(0);
    setCurrentSet(1);
    setIsResting(false);
    timerRef.current = setInterval(() => setElapsedTime(prev => prev + 1), 1000);
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleFinishSet = () => {
    if (currentSet < selectedEx.sets) {
      setIsResting(true);
      setRestTimeLeft(60);
      restTimerRef.current = setInterval(() => {
        setRestTimeLeft(prev => {
          if (prev <= 1) { endRest(); return 0; }
          return prev - 1;
        });
      }, 1000);
    } else {
      finishWorkout();
    }
  };

  const endRest = () => {
    clearInterval(restTimerRef.current);
    setIsResting(false);
    setCurrentSet(prev => prev + 1);
  };

  const finishWorkout = async () => {
    clearInterval(timerRef.current);
    if (restTimerRef.current) clearInterval(restTimerRef.current);

    const minutes = elapsedTime / 60;
    const calcCalories = Math.round(((selectedEx.met * 3.5 * 80) / 200) * minutes);
    setCaloriesBurned(calcCalories);

    if (selectedEx.status === "current" && user) {
      await supabase.from("treinuu_strength_history").insert({
        user_id: user.id, exercise_name: selectedEx.name, sets_completed: currentSet, reps_per_set: selectedEx.reps, duration_seconds: elapsedTime, calories_burned: calcCalories
      });

      const newMap = {};
      muscleMap.forEach(m => newMap[m.id] = m.pct);
      Object.keys(selectedEx.muscleGains).forEach(mId => {
        newMap[mId] = Math.min(100, newMap[mId] + selectedEx.muscleGains[mId]);
      });
      await supabase.from("treinuu_muscle_map").update(newMap).eq("user_id", user.id);

      await supabase.from("treinuu_exercises_progress").upsert({ user_id: user.id, exercise_db_name: selectedEx.dbName, status: "completed" });
      
      const nextEx = exChain.find(e => e.type === selectedEx.type && e.id > selectedEx.id);
      if (nextEx) {
        await supabase.from("treinuu_exercises_progress").upsert({ user_id: user.id, exercise_db_name: nextEx.dbName, status: "current" });
      }

      setMuscleMap(prev => prev.map(m => ({ ...m, pct: newMap[m.id] || m.pct })));
      setExChain(prev => {
        const next = [...prev];
        const idx = next.findIndex(e => e.id === selectedEx.id);
        next[idx].status = "completed";
        if (nextEx) { const nIdx = next.findIndex(e => e.id === nextEx.id); next[nIdx].status = "current"; }
        return next;
      });
    }
    setView("summary");
  };

  // ─── TELA DO TREINO ATIVO ──────────────────────────────────────────────────
  if (view === "workout") {
    return (
      <div style={{ position: "fixed", inset: 0, background: COLORS.void, zIndex: 1000, display: "flex", flexDirection: "column", padding: "40px 20px", animation: "slideUpFade 0.3s ease both" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: `${COLORS.acidLime}15`, padding: "8px 16px", borderRadius: 99, border: `1px solid ${COLORS.acidLime}30` }}>
            <Activity01Icon size={16} color={COLORS.acidLime} variant="solid" />
            <span style={{ color: COLORS.acidLime, fontWeight: 800, fontSize: 13 }}>Protocolo Ativo</span>
          </div>
          <span style={{ color: COLORS.textSecondary, fontWeight: 800, fontSize: 13, letterSpacing: "1px" }}>{formatTime(elapsedTime)}</span>
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
          <h2 style={{ fontSize: 28, fontWeight: 900, color: COLORS.textPrimary, margin: "0 0 8px", textAlign: "center" }}>{selectedEx.name}</h2>
          <p style={{ fontSize: 14, color: COLORS.textSecondary, marginBottom: 40, textAlign: "center" }}>Meta da Série: {selectedEx.reps} Repetições</p>
          
          <div style={{ position: "relative", width: 200, height: 200, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", background: isResting ? `${COLORS.cyanGlow}10` : `${COLORS.acidLime}10`, border: `2px solid ${isResting ? COLORS.cyanGlow : COLORS.acidLime}` }}>
            {isResting ? (
              <div style={{ textAlign: "center", animation: "pulse 1.5s infinite" }}>
                <span style={{ fontSize: 14, color: COLORS.cyanGlow, fontWeight: 800, textTransform: "uppercase" }}>Descanso</span>
                <div style={{ fontSize: 48, fontWeight: 900, color: COLORS.textPrimary, lineHeight: 1, marginTop: 8 }}>{restTimeLeft}s</div>
              </div>
            ) : (
              <div style={{ textAlign: "center" }}>
                <span style={{ fontSize: 14, color: COLORS.acidLime, fontWeight: 800, textTransform: "uppercase" }}>Série Atual</span>
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", marginTop: 8 }}>
                  <span style={{ fontSize: 56, fontWeight: 900, color: COLORS.textPrimary, lineHeight: 1 }}>{currentSet}</span>
                  <span style={{ fontSize: 24, fontWeight: 800, color: COLORS.textSecondary }}>/{selectedEx.sets}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {isResting ? (
          <button onClick={endRest} style={{ padding: "20px", borderRadius: 99, background: COLORS.surface, border: `1px solid ${COLORS.cyanGlow}`, color: COLORS.cyanGlow, fontSize: 16, fontWeight: 900, cursor: "pointer" }}>Pular Descanso ➔</button>
        ) : (
          <button onClick={handleFinishSet} style={{ padding: "20px", borderRadius: 99, background: COLORS.acidLime, border: "none", color: COLORS.void, fontSize: 16, fontWeight: 900, cursor: "pointer", boxShadow: `0 8px 30px ${COLORS.acidLime}40` }}>{currentSet === selectedEx.sets ? "Finalizar Treino ✓" : "Concluir Série"}</button>
        )}
      </div>
    );
  }

  // ─── TELA DE RESUMO DE TREINO ──────────────────────────────────────────────
  if (view === "summary") {
    return (
      <div style={{ position: "fixed", inset: 0, background: COLORS.void, zIndex: 1000, display: "flex", flexDirection: "column", padding: "40px 20px", animation: "slideUpFade 0.3s ease both" }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
          <div style={{ width: 80, height: 80, borderRadius: "50%", background: `${COLORS.acidLime}20`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
            <CheckmarkCircle02Icon size={40} color={COLORS.acidLime} variant="solid" />
          </div>
          <h2 style={{ fontSize: 32, fontWeight: 900, color: COLORS.textPrimary, margin: "0 0 8px" }}>Treino Validado</h2>
          <p style={{ fontSize: 14, color: COLORS.textSecondary, marginBottom: 40, textAlign: "center" }}>Evolução muscular salva no Supabase.</p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, width: "100%" }}>
            <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: "20px", textAlign: "center" }}>
              <Clock01Icon size={24} color={COLORS.cyanGlow} variant="solid" style={{ marginBottom: 12 }} />
              <div style={{ fontSize: 24, fontWeight: 900, color: COLORS.textPrimary }}>{formatTime(elapsedTime)}</div>
              <div style={{ fontSize: 12, color: COLORS.textSecondary, fontWeight: 700, textTransform: "uppercase" }}>Tempo Total</div>
            </div>
            <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: "20px", textAlign: "center" }}>
              <FireIcon size={24} color={COLORS.amberWarm} variant="solid" style={{ marginBottom: 12 }} />
              <div style={{ fontSize: 24, fontWeight: 900, color: COLORS.textPrimary }}>{caloriesBurned}</div>
              <div style={{ fontSize: 12, color: COLORS.textSecondary, fontWeight: 700, textTransform: "uppercase" }}>Kcal Gastas</div>
            </div>
          </div>
        </div>
        <button onClick={() => { setView("map"); setSelectedEx(null); }} style={{ padding: "20px", borderRadius: 99, background: COLORS.surface, border: `1px solid ${COLORS.border}`, color: COLORS.textPrimary, fontSize: 16, fontWeight: 900, cursor: "pointer" }}>Voltar ao Mapa</button>
      </div>
    );
  }

  // ─── TELA PRINCIPAL E MODAL CENTRALIZADO ──────────────────────────────────
  return (
    <>
      {/* CONTEÚDO PRINCIPAL (DENTRO DA DIV ANIMADA) */}
      <div style={{ padding: "24px 20px 120px", animation: "slideUpFade 0.3s ease both" }}>
        
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
          <button onClick={onBack} style={{ width: 40, height: 40, borderRadius: 14, background: COLORS.surface, border: `1px solid ${COLORS.border}`, color: COLORS.textPrimary, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><ArrowLeft01Icon size={20} variant="stroke" /></button>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 900, color: COLORS.textPrimary, margin: 0 }}>Força & Progressão</h2>
            <p style={{ fontSize: 12, color: COLORS.textSecondary, margin: "2px 0 0" }}>Evolução de Calistenia</p>
          </div>
        </div>

        <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 24, padding: 20, marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}><UserIcon size={18} color={COLORS.acidLime} variant="solid" /><span style={{ fontSize: 14, fontWeight: 800, color: COLORS.textPrimary }}>Mapa Muscular Real</span></div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 20px" }}>
            {muscleMap.map((m) => (
              <div key={m.id} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 700 }}><span style={{ color: COLORS.textSecondary }}>{m.name}</span><span style={{ color: m.color }}>{m.pct}%</span></div>
                <div style={{ height: 4, background: COLORS.border, borderRadius: 99, overflow: "hidden" }}><div style={{ height: "100%", background: m.color, width: `${m.pct}%`, transition: "width 1s cubic-bezier(0.4, 0, 0.2, 1)" }} /></div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 24, padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}><ArrowUp01Icon size={18} color={COLORS.cyanGlow} variant="solid" /><span style={{ fontSize: 14, fontWeight: 800, color: COLORS.textPrimary }}>Árvore de Habilidades</span></div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {exChain.map((ex) => {
              const isCompleted = ex.status === "completed"; const isCurrent = ex.status === "current"; const isLocked = ex.status === "locked";
              let nodeBorder = COLORS.border; let nodeBg = COLORS.void; let titleColor = COLORS.textSecondary;
              if (isCompleted) { nodeBorder = COLORS.acidLime; titleColor = COLORS.textPrimary; }
              if (isCurrent) { nodeBorder = COLORS.cyanGlow; nodeBg = `${COLORS.cyanGlow}10`; titleColor = COLORS.textPrimary; }

              return (
                <div key={ex.id} onClick={() => handleOpenExercise(ex)} style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 16px", background: nodeBg, border: `1px solid ${nodeBorder}`, borderRadius: 16, cursor: "pointer" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {isCompleted && <CheckmarkCircle02Icon size={24} color={COLORS.acidLime} variant="solid" />}
                    {isCurrent && <div style={{ width: 22, height: 22, borderRadius: "50%", border: `3px solid ${COLORS.cyanGlow}`, background: COLORS.void }} />}
                    {isLocked && <LockIcon size={20} color={COLORS.muted} variant="solid" />}
                  </div>
                  <div style={{ flex: 1 }}><div style={{ fontSize: 14, fontWeight: 800, color: titleColor }}>{ex.name}</div><div style={{ fontSize: 11, color: COLORS.textSecondary, marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 200 }}>{ex.type.toUpperCase()} · {ex.info}</div></div>
                  <ArrowRight01Icon size={14} color={COLORS.muted} variant="stroke" />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* MODAL CENTRALIZADO (FORA DA DIV ANIMADA PARA O FIXED FUNCIONAR) */}
      {selectedEx && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(4,6,10,0.8)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10000, padding: "20px" }}>
          
          <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 24, width: "100%", maxWidth: 420, maxHeight: "85vh", overflowY: "auto", padding: "24px", animation: "scaleUp 0.2s ease both", display: "flex", flexDirection: "column" }}>
            
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20, flexShrink: 0 }}>
              <div>
                <span style={{ fontSize: 11, fontWeight: 800, color: selectedEx.status === "completed" ? COLORS.acidLime : selectedEx.status === "current" ? COLORS.cyanGlow : COLORS.muted, textTransform: "uppercase" }}>{selectedEx.status}</span>
                <h3 style={{ fontSize: 20, fontWeight: 900, color: COLORS.textPrimary, margin: "4px 0 0" }}>{selectedEx.name}</h3>
              </div>
              <button onClick={() => setSelectedEx(null)} style={{ width: 36, height: 36, borderRadius: "50%", background: COLORS.void, border: `1px solid ${COLORS.border}`, color: COLORS.textSecondary, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
                <Cancel01Icon size={16} variant="stroke" />
              </button>
            </div>

            <div style={{ width: "100%", height: 200, background: COLORS.void, borderRadius: 16, border: `1px solid ${COLORS.border}`, marginBottom: 20, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, color: COLORS.textSecondary, overflow: "hidden", position: "relative", flexShrink: 0 }}>
              {isFetchingData ? (
                <span style={{ fontSize: 12, fontWeight: 600 }}>Baixando demonstração...</span>
              ) : exerciseImages.length > 0 ? (
                <img src={exerciseImages[currentImgIndex]} alt={selectedEx.name} style={{ width: "100%", height: "100%", objectFit: "contain", background: "#FFF" }} />
              ) : (
                <>
                  {selectedEx.status === "locked" ? <LockIcon size={32} color={COLORS.muted} variant="solid" /> : <Alert01Icon size={32} color={COLORS.neonRose} variant="stroke" />}
                  <span style={{ fontSize: 11, fontWeight: 600 }}>{selectedEx.status === "locked" ? "Demonstração Trancada" : "Mídia não encontrada na base."}</span>
                </>
              )}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16, flexShrink: 0 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 800, color: COLORS.textSecondary, marginBottom: 4 }}><Target01Icon size={14} variant="solid" /> Objetivo da Série</div>
                <p style={{ fontSize: 14, color: COLORS.acidLime, margin: 0, fontWeight: 700 }}>{selectedEx.goal}</p>
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 800, color: COLORS.textSecondary, marginBottom: 4 }}><BookOpen01Icon size={14} variant="solid" /> Técnica de Execução</div>
                <p style={{ fontSize: 13, color: COLORS.textPrimary, margin: 0, lineHeight: 1.5 }}>{selectedEx.technique}</p>
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 800, color: COLORS.textSecondary, marginBottom: 4 }}><FireIcon size={14} variant="solid" /> MET (Gasto Energético)</div>
                <p style={{ fontSize: 13, color: COLORS.amberWarm, margin: 0, fontWeight: 700 }}>Fator {selectedEx.met}</p>
              </div>
            </div>

            <button 
              disabled={selectedEx.status === "locked"} 
              onClick={() => selectedEx.status !== "locked" && startWorkout()} 
              style={{ width: "100%", padding: "16px", borderRadius: 16, background: selectedEx.status === "locked" ? COLORS.border : COLORS.cyanGlow, border: "none", color: selectedEx.status === "locked" ? COLORS.muted : COLORS.void, fontWeight: 900, fontSize: 15, marginTop: 24, cursor: selectedEx.status === "locked" ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, flexShrink: 0 }}
            >
              {selectedEx.status === "locked" ? "Nível Bloqueado" : <><PlayIcon size={20} variant="solid" /> Iniciar Protocolo</>}
            </button>

          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse { 0% { transform: scale(0.95); opacity: 0.8; } 50% { transform: scale(1); opacity: 1; } 100% { transform: scale(0.95); opacity: 0.8; } }
        @keyframes scaleUp { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
      `}</style>
    </>
  );
}