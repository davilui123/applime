// Paleta Greena — inspirada no BB (verde vibrante, amarelo, azul escuro)
// Estende as variáveis do hub quando possível.

export const greena = {
  // Base (herda do hub)
  bgMain: 'var(--bg-main)',
  bgSurface: 'var(--bg-surface)',
  borderLight: 'var(--border-light)',
  textMuted: 'var(--text-muted)',
  textDark: 'var(--applime-dark-purple)',

  // Cores primárias Greena (nova paleta BB)
  verde: '#00875A',          // primário vibrante (substitui jade)
  verdeSoft: '#E6F4EE',      // fundo suave
  verdeDeep: '#005A3E',      // texto sobre fundo claro
  amarelo: '#FFB800',        // destaque, XP, conquistas
  amareloSoft: '#FFF4D9',
  azulEscuro: '#003366',     // confiança, headers
  terracota: '#C0533E',      // dívida/risco (mantido)
  terracotaSoft: '#F7E7E3',
  slateBlue: '#3E5C76',      // dados neutros
  slateBlueSoft: '#E7ECF1',
  cinzaClaro: '#F5F8FA',     // fundo alternativo

  // Cores do Radar (mantidas, mas ajustadas)
  radarColors: {
    saude: '#00875A',
    risco: '#C0533E',
    liquidez: '#3E5C76',
    liberdade: '#FFB800',
    estresse: '#8B4A6B',
  },

  // Aliases para compatibilidade com código existente
  jade: '#00875A',
  jadeSoft: '#E6F4EE',
  jadeDeep: '#005A3E',
  gold: '#FFB800',
  goldSoft: '#FFF4D9',
  terracotta: '#C0533E',
  terracottaSoft: '#F7E7E3',
};

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

export const cardStyle = {
  backgroundColor: 'var(--bg-surface)',
  borderRadius: '20px',
  border: '1px solid var(--border-light)',
  boxShadow: '0 4px 14px rgba(0,0,0,0.04)',
  padding: '16px',
};

export const pillButtonStyle = (active, color = greena.verde) => ({
  padding: '7px 16px',
  borderRadius: '20px',
  fontSize: '0.78rem',
  fontWeight: 700,
  cursor: 'pointer',
  border: `1px solid ${active ? color : 'var(--border-light)'}`,
  backgroundColor: active ? color : 'transparent',
  color: active ? '#fff' : 'var(--text-muted)',
  transition: 'all 0.15s ease',
  whiteSpace: 'nowrap',
});