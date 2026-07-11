import { useState } from 'react';
import { Plus, X, Trash2, Link2 } from 'lucide-react';
import { useContas, useTransacoes } from '../hooks/useGreenaData';
import { saldoDaConta } from '../lib/financeEngine';
import { greena, formatBRL, cardStyle, pillButtonStyle } from '../lib/theme';

const TIPOS_CONTA = [
  { valor: 'corrente', label: 'Conta corrente', icone: '🏦' },
  { valor: 'poupanca', label: 'Poupança', icone: '🐷' },
  { valor: 'carteira', label: 'Carteira/Dinheiro', icone: '👛' },
  { valor: 'investimento', label: 'Investimento', icone: '📈' },
  { valor: 'cartao_credito', label: 'Cartão de crédito', icone: '💳' },
];

function ModalNovaConta({ onClose, onSalvar }) {
  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState('corrente');
  const [instituicao, setInstituicao] = useState('');
  const [saldoInicial, setSaldoInicial] = useState('');
  const [salvando, setSalvando] = useState(false);

  async function handleSalvar() {
    if (!nome.trim()) return;
    setSalvando(true);
    const tipoInfo = TIPOS_CONTA.find((t) => t.valor === tipo);
    await onSalvar({
      nome: nome.trim(),
      tipo,
      instituicao: instituicao.trim() || null,
      saldo_inicial: Number(saldoInicial) || 0,
      icone: tipoInfo.icone,
      cor: greena.verde,
      origem: 'manual',
    });
    setSalvando(false);
    onClose();
  }

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,51,102,0.25)', zIndex: 200, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
      <div onClick={(e) => e.stopPropagation()} style={{ backgroundColor: 'var(--bg-surface)', width: '100%', maxWidth: '450px', borderRadius: '24px 24px 0 0', padding: '20px', maxHeight: '88vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--applime-dark-purple)' }}>Nova conta</h3>
          <X size={20} onClick={onClose} style={{ cursor: 'pointer', color: 'var(--text-muted)' }} />
        </div>

        <label style={labelStyle}>Tipo</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
          {TIPOS_CONTA.map((t) => (
            <button key={t.valor} onClick={() => setTipo(t.valor)} style={pillButtonStyle(tipo === t.valor, greena.verde)}>
              {t.icone} {t.label}
            </button>
          ))}
        </div>

        <label style={labelStyle}>Nome da conta</label>
        <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex: Nubank, Carteira" style={inputStyle} />

        <label style={labelStyle}>Instituição (opcional)</label>
        <input type="text" value={instituicao} onChange={(e) => setInstituicao(e.target.value)} style={inputStyle} />

        <label style={labelStyle}>Saldo inicial</label>
        <input type="number" inputMode="decimal" value={saldoInicial} onChange={(e) => setSaldoInicial(e.target.value)} placeholder="0,00" style={inputStyle} />

        <button
          disabled={salvando}
          onClick={handleSalvar}
          style={{ width: '100%', marginTop: '6px', padding: '13px', borderRadius: '14px', border: 'none', backgroundColor: greena.verde, color: '#fff', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer', opacity: salvando ? 0.6 : 1 }}
        >
          {salvando ? 'Salvando…' : 'Adicionar conta'}
        </button>
      </div>
    </div>
  );
}

const labelStyle = { fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.3px', display: 'block', marginBottom: '6px' };
const inputStyle = { width: '100%', padding: '11px 12px', borderRadius: '12px', border: '1px solid var(--border-light)', fontSize: '0.88rem', marginBottom: '14px', boxSizing: 'border-box', backgroundColor: 'var(--bg-main)', color: 'var(--applime-dark-purple)' };

export default function Contas() {
  const { dados: contas, loading, inserir, remover } = useContas();
  const { dados: transacoes } = useTransacoes();
  const [modalAberto, setModalAberto] = useState(false);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--applime-dark-purple)' }}>Suas contas</h3>
        <button
          onClick={() => setModalAberto(true)}
          style={{ width: '38px', height: '38px', borderRadius: '12px', border: 'none', backgroundColor: greena.verde, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}
        >
          <Plus size={20} />
        </button>
      </div>

      <div style={{ ...cardStyle, padding: '16px', marginBottom: '16px', border: `1px dashed ${greena.slateBlue}55` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
          <div style={{ width: '34px', height: '34px', borderRadius: '10px', backgroundColor: `${greena.slateBlue}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Link2 size={16} color={greena.slateBlue} />
          </div>
          <span style={{ fontSize: '0.86rem', fontWeight: 800, color: 'var(--applime-dark-purple)' }}>Saldo consolidado (Open Finance)</span>
        </div>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
          Vamos conectar seus bancos via Pluggy pra puxar saldo automaticamente. Falta só o back-end
          que gera o token de conexão (Supabase Edge Function) — por enquanto, cadastre suas contas manualmente abaixo.
        </p>
        <button disabled style={{ ...pillButtonStyle(false, greena.slateBlue), opacity: 0.5, cursor: 'not-allowed' }}>
          Conectar banco — em breve
        </button>
      </div>

      {loading && <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Carregando contas…</p>}

      {!loading && contas.length === 0 && (
        <div style={{ ...cardStyle, padding: '30px 16px', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Nenhuma conta cadastrada. Adicione pelo menos uma pra começar a lançar transações.</p>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {contas.map((c) => (
          <div key={c.id} style={{ ...cardStyle, padding: '14px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '11px', backgroundColor: `${greena.verde}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>
              {c.icone}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--applime-dark-purple)' }}>{c.nome}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{c.instituicao || TIPOS_CONTA.find((t) => t.valor === c.tipo)?.label}</div>
            </div>
            <div style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--applime-dark-purple)' }}>
              {formatBRL(saldoDaConta(c, transacoes))}
            </div>
            <Trash2 size={15} onClick={() => remover(c.id)} style={{ color: 'var(--text-muted)', cursor: 'pointer', flexShrink: 0 }} />
          </div>
        ))}
      </div>

      {modalAberto && <ModalNovaConta onClose={() => setModalAberto(false)} onSalvar={inserir} />}
    </div>
  );
}