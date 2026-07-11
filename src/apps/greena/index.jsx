import { useState } from 'react';
import { ArrowLeft, LayoutDashboard, ArrowLeftRight, Target, ShieldAlert, Wallet2 } from 'lucide-react';
import Dashboard from './components/Dashboard';
import Transacoes from './components/Transacoes';
import Metas from './components/Metas';
import Dividas from './components/Dividas';
import Contas from './components/Contas';
import { greena } from './lib/theme';

const ABAS = [
  { id: 'dashboard', label: 'Painel', icone: LayoutDashboard, Componente: Dashboard },
  { id: 'transacoes', label: 'Lançamentos', icone: ArrowLeftRight, Componente: Transacoes },
  { id: 'metas', label: 'Metas', icone: Target, Componente: Metas },
  { id: 'dividas', label: 'Dívidas', icone: ShieldAlert, Componente: Dividas },
  { id: 'contas', label: 'Contas', icone: Wallet2, Componente: Contas },
];

export default function Greena({ onBack }) {
  const [abaAtiva, setAbaAtiva] = useState('dashboard');
  const AbaAtual = ABAS.find((a) => a.id === abaAtiva)?.Componente || Dashboard;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-main)', paddingBottom: '90px' }}>
      <div style={{ maxWidth: '450px', margin: '0 auto', padding: '20px 16px 0' }}>
        {/* Header */}
        <header style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
          <div
            onClick={onBack}
            style={{
              width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--bg-surface)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
              border: '1px solid var(--border-light)', flexShrink: 0,
            }}
          >
            <ArrowLeft size={17} style={{ color: 'var(--applime-dark-purple)' }} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--applime-dark-purple)', letterSpacing: '-0.5px', lineHeight: 1.1 }}>
              💰 Greena
            </h1>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 500 }}>Sua relação honesta com o dinheiro</span>
          </div>
        </header>

        {/* Conteúdo da aba */}
        <main>
          <AbaAtual />
        </main>
      </div>

      {/* Navegação inferior fixa */}
      <nav
        style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: 'var(--bg-surface)',
          borderTop: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-around',
          padding: '10px 4px calc(10px + env(safe-area-inset-bottom))', zIndex: 50,
        }}
      >
        {ABAS.map((aba) => {
          const Icone = aba.icone;
          const ativa = aba.id === abaAtiva;
          return (
            <button
              key={aba.id}
              onClick={() => setAbaAtiva(aba.id)}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px',
                background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px',
                color: ativa ? greena.jade : 'var(--text-muted)',
              }}
            >
              <Icone size={20} strokeWidth={ativa ? 2.4 : 2} />
              <span style={{ fontSize: '0.62rem', fontWeight: ativa ? 800 : 600 }}>{aba.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
