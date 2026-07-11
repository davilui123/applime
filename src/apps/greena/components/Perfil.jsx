import { useState, useEffect } from 'react';
import { usePerfil, useScoreHistorico, salvarScoreMesAtual } from '../hooks/useGreenaData';
import { greena, formatBRL, cardStyle, pillButtonStyle } from '../lib/theme';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const labelStyle = {
  fontSize: '0.7rem',
  fontWeight: 700,
  color: '#6b7280',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  display: 'block',
  marginBottom: '4px',
};

const inputStyle = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: '12px',
  border: '1px solid #d1d5db',
  fontSize: '0.9rem',
  boxSizing: 'border-box',
  backgroundColor: '#f9fafb',
  color: '#241458',
  outline: 'none',
  transition: 'border-color 0.2s',
};

function ComparativoScore({ perfil, onUpdate }) {
  const [serasa, setSerasa] = useState(perfil?.score_serasa || '');
  const [nubank, setNubank] = useState(perfil?.score_nubank || '');
  const [salvando, setSalvando] = useState(false);

  const handleSalvar = async () => {
    setSalvando(true);
    await onUpdate({
      score_serasa: Number(serasa) || null,
      score_nubank: Number(nubank) || null,
    });
    setSalvando(false);
  };

  return (
    <div style={{ ...cardStyle, padding: '18px', marginTop: '16px' }}>
      <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#241458', marginBottom: '14px' }}>
        Comparativo com scores externos
      </h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {/* Serasa */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src="/logo-serasa.png" alt="Serasa" style={{ width: '36px', height: '36px', objectFit: 'contain' }} />
          <input
            type="number"
            value={serasa}
            onChange={(e) => setSerasa(e.target.value)}
            placeholder="Score Serasa"
            style={inputStyle}
          />
        </div>

        {/* Nubank */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src="/logo-nubank.png" alt="Nubank" style={{ width: '36px', height: '36px', objectFit: 'contain' }} />
          <input
            type="number"
            value={nubank}
            onChange={(e) => setNubank(e.target.value)}
            placeholder="Score Nubank"
            style={inputStyle}
          />
        </div>

        <button
          onClick={handleSalvar}
          disabled={salvando}
          style={{
            ...pillButtonStyle(true, '#8052fe'),
            alignSelf: 'flex-start',
            padding: '10px 24px',
            marginTop: '4px',
          }}
        >
          {salvando ? '...' : 'Atualizar scores'}
        </button>
      </div>

      {perfil && (
        <div style={{ display: 'flex', gap: '24px', marginTop: '16px', flexWrap: 'wrap', borderTop: '1px solid #e5e7eb', paddingTop: '14px' }}>
          <div><span style={{ fontWeight: 700, color: '#241458' }}>Greena:</span> {perfil.score_organizacao || '—'}</div>
          <div><span style={{ fontWeight: 700, color: '#241458' }}>Serasa:</span> {perfil.score_serasa || '—'}</div>
          <div><span style={{ fontWeight: 700, color: '#241458' }}>Nubank:</span> {perfil.score_nubank || '—'}</div>
        </div>
      )}
    </div>
  );
}

export default function Perfil() {
  const { perfil, loading: loadingPerfil, atualizar: atualizarPerfil } = usePerfil();
  const { dados: historico, loading: loadingHistorico, recarregar } = useScoreHistorico();
  const [ranking, setRanking] = useState(null);

  useEffect(() => {
    (async () => {
      await salvarScoreMesAtual();
      recarregar();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!historico.length || !perfil) return;
    const atual = perfil.score_organizacao || 0;
    const hoje = new Date();
    const tresMesesAtras = new Date(hoje.getFullYear(), hoje.getMonth() - 3, 1);
    const tresMesesStr = tresMesesAtras.toISOString().slice(0, 10);
    const antigo = historico.find(h => h.mes_referencia === tresMesesStr);
    if (antigo && antigo.score_organizacao) {
      const diff = atual - Number(antigo.score_organizacao);
      const percentual = Number(antigo.score_organizacao) > 0 ? (diff / Number(antigo.score_organizacao)) * 100 : 0;
      setRanking({ diff, percentual, antigo: Number(antigo.score_organizacao) });
    } else {
      setRanking(null);
    }
  }, [historico, perfil]);

  if (loadingPerfil || loadingHistorico) {
    return <div style={{ padding: '40px 0', textAlign: 'center', color: '#6b7280' }}>Carregando perfil…</div>;
  }

  const dadosGrafico = historico.slice(-12).map(h => ({
    mes: new Date(h.mes_referencia).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }),
    score: Number(h.score_organizacao) || 0,
  }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{
        ...cardStyle,
        padding: '18px',
        background: 'linear-gradient(135deg, #e8fafd 0%, #ffffff 100%)',
        borderLeft: `6px solid #8052fe`,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#241458', textTransform: 'uppercase' }}>
              Seu Score de Organização
            </span>
            <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#241458' }}>
              {perfil?.score_organizacao || '—'}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
              Patrimônio líquido: {formatBRL(perfil?.patrimonio_liquido || 0)}
            </div>
          </div>
          {ranking && (
            <div style={{
              textAlign: 'center',
              backgroundColor: '#ffffff',
              padding: '10px 14px',
              borderRadius: '16px',
              border: `1px solid #fdfc30`,
              boxShadow: '0 4px 12px rgba(253,252,48,0.2)',
            }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase' }}>
                vs. 3 meses
              </div>
              <div style={{
                fontSize: '1.5rem',
                fontWeight: 900,
                color: ranking.diff >= 0 ? '#00c853' : '#ff797f',
              }}>
                {ranking.diff >= 0 ? '+' : ''}{ranking.percentual.toFixed(1)}%
              </div>
              <div style={{ fontSize: '0.7rem', color: '#6b7280' }}>
                {ranking.antigo} → {perfil.score_organizacao}
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={{ ...cardStyle, padding: '18px' }}>
        <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#241458', marginBottom: '8px' }}>
          Evolução do Score
        </h4>
        {dadosGrafico.length < 2 ? (
          <p style={{ color: '#6b7280', fontSize: '0.85rem' }}>
            Ainda não há dados suficientes para o gráfico. Continue usando o Greena!
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={dadosGrafico}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="mes" tick={{ fontSize: 10 }} stroke="#6b7280" />
              <YAxis domain={[0, 1000]} tick={{ fontSize: 10 }} stroke="#6b7280" />
              <Tooltip formatter={(value) => `${value} pts`} />
              <Line type="monotone" dataKey="score" stroke="#8052fe" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      <ComparativoScore perfil={perfil} onUpdate={atualizarPerfil} />
    </div>
  );
}