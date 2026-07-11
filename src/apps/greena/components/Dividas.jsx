import { useState, useMemo } from 'react';
import { Plus, X, Trash2, Flag } from 'lucide-react';
import { useDividas } from '../hooks/useGreenaData';
import { ordenarDividasPorEstrategia, simularQuitacao } from '../lib/financeEngine';
import { greena, formatBRL, cardStyle, pillButtonStyle } from '../lib/theme';

const TIPOS_DIVIDA = [
  { valor: 'cartao_credito', label: 'Cartão de crédito', icone: '💳' },
  { valor: 'emprestimo', label: 'Empréstimo', icone: '🏦' },
  { valor: 'financiamento', label: 'Financiamento', icone: '🏠' },
  { valor: 'cheque_especial', label: 'Cheque especial', icone: '📉' },
  { valor: 'outro', label: 'Outro', icone: '📄' },
];

function ModalNovaDivida({ onClose, onSalvar }) {
  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState('cartao_credito');
  const [valorTotal, setValorTotal] = useState('');
  const [valorPago, setValorPago] = useState('');
  const [taxaJuros, setTaxaJuros] = useState('');
  const [valorParcela, setValorParcela] = useState('');
  const [dataVencimento, setDataVencimento] = useState('');
  const [salvando, setSalvando] = useState(false);

  async function handleSalvar() {
    if (!nome.trim() || !valorTotal || Number(valorTotal) <= 0) return;
    setSalvando(true);
    await onSalvar({
      nome: nome.trim(),
      tipo,
      valor_total: Number(valorTotal),
      valor_pago: Number(valorPago) || 0,
      taxa_juros_mensal: Number(taxaJuros) || 0,
      valor_parcela: Number(valorParcela) || 0,
      data_vencimento: dataVencimento || null,
    });
    setSalvando(false);
    onClose();
  }

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,51,102,0.15)', zIndex: 200, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
      <div onClick={(e) => e.stopPropagation()} style={{ backgroundColor: 'var(--bg-surface)', width: '100%', maxWidth: '450px', borderRadius: '24px 24px 0 0', padding: '20px', maxHeight: '88vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--applime-dark-purple)' }}>Nova dívida</h3>
          <X size={20} onClick={onClose} style={{ cursor: 'pointer', color: 'var(--text-muted)' }} />
        </div>

        <label style={labelStyle}>Tipo</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
          {TIPOS_DIVIDA.map((t) => (
            <button key={t.valor} onClick={() => setTipo(t.valor)} style={pillButtonStyle(tipo === t.valor, greena.terracotta)}>
              {t.icone} {t.label}
            </button>
          ))}
        </div>

        <label style={labelStyle}>Nome (ex: Cartão Nubank)</label>
        <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} style={inputStyle} />

        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Valor total da dívida</label>
            <input type="number" inputMode="decimal" value={valorTotal} onChange={(e) => setValorTotal(e.target.value)} style={inputStyle} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Já pago</label>
            <input type="number" inputMode="decimal" value={valorPago} onChange={(e) => setValorPago(e.target.value)} style={inputStyle} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Juros ao mês (%)</label>
            <input type="number" inputMode="decimal" value={taxaJuros} onChange={(e) => setTaxaJuros(e.target.value)} placeholder="Ex: 12.5" style={inputStyle} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Parcela mínima</label>
            <input type="number" inputMode="decimal" value={valorParcela} onChange={(e) => setValorParcela(e.target.value)} style={inputStyle} />
          </div>
        </div>

        <label style={labelStyle}>Vencimento (opcional)</label>
        <input type="date" value={dataVencimento} onChange={(e) => setDataVencimento(e.target.value)} style={inputStyle} />

        <button
          disabled={salvando}
          onClick={handleSalvar}
          style={{ width: '100%', marginTop: '6px', padding: '13px', borderRadius: '14px', border: 'none', backgroundColor: greena.terracotta, color: '#fff', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer', opacity: salvando ? 0.6 : 1 }}
        >
          {salvando ? 'Salvando…' : 'Cadastrar dívida'}
        </button>
      </div>
    </div>
  );
}

