import { useState, useEffect } from 'react';
import { ArrowLeft, LayoutDashboard, ArrowLeftRight, Target, ShieldAlert, Wallet2, Trophy, User, Flame } from 'lucide-react';
import '@fontsource/ranchers';

import Dashboard from './components/Dashboard';
import Transacoes from './components/Transacoes';
import Metas from './components/Metas';
import Dividas from './components/Dividas';
import Contas from './components/Contas';
import Missoes from './components/Missoes';
import Perfil from './components/Perfil';
import PullToRefresh from './components/PullToRefresh';
import { useStreak, usePerfil } from './hooks/useGreenaData';
import { infoDeNivel, avatarDoNivel } from './lib/missionEngine';
import { greena } from './lib/theme';

const ABAS = [
  { id: 'dashboard', label: 'Painel', icone: LayoutDashboard, Componente: Dashboard },
  { id: 'transacoes', label: 'Lançamentos', icone: ArrowLeftRight, Componente: Transacoes },
  { id: 'metas', label: 'Metas', icone: Target, Componente: Metas },
  { id: 'dividas', label: 'Dívidas', icone: ShieldAlert, Componente: Dividas },
  { id: 'missoes', label: 'Missões', icone: Trophy, Componente: Missoes },
  { id: 'contas', label: 'Contas', icone: Wallet2, Componente: Contas },
  { id: 'perfil', label: 'Perfil', icone: User, Componente: Perfil },
];

export default function Greena({ onBack }) {
  const [abaAtiva, setAbaAtiva] = useState('dashboard');
  const [refreshKey, setRefreshKey] = useState(0);
  const AbaAtual = ABAS.find((a) => a.id === abaAtiva)?.Componente || Dashboard;
  const { perfil } = usePerfil();
  const { streak, registrarHoje } = useStreak('abertura_diaria');

  useEffect(() => {
    registrarHoje();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const nivelInfo = perfil ? infoDeNivel(perfil.xp_total) : null;
  const avatar = nivelInfo ? avatarDoNivel(nivelInfo.nivel) : null;

  // Força o remount da aba atual, o que refaz o fetch de todos os hooks dela —
  // é o "refresh" real, não só cosmético.
  function handleRefresh() {
    return new Promise((resolve) => {
      setRefreshKey((k) => k + 1);
      setTimeout(resolve, 500);
    });
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(145deg, #8052fe 0%, #241458 100%)',
      paddingBottom: '90px',
      fontFamily: "'Inter', sans-serif",
    }}>
      <div style={{ maxWidth: '450px', margin: '0 auto', padding: '20px 16px 0' }}>
        <header style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '18px',
          backgroundColor: '#FFFFFF',
          padding: '10px 14px',
          borderRadius: '28px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        }}>
          <div
            onClick={onBack}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: '#f3f4f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
              transition: 'background 0.2s',
              zIndex: 1,
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e5e7eb'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
          >
            <ArrowLeft size={20} style={{ color: '#241458' }} />
          </div>

          {/* Logo verdadeiramente centralizada — posição absoluta ignora a
              largura desigual dos elementos dos lados */}
          <div style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            alignItems: 'center',
          }}>
            <img src="/Greena.png" alt="Greena" style={{ height: '62px', width: 'auto' }} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', zIndex: 1 }}>
            {streak?.streak_atual > 0 && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: '3px', backgroundColor: '#fff7e0',
                padding: '6px 9px', borderRadius: '30px', border: '1px solid #fdfc3055',
              }}>
                <Flame size={13} color="#e2b800" />
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#241458' }}>{streak.streak_atual}</span>
              </div>
            )}
            {avatar && (
              <div
                onClick={() => setAbaAtiva('missoes')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#f3f4f6',
                  padding: '6px 12px 6px 8px',
                  borderRadius: '30px',
                  cursor: 'pointer',
                  flexShrink: 0,
                  border: '1px solid #e5e7eb',
                }}
              >
                <span style={{ fontSize: '1.15rem' }}>{avatar.emoji}</span>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  color: '#241458',
                  letterSpacing: '0.2px',
                }}>
                  Nv.{nivelInfo.nivel}
                </span>
              </div>
            )}
          </div>
        </header>

        <PullToRefresh onRefresh={handleRefresh}>
          <main
            key={refreshKey}
            style={{
              backgroundColor: 'rgba(255,255,255,0.92)',
              backdropFilter: 'blur(12px)',
              borderRadius: '28px',
              padding: '20px 16px',
              border: '1px solid rgba(255,255,255,0.30)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
            }}
          >
            <AbaAtual />
          </main>
        </PullToRefresh>
      </div>

      {/* Navbar com fundo opaco para melhor legibilidade */}
      <nav style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(8px)',
        borderTop: '1px solid #e5e7eb',
        display: 'flex',
        justifyContent: 'space-around',
        padding: '8px 2px calc(8px + env(safe-area-inset-bottom))',
        zIndex: 50,
      }}>
        {ABAS.map((aba) => {
          const Icone = aba.icone;
          const ativa = aba.id === abaAtiva;
          return (
            <button
              key={aba.id}
              onClick={() => setAbaAtiva(aba.id)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px 6px',
                color: ativa ? '#8052fe' : '#6b7280',
                transition: 'color 0.2s, transform 0.1s',
                position: 'relative',
                flex: 1,
                maxWidth: '56px',
              }}
              onMouseEnter={(e) => {
                if (!ativa) e.currentTarget.style.color = '#241458';
              }}
              onMouseLeave={(e) => {
                if (!ativa) e.currentTarget.style.color = '#6b7280';
              }}
            >
              {ativa && (
                <div style={{
                  position: 'absolute',
                  top: '-4px',
                  width: '5px',
                  height: '5px',
                  borderRadius: '50%',
                  backgroundColor: '#8052fe',
                }} />
              )}
              <Icone size={20} strokeWidth={ativa ? 2.6 : 2} stroke={ativa ? '#8052fe' : 'currentColor'} />
              <span style={{
                fontSize: '0.55rem',
                fontWeight: ativa ? 800 : 600,
                letterSpacing: '0.1px',
                textTransform: 'uppercase',
                marginTop: '2px',
              }}>
                {aba.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
