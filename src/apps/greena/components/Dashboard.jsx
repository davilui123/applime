import { TrendingUp, TrendingDown, Wallet, PiggyBank } from 'lucide-react';
import { useContas, useTransacoes, useDividas, useMetas, useCategorias } from '../hooks/useGreenaData';
import {
  saldoConsolidado,
  patrimonioLiquido,
  fluxoDoMes,
  gastosPorCategoria,
  calcularRadar,
  calcularScoreOrganizacao,
} from '../lib/financeEngine';
import { greena, formatBRL, formatPercent, cardStyle } from '../lib/theme';

const EIXOS = [
  { chave: 'saude', label: 'Saúde' },
  { chave: 'liquidez', label: 'Liquidez' },
  { chave: 'liberdade', label: 'Liberdade' },
  { chave: 'estresse', label: 'Estresse' },
  { chave: 'risco', label: 'Risco' },
];

function RadarFinanceiro({ radar }) {
  const cx = 130, cy = 130, raio = 95;
  const angulo = (i) => (Math.PI * 2 * i) / EIXOS.length - Math.PI / 2;

  const pontoEixo = (i, dist = raio) => ({
    x: cx + dist * Math.cos(angulo(i)),
    y: cy + dist * Math.sin(angulo(i)),
  });

  const pontosValor = EIXOS.map((eixo, i) => {
    const valor = radar[eixo.chave] / 100;
    const p = pontoEixo(i, raio * valor);
    return `${p.x},${p.y}`;
  }).join(' ');

  const aneis = [0.25, 0.5, 0.75, 1];

  return (
    <svg viewBox="0 0 260 280" width="100%" height="240" style={{ maxWidth: '280px', margin: '0 auto', display: 'block' }}>
      {aneis.map((f, idx) => {
        const pts = EIXOS.map((_, i) => {
          const p = pontoEixo(i, raio * f);
          return `${p.x},${p.y}`;
        }).join(' ');
        return <polygon key={idx} points={pts} fill="none" stroke="var(--border-light)" strokeWidth="1" />;
      })}

      {EIXOS.map((_, i) => {
        const p = pontoEixo(i, raio);
        return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="var(--border-light)" strokeWidth="1" />;
      })}

      <polygon points={pontosValor} fill={`${greena.jade}33`} stroke={greena.jade} strokeWidth="2" />

      {EIXOS.map((eixo, i) => {
        const valor = radar[eixo.chave] / 100;
        const p = pontoEixo(i, raio * valor);
        return <circle key={eixo.chave} cx={p.x} cy={p.y} r="4" fill={greena.radarColors[eixo.chave]} />;
      })}

      {EIXOS.map((eixo, i) => {
        const p = pontoEixo(i, raio + 26);
        return (
          <text
            key={eixo.chave}
            x={p.x}
            y={p.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="11"
            fontWeight="700"
            fill="var(--applime-dark-purple)"
          >
            {eixo.label}
          </text>
        );
      })}
    </svg>
  );
}

function StatCard({ icon, label, valor, cor, sub }) {
  return (
    <div style={{ ...cardStyle, padding: '16px', flex: 1, minWidth: '140px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
        <div style={{ width: '30px', height: '30px', borderRadius: '9px', backgroundColor: `${cor}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {icon}
        </div>
        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.3px' }}>{label}</span>
      </div>
      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--applime-dark-purple)', letterSpacing: '-0.3px' }}>{valor}</div>
      {sub && <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>{sub}</div>}
    </div>
  );
}

export default function Dashboard() {
  const { dados: contas, loading: lContas } = useContas();
  const { dados: transacoes, loading: lTrans } = useTransacoes();
  const { dados: dividas, loading: lDividas } = useDividas();
  const { dados: metas, loading: lMetas } = useMetas();
  const { dados: categorias } = useCategorias();

  const loading = lContas || lTrans || lDividas || lMetas;

  if (loading) {
    return <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-muted)' }}>Carregando seu painel…</div>;
  }

  const saldo = saldoConsolidado(contas, transacoes);
  const patrimonio = patrimonioLiquido(contas, transacoes, dividas);
  const { receitas, despesas, saldo: fluxo } = fluxoDoMes(transacoes);
  const radar = calcularRadar({ contas, transacoes, dividas, metas });
  const score = calcularScoreOrganizacao(radar);
  const topCategorias = gastosPorCategoria(transacoes, categorias).slice(0, 5);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Patrimônio em destaque */}
      <div style={{ ...cardStyle, padding: '20px', background: `linear-gradient(135deg, ${greena.jadeSoft} 0%, #FFFFFF 100%)` }}>
        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: greena.jadeDeep, textTransform: 'uppercase', letterSpacing: '0.4px' }}>Patrimônio líquido</span>
        <div style={{ fontSize: '2rem', fontWeight: 900, color: greena.jadeDeep, letterSpacing: '-0.8px', marginTop: '4px' }}>
          {formatBRL(patrimonio)}
        </div>
        <div style={{ fontSize: '0.78rem', color: greena.jadeDeep, opacity: 0.75, marginTop: '2px' }}>
          Score de organização: <strong>{score}</strong> / 1000
        </div>
      </div>

      {/* Stats rápidas */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <StatCard icon={<Wallet size={16} color={greena.slateBlue} />} label="Saldo" valor={formatBRL(saldo)} cor={greena.slateBlue} />
        <StatCard icon={<TrendingUp size={16} color={greena.jade} />} label="Receitas (mês)" valor={formatBRL(receitas)} cor={greena.jade} />
        <StatCard icon={<TrendingDown size={16} color={greena.terracotta} />} label="Despesas (mês)" valor={formatBRL(despesas)} cor={greena.terracotta} />
        <StatCard
          icon={<PiggyBank size={16} color={fluxo >= 0 ? greena.jade : greena.terracotta} />}
          label="Fluxo do mês"
          valor={formatBRL(fluxo)}
          cor={fluxo >= 0 ? greena.jade : greena.terracotta}
          sub={fluxo >= 0 ? 'Sobrando' : 'No vermelho'}
        />
      </div>

      {/* Radar financeiro */}
      <div style={{ ...cardStyle, padding: '18px 8px' }}>
        <h3 style={{ padding: '0 12px', fontSize: '0.95rem', fontWeight: 800, color: 'var(--applime-dark-purple)', marginBottom: '4px' }}>Radar Financeiro</h3>
        <RadarFinanceiro radar={radar} />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', padding: '0 12px', justifyContent: 'center' }}>
          {EIXOS.map((eixo) => (
            <span
              key={eixo.chave}
              style={{
                fontSize: '0.68rem',
                fontWeight: 700,
                padding: '3px 9px',
                borderRadius: '10px',
                color: '#fff',
                backgroundColor: greena.radarColors[eixo.chave],
              }}
            >
              {eixo.label} {formatPercent(radar[eixo.chave])}
            </span>
          ))}
        </div>
      </div>

      {/* Top categorias do mês */}
      <div style={{ ...cardStyle, padding: '16px' }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--applime-dark-purple)', marginBottom: '12px' }}>Onde seu dinheiro foi este mês</h3>
        {topCategorias.length === 0 && (
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Nenhuma despesa lançada este mês ainda.</p>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {topCategorias.map((item) => (
            <div key={item.categoria.nome}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                <span style={{ color: 'var(--applime-dark-purple)', fontWeight: 600 }}>
                  {item.categoria.icone} {item.categoria.nome}
                </span>
                <span style={{ color: 'var(--text-muted)' }}>{formatBRL(item.valor)}</span>
              </div>
              <div style={{ height: '6px', borderRadius: '4px', backgroundColor: 'var(--bg-main)', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${item.percentual}%`, backgroundColor: item.categoria.cor, borderRadius: '4px' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