const labelStyle = { fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.3px', display: 'block', marginBottom: '6px' };
const inputStyle = { width: '100%', padding: '11px 12px', borderRadius: '12px', border: '1px solid var(--border-light)', fontSize: '0.88rem', marginBottom: '14px', boxSizing: 'border-box', backgroundColor: 'var(--bg-main)', color: 'var(--applime-dark-purple)' };

export default function Dividas() {
  const { dados: dividas, loading, inserir, atualizar, remover } = useDividas();
  const [modalAberto, setModalAberto] = useState(false);
  const [metodo, setMetodo] = useState('avalanche');
  const [valorMensal, setValorMensal] = useState('');

  const dividasAtivas = dividas.filter((d) => d.status === 'ativa');
  const totalDevido = dividasAtivas.reduce((s, d) => s + (Number(d.valor_total) - Number(d.valor_pago)), 0);
  const ordenadas = useMemo(() => ordenarDividasPorEstrategia(dividas, metodo), [dividas, metodo]);

  const simulacao = useMemo(() => {
    const valor = Number(valorMensal);
    if (!valor || valor <= 0 || dividasAtivas.length === 0) return null;
    return simularQuitacao(dividas, valor, metodo);
  }, [dividas, dividasAtivas.length, metodo, valorMensal]);

  async function marcarComoQuitada(divida) {
    await atualizar(divida.id, { valor_pago: divida.valor_total, status: 'quitada' });
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--applime-dark-purple)' }}>Estratégia Inteligente</h3>
        <button
          onClick={() => setModalAberto(true)}
          style={{ width: '38px', height: '38px', borderRadius: '12px', border: 'none', backgroundColor: greena.terracotta, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}
        >
          <Plus size={20} />
        </button>
      </div>

      <div style={{ ...cardStyle, padding: '18px', background: `linear-gradient(135deg, ${greena.terracottaSoft} 0%, #FFFFFF 100%)`, marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <Flag size={16} color={greena.terracotta} />
          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: greena.terracotta, textTransform: 'uppercase' }}>Total em dívidas ativas</span>
        </div>
        <div style={{ fontSize: '1.7rem', fontWeight: 900, color: greena.terracotta, letterSpacing: '-0.5px' }}>{formatBRL(totalDevido)}</div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>Meta: zerar isso até 31/12/2026</div>
      </div>

      {loading && <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Carregando dívidas…</p>}

      {!loading && dividasAtivas.length === 0 && dividas.length === 0 && (
        <div style={{ ...cardStyle, padding: '30px 16px', textAlign: 'center', marginBottom: '16px' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Nenhuma dívida cadastrada. Se você já está livre delas, ótimo — se não, cadastre pra montar sua estratégia.</p>
        </div>
      )}

      {dividasAtivas.length > 0 && (
        <>
          <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
            <button onClick={() => setMetodo('avalanche')} style={pillButtonStyle(metodo === 'avalanche', greena.terracotta)}>Avalanche (menos juros)</button>
            <button onClick={() => setMetodo('snowball')} style={pillButtonStyle(metodo === 'snowball', greena.gold)}>Bola de neve (motivação)</button>
          </div>

          <div style={{ ...cardStyle, padding: '16px', marginBottom: '16px' }}>
            <label style={labelStyle}>Quanto você consegue destinar por mês pra quitar dívidas?</label>
            <input type="number" inputMode="decimal" value={valorMensal} onChange={(e) => setValorMensal(e.target.value)} placeholder="Ex: 600" style={{ ...inputStyle, marginBottom: 0 }} />
            {simulacao && (
              <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--border-light)' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--applime-dark-purple)' }}>
                  Nesse ritmo, você fica <strong>livre de dívidas em {simulacao.meses} {simulacao.meses === 1 ? 'mês' : 'meses'}</strong>
                  {simulacao.dataQuitacaoTotal && (
                    <> — por volta de <strong>{simulacao.dataQuitacaoTotal.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</strong></>
                  )}
                  .
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Total de juros pago no caminho: {formatBRL(simulacao.totalJurosPago)}
                </div>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {ordenadas.map((d) => {
              const restante = Number(d.valor_total) - Number(d.valor_pago);
              const progresso = Math.min((Number(d.valor_pago) / Math.max(Number(d.valor_total), 1)) * 100, 100);
              const tipoInfo = TIPOS_DIVIDA.find((t) => t.valor === d.tipo) || TIPOS_DIVIDA[4];
              return (
                <div key={d.id} style={{ ...cardStyle, padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '30px', height: '30px', borderRadius: '10px', backgroundColor: `${greena.terracotta}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 800, color: greena.terracotta }}>
                        #{d.prioridade}
                      </div>
                      <div>
                        <div style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--applime-dark-purple)' }}>{tipoInfo.icone} {d.nome}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{d.taxa_juros_mensal}% a.m. · parcela {formatBRL(d.valor_parcela || 0)}</div>
                      </div>
                    </div>
                    <Trash2 size={15} onClick={() => remover(d.id)} style={{ color: 'var(--text-muted)', cursor: 'pointer', flexShrink: 0 }} />
                  </div>

                  <div style={{ height: '10px', borderRadius: '6px', backgroundColor: 'var(--bg-main)', overflow: 'hidden', marginBottom: '6px' }}>
                    <div style={{ height: '100%', width: `${progresso}%`, backgroundColor: greena.jade, borderRadius: '6px' }} />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Faltam {formatBRL(restante)} de {formatBRL(d.valor_total)}</span>
                    <button onClick={() => marcarComoQuitada(d)} style={{ ...pillButtonStyle(false, greena.jade), padding: '5px 12px' }}>Quitar</button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {modalAberto && <ModalNovaDivida onClose={() => setModalAberto(false)} onSalvar={inserir} />}
    </div>
  );
}