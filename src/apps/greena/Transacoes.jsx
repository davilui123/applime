import { useState, useMemo } from 'react';
import { Plus, X, Trash2 } from 'lucide-react';
import { useTransacoes, useCategorias, useContas } from '../hooks/useGreenaData';
import { greena, formatBRL, formatDataCurta, cardStyle, pillButtonStyle } from '../lib/theme';

const CORES_CATEGORIA = ['#1F6F54', '#C0533E', '#3E5C76', '#C9A227', '#8B4A6B', '#999999'];

function ModalNovaTransacao({ contas, categorias, onClose, onSalvar, onCriarCategoria }) {
  const [tipo, setTipo] = useState('despesa');
  const [valor, setValor] = useState('');
  const [descricao, setDescricao] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [contaId, setContaId] = useState(contas[0]?.id || '');
  const [data, setData] = useState(new Date().toISOString().slice(0, 10));
  const [hora, setHora] = useState(new Date().toTimeString().slice(0, 5));
  const [criandoCategoria, setCriandoCategoria] = useState(false);
  const [novaCategoriaNome, setNovaCategoriaNome] = useState('');
  const [salvando, setSalvando] = useState(false);

  const categoriasFiltradas = categorias.filter((c) => c.tipo === tipo);

  async function handleCriarCategoria() {
    if (!novaCategoriaNome.trim()) return;
    const cor = CORES_CATEGORIA[categoriasFiltradas.length % CORES_CATEGORIA.length];
    const { data: nova } = await onCriarCategoria({ nome: novaCategoriaNome.trim(), tipo, cor, icone: '🏷️' });
    if (nova) setCategoriaId(nova.id);
    setNovaCategoriaNome('');
    setCriandoCategoria(false);
  }

  async function handleSalvar() {
    if (!valor || Number(valor) <= 0 || !contaId) return;
    setSalvando(true);
    await onSalvar({
      tipo,
      valor: Number(valor),
      descricao: descricao.trim() || null,
      categoria_id: categoriaId || null,
      conta_id: contaId,
      data,
      hora,
    });
    setSalvando(false);
    onClose();
  }

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(18,63,48,0.25)', zIndex: 200, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
      <div onClick={(e) => e.stopPropagation()} style={{ backgroundColor: 'var(--bg-surface)', width: '100%', maxWidth: '450px', borderRadius: '24px 24px 0 0', padding: '20px', maxHeight: '88vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--applime-dark-purple)' }}>Nova transação</h3>
          <X size={20} onClick={onClose} style={{ cursor: 'pointer', color: 'var(--text-muted)' }} />
        </div>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          <button onClick={() => { setTipo('despesa'); setCategoriaId(''); }} style={pillButtonStyle(tipo === 'despesa', greena.terracotta)}>Despesa</button>
          <button onClick={() => { setTipo('receita'); setCategoriaId(''); }} style={pillButtonStyle(tipo === 'receita', greena.jade)}>Receita</button>
        </div>

        <label style={labelStyle}>Valor</label>
        <input type="number" inputMode="decimal" value={valor} onChange={(e) => setValor(e.target.value)} placeholder="0,00" style={inputStyle} />

        <label style={labelStyle}>Descrição</label>
        <input type="text" value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="Ex: Almoço, Uber, salário…" style={inputStyle} />

        <label style={labelStyle}>Categoria</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}>
          {categoriasFiltradas.map((c) => (
            <button key={c.id} onClick={() => setCategoriaId(c.id)} style={pillButtonStyle(categoriaId === c.id, c.cor)}>
              {c.icone} {c.nome}
            </button>
          ))}
          <button onClick={() => setCriandoCategoria(true)} style={pillButtonStyle(false, greena.slateBlue)}>+ Nova</button>
        </div>
        {criandoCategoria && (
          <div style={{ display: 'flex', gap: '6px', marginBottom: '14px' }}>
            <input autoFocus type="text" value={novaCategoriaNome} onChange={(e) => setNovaCategoriaNome(e.target.value)} placeholder="Nome da categoria" style={{ ...inputStyle, marginBottom: 0, flex: 1 }} />
            <button onClick={handleCriarCategoria} style={{ ...pillButtonStyle(true, greena.jade), padding: '0 14px' }}>Criar</button>
          </div>
        )}

        <label style={labelStyle}>Conta</label>
        <select value={contaId} onChange={(e) => setContaId(e.target.value)} style={inputStyle}>
          {contas.length === 0 && <option value="">Cadastre uma conta primeiro</option>}
          {contas.map((c) => <option key={c.id} value={c.id}>{c.icone} {c.nome}</option>)}
        </select>

        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Data</label>
            <input type="date" value={data} onChange={(e) => setData(e.target.value)} style={inputStyle} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Hora</label>
            <input type="time" value={hora} onChange={(e) => setHora(e.target.value)} style={inputStyle} />
          </div>
        </div>

        <button
          disabled={salvando || !contaId}
          onClick={handleSalvar}
          style={{ width: '100%', marginTop: '10px', padding: '13px', borderRadius: '14px', border: 'none', backgroundColor: greena.jade, color: '#fff', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer', opacity: salvando || !contaId ? 0.6 : 1 }}
        >
          {salvando ? 'Salvando…' : 'Salvar transação'}
        </button>
      </div>
    </div>
  );
}

