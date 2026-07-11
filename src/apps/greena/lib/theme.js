// Paleta Greena — baseada nas suas cores
export const greena = {
  // Suas cores principais
  amarelo: '#fdfc30',
  roxo: '#8052fe',
  rosa: '#ff797f',
  azul: '#4151d2',
  roxoClaro: '#7f51fd',
  azulClaro: '#e8fafd',
  roxoEscuro: '#241458',

  // Cores derivadas para compatibilidade
  verde: '#00c853',
  verdeEscuro: '#009624',
  verdeClaro: '#e8fafd',
  vermelho: '#ff797f',
  vermelhoClaro: '#ffebee',
  cinza: '#6b7280',
  cinzaClaro: '#f3f4f6',
  branco: '#ffffff',
  preto: '#111827',

  // Fundos e superfícies
  bgMain: '#e8fafd',
  bgSurface: '#ffffff',
  borderLight: '#d1d5db',
  textMuted: '#6b7280',
  textDark: '#241458',

  // Radar (mantido)
  radarColors: {
    saude: '#00c853',
    risco: '#ff797f',
    liquidez: '#4151d2',
    liberdade: '#fdfc30',
    estresse: '#8052fe',
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

// Estilos reutilizáveis
export const cardStyle = {
  backgroundColor: '#ffffff',
  borderRadius: '20px',
  border: '1px solid #d1d5db',
  boxShadow: '0 4px 16px rgba(37, 20, 88, 0.08)',
  padding: '18px',
  transition: 'all 0.2s ease',
};

export const pillButtonStyle = (active, color = '#00c853') => ({
  padding: '8px 18px',
  borderRadius: '30px',
  fontSize: '0.78rem',
  fontWeight: 700,
  cursor: 'pointer',
  border: `2px solid ${active ? color : '#d1d5db'}`,
  backgroundColor: active ? color : 'transparent',
  color: active ? '#ffffff' : '#241458',
  transition: 'all 0.2s ease',
  boxShadow: active ? `0 4px 12px ${color}44` : 'none',
  whiteSpace: 'nowrap',
});