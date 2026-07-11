import { useState, useMemo } from 'react';
import { Plus, X, Trash2 } from 'lucide-react';
import { useTransacoes, useCategorias, useContas } from '../hooks/useGreenaData';
import { greena, formatBRL, formatDataCurta, cardStyle, pillButtonStyle } from '../lib/theme';

const CORES_CATEGORIA = ['#00875A', '#C0533E', '#003366', '#FFB800', '#8B4A6B', '#999999'];

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
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,51,102,0.25)', zIndex: 200, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
      <div onClick={(e) => e.stopPropagation()} style={{ backgroundColor: '#FFFFFF', width: '100%', maxWidth: '450px', borderRadius: '28px 28px 0 0', padding: '24px 20px 32px', maxHeight: '88vh', overflowY: 'auto', boxShadow: '0 -8px 30px rgba(0,0,0,0.08)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#003366' }}>Nova transação</h3>
          <X size={22} onClick={onClose} style={{ cursor: 'pointer', color: '#999', transition: 'transform 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'rotate(90deg)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'rotate(0)'} />
        </div>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <button onClick={() => { setTipo('despesa'); setCategoriaId(''); }} style={pillButtonStyle(tipo === 'despesa', '#C0533E')}>Despesa</button>
          <button onClick={() => { setTipo('receita'); setCategoriaId(''); }} style={pillButtonStyle(tipo === 'receita', '#00875A')}>Receita</button>
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
          <button onClick={() => setCriandoCategoria(true)} style={pillButtonStyle(false, '#003366')}>+ Nova</button>
        </div>
        {criandoCategoria && (
          <div style={{ display: 'flex', gap: '6px', marginBottom: '14px' }}>
            <input autoFocus type="text" value={novaCategoriaNome} onChange={(e) => setNovaCategoriaNome(e.target.value)} placeholder="Nome da categoria" style={{ ...inputStyle, marginBottom: 0, flex: 1 }} />
            <button onClick={handleCriarCategoria} style={{ ...pillButtonStyle(true, '#00875A'), padding: '0 14px' }}>Criar</button>
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
          style={{
            width: '100%',
            marginTop: '16px',
            padding: '14px',
            borderRadius: '16px',
            border: 'none',
            backgroundColor: '#00875A',
            color: '#fff',
            fontWeight: 700,
            fontSize: '0.95rem',
            cursor: 'pointer',
            opacity: salvando || !contaId ? 0.6 : 1,
            boxShadow: '0 4px 12px rgba(0,135,90,0.3)',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.transform = 'translateY(-2px)'; }}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          {salvando ? 'Salvando…' : 'Salvar transação'}
        </button>
      </div>
    </div>
  );
}

const labelStyle = {
  fontSize: '0.7rem',
  fontWeight: 700,
  color: '#666',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  display: 'block',
  marginBottom: '5px',
};

const inputStyle = {
  width: '100%',
  padding: '12px 14px',
  borderRadius: '12px',
  border: '1px solid #E5E7EB',
  fontSize: '0.9rem',
  marginBottom: '16px',
  boxSizing: 'border-box',
  backgroundColor: '#F9FAFB',
  color: '#003366',
  transition: 'border-color 0.2s, box-shadow 0.2s',
  outline: 'none',
};

// Adiciona efeito focus nos inputs via CSS global ou inline (aqui faremos inline com estado, mas para simplificar, o usuário pode adicionar no CSS global)
// Para este exemplo, vou deixar como está.

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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button onClick={() => setFiltroTipo('todos')} style={pillButtonStyle(filtroTipo === 'todos', '#003366')}>Todos</button>
          <button onClick={() => setFiltroTipo('despesa')} style={pillButtonStyle(filtroTipo === 'despesa', '#C0533E')}>Despesas</button>
          <button onClick={() => setFiltroTipo('receita')} style={pillButtonStyle(filtroTipo === 'receita', '#00875A')}>Receitas</button>
        </div>
        <button
          onClick={() => setModalAberto(true)}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '14px',
            border: 'none',
            backgroundColor: '#00875A',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
            boxShadow: '0 4px 12px rgba(0,135,90,0.3)',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <Plus size={22} />
        </button>
      </div>

      {loading && <p style={{ color: '#999', fontSize: '0.85rem' }}>Carregando transações…</p>}

      {!loading && listaFiltrada.length === 0 && (
        <div style={{ ...cardStyle, padding: '40px 16px', textAlign: 'center', backgroundColor: '#F9FAFB', borderRadius: '20px' }}>
          <p style={{ color: '#999', fontSize: '0.9rem' }}>Nenhuma transação por aqui ainda. Toque em + pra lançar a primeira.</p>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {listaFiltrada.map((t) => {
          const cat = categoriaDe(t);
          const conta = contaDe(t);
          return (
            <div key={t.id} style={{ ...cardStyle, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '14px', backgroundColor: '#FFFFFF', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', transition: 'all 0.2s', borderLeft: `4px solid ${cat?.cor || '#00875A'}` }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: `${cat?.cor || '#00875A'}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>
                {cat?.icone || '❔'}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#003366', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {t.descricao || cat?.nome || 'Sem descrição'}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#999' }}>
                  {formatDataCurta(t.data)} · {conta?.nome || 'Conta removida'}
                </div>
              </div>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: t.tipo === 'receita' ? '#00875A' : '#C0533E', whiteSpace: 'nowrap' }}>
                {t.tipo === 'receita' ? '+' : '-'} {formatBRL(t.valor)}
              </div>
              <Trash2
                size={16}
                onClick={() => remover(t.id)}
                style={{ color: '#CCC', cursor: 'pointer', flexShrink: 0, transition: 'color 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#C0533E'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#CCC'}
              />
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