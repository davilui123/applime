import { useState } from 'react';
import { Plus, X, Trash2 } from 'lucide-react';
import { useMetas } from '../hooks/useGreenaData';
import { greena, formatBRL, cardStyle, pillButtonStyle } from '../lib/theme';

const TIPOS_META = [
  { valor: 'viagem', label: 'Viagem', icone: '✈️' },
  { valor: 'carro', label: 'Carro', icone: '🚗' },
  { valor: 'reserva_emergencia', label: 'Reserva de emergência', icone: '🛡️' },
  { valor: 'casa', label: 'Casa', icone: '🏠' },
  { valor: 'educacao', label: 'Educação', icone: '🎓' },
  { valor: 'outro', label: 'Outro', icone: '🎯' },
];

function ModalNovaMeta({ onClose, onSalvar }) {
  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState('viagem');
  const [valorAlvo, setValorAlvo] = useState('');
  const [valorAtual, setValorAtual] = useState('');
  const [dataAlvo, setDataAlvo] = useState('');
  const [salvando, setSalvando] = useState(false);

  async function handleSalvar() {
    if (!nome.trim() || !valorAlvo || Number(valorAlvo) <= 0) return;
    setSalvando(true);
    const tipoInfo = TIPOS_META.find((t) => t.valor === tipo);
    await onSalvar({
      nome: nome.trim(),
      tipo,
      valor_alvo: Number(valorAlvo),
      valor_atual: Number(valorAtual) || 0,
      data_alvo: dataAlvo || null,
      icone: tipoInfo.icone,
      cor: greena.jade,
    });
    setSalvando(false);
    onClose();
  }

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(18,63,48,0.25)', zIndex: 200, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
      <div onClick={(e) => e.stopPropagation()} style={{ backgroundColor: 'var(--bg-surface)', width: '100%', maxWidth: '450px', borderRadius: '24px 24px 0 0', padding: '20px', maxHeight: '88vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--applime-dark-purple)' }}>Nova meta</h3>
          <X size={20} onClick={onClose} style={{ cursor: 'pointer', color: 'var(--text-muted)' }} />
        </div>

        <label style={labelStyle}>Tipo</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
          {TIPOS_META.map((t) => (
            <button key={t.valor} onClick={() => setTipo(t.valor)} style={pillButtonStyle(tipo === t.valor, greena.jade)}>
              {t.icone} {t.label}
            </button>
          ))}
        </div>

        <label style={labelStyle}>Nome da meta</label>
        <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex: Viagem pra Bahia" style={inputStyle} />

        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Valor alvo</label>
            <input type="number" inputMode="decimal" value={valorAlvo} onChange={(e) => setValorAlvo(e.target.value)} placeholder="0,00" style={inputStyle} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Já tenho guardado</label>
            <input type="number" inputMode="decimal" value={valorAtual} onChange={(e) => setValorAtual(e.target.value)} placeholder="0,00" style={inputStyle} />
          </div>
        </div>

        <label style={labelStyle}>Data alvo (opcional)</label>
        <input type="date" value={dataAlvo} onChange={(e) => setDataAlvo(e.target.value)} style={inputStyle} />

        <button
          disabled={salvando}
          onClick={handleSalvar}
          style={{ width: '100%', marginTop: '6px', padding: '13px', borderRadius: '14px', border: 'none', backgroundColor: greena.jade, color: '#fff', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer', opacity: salvando ? 0.6 : 1 }}
        >
          {salvando ? 'Salvando…' : 'Criar meta'}
        </button>
      </div>
    </div>
  );
}

const labelStyle = { fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.3px', display: 'block', marginBottom: '6px' };
const inputStyle = { width: '100%', padding: '11px 12px', borderRadius: '12px', border: '1px solid var(--border-light)', fontSize: '0.88rem', marginBottom: '14px', boxSizing: 'border-box', backgroundColor: 'var(--bg-main)', color: 'var(--applime-dark-purple)' };

export default function Metas() {
  const { dados: metas, loading, inserir, atualizar, remover } = useMetas();
  const [modalAberto, setModalAberto] = useState(false);

  async function adicionarAporte(meta) {
    const valorStr = window.prompt(`Quanto você quer adicionar à meta "${meta.nome}"?`, '');
    const valor = Number(valorStr);
    if (!valor || valor <= 0) return;
    const novoValor = Number(meta.valor_atual) + valor;
    const status = novoValor >= Number(meta.valor_alvo) ? 'concluida' : meta.status;
    await atualizar(meta.id, { valor_atual: novoValor, status });
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--applime-dark-purple)' }}>Seus objetivos</h3>
        <button
          onClick={() => setModalAberto(true)}
          style={{ width: '38px', height: '38px', borderRadius: '12px', border: 'none', backgroundColor: greena.jade, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}
        >
          <Plus size={20} />
        </button>
      </div>

      {loading && <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Carregando metas…</p>}

      {!loading && metas.length === 0 && (
        <div style={{ ...cardStyle, padding: '30px 16px', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Nenhuma meta criada ainda. Toque em + pra começar a juntar dinheiro com propósito.</p>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {metas.map((meta) => {
          const progresso = Math.min((Number(meta.valor_atual) / Math.max(Number(meta.valor_alvo), 1)) * 100, 100);
          const concluida = meta.status === 'concluida';
          return (
            <div key={meta.id} style={{ ...cardStyle, padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ fontSize: '1.4rem' }}>{meta.icone}</div>
                  <div>
                    <div style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--applime-dark-purple)' }}>{meta.nome}</div>
                    {meta.data_alvo && <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>até {new Date(`${meta.data_alvo}T00:00:00`).toLocaleDateString('pt-BR')}</div>}
                  </div>
                </div>
                <Trash2 size={15} onClick={() => remover(meta.id)} style={{ color: 'var(--text-muted)', cursor: 'pointer', flexShrink: 0 }} />
              </div>

              <div style={{ height: '10px', borderRadius: '6px', backgroundColor: 'var(--bg-main)', overflow: 'hidden', marginBottom: '6px' }}>
                <div style={{ height: '100%', width: `${progresso}%`, backgroundColor: concluida ? greena.gold : greena.jade, borderRadius: '6px', transition: 'width 0.3s ease' }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  {formatBRL(meta.valor_atual)} de {formatBRL(meta.valor_alvo)}
                </span>
                {concluida ? (
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, color: greena.gold }}>🏆 Concluída</span>
                ) : (
                  <button onClick={() => adicionarAporte(meta)} style={{ ...pillButtonStyle(true, greena.jade), padding: '5px 12px' }}>+ Guardar</button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {modalAberto && <ModalNovaMeta onClose={() => setModalAberto(false)} onSalvar={inserir} />}
    </div>
  );
}