const labelStyle = { fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.3px', display: 'block', marginBottom: '6px' };
const inputStyle = { width: '100%', padding: '11px 12px', borderRadius: '12px', border: '1px solid var(--border-light)', fontSize: '0.88rem', marginBottom: '14px', boxSizing: 'border-box', backgroundColor: 'var(--bg-main)', color: 'var(--applime-dark-purple)' };

export default function Transacoes() {
  const { dados: transacoes, loading, inserir, remover } = useTransacoes();
  const { dados: categorias, inserir: inserirCategoria } = useCategorias();
  const { dados: contas } = useContas();
  const [modalAberto, setModalAberto] = useState(false);
  const [filtroTipo, setFiltroTipo] = useState('todos');

  const listaFiltrada = useMemo(() => {
    if (filtroTipo === 'todos') return transacoes;
    return transacoes.filter((t) => t.tipo === filtroTipo);
  }, [transacoes, filtroTipo]);

  function categoriaDe(t) {
    return categorias.find((c) => c.id === t.categoria_id);
  }
  function contaDe(t) {
    return contas.find((c) => c.id === t.conta_id);
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button onClick={() => setFiltroTipo('todos')} style={pillButtonStyle(filtroTipo === 'todos', greena.slateBlue)}>Todos</button>
          <button onClick={() => setFiltroTipo('despesa')} style={pillButtonStyle(filtroTipo === 'despesa', greena.terracotta)}>Despesas</button>
          <button onClick={() => setFiltroTipo('receita')} style={pillButtonStyle(filtroTipo === 'receita', greena.jade)}>Receitas</button>
        </div>
        <button
          onClick={() => setModalAberto(true)}
          style={{ width: '38px', height: '38px', borderRadius: '12px', border: 'none', backgroundColor: greena.jade, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}
        >
          <Plus size={20} />
        </button>
      </div>

      {loading && <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Carregando transações…</p>}

      {!loading && listaFiltrada.length === 0 && (
        <div style={{ ...cardStyle, padding: '30px 16px', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Nenhuma transação por aqui ainda. Toque em + pra lançar a primeira.</p>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {listaFiltrada.map((t) => {
          const cat = categoriaDe(t);
          const conta = contaDe(t);
          return (
            <div key={t.id} style={{ ...cardStyle, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '11px', backgroundColor: `${cat?.cor || '#999'}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0 }}>
                {cat?.icone || '❔'}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--applime-dark-purple)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {t.descricao || cat?.nome || 'Sem descrição'}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  {formatDataCurta(t.data)} · {conta?.nome || 'Conta removida'}
                </div>
              </div>
              <div style={{ fontWeight: 800, fontSize: '0.88rem', color: t.tipo === 'receita' ? greena.jade : greena.terracotta, whiteSpace: 'nowrap' }}>
                {t.tipo === 'receita' ? '+' : '-'} {formatBRL(t.valor)}
              </div>
              <Trash2 size={15} onClick={() => remover(t.id)} style={{ color: 'var(--text-muted)', cursor: 'pointer', flexShrink: 0 }} />
            </div>
          );
        })}
      </div>

      {modalAberto && (
        <ModalNovaTransacao
          contas={contas}
          categorias={categorias}
          onClose={() => setModalAberto(false)}
          onSalvar={inserir}
          onCriarCategoria={inserirCategoria}
        />
      )}
    </div>
  );
}
