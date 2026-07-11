// Paleta Greena — inspirada nas referências visuais do Banco do Brasil
// Cores fortes, contraste alto, identidade própria

export const greena = {
  // Cores primárias
  verde: '#00875A',        // principal — crescimento, saldo positivo, ações
  verdeEscuro: '#006644',  // para hover, ênfase
  verdeClaro: '#E6F5F0',   // fundos suaves
  azul: '#003366',         // confiança, textos, cabeçalhos
  azulEscuro: '#002244',   // para contraste
  amarelo: '#FFB800',      // destaque, XP, conquistas, alertas
  amareloClaro: '#FFF8E1',
  vermelho: '#C0533E',     // dívida, risco, estresse
  vermelhoClaro: '#F7E7E3',
  cinza: '#6B7280',        // textos secundários
  cinzaClaro: '#F3F4F6',   // fundos de cards, inputs
  branco: '#FFFFFF',
  preto: '#111827',

  // Fundos e superfícies (substituem as variáveis do hub)
  bgMain: '#F5F8FA',       // fundo principal da tela
  bgSurface: '#FFFFFF',    // cards, modais
  borderLight: '#E5E7EB',  // bordas suaves
  textMuted: '#6B7280',    // textos secundários
  textDark: '#003366',     // textos principais

  // Radar (mantido para compatibilidade, mas com novas cores)
  radarColors: {
    saude: '#00875A',
    risco: '#C0533E',
    liquidez: '#003366',
    liberdade: '#FFB800',
    estresse: '#8B4A6B',
  },
};

// Formatações
export function formatBRL(valor) {
  const n = Number(valor) || 0;
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function formatPercent(valor, casas = 0) {
  const n = Number(valor) || 0;
  return `${n.toFixed(casas)}%`;
}

export function formatDataCurta(data) {
  if (!data) return '—';
  const d = new Date(`${data}T00:00:00`);
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
}

// Estilos reutilizáveis com a nova cara
export const cardStyle = {
  backgroundColor: '#FFFFFF',
  borderRadius: '20px',
  border: '1px solid #E5E7EB',
  boxShadow: '0 4px 16px rgba(0,51,102,0.06)',
  padding: '18px',
  transition: 'all 0.2s ease',
};

export const pillButtonStyle = (active, color = greena.verde) => ({
  padding: '8px 18px',
  borderRadius: '30px',
  fontSize: '0.78rem',
  fontWeight: 700,
  cursor: 'pointer',
  border: `2px solid ${active ? color : '#E5E7EB'}`,
  backgroundColor: active ? color : 'transparent',
  color: active ? '#FFFFFF' : greena.azul,
  transition: 'all 0.2s ease',
  boxShadow: active ? `0 4px 12px ${color}44` : 'none',
  whiteSpace: 'nowrap',
});