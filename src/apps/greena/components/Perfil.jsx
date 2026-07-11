import { useState, useEffect } from 'react';
import { usePerfil, useScoreHistorico, salvarScoreMesAtual } from '../hooks/useGreenaData';
import { greena, formatBRL, cardStyle, pillButtonStyle } from '../lib/theme';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const labelStyle = { fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.3px', display: 'block', marginBottom: '4px' };
const inputStyle = { width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border-light)', fontSize: '0.88rem', boxSizing: 'border-box', backgroundColor: 'var(--bg-main)', color: 'var(--applime-dark-purple)' };

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
      <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--applime-dark-purple)', marginBottom: '12px' }}>Comparativo com scores externos</h4>
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '120px' }}>
          <label style={labelStyle}>Serasa</label>
          <input type="number" value={serasa} onChange={(e) => setSerasa(e.target.value)} placeholder="Ex: 750" style={inputStyle} />
        </div>
        <div style={{ flex: 1, minWidth: '120px' }}>
          <label style={labelStyle}>Nubank</label>
          <input type="number" value={nubank} onChange={(e) => setNubank(e.target.value)} placeholder="Ex: 850" style={inputStyle} />
        </div>
        <button onClick={handleSalvar} disabled={salvando} style={{ ...pillButtonStyle(true, greena.jade), alignSelf: 'flex-end', padding: '10px 20px', marginBottom: '2px' }}>
          {salvando ? '...' : 'Atualizar'}
        </button>
      </div>
      {perfil && (
        <div style={{ display: 'flex', gap: '20px', marginTop: '12px', flexWrap: 'wrap' }}>
          <div><span style={{ fontWeight: 700 }}>Greena:</span> {perfil.score_organizacao || '—'}</div>
          <div><span style={{ fontWeight: 700 }}>Serasa:</span> {perfil.score_serasa || '—'}</div>
          <div><span style={{ fontWeight: 700 }}>Nubank:</span> {perfil.score_nubank || '—'}</div>
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
    return <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-muted)' }}>Carregando perfil…</div>;
  }

  const dadosGrafico = historico.slice(-12).map(h => ({
    mes: new Date(h.mes_referencia).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }),
    score: Number(h.score_organizacao) || 0,
  }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ ...cardStyle, padding: '18px', background: `linear-gradient(135deg, ${greena.jadeSoft} 0%, #FFFFFF 100%)` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: greena.jadeDeep, textTransform: 'uppercase' }}>Seu Score de Organização</span>
            <div style={{ fontSize: '2.2rem', fontWeight: 900, color: greena.jadeDeep }}>{perfil?.score_organizacao || '—'}</div>
            <div style={{ fontSize: '0.8rem', color: greena.jadeDeep, opacity: 0.8 }}>Patrimônio líquido: {formatBRL(perfil?.patrimonio_liquido || 0)}</div>
          </div>
          {ranking && (
            <div style={{ textAlign: 'center', backgroundColor: '#fff', padding: '10px 14px', borderRadius: '16px', border: `1px solid ${greena.gold}55` }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>vs. 3 meses</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: ranking.diff >= 0 ? greena.jade : greena.terracotta }}>
                {ranking.diff >= 0 ? '+' : ''}{ranking.percentual.toFixed(1)}%
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{ranking.antigo} → {perfil.score_organizacao}</div>
            </div>
          )}
        </div>
      </div>

      <div style={{ ...cardStyle, padding: '18px' }}>
        <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--applime-dark-purple)', marginBottom: '8px' }}>Evolução do Score</h4>
        {dadosGrafico.length < 2 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Ainda não há dados suficientes para o gráfico. Continue usando o Greena!</p>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={dadosGrafico}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
              <XAxis dataKey="mes" tick={{ fontSize: 10 }} stroke="var(--text-muted)" />
              <YAxis domain={[0, 1000]} tick={{ fontSize: 10 }} stroke="var(--text-muted)" />
              <Tooltip formatter={(value) => `${value} pts`} />
              <Line type="monotone" dataKey="score" stroke={greena.jade} strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      <ComparativoScore perfil={perfil} onUpdate={atualizarPerfil} />
    </div>
  );
}