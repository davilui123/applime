import { useState, useRef, useEffect } from "react";
import {
  ArrowLeft01Icon,
  BotIcon,
  SparklesIcon,
  ArrowUp02Icon,
  Activity01Icon,
  Dumbbell01Icon,
  CheckmarkCircle02Icon
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

// ─── Lógica de Simulação da IA ────────────────────────────────────────────────
const MOCK_RESPONSES = [
  {
    keywords: ["cansado", "exaurido", "destruído", "😞"],
    text: "Compreendo perfeitamente. O descanso também faz parte do processo. Reduzi o teu treino de hoje em 20% e foquei na mobilidade e recuperação ativa. O que achas desta adaptação?",
    actionCard: {
      type: "recovery",
      title: "Treino Adaptado: Recuperação",
      icon: Activity01Icon,
      color: COLORS.electricViolet,
      details: ["15 min Alongamento Dinâmico", "Corrida leve (Z1) - 2 km", "Rolamento Miofascial"],
      buttonText: "Aceitar e Treinar"
    }
  },
  {
    keywords: ["atleta", "físico", "evoluir", "forte", "🔥", "excelente", "😄"],
    text: "Essa é a atitude! Vamos elevar a fasquia. Para atingires esse físico de atleta, priorizei um circuito de calistenia avançado para o tronco, seguido de tiros de corrida.",
    actionCard: {
      type: "athlete",
      title: "Treino Adaptado: Modo Atleta",
      icon: Dumbbell01Icon,
      color: COLORS.acidLime,
      details: ["Flexões Archer - 4x8", "Planche Progressions - 10 min", "Tiros 400m - 5x (Pace 4:30)"],
      buttonText: "Aceitar o Desafio"
    }
  },
  {
    keywords: ["neutro", "bem", "normal", "🙂", "😐"],
    text: "Ótimo. Vamos manter o plano original e garantir a tua consistência hoje. O teu treino principal já está na fila.",
    actionCard: {
      type: "standard",
      title: "Treino do Dia: Força Base",
      icon: Dumbbell01Icon,
      color: COLORS.cyanGlow,
      details: ["Flexões Tradicionais - 4x12", "Trabalho de Core - 10 min"],
      buttonText: "Iniciar Treino Original"
    }
  }
];

export default function AiScreen({ onBack }) {
  const chatEndRef = useRef(null);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Estado inicial do chat com o Check-in de Humor
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "ai",
      text: "Olá! Sou o teu Treinuu IA. Antes de prescrever o teu treino de hoje, diz-me: como te estás a sentir?",
      isMoodCheckin: true,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  // Auto-scroll para a última mensagem
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = (text, isMood = false) => {
    if (!text.trim()) return;

    // 1. Adiciona a mensagem do utilizador
    const userMsg = {
      id: Date.now(),
      sender: "user",
      text: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);

    // 2. Simula o tempo de resposta da IA
    setTimeout(() => {
      let aiResponse = {
        id: Date.now() + 1,
        sender: "ai",
        text: "Registei a tua informação. Continua com o foco, vou adaptar o teu planeamento semanal com base nos teus resultados de hoje.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      // Procura palavras-chave para gerar uma resposta inteligente e um cartão de treino
      const lowerText = text.toLowerCase();
      const match = MOCK_RESPONSES.find(resp => 
        resp.keywords.some(kw => lowerText.includes(kw))
      );

      if (match) {
        aiResponse.text = match.text;
        aiResponse.actionCard = match.actionCard;
      }

      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500); // 1.5s de delay simulado
  };

  const handleMoodSelect = (moodText) => {
    // Remove o bloco de botões de humor da mensagem inicial para limpar o ecrã
    setMessages(prev => prev.map(msg => msg.isMoodCheckin ? { ...msg, isMoodCheckin: false } : msg));
    handleSend(moodText, true);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: COLORS.void, animation: "slideUpFade 0.3s ease both" }}>
      
      {/* Topbar Fixa */}
      <div style={{ padding: "40px 20px 20px", display: "flex", alignItems: "center", gap: 14, background: `${COLORS.surface}E6`, backdropFilter: "blur(20px)", borderBottom: `1px solid ${COLORS.border}`, zIndex: 10 }}>
        <button onClick={onBack} style={{ width: 40, height: 40, borderRadius: 14, background: COLORS.void, border: `1px solid ${COLORS.border}`, color: COLORS.textPrimary, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <ArrowLeft01Icon size={20} variant="stroke" />
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <h2 style={{ fontSize: 18, fontWeight: 900, color: COLORS.textPrimary, margin: 0 }}>Treinuu AI</h2>
            <SparklesIcon size={14} color={COLORS.electricViolet} variant="solid" />
          </div>
          <p style={{ fontSize: 12, color: COLORS.electricViolet, margin: "2px 0 0", fontWeight: 700 }}>Personal Trainer Inteligente</p>
        </div>
      </div>

      {/* Área de Chat (Scrollable) */}
      <div style={{ flex: 1, overflowY: "auto", padding: "24px 20px", display: "flex", flexDirection: "column", gap: 24, paddingBottom: 120 }}>
        {messages.map((msg) => {
          const isUser = msg.sender === "user";
          return (
            <div key={msg.id} style={{ display: "flex", flexDirection: "column", alignItems: isUser ? "flex-end" : "flex-start", gap: 8 }}>
              
              <div style={{ display: "flex", gap: 12, maxWidth: "85%", flexDirection: isUser ? "row-reverse" : "row" }}>
                {/* Avatar */}
                {!isUser && (
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: `${COLORS.electricViolet}20`, border: `1px solid ${COLORS.electricViolet}40`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <BotIcon size={20} color={COLORS.electricViolet} variant="solid" />
                  </div>
                )}
                
                {/* Balão de Mensagem */}
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div style={{ background: isUser ? COLORS.elevated : "transparent", border: isUser ? `1px solid ${COLORS.border}` : "none", padding: isUser ? "12px 16px" : "0 4px", borderRadius: isUser ? "20px 20px 4px 20px" : "0", color: COLORS.textPrimary, fontSize: 15, lineHeight: 1.5 }}>
                    {msg.text}
                  </div>
                  
                  {/* Cartão de Ação Gerado pela IA */}
                  {msg.actionCard && (
                    <div style={{ background: COLORS.surface, border: `1px solid ${msg.actionCard.color}40`, borderRadius: 16, padding: 16, width: "100%", minWidth: 260 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                        <msg.actionCard.icon size={20} color={msg.actionCard.color} variant="solid" />
                        <span style={{ fontSize: 13, fontWeight: 800, color: msg.actionCard.color }}>{msg.actionCard.title}</span>
                      </div>
                      <ul style={{ margin: "0 0 16px", paddingLeft: 20, color: COLORS.textSecondary, fontSize: 13, display: "flex", flexDirection: "column", gap: 6 }}>
                        {msg.actionCard.details.map((detail, idx) => <li key={idx}>{detail}</li>)}
                      </ul>
                      <button style={{ width: "100%", padding: "12px", borderRadius: 10, background: msg.actionCard.color, color: COLORS.void, border: "none", fontWeight: 900, fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, cursor: "pointer" }}>
                        <CheckmarkCircle02Icon size={16} variant="solid" />
                        {msg.actionCard.buttonText}
                      </button>
                    </div>
                  )}

                  {/* Widget de Check-in de Humor Inicial */}
                  {msg.isMoodCheckin && (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 8 }}>
                      {[
                        { emoji: "😄", label: "Excelente" },
                        { emoji: "🙂", label: "Bem" },
                        { emoji: "😐", label: "Neutro" },
                        { emoji: "😞", label: "Cansado" }
                      ].map((mood, idx) => (
                        <button key={idx} onClick={() => handleMoodSelect(`${mood.emoji} Hoje sinto-me ${mood.label.toLowerCase()}.`)} style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: "12px 8px", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, cursor: "pointer", transition: "all 0.2s" }}>
                          <span style={{ fontSize: 24 }}>{mood.emoji}</span>
                          <span style={{ fontSize: 12, fontWeight: 700, color: COLORS.textPrimary }}>{mood.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Timestamp */}
              <span style={{ fontSize: 10, color: COLORS.muted, margin: isUser ? "0 16px 0 0" : "0 0 0 48px", fontWeight: 600 }}>
                {msg.time}
              </span>
            </div>
          );
        })}

        {/* Indicador de "A escrever..." */}
        {isTyping && (
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: `${COLORS.electricViolet}20`, border: `1px solid ${COLORS.electricViolet}40`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <BotIcon size={20} color={COLORS.electricViolet} variant="solid" />
            </div>
            <div style={{ display: "flex", gap: 4, padding: "12px 16px", background: "transparent" }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: COLORS.muted, animation: "bounce 1.4s infinite ease-in-out both" }} />
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: COLORS.muted, animation: "bounce 1.4s infinite ease-in-out both", animationDelay: "0.2s" }} />
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: COLORS.muted, animation: "bounce 1.4s infinite ease-in-out both", animationDelay: "0.4s" }} />
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Área de Input Fixa no Fundo */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, padding: "16px 20px 32px", background: `linear-gradient(to top, ${COLORS.void} 85%, transparent)`, zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, background: COLORS.surface, border: `1px solid ${COLORS.border}`, padding: "6px 6px 6px 16px", borderRadius: 99 }}>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend(inputText)}
            placeholder="Escreve para a tua IA..."
            style={{ flex: 1, background: "transparent", border: "none", color: COLORS.textPrimary, fontSize: 15, outline: "none" }}
          />
          <button 
            onClick={() => handleSend(inputText)}
            disabled={!inputText.trim()}
            style={{ width: 40, height: 40, borderRadius: "50%", background: inputText.trim() ? COLORS.electricViolet : COLORS.elevated, border: "none", display: "flex", alignItems: "center", justifyContent: "center", color: inputText.trim() ? COLORS.void : COLORS.muted, cursor: inputText.trim() ? "pointer" : "not-allowed", transition: "all 0.2s" }}
          >
            <ArrowUp02Icon size={20} variant="solid" />
          </button>
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
}