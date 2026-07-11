// Paleta do Greena — estende a paleta pastel do Applime (mint/sage/ocean/dark-purple)
// com tons ligados a dinheiro, crescimento e risco. Usado como um "radar de vida financeira":
// verde = saúde, âmbar = atenção, terracota = risco/dívida, dourado = XP/conquista.

export const greena = {
  // Base (herda do hub quando possível)
  bgMain: 'var(--bg-main)',
  bgSurface: 'var(--bg-surface)',
  borderLight: 'var(--border-light)',
  textMuted: 'var(--text-muted)',
  textDark: 'var(--applime-dark-purple)',

  // Identidade própria do Greena
  jade: '#1F6F54',        // primária — crescimento, saldo positivo
  jadeSoft: '#E4F1EC',    // fundo suave da primária
  jadeDeep: '#123F30',    // texto/ícone sobre fundo claro
  gold: '#C9A227',        // XP, conquistas, streaks
  goldSoft: '#FBF3DA',
  terracotta: '#C0533E',  // dívida, risco, estresse
  terracottaSoft: '#F7E7E3',
  slateBlue: '#3E5C76',   // liquidez / dados neutros
  slateBlueSoft: '#E7ECF1',

  radarColors: {
    saude: '#1F6F54',
    risco: '#C0533E',
    liquidez: '#3E5C76',
    liberdade: '#C9A227',
    estresse: '#8B4A6B',
  },
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
  borderRadius: '18px',
  border: '1px solid var(--border-light)',
  boxShadow: '0 4px 14px rgba(0,0,0,0.03)',
};

export const pillButtonStyle = (active, color = greena.jade) => ({
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
